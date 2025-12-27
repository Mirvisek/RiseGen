# ================================
# SZABLON ZMIENNYCH ŚRODOWISKOWYCH
# Dla wdrożenia na VPS Production
# ================================

# ----------------
# 1. BAZA DANYCH
# ----------------
# SQLite database file path (relative to project root)
DATABASE_URL="file:./dev.db"


# ----------------
# 2. NEXTAUTH (AUTORYZACJA)
# ----------------
# Wygeneruj silny sekret komendą: openssl rand -base64 32
NEXTAUTH_SECRET="TUTAJ_WKLEJ_WYGENEROWANY_SEKRET"

# Pełny URL twojej domeny (bez trailing slash)
NEXTAUTH_URL="https://risegen.pl"


# ----------------
# 3. EMAIL (SMTP)
# ----------------
# Konfiguracja serwera SMTP do wysyłki emaili
SMTP_HOST="smtp.twoj-dostawca.com"
SMTP_PORT=587
SMTP_USER="twoj-email@domena.pl"
SMTP_PASSWORD="twoje-haslo-smtp"
SMTP_FROM="no-reply@risegen.pl"


# ----------------
# 4. RECAPTCHA (Ochrona formularzy)
# ----------------
# Zarejestruj się na: https://www.google.com/recaptcha/admin
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Le..."
RECAPTCHA_SECRET_KEY="6Le..."


# ----------------
# 5. GOOGLE ANALYTICS (Opcjonalne)
# ----------------
# ID Google Analytics (jeśli używasz)
# NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"


# 5. GOOGLE ANALYTICS (Opcjonalne)
# ----------------
# ID Google Analytics (jeśli używasz)
# NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# ----------------
# 6. SENTRY (Monitoring błędów)
# ----------------
# ID Twojego projektu w Sentry
NEXT_PUBLIC_SENTRY_DSN="https://..."

# ----------------
# 7. CRON (Zadania automatyczne)
# ----------------
# Sekretny token do wyzwalania zadania backupu /api/cron/backup?token=...
CRON_SECRET="silny-sekret-do-cron"


# ================================
# INSTRUKCJE:
# ================================

# 1. Skopiuj ten plik jako .env w głównym katalogu projektu:
#    cp ENV_TEMPLATE.md .env

# 2. Wypełnij wszystkie wartości oznaczone jako "TUTAJ_..."

# 3. Wygeneruj bezpieczny NEXTAUTH_SECRET:
#    openssl rand -base64 32

# 4. Upewnij się, że plik .env NIE jest commitowany do git
#    (powinien być w .gitignore)

# 5. Nadaj odpowiednie uprawnienia:
#    chmod 600 .env
