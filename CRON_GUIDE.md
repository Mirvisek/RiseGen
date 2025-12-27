# 🕒 Instrukcja Konfiguracji Zadań Automatycznych (CRON)

Ten projekt zawiera endpointy API przeznaczone do automatycznego wywoływania przez systemowe zadania Cron (np. backupy bazy danych).

## 1. Konfiguracja Zabezpieczeń

Zanim ustawisz Crona, musisz dodać sekretny token do pliku `.env` na serwerze:

```env
CRON_SECRET="twoj-bardzo-silny-sekret"
```

Ten sam token musi być przekazywany w adresie URL jako parametr `token`.

---

## 2. Rozwiązanie A: Crontab (Zalecane dla VPS)

Jeśli Twój projekt działa na VPS (np. przez PM2 lub Docker), użyj systemowego harmonogramu zadań Linux.

### Krok 1: Otwórz edytor crontab
```bash
crontab -e
```

### Krok 2: Dodaj zadanie backupu
Aby wykonywać backup codziennie o **3:00 rano**, dodaj poniższą linię na końcu pliku (zamień `TWOJA_DOMENA` i `TWOJ_TOKEN`):

```bash
0 3 * * * curl -X GET "https://TWOJA_DOMENA.pl/api/cron/backup?token=TWOJ_TOKEN" > /dev/null 2>&1
```

*   `0 3 * * *` - oznacza godzinę 03:00 każdego dnia.
*   `curl -X GET` - wysyła zapytanie do API.
*   `> /dev/null 2>&1` - ignoruje logi, aby nie zaśmiecać maila systemowego.

---

## 3. Rozwiązanie B: Vercel Cron (Jeśli używasz Vercel)

Jeśli hostujesz aplikację na Vercel, utwórz plik `vercel.json` w głównym katalogu projektu:

```json
{
  "crons": [
    {
      "path": "/api/cron/backup?token=TWOJ_TOKEN_Z_ENV",
      "schedule": "0 3 * * *"
    }
  ]
}
```
*Uwaga: W Vercel lepiej jest pobierać token bezpośrednio ze zmiennych środowiskowych w kodzie, co już robimy.*

---

## 4. Ręczny Test

Możesz w każdej chwili przetestować, czy backup działa, wpisując w przeglądarce lub terminalu:

```bash
curl "http://localhost:3000/api/cron/backup?token=TWOJ_SEKRET"
```

**Oczekiwana odpowiedź (JSON):**
```json
{
  "success": true,
  "backup": "backup-2025-12-27T03-30-00-000Z.db",
  "count": 10
}
```

---

## 5. Gdzie szukać kopii?

Kopie zapasowe bazy danych SQLite są zapisywane w folderze `backups/` w głównym katalogu projektu. System automatycznie przechowuje tylko **10 ostatnich plików**, usuwając starsze.

> **Wskazówka:** Zaleca się, aby folder `backups/` był regularnie synchronizowany z zewnętrznym dyskiem lub chmurą (np. rclone).
