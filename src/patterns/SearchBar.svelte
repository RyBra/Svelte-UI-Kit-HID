<script lang="ts">
  import DateRangePicker from "../DateRangePicker.svelte";
  import Button from "../primitives/Button.svelte";
  import FormField from "../composed/FormField.svelte";
  import Input from "../primitives/Input.svelte";

  let {
    onSearch
  } = $props<{
    onSearch: (payload: { destination: string; checkIn: string; checkOut: string; guests: number }) => void;
  }>();

  let destination = $state("");
  let dateValue = $state<{ checkIn: string; checkOut: string }>({ checkIn: "", checkOut: "" });
  let guestsInput = $state("2");

  function digitsOnly(raw: string) {
    return raw.replace(/\D/g, "");
  }

  function onGuestsInput(event: Event) {
    const el = event.currentTarget as HTMLInputElement;
    guestsInput = digitsOnly(el.value);
  }
  let destinationError = $state("");
  let dateError = $state("");

  function submit() {
    destinationError = "";
    dateError = "";
    if (!destination.trim()) {
      destinationError = "Укажите направление";
      return;
    }
    const { checkIn, checkOut } = dateValue;
    if (checkIn && checkOut && checkOut < checkIn) {
      dateError = "Дата выезда должна быть позже даты заезда";
      return;
    }
    const parsed = parseInt(digitsOnly(guestsInput), 10);
    const guests = Number.isFinite(parsed)
      ? Math.min(16, Math.max(1, parsed))
      : 1;
    onSearch({ destination: destination.trim(), checkIn, checkOut, guests });
  }

  function onDateChange(next: { checkIn: string; checkOut: string }) {
    dateValue = next;
    dateError = "";
  }
</script>

<section class="hero-search ui-card ui-card-pad">
  <h1 class="ui-title">Найдите жилье под вашу задачу</h1>
  <p class="ui-muted">Поиск и бронирование с прозрачными статусами и безопасной оплатой.</p>
  <div class="form">
    <FormField label="Куда" required hint="Город или регион" error={destinationError}>
      {#snippet control(a11y)}
        <Input {...a11y} bind:value={destination} placeholder="Куда едем?" />
      {/snippet}
    </FormField>

    <DateRangePicker value={dateValue} error={dateError} size="lg" label="Даты проживания" onChange={onDateChange} />

    <FormField label="Гости">
      {#snippet control(a11y)}
        <Input
          {...a11y}
          bind:value={guestsInput}
          type="text"
          inputmode="numeric"
          autocomplete="off"
          oninput={onGuestsInput}
          size="lg"
        />
      {/snippet}
    </FormField>

    <div class="submit-wrap">
      <Button variant="primary" class="search-submit" onclick={submit}>Найти</Button>
    </div>
  </div>
</section>

<style>
  .hero-search {
    padding: 1.2rem;
  }

  .form {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--ui-space-3);
    margin-top: 0.9rem;
  }

  .submit-wrap {
    display: flex;
    align-items: flex-end;
  }

  :global(.search-submit) {
    width: 100%;
  }

  @media (min-width: 700px) {
    .form {
      grid-template-columns: 2fr 1.2fr 1fr auto;
      align-items: end;
      gap: 0.6rem;
    }

    :global(.search-submit) {
      width: auto;
    }
  }
</style>
