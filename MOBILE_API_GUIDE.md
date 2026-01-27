# 📱 MOBILE APP API GUIDE

**ForbrugerAgent Backend API Documentation for Mobile Development**

---

## 🌐 BASE URL

### Development
```
http://localhost:4332/api/v1
```

### Production (Railway)
```
https://[din-railway-backend-url]/api/v1
```

---

## 🔐 AUTHENTICATION

### Auth0 Mobile SDK Setup

Mobile app bruger Auth0 for user authentication:

```javascript
// React Native Example
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({
  domain: '[YOUR_AUTH0_DOMAIN]',
  clientId: '[YOUR_AUTH0_CLIENT_ID]'
});

// Login
const credentials = await auth0.webAuth.authorize({
  scope: 'openid profile email'
});

// Use access_token in API requests
const token = credentials.accessToken;
```

### API Request Headers

Alle autentificerede requests skal inkludere:

```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## 📋 CORE API ENDPOINTS FOR MOBILE

### 1. USER ENDPOINTS

#### **GET /users/me**
Hent nuværende brugers profil

**Request:**
```bash
GET /api/v1/users/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "+4512345678",
  "created_at": "2025-12-13T10:00:00Z",
  "agent_email": "user-123@agent.forbrugeragent.dk"
}
```

#### **PUT /users/me**
Opdater bruger profil

**Request:**
```json
{
  "full_name": "John Doe",
  "phone": "+4512345678"
}
```

---

### 2. FILE UPLOAD (BILL SCANNING)

#### **POST /upload/bill**
Upload regning/faktura (billede eller PDF)

**Request:**
```bash
POST /api/v1/upload/bill
Content-Type: multipart/form-data
Authorization: Bearer {token}

file: [FILE_BINARY]
category: "energy" | "mobile" | "internet"
```

**Response:**
```json
{
  "file_url": "https://storage.../bill_123.pdf",
  "parsed_data": {
    "provider": "Norlys",
    "amount": 850.00,
    "due_date": "2025-01-15",
    "contract_id": "12345678"
  },
  "confidence": 0.95
}
```

**Mobile Implementation:**
```javascript
// React Native - Camera/File Upload
import DocumentPicker from 'react-native-document-picker';
import { launchCamera } from 'react-native-image-picker';

// Take photo of bill
const result = await launchCamera({
  mediaType: 'photo',
  quality: 0.8
});

// Or pick from gallery
const doc = await DocumentPicker.pick({
  type: [DocumentPicker.types.images, DocumentPicker.types.pdf]
});

// Upload to API
const formData = new FormData();
formData.append('file', {
  uri: result.assets[0].uri,
  type: result.assets[0].type,
  name: result.assets[0].fileName
});
formData.append('category', 'energy');

