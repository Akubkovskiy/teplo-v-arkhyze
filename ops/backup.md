# Backup перед изменениями

Сайт не полностью stateless: кроме git-кода есть `.env`, Postgres volume и серверный edge nginx. Перед любым рискованным изменением сохранять все три слоя или явно фиксировать, почему конкретный слой не затрагивается.

## Что сохранять

### Приложение сайта

- текущий git commit;
- `.env` в защищенном хранилище, без публикации содержимого;
- состояние и backup Postgres volume;
- список внешних Docker-сетей и compose-конфигурация.

### Edge nginx

На FI это отдельный runtime-путь `/root/teplo`:

```bash
ssh fin
cd /root/teplo
TS=$(date -u +%Y%m%dT%H%M%SZ)
mkdir -p "/root/teplo/backups/$TS"
cp -a nginx.conf docker-compose.yml "/root/teplo/backups/$TS/"
docker compose config --quiet
docker network inspect teplo-site_default easycamp-bot_default > "/root/teplo/backups/$TS/networks.json"
sha256sum nginx.conf docker-compose.yml > "/root/teplo/backups/$TS/SHA256SUMS"
```

Если конфигурация использует сертификаты, credentials или дополнительные mounts, сохранить только защищенную копию этих файлов и записать их наличие в backup-манифесте. Секреты не помещать в git, README или обычный вывод команд.

## Правила

- Backup делать до `docker compose up --force-recreate` и до изменения DNS/маршрутизации.
- Не считать backup успешным, пока не проверены файлы, хеши и существование сетей.
- Не удалять Postgres volume ради «чистого запуска».
- Не считать исторический backup `20260825T120017Z` безопасной точкой отката: он содержит старую сломанную edge-конфигурацию до исправления file descriptor exhaustion.
- После каждого изменения записывать UTC-время, измененный слой, backup-путь и результаты приемки в `memory/logs/YYYY-MM-DD.md`.

## Текущий пробел

Автоматическая периодическая копия Postgres, SQLite EasyCamp, сертификатов и edge-конфигурации пока не оформлена единым job/runbook. Это отдельная задача инфраструктуры, которую нужно закрыть до масштабирования бронирований и подключения новых каналов продаж.
