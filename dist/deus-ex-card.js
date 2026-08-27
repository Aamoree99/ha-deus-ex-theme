/*! deus-ex-card — https://github.com/Aamoree99/ha-deus-ex-theme  (MIT)
 *  A HUD stat card for Lovelace: lacquered wood, brass кант, rivet, HUD bracket,
 *  eyebrow → value → footer(status dot · text · right-aligned meta).
 *  Pairs with the Deus Ex theme (reads its --dx-* vars, falls back to literals).
 */
const VERSION = "1.1.0";

const FALLBACK = `
:host{
  --dx-wood-1:#1a140b; --dx-wood-2:#130d07; --dx-wood-3:#0c0805;
  --dx-brass-lit:#EAD196; --dx-brass:#C79238; --dx-brass-deep:#6f4f22;
  --dx-gold:#D4A93A; --dx-gold-hot:#F2C14E;
  --dx-value:#F2E4C4; --dx-label:#9A7B44; --dx-alert:#C24E2C;
  --dx-font-display:'Chakra Petch','Rajdhani',var(--primary-font-family,system-ui),sans-serif;
  --dx-font-mono:'JetBrains Mono',ui-monospace,SFMono-Regular,monospace;
}`;

const STYLE = `
${FALLBACK}
:host{ display:block; }
*{ box-sizing:border-box; }

.dx{
  position:relative;
  padding:.9rem 1rem 1rem;
  font-family:var(--dx-font-display);
  color:var(--dx-value);
  border-radius:2px;
  cursor:pointer;
  -webkit-tap-highlight-color:transparent;
  background:
    repeating-linear-gradient(178deg,
      rgba(255,224,180,.015) 0 3px, rgba(0,0,0,0) 3px 11px,
      rgba(0,0,0,.03) 11px 13px, rgba(0,0,0,0) 13px 26px),
    radial-gradient(150% 100% at 22% -20%, rgba(255,214,150,.07), rgba(255,214,150,0) 58%),
    linear-gradient(180deg, var(--dx-wood-1) 0%, var(--dx-wood-2) 48%, var(--dx-wood-3) 100%);
  box-shadow:
    0 1px 0 rgba(255,228,175,.06) inset,
    0 -16px 26px rgba(0,0,0,.3) inset,
    0 7px 16px rgba(0,0,0,.5),
    0 1px 2px rgba(0,0,0,.6);
  clip-path:polygon(0 11px, 11px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
  transition:box-shadow .18s ease, transform .18s ease;
}
.dx::before{ /* brass hairline, follows the cut corners */
  content:""; position:absolute; inset:0; padding:1px; border-radius:2px;
  clip-path:polygon(0 11px, 11px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
  background:linear-gradient(138deg, var(--dx-brass-lit) 0%, var(--dx-brass) 34%, var(--dx-brass-deep) 78%, #402d14 100%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
  pointer-events:none;
}
.dx::after{ /* заклёпка on the notch */
  content:""; position:absolute; top:5px; left:5px; width:7px; height:7px; border-radius:50%;
  background:radial-gradient(circle at 34% 30%, #F8E6B4 0%, #CE9E46 46%, #835c2c 78%, #4a361c 100%);
  box-shadow:0 1px 1px rgba(0,0,0,.65), 0 0 0 1px rgba(0,0,0,.4);
  pointer-events:none;
}
.dx:hover{
  transform:translateY(-1px);
  box-shadow:
    0 1px 0 rgba(255,228,175,.1) inset, 0 -16px 26px rgba(0,0,0,.28) inset,
    0 12px 24px rgba(0,0,0,.55), 0 0 0 1px rgba(234,209,150,.16);
}
.dx:focus-visible{ outline:2px solid var(--dx-gold); outline-offset:3px; }
.bracket{
  position:absolute; left:6px; bottom:6px; width:12px; height:12px;
  border-left:1px solid var(--dx-gold); border-bottom:1px solid var(--dx-gold);
  opacity:.55; pointer-events:none;
}
@media (prefers-reduced-motion:reduce){ .dx{ transition:none; } .dx:hover{ transform:none; } }

.eyebrow{
  font-family:var(--dx-font-mono); font-weight:500; font-size:.6rem;
  letter-spacing:.2em; text-transform:uppercase; color:var(--dx-label);
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.val{
  font-weight:700; font-size:2rem; line-height:1.05; letter-spacing:.01em;
  color:var(--dx-value); margin:.32rem 0 .68rem;
  font-variant-numeric:tabular-nums;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.val .u{ font-size:.5em; color:var(--dx-label); margin-left:.15em; }
.val.sm{ font-size:1.4rem; }
.foot{
  display:flex; align-items:center; gap:.45rem;
  padding-top:.5rem; border-top:1px solid rgba(199,146,56,.16);
  font-family:var(--dx-font-mono); font-size:.62rem; letter-spacing:.02em; color:var(--dx-label);
  min-height:1.4em;
}
.foot .dot{
  width:6px; height:6px; border-radius:50%; flex:none;
  background:var(--dx-gold); box-shadow:0 0 6px rgba(212,169,58,.7);
}
.foot .dot.off{ background:#4a3a1c; box-shadow:none; }
.foot .dot.alert{ background:var(--dx-alert); box-shadow:0 0 6px var(--dx-alert); }
.foot .txt{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.foot .meta{ margin-left:auto; color:var(--dx-label); opacity:.75; white-space:nowrap; }
.foot.empty{ display:none; }
`;

