# Восстановление

Восстановление разделено на приложение сайта и edge nginx. Сначала восстанавливается минимально необходимый слой, затем выполняются проверки, и только потом возвращаются дополнительные изменения.

## Что должно быть доступно

Для приложения:

- рабочий checkout `teplo-v-arkhyze`;
- `.env` из защищенного хранилища;
- Docker и Docker Compose;
- сохраненный Postgres volume или проверенный backup;
- внешняя Docker-сеть `easycamp-bot_default`.

Для edge:

- `/root/teplo/nginx.conf`;
- `/root/teplo/docker-compose.yml`;
- backup в `/root/teplo/backups/<UTC_TIMESTAMP>/`;
- внешние сети `teplo-site_default` и `easycamp-bot_default`;
- сертификаты и секретные файлы, если они вынесены в mounts.

Известный backup после инцидента 2026-08-25: `/root/teplo/backups/20260825T120017Z/`. Он содержит состояние до исправления и применяется только для расследования или осознанного возврата.

## Восстановление edge nginx

Если приложение и EasyCamp живы, но сломан edge:

```bash
ssh fin
cd /root/teplo
docker network inspect teplo-site_default easycamp-bot_default
cp -a /root/teplo/backups/<UTC_TIMESTAMP>/nginx.conf /root/teplo/nginx.conf
cp -a /root/teplo/backups/<UTC_TIMESTAMP>/docker-compose.yml /root/teplo/docker-compose.yml
docker compose config --quiet
docker compose up -d --force-recreate --no-deps teplo-nginx
docker exec teplo-nginx nginx -t
```

Затем выполнить приемку из `ops/deploy.md`. Если nginx не видит `easycamp_bot`, сначала проверить подключение контейнера к обеим сетям, а не менять DNS.

## Восстановление приложения

```bash
ssh fin
cd /root/teplo-v-arkhyze
test -f .env
docker compose config --quiet
docker compose up -d frontend api db
docker compose ps
curl -fsS http://127.0.0.1:3000/
curl -fsS http://127.0.0.1:8001/health
```

Если требуется вернуть данные Postgres, сначала остановить только зависимые app-контейнеры и получить подтверждение наличия backup. Не удалять volume командой `docker compose down -v`. После восстановления проверить совместимость схемы с кодом и только затем поднять `frontend` и `api`.

## Проверка после восстановления

1. `teplo-nginx`, `frontend`, `api`, `db` и `easycamp_bot` имеют состояние running/healthy.
2. Публичный сайт возвращает `200`.
3. `/api/houses` возвращает `200`.
4. `www` редиректит на основной домен.
5. `kub.teplo-v-arkhyze.ru` по-прежнему доступен.
6. Тестовый legacy маршрут отвечает `410`, если используется текущая защитная конфигурация.
7. В логах нет новых ошибок file descriptors, upstream DNS и TLS.
8. VPN-контейнеры и EasyCamp не получили лишних перезапусков.

## Ограничения

Восстановление Postgres, SQLite EasyCamp и сертификатов не автоматизировано одним скриптом. Их backup-пути и периодичность нужно отдельно закрепить в инфраструктурном runbook. До этого перед каждым рискованным изменением делать ручной backup и записывать его путь в журнал.

