// Float Accessories (VESC Express package) support: reads its settings through the same
// read-only request its own app screen uses, "(send-config)", and describes every setting.
// Based on Float Accessories 3.1.2. The package keeps settings in its own storage, not as a VESC config page.

const FA_MAGIC = 102, FA_RUN = 1;
// The only message ever sent to Float Accessories: run its read-only (send-config) function.
const FA_READ = [36, FA_MAGIC, FA_RUN, ...new TextEncoder().encode("(send-config)"), 0];
// Settings that are secrets: BMS unlock keys and counters, Pubmote pairing secret and remote address.
const FA_SECRET = /^(bms-key-.|bms-counter-.|esp-now-secret-code|esp-now-remote-mac-.)$/;

(() => {
const COLOR = ["GRB", "RGB", "GRBW", "RGBW", "WRGB"];
const MODES = ["White/Red", "Battery Meter", "Cyan/Magenta", "Blue/Green", "Yellow/Green", "Rainbow Chase", "Strobe", "Rave", "Mullet", "Knight Rider", "Felony", "Trans Pride"];
const STRIP = ["None", "Custom", "Avaspark Laserbeam", "Avaspark Laserbeam Pint", "JetFleet H4", "JetFleet H4 (no limit DCDC)", "JetFleet GT", "Stock GT", "Avaspark Laserbeam V2", "Avaspark Laserbeam V2 Pint", "Light-shutka Flashfires", "Fungineers GTFO"];
// key: [name, kind, default, extra]   kind: b = on/off, i = number, f = decimal, e = option list (extra = names), p = 0–1 shown as %
const S = {
  "magic": ["Storage marker", "i", null], "crc": ["Settings checksum", "i", 61381], "can-id": ["Controller CAN ID", "i", -1], "accept-tos": ["Terms accepted", "b", 0],
  "led-enabled": ["LEDs enabled", "b", 1], "bms-enabled": ["BMS enabled", "b", 0], "pubmote-enabled": ["Pubmote enabled", "b", 0],
  "led-on": ["Lights on", "b", 1], "led-highbeam-on": ["High beams on", "b", 1],
  "led-mode": ["Riding mode", "e", 0, MODES], "led-mode-idle": ["Idle mode", "e", 5, MODES], "led-mode-status": ["Status bar mode", "e", 0, ["Green→Red voltage, blue sensors, yellow→red duty", "Swap ADC1/ADC2"]],
  "led-mode-startup": ["Startup mode", "e", 9, MODES], "led-mode-button": ["Button light mode", "e", 0, ["Rainbow Chase", "Battery Meter"]], "led-mode-footpad": ["Footpad light mode", "e", 0, ["Rainbow Chase"]],
  "led-mall-grab-enabled": ["Mall grab", "b", 1], "led-brake-light-enabled": ["Brake light", "b", 1], "led-brake-light-min-amps": ["Brake light minimum current", "f", -4, " A"],
  "idle-timeout": ["Idle timeout", "i", 1, " s"], "idle-timeout-shutoff": ["Idle shutoff", "i", 600, " s"],
  "led-brightness": ["Brightness", "p", 0.8], "led-brightness-highbeam": ["High beam brightness", "p", 0.8], "led-brightness-idle": ["Idle brightness", "p", 0.5], "led-brightness-status": ["Status bar brightness", "p", 0.2],
  "led-status-pin": ["Status strip pin", "i", 7], "led-status-num": ["Status strip LED count", "i", 10], "led-status-type": ["Status strip colour order", "e", 0, COLOR], "led-status-reversed": ["Status strip reversed", "b", 1],
  "led-front-pin": ["Front strip pin", "i", 8], "led-front-num": ["Front strip LED count", "i", 11], "led-front-type": ["Front strip colour order", "e", 2, COLOR], "led-front-reversed": ["Front strip reversed", "b", 1], "led-front-strip-type": ["Front strip", "e", 7, STRIP],
  "led-rear-pin": ["Rear strip pin", "i", 9], "led-rear-num": ["Rear strip LED count", "i", 11], "led-rear-type": ["Rear strip colour order", "e", 2, COLOR], "led-rear-reversed": ["Rear strip reversed", "b", 1], "led-rear-strip-type": ["Rear strip", "e", 7, STRIP],
  "led-button-pin": ["Button light pin", "i", -1], "led-button-strip-type": ["Button light", "e", 0, ["None", "NeoPixel RGB"]],
  "led-footpad-pin": ["Footpad light pin", "i", -1], "led-footpad-num": ["Footpad light LED count", "i", 0], "led-footpad-type": ["Footpad light colour order", "e", 0, COLOR], "led-footpad-reversed": ["Footpad light reversed", "b", 0], "led-footpad-strip-type": ["Footpad light", "e", 0, ["None", "Custom"]],
  "esp-now-remote-mac-a": ["Pubmote address (part 1)", "i", -1], "esp-now-remote-mac-b": ["Pubmote address (part 2)", "i", -1], "esp-now-secret-code": ["Pubmote pairing code", "i", -1],
  "bms-rs485-di-pin": ["BMS RS485 DI pin", "i", 16], "bms-rs485-ro-pin": ["BMS RS485 RO/A pin", "i", 8], "bms-rs485-dere-pin": ["BMS RS485 DE/RE pin", "i", 17], "bms-wakeup-pin": ["BMS wake-up pin", "i", -1],
  "bms-override-soc": ["Override battery % with BMS", "b", 0], "bms-rs485-chip": ["RS485 transceiver chip fitted", "b", 1],
  "bms-key-a": ["BMS key A", "i", -1], "bms-key-b": ["BMS key B", "i", -1], "bms-key-c": ["BMS key C", "i", -1], "bms-key-d": ["BMS key D", "i", -1],
  "bms-counter-a": ["BMS counter A", "i", -1], "bms-counter-b": ["BMS counter B", "i", -1], "bms-counter-c": ["BMS counter C", "i", -1], "bms-counter-d": ["BMS counter D", "i", -1],
  "led-loop-delay": ["LED update rate", "i", 20, " Hz"], "bms-loop-delay": ["BMS update rate", "i", 8, " Hz"], "pubmote-loop-delay": ["Pubmote update rate", "i", 8, " Hz"], "can-loop-delay": ["CAN update rate", "i", 2, " Hz"],
  "led-max-blend-count": ["Max blend count", "i", 4], "led-startup-timeout": ["Startup animation time", "i", 20, " s"], "led-dim-on-highbeam-ratio": ["Dim RGB when high beams are on", "p", 0.2],
  "bms-type": ["BMS type", "e", 0, ["None", "Unencrypted", "Encrypted"]], "led-status-strip-type": ["Status strip", "e", 1, ["None", "Custom"]], "bms-charge-only": ["BMS charge only", "b", 0],
  "led-fix": ["LED fix", "i", 100], "led-show-battery-charging": ["Show battery while charging", "b", 1], "led-front-highbeam-pin": ["Front high beam pin", "i", -1], "led-rear-highbeam-pin": ["Rear high beam pin", "i", -1],
  "bms-buff-size": ["BMS buffer size", "i", 128], "led-max-brightness": ["Maximum LED brightness", "p", 0.8], "soc-type": ["Battery % source", "e", 0, ["From the balance package", "Voltage curve"]],
  "cell-type": ["Cell type", "e", 0, ["Linear", "P28A", "P30B", "P42A", "P45B", "P50B", "DG40", "50S", "VTC6"]], "led-update-not-running": ["Freeze front/rear LEDs while riding", "b", 0],
  "log-enabled": ["SD card logging", "b", 0], "log-rate": ["Logging rate", "f", 2, " Hz"], "log-append-gnss": ["Add GPS to logs", "b", 0],
  "humidity-enabled": ["Humidity sensor", "b", 0], "humidity-sda-pin": ["Humidity sensor SDA pin", "i", -1], "humidity-slc-pin": ["Humidity sensor SCL pin", "i", -1],
};
const ORDER = Object.keys(S);
const groups = [
  ["General", ["led-enabled", "bms-enabled", "pubmote-enabled", "can-id", "accept-tos"]],
  ["Light modes", ["led-on", "led-highbeam-on", "led-mode", "led-mode-idle", "led-mode-startup", "led-mode-status", "led-mode-button", "led-mode-footpad", "led-mall-grab-enabled", "led-brake-light-enabled", "led-brake-light-min-amps", "led-show-battery-charging", "idle-timeout", "idle-timeout-shutoff"]],
  ["Brightness", ["led-brightness", "led-brightness-highbeam", "led-brightness-idle", "led-brightness-status", "led-max-brightness", "led-dim-on-highbeam-ratio"]],
  ["Status bar", ["led-status-strip-type", "led-status-pin", "led-status-num", "led-status-type", "led-status-reversed"]],
  ["Front lights", ["led-front-strip-type", "led-front-pin", "led-front-num", "led-front-type", "led-front-reversed", "led-front-highbeam-pin"]],
  ["Rear lights", ["led-rear-strip-type", "led-rear-pin", "led-rear-num", "led-rear-type", "led-rear-reversed", "led-rear-highbeam-pin"]],
  ["Button and footpad lights", ["led-button-strip-type", "led-button-pin", "led-footpad-strip-type", "led-footpad-pin", "led-footpad-num", "led-footpad-type", "led-footpad-reversed"]],
  ["LED advanced", ["led-loop-delay", "led-max-blend-count", "led-startup-timeout", "led-fix", "led-update-not-running"]],
  ["BMS", ["bms-type", "bms-charge-only", "bms-override-soc", "soc-type", "cell-type", "bms-rs485-chip", "bms-rs485-di-pin", "bms-rs485-ro-pin", "bms-rs485-dere-pin", "bms-wakeup-pin", "bms-loop-delay", "bms-buff-size",
    "bms-key-a", "bms-key-b", "bms-key-c", "bms-key-d", "bms-counter-a", "bms-counter-b", "bms-counter-c", "bms-counter-d"]],
  ["Pubmote", ["pubmote-paired", "pubmote-loop-delay", "esp-now-remote-mac-a", "esp-now-remote-mac-b", "esp-now-secret-code"]],
  ["Logging", ["log-enabled", "log-rate", "log-append-gnss"]],
  ["Humidity sensor", ["humidity-enabled", "humidity-sda-pin", "humidity-slc-pin"]],
  ["Advanced", ["can-loop-delay"]],
  ["Internal", ["magic", "crc"]],
];
const p = {};
for (const [k, [n, kind, def, extra]] of Object.entries(S)) {
  const e = { n };
  if (def != null) e.def = String(kind === "b" ? (def ? 1 : 0) : def);
  if (kind === "e") e.o = extra;
  if (kind === "p") e.pct = 1;
  if (typeof extra === "string") e.s = extra;
  if (kind === "f" || kind === "p") e.dec = 2;
  p[k] = e;
}
p["pubmote-paired"] = { n: "Pubmote paired" };
window.FA_DEF = { p, g: groups.map(([n, keys]) => ({ n, subs: [{ n, p: keys }] })) };

// Turn the "settings ..." reply into setting values. Secrets are replaced with "(hidden)".
window.faParseSettings = text => {
  const tok = text.replace(/\0+$/, "").trim().split(/\s+/);
  if (tok[0] !== "settings") throw new Error("not a Float Accessories settings reply");
  const values = {};
  ORDER.forEach((k, i) => {
    if (i + 1 >= tok.length) return;
    const [n, kind, , extra] = S[k], num = Number(tok[i + 1]);
    if (FA_SECRET.test(k)) { values[k] = { name: n, value: "(hidden)", hidden: true }; return; }
    if (kind === "b") values[k] = { name: n, value: !!num };
    else if (kind === "e") values[k] = { name: n, value: num, option: extra[num] ?? String(num) };
    else values[k] = { name: n, value: num };
  });
  // Pairing status is useful to know even though the address itself is hidden.
  const mac = Number(tok[ORDER.indexOf("esp-now-remote-mac-a") + 1]);
  values["pubmote-paired"] = { name: "Pubmote paired", value: mac !== -1 };
  return values;
};

// ---- Beginner notes ----
const SECRET = "A secret. Never saved by this app: it shows as hidden.";
const pin = what => ({ w: `The VESC Express pin the ${what} is wired to. -1 means not connected.`, t: "Must match your wiring. Presets for common light kits usually set it." });
const num = what => ({ w: `How many LEDs are on the ${what}.`, t: "Must match your strip, or the pattern looks wrong." });
const order = what => ({ w: `The colour order the ${what} expects (GRB, RGB and so on). It depends on the LED chip.`, t: "If colours look wrong, red showing as green for example, try another order." });
const rev = what => ({ w: `Flips the direction of the ${what}.`, t: "Use it if animations or the battery bar run the wrong way." });
const strip = what => ({ w: `Which ${what} you have. Picking a known product sets its LED count and wiring for you.`, t: "Pick Custom only for your own strips." });
const rate = what => ({ w: `How many times per second Float Accessories updates the ${what}.`, t: "Leave at default unless you're troubleshooting." });
window.GUIDE_SCOPED = window.GUIDE_SCOPED || {};
window.GUIDE_SCOPED["Float Accessories"] = {
  "magic": { w: "An internal marker Float Accessories uses to check its stored settings are valid.", t: "Not a setting you change." },
  "crc": { w: "An internal checksum of the stored settings.", t: "Not a setting you change." },
  "can-id": { w: "The CAN ID of the motor controller Float Accessories talks to. -1 means it finds the controller automatically.", t: "Leave at -1 unless you have more than one controller." },
  "accept-tos": { w: "Whether the package's terms of use have been accepted in its app screen.", t: "" },
  "led-enabled": { w: "Turns the lighting features on.", t: "Changes need a reboot." },
  "bms-enabled": { w: "Turns on reading a battery management system (BMS), for example a stock Onewheel BMS.", t: "Changes need a reboot." },
  "pubmote-enabled": { w: "Turns on the Pubmote wireless remote receiver.", t: "Changes need a reboot." },
  "led-on": { w: "Whether the lights are on.", t: "Can also be toggled from the app or a remote." },
  "led-highbeam-on": { w: "Whether the high beams are on.", t: "" },
  "led-mode": { w: "The light pattern used while riding.", t: "" },
  "led-mode-idle": { w: "The light pattern used when the board is on but not being ridden.", t: "" },
  "led-mode-startup": { w: "The light pattern shown when the board powers up.", t: "" },
  "led-mode-status": { w: "What the status bar shows: battery voltage, foot sensors and duty cycle.", t: "Swap ADC1/ADC2 if the foot sensor sides show the wrong way round." },
  "led-mode-button": { w: "The pattern for a light-up power button, if you have one.", t: "" },
  "led-mode-footpad": { w: "The pattern for footpad lights, if you have them.", t: "" },
  "led-mall-grab-enabled": { w: "Mall grab: lift and hold the board by the nose to switch the lights. A short press turns the lights on or off; a long press toggles the high beams.", t: "" },
  "led-brake-light-enabled": { w: "Brightens the rear lights when you brake.", t: "" },
  "led-brake-light-min-amps": { w: "How much braking current (negative amps) is needed to trigger the brake light.", t: "Closer to 0 triggers it on lighter braking." },
  "led-show-battery-charging": { w: "Shows the battery level on the lights while charging.", t: "" },
  "idle-timeout": { w: "Seconds after stopping before the lights switch to the idle pattern.", t: "" },
  "idle-timeout-shutoff": { w: "Seconds of idling before the lights turn off.", t: "Saves battery if you leave the board on." },
  "led-brightness": { w: "Brightness of the lights while riding.", t: "" },
  "led-brightness-highbeam": { w: "Brightness of the high beams.", t: "" },
  "led-brightness-idle": { w: "Brightness while idle.", t: "" },
  "led-brightness-status": { w: "Brightness of the status bar.", t: "Lower is easier on the eyes at night." },
  "led-max-brightness": { w: "A cap on overall LED brightness.", t: "80% by default, to limit heat and power draw." },
  "led-dim-on-highbeam-ratio": { w: "How much the coloured LEDs dim when the high beams are on, as a share of the main brightness.", t: "" },
  "led-status-strip-type": strip("status bar strip"), "led-status-pin": pin("status bar strip"), "led-status-num": num("status bar strip"), "led-status-type": order("status bar strip"), "led-status-reversed": rev("status bar"),
  "led-front-strip-type": strip("front light strip"), "led-front-pin": pin("front light strip"), "led-front-num": num("front light strip"), "led-front-type": order("front light strip"), "led-front-reversed": rev("front strip"),
  "led-front-highbeam-pin": pin("front high beam"),
  "led-rear-strip-type": strip("rear light strip"), "led-rear-pin": pin("rear light strip"), "led-rear-num": num("rear light strip"), "led-rear-type": order("rear light strip"), "led-rear-reversed": rev("rear strip"),
  "led-rear-highbeam-pin": pin("rear high beam"),
  "led-button-strip-type": { w: "Whether you have a light-up power button and what kind.", t: "" }, "led-button-pin": pin("button light"),
  "led-footpad-strip-type": { w: "Whether you have footpad lights.", t: "" }, "led-footpad-pin": pin("footpad lights"), "led-footpad-num": num("footpad lights"), "led-footpad-type": order("footpad lights"), "led-footpad-reversed": rev("footpad lights"),
  "led-loop-delay": rate("lights"), "bms-loop-delay": rate("BMS readings"), "pubmote-loop-delay": rate("Pubmote remote link"), "can-loop-delay": rate("CAN messages to the controller"),
  "led-max-blend-count": { w: "How many steps the lights use to blend between patterns.", t: "Leave at default." },
  "led-startup-timeout": { w: "How long the startup animation plays, in seconds.", t: "" },
  "led-fix": { w: "A compatibility adjustment for some LED hardware.", t: "Leave at default unless a guide for your lights says otherwise." },
  "led-update-not-running": { w: "Stops updating the front and rear strips (fixed white/red) while riding, to prevent flicker on boards prone to electrical interference.", t: "Turn on if your lights flicker at speed." },
  "bms-type": { w: "What kind of BMS is connected: none, unencrypted, or encrypted (stock Onewheel BMSs).", t: "" },
  "bms-charge-only": { w: "Uses the BMS only while charging.", t: "" },
  "bms-override-soc": { w: "Uses the BMS's battery percentage instead of the estimate.", t: "" },
  "soc-type": { w: "Where the battery percentage comes from: the balance package (Refloat/Float), or a voltage curve for your cell type.", t: "The voltage curve is more accurate if Cell type is set correctly." },
  "cell-type": { w: "Your battery cell model, used for the voltage-curve battery percentage.", t: "Pick your exact cells, for example P42A or P50B. Linear works for anything but is less accurate." },
  "bms-rs485-chip": { w: "Whether an RS485 transceiver chip sits between the VESC Express and the BMS.", t: "Depends on your wiring module." },
  "bms-rs485-di-pin": pin("BMS RS485 DI (data in) line"), "bms-rs485-ro-pin": pin("BMS RS485 RO/A (data out) line"), "bms-rs485-dere-pin": pin("BMS RS485 DE/RE (direction) line"), "bms-wakeup-pin": pin("BMS wake-up line"),
  "bms-buff-size": { w: "Size of the buffer for BMS messages.", t: "Leave at default." },
  "bms-key-a": { w: "Part of the key used to talk to an encrypted stock BMS.", t: SECRET }, "bms-key-b": { w: "Part of the key used to talk to an encrypted stock BMS.", t: SECRET },
  "bms-key-c": { w: "Part of the key used to talk to an encrypted stock BMS.", t: SECRET }, "bms-key-d": { w: "Part of the key used to talk to an encrypted stock BMS.", t: SECRET },
  "bms-counter-a": { w: "Part of the encryption state for an encrypted stock BMS.", t: SECRET }, "bms-counter-b": { w: "Part of the encryption state for an encrypted stock BMS.", t: SECRET },
  "bms-counter-c": { w: "Part of the encryption state for an encrypted stock BMS.", t: SECRET }, "bms-counter-d": { w: "Part of the encryption state for an encrypted stock BMS.", t: SECRET },
  "pubmote-paired": { w: "Whether a Pubmote remote is paired with this board.", t: "Worked out from the stored remote address, which itself stays hidden." },
  "esp-now-remote-mac-a": { w: "Part of the paired Pubmote's address.", t: SECRET }, "esp-now-remote-mac-b": { w: "Part of the paired Pubmote's address.", t: SECRET },
  "esp-now-secret-code": { w: "The code that secures the link with the paired Pubmote.", t: SECRET },
  "log-enabled": { w: "Logs ride data to an SD card in the VESC Express, if it has one.", t: "Changes need a reboot." },
  "log-rate": { w: "How many times per second the SD card log records data.", t: "Higher gives more detail but bigger files." },
  "log-append-gnss": { w: "Adds GPS position to the SD card logs, if a GPS is fitted.", t: "" },
  "humidity-enabled": { w: "Turns on a humidity sensor, used to warn about moisture inside the board.", t: "" },
  "humidity-sda-pin": pin("humidity sensor's SDA (data) line"), "humidity-slc-pin": pin("humidity sensor's SCL (clock) line"),
};
Object.assign(window.GUIDE_SECTIONS || {}, {
  "Float Accessories/General": "Float Accessories runs on the VESC Express and adds lights, BMS support and the Pubmote remote. These switch each feature on.",
  "Float Accessories/BMS": "Reading the battery management system. Keys and counters for encrypted stock BMSs are secrets and stay hidden.",
  "Float Accessories/Pubmote": "The Pubmote wireless remote. The pairing address and code are secrets and stay hidden.",
  "Float Accessories/Internal": "Internal values used by the package itself.",
});
})();
