# yaray-ui-kit-hid

Reusable Svelte UI kit with primitives, composed components, patterns, and theme utilities.

## Installation

```bash
pnpm add yaray-ui-kit-hid
```

## Peer dependencies

- `svelte@^5`

## Usage

```ts
import { createThemeController } from "yaray-ui-kit-hid";
```

```svelte
<script lang="ts">
  import Button from "yaray-ui-kit-hid/primitives/Button.svelte";
</script>

<Button>Click me</Button>
```

```css
@import "yaray-ui-kit-hid/styles/tokens.css";
@import "yaray-ui-kit-hid/styles/theme.css";
@import "yaray-ui-kit-hid/styles/motion.css";
```

## Exports

- Root utilities: `yaray-ui-kit-hid`
- Theme modules: `yaray-ui-kit-hid/theme`, `yaray-ui-kit-hid/theme-context`
- Svelte components: `yaray-ui-kit-hid/primitives/*.svelte`, `yaray-ui-kit-hid/composed/*.svelte`, `yaray-ui-kit-hid/patterns/*.svelte`
- Styles: `yaray-ui-kit-hid/styles/*.css`

