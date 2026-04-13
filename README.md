# @yaray/ui

Reusable Svelte UI kit with primitives, composed components, patterns, and theme utilities.

## Installation

```bash
pnpm add @yaray/ui
```

## Peer dependencies

- `svelte@^5`

## Usage

```ts
import { createThemeController } from "@yaray/ui";
```

```svelte
<script lang="ts">
  import Button from "@yaray/ui/primitives/Button.svelte";
</script>

<Button>Click me</Button>
```

```css
@import "@yaray/ui/styles/tokens.css";
@import "@yaray/ui/styles/theme.css";
@import "@yaray/ui/styles/motion.css";
```

## Exports

- Root utilities: `@yaray/ui`
- Theme modules: `@yaray/ui/theme`, `@yaray/ui/theme-context`
- Svelte components: `@yaray/ui/primitives/*.svelte`, `@yaray/ui/composed/*.svelte`, `@yaray/ui/patterns/*.svelte`
- Styles: `@yaray/ui/styles/*.css`

