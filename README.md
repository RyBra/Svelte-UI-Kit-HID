# @n.tarasenko/ui

Reusable Svelte UI kit with primitives, composed components, patterns, and theme utilities.

## Installation

```bash
pnpm add @n.tarasenko/ui
```

## Peer dependencies

- `svelte@^5`

## Usage

```ts
import { createThemeController } from "@n.tarasenko/ui";
```

```svelte
<script lang="ts">
  import Button from "@n.tarasenko/ui/primitives/Button.svelte";
</script>

<Button>Click me</Button>
```

```css
@import "@n.tarasenko/ui/styles/tokens.css";
@import "@n.tarasenko/ui/styles/theme.css";
@import "@n.tarasenko/ui/styles/motion.css";
```

## Exports

- Root utilities: `@n.tarasenko/ui`
- Theme modules: `@n.tarasenko/ui/theme`, `@n.tarasenko/ui/theme-context`
- Svelte components: `@n.tarasenko/ui/primitives/*.svelte`, `@n.tarasenko/ui/composed/*.svelte`, `@n.tarasenko/ui/patterns/*.svelte`
- Styles: `@n.tarasenko/ui/styles/*.css`

