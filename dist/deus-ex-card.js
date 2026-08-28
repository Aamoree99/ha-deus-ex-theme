/*! deus-ex-card — https://github.com/Aamoree99/ha-deus-ex-theme  (MIT)
 *  A HUD stat card for Lovelace: lacquered wood, brass кант, rivet, HUD bracket,
 *  eyebrow → value → footer(status dot · text · right-aligned meta).
 *  Pairs with the Deus Ex theme (reads its --dx-* vars, falls back to literals).
 */
const VERSION = "1.3.0";

// Load the Deus Ex typefaces once, into <head> — avoids an @import in the theme's
// card-mod-root (which causes a first-paint flash / blank dashboard).
(function loadFonts() {
  try {
    if (document.getElementById("deus-ex-fonts")) return;
    const l = document.createElement("link");
    l.id = "deus-ex-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Rajdhani:wght@500;600;700&display=swap";
    document.head.appendChild(l);
  } catch (e) { /* fonts fall back to Rajdhani / system */ }
})();

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


/* ============================================================================
   deus-ex-thermostat — HUD climate dial (gold arc, brass mode chip, HUD +/-)
   ========================================================================== */

const HVAC_LABEL = {
  heat: "Обогрев", cool: "Охлаждение", auto: "Авто", "heat_cool": "Авто",
  dry: "Осушение", fan_only: "Вентиляция", off: "Выкл",
};
const ACTION_LABEL = { heating: "греет", cooling: "холодит", idle: "ждёт", off: "выкл", drying: "сушит", fan: "обдув" };

const T_STYLE = `
${FALLBACK}
:host{ display:block; }
*{ box-sizing:border-box; }

.dx{
  position:relative; padding:1rem 1.1rem; font-family:var(--dx-font-display); color:var(--dx-value);
  border-radius:2px; display:flex; gap:1.1rem; align-items:center; flex-wrap:wrap;
  background:
    repeating-linear-gradient(178deg, rgba(255,224,180,.015) 0 3px, rgba(0,0,0,0) 3px 11px, rgba(0,0,0,.03) 11px 13px, rgba(0,0,0,0) 13px 26px),
    radial-gradient(150% 100% at 22% -20%, rgba(255,214,150,.07), rgba(255,214,150,0) 58%),
    linear-gradient(180deg, var(--dx-wood-1) 0%, var(--dx-wood-2) 48%, var(--dx-wood-3) 100%);
  box-shadow:
    inset 0 0 0 1px var(--dx-brass),
    0 1px 0 rgba(255,228,175,.06) inset, 0 -16px 26px rgba(0,0,0,.3) inset,
    0 7px 16px rgba(0,0,0,.5), 0 1px 2px rgba(0,0,0,.6);
  clip-path:polygon(0 9px, 9px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
}
.dx::after{
  content:""; position:absolute; top:5px; left:5px; width:7px; height:7px; border-radius:50%;
  background:radial-gradient(circle at 34% 30%, #F8E6B4 0%, #CE9E46 46%, #835c2c 78%, #4a361c 100%);
  box-shadow:0 1px 1px rgba(0,0,0,.65), 0 0 0 1px rgba(0,0,0,.4);
}

.dial{ --p:0; position:relative; width:118px; height:118px; flex:none; }
.dial-arc{
  position:absolute; inset:0; border-radius:50%;
  background:conic-gradient(from 225deg,
    var(--dx-gold) 0turn calc(var(--p) * 0.75turn),
    #3a2c14 calc(var(--p) * 0.75turn) 0.75turn,
    transparent 0.75turn 1turn);
  -webkit-mask:radial-gradient(circle, transparent 44px, #000 45px);
          mask:radial-gradient(circle, transparent 44px, #000 45px);
  filter:drop-shadow(0 0 5px rgba(212,169,58,.28));
}
.dial.off .dial-arc{ background:conic-gradient(from 225deg, #3a2c14 0 .75turn, transparent .75turn 1turn); filter:none; }
.dial-face{
  position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:none;
}
.set{ font-weight:700; font-size:1.9rem; line-height:1; color:var(--dx-value); font-variant-numeric:tabular-nums; }
.set .u{ font-size:.5em; color:var(--dx-label); }
.cur{ font-family:var(--dx-font-mono); font-size:.6rem; letter-spacing:.05em; text-transform:uppercase; color:var(--dx-label); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

.info{ display:flex; flex-direction:column; gap:.55rem; min-width:0; flex:1; }
.name{ font-family:var(--dx-font-mono); font-weight:500; font-size:.62rem; letter-spacing:.18em; text-transform:uppercase; color:var(--dx-label); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mode{
  align-self:flex-start; font-family:var(--dx-font-mono); font-size:.58rem; letter-spacing:.1em; text-transform:uppercase;
  color:var(--dx-gold); border:1px solid var(--dx-brass-deep); padding:.22rem .55rem; cursor:pointer;
  white-space:nowrap; max-width:100%; overflow:hidden; text-overflow:ellipsis;
  clip-path:polygon(0 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%);
}
.mode.off{ color:var(--dx-label); }
.steps{ display:flex; gap:.5rem; margin-top:.1rem; }
.steps button{
  width:38px; height:38px; flex:none; cursor:pointer; font-family:var(--dx-font-display); font-size:1.2rem; font-weight:700;
  color:var(--dx-value); background:linear-gradient(180deg,#241a0d,#150e07); border:1px solid var(--dx-brass);
  clip-path:polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%);
  transition:background .13s, box-shadow .13s;
}
.steps button:hover{ background:linear-gradient(180deg,#3a2b12,#20180a); box-shadow:0 0 10px rgba(212,169,58,.3); }
.steps button:active{ background:var(--dx-gold); color:#160f04; }
.steps button:focus-visible{ outline:2px solid var(--dx-gold); outline-offset:2px; }
@media (prefers-reduced-motion:reduce){ .steps button{ transition:none; } }
`;

