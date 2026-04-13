# Liquid Glass Style Guide (Yaray UI Kit)

Единый гайд по применению стиля **Liquid Glass** для всех компонентов в `yaray-ui-kit-hid`.

Документ основан на:
- [Apple — Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass)
- [Habr — CSS реализация Liquid Glass](https://habr.com/ru/articles/974058/)

---

## 1. Цели и рамки

### Цель
Создать единый визуальный язык стеклянного слоя, который:
- подчеркивает контент, а не спорит с ним;
- работает mobile-first;
- масштабируется на все компоненты без перегруза эффектами;
- сохраняет доступность и производительность.

### Ограничения проекта
- Не использовать модальные окна (`Modal`, `Dialog`, `AlertDialog`).
- Предпочитать inline- и layered-паттерны (`InlineSheet`, секции, встроенные панели).

---

## 2. Базовые принципы Liquid Glass

1. **Слойность:** Liquid Glass применяется к слою управления и навигации, а основной контент остается читаемым под ним.
2. **Умеренность:** эффект использовать точечно на ключевых интерактивных элементах.
3. **Системность:** не смешивать большое количество кастомных фонов/теней в control-слое.
4. **Согласованная геометрия:** скругления вложенных элементов должны быть концентричными контейнеру.
5. **Состояния важнее декора:** hover/focus/pressed/disabled обязаны оставаться различимыми при любой прозрачности.

---

## 3. Дизайн-токены (обязательный минимум)

Использовать единые переменные в `tokens.css`/`theme.css`:

- `--lg-surface`: базовая стеклянная подложка (полупрозрачная).
- `--lg-border`: тонкая светлая обводка стекла.
- `--lg-blur`: интенсивность blur.
- `--lg-highlight`: верхний световой блик.
- `--lg-shadow-soft`: мягкая внешняя тень.
- `--lg-shadow-inner`: внутренняя тень/подсветка.
- `--lg-tint`: легкий цветовой тон стекла.
- `--lg-radius-sm|md|lg|xl`: шкала радиусов.
- `--lg-contrast-overlay`: подложка для усиления контраста текста/иконок.

### Рекомендованный старт
- Background: `rgba(255, 255, 255, 0.10..0.18)` (для dark подобрать отдельные значения).
- Border: `1px solid rgba(255, 255, 255, 0.18..0.28)`.
- Blur: `8..20px` в зависимости от размера элемента.
- Не использовать тяжелые фильтры одновременно на больших областях экрана.

---

## 4. Техническая реализация (CSS)

### Базовый класс стекла

```css
.lg-surface {
  background: var(--lg-surface);
  border: 1px solid var(--lg-border);
  backdrop-filter: blur(var(--lg-blur));
  -webkit-backdrop-filter: blur(var(--lg-blur));
  box-shadow: var(--lg-shadow-soft), inset 0 1px 0 var(--lg-highlight);
}
```

### Опциональный "liquid" эффект с displacement map

Применять только для акцентных компонентов (например, `TopBar`, `InlineSheet`, primary CTA), не глобально.

```css
@supports not (hanging-punctuation: first) {
  .lg-surface--liquid {
    backdrop-filter: url(#displacementFilter) blur(calc(var(--lg-blur) * 0.5));
  }
}
```

### Fallback-стратегия
- Если `backdrop-filter` недоступен: перейти на более плотный полупрозрачный фон + мягкая тень.
- Если включен reduced transparency: отключить blur и повысить непрозрачность подложки.
- Если включен reduced motion: отключить morph/пружинные переходы, оставить короткие opacity/color transition.

---

## 5. Доступность (A11y)

- Контраст текста и иконок поверх стекла должен быть стабильно читаемым на светлом и сложном фоне.
- Для иконок всегда задавать явный `aria-label`.
- Focus ring не должен теряться из-за blur/бликов.
- Не полагаться только на прозрачность для передачи состояния (`error/success/disabled`).
- Проверять интерфейс с настройками `reduce motion` и `reduce transparency`.

---

## 6. Motion и интерактивность

- Взаимодействия должны быть "fluid", но короткими:
  - hover/focus: `120-180ms`
  - press/release: `80-140ms`
  - expand/collapse: `180-260ms`
- Избегать одновременно:
  - больших blur + сложных теней + displacement-анимаций.
- На слабых устройствах автоматически упрощать слой эффектов.

---

## 7. Правила по группам компонентов

## 7.1 Navigation layer

Компоненты: `TopBar`, `Tabs`, `TabPanel`, будущие `Breadcrumbs`, `DropdownMenu`.

- Этот слой — главный кандидат для Liquid Glass.
- Сохранять четкое отделение от контента.
- Не перегружать несколькими полупрозрачными перекрывающимися панелями.
- Для прокрутки контента под навигацией предусматривать контрастный edge/fade-эффект.

## 7.2 Form controls

Компоненты: `Input`, `Select`, `Switch`, `FormField`, `DateRangePicker`, будущие `Textarea`, `Checkbox`, `RadioGroup`, `Form`.

- На control-компонентах стекло использовать мягко: приоритет читаемости полей и лейблов.
- Ошибки/валидация должны иметь четкую цветовую и типографическую дифференциацию.
- Плотность и размер попадания (hit area) — mobile-first, минимум `44px` по высоте для touch-контролов.
- Для `Select` и будущих popup-слоев использовать не modal-паттерн, а inline/dropdown слой.

## 7.3 Action components

Компоненты: `Button`, `IconButton`, `Chip`, будущие `Badge`, `Tag`.

- Primary действия: усиленный glass-стиль (`prominent glass`).
- Secondary/ghost: более прозрачный слой без агрессивного blur.
- `IconButton` всегда с явным `aria-label`, достаточным контрастом и заметным focus-state.

## 7.4 Feedback & status

Компоненты: `Toast`, `Banner`, `EmptyState`, `MetricCard`, будущие `Skeleton`, `Spinner`, `InlineNotification`, `Progress`.

- `Toast` и `Banner` могут использовать glass как контейнер, но не терять смысловые цвета состояния.
- `Skeleton` должен быть матовым/полупрозрачным, без шумных эффектов.
- `MetricCard` и статусные элементы: минимальный blur, акцент на цифры/данные.

## 7.5 Content containers

Компоненты: `Card`, `Section`, `InlineSheet`, `ProgressiveImage`, `ProgressiveImageSlider`, будущие `Accordion`, `Table`, `Pagination`.

- Для больших контейнеров не использовать тяжелый liquid-эффект на всю площадь.
- Визуальная глубина достигается слоями: фон -> стеклянный control слой -> контент.
- Для `Table`/`Pagination` приоритет — читаемость данных, не декоративность.

---

## 8. Правила по каждому текущему компоненту

| Компонент | Режим Liquid Glass | Комментарий |
|---|---|---|
| `ThemeProvider` | Infrastructure | Хранит токены и варианты прозрачности/контраста |
| `ThemeSwitch` | Medium | Яркий focus/checked-state, без тяжелого blur |
| `DateRangePicker` | Medium | Максимум читаемости дат и состояний |
| `Button` | High/Medium | `primary` — prominent glass, `ghost` — soft glass |
| `Card` | Low/Medium | Для крупных карточек использовать мягкий glass |
| `Chip` | Low | Тонкая подложка, акцент на текст |
| `IconButton` | High | Контраст, понятный hover/focus, aria-label |
| `Input` | Low/Medium | Минимальный blur, четкая типографика |
| `Link` | None/Low | Обычно без glass, только в навслое |
| `ProgressiveImage` | Low | Эффект стекла только поверх управляющих элементов |
| `Select` | Medium | Триггер soft glass, список — легкий glass/dropdown |
| `FormField` | Low | Акцент на структуру и helper/error text |
| `InlineSheet` | High | Один из ключевых glass-контейнеров вместо modal |
| `ProgressiveImageSlider` | Medium | Glass только на controls/overlays |
| `Switch` | Medium | Явная разница `on/off`, читаемая дорожка и thumb |
| `Tabs` | High | Навигационный слой, glass уместен |
| `TabPanel` | Low | Скорее контентная область, не перегружать эффектом |
| `Toast` | Medium | Glass + четкие status colors |
| `TopBar` | High | Основной кандидат на Liquid Glass |
| `Banner` | Medium | Смысловой цвет важнее эффекта |
| `EmptyState` | Low | Эффект минимальный, фокус на сообщении/CTA |
| `MetricCard` | Low/Medium | Акцент на данных и контрасте |
| `SearchBar` | High | Ключевая control-точка, но без визуального шума |
| `Section` | Low | Контейнерный элемент, мягкий слой |

---

## 9. Do / Don't

### Do
- Использовать glass в навигации и ключевых controls.
- Тестировать light/dark + accessibility настройки.
- Держать единый scale радиусов, отступов и интенсивности blur.
- Проверять mobile-first поведение на малых экранах.

### Don't
- Не применять liquid-эффект ко всем компонентам подряд.
- Не накладывать несколько сильных стеклянных панелей друг на друга.
- Не жертвовать контрастом ради визуального эффекта.
- Не строить UX на модальных паттернах.

---

## 10. Чеклист внедрения для каждого нового компонента

1. Компонент относится к control/navigation слою?  
   Если нет — использовать упрощенный glass или без него.
2. Проверен контраст в light/dark?
3. Есть состояния `hover/focus/active/disabled/error`?
4. Есть fallback без `backdrop-filter`?
5. Поведение проверено с reduced motion/transparency?
6. Проверен FPS на слабом устройстве?
7. Mobile-first: touch area и плотность соответствуют?

---

## 11. Этапы внедрения в UI Kit

1. Вынести liquid tokens и utility-классы в `src/styles/tokens.css` и `src/styles/theme.css`.
2. Обновить `TopBar`, `Tabs`, `Button`, `InlineSheet`, `SearchBar` (первая волна).
3. Обновить form-компоненты (`Input`, `Select`, `Switch`, `DateRangePicker`) с приоритетом доступности.
4. Добавить guardrails по перформансу и fallback-модификаторы.
5. Зафиксировать визуальные примеры в `AllComponentsShowcase.svelte`.