// entities considered "active" for the status dot
const ACTIVE = new Set(["on", "home", "open", "playing", "heat", "cool", "auto", "cleaning", "true"]);
const INACTIVE = new Set(["off", "not_home", "closed", "idle", "unavailable", "unknown", "false", "standby", "docked"]);

class DeusExCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = null;
    this._root = this.attachShadow({ mode: "open" });
    this._built = false;
    this._tpl = {};          // key -> rendered template result
    this._tplUnsub = {};     // key -> unsubscribe promise
  }

  setConfig(config) {
    if (!config) throw new Error("deus-ex-card: missing config");
    this._config = {
      entity: config.entity,
      label: config.label,          // eyebrow: string | entity_id | {{ template }} | undefined(→ friendly name)
      value: config.value,          // override: string | entity_id | {{ template }} | undefined(→ entity state)
      attribute: config.attribute,  // read this attribute of `entity` instead of state
      footer: config.footer,        // string | entity_id | {{ template }}
      meta: config.meta,            // string | entity_id | {{ template }}
      status: config.status,        // entity_id whose on/off drives the dot; default = entity
      tap_action: config.tap_action || { action: "more-info" },
      hold_action: config.hold_action || { action: "more-info" },
      double_tap_action: config.double_tap_action || { action: "none" },
      ...config,
    };
    this._built = false;
    this._tpl = {};
    this._resubscribe();
    this._render();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) this._resubscribe();
    this._render();
  }

  connectedCallback() { this._resubscribe(); }
  disconnectedCallback() { this._unsubscribeAll(); }

  // -- templates --------------------------------------------------------

  static _isTemplate(v) {
    return typeof v === "string" && (v.includes("{{") || v.includes("{%"));
  }

  _resubscribe() {
    if (!this._hass || !this._config || !this._hass.connection) return;
    const keys = ["label", "value", "footer", "meta"];
    for (const k of keys) {
      const v = this._config[k];
      const want = DeusExCard._isTemplate(v);
      if (want && !this._tplUnsub[k]) {
        this._tplUnsub[k] = this._hass.connection.subscribeMessage(
          (msg) => { this._tpl[k] = msg.result; this._render(); },
          { type: "render_template", template: v, variables: { config: this._config, user: this._hass.user }, strict: false },
        ).catch((e) => { this._tpl[k] = `⚠ ${e.message || e}`; this._render(); });
      } else if (!want && this._tplUnsub[k]) {
        this._killSub(k);
      }
    }
  }

  _killSub(k) {
    const p = this._tplUnsub[k];
    delete this._tplUnsub[k];
    delete this._tpl[k];
    if (p && typeof p.then === "function") p.then((u) => { try { u(); } catch (e) {} });
  }

  _unsubscribeAll() {
    Object.keys(this._tplUnsub).forEach((k) => this._killSub(k));
  }

  getCardSize() { return 2; }

  static getStubConfig() {
    return { entity: "sun.sun", label: "Солнце" };
  }

  // -- helpers -------------------------------------------------------------

  _isEntityId(v) {
    return typeof v === "string" && /^[a-z_]+\.[a-z0-9_]+$/.test(v) && !!this._hass && v in this._hass.states;
  }

  _resolve(v, { raw = false, key = null } = {}) {
    if (v === undefined || v === null || v === "") return "";
    if (key && DeusExCard._isTemplate(v)) return this._tpl[key] === undefined ? "" : String(this._tpl[key]);
    if (this._isEntityId(v)) {
      const st = this._hass.states[v];
      if (raw) return st.state;
      return this._formatState(st);
    }
    return String(v);
  }

  _formatState(st) {
    if (!st) return "—";
    try {
      if (this._hass.formatEntityState) return this._hass.formatEntityState(st);
    } catch (e) { /* older HA */ }
    const unit = st.attributes && st.attributes.unit_of_measurement;
    return unit ? `${st.state} ${unit}` : st.state;
  }

  _valueParts() {
    const cfg = this._config;
    // explicit override (string | entity_id | template)
    if (cfg.value !== undefined) return { text: this._resolve(cfg.value, { key: "value" }), unit: "" };
    const st = cfg.entity && this._hass ? this._hass.states[cfg.entity] : null;
    if (!st) return { text: cfg.entity ? "—" : "", unit: "" };
    if (cfg.attribute) {
      const a = st.attributes ? st.attributes[cfg.attribute] : undefined;
      return { text: a === undefined ? "—" : String(a), unit: "" };
    }
    const unit = st.attributes && st.attributes.unit_of_measurement;
    let text;
    try {
      text = this._hass.formatEntityState ? this._hass.formatEntityState(st) : st.state;
    } catch (e) { text = st.state; }
    // if HA already appended the unit, don't double it
    if (unit && typeof text === "string" && text.endsWith(unit)) {
      return { text: text.slice(0, -unit.length).trim(), unit };
    }
    return { text, unit: unit || "" };
  }

  _labelText() {
    const cfg = this._config;
    if (cfg.label !== undefined) return this._resolve(cfg.label, { key: "label" });
    const st = cfg.entity && this._hass ? this._hass.states[cfg.entity] : null;
    return st && st.attributes && st.attributes.friendly_name ? st.attributes.friendly_name : (cfg.entity || "");
  }

  _dotClass() {
    const cfg = this._config;
    const id = cfg.status || cfg.entity;
    const st = id && this._hass ? this._hass.states[id] : null;
    if (!st) return "off";
    const s = String(st.state).toLowerCase();
    const n = Number(st.state);
    const isProblem = st.attributes && st.attributes.device_class === "problem";
    if (isProblem && (ACTIVE.has(s) || (!Number.isNaN(n) && n > 0))) return "alert";
    if (INACTIVE.has(s)) return "off";
    if (ACTIVE.has(s)) return "";
    if (!Number.isNaN(n)) return n > 0 ? "" : "off";
    return "";
  }

  // -- actions ------------------------------------------------------------

  _fireAction(cfgKey) {
    const action = this._config[cfgKey] || { action: "none" };
    const a = action.action;
    if (a === "none") return;
    if (a === "more-info") {
      const entity = action.entity || this._config.entity;
      if (!entity) return;
      this.dispatchEvent(new CustomEvent("hass-more-info", {
        detail: { entityId: entity }, bubbles: true, composed: true,
      }));
      return;
    }
    if (a === "navigate" && action.navigation_path) {
      history.pushState(null, "", action.navigation_path);
      this.dispatchEvent(new Event("location-changed", { bubbles: true, composed: true }));
      return;
    }
    if (a === "url" && action.url_path) { window.open(action.url_path); return; }
    if (a === "toggle" && this._config.entity && this._hass) {
      this._hass.callService("homeassistant", "toggle", { entity_id: this._config.entity });
      return;
    }
    if (a === "call-service" && action.service && this._hass) {
      const [dom, srv] = action.service.split(".");
      this._hass.callService(dom, srv, action.data || action.service_data || {}, action.target);
      return;
    }
  }

  _wire(el) {
    let holdTimer = null, held = false, lastTap = 0;
    const down = () => { held = false; holdTimer = setTimeout(() => { held = true; this._fireAction("hold_action"); }, 500); };
    const up = () => { clearTimeout(holdTimer); };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", up);
    el.addEventListener("click", () => {
      if (held) { held = false; return; }
      const now = Date.now();
      if (now - lastTap < 300 && this._config.double_tap_action.action !== "none") {
        lastTap = 0; this._fireAction("double_tap_action");
      } else {
        lastTap = now;
        setTimeout(() => { if (lastTap && Date.now() - lastTap >= 290) { lastTap = 0; this._fireAction("tap_action"); } }, 300);
      }
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._fireAction("tap_action"); }
    });
  }

  // -- render -----------------------------------------------------------

  _build() {
    this._root.innerHTML = `<style>${STYLE}</style>
      <div class="dx" tabindex="0" role="button">
        <span class="bracket"></span>
        <div class="eyebrow"></div>
        <div class="val"><span class="vt"></span><span class="u"></span></div>
        <div class="foot"><span class="dot"></span><span class="txt"></span><span class="meta"></span></div>
      </div>`;
    this._el = {
      card: this._root.querySelector(".dx"),
      eyebrow: this._root.querySelector(".eyebrow"),
      vt: this._root.querySelector(".vt"),
      u: this._root.querySelector(".u"),
      foot: this._root.querySelector(".foot"),
      dot: this._root.querySelector(".dot"),
      txt: this._root.querySelector(".txt"),
      meta: this._root.querySelector(".meta"),
    };
    this._wire(this._el.card);
    this._built = true;
  }

  _render() {
    if (!this._config) return;
    if (!this._built) this._build();
    if (!this._hass && this._config.entity) return;

    const { text, unit } = this._valueParts();
    const footer = this._resolve(this._config.footer, { key: "footer" });
    const meta = this._resolve(this._config.meta, { key: "meta" });

    this._el.eyebrow.textContent = this._labelText();
    this._el.vt.textContent = text;
    this._el.u.textContent = unit || "";
    this._el.txt.textContent = footer;
    this._el.meta.textContent = meta;
    this._el.dot.className = "dot " + this._dotClass();
    this._el.foot.classList.toggle("empty", !footer && !meta);
    if (String(text).length > 6) this._el.vt.parentElement.classList.add("sm");
    else this._el.vt.parentElement.classList.remove("sm");
  }
}

customElements.define("deus-ex-card", DeusExCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "deus-ex-card",
  name: "Deus Ex Card",
  description: "HUD stat card — lacquered wood, brass trim, rivet. Part of the Deus Ex theme.",
  preview: false,
  documentationURL: "https://github.com/Aamoree99/ha-deus-ex-theme",
});

console.info(`%c DEUS-EX-CARD %c ${VERSION} `, "background:#C79238;color:#160f04;font-weight:700", "background:#140d07;color:#D4A93A");