class DeusExThermostat extends HTMLElement {
  constructor() {
    super();
    this._hass = null; this._config = null; this._built = false;
    this._root = this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    if (!config || !config.entity || config.entity.split(".")[0] !== "climate") {
      throw new Error("deus-ex-thermostat: `entity` must be a climate entity");
    }
    this._config = { name: undefined, step: undefined, ...config };
    this._built = false;
    this._render();
  }

  set hass(hass) { this._hass = hass; this._render(); }
  getCardSize() { return 2; }
  static getStubConfig() { return { entity: "climate.example" }; }

  get _st() { return this._hass && this._config ? this._hass.states[this._config.entity] : null; }

  _num(v, d) { const n = Number(v); return Number.isFinite(n) ? n : d; }

  _setTemp(delta) {
    const st = this._st; if (!st) return;
    const a = st.attributes;
    const step = this._num(this._config.step, this._num(a.target_temp_step, 0.5));
    const min = this._num(a.min_temp, 5), max = this._num(a.max_temp, 35);
    let t = this._num(a.temperature, this._num(a.current_temperature, 20)) + delta * step;
    t = Math.min(max, Math.max(min, Math.round(t / step) * step));
    this._hass.callService("climate", "set_temperature", { entity_id: this._config.entity, temperature: t });
  }

  _moreInfo() {
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId: this._config.entity }, bubbles: true, composed: true,
    }));
  }

  _build() {
    this._root.innerHTML = `<style>${T_STYLE}</style>
      <div class="dx">
        <div class="dial">
          <div class="dial-arc"></div>
          <div class="dial-face">
            <div class="set"><span class="sv">--</span><span class="u">&deg;</span></div>
          </div>
        </div>
        <div class="info">
          <div class="name"></div>
          <div class="cur"></div>
          <div class="mode" role="button" tabindex="0"></div>
          <div class="steps">
            <button type="button" class="dn" aria-label="Ниже">&minus;</button>
            <button type="button" class="up" aria-label="Выше">&plus;</button>
          </div>
        </div>
      </div>`;
    const $ = (s) => this._root.querySelector(s);
    this._el = {
      dial: $(".dial"), sv: $(".sv"), cur: $(".cur"), name: $(".name"), mode: $(".mode"),
    };
    $(".up").addEventListener("click", () => this._setTemp(+1));
    $(".dn").addEventListener("click", () => this._setTemp(-1));
    const mi = () => this._moreInfo();
    this._el.mode.addEventListener("click", mi);
    this._el.mode.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); mi(); } });
    this._el.dial.addEventListener("click", mi);
    this._built = true;
  }

  _render() {
    if (!this._config) return;
    if (!this._built) this._build();
    const st = this._st;
    if (!st) return;
    const a = st.attributes;
    const isOff = st.state === "off" || st.state === "unavailable";
    const setpt = this._num(a.temperature, NaN);
    const cur = this._num(a.current_temperature, NaN);
    const min = this._num(a.min_temp, 5), max = this._num(a.max_temp, 35);
    const p = Number.isFinite(setpt) ? Math.min(1, Math.max(0, (setpt - min) / (max - min))) : 0;

    this._el.dial.style.setProperty("--p", isOff ? 0 : p.toFixed(3));
    this._el.dial.classList.toggle("off", isOff);
    this._el.sv.textContent = Number.isFinite(setpt) ? (Number.isInteger(setpt) ? setpt : setpt.toFixed(1)) : "--";

    const action = a.hvac_action ? (ACTION_LABEL[a.hvac_action] || a.hvac_action) : null;
    this._el.cur.textContent = Number.isFinite(cur)
      ? `сейчас ${Number.isInteger(cur) ? cur : cur.toFixed(1)}°${action ? " · " + action : ""}`
      : (action || "");

    this._el.name.textContent = this._config.name
      || (a.friendly_name || this._config.entity);

    const modeTxt = HVAC_LABEL[st.state] || st.state;
    const preset = a.preset_mode && a.preset_mode !== "none" ? a.preset_mode : null;
    this._el.mode.textContent = preset ? `${modeTxt} · ${preset}` : modeTxt;
    this._el.mode.classList.toggle("off", isOff);
  }
}

customElements.define("deus-ex-thermostat", DeusExThermostat);


window.customCards = window.customCards || [];
window.customCards.push({
  type: "deus-ex-card",
  name: "Deus Ex Card",
  description: "HUD stat card — lacquered wood, brass trim, rivet. Part of the Deus Ex theme.",
  preview: false,
  documentationURL: "https://github.com/Aamoree99/ha-deus-ex-theme",
});
window.customCards.push({
  type: "deus-ex-thermostat",
  name: "Deus Ex Thermostat",
  description: "HUD climate dial — gold arc, brass mode chip. Part of the Deus Ex theme.",
  preview: false,
  documentationURL: "https://github.com/Aamoree99/ha-deus-ex-theme",
});

console.info(`%c DEUS-EX %c ${VERSION} %c card + thermostat `, "background:#C79238;color:#160f04;font-weight:700", "background:#140d07;color:#D4A93A", "background:#140d07;color:#9A7B44");
