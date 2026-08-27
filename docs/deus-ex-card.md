# `custom:deus-ex-card`

The HUD stat card — lacquered wood, brass кант, rivet, HUD bracket, and a fixed
three-part text layout that matches the artifact:

```
ЛЕЙБЛ                 ← eyebrow  (mono, uppercase, tracked)
21.4°                 ← value    (condensed, heavy, warm white; unit shrinks)
● footer text   meta  ← footer   (status dot · text · right-aligned meta)
```

## Options

| key | type | default | notes |
|-----|------|---------|-------|
| `entity` | entity_id | — | drives the value and (unless overridden) the label and status dot |
| `label` | string \| entity_id \| template | entity `friendly_name` | the eyebrow |
| `value` | string \| entity_id \| template | entity state (locale-formatted) | overrides the big number |
| `attribute` | string | — | show this attribute of `entity` instead of its state (ignored if `value` set) |
| `footer` | string \| entity_id \| template | — | left side of the footer row; row hides if `footer` and `meta` are both empty |
| `meta` | string \| entity_id \| template | — | right-aligned footer text |
| `status` | entity_id | `entity` | which entity's state colours the dot |
| `tap_action` | action | `more-info` | standard HA action object |
| `hold_action` | action | `more-info` | |
| `double_tap_action` | action | `none` | |

### String vs entity vs template
- Contains `{{` or `{%` → rendered as a **Jinja template** (live, via `render_template`).
- Matches `domain.object_id` and that entity exists → its **formatted state**.
- Otherwise → used **literally**.

### Status dot
- gold — entity is `on` / `home` / `playing` / `heat` / … or a number > 0
- dark — `off` / `not_home` / `closed` / `idle` / `unavailable` / 0
- rust — `device_class: problem` and active / count > 0

### Actions
`more-info`, `toggle`, `navigate` (`navigation_path`), `url` (`url_path`),
`call-service` (`service`, `data`, `target`), `none`.

## Theme variables it reads

Falls back to baked-in literals, so it looks right even without the theme:

```
--dx-wood-1 --dx-wood-2 --dx-wood-3
--dx-brass-lit --dx-brass --dx-brass-deep
--dx-gold --dx-gold-hot --dx-value --dx-label --dx-alert
--dx-font-display --dx-font-mono
```

See `cards/deus-ex-card.yaml` for copy-paste examples.
