# What matches the artifact, and what's approximate

The goal: inside a dashboard **view**, everything looks like the artifact. The app
sidebar and header are styled but not held to the same bar.

## 1:1 — guaranteed

| element | how |
|---|---|
| hero stat card (eyebrow / value / footer / meta) | `custom:deus-ex-card` — its own shadow DOM, immune to HA class renames |
| card frame everywhere (`ha-card`) — lacquer, brass кант, rivet, HUD bracket, cut corners | `card-mod-card` in the theme |
| page background, feathered edges | theme `background-image` / `lovelace-background` + `assets/background.jpg` |
| palette, accent gold, semantic rust | theme variables |
| picture / floorplan cards stay flat (frame would fight the image) | opt-out rule in `card-mod-card` |

## ~90% — via theme, may need a tune after HA updates

These use card-mod **shadow-piercing** (`$`) into HA's internal card DOM. If HA
renames a class in a future release the selector silently stops applying (it never
breaks the theme) — re-check after major updates.

| element | selector target | risk |
|---|---|---|
| `tile` name → display font, secondary → mono-caps | `hui-tile-card $ .primary / .secondary` | medium |
| `tile` icon → HUD plate + gold active glow | `hui-tile-card $ ha-tile-icon $ .container` | medium |
| `button` card → cut corners, hover glow | `hui-button-card $ ha-card` | low |
| `mini-graph-card` accent → gold | `--accent-color` | low (its own API) |
| more-info dialog → brass frame, mono keys | `card-mod-more-info` | medium |
| thermostat heat colour → gold | `state-climate-heat-color` | low |
| sliders → gold track/handle | `paper-slider-*`, `md-slider-*` | low |

## Not the target — styled, not matched

- **App header** (`app-header-*` vars) — coloured, not reshaped.
- **Sidebar** (`card-mod-sidebar`) — gold, cut corners, selected marker; carried over
  from the cyberpunk base, light retune only.

## For exact text layout on a non-hero card

If a native `tile` / `glance` can't express what you need (e.g. footer with a
right-aligned meta field), use `custom:deus-ex-card` instead of fighting card-mod.
That's the whole reason the card exists.
