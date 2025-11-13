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

## Развертывание в продакшн (Docker)

### Сборка Docker образа

```bash
# Сборка с указанием URL API бэкенда
docker build --build-arg VITE_API_URL=https://api.example.com/api/v1 -t vkr-frontend:latest .

# Или с дефолтным значением (/api/v1)
docker build -t vkr-frontend:latest .
```

### Запуск контейнера на сервере

#### Вариант 1: Прямой запуск через docker run

```bash
# Запуск контейнера на порту 80
docker run -d \
  -p 80:80 \
  --name vkr-frontend \
  --restart unless-stopped \
  vkr-frontend:latest

# Или если нужно использовать другой порт (например, 3000)
docker run -d \
  -p 3000:80 \
  --name vkr-frontend \
  --restart unless-stopped \
  vkr-frontend:latest
```

#### Вариант 2: Запуск с логами

```bash
docker run -d \
  -p 80:80 \
  --name vkr-frontend \
  --restart unless-stopped \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  vkr-frontend:latest
```

#### Вариант 3: Запуск через docker-compose (рекомендуется)

Создайте файл `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_API_URL: https://your-api-domain.com/api/v1
    ports:
      - "80:80"
    restart: unless-stopped
    container_name: vkr-frontend
```

Запустите:
```bash
docker-compose up -d
```

#### Управление контейнером

```bash
# Просмотр логов
docker logs vkr-frontend

# Просмотр логов в реальном времени
docker logs -f vkr-frontend

# Остановка контейнера
docker stop vkr-frontend

# Запуск остановленного контейнера
docker start vkr-frontend

# Перезапуск контейнера
docker restart vkr-frontend

# Удаление контейнера
docker rm vkr-frontend

# Удаление контейнера и образа
docker rm vkr-frontend
docker rmi vkr-frontend:latest
```

#### Проверка работы

После запуска контейнера проверьте:

```bash
# Проверка статуса контейнера
docker ps | grep vkr-frontend

# Проверка доступности через curl
curl http://localhost

# Или откройте в браузере
# http://your-server-ip
```

### Развертывание в Kubernetes

Пример манифеста для Kubernetes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vkr-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vkr-frontend
  template:
    metadata:
      labels:
        app: vkr-frontend
    spec:
      containers:
      - name: frontend
        image: vkr-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: vkr-frontend-service
spec:
  selector:
    app: vkr-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

### Важные замечания

- **VITE_API_URL** должен быть указан при сборке образа через `--build-arg`
- Если `VITE_API_URL` не указан при сборке, используется значение по умолчанию `/api/v1`
- В продакшн окружении API должен быть доступен по указанному URL
- Nginx настроен для работы с SPA (Single Page Application) - все маршруты перенаправляются на `index.html`
- Статические ресурсы кешируются на 1 год, `index.html` не кешируется
