# 🧪 LOCAL TEST SETUP

## QUICK START (5 MINUTTER)

### 1️⃣ BACKEND SETUP

```bash
cd /Users/gl/ForbrugerAgenten/forbrugeragenten/backend

# Check .env exists (should already be there)
cat .env

# Install dependencies if needed
pip3 install -r requirements.txt

# Apply migrations (create tables)
python3 -c "
from sqlalchemy import create_engine, text
from app.core.config import settings
from app.core.database import Base
from app.models import User, MagicLink, Session, Message, Provider, NotificationPreferences, WaitlistEntry

engine = create_engine(str(settings.DATABASE_URL).replace('+asyncpg', ''))
Base.metadata.create_all(engine)
print('✅ All tables created!')
"

# Start backend
python3 main.py
```

**Backend should start on:** `http://localhost:8000`

---

### 2️⃣ FRONTEND SETUP

**Open NEW terminal:**

```bash
cd /Users/gl/ForbrugerAgenten/forbrugeragenten/frontend

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF

# Install dependencies if needed
npm install

# Start frontend
npm run dev
```

**Frontend should start on:** `http://localhost:3000`

---

### 3️⃣ VERIFY SETUP

**Check backend:**
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

**Check frontend:**
- Open: http://localhost:3000
- Should see homepage or redirect to /login

---

## ✅ IF EVERYTHING WORKS:

You should now have:
- ✅ Backend running on :8000
- ✅ Frontend running on :3000
- ✅ Database tables created
- ✅ Ready to test!

**Next:** Follow `TEST_COMPLETE_FLOW.md` starting from TEST 1

---

## 🐛 TROUBLESHOOTING

### Backend won't start?
```bash
# Check if port is in use
lsof -ti:8000 | xargs kill -9

# Check database connection
psql -U postgres -d forbrugeragent -c "SELECT 1;"
```

### Frontend won't start?
```bash
# Check if port is in use
lsof -ti:3000 | xargs kill -9

# Clear cache
rm -rf .next
npm run dev
```

### Database issues?
```bash
# Recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS forbrugeragent;"
psql -U postgres -c "CREATE DATABASE forbrugeragent;"

# Then re-run table creation script
```

---

## 📝 NOTES

- Backend API docs: http://localhost:8000/docs
- SendGrid emails won't actually send in local (check logs instead)
- Use test email: `test@example.com`




