# Component Gap Analysis

Документ фиксирует:
- какие компоненты уже есть в `yaray-ui-kit-hid`;
- какие компоненты типично есть в `shadcn/ui`, `Ant Design`, `MUI`, `Chakra UI`;
- какие компоненты нужно реализовать в нашем UI kit в первую очередь.

## 1) Текущее покрытие (уже реализовано)

### Primitives
- `Button`
- `Card`
- `Chip` (аналог `Tag/Badge` в базовом виде)
- `IconButton`
- `Input`
- `Link`
- `Select`
- `ProgressiveImage`

### Composed
- `FormField`
- `InlineSheet`
- `ProgressiveImageSlider`
- `Switch`
- `Tabs`
- `TabPanel`
- `Toast`
- `TopBar`

### Patterns
- `Banner` (близко к `Alert`)
- `EmptyState`
- `MetricCard` (частично `Statistic`)
- `SearchBar`
- `Section`

### Core
- `ThemeProvider`
- `ThemeSwitch`
- `DateRangePicker` (частичное покрытие `DatePicker/RangePicker`)

## 2) Компоненты, которые стоит реализовать

Ниже — целевой backlog. Приоритизация сделана по практической ценности и частоте использования.

> Ограничение проекта: **не использовать модальные окна**.  
> Поэтому `Modal`, `Dialog`, `AlertDialog` и похожие блокирующие паттерны в план не включены.

## P0 (обязательно, базовый слой)

| Компонент | Аналоги (shadcn / Ant / др.) | Зачем нужен |
|---|---|---|
| `Textarea` | `textarea` / `Input.TextArea` / `Textarea` | Формы, комментарии, описания |
| `Checkbox` | `checkbox` / `Checkbox` | Базовый выбор в формах и фильтрах |
| `RadioGroup` + `Radio` | `radio-group` / `Radio` | Взаимоисключающий выбор |
| `Label` | `label` / `Form.Item label` / `FormLabel` | Доступность и консистентность форм |
| `Badge` | `badge` / `Badge` / `Badge` | Статусы, счетчики, маркеры |
| `Spinner` / `Loader` | `skeleton`/loading patterns / `Spin` / `CircularProgress` | Явные состояния загрузки |
| `Skeleton` | `skeleton` / `Skeleton` | UX при загрузке контента |
| `Divider` | `separator` / `Divider` | Визуальное разделение блоков |
| `Form` (композит) | `form` / `Form` / `FormControl` | Единая архитектура валидации и состояний |

## P1 (высокий приоритет, data + navigation)

| Компонент | Аналоги (shadcn / Ant / др.) | Зачем нужен |
|---|---|---|
| `Table` | `table` / `Table` / `Table` | Админ/кабинетные списки и данные |
| `Pagination` | `pagination` / `Pagination` | Длинные списки |
| `Accordion` / `Collapse` | `accordion` / `Collapse` | Компактные раскрывающиеся секции |
| `DropdownMenu` | `dropdown-menu` / `Dropdown` / `Menu` | Контекстные действия |
| `Tooltip` | `tooltip` / `Tooltip` | Подсказки и микро-UX |
| `Breadcrumbs` | `breadcrumb` / `Breadcrumb` | Навигация по иерархии |
| `Avatar` | `avatar` / `Avatar` | Профильные элементы |
| `Progress` | `progress` / `Progress` | Индикация выполнения |
| `Tag` (если нужен отдельно от `Chip`) | `badge/tag` / `Tag` | Фильтрация и категоризация |

## P2 (средний приоритет, расширение сценариев)

| Компонент | Аналоги (shadcn / Ant / др.) | Зачем нужен |
|---|---|---|
| `Combobox` / `Autocomplete` | `combobox`, `command` / `AutoComplete` | Быстрый выбор из больших списков |
| `MultiSelect` | community patterns / `Select[multiple]` / `Autocomplete multiple` | Фильтры и теги |
| `DatePicker` (single) + `TimePicker` | `calendar`/date patterns / `DatePicker`,`TimePicker` | Формы событий и бронирований |
| `Stepper` / `Steps` | steps patterns / `Steps` | Многошаговые процессы |
| `FileUploader` | upload patterns / `Upload` | Медиа и документы |
| `InlineNotification` | `alert` / `Alert`,`Result` | Нематовые системные сообщения |
| `CommandPalette` (если применимо) | `command` / — | Быстрые действия/поиск в приложении |

## 3) Что уже частично покрыто и требует эволюции

| Текущий компонент | Что улучшить |
|---|---|
| `Input` | Варианты `error`, `success`, `disabled`, `prefix/suffix`, `helper text` |
| `Select` | Поиск, группы, клавиатурная навигация, empty state |
| `Tabs` | Overflow на mobile-first, lazy panels, aria-улучшения |
| `Toast` | Централизованный manager + очередь + auto-dismiss |
| `DateRangePicker` | Локализация, пресеты, keyboard-only сценарии |
| `Chip` | Свести стратегию: `Chip` vs `Badge` vs `Tag` |
| `TopBar` | Паттерны для sticky/header actions и адаптивной навигации |

## 4) Что не планировать (по текущим правилам)

- `Modal`, `Dialog`, `AlertDialog`, blocking confirm-паттерны.
- Любые полноэкранные блокирующие окна, если можно решить через inline/push UI (`InlineSheet`, секции, маршрутизацию).

## 5) Рекомендуемый порядок реализации (шаги)

1. **Форма и состояние:** `Label`, `Textarea`, `Checkbox`, `RadioGroup`, `Form`.
2. **Состояния загрузки:** `Spinner`, `Skeleton`, `Divider`.
3. **Данные:** `Table`, `Pagination`, `Progress`.
4. **Навигация и действия:** `DropdownMenu`, `Tooltip`, `Breadcrumbs`, `Avatar`.
5. **Расширение:** `Autocomplete/Combobox`, `MultiSelect`, `DatePicker`, `FileUploader`, `Steps`.

## 6) Минимальный целевой набор (MVP компонентов для реализации)

Если нужен самый короткий practical shortlist на ближайший цикл:
- `Textarea`
- `Checkbox`
- `RadioGroup`
- `Label`
- `Form`
- `Skeleton`
- `Table`
- `Pagination`
- `DropdownMenu`
- `Tooltip`

