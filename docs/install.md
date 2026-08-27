# Install

Two pieces: the **theme** (styles everything) and the **card** (`custom:deus-ex-card`,
for the artifact-exact hero cards). You can use the theme alone.

## 1. Theme

### Manual
1. Copy `themes/deus-ex.yaml` → `<config>/themes/deus-ex.yaml`.
2. `configuration.yaml`:
   ```yaml
   frontend:
     themes: !include_dir_merge_named themes
   ```
3. **Developer Tools → Actions → `frontend.reload_themes`** (no restart needed).
4. Apply: profile → Theme → **Deus Ex**, or per-dashboard:
   ```yaml
   # raw dashboard config, top level
   title: Дом
   theme: Deus Ex
   ```

### HACS
HACS → three-dot menu → **Custom repositories** → `https://github.com/Aamoree99/ha-deus-ex-theme`,
category **Theme** → install → reload themes.

### Background
The wallpaper is part of the theme:
```yaml
background-image: "center / cover no-repeat fixed url('https://raw.githubusercontent.com/Aamoree99/ha-deus-ex-theme/main/assets/background.jpg')"
lovelace-background: "var(--background-image)"
```
Swap it by committing a new `assets/background.jpg` (CDN cache ~5 min), or point
`background-image` at a local `/local/deus-ex/background.jpg`. **Remove any per-view
`background:` keys from your dashboards** — they override the theme.

Fonts (Chakra Petch, JetBrains Mono) load via an `@import` in `card-mod-root`. If your
HA has no internet, install them as `/local` fonts or accept the Rajdhani/system fallback.

## 2. `custom:deus-ex-card`

Requires **card-mod** (you likely already have it) only for the surrounding theme; the
card itself is standalone.

### Manual (no HACS)
1. Copy `dist/deus-ex-card.js` → `<config>/www/deus-ex-card.js`.
2. **Settings → Dashboards → three-dot → Resources → Add**
   `URL: /local/deus-ex-card.js`, `Type: JavaScript Module`.
   (or in YAML-mode dashboards: `lovelace: resources: - url: /local/deus-ex-card.js` `type: module`)
3. Hard-refresh the browser.

### HACS
Add the same repo as category **Dashboard** (Lovelace plugin) — HACS registers the
resource for you.

### Requirements
- Home Assistant 2024.8+ (uses `render_template` WS subscription and `formatEntityState`).
- Older HA still works; templates and locale-formatted states degrade to raw values.
