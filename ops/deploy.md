# Деплой и проверка

Документ описывает два разных слоя продакшена. Репозиторий сайта и edge nginx нельзя деплоить одной командой.

## Перед началом

Работать с FI через SSH-профиль `fin` (`144.31.185.177`). Сначала проверить:

```bash
ssh fin
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
docker network inspect teplo-site_default easycamp-bot_default
```

Убедиться, что `teplo-nginx`, `frontend`, `api`, `db`, `easycamp_bot`, а также VPN-контейнеры работают до изменения. Сохранить их start time и restart count, если изменение касается только сайта.

Не менять в рамках обычного деплоя сайта:

- DNS-записи `teplo-v-arkhyze.ru` и `kub.teplo-v-arkhyze.ru`;
- `XRAY_SUBSCRIPTION_URL_PREFIX`;
- контейнеры Marzban, Xray, Hysteria, `vpn-orchestrator` и `vpn-sub-proxy`;
- базу EasyCamp и ее SQLite-файл.

## Деплой приложения сайта

Путь на FI: `/root/teplo-v-arkhyze`. Этот compose управляет только `frontend`, `api` и `db`.

Перед запуском:

```bash
cd /root/teplo-v-arkhyze
git status --short
test -f .env
docker compose config --quiet
```

Для изменений только frontend/API:

```bash
docker compose up -d --build frontend api
docker compose ps
```

Не использовать `docker compose down`. Не добавлять `db` в команду без необходимости: Postgres хранит состояние в volume, а лишнее пересоздание увеличивает риск простоя и ошибки подключения.

Проверить локальные upstream:

```bash
curl -fsS http://127.0.0.1:3000/
curl -fsS http://127.0.0.1:8001/health
```

Затем проверить публичные маршруты снаружи:

```bash
curl -k -sS -o /dev/null -w '%{http_code} %{url_effective}\n' https://teplo-v-arkhyze.ru/
curl -k -sS -o /dev/null -w '%{http_code}\n' https://teplo-v-arkhyze.ru/api/houses
curl -k -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' https://www.teplo-v-arkhyze.ru/
```

## Деплой edge nginx

Путь: `/root/teplo`. Этот каталог не является текущим содержимым репозитория сайта и должен проверяться отдельно.

Перед изменением создать backup:

```bash
cd /root/teplo
TS=$(date -u +%Y%m%dT%H%M%SZ)
mkdir -p "/root/teplo/backups/$TS"
cp -a nginx.conf docker-compose.yml "/root/teplo/backups/$TS/"
sha256sum nginx.conf docker-compose.yml > "/root/teplo/backups/$TS/SHA256SUMS"
```

Проверить, что внешние сети существуют:

```bash
docker network inspect teplo-site_default
docker network inspect easycamp-bot_default
docker compose config --quiet
```

Перед пересозданием проверить конфигурацию nginx. Если новый файл уже примонтирован в текущий контейнер:

```bash
docker exec teplo-nginx nginx -t
```

Пересоздать только edge контейнер:

```bash
docker compose up -d --force-recreate --no-deps teplo-nginx
```

Не запускать `docker compose down` и не пересоздавать `frontend`, `api`, `db` или EasyCamp ради изменения nginx.

## Обязательная приемка

```bash
curl -k -sS -o /dev/null -w '%{http_code}\n' https://teplo-v-arkhyze.ru/
curl -k -sS -o /dev/null -w '%{http_code}\n' https://teplo-v-arkhyze.ru/api/houses
curl -k -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' https://www.teplo-v-arkhyze.ru/
curl -k -sS -o /dev/null -w '%{http_code}\n' https://kub.teplo-v-arkhyze.ru/
curl -k -sS -o /dev/null -w '%{http_code}\n' https://teplo-v-arkhyze.ru/ws3780444d
docker compose ps
docker logs --since 10m teplo-nginx 2>&1 | grep -Ei 'accept4|No file descriptors|host not found|upstream'
```

Ожидаемые HTTP-результаты: сайт `200`, API `200`, `www` `301`, `kub` `200`, legacy `/ws3780444d` `410`. Последняя команда может не вернуть строк; это хороший результат. Для проверки локального FI vhost использовать `curl --resolve`, а не `https://127.0.0.1`, иначе можно получить ложный редирект из-за TLS/SNI.

Проверить, что после edge-деплоя не выросли restart count у `frontend`, `api`, `db`, `easycamp_bot` и VPN-контейнеров.

## Rollback

Откатить edge можно только на backup, который был сделан перед конкретным изменением:

```bash
cd /root/teplo
cp -a /root/teplo/backups/<UTC_TIMESTAMP>/nginx.conf /root/teplo/nginx.conf
cp -a /root/teplo/backups/<UTC_TIMESTAMP>/docker-compose.yml /root/teplo/docker-compose.yml
docker compose config --quiet
docker compose up -d --force-recreate --no-deps teplo-nginx
```

Backup `20260825T120017Z` содержит исходную конфигурацию до исправления инцидента с исчерпанием file descriptors. Это исторический forensic backup, а не автоматически безопасная точка отката.

Для приложения откатывать сначала git checkout на известный рабочий commit, затем пересоздавать только изменившиеся `frontend`/`api` и повторять приемку. Postgres не откатывать вместе с кодом без совместимой миграции и отдельной копии данных.
