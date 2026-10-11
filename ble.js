// Bluetooth link to a VESC board (Nordic UART service), shared by the saver and the logger.
// Requests can be forwarded over CAN to a device behind a bridge such as a VESC Express.
// Needs core.js (COMM, packPacket, PacketReader, Reader, fwVersion).

const NUS = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const NUS_RX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"; // we write here
const NUS_TX = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"; // the board notifies here

class VescLink {
  constructor() {
    this.target = null; // CAN ID to forward requests to, or null for the connected device
    this.waiters = [];
    this.reader = new PacketReader(p => {
      const i = this.waiters.findIndex(w => w.match(p));
      if (i >= 0) this.waiters.splice(i, 1)[0].resolve(p);
    });
  }

  async connect() {
    const dev = await navigator.bluetooth.requestDevice({ filters: [{ services: [NUS] }], optionalServices: [NUS] });
    this.device = dev;
    const svc = await (await dev.gatt.connect()).getPrimaryService(NUS);
    this.rx = await svc.getCharacteristic(NUS_RX);
    const tx = await svc.getCharacteristic(NUS_TX);
    tx.addEventListener("characteristicvaluechanged", e => this.reader.push(new Uint8Array(e.target.value.buffer)));
    await tx.startNotifications();
    return dev;
  }

  async disconnect() { try { await this.device?.gatt.disconnect(); } catch (e) {} }

  async send(payload) {
    if (this.target !== null && payload[0] !== COMM.PING_CAN) payload = [COMM.FORWARD_CAN, this.target, ...payload];
    const pkt = packPacket(Uint8Array.from(payload));
    for (let i = 0; i < pkt.length; i += 20) {
      const chunk = pkt.slice(i, i + 20);
      await this.rx.writeValueWithoutResponse(chunk).catch(() => this.rx.writeValue(chunk));
    }
  }

  // Send a request and wait for the reply. By default the reply is the packet with the same command byte.
  async request(payload, { timeout = 3000, tries = 3, match } = {}) {
    match = match || (p => p[0] === payload[0]);
    for (let t = 0; t < tries; t++) {
      const got = await new Promise(res => {
        const w = { match, resolve: res };
        this.waiters.push(w);
        setTimeout(() => { const i = this.waiters.indexOf(w); if (i >= 0) { this.waiters.splice(i, 1); res(null); } }, timeout);
        this.send(payload);
      });
      if (got) return got;
    }
    throw new Error("No reply to command " + payload[0]);
  }

  async readFw() {
    const fw = new Reader(await this.request([COMM.FW_VERSION]), 1);
    const info = { major: fw.i8(), minor: fw.i8(), hw: fw.str() };
    if (fw.left() >= 12) { info.uuid = Array.from(fw.b.slice(fw.p, fw.p + 12), b => b.toString(16).padStart(2, "0")).join(""); fw.p += 12; }
    if (fw.left() >= 2) { fw.u8(); fw.u8(); }
    info.hwType = fw.left() >= 1 ? fw.u8() : 0;
    info.customConfigs = fw.left() >= 1 ? fw.u8() : 0;
    return info;
  }

  // Find the connected device and everything on its CAN bus, and point requests at the motor controller.
  async discover(log = () => {}) {
    this.target = null;
    const local = await this.readFw();
    log(`Connected to ${local.hw} (firmware ${fwVersion(local)})`);
    const devices = [{ canId: null, info: local }];
    let ids = [];
    try { ids = Array.from((await this.request([COMM.PING_CAN], { timeout: 6000, tries: 2 })).slice(1)); }
    catch (e) { log("No reply to the CAN scan. Using only the connected device."); }
    if (ids.length) log("CAN devices found: " + ids.join(", "));
    for (const id of ids) {
      this.target = id;
      try { const f = await this.readFw(); f.canId = id; devices.push({ canId: id, info: f }); log(`CAN ${id}: ${f.hw}, firmware ${fwVersion(f)}, ${f.customConfigs} config page(s)`); }
      catch (e) { log(`CAN ${id}: no reply`); }
    }
    const ctrl = devices.find(d => d.info.hwType === 0);
    if (!ctrl) throw new Error("No motor controller found");
    this.target = ctrl.canId;
    return { local, devices, ctrl };
  }
}
