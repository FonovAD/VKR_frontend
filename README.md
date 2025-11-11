# VKR Frontend

Фронтенд приложение для системы управления музеями, построенное на React + TypeScript + Vite.

## Технологии

- **React 18** — библиотека для создания пользовательских интерфейсов
- **TypeScript** — типизированный JavaScript
- **Vite** — быстрый инструмент сборки
- **React Router** — маршрутизация
- **React Hook Form** — управление формами
- **Axios** — HTTP клиент
- **Tailwind CSS** — utility-first CSS фреймворк

## Функциональность

- Управление организациями (просмотр, создание, обновление, удаление)
- Работа с музеями и всеми их характеристиками, возвращаемыми бэкендом
- Учет видов деятельности музеев
- Просмотр трудовых ресурсов организации
- Поиск по ИНН и связь данных между сущностями
- Адаптивный интерфейс и удобные формы

## Установка и запуск

1. Установите зависимости:

```bash
npm install
```

2. (Опционально) Создайте файл `.env` в корне проекта:

```env
VITE_API_URL=http://localhost:8081/api/v1
```

3. Запустите dev сервер:

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в папке `dist`

## Структура проекта

```
src/
  ├── api/           # API клиент для взаимодействия с бэкендом
  ├── components/    # Reusable компоненты
  ├── pages/         # Страницы приложения
  ├── types/         # TypeScript типы DTO
  ├── App.tsx        # Главный компонент приложения
  └── main.tsx       # Точка входа
```

## API Endpoints

Приложение использует следующие эндпоинты бэкенда:

### Организации
- `GET /api/v1/organization` — список организаций
- `GET /api/v1/organization/:id` — организация по ID
- `POST /api/v1/organization` — создание организации
- `PUT /api/v1/organization/:id` — обновление организации
- `DELETE /api/v1/organization/:id` — удаление организации
- `GET /api/v1/organization/search/by-inn?inn=...` — поиск организации по ИНН

### Музеи
- `GET /api/v1/museum` — список музеев
- `GET /api/v1/museum/:id` — музей по ID
- `POST /api/v1/museum` — создание музея
- `PUT /api/v1/museum/:id` — обновление музея
- `DELETE /api/v1/museum/:id` — удаление музея
- `GET /api/v1/museum/search/by-inn?inn=...` — поиск музея по ИНН
- `GET /api/v1/museum/owner/:owner_id` — список музеев по организации

### Деятельность музеев
- `GET /api/v1/activity` — список записей
- `GET /api/v1/activity/search/by-inn?inn=...` — деятельность по ИНН
- `POST /api/v1/activity` — создание записи
- `PUT /api/v1/activity` — обновление записи
- `DELETE /api/v1/activity?inn=...&activity_type_id=...&visitor_category=...&year=...` — удаление записи

### Трудовые ресурсы
- `GET /api/v1/labor/organization/:org_id` — трудовые ресурсы по ID организации
- `GET /api/v1/labor/search/by-inn?inn=...` — трудовые ресурсы по ИНН

## Настройка бэкенда

Убедитесь, что ваш бэкенд работает на порту `8081` (или скорректируйте `vite.config.ts` и `.env`).

В режиме разработки Vite проксирует все запросы к `/api` на `http://localhost:8081`.
