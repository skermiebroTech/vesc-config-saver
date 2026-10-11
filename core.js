// VESC protocol + config decoding (no DOM). Shared by the page and tests.
const COMM = { FW_VERSION: 0, GET_MCCONF: 14, GET_APPCONF: 17, GET_CUSTOM_CONFIG_XML: 92, GET_CUSTOM_CONFIG: 93, FORWARD_CAN: 34, PING_CAN: 62 };

function crc16(buf) {
  let crc = 0;
  for (const b of buf) {
    crc ^= b << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc;
}

function packPacket(payload) {
  const n = payload.length;
  const head = n <= 255 ? [2, n] : n <= 65535 ? [3, n >> 8, n & 0xff] : [4, n >> 16, (n >> 8) & 0xff, n & 0xff];
  const c = crc16(payload);
  return Uint8Array.from([...head, ...payload, c >> 8, c & 0xff, 3]);
}

// Streaming decoder: feed bytes, get complete payloads via callback.
class PacketReader {
  constructor(onPacket) { this.buf = []; this.onPacket = onPacket; }
  push(bytes) {
    for (const b of bytes) this.buf.push(b);
    for (;;) {
      while (this.buf.length && ![2, 3, 4].includes(this.buf[0])) this.buf.shift();
      const t = this.buf[0];
      if (t === undefined) return;
      const hl = t; // header length: 2, 3 or 4 bytes
      if (this.buf.length < hl) return;
      let len = 0;
      for (let i = 1; i < hl; i++) len = (len << 8) | this.buf[i];
      const total = hl + len + 3;
      if (len === 0 || len > 1 << 20) { this.buf.shift(); continue; }
      if (this.buf.length < total) return;
      const payload = Uint8Array.from(this.buf.slice(hl, hl + len));
      const crc = (this.buf[hl + len] << 8) | this.buf[hl + len + 1];
      if (this.buf[total - 1] !== 3 || crc16(payload) !== crc) { this.buf.shift(); continue; }
      this.buf.splice(0, total);
      this.onPacket(payload);
    }
  }
}

class Reader {
  constructor(bytes, pos = 0) { this.b = bytes; this.p = pos; this.v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength); }
  left() { return this.b.length - this.p; }
  u8() { return this.v.getUint8(this.p++); }
  i8() { return this.v.getInt8(this.p++); }
  u16() { const x = this.v.getUint16(this.p); this.p += 2; return x; }
  i16() { const x = this.v.getInt16(this.p); this.p += 2; return x; }
  u32() { const x = this.v.getUint32(this.p); this.p += 4; return x; }
  i32() { const x = this.v.getInt32(this.p); this.p += 4; return x; }
  f32auto() {
    const r = this.u32();
    let e = (r >>> 23) & 0xff; const fr = r & 0x7fffff; const neg = r >>> 31;
    let f = 0;
    if (e !== 0 || fr !== 0) { f = fr / (8388608 * 2) + 0.5; e -= 126; }
    if (neg) f = -f;
    return Math.fround(f * Math.pow(2, e));
  }
  str() { let s = []; while (this.p < this.b.length) { const c = this.u8(); if (!c) break; s.push(c); } return new TextDecoder().decode(Uint8Array.from(s)); }
}

// CFG types: 1 double, 2 int, 3 string, 4 enum, 5 bool, 6 bitfield.
// TX types: 1 u8, 2 i8, 3 u16, 4 i16, 5 u32, 6 i32, 7 double16, 8 double32, 9 double32_auto.
function readParam(r, [, type, vTx, scale]) {
  switch (type) {
    case 1:
      if (vTx === 7) return r.i16() / scale;
      if (vTx === 8) return r.i32() / scale;
      if (vTx === 9) return r.f32auto();
      throw new Error("bad double tx " + vTx);
    case 2: case 6:
      if (vTx === 1 || type === 6) return r.u8();
      return [, , r.i8, r.u16, r.i16, r.u32, r.i32][vTx].call(r);
    case 3: return r.str();
    case 4: case 5: return r.i8();
  }
  throw new Error("bad type " + type);
}

// defs: {p: {name: [longName, type, vTx, scale, enumNames]}, o: [serOrder]}
function decodeConfig(bytes, defs) {
  const r = new Reader(bytes);
  const signature = r.u32();
  const values = {};
  for (const name of defs.o) {
    const d = defs.p[name];
    const v = readParam(r, d);
    const out = { name: d[0], value: d[1] === 5 ? !!v : v };
    if (d[1] === 4 && d[4][v] !== undefined) out.option = d[4][v];
    values[name] = out;
  }
  return { signature, values, bytesLeft: r.left() };
}

// Parse a VESC Tool ConfigParams XML string into defs (uses a DOMParser instance).
function defsFromXml(xmlText, parser) {
  const doc = parser.parseFromString(xmlText, "text/xml");
  const txt = (el, t) => { const x = el.getElementsByTagName(t)[0]; return x ? x.textContent : null; };
  const p = {};
  const params = doc.getElementsByTagName("Params")[0];
  for (const el of Array.from(params.children)) {
    p[el.tagName] = [txt(el, "longName"), +(txt(el, "type") || 0), +(txt(el, "vTx") || 0), +(txt(el, "vTxDoubleScale") || 1),
      Array.from(el.getElementsByTagName("enumNames")).map(e => e.textContent)];
  }
  const o = Array.from(doc.getElementsByTagName("SerOrder")[0].getElementsByTagName("ser")).map(e => e.textContent);
  return { p, o };
}

// Build decoder definitions from a desc/<version>.json section (generated from VESC Tool's parameter files).
function defsFromDesc(sec) {
  const p = {};
  for (const name of sec.ser) { const e = sec.p[name]; p[name] = [e.n, e.t, e.x, e.k || 1, e.o || []]; }
  return { p, o: sec.ser };
}

// Firmware version as VESC Tool names its parameter folders, e.g. 6.05.
const fwVersion = fw => `${fw.major}.${String(fw.minor).padStart(2, "0")}`;

// Load the parameter definitions for a firmware version, or null if there are none.
async function loadDesc(ver) {
  try { const r = await fetch(`desc/${ver}.json`); return r.ok ? await r.json() : null; } catch (e) { return null; }
}

// qCompress format: 4-byte big-endian length + zlib stream.
async function qUncompress(bytes) {
  const ds = new DecompressionStream("deflate");
  const out = new Response(new Blob([bytes.slice(4)]).stream().pipeThrough(ds));
  return new Uint8Array(await out.arrayBuffer());
}

const b64 = u8 => { let s = ""; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000)); return btoa(s); };

if (typeof module !== "undefined") module.exports = { defsFromDesc, fwVersion, COMM, crc16, packPacket, PacketReader, Reader, decodeConfig, defsFromXml, qUncompress, b64 };
