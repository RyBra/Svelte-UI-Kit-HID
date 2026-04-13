# @rybra/ui

Reusable Svelte UI kit with primitives, composed components, patterns, and theme utilities.

## Installation

```bash
pnpm add @rybra/ui
```

## Peer dependencies

- `svelte@^5`

## Usage

```ts
import { createThemeController } from "@rybra/ui";
```

```svelte
<script lang="ts">
  import Button from "@rybra/ui/primitives/Button.svelte";
</script>

<Button>Click me</Button>
```

```css
@import "@rybra/ui/styles/tokens.css";
@import "@rybra/ui/styles/theme.css";
@import "@rybra/ui/styles/motion.css";
```

## Exports

- Root utilities: `@rybra/ui`
- Theme modules: `@rybra/ui/theme`, `@rybra/ui/theme-context`
- Svelte components: `@rybra/ui/primitives/*.svelte`, `@rybra/ui/composed/*.svelte`, `@rybra/ui/patterns/*.svelte`
- Styles: `@rybra/ui/styles/*.css`