const response = await fetch(`${API_URL}/upload/bill`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData
});
```

---

### 3. CONTRACTS (Aktuelle Aftaler)

#### **GET /contracts/**
Hent alle brugerens kontrakter

**Response:**
```json
{
  "contracts": [
    {
      "id": "uuid",
      "category": "energy",
      "provider_name": "Norlys",
      "monthly_price": 850.00,
      "start_date": "2024-01-01",
      "status": "active",
      "contract_number": "12345678"
    }
  ]
}
```

#### **GET /contracts/{id}**
Hent specifik kontrakt detaljer

---

### 4. QUOTES (Tilbud & Sammenligning)

#### **POST /quotes/requests**
Anmod om tilbud fra providers

**Request:**
```json
{
  "category": "energy",
  "current_provider": "Norlys",
  "current_monthly_price": 850.00,
  "annual_consumption": 4000,
  "address": {
    "street": "Vesterbrogade 1",
    "postal_code": "1620",
    "city": "København V"
  }
}
```

**Response:**
```json
{
  "request_id": "uuid",
  "status": "pending",
  "expected_quotes": 5,
  "estimated_time_hours": 48
}
```

#### **GET /quotes/**
Hent alle tilbud for brugeren

**Response:**
```json
{
  "quotes": [
    {
      "id": "uuid",
      "provider_name": "OK",
      "monthly_price": 750.00,
      "savings_vs_current": 100.00,
      "savings_percentage": 11.76,
      "contract_length_months": 12,
      "status": "active",
      "valid_until": "2025-12-31"
    }
  ]
}
```

---

### 5. CHAT (AI AGENT)

#### **POST /chat/message**
Send besked til AI agent

**Request:**
```json
{
  "message": "Hvordan kan jeg spare penge på min elregning?",
  "context": {
    "current_screen": "dashboard",
    "user_contracts": ["contract_id_1"]
  }
}
```

**Response:**
```json
{
  "response": "Baseret på din nuværende elregning kan jeg se...",
  "suggestions": [
    "Upload din seneste regning",
    "Se tilbud fra andre leverandører"
  ],
  "actions": [
    {
      "type": "navigate",
      "screen": "upload_bill"
    }
  ]
}
```

---

### 6. SUPPORT TICKETS

#### **POST /support/tickets**
Opret support ticket

**Request:**
```json
{
  "subject": "Spørgsmål om elaftale",
  "description": "Jeg har et spørgsmål om...",
  "category": "energy"
}
```

#### **GET /support/tickets**
Hent alle brugerens tickets

---

### 7. PROVIDERS

#### **GET /providers/**
Hent liste af alle providers

**Query params:**
- `category`: "energy" | "mobile" | "internet"
- `active_only`: boolean

**Response:**
```json
{
  "providers": [
    {
      "id": "uuid",
      "name": "Norlys",
      "categories": ["energy"],
      "reputation_score": 75,
      "avg_response_time_hours": 24
    }
  ]
}
```

---

## 🚀 MOBILE APP FLOW EXAMPLES

### Flow 1: Onboarding & First Bill Upload

```
1. User opens app
2. Auth0 login
3. GET /users/me (create user if doesn't exist)
4. Show onboarding screen
5. Camera → Take photo of bill
6. POST /upload/bill
7. Show parsed data for confirmation
8. POST /quotes/requests (automatic)
9. Show "Vi finder tilbud til dig..." screen
```

### Flow 2: View Quotes & Accept

```
1. GET /quotes/
2. Show comparison screen
3. User selects best quote
4. POST /quotes/{id}/accept
5. Show confirmation
6. (Optional) MitID signing
```

### Flow 3: Chat Support

```
1. User taps "Hjælp" button
2. Show chat interface
3. User types message
4. POST /chat/message
5. Show AI response
6. If complex: Create support ticket automatically
```

---

## 📊 DATA MODELS

### User
```typescript
interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  agent_email: string;
  created_at: string;
}
```

### Contract
```typescript
interface Contract {
  id: string;
  category: 'energy' | 'mobile' | 'internet';
  provider_name: string;
  monthly_price: number;
  start_date: string;
  end_date?: string;
  status: 'active' | 'cancelled' | 'pending';
  contract_number: string;
}
```

### Quote
```typescript
interface Quote {
  id: string;
  provider_name: string;
  category: string;
  monthly_price: number;
  savings_vs_current: number;
  savings_percentage: number;
  contract_length_months: number;
  status: 'active' | 'accepted' | 'expired';
  valid_until: string;
  details: {
    binding_period?: number;
    cancellation_notice?: number;
    includes?: string[];
  };
}
```

---

## 🔧 ERROR HANDLING

Alle API errors returnerer:

```json
{
  "detail": "Error message",
  "error_code": "SPECIFIC_ERROR_CODE",
  "timestamp": "2025-12-13T10:00:00Z"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (token invalid/expired)
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

**Mobile App Error Handling:**
```javascript
try {
  const response = await apiCall();
  // Success
} catch (error) {
  if (error.status === 401) {
    // Token expired → refresh or re-login
    await auth0.webAuth.clearSession();
    navigation.navigate('Login');
  } else if (error.status === 422) {
    // Show validation errors to user
    showValidationErrors(error.detail);
  } else {
    // Generic error
    showErrorToast('Noget gik galt. Prøv igen.');
  }
}
```

---

## 🎯 TESTING

### Development Testing
```bash
# Start backend locally
cd backend
python3 -m uvicorn main:app --reload --port 4332

# Test from mobile
API_URL = "http://localhost:4332/api/v1"
```

### Production Testing
```bash
# Railway URL
API_URL = "https://forbrugeragent-backend.railway.app/api/v1"
```

---

## 📝 NEXT STEPS FOR MOBILE TEAM

### Phase 1: Core Features ✅
- [x] User authentication (Auth0)
- [x] User profile
- [x] Bill upload (camera + gallery)
- [x] View current contracts
- [x] View quotes

### Phase 2: Advanced Features 🔧
- [ ] Chat interface
- [ ] Push notifications
- [ ] MitID signing
- [ ] Contract switching
- [ ] Activity feed

### Phase 3: Polish 🎨
- [ ] Offline mode
- [ ] Animations
- [ ] Dark mode
- [ ] Localization

---

## ❓ QUESTIONS?

Contact backend team eller check:
- API Docs: `http://localhost:4332/docs`
- Health Check: `http://localhost:4332/health`
- OpenAPI JSON: `http://localhost:4332/openapi.json`

---

**Sidst opdateret: 13. December 2025**




