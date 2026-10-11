// Shared by the config viewer and the compare page: turns a VESC Config Saver file into
// readable tabs of settings, and formats values. Needs core.js and guide.js.

const UNUSED = new Set(["Motor/BLDC", "Motor/DC", "Motor/GPD", "Motor/PID Controllers", "App/PPM", "App/ADC", "App/NRF", "App/PAS", "App/VESC Remote", "Refloat/Internal"]);

async function prepareConfig(cfg) {
  if (!cfg || !cfg.firmware) throw new Error("missing firmware info");
  const fw = cfg.firmware, ver = fwVersion(fw);
  const desc = await loadDesc(ver);
  const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  // Files can carry raw data without readable values (for example firmware the saver had no list for). Decode them here.
  for (const key of ["mcconf", "appconf"]) {
    const sec = cfg[key];
    if (sec && !sec.values && sec.raw && desc) { try { sec.values = decodeConfig(unb64(sec.raw), defsFromDesc(desc[key])).values; } catch (e) {} }
  }
  for (const pkg of cfg.packages || []) {
    if (pkg.values || !pkg.raw || !pkg.definitionCompressed) continue;
    try {
      const pdefs = defsFromXml(new TextDecoder().decode(await qUncompress(unb64(pkg.definitionCompressed))), new DOMParser());
      pkg.values = decodeConfig(unb64(pkg.raw), pdefs).values;
      pkg.name = pkg.name || pdefs.p.hw_name?.[0];
    } catch (e) {}
  }
  const tabs = [];
  for (const pkg of cfg.packages || []) {
    if (!pkg.values) continue;
    let def = null;
    try { def = await packageDefs(pkg.definitionCompressed); } catch (e) {}
    const name = (pkg.name || "Package").replace(/ Cfg$/, "");
    // Section notes: Refloat's apply to Refloat and the Float family it grew from.
    const kind = /express/i.test(pkg.device?.hw || "") && pkg.index === 0 ? "Express" : /refloat|^float$|^float /i.test(name) ? "Refloat" : name;
    const onOther = pkg.device && pkg.device.hwType !== 0;
    const sameName = pkg.device && pkg.device.hw.toLowerCase().startsWith(name.toLowerCase());
    tabs.push({ id: kind, pkg: true, other: onOther, label: onOther && !sameName ? `${name} · ${pkg.device.hw}` : name, values: pkg.values, def, note: pkg.rawOmitted });
  }
  // Packages on the motor controller first, then Motor and App, then other devices (such as a VESC Express).
  const others = tabs.filter(t => t.other); tabs.splice(0, tabs.length, ...tabs.filter(t => !t.other));
  if (cfg.mcconf?.values) tabs.push({ id: "Motor", label: "Motor", values: cfg.mcconf.values, def: desc?.mcconf });
  if (cfg.appconf?.values) tabs.push({ id: "App", label: "App", values: cfg.appconf.values, def: desc?.appconf });
  tabs.push(...others);
  if (!tabs.length) throw new Error("no decoded settings in this file");
  return { tabs, desc, ver };
}

// Package definitions travel inside the saved file (qCompress: 4-byte length + zlib).
async function packageDefs(b64) {
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const xml = await new Response(new Blob([bytes.slice(4)]).stream().pipeThrough(new DecompressionStream("deflate"))).text();
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const txt = (n, t) => n.getElementsByTagName(t)[0]?.textContent ?? null;
  const p = {};
  for (const n of doc.getElementsByTagName("Params")[0].children) {
    const e = { n: txt(n, "longName"), d: htmlToText(txt(n, "description")) };
    const s = txt(n, "suffix"); if (s) e.s = s;
    const sc = +txt(n, "editorScale"); if (sc && sc !== 1) e.sc = sc;
    if (txt(n, "editAsPercentage") === "1") e.pct = 1;
    const dec = txt(n, "editorDecimalsDouble"); if (dec) e.dec = +dec;
    const en = Array.from(n.getElementsByTagName("enumNames"), x => x.textContent); if (en.length) e.o = en;
    const dv = txt(n, "valDouble") ?? txt(n, "valInt") ?? txt(n, "valString"); if (dv != null) e.def = dv;
    p[n.tagName] = e;
  }
  const g = Array.from(doc.getElementsByTagName("Grouping")[0].children).map(gr => ({
    n: txt(gr, "groupName"),
    subs: Array.from(gr.getElementsByTagName("subgroup")).map(sg => ({ n: txt(sg, "subgroupName"), p: Array.from(sg.getElementsByTagName("param")).map(x => x.textContent) }))
  }));
  return { p, g };
}
function htmlToText(h) {
  if (!h) return "";
  const d = new DOMParser().parseFromString(h, "text/html");
  const ps = d.querySelectorAll("p, li");
  return (ps.length ? Array.from(ps, x => x.textContent.trim()).join("\n") : d.body.textContent).replace(/\n{3,}/g, "\n\n").trim();
}

// ---- Values ----
function fmt(v, d) {
  if (typeof v.value === "boolean") return v.value ? "On" : "Off";
  if (v.option) return pretty(v.option);
  if (typeof v.value !== "number") return String(v.value);
  let x = v.value, suf = d?.s || "";
  if (d?.sc) x *= d.sc;
  if (d?.pct) { x *= 100; if (!suf.includes("%")) suf = " %"; }
  const dec = d?.dec ?? (Number.isInteger(x) ? 0 : 3);
  return (+x.toFixed(Math.min(dec, 6))).toLocaleString(undefined, { maximumFractionDigits: dec }) + suf;
}
function pretty(o) { return o.replace(/^FOC_OBSERVER_|^FOC_CC_DECOUPLING_|^BATTERY_TYPE_|^FOC_SENSOR_MODE_/, "").replace(/_/g, " "); }
function isChanged(v, d) {
  if (!d || d.def == null || v.hidden) return false;
  const def = d.def;
  if (typeof v.value === "boolean") return v.value !== (def === "1" || def === "true");
  if (typeof v.value === "number") { const n = +def; if (isNaN(n)) return false; return Math.abs(v.value - n) > Math.max(1e-6, Math.abs(n) * 1e-4); }
  return String(v.value) !== def;
}
function fmtDefault(v, d) {
  if (typeof v.value === "boolean") return (d.def === "1" || d.def === "true") ? "On" : "Off";
  if (v.option !== undefined && d.o) return pretty(d.o[+d.def] ?? d.def);
  if (typeof v.value === "number" && !isNaN(+d.def)) return fmt({ value: +d.def }, d);
  return d.def;
}


// Sections of a tab. Packages put everything under one "General" group; each of its subgroups becomes a section.
function tabGroups(tab) {
  let groups = tab.def?.g?.length ? tab.def.g : [{ n: "All settings", subs: [{ n: "", p: Object.keys(tab.values) }] }];
  if (tab.pkg) groups = groups.flatMap(gr => gr.n === "General" ? gr.subs.map(s => ({ n: s.n, subs: [s] })) : [gr]);
  return groups;
}
