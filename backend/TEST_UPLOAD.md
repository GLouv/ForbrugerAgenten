# 🧪 Testing Upload Endpoint

## Prerequisites

1. **Install Dependencies:**
```bash
pip install sendgrid openai fastapi uvicorn python-multipart
```

2. **Set Environment Variables:**
```bash
export OPENAI_API_KEY="your-openai-api-key"
export SENDGRID_API_KEY="your-sendgrid-key"
export DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/forbrugeragent"
```

3. **Start Server:**
```bash
cd /Users/gl/ForbrugerAgenten/forbrugeragenten/backend
uvicorn main:app --reload --port 8000
```

---

## Test 1: Get Auth Token

First, you need to authenticate:

```bash
# Request magic link
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Get debug magic link (development only)
curl http://localhost:8000/api/v1/auth/debug/magic-link/test@example.com

# Verify magic link (use token from above)
curl -X POST http://localhost:8000/api/v1/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "token": "YOUR_TOKEN_HERE"
  }'

# Save the session_token from response
export SESSION_TOKEN="your-session-token-here"
```

---

## Test 2: Upload Bill Image

### Option A: Upload with curl

```bash
# Upload a bill image
curl -X POST http://localhost:8000/api/v1/upload/bill \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -F "file=@/path/to/your/bill.jpg"
```

### Option B: Upload with Python

```python
import requests

# Your session token
session_token = "your-session-token"

# Upload file
with open("/path/to/bill.jpg", "rb") as f:
    response = requests.post(
        "http://localhost:8000/api/v1/upload/bill",
        headers={"Authorization": f"Bearer {session_token}"},
        files={"file": f}
    )

print(response.json())
```

### Expected Response:

```json
{
  "success": true,
  "message": "Regning uploaded og parsed! Fundet: Norlys - 450.0 kr/md",
  "contract_id": "uuid-here",
  "parsed_data": {
    "provider": "Norlys",
    "category": "energy",
    "monthly_price": 450.0,
    "currency": "DKK",
    "product_name": "Spotpris",
    "specs": {"type": "spot", "kwh_price": 0.5},
    "invoice_date": "2025-01-15"
  }
}
```

---

## Test 3: Get User Contracts

```bash
# Get all contracts for current user
curl http://localhost:8000/api/v1/upload/contracts \
  -H "Authorization: Bearer $SESSION_TOKEN"
```

Expected Response:
```json
[
  {
    "id": "uuid-here",
    "category": "energy",
    "provider": "Norlys",
    "name": "Spotpris",
    "monthly_price": 450.0,
    "currency": "DKK",
    "status": "active"
  }
]
```

---

## Test 4: Get Contract Details

```bash
# Get specific contract
curl http://localhost:8000/api/v1/upload/contracts/{contract_id} \
  -H "Authorization: Bearer $SESSION_TOKEN"
```

Expected Response:
```json
{
  "id": "uuid-here",
  "category": "energy",
  "provider": "Norlys",
  "name": "Spotpris",
  "monthly_price": 450.0,
  "currency": "DKK",
  "details": {"type": "spot", "kwh_price": 0.5},
  "status": "active",
  "start_date": null,
  "end_date": null,
  "created_at": "2025-12-17T20:00:00",
  "updated_at": "2025-12-17T20:00:00",
  "contract_file_url": null,
  "last_parsed_at": "2025-12-17T20:00:00"
}
```

---

## Test 5: Error Cases

### Invalid File Type:
```bash
curl -X POST http://localhost:8000/api/v1/upload/bill \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -F "file=@document.txt"

# Expected: 400 Bad Request
# "Unsupported file type: text/plain. Allowed: JPG, PNG, PDF"
```

### File Too Large:
```bash
# Upload file > 10MB
curl -X POST http://localhost:8000/api/v1/upload/bill \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -F "file=@huge_file.jpg"

# Expected: 400 Bad Request
# "File too large: 15.5MB. Max size: 10MB"
```

### No Authentication:
```bash
curl -X POST http://localhost:8000/api/v1/upload/bill \
  -F "file=@bill.jpg"

# Expected: 401 Unauthorized
# "Not authenticated"
```

---

## Sample Bill Images for Testing

You can use these types of bills:
1. **Energy Bill** (Norlys, Ørsted, Andel)
2. **Mobile Bill** (Telenor, TDC, 3)
3. **Internet Bill** (YouSee, Stofa, Fastspeed)

Make sure the bill image:
- Is clear and readable
- Shows provider name
- Shows price
- Shows product/plan name
- Is in JPG, PNG, or PDF format
- Is under 10MB

---

## Troubleshooting

### OpenAI API Error:
```
Error: OpenAI API key not set
Solution: export OPENAI_API_KEY="sk-..."
```

### Database Connection Error:
```
Error: Could not connect to database
Solution: Check DATABASE_URL and ensure PostgreSQL is running
```

### Import Error (sendgrid):
```
Error: No module named 'sendgrid'
Solution: pip install sendgrid
```

---

## Next Steps

After successful testing:
1. ✅ Upload endpoint works
2. ✅ AI parsing works
3. ✅ Contract creation works
4. → Build frontend Dropzone component
5. → Integrate with Dashboard
6. → Add file storage (S3/Azure Blob)



