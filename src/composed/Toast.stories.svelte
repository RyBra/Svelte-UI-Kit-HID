<script context="module" lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Toast from "./Toast.svelte";

  const { Story } = defineMeta({
    title: "Composed/Toast",
    component: Toast
  });
</script>

<script lang="ts">
  import Button from "../primitives/Button.svelte";
  import ToastRegion from "./ToastRegion.svelte";

  type Tone = "info" | "success" | "warning" | "error";
  type Item = { id: string; tone: Tone; title?: string; message: string };

  let stackItems = $state<Item[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  function removeStack(id: string) {
    const t = timers.get(id);
    if (t !== undefined) {
      clearTimeout(t);
      timers.delete(id);
    }
    stackItems = stackItems.filter((x) => x.id !== id);
  }

  function pushStack(tone: Tone, title: string | undefined, message: string) {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s-${Date.now()}`;
    stackItems = [{ id, tone, title, message }, ...stackItems];
    timers.set(id, setTimeout(() => removeStack(id), 5000));
  }
</script>

<Story name="Default">
  <Toast>Changes saved</Toast>
</Story>

<Story name="Tones">
  <div style="display:grid; gap:0.5rem; max-width:420px;">
    <Toast tone="info" title="Information">Secondary line for context.</Toast>
    <Toast tone="success">Success message</Toast>
    <Toast tone="warning">Warning message</Toast>
    <Toast tone="error" role="alert">Error message</Toast>
  </div>
</Story>

<Story name="macOS region">
  <div style="min-height: 200px; padding: 1rem;">
    <p style="margin: 0 0 0.75rem; font: 400 0.875rem/1.4 system-ui;">Карточки появляются в правом верхнем углу iframe.</p>
    <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
      <Button variant="secondary" onclick={() => pushStack("info", "App", "Новое уведомление")}>Info</Button>
      <Button variant="secondary" onclick={() => pushStack("success", "Готово", "Файл сохранён.")}>Success</Button>
      <Button variant="secondary" onclick={() => pushStack("warning", "Проверьте", "Низкий заряд.")}>Warning</Button>
      <Button variant="secondary" onclick={() => pushStack("error", "Сбой", "Сеть недоступна.")}>Error</Button>
    </div>
  </div>
  <ToastRegion>
    {#each stackItems as item (item.id)}
      <Toast
        tone={item.tone}
        title={item.title}
        role={item.tone === "error" ? "alert" : "status"}
        onDismiss={() => removeStack(item.id)}
      >
        {item.message}
      </Toast>
    {/each}
  </ToastRegion>
</Story>
