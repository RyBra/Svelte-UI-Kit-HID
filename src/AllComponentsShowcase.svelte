<script lang="ts">
  import { onDestroy } from "svelte";
  import ThemeProvider from "./ThemeProvider.svelte";
  import ThemeSwitch from "./ThemeSwitch.svelte";
  import DateRangePicker from "./DateRangePicker.svelte";

  import Button from "./primitives/Button.svelte";
  import Card from "./primitives/Card.svelte";
  import Chip from "./primitives/Chip.svelte";
  import IconButton from "./primitives/IconButton.svelte";
  import Input from "./primitives/Input.svelte";
  import Link from "./primitives/Link.svelte";
  import ProgressiveImage from "./primitives/ProgressiveImage.svelte";
  import Select from "./primitives/Select.svelte";

  import FormField from "./composed/FormField.svelte";
  import InlineSheet from "./composed/InlineSheet.svelte";
  import ProgressiveImageSlider from "./composed/ProgressiveImageSlider.svelte";
  import Switch from "./composed/Switch.svelte";
  import Tabs from "./composed/Tabs.svelte";
  import TabPanel from "./composed/TabPanel.svelte";
  import Toast from "./composed/Toast.svelte";
  import ToastRegion from "./composed/ToastRegion.svelte";
  import TopBar from "./composed/TopBar.svelte";

  import Banner from "./patterns/Banner.svelte";
  import EmptyState from "./patterns/EmptyState.svelte";
  import MetricCard from "./patterns/MetricCard.svelte";
  import SearchBar from "./patterns/SearchBar.svelte";
  import Section from "./patterns/Section.svelte";

  let { story = "overview" } = $props<{ story?: string }>();

  let isOn = $state(false);
  let activeTab = $state("overview");
  let dateRange = $state({ checkIn: "", checkOut: "" });
  let destination = $state("");
  let plan = $state("");
  let teamFilters = $state<string[]>([]);
  let attendees = $state("2");

  function digitsOnly(raw: string) {
    return raw.replace(/\D/g, "");
  }

  function onAttendeesInput(event: Event) {
    const el = event.currentTarget as HTMLInputElement;
    attendees = digitsOnly(el.value);
  }

  let priceAmount = $state("1490.50");
  let nativeFormResult = $state("");
  const pricingOptions = [
    { value: "basic", label: "Basic", keywords: ["start", "entry"] },
    { value: "pro", label: "Pro", keywords: ["business"] },
    { value: "enterprise", label: "Enterprise", keywords: ["team", "corp"] }
  ];
  const groupedPlanOptions = [
    {
      label: "Популярные",
      options: [
        { value: "starter", label: "Starter" },
        { value: "growth", label: "Growth" }
      ]
    },
    {
      label: "Корпоративные",
      options: [
        { value: "business", label: "Business" },
        { value: "ultimate", label: "Ultimate", disabled: true }
      ]
    }
  ];
  const filterOptions = [
    { value: "wifi", label: "Wi-Fi" },
    { value: "parking", label: "Парковка" },
    { value: "breakfast", label: "Завтрак" },
    { value: "pool", label: "Бассейн" }
  ];
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Details" },
    { id: "blocked", label: "Disabled", disabled: true }
  ];
  const slides = [
    { lowSrc: "https://picsum.photos/seed/s1/320/200", highSrc: "https://picsum.photos/seed/s1/1200/800", alt: "Slide one" },
    { lowSrc: "https://picsum.photos/seed/s2/320/200", highSrc: "https://picsum.photos/seed/s2/1200/800", alt: "Slide two" }
  ];
  const is = (key: string) => story === "overview" || story === key;

  type DemoToastTone = "info" | "success" | "warning" | "error";
  type DemoToastItem = {
    id: string;
    tone: DemoToastTone;
    title?: string;
    message: string;
  };

  let demoToasts = $state<DemoToastItem[]>([]);
  const demoToastTimers = new Map<string, ReturnType<typeof setTimeout>>();

  function dismissDemoToast(id: string) {
    const t = demoToastTimers.get(id);
    if (t !== undefined) {
      clearTimeout(t);
      demoToastTimers.delete(id);
    }
    demoToasts = demoToasts.filter((x) => x.id !== id);
  }

  function pushDemoToast(tone: DemoToastTone, title: string | undefined, message: string) {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `t-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    demoToasts = [{ id, tone, title, message }, ...demoToasts];
    const tid = setTimeout(() => dismissDemoToast(id), 4800);
    demoToastTimers.set(id, tid);
  }

  onDestroy(() => {
    for (const t of demoToastTimers.values()) clearTimeout(t);
    demoToastTimers.clear();
  });
</script>

<ThemeProvider>
  <div class="page">
    <header class="hero">
      <h1>Yaray UI Kit Catalog</h1>
      <p>Mobile-first витрина компонентов с проверкой states + accessibility для Liquid Glass.</p>
    </header>

    {#if story === "overview"}
      <section class="demo">
        <h2>Как использовать каталог</h2>
        <p>Каждый блок ниже показывает обязательные состояния: default, focus, disabled и error/validation.</p>
        <p class="demo__note">Проверяйте клавиатурный фокус (`Tab`), touch area (>=44px) и наличие `aria-label` у иконок.</p>
      </section>
    {/if}

    {#if is("theme-provider")}
      <section class="demo">
        <h2>Core / ThemeProvider</h2>
        <ThemeSwitch />
      </section>
    {/if}

    {#if is("theme-switch")}
      <section class="demo">
        <h2>Core / ThemeSwitch</h2>
        <ThemeSwitch />
      </section>
    {/if}

    {#if is("date-range-picker")}
      <section class="demo">
        <h2>Core / DateRangePicker</h2>
        <div class="stack">
          <DateRangePicker value={dateRange} onChange={(next) => (dateRange = next)} />
          <div class="mobile-hint">
            <DateRangePicker inline value={dateRange} onChange={(next) => (dateRange = next)} />
          </div>
        </div>
        <p class="demo__note">Используется layered/inline паттерн без modal-диалога.</p>
      </section>
    {/if}

    {#if is("button")}
      <section class="demo">
        <h2>Primitives / Button</h2>
        <div class="state-grid">
          <div class="state-item">
            <span class="state-label">Default</span>
            <div class="row">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>
          <div class="state-item">
            <span class="state-label">Loading / Disabled</span>
            <div class="row">
              <Button loading>Loading</Button>
              <Button variant="secondary" disabled>Disabled</Button>
              <Button variant="ghost" disabled>Disabled</Button>
            </div>
          </div>
        </div>
        <p class="demo__note">Focus ring: перейдите клавишей Tab по каждой кнопке.</p>
      </section>
    {/if}

    {#if is("card")}
      <section class="demo">
        <h2>Primitives / Card</h2>
        <div class="stack">
          <Card pad variant="base">
            <strong>Base surface</strong>
            <p class="demo__note">Low glass for content readability.</p>
          </Card>
          <Card pad variant="elevated">
            <strong>Elevated surface</strong>
            <p class="demo__note">Use for stacked content blocks.</p>
          </Card>
          <Card pad variant="glass">
            <strong>Glass surface</strong>
            <p class="demo__note">Use sparingly for key controls or overlays.</p>
          </Card>
        </div>
      </section>
    {/if}

    {#if is("chip")}
      <section class="demo">
        <h2>Primitives / Chip</h2>
        <div class="row">
          <Chip>All</Chip>
          <Chip>Popular</Chip>
          <Chip>Nearby</Chip>
        </div>
      </section>
    {/if}

    {#if is("icon-button")}
      <section class="demo">
        <h2>Primitives / IconButton</h2>
        <div class="state-grid">
          <div class="state-item">
            <span class="state-label">Variants</span>
            <div class="row">
              <IconButton aria-label="Settings"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></g></svg></IconButton>
              <IconButton variant="accent" aria-label="Favorite"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></IconButton>
              <IconButton variant="danger" aria-label="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg></IconButton>
              <IconButton aria-label="Disabled control" disabled><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg></IconButton>
            </div>
          </div>
        </div>
        <p class="demo__note">A11y: у каждой иконки должен быть читаемый `aria-label`.</p>
      </section>
    {/if}

    {#if is("input")}
      <section class="demo">
        <h2>Primitives / Input</h2>
        <div class="stack narrow">
          <Input bind:value={destination} placeholder="Куда едем?" aria-label="Destination input" />
          <Input
            size="lg"
            bind:value={attendees}
            type="text"
            inputmode="numeric"
            autocomplete="off"
            oninput={onAttendeesInput}
            placeholder="Количество гостей"
          />
          <Input
            variant="money"
            bind:value={priceAmount}
            placeholder="0"
            aria-label="Сумма без суффикса"
          />
          <Input
            variant="money"
            currency="₽"
            bind:value={priceAmount}
            size="lg"
            placeholder="0"
            aria-label="Сумма в рублях"
          />
          <Input placeholder="Поле с ошибкой" error aria-invalid={true} />
          <Input placeholder="Disabled" disabled />
        </div>
        <p class="demo__note">
          A11y: проверка `aria-invalid` и читаемости placeholder на светлой/темной теме. Денежный вариант:
          только цифры и один разделитель (`,` или `.`), без `e` и знаков; `currency` — суффикс в поле.
        </p>
      </section>
    {/if}

    {#if is("link")}
      <section class="demo">
        <h2>Primitives / Link</h2>
        <div class="row">
          <Link href="https://example.com" target="_blank" rel="noreferrer">Regular link</Link>
          <Link variant="nav" href="#catalog">Nav link</Link>
        </div>
      </section>
    {/if}

    {#if is("progressive-image")}
      <section class="demo">
        <h2>Primitives / ProgressiveImage</h2>
        <div class="image-wrap">
          <ProgressiveImage lowSrc="https://picsum.photos/seed/p1/320/200" highSrc="https://picsum.photos/seed/p1/1200/800" alt="Preview" />
        </div>
      </section>
    {/if}

    {#if is("select")}
      <section class="demo">
        <h2>Primitives / Select</h2>
        <div class="stack narrow">
          <Select bind:value={plan} aria-label="Pricing plan" searchable options={pricingOptions} placeholder="Выберите тариф" />
          <Select aria-label="Grouped plans" searchable bind:value={plan} groups={groupedPlanOptions} placeholder="Планы по группам" />
          <Select
            multiple
            searchable
            bind:value={teamFilters}
            options={filterOptions}
            aria-label="Filters"
            placeholder="Выберите фильтры"
          />
          <Select
            error
            aria-invalid={true}
            aria-label="Invalid plan"
            options={pricingOptions}
            placeholder="Не выбран корректный вариант"
          />
          <Select disabled aria-label="Disabled plan" options={pricingOptions} placeholder="Недоступно" />
        </div>
        <div class="stack narrow">
          <form
            class="stack"
            onsubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget as HTMLFormElement);
              nativeFormResult = JSON.stringify({
                plan: data.get("plan"),
                filters: data.getAll("filters")
              });
            }}
          >
            <Select
              name="plan"
              required
              searchable
              options={pricingOptions}
              bind:value={plan}
              placeholder="Required тариф"
              aria-label="Required plan"
            />
            <Select
              name="filters"
              multiple
              options={filterOptions}
              bind:value={teamFilters}
              placeholder="Фильтры для submit"
              aria-label="Multi filters"
            />
            <Button type="submit">Проверить submit</Button>
          </form>
          <p class="demo__note">Form payload: {nativeFormResult || "—"}</p>
        </div>
      </section>
    {/if}

    {#if is("form-field")}
      <section class="demo">
        <h2>Composed / FormField</h2>
        <div class="stack narrow">
          <FormField label="Email" hint="Use work email">
            {#snippet control(a11y)}
              <Input {...a11y} placeholder="name@company.com" />
            {/snippet}
          </FormField>
          <FormField label="Phone" error="Введите номер в формате +7 ...">
            {#snippet control(a11y)}
              <Input {...a11y} placeholder="+7 999 000 00 00" />
            {/snippet}
          </FormField>
        </div>
      </section>
    {/if}

    {#if is("inline-sheet")}
      <section class="demo">
        <h2>Composed / InlineSheet</h2>
        <InlineSheet title="Booking summary">
          2 nights, 1 guest
          {#snippet footer()}
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Save</Button>
          {/snippet}
        </InlineSheet>
      </section>
    {/if}

    {#if is("progressive-image-slider")}
      <section class="demo">
        <h2>Composed / ProgressiveImageSlider</h2>
        <div class="slider-wrap">
          <ProgressiveImageSlider {slides} />
        </div>
      </section>
    {/if}

    {#if is("switch")}
      <section class="demo">
        <h2>Composed / Switch</h2>
        <Switch checked={isOn} onCheckedChange={(next) => (isOn = next)}>Notifications</Switch>
      </section>
    {/if}

    {#if is("tabs")}
      <section class="demo">
        <h2>Composed / Tabs</h2>
        <Tabs items={tabs} value={activeTab} onTabChange={(id) => (activeTab = id)} />
        <TabPanel tabId="overview" activeId={activeTab}>Overview panel</TabPanel>
        <TabPanel tabId="details" activeId={activeTab}>Details panel</TabPanel>
        <p class="demo__note">Keyboard: используйте ArrowLeft/ArrowRight/Home/End.</p>
      </section>
    {/if}

    {#if is("tab-panel")}
      <section class="demo">
        <h2>Composed / TabPanel</h2>
        <TabPanel tabId="overview" activeId="overview">Single panel example</TabPanel>
      </section>
    {/if}

    {#if is("toast")}
      <section class="demo">
        <h2>Composed / Toast</h2>
        <p class="demo__note">
          Живые карточки уходят в фиксированный стек справа сверху (как у macOS). Ниже — те же тона в потоке
          документа для сравнения.
        </p>
        <div class="row">
          <Button variant="secondary" onclick={() => pushDemoToast("info", "Yaray", "Новое сообщение в чате")}>
            Info
          </Button>
          <Button variant="secondary" onclick={() => pushDemoToast("success", "Сохранено", "Изменения применены.")}>
            Success
          </Button>
          <Button variant="secondary" onclick={() => pushDemoToast("warning", "Внимание", "Сессия скоро истечёт.")}>
            Warning
          </Button>
          <Button variant="secondary" onclick={() => pushDemoToast("error", "Ошибка", "Не удалось отправить.")}>
            Error
          </Button>
        </div>
        <div class="stack narrow">
          <Toast tone="info">Info message (inline)</Toast>
          <Toast tone="success">Saved successfully (inline)</Toast>
        </div>
      </section>
    {/if}

    {#if is("top-bar")}
      <section class="demo">
        <h2>Composed / TopBar</h2>
        <TopBar>
          <strong>Yaray</strong>
          {#snippet trailing()}
            <Button variant="ghost">Help</Button>
          {/snippet}
        </TopBar>
      </section>
    {/if}

    {#if is("banner")}
      <section class="demo">
        <h2>Patterns / Banner</h2>
        <Banner tone="info">Update available</Banner>
      </section>
    {/if}

    {#if is("empty-state")}
      <section class="demo">
        <h2>Patterns / EmptyState</h2>
        <EmptyState title="Nothing found" description="Try another filter">
          <Button>Reset</Button>
        </EmptyState>
      </section>
    {/if}

    {#if is("metric-card")}
      <section class="demo">
        <h2>Patterns / MetricCard</h2>
        <ul class="metrics">
          <MetricCard value="98%" label="Quality" />
          <MetricCard value="4.9" label="Rating" />
        </ul>
      </section>
    {/if}

    {#if is("search-bar")}
      <section class="demo">
        <h2>Patterns / SearchBar</h2>
        <SearchBar onSearch={() => {}} />
      </section>
    {/if}

    {#if is("section")}
      <section class="demo">
        <h2>Patterns / Section</h2>
        <Section title="Featured">
          <Card pad>Section content</Card>
        </Section>
      </section>
    {/if}
  </div>

  <ToastRegion>
    {#each demoToasts as item (item.id)}
      <Toast
        tone={item.tone}
        title={item.title}
        role={item.tone === "error" ? "alert" : "status"}
        onDismiss={() => dismissDemoToast(item.id)}
      >
        {item.message}
      </Toast>
    {/each}
  </ToastRegion>
</ThemeProvider>

<style>
  .page {
    display: grid;
    gap: 1rem;
    max-width: 980px;
    margin: 0 auto;
    padding: 1rem;
  }
  .hero h1 {
    margin: 0;
    font-size: 1.5rem;
  }
  .hero p {
    margin: 0.25rem 0 0;
    color: var(--ui-text-muted, #667085);
  }
  .demo {
    border: 1px solid var(--ui-border, #d0d5dd);
    border-radius: 14px;
    background: var(--ui-surface, #fff);
    padding: 0.9rem;
    display: grid;
    gap: 0.75rem;
  }
  .demo h2 {
    margin: 0;
    font-size: 1rem;
  }
  .demo__note {
    margin: 0;
    font-size: 0.86rem;
    color: var(--ui-text-muted, #667085);
  }
  .state-grid {
    display: grid;
    gap: 0.65rem;
  }
  .state-item {
    display: grid;
    gap: 0.45rem;
  }
  .state-label {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--ui-text-muted, #667085);
  }
  .row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .stack {
    display: grid;
    gap: 0.6rem;
  }
  .narrow {
    max-width: 360px;
  }
  .image-wrap {
    max-width: 420px;
    aspect-ratio: 16 / 10;
  }
  .slider-wrap {
    max-width: 680px;
  }
  .mobile-hint {
    border-top: 1px dashed var(--ui-border, #d0d5dd);
    padding-top: 0.8rem;
  }
  .metrics {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.5rem;
    max-width: 320px;
  }
  @media (min-width: 700px) {
    .page {
      padding: 1.2rem;
    }
    .state-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
