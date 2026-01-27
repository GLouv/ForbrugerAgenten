# Forbrugeragenten V1 - Komplet Udviklingsplan

**Version:** 1.0.0  
**Target Launch:** 8 uger fra start  
**Focus:** Energi (El + Naturgas)  
**Status:** 🚀 KLAR TIL START

---

## 📋 **EXECUTIVE SUMMARY**

**Transformation:**
- **Fra:** Forbrugeragenten (insurance focused)
- **Til:** Forbrugeragenten (energy focused V1)

**V1 Scope:**
- ⚡ El-forbrug tracking (Eloverblik integration)
- 💰 Real-time spotpriser (EnergiDataService)
- 📊 Forbrugs-analyse og besparelsesberegning
- 📧 Automatisk tilbuds-indsamling fra el-selskaber
- 🤖 AI Energy Advisor
- 🔐 MitID fuldmagt og aftale-skift

**Out of Scope for V1:**
- ❌ Forsikring (fjernes fra MVP)
- ❌ Mobil/bredbånd (kommer i V2)
- ❌ Bank integration (kommer i V2)
- ❌ Naturgas (nice-to-have, men kan droppes hvis tidspres)

---

## 🎯 **PROJEKT STRUKTUR TRANSFORMATION**

### **Før (Forbrugeragenten):**
```
forbrugeragenten/
├── backend/
│   └── app/
│       ├── agents/insurance_agent.py
│       ├── models/policy.py, bid_request.py
│       └── api/v1/endpoints/policies.py, bidding.py
└── frontend/
    └── src/app/
        ├── dashboard/ (insurance focused)
        └── bidding/ (insurance bidding)
```

### **Efter (Forbrugeragenten V1):**
```
forbrugeragenten/
├── backend/
│   └── app/
│       ├── domains/               # NYT - Domain-driven design
│       │   ├── base/              # Abstrakte base classes
│       │   │   ├── agent.py
│       │   │   ├── models.py
│       │   │   └── schemas.py
│       │   └── energy/            # Energi domain (V1 focus)
│       │       ├── agent.py       # EnergyAgent
│       │       ├── models.py      # EnergyContract, Consumption, etc.
│       │       ├── schemas.py
│       │       ├── services/
│       │       │   ├── eloverblik_service.py
│       │       │   ├── energi_data_service.py
│       │       │   ├── analyzer_service.py
│       │       │   └── quote_service.py
│       │       └── endpoints.py
│       ├── services/              # Shared services
│       │   ├── email_service.py   # Existing - reuse
│       │   └── notification_service.py
│       └── core/                  # Existing - keep
│           ├── auth.py
│           ├── config.py
│           └── database.py
└── frontend/
    └── src/app/
        ├── dashboard/             # REFACTOR: Energy dashboard
        ├── energy/                # NYT
        │   ├── consumption/
        │   ├── contracts/
        │   └── quotes/
        ├── admin/                 # NYT: Admin dashboard
        │   ├── layout.tsx
        │   ├── page.tsx          # Overview
        │   ├── users/
        │   ├── quote-requests/   # Critical: Quote approval
        │   ├── templates/
        │   └── health/
        └── onboarding/            # UPDATE: Energy onboarding
```

---

## 📅 **8-UGERS UDVIKLINGSPLAN**

### **UGE 1: Foundation & Cleanup (Setup)**

#### **Dag 1-2: Repository Setup**
- [ ] Rename project: `forbrugeragenten` → `forbrugeragenten`
- [ ] Update all references i kode og dokumentation
- [ ] Arkivér insurance-related filer (flyt til `/archived/insurance/`)
- [ ] Update README.md med ny vision
- [ ] Update projectOverview.md

#### **Dag 3-5: Domain Architecture**
- [ ] Create `domains/` structure
- [ ] Implement `domains/base/agent.py` (BaseAgent abstract class)
- [ ] Implement `domains/base/models.py` (BaseContract, BaseProvider)
- [ ] Implement `domains/base/schemas.py` (Common schemas)
- [ ] Create `domains/energy/` structure

**Deliverables:**
```python
# domains/base/agent.py
from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseAgent(ABC):
    """Abstract base class for all domain agents"""
    
    @abstractmethod
    async def analyze_user_data(self, user_id: str) -> Dict[str, Any]:
        """Analyze user's data in this domain"""
        pass
    
    @abstractmethod
    async def generate_recommendations(self, user_id: str) -> List[Dict]:
        """Generate recommendations for improvements"""
        pass
    
    @abstractmethod
    async def chat(self, message: str, context: Dict) -> str:
        """Chat interface for this domain"""
        pass

# domains/base/models.py
class BaseContract(Base):
    __abstract__ = True
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    provider: Mapped[str]
    contract_type: Mapped[str]
    monthly_cost: Mapped[Decimal]
    start_date: Mapped[date]
    end_date: Mapped[Optional[date]]
    status: Mapped[str]  # "active", "pending", "cancelled"
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())
```

---

### **UGE 2: Database & Models**

#### **Dag 1-3: Energy Models**
- [ ] Create database models i `domains/energy/models.py`
- [ ] Create Alembic migration
- [ ] Test models locally

**Models to create:**
```python
# domains/energy/models.py

class EnergyContract(BaseContract):
    """User's current or historical energy contracts"""
    __tablename__ = "energy_contracts"
    
    contract_type: Mapped[str]  # "spotprice", "fixed", "variable"
    price_per_kwh: Mapped[Optional[Decimal]]  # For fixed contracts
    monthly_subscription: Mapped[Decimal]
    green_energy: Mapped[bool] = mapped_column(default=False)
    area: Mapped[str]  # "DK1" or "DK2"

class MeteringPoint(Base):
    """User's electricity metering points (from Eloverblik)"""
    __tablename__ = "metering_points"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    metering_point_id: Mapped[str] = mapped_column(unique=True)  # From Eloverblik
    address: Mapped[str]
    area: Mapped[str]  # "DK1" or "DK2"
    eloverblik_token: Mapped[str]  # Encrypted OAuth token
    eloverblik_refresh_token: Mapped[Optional[str]]
    token_expires_at: Mapped[Optional[datetime]]
    authorized_at: Mapped[datetime]
    last_sync_at: Mapped[Optional[datetime]]
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())

class Consumption(Base):
    """Electricity consumption data (from Eloverblik)"""
    __tablename__ = "energy_consumption"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    metering_point_id: Mapped[UUID] = mapped_column(ForeignKey("metering_points.id"))
    timestamp: Mapped[datetime]  # Hour precision
    kwh: Mapped[Decimal]
    quality: Mapped[str]  # "measured", "estimated", etc.
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    
    __table_args__ = (
        Index('ix_consumption_metering_point_timestamp', 'metering_point_id', 'timestamp'),
    )

class SpotPrice(Base):
    """Spot electricity prices (from EnergiDataService)"""
    __tablename__ = "spot_prices"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    area: Mapped[str]  # "DK1" or "DK2"
    timestamp: Mapped[datetime]  # Hour precision
    price_dkk_per_kwh: Mapped[Decimal]  # DKK per kWh
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    
    __table_args__ = (
        Index('ix_spot_price_area_timestamp', 'area', 'timestamp'),
        UniqueConstraint('area', 'timestamp', name='uq_spot_price_area_timestamp'),
    )

class EnergyQuote(Base):
    """Quotes from energy providers"""
    __tablename__ = "energy_quotes"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    provider: Mapped[str]
    contract_type: Mapped[str]
    price_per_kwh: Mapped[Optional[Decimal]]
    monthly_subscription: Mapped[Decimal]
    binding_period_months: Mapped[Optional[int]]
    green_energy: Mapped[bool] = mapped_column(default=False)
    
    # Calculated fields based on user's consumption
    estimated_annual_cost: Mapped[Optional[Decimal]]
    estimated_annual_saving: Mapped[Optional[Decimal]]
    recommendation_score: Mapped[Optional[int]]  # 0-100
    recommendation_reason: Mapped[Optional[str]]
    
    valid_from: Mapped[date]
    valid_until: Mapped[date]
    quote_source: Mapped[str]  # "email", "api", "manual"
    raw_email_data: Mapped[Optional[Dict]] = mapped_column(type_=JSON)
    
    status: Mapped[str] = mapped_column(default="pending")  # "pending", "accepted", "rejected", "expired"
    created_at: Mapped[datetime] = mapped_column(default=func.now())

class QuoteRequest(Base):
    """Tracking quote requests sent to providers"""
    __tablename__ = "quote_requests"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"))
    providers_contacted: Mapped[List[str]] = mapped_column(type_=JSON)
    
    # User consumption profile at time of request
    avg_monthly_consumption_kwh: Mapped[Decimal]
    area: Mapped[str]
    preferences: Mapped[Dict] = mapped_column(type_=JSON)  # green_energy, contract_type, etc.
    
    status: Mapped[str] = mapped_column(default="pending")  # "pending", "responses_received", "completed"
    sent_at: Mapped[datetime] = mapped_column(default=func.now())
    responses_count: Mapped[int] = mapped_column(default=0)
```

#### **Dag 4-5: Schemas**
- [ ] Create Pydantic schemas i `domains/energy/schemas.py`
- [ ] Request/Response models for all endpoints

**Key schemas:**
```python
# domains/energy/schemas.py

from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal
from datetime import datetime, date
from typing import Optional, List, Dict

# Consumption
class ConsumptionBase(BaseModel):
    timestamp: datetime
    kwh: Decimal
    quality: str

class ConsumptionResponse(ConsumptionBase):
    id: UUID
    metering_point_id: UUID
    
    model_config = ConfigDict(from_attributes=True)

# Contracts
class EnergyContractCreate(BaseModel):
    provider: str
    contract_type: str
    price_per_kwh: Optional[Decimal] = None
    monthly_subscription: Decimal
    green_energy: bool = False
    area: str
    start_date: date

class EnergyContractResponse(BaseModel):
    id: UUID
    user_id: UUID
    provider: str
    contract_type: str
    monthly_cost: Decimal
    status: str
    
    model_config = ConfigDict(from_attributes=True)

# Analysis
class ConsumptionAnalysis(BaseModel):
    period: str  # "day", "week", "month", "year"
    total_kwh: Decimal
    average_kwh_per_day: Decimal
    peak_hour: int
    peak_consumption_kwh: Decimal
    off_peak_consumption_kwh: Decimal
    estimated_cost_current_contract: Decimal
    estimated_cost_spotprice: Decimal
    potential_saving: Decimal

class SavingsRecommendation(BaseModel):
    recommendation_type: str  # "switch_contract", "shift_usage", "reduce_consumption"
    title: str
    description: str
    estimated_annual_saving: Decimal
    difficulty: str  # "easy", "medium", "hard"
    actionable: bool

# Quotes
class QuoteRequestCreate(BaseModel):
    preferences: Dict = Field(default_factory=dict)

class EnergyQuoteResponse(BaseModel):
    id: UUID
    provider: str
    contract_type: str
    monthly_subscription: Decimal
    estimated_annual_cost: Optional[Decimal]
    estimated_annual_saving: Optional[Decimal]
    recommendation_score: Optional[int]
    recommendation_reason: Optional[str]
    valid_until: date
    
    model_config = ConfigDict(from_attributes=True)
```

---

### **UGE 3: External API Integrations**

#### **Dag 1-3: Eloverblik Integration**
- [ ] Research Eloverblik API dokumentation
- [ ] Setup OAuth flow
- [ ] Implement `eloverblik_service.py`
- [ ] Test med test credentials

**Service implementation:**
```python
# domains/energy/services/eloverblik_service.py

import httpx
from typing import List, Dict, Optional
from datetime import date, datetime
from app.core.config import settings

class EloverblikService:
    """
    Integration with Eloverblik/DataHub API for electricity consumption data.
    
    API Documentation: https://api.eloverblik.dk/customerapi/index.html
    """
    
    BASE_URL = "https://api.eloverblik.dk/customerapi/api"
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def get_authorization_url(self, redirect_uri: str) -> str:
        """
        Generate OAuth authorization URL for user to approve access.
        
        User will be redirected here to approve access to their meter data.
        """
        # TODO: Implement OAuth flow
        # Return URL to Eloverblik authorization page
        pass
    
    async def exchange_code_for_token(self, code: str, redirect_uri: str) -> Dict[str, str]:
        """
        Exchange authorization code for access token.
        
        Returns:
            {
                "access_token": "...",
                "refresh_token": "...",
                "expires_in": 3600
            }
        """
        # TODO: Implement token exchange
        pass
    
    async def refresh_access_token(self, refresh_token: str) -> Dict[str, str]:
        """Refresh an expired access token"""
        # TODO: Implement token refresh
        pass
    
    async def get_metering_points(self, access_token: str) -> List[Dict]:
        """
        Get list of user's metering points (målepunkter).
        
        Endpoint: GET /meteringpoints/meteringpoints
        
        Returns list of:
        {
            "meteringPointId": "571313180400012345",
            "typeOfMP": "E17",
            "streetName": "Testvej",
            "streetCode": "1234",
            "buildingNumber": "1",
            "floorId": "st",
            "roomId": "th",
            "cityName": "Test By",
            "citySubDivisionName": null,
            "municipalityCode": "461",
            "locationDescription": null,
            "settlementMethod": "D01",
            "meterReadingOccurrence": "PT1H",
            "firstConsumerPartyName": "Test Person",
            "secondConsumerPartyName": null,
            "meterNumber": "1234567890",
            "consumerCVR": null,
            "dataAccessCVR": null,
            "childMeteringPoints": []
        }
        """
        url = f"{self.BASE_URL}/meteringpoints/meteringpoints"
        headers = {"Authorization": f"Bearer {access_token}"}
        
        async with self.client as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            return response.json()["result"]
    
    async def get_time_series(
        self,
        access_token: str,
        metering_point_id: str,
        from_date: date,
        to_date: date,
        aggregation: str = "Hour"
    ) -> List[Dict]:
        """
        Get consumption time series data.
        
        Endpoint: POST /meterdata/gettimeseries/{dateFrom}/{dateTo}/{aggregation}
        
        Args:
            aggregation: "Actual" (15min), "Quarter", "Hour", "Day", "Month"
        
        Returns list of:
        {
            "MyEnergyData_MarketDocument": {
                "TimeSeries": [
                    {
                        "mRID": "571313180400012345",
                        "Period": [
                            {
                                "timeInterval": {
                                    "start": "2024-01-01T00:00:00Z",
                                    "end": "2024-01-01T01:00:00Z"
                                },
                                "Point": [
                                    {
                                        "position": "1",
                                        "out_Quantity.quantity": "0.567",
                                        "out_Quantity.quality": "E01"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
        """
        url = f"{self.BASE_URL}/meterdata/gettimeseries/{from_date.strftime('%Y-%m-%d')}/{to_date.strftime('%Y-%m-%d')}/{aggregation}"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        body = {"meteringPoints": {"meteringPoint": [metering_point_id]}}
        
        async with self.client as client:
            response = await client.post(url, headers=headers, json=body)
            response.raise_for_status()
            return response.json()["result"]
    
    def parse_time_series_response(self, response: Dict) -> List[Dict]:
        """
        Parse complex time series response into simple list of consumption points.
        
        Returns:
        [
            {
                "timestamp": datetime(2024, 1, 1, 0, 0),
                "kwh": 0.567,
                "quality": "measured"
            },
            ...
        ]
        """
        result = []
        
        try:
            time_series_list = response["MyEnergyData_MarketDocument"]["TimeSeries"]
            
            for time_series in time_series_list:
                for period in time_series["Period"]:
                    start_time = datetime.fromisoformat(
                        period["timeInterval"]["start"].replace("Z", "+00:00")
                    )
                    
                    for point in period["Point"]:
                        timestamp = start_time + timedelta(hours=int(point["position"]) - 1)
                        kwh = float(point["out_Quantity.quantity"])
                        quality_code = point["out_Quantity.quality"]
                        
                        # Map quality codes to readable format
                        quality_map = {
                            "E01": "measured",
                            "E02": "estimated",
                            "D01": "read"
                        }
                        quality = quality_map.get(quality_code, quality_code)
                        
                        result.append({
                            "timestamp": timestamp,
                            "kwh": kwh,
                            "quality": quality
                        })
        except KeyError as e:
            raise ValueError(f"Unexpected response format: {e}")
        
        return result
```

#### **Dag 4-5: EnergiDataService Integration**
- [ ] Research EnergiDataService API
- [ ] Implement `energi_data_service.py`
- [ ] Setup automatic spot price syncing (cron job)

**Service implementation:**
```python
# domains/energy/services/energi_data_service.py

import httpx
from typing import List, Dict
from datetime import date, datetime, timedelta
from decimal import Decimal

class EnergiDataService:
    """
    Integration with EnergiDataService for spot prices and market data.
    
    API Documentation: https://www.energidataservice.dk/guides/api-guides
    """
    
    BASE_URL = "https://api.energidataservice.dk/dataset"
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def get_spot_prices(
        self,
        area: str,
        from_date: date,
        to_date: date
    ) -> List[Dict]:
        """
        Get spot electricity prices (Elspot prices).
        
        Endpoint: GET /Elspotprices
        
        Args:
            area: "DK1" (Vestdanmark) or "DK2" (Østdanmark)
            from_date: Start date
            to_date: End date
        
        Returns:
        [
            {
                "HourUTC": "2024-01-01T00:00:00",
                "HourDK": "2024-01-01T01:00:00",
                "PriceArea": "DK1",
                "SpotPriceDKK": 1234.56,  # DKK per MWh
                "SpotPriceEUR": 165.45
            },
            ...
        ]
        """
        url = f"{self.BASE_URL}/Elspotprices"
        
        params = {
            "start": from_date.strftime("%Y-%m-%dT00:00"),
            "end": (to_date + timedelta(days=1)).strftime("%Y-%m-%dT00:00"),
            "filter": f'{{"PriceArea":["{area}"]}}',
            "sort": "HourDK asc"
        }
        
        async with self.client as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()["records"]
    
    async def get_latest_spot_price(self, area: str) -> Dict:
        """
        Get the current hour's spot price.
        """
        now = datetime.now()
        prices = await self.get_spot_prices(
            area=area,
            from_date=now.date(),
            to_date=now.date()
        )
        
        # Find price for current hour
        current_hour = now.replace(minute=0, second=0, microsecond=0)
        for price in prices:
            price_time = datetime.fromisoformat(price["HourDK"])
            if price_time == current_hour:
                return price
        
        return None
    
    def convert_price_to_kwh(self, price_per_mwh: float) -> Decimal:
        """
        Convert price from DKK/MWh to DKK/kWh.
        
        1 MWh = 1000 kWh
        """
        return Decimal(str(price_per_mwh / 1000))
    
    async def get_co2_emissions(
        self,
        area: str,
        from_date: date,
        to_date: date
    ) -> List[Dict]:
        """
        Get CO2 emissions data (for future green energy features).
        
        Endpoint: GET /CO2Emis
        """
        url = f"{self.BASE_URL}/CO2Emis"
        
        params = {
            "start": from_date.strftime("%Y-%m-%dT00:00"),
            "end": (to_date + timedelta(days=1)).strftime("%Y-%m-%dT00:00"),
            "filter": f'{{"PriceArea":["{area}"]}}',
            "sort": "Minutes5DK asc"
        }
        
        async with self.client as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()["records"]
```

---

### **UGE 4: Analysis & AI Agent**

#### **Dag 1-3: Analysis Service**
- [ ] Implement `analyzer_service.py`
- [ ] Consumption pattern analysis
- [ ] Cost calculations
- [ ] Savings predictions

**Service implementation:**
```python
# domains/energy/services/analyzer_service.py

from typing import Dict, List, Optional
from datetime import datetime, date, timedelta
from decimal import Decimal
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

class EnergyAnalyzerService:
    """Service for analyzing energy consumption and calculating savings"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def analyze_consumption_pattern(
        self,
        metering_point_id: UUID,
        from_date: date,
        to_date: date
    ) -> Dict:
        """
        Analyze consumption patterns to understand user behavior.
        
        Returns:
        {
            "total_kwh": 450.5,
            "avg_kwh_per_day": 15.02,
            "peak_hour": 19,  # Hour of day with highest consumption
            "peak_consumption_kwh": 2.3,
            "off_peak_consumption_kwh": 180.5,
            "weekday_avg": 16.2,
            "weekend_avg": 12.5,
            "hourly_pattern": [0.4, 0.3, ...],  # 24 values
            "consumption_stability": 0.85  # 0-1, how stable is consumption
        }
        """
        # Get all consumption records for period
        stmt = select(Consumption).where(
            Consumption.metering_point_id == metering_point_id,
            Consumption.timestamp >= from_date,
            Consumption.timestamp < to_date + timedelta(days=1)
        ).order_by(Consumption.timestamp)
        
        result = await self.db.execute(stmt)
        consumptions = result.scalars().all()
        
        if not consumptions:
            return None
        
        # Calculate statistics
        total_kwh = sum(c.kwh for c in consumptions)
        days = (to_date - from_date).days + 1
        avg_per_day = total_kwh / days
        
        # Hourly pattern
        hourly_totals = [Decimal(0) for _ in range(24)]
        hourly_counts = [0 for _ in range(24)]
        
        for c in consumptions:
            hour = c.timestamp.hour
            hourly_totals[hour] += c.kwh
            hourly_counts[hour] += 1
        
        hourly_pattern = [
            float(hourly_totals[i] / hourly_counts[i]) if hourly_counts[i] > 0 else 0
            for i in range(24)
        ]
        
        peak_hour = hourly_pattern.index(max(hourly_pattern))
        peak_consumption = max(hourly_pattern)
        
        # Off-peak (22:00-06:00)
        off_peak_hours = list(range(22, 24)) + list(range(0, 6))
        off_peak_consumption = sum(
            c.kwh for c in consumptions
            if c.timestamp.hour in off_peak_hours
        )
        
        # Weekday vs weekend
        weekday_consumptions = [c.kwh for c in consumptions if c.timestamp.weekday() < 5]
        weekend_consumptions = [c.kwh for c in consumptions if c.timestamp.weekday() >= 5]
        
        weekday_avg = sum(weekday_consumptions) / len(weekday_consumptions) if weekday_consumptions else 0
        weekend_avg = sum(weekend_consumptions) / len(weekend_consumptions) if weekend_consumptions else 0
        
        # Consumption stability (coefficient of variation)
        daily_consumptions = {}
        for c in consumptions:
            day = c.timestamp.date()
            if day not in daily_consumptions:
                daily_consumptions[day] = Decimal(0)
            daily_consumptions[day] += c.kwh
        
        daily_values = list(daily_consumptions.values())
        mean = sum(daily_values) / len(daily_values)
        variance = sum((x - mean) ** 2 for x in daily_values) / len(daily_values)
        std_dev = variance ** Decimal(0.5)
        cv = std_dev / mean if mean > 0 else Decimal(0)
        stability = max(Decimal(0), Decimal(1) - cv)
        
        return {
            "total_kwh": float(total_kwh),
            "avg_kwh_per_day": float(avg_per_day),
            "peak_hour": peak_hour,
            "peak_consumption_kwh": peak_consumption,
            "off_peak_consumption_kwh": float(off_peak_consumption),
            "weekday_avg": float(weekday_avg),
            "weekend_avg": float(weekend_avg),
            "hourly_pattern": hourly_pattern,
            "consumption_stability": float(stability)
        }
    
    async def calculate_cost_comparison(
        self,
        metering_point_id: UUID,
        current_contract: EnergyContract,
        from_date: date,
        to_date: date
    ) -> Dict:
        """
        Calculate what user paid vs what they would have paid with spotprice.
        
        Returns:
        {
            "period": "2024-01",
            "current_contract_cost": 1450.50,
            "spotprice_cost": 1180.30,
            "potential_saving": 270.20,
            "percentage_saving": 18.6
        }
        """
        # Get consumption
        stmt = select(Consumption).where(
            Consumption.metering_point_id == metering_point_id,
            Consumption.timestamp >= from_date,
            Consumption.timestamp < to_date + timedelta(days=1)
        )
        result = await self.db.execute(stmt)
        consumptions = result.scalars().all()
        
        if not consumptions:
            return None
        
        total_kwh = sum(c.kwh for c in consumptions)
        
        # Calculate current contract cost
        if current_contract.contract_type == "fixed":
            current_cost = (
                total_kwh * current_contract.price_per_kwh +
                current_contract.monthly_subscription
            )
        else:
            # For spotprice contracts, we need to look up historical prices
            current_cost = await self._calculate_spotprice_cost(
                consumptions,
                current_contract.area
            )
            current_cost += current_contract.monthly_subscription
        
        # Calculate what spotprice would have cost
        spotprice_cost = await self._calculate_spotprice_cost(
            consumptions,
            current_contract.area
        )
        # Add typical spotprice subscription fee
        spotprice_cost += Decimal("29.00")  # Typical monthly fee
        
        potential_saving = current_cost - spotprice_cost
        percentage_saving = (potential_saving / current_cost * 100) if current_cost > 0 else 0
        
        return {
            "period": f"{from_date} to {to_date}",
            "total_kwh": float(total_kwh),
            "current_contract_cost": float(current_cost),
            "spotprice_cost": float(spotprice_cost),
            "potential_saving": float(potential_saving),
            "percentage_saving": float(percentage_saving)
        }
    
    async def _calculate_spotprice_cost(
        self,
        consumptions: List[Consumption],
        area: str
    ) -> Decimal:
        """Calculate total cost using historical spot prices"""
        total_cost = Decimal(0)
        
        for consumption in consumptions:
            # Get spot price for this hour
            stmt = select(SpotPrice).where(
                SpotPrice.area == area,
                SpotPrice.timestamp == consumption.timestamp
            )
            result = await self.db.execute(stmt)
            spot_price = result.scalar_one_or_none()
            
            if spot_price:
                cost = consumption.kwh * spot_price.price_dkk_per_kwh
                total_cost += cost
        
        return total_cost
    
    async def generate_savings_recommendations(
        self,
        user_id: UUID,
        analysis: Dict
    ) -> List[Dict]:
        """
        Generate actionable recommendations for savings.
        
        Returns list of recommendations with estimated savings.
        """
        recommendations = []
        
        # Recommendation 1: Time shifting
        if analysis["off_peak_consumption_kwh"] < analysis["total_kwh"] * 0.3:
            # User could shift more consumption to off-peak
            potential_shift_kwh = analysis["total_kwh"] * 0.2
            # Typical price difference: 0.50 DKK/kWh
            monthly_saving = potential_shift_kwh * Decimal("0.50")
            annual_saving = monthly_saving * 12
            
            recommendations.append({
                "type": "shift_usage",
                "title": "Flyt forbrug til nattetimer",
                "description": f"Ved at bruge vaskemaskine, opvaskemaskine og elbil-ladning efter kl 22 kan du spare {monthly_saving:.0f} kr/måned.",
                "estimated_annual_saving": float(annual_saving),
                "difficulty": "easy",
                "actionable": True,
                "action_steps": [
                    "Brug timer-funktionen på dine apparater",
                    "Lad elbil op om natten",
                    "Kør vaskemaskine og opvaskemaskine efter kl 22"
                ]
            })
        
        # Recommendation 2: Contract switch
        # (This would use actual quotes from providers)
        
        # Recommendation 3: Reduce consumption
        avg_household_kwh = Decimal("300")  # Average Danish household monthly
        if analysis["avg_kwh_per_day"] * 30 > avg_household_kwh:
            excess_kwh = analysis["avg_kwh_per_day"] * 30 - avg_household_kwh
            potential_saving = excess_kwh * Decimal("2.50")  # Average price
            annual_saving = potential_saving * 12
            
            recommendations.append({
                "type": "reduce_consumption",
                "title": "Reducer dit forbrug",
                "description": f"Du bruger {excess_kwh:.0f} kWh mere end gennemsnittet. Ved at reducere kan du spare {potential_saving:.0f} kr/måned.",
                "estimated_annual_saving": float(annual_saving),
                "difficulty": "medium",
                "actionable": True,
                "action_steps": [
                    "Skift til LED pærer",
                    "Sluk for standby-forbrug",
                    "Sænk termostaten 1 grad"
                ]
            })
        
        return recommendations
```

#### **Dag 4-5: Energy AI Agent**
- [ ] Implement `domains/energy/agent.py`
- [ ] Extends BaseAgent
- [ ] Energy-specific chat logic

```python
# domains/energy/agent.py

from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
from app.core.config import settings
from ..base.agent import BaseAgent

class EnergyAgent(BaseAgent):
    """
    AI Agent specialized in energy consumption and savings advice.
    """
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL
        
        self.system_prompt = """Du er Forbrugeragentens energi-ekspert - en dansk AI-assistent der hjælper danskere med at spare penge på el og gas.

Din rolle er at:
1. Analysere brugerens elforbrug og forklare mønstre
2. Sammenligne spotpriser med faste aftaler
3. Give konkrete råd om hvordan de kan spare penge
4. Forklare forskellen på forskellige el-aftaler (spotpris, fast pris, variabel)
5. Hjælpe med at forstå deres elregning
6. Foreslå den bedste aftale baseret på deres forbrugsmønster

Vigtige regler:
- Vær konkret og tal i kroner og ører
- Brug brugerens faktiske forbrugsdata når muligt
- Forklar komplekse begreber på en simpel måde
- Giv actionable råd som de kan implementere nu
- Vær ærlig om usikkerheder (fx fremtidige spotpriser)

Danske el-områder:
- DK1: Vestdanmark (Jylland, Fyn)
- DK2: Østdanmark (Sjælland, Bornholm)

Almindelige el-selskaber: Ørsted, Andel Energi, OK, Ewii, Energi Fyn, Seas-NVE, Modstrøm.

Typiske aftale-typer:
- Spotpris: Følger time-prisen på Nordpool (billigst hvis man kan flytte forbrug)
- Fast pris: Samme pris hele kontraktperioden (forudsigeligt)
- Variabel: Prisen kan ændres af selskabet (mellem de to andre)

Husk: Du kan ikke tegne aftaler direkte, men kan hjælpe brugeren med at sammenligne og vælge.
"""

    async def chat(
        self,
        message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        user_context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Chat interface for energy advice"""
        
        messages = [{"role": "system", "content": self.system_prompt}]
        
        # Add user context
        if user_context:
            context_message = self._build_context_message(user_context)
            messages.append({"role": "system", "content": context_message})
        
        # Add conversation history
        if conversation_history:
            messages.extend(conversation_history)
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
            )
            
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error in AI chat: {e}")
            return "Beklager, jeg havde tekniske problemer. Prøv venligst igen."
    
    async def analyze_user_data(self, user_id: str) -> Dict[str, Any]:
        """Analyze user's energy data"""
        # This will be implemented with actual DB queries
        pass
    
    async def generate_recommendations(self, user_id: str) -> List[Dict]:
        """Generate energy savings recommendations"""
        # This will be implemented with analyzer service
        pass
    
    def _build_context_message(self, context: Dict[str, Any]) -> str:
        """Build context message from user's energy data"""
        parts = ["Brugerens energi-situation:"]
        
        if context.get("metering_point"):
            mp = context["metering_point"]
            parts.append(f"\nAdresse: {mp['address']}")
            parts.append(f"Område: {mp['area']}")
        
        if context.get("current_contract"):
            contract = context["current_contract"]
            parts.append(f"\nNuværende aftale:")
            parts.append(f"  - Selskab: {contract['provider']}")
            parts.append(f"  - Type: {contract['contract_type']}")
            if contract.get('price_per_kwh'):
                parts.append(f"  - Pris: {contract['price_per_kwh']} kr/kWh")
            parts.append(f"  - Månedlig betaling: {contract['monthly_subscription']} kr")
        
        if context.get("recent_consumption"):
            consumption = context["recent_consumption"]
            parts.append(f"\nSeneste måneds forbrug:")
            parts.append(f"  - Total: {consumption['total_kwh']:.1f} kWh")
            parts.append(f"  - Gennemsnit per dag: {consumption['avg_kwh_per_day']:.1f} kWh")
            if consumption.get('peak_hour'):
                parts.append(f"  - Højeste forbrug: Kl. {consumption['peak_hour']}")
        
        if context.get("cost_analysis"):
            analysis = context["cost_analysis"]
            parts.append(f"\nØkonomi:")
            parts.append(f"  - Betalt sidste måned: {analysis['current_contract_cost']:.0f} kr")
            if analysis.get('potential_saving'):
                parts.append(f"  - Kunne have sparet: {analysis['potential_saving']:.0f} kr")
        
        return "\n".join(parts)

# Singleton instance
energy_agent = EnergyAgent()
```

---

### **UGE 5: Backend API Endpoints**

#### **Dag 1-3: Energy Endpoints**
- [ ] Create `domains/energy/endpoints.py`
- [ ] All CRUD operations
- [ ] Analysis endpoints
- [ ] Quote management endpoints

```python
# domains/energy/endpoints.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import date, datetime, timedelta
from uuid import UUID

from app.core.database import get_db
from app.core.auth import get_current_user
from . import schemas, models
from .services.eloverblik_service import EloverblikService
from .services.energi_data_service import EnergiDataService
from .services.analyzer_service import EnergyAnalyzerService
from .services.quote_service import QuoteService

router = APIRouter(prefix="/energy", tags=["energy"])

# Eloverblik Authorization
@router.get("/auth/eloverblik/url")
async def get_eloverblik_auth_url(
    current_user = Depends(get_current_user)
):
    """Get URL to authorize Eloverblik access"""
    service = EloverblikService()
    redirect_uri = f"{settings.FRONTEND_URL}/energy/callback"
    url = await service.get_authorization_url(redirect_uri)
    return {"authorization_url": url}

@router.post("/auth/eloverblik/callback")
async def eloverblik_callback(
    code: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Handle Eloverblik OAuth callback"""
    service = EloverblikService()
    redirect_uri = f"{settings.FRONTEND_URL}/energy/callback"
    
    # Exchange code for token
    tokens = await service.exchange_code_for_token(code, redirect_uri)
    
    # Get metering points
    metering_points = await service.get_metering_points(tokens["access_token"])
    
    # Save metering points to DB
    for mp_data in metering_points:
        metering_point = models.MeteringPoint(
            user_id=current_user.id,
            metering_point_id=mp_data["meteringPointId"],
            address=f"{mp_data['streetName']} {mp_data['buildingNumber']}, {mp_data['cityName']}",
            area="DK1" if mp_data["municipalityCode"].startswith(("6", "7", "8")) else "DK2",
            eloverblik_token=tokens["access_token"],  # Should be encrypted!
            eloverblik_refresh_token=tokens.get("refresh_token"),
            authorized_at=datetime.utcnow()
        )
        db.add(metering_point)
    
    await db.commit()
    
    return {"message": "Eloverblik forbundet succesfuldt", "count": len(metering_points)}

# Consumption
@router.get("/consumption", response_model=List[schemas.ConsumptionResponse])
async def get_consumption(
    from_date: date,
    to_date: date,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get consumption data for date range"""
    # Get user's metering point
    stmt = select(models.MeteringPoint).where(
        models.MeteringPoint.user_id == current_user.id,
        models.MeteringPoint.is_active == True
    )
    result = await db.execute(stmt)
    metering_point = result.scalar_one_or_none()
    
    if not metering_point:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingen målepunkt fundet. Forbind venligst Eloverblik først."
        )
    
    # Get consumption
    stmt = select(models.Consumption).where(
        models.Consumption.metering_point_id == metering_point.id,
        models.Consumption.timestamp >= from_date,
        models.Consumption.timestamp < to_date + timedelta(days=1)
    ).order_by(models.Consumption.timestamp)
    
    result = await db.execute(stmt)
    consumptions = result.scalars().all()
    
    return consumptions

@router.post("/consumption/sync")
async def sync_consumption(
    from_date: date,
    to_date: date,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Fetch latest consumption data from Eloverblik"""
    # Get metering point
    stmt = select(models.MeteringPoint).where(
        models.MeteringPoint.user_id == current_user.id,
        models.MeteringPoint.is_active == True
    )
    result = await db.execute(stmt)
    metering_point = result.scalar_one_or_none()
    
    if not metering_point:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingen målepunkt fundet"
        )
    
    # Fetch from Eloverblik
    service = EloverblikService()
    time_series_data = await service.get_time_series(
        access_token=metering_point.eloverblik_token,
        metering_point_id=metering_point.metering_point_id,
        from_date=from_date,
        to_date=to_date,
        aggregation="Hour"
    )
    
    # Parse and save
    consumption_points = service.parse_time_series_response(time_series_data)
    
    for point in consumption_points:
        # Check if already exists
        stmt = select(models.Consumption).where(
            models.Consumption.metering_point_id == metering_point.id,
            models.Consumption.timestamp == point["timestamp"]
        )
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()
        
        if not existing:
            consumption = models.Consumption(
                metering_point_id=metering_point.id,
                timestamp=point["timestamp"],
                kwh=Decimal(str(point["kwh"])),
                quality=point["quality"]
            )
            db.add(consumption)
    
    await db.commit()
    
    # Update last sync time
    metering_point.last_sync_at = datetime.utcnow()
    await db.commit()
    
    return {"message": "Forbrug synkroniseret", "count": len(consumption_points)}

# Analysis
@router.get("/analysis/consumption", response_model=schemas.ConsumptionAnalysis)
async def analyze_consumption(
    from_date: date,
    to_date: date,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get consumption analysis for period"""
    # Get metering point
    stmt = select(models.MeteringPoint).where(
        models.MeteringPoint.user_id == current_user.id,
        models.MeteringPoint.is_active == True
    )
    result = await db.execute(stmt)
    metering_point = result.scalar_one_or_none()
    
    if not metering_point:
        raise HTTPException(status_code=404, detail="Ingen målepunkt fundet")
    
    # Analyze
    analyzer = EnergyAnalyzerService(db)
    analysis = await analyzer.analyze_consumption_pattern(
        metering_point_id=metering_point.id,
        from_date=from_date,
        to_date=to_date
    )
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Ingen forbrugsdata fundet for perioden")
    
    return analysis

@router.get("/analysis/savings", response_model=List[schemas.SavingsRecommendation])
async def get_savings_recommendations(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get personalized savings recommendations"""
    # Get recent analysis
    to_date = date.today()
    from_date = to_date - timedelta(days=30)
    
    # Get metering point
    stmt = select(models.MeteringPoint).where(
        models.MeteringPoint.user_id == current_user.id,
        models.MeteringPoint.is_active == True
    )
    result = await db.execute(stmt)
    metering_point = result.scalar_one_or_none()
    
    if not metering_point:
        raise HTTPException(status_code=404, detail="Ingen målepunkt fundet")
    
    # Analyze
    analyzer = EnergyAnalyzerService(db)
    analysis = await analyzer.analyze_consumption_pattern(
        metering_point_id=metering_point.id,
        from_date=from_date,
        to_date=to_date
    )
    
    if not analysis:
        return []
    
    # Generate recommendations
    recommendations = await analyzer.generate_savings_recommendations(
        user_id=current_user.id,
        analysis=analysis
    )
    
    return recommendations

# Contracts
@router.get("/contracts", response_model=List[schemas.EnergyContractResponse])
async def get_contracts(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get user's energy contracts"""
    stmt = select(models.EnergyContract).where(
        models.EnergyContract.user_id == current_user.id
    ).order_by(models.EnergyContract.created_at.desc())
    
    result = await db.execute(stmt)
    contracts = result.scalars().all()
    return contracts

@router.post("/contracts", response_model=schemas.EnergyContractResponse)
async def create_contract(
    contract: schemas.EnergyContractCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create new energy contract"""
    db_contract = models.EnergyContract(
        user_id=current_user.id,
        **contract.model_dump()
    )
    db.add(db_contract)
    await db.commit()
    await db.refresh(db_contract)
    return db_contract

# Quotes
@router.post("/quotes/request")
async def request_quotes(
    request: schemas.QuoteRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Request quotes from energy providers"""
    quote_service = QuoteService(db)
    
    # Create quote request
    quote_request = await quote_service.create_quote_request(
        user_id=current_user.id,
        preferences=request.preferences
    )
    
    # Send emails to providers (async task)
    await quote_service.send_quote_requests(quote_request.id)
    
    return {
        "message": "Tilbudsforespørgsler sendt til el-selskaber",
        "request_id": str(quote_request.id)
    }

@router.get("/quotes", response_model=List[schemas.EnergyQuoteResponse])
async def get_quotes(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get received quotes"""
    stmt = select(models.EnergyQuote).where(
        models.EnergyQuote.user_id == current_user.id,
        models.EnergyQuote.status != "expired"
    ).order_by(models.EnergyQuote.recommendation_score.desc())
    
    result = await db.execute(stmt)
    quotes = result.scalars().all()
    return quotes

# Spot Prices
@router.get("/spotprices")
async def get_spot_prices(
    area: str,
    from_date: date,
    to_date: date,
    db: AsyncSession = Depends(get_db)
):
    """Get spot prices for area and date range"""
    stmt = select(models.SpotPrice).where(
        models.SpotPrice.area == area,
        models.SpotPrice.timestamp >= from_date,
        models.SpotPrice.timestamp < to_date + timedelta(days=1)
    ).order_by(models.SpotPrice.timestamp)
    
    result = await db.execute(stmt)
    prices = result.scalars().all()
    return prices

@router.get("/spotprices/current")
async def get_current_spot_price(area: str):
    """Get current hour's spot price"""
    service = EnergiDataService()
    price = await service.get_latest_spot_price(area)
    
    if not price:
        raise HTTPException(status_code=404, detail="Ingen pris fundet")
    
    return {
        "area": area,
        "timestamp": price["HourDK"],
        "price_dkk_per_kwh": float(service.convert_price_to_kwh(price["SpotPriceDKK"]))
    }

# AI Chat
@router.post("/chat")
async def energy_chat(
    message: str,
    conversation_history: List[Dict[str, str]] = None,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Chat with energy AI advisor"""
    from .agent import energy_agent
    
    # Build user context
    user_context = {}
    
    # Get metering point
    stmt = select(models.MeteringPoint).where(
        models.MeteringPoint.user_id == current_user.id,
        models.MeteringPoint.is_active == True
    )
    result = await db.execute(stmt)
    metering_point = result.scalar_one_or_none()
    
    if metering_point:
        user_context["metering_point"] = {
            "address": metering_point.address,
            "area": metering_point.area
        }
        
        # Get recent consumption
        to_date = date.today()
        from_date = to_date - timedelta(days=30)
        
        analyzer = EnergyAnalyzerService(db)
        analysis = await analyzer.analyze_consumption_pattern(
            metering_point_id=metering_point.id,
            from_date=from_date,
            to_date=to_date
        )
        
        if analysis:
            user_context["recent_consumption"] = analysis
    
    # Get current contract
    stmt = select(models.EnergyContract).where(
        models.EnergyContract.user_id == current_user.id,
        models.EnergyContract.status == "active"
    ).order_by(models.EnergyContract.created_at.desc())
    result = await db.execute(stmt)
    current_contract = result.scalar_one_or_none()
    
    if current_contract:
        user_context["current_contract"] = {
            "provider": current_contract.provider,
            "contract_type": current_contract.contract_type,
            "price_per_kwh": float(current_contract.price_per_kwh) if current_contract.price_per_kwh else None,
            "monthly_subscription": float(current_contract.monthly_subscription)
        }
    
    # Chat with agent
    response = await energy_agent.chat(
        message=message,
        conversation_history=conversation_history,
        user_context=user_context
    )
    
    return {"response": response}
```

#### **Dag 4-5: Quote Service & Email Automation**
- [ ] Implement `quote_service.py`
- [ ] Email generation with AI
- [ ] Email parsing with AI

```python
# domains/energy/services/quote_service.py

class QuoteService:
    """Service for managing energy quotes"""
    
    PROVIDERS = [
        {"name": "Ørsted", "email": "kundeservice@orsted.dk"},
        {"name": "Andel Energi", "email": "info@andelenergi.dk"},
        {"name": "OK", "email": "el@ok.dk"},
        {"name": "Ewii", "email": "kundeservice@ewii.com"},
        # ... more providers
    ]
    
    async def create_quote_request(
        self,
        user_id: UUID,
        preferences: Dict
    ) -> QuoteRequest:
        """Create quote request record"""
        pass
    
    async def send_quote_requests(self, quote_request_id: UUID):
        """Send emails to all providers"""
        # Generate personalized emails with AI
        # Send via email service
        pass
    
    async def parse_quote_email(self, email_body: str) -> EnergyQuote:
        """Parse quote from provider email using AI"""
        # Use GPT-4 structured output to extract:
        # - Provider name
        # - Contract type
        # - Price per kWh
        # - Monthly subscription
        # - Binding period
        # - Green energy yes/no
        pass
```

---

### **UGE 6-7: Frontend Development**

#### **Uge 6: Core Pages**
- [ ] Landing page redesign
- [ ] Onboarding flow (energy-focused)
- [ ] Dashboard with consumption graphs
- [ ] Contract management page

#### **Uge 7: Advanced Features & Admin Dashboard**
- [ ] Quote comparison page (dag 1-2)
- [ ] AI chat interface (dag 1-2)
- [ ] Settings & profile (dag 1-2)
- [ ] **Admin Dashboard (dag 3-5)** 🎛️ **NEW**
- [ ] Responsive design polish (ongoing)

**Key Frontend Components:**

```tsx
// app/page.tsx - Landing Page
export default function Home() {
  return (
    <main>
      <Hero 
        title="Stop med at overbetale for strøm"
        subtitle="Vi viser dig præcist hvor meget du spilder - og hvordan du sparer penge"
        cta="Tjek dit elforbrug gratis"
      />
      
      <Features />
      
      <HowItWorks />
      
      <Testimonials />
      
      <CTA />
    </main>
  )
}

// app/dashboard/page.tsx - Main Dashboard
export default function Dashboard() {
  const { data: consumption } = useConsumption(last30Days)
  const { data: analysis } = useConsumptionAnalysis(last30Days)
  const { data: spotPrices } = useSpotPrices()
  
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Dette års forbrug"
          value={`${consumption.total} kWh`}
          change="+5%"
        />
        <StatCard 
          title="Nuværende pris"
          value={`${spotPrices.current} kr/kWh`}
          trend="up"
        />
        <StatCard 
          title="Måneds betaling"
          value={`${analysis.monthCost} kr`}
        />
        <StatCard 
          title="Kunne spare"
          value={`${analysis.potentialSaving} kr`}
          highlight
        />
      </div>
      
      {/* Consumption Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Forbrug & Priser</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsumptionChart 
            data={consumption}
            spotPrices={spotPrices}
            range="7days"
          />
        </CardContent>
      </Card>
      
      {/* Current Contract */}
      <CurrentContractCard />
      
      {/* AI Insights */}
      <InsightsCard insights={analysis.recommendations} />
      
      {/* Available Quotes */}
      {quotes.length > 0 && (
        <QuotesCard quotes={quotes} />
      )}
    </div>
  )
}

// app/energy/consumption/page.tsx - Detailed Consumption
export default function ConsumptionPage() {
  return (
    <div>
      <DateRangePicker />
      
      {/* Detailed hourly/daily/monthly views */}
      <ConsumptionTable />
      
      {/* Export data */}
      <ExportButton />
    </div>
  )
}

// app/energy/quotes/page.tsx - Quote Comparison
export default function QuotesPage() {
  return (
    <div>
      {/* Request new quotes */}
      <RequestQuotesButton />
      
      {/* Top 3 recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuoteCard 
          quote={cheapest}
          badge="Billigst"
          highlight
        />
        <QuoteCard 
          quote={bestValue}
          badge="Bedst værdi"
        />
        <QuoteCard 
          quote={greenest}
          badge="Grønnest"
        />
      </div>
      
      {/* All quotes table */}
      <QuotesTable quotes={allQuotes} />
    </div>
  )
}

// app/chat/page.tsx - AI Chat
export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  
  const handleSend = async () => {
    const response = await api.energy.chat(input, messages)
    setMessages([...messages, 
      { role: "user", content: input },
      { role: "assistant", content: response }
    ])
    setInput("")
  }
  
  return (
    <div className="flex flex-col h-screen">
      <ChatMessages messages={messages} />
      <ChatInput 
        value={input}
        onChange={setInput}
        onSend={handleSend}
      />
    </div>
  )
}
```

---

### **UGE 7 (DAG 3-5): ADMIN DASHBOARD** 🎛️

**NEW ADDITION - Critical for V1 Launch**

Admin dashboard til at administrere platform, godkende quote requests, og overvåge system health.

#### **Backend: Admin Models & Endpoints**

```python
# app/models/admin.py
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base
from uuid import uuid4
from datetime import datetime

class AdminUser(Base):
    """Admin user accounts"""
    __tablename__ = "admin_users"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password_hash: Mapped[str]
    full_name: Mapped[str]
    role: Mapped[str] = mapped_column(default="admin")  # "super_admin", "admin", "viewer"
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    last_login_at: Mapped[Optional[datetime]]

# app/api/v1/endpoints/admin.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import List, Dict
from datetime import datetime, date, timedelta

router = APIRouter(prefix="/admin", tags=["admin"])

# Admin authentication dependency
async def get_admin_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    """Verify admin authentication"""
    # Implement admin JWT verification
    # Check if user is admin
    pass

# === USERS MANAGEMENT === 

@router.get("/users")
async def list_users(
    skip: int = 0,
    limit: int = 50,
    search: str = None,
    status: str = None,  # "active", "pending", "inactive"
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """
    List all users with filtering and pagination.
    
    Returns:
    - id, email, full_name
    - onboarding_completed
    - eloverblik_connected
    - contract_count
    - last_login_at
    - created_at
    """
    query = select(User)
    
    # Filters
    if search:
        query = query.where(
            or_(
                User.email.ilike(f"%{search}%"),
                User.full_name.ilike(f"%{search}%")
            )
        )
    
    if status == "active":
        query = query.where(User.onboarding_completed == True)
    elif status == "pending":
        query = query.where(User.onboarding_completed == False)
    
    # Pagination
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    users = result.scalars().all()
    
    # Enrich with additional data
    user_list = []
    for user in users:
        # Count contracts
        contract_count_query = select(func.count(EnergyContract.id)).where(
            EnergyContract.user_id == user.id
        )
        contract_count = await db.scalar(contract_count_query)
        
        # Check Eloverblik connection
        eloverblik_query = select(MeteringPoint).where(
            MeteringPoint.user_id == user.id,
            MeteringPoint.is_active == True
        )
        eloverblik_connected = (await db.execute(eloverblik_query)).scalar_one_or_none() is not None
        
        user_list.append({
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "onboarding_completed": user.onboarding_completed,
            "eloverblik_connected": eloverblik_connected,
            "contract_count": contract_count,
            "last_login_at": user.last_login_at,
            "created_at": user.created_at
        })
    
    # Total count
    total_query = select(func.count(User.id))
    if search:
        total_query = total_query.where(
            or_(
                User.email.ilike(f"%{search}%"),
                User.full_name.ilike(f"%{search}%")
            )
        )
    total = await db.scalar(total_query)
    
    return {
        "users": user_list,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/users/{user_id}")
async def get_user_details(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """Get detailed user information"""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get all related data
    # Metering points
    metering_points_query = select(MeteringPoint).where(MeteringPoint.user_id == user_id)
    metering_points = (await db.execute(metering_points_query)).scalars().all()
    
    # Contracts
    contracts_query = select(EnergyContract).where(EnergyContract.user_id == user_id)
    contracts = (await db.execute(contracts_query)).scalars().all()
    
    # Recent consumption (last 30 days)
    thirty_days_ago = date.today() - timedelta(days=30)
    total_consumption = Decimal(0)
    if metering_points:
        consumption_query = select(func.sum(Consumption.kwh)).where(
            Consumption.metering_point_id == metering_points[0].id,
            Consumption.timestamp >= thirty_days_ago
        )
        total_consumption = await db.scalar(consumption_query) or Decimal(0)
    
    # Quote requests
    quote_requests_query = select(QuoteRequest).where(
        QuoteRequest.user_id == user_id
    ).order_by(QuoteRequest.sent_at.desc()).limit(5)
    quote_requests = (await db.execute(quote_requests_query)).scalars().all()
    
    return {
        "user": {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone,
            "onboarding_completed": user.onboarding_completed,
            "created_at": user.created_at,
            "last_login_at": user.last_login_at
        },
        "metering_points": [
            {
                "id": str(mp.id),
                "address": mp.address,
                "area": mp.area,
                "authorized_at": mp.authorized_at,
                "last_sync_at": mp.last_sync_at
            }
            for mp in metering_points
        ],
        "contracts": [
            {
                "id": str(c.id),
                "provider": c.provider,
                "contract_type": c.contract_type,
                "monthly_cost": float(c.monthly_cost),
                "status": c.status
            }
            for c in contracts
        ],
        "consumption_last_30_days": float(total_consumption),
        "recent_quote_requests": [
            {
                "id": str(qr.id),
                "sent_at": qr.sent_at,
                "status": qr.status,
                "responses_count": qr.responses_count
            }
            for qr in quote_requests
        ]
    }

# === QUOTE REQUEST MANAGEMENT ===

@router.get("/quote-requests/pending")
async def get_pending_quote_requests(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """
    Get all quote requests waiting for approval.
    
    CRITICAL: These need admin approval before emails are sent to providers.
    """
    query = select(QuoteRequest).where(
        QuoteRequest.status == "pending_approval"
    ).order_by(QuoteRequest.created_at.desc())
    
    result = await db.execute(query)
    requests = result.scalars().all()
    
    enriched_requests = []
    for req in requests:
        # Get user
        user = await db.get(User, req.user_id)
        
        # Get metering point for consumption data
        mp_query = select(MeteringPoint).where(
            MeteringPoint.user_id == req.user_id,
            MeteringPoint.is_active == True
        )
        metering_point = (await db.execute(mp_query)).scalar_one_or_none()
        
        enriched_requests.append({
            "id": str(req.id),
            "user": {
                "id": str(user.id),
                "name": user.full_name,
                "email": user.email
            },
            "consumption_profile": {
                "avg_monthly_kwh": float(req.avg_monthly_consumption_kwh),
                "area": req.area
            },
            "preferences": req.preferences,
            "providers_to_contact": req.providers_contacted,
            "created_at": req.created_at,
            "metering_point_address": metering_point.address if metering_point else None
        })
    
    return {
        "pending_count": len(enriched_requests),
        "requests": enriched_requests
    }

@router.post("/quote-requests/{request_id}/approve")
async def approve_quote_request(
    request_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """
    Approve quote request and send emails to providers.
    """
    quote_request = await db.get(QuoteRequest, request_id)
    if not quote_request:
        raise HTTPException(status_code=404, detail="Quote request not found")
    
    if quote_request.status != "pending_approval":
        raise HTTPException(status_code=400, detail="Request already processed")
    
    # Update status
    quote_request.status = "approved"
    quote_request.approved_at = datetime.utcnow()
    quote_request.approved_by_admin_id = admin.id
    
    # Send emails (via QuoteService)
    from app.domains.energy.services.quote_service import QuoteService
    quote_service = QuoteService(db)
    await quote_service.send_quote_requests(request_id)
    
    quote_request.status = "sent"
    quote_request.sent_at = datetime.utcnow()
    
    await db.commit()
    
    return {"message": "Quote request approved and emails sent", "request_id": str(request_id)}

@router.post("/quote-requests/{request_id}/reject")
async def reject_quote_request(
    request_id: UUID,
    reason: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """Reject quote request"""
    quote_request = await db.get(QuoteRequest, request_id)
    if not quote_request:
        raise HTTPException(status_code=404, detail="Quote request not found")
    
    quote_request.status = "rejected"
    quote_request.rejection_reason = reason
    quote_request.rejected_at = datetime.utcnow()
    quote_request.rejected_by_admin_id = admin.id
    
    await db.commit()
    
    return {"message": "Quote request rejected"}

@router.post("/quote-requests/batch-approve")
async def batch_approve_quote_requests(
    request_ids: List[UUID],
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """Approve multiple quote requests at once"""
    approved_count = 0
    failed_count = 0
    
    for request_id in request_ids:
        try:
            await approve_quote_request(request_id, db, admin)
            approved_count += 1
        except Exception as e:
            failed_count += 1
            print(f"Failed to approve {request_id}: {e}")
    
    return {
        "approved": approved_count,
        "failed": failed_count,
        "total": len(request_ids)
    }

# === PLATFORM OVERVIEW ===

@router.get("/overview")
async def get_platform_overview(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """
    Platform overview dashboard stats.
    """
    # Total users
    total_users = await db.scalar(select(func.count(User.id)))
    
    # Users with Eloverblik connected
    eloverblik_connected = await db.scalar(
        select(func.count(func.distinct(MeteringPoint.user_id))).where(
            MeteringPoint.is_active == True
        )
    )
    
    # Quote requests stats
    total_quotes_sent = await db.scalar(
        select(func.count(QuoteRequest.id)).where(
            QuoteRequest.status == "sent"
        )
    )
    
    pending_approvals = await db.scalar(
        select(func.count(QuoteRequest.id)).where(
            QuoteRequest.status == "pending_approval"
        )
    )
    
    # New users last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    new_users_30d = await db.scalar(
        select(func.count(User.id)).where(
            User.created_at >= thirty_days_ago
        )
    )
    
    # Average consumption
    avg_consumption = await db.scalar(
        select(func.avg(QuoteRequest.avg_monthly_consumption_kwh))
    )
    
    return {
        "total_users": total_users,
        "eloverblik_connected": eloverblik_connected,
        "eloverblik_connection_rate": round((eloverblik_connected / total_users * 100) if total_users > 0 else 0, 1),
        "total_quotes_sent": total_quotes_sent,
        "pending_approvals": pending_approvals,
        "new_users_last_30_days": new_users_30d,
        "avg_monthly_consumption_kwh": float(avg_consumption) if avg_consumption else 0,
        "alerts": [
            {
                "type": "warning",
                "message": f"{pending_approvals} quote requests venter på godkendelse"
            } if pending_approvals > 0 else None
        ]
    }

# === EMAIL TEMPLATES ===

@router.get("/email-templates")
async def list_email_templates(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """List all email templates"""
    # This would query an EmailTemplate model
    # For MVP, can return hardcoded templates
    return {
        "templates": [
            {
                "id": "quote_request_default",
                "name": "Standard Quote Request",
                "subject": "Tilbudsforespørgsel fra Forbrugeragenten",
                "body_template": "..."  # Template with {{variables}}
            }
        ]
    }

# === SYSTEM HEALTH ===

@router.get("/health")
async def system_health(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_admin_user)
):
    """System health check"""
    
    # Check database
    try:
        await db.execute(select(1))
        db_healthy = True
    except:
        db_healthy = False
    
    # Check external APIs (would need actual implementation)
    eloverblik_healthy = True  # Placeholder
    energi_data_healthy = True  # Placeholder
    
    return {
        "status": "healthy" if all([db_healthy, eloverblik_healthy, energi_data_healthy]) else "degraded",
        "components": {
            "database": "healthy" if db_healthy else "unhealthy",
            "eloverblik_api": "healthy" if eloverblik_healthy else "unhealthy",
            "energi_data_api": "healthy" if energi_data_healthy else "unhealthy"
        },
        "timestamp": datetime.utcnow()
    }
```

#### **Frontend: Admin Dashboard Pages**

```tsx
// app/admin/layout.tsx
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <div className="hidden md:flex space-x-4">
                <NavLink href="/admin">Overview</NavLink>
                <NavLink href="/admin/users">Users</NavLink>
                <NavLink href="/admin/quote-requests">Quote Requests</NavLink>
                <NavLink href="/admin/templates">Templates</NavLink>
                <NavLink href="/admin/health">System Health</NavLink>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">{session.user.email}</span>
              <Button variant="ghost" size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

// app/admin/page.tsx - Overview Dashboard
export default async function AdminOverview() {
  const overview = await api.admin.getOverview()
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Platform Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Brugere"
          value={overview.total_users}
          icon={<UsersIcon />}
        />
        <StatCard
          title="Eloverblik Connected"
          value={`${overview.eloverblik_connected} (${overview.eloverblik_connection_rate}%)`}
          icon={<PlugIcon />}
        />
        <StatCard
          title="Quotes Sendt"
          value={overview.total_quotes_sent}
          icon={<MailIcon />}
        />
        <StatCard
          title="Venter Godkendelse"
          value={overview.pending_approvals}
          icon={<ClockIcon />}
          highlight={overview.pending_approvals > 0}
        />
      </div>
      
      {/* Alerts */}
      {overview.pending_approvals > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
            {overview.pending_approvals} tilbudsforespørgsler venter på godkendelse.
            <Link href="/admin/quote-requests" className="ml-2 underline">
              Gennemse nu →
            </Link>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Seneste 30 dage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Nye brugere</span>
              <span className="font-medium">{overview.new_users_last_30_days}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Gennemsnitligt forbrug</span>
              <span className="font-medium">{overview.avg_monthly_consumption_kwh} kWh/md</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// app/admin/users/page.tsx - Users Management
export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  useEffect(() => {
    fetchUsers()
  }, [search, statusFilter])
  
  const fetchUsers = async () => {
    const data = await api.admin.listUsers({ search, status: statusFilter })
    setUsers(data.users)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Brugere</h1>
        <Button onClick={() => fetchUsers()}>
          <RefreshIcon className="mr-2 h-4 w-4" />
          Opdater
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Søg efter email eller navn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Alle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="active">Aktive</SelectItem>
            <SelectItem value="pending">Afventer onboarding</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Eloverblik</TableHead>
              <TableHead>Kontrakter</TableHead>
              <TableHead>Oprettet</TableHead>
              <TableHead>Sidste login</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name || "-"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.eloverblik_connected ? (
                    <Badge variant="success">✓ Tilsluttet</Badge>
                  ) : (
                    <Badge variant="secondary">Ikke tilsluttet</Badge>
                  )}
                </TableCell>
                <TableCell>{user.contract_count}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>{formatDate(user.last_login_at)}</TableCell>
                <TableCell>
                  <Link href={`/admin/users/${user.id}`}>
                    <Button variant="ghost" size="sm">Se detaljer</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

// app/admin/quote-requests/page.tsx - Quote Request Management
export default function AdminQuoteRequests() {
  const [pendingRequests, setPendingRequests] = useState([])
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set())
  
  useEffect(() => {
    fetchPendingRequests()
  }, [])
  
  const fetchPendingRequests = async () => {
    const data = await api.admin.getPendingQuoteRequests()
    setPendingRequests(data.requests)
  }
  
  const handleApprove = async (requestId: string) => {
    await api.admin.approveQuoteRequest(requestId)
    toast.success("Tilbudsforespørgsel godkendt og sendt!")
    fetchPendingRequests()
  }
  
  const handleBatchApprove = async () => {
    await api.admin.batchApproveQuoteRequests(Array.from(selectedRequests))
    toast.success(`${selectedRequests.size} forespørgsler godkendt!`)
    setSelectedRequests(new Set())
    fetchPendingRequests()
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tilbudsforespørgsler</h1>
          <p className="text-gray-600 mt-1">
            {pendingRequests.length} venter på godkendelse
          </p>
        </div>
        
        {selectedRequests.size > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedRequests(new Set())}>
              Ryd valgte
            </Button>
            <Button onClick={handleBatchApprove}>
              <CheckIcon className="mr-2 h-4 w-4" />
              Godkend {selectedRequests.size} valgte
            </Button>
          </div>
        )}
      </div>
      
      {pendingRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium">Ingen forespørgsler venter!</p>
            <p className="text-gray-600">Alle tilbudsforespørgsler er behandlet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedRequests.has(request.id)}
                      onCheckedChange={(checked) => {
                        const newSelected = new Set(selectedRequests)
                        if (checked) {
                          newSelected.add(request.id)
                        } else {
                          newSelected.delete(request.id)
                        }
                        setSelectedRequests(newSelected)
                      }}
                    />
                    <div>
                      <CardTitle>{request.user.name}</CardTitle>
                      <CardDescription>
                        {request.user.email} • {formatDate(request.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge>{request.providers_to_contact.length} selskaber</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Forbrug</p>
                    <p className="font-medium">{request.consumption_profile.avg_monthly_kwh} kWh/måned</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Område</p>
                    <p className="font-medium">{request.consumption_profile.area}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="font-medium">{request.metering_point_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Præferencer</p>
                    <p className="font-medium">
                      {request.preferences.green_energy ? "Grøn energi" : "Ingen præference"}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Selskaber der kontaktes:</p>
                  <div className="flex flex-wrap gap-2">
                    {request.providers_to_contact.map((provider: string) => (
                      <Badge key={provider} variant="secondary">{provider}</Badge>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(request.id)}
                    className="flex-1"
                  >
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Godkend & Send
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <EyeIcon className="mr-2 h-4 w-4" />
                        Preview Email
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Email Preview</DialogTitle>
                      </DialogHeader>
                      {/* Email preview would go here */}
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" variant="outline">
                    <XIcon className="mr-2 h-4 w-4" />
                    Afvis
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// app/admin/health/page.tsx - System Health
export default function AdminSystemHealth() {
  const [health, setHealth] = useState(null)
  
  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])
  
  const fetchHealth = async () => {
    const data = await api.admin.getSystemHealth()
    setHealth(data)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Health</h1>
        <Badge variant={health?.status === "healthy" ? "success" : "warning"}>
          {health?.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={health?.components.database === "healthy" ? "text-green-600" : "text-red-600"}>
                {health?.components.database === "healthy" ? "✓ Healthy" : "✗ Unhealthy"}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Eloverblik API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={health?.components.eloverblik_api === "healthy" ? "text-green-600" : "text-red-600"}>
                {health?.components.eloverblik_api === "healthy" ? "✓ Healthy" : "✗ Unhealthy"}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">EnergiData API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className={health?.components.energi_data_api === "healthy" ? "text-green-600" : "text-red-600"}>
                {health?.components.energi_data_api === "healthy" ? "✓ Healthy" : "✗ Unhealthy"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

#### **Database Updates for Admin**

```python
# Add to existing migrations

class QuoteRequest(Base):
    # ... existing fields ...
    
    # Admin approval fields
    status: Mapped[str] = mapped_column(default="pending_approval")
    # "pending_approval", "approved", "rejected", "sent", "responses_received", "completed"
    
    approved_at: Mapped[Optional[datetime]]
    approved_by_admin_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("admin_users.id"))
    
    rejected_at: Mapped[Optional[datetime]]
    rejected_by_admin_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("admin_users.id"))
    rejection_reason: Mapped[Optional[str]]
```

#### **Admin Features Summary:**

**Level 2 - Recommended MVP (What we're building):**
- ✅ **Users Management**: List, search, filter, view details
- ✅ **Quote Request Approval**: Review pending requests, approve/reject individual or batch
- ✅ **Platform Overview**: Key metrics and alerts
- ✅ **Email Preview**: See emails before sending
- ✅ **System Health**: Monitor API status
- ✅ **Basic Analytics**: User counts, consumption averages

**Security:**
- Separate admin authentication (JWT-based)
- Role-based access (super_admin, admin, viewer)
- Audit trail (who approved/rejected what)

**Workflow:**
1. User requests quotes → Status: "pending_approval"
2. Admin reviews in dashboard → Preview email → Approve
3. System sends emails → Status: "sent"
4. Responses come in → Status: "responses_received"

---

### **UGE 8: Testing, Polish & Launch Prep**

#### **Dag 1-2: Testing**
- [ ] Unit tests for services
- [ ] Integration tests for API endpoints
- [ ] E2E tests with Playwright
- [ ] Load testing

#### **Dag 3-4: Polish & Bug Fixes**
- [ ] UI/UX polish
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Browser compatibility testing

#### **Dag 5: Documentation & Launch Prep**
- [ ] API documentation
- [ ] User guide
- [ ] Demo data seeding
- [ ] Marketing materials preparation
- [ ] Press release draft

---

## 🔐 **AUTHENTICATION & AUTHORIZATION**

### **MitID Integration (for fuldmagt):**
- [ ] Setup Criipto broker
- [ ] Implement MitID signing flow
- [ ] Fuldmagt template creation
- [ ] Legal compliance check

### **User Model Updates:**
```python
class User(Base):
    __tablename__ = "users"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(unique=True)
    phone: Mapped[Optional[str]]
    full_name: Mapped[Optional[str]]
    
    # Energy specific
    primary_area: Mapped[Optional[str]]  # "DK1" or "DK2"
    
    # MitID
    mitid_verified: Mapped[bool] = mapped_column(default=False)
    mitid_uuid: Mapped[Optional[str]]
    
    # Onboarding
    onboarding_completed: Mapped[bool] = mapped_column(default=False)
    onboarding_step: Mapped[int] = mapped_column(default=1)
    
    # Consent
    terms_accepted: Mapped[bool] = mapped_column(default=False)
    terms_accepted_at: Mapped[Optional[datetime]]
    privacy_accepted: Mapped[bool] = mapped_column(default=False)
    marketing_consent: Mapped[bool] = mapped_column(default=False)
    
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    updated_at: Mapped[datetime] = mapped_column(default=func.now(), onupdate=func.now())
    last_login_at: Mapped[Optional[datetime]]
```

---

## 📊 **MONITORING & ANALYTICS**

### **Key Metrics to Track:**
1. **User Engagement:**
   - Daily/Monthly Active Users
   - Eloverblik connection rate
   - Consumption sync frequency

2. **Product Metrics:**
   - Average consumption per user
   - Quote request rate
   - Quote acceptance rate
   - Average savings per user

3. **Technical Metrics:**
   - API response times
   - Error rates
   - Eloverblik API success rate
   - Database query performance

### **Tools:**
- **Backend:** Railway metrics + custom logging
- **Frontend:** Vercel Analytics
- **Errors:** Sentry (optional)
- **User Analytics:** PostHog or Mixpanel (optional)

---

## 🚀 **DEPLOYMENT STRATEGY**

### **Backend (Railway):**
```yaml
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100
  }
}
```

### **Frontend (Vercel):**
- Auto-deploy from `main` branch
- Environment variables configured
- Custom domain setup

### **Database:**
- Railway PostgreSQL
- Automated backups
- Connection pooling

### **Scheduled Tasks:**
```python
# Spot price sync (hourly)
# Consumption sync (daily)
# Quote request reminders (weekly)
```

---

## ✅ **DEFINITION OF DONE - V1 LAUNCH CRITERIA**

### **Must Have:**
- [ ] User can sign up and login
- [ ] User can connect Eloverblik
- [ ] System fetches and displays consumption data
- [ ] Dashboard shows consumption graphs
- [ ] Spot prices displayed and updated
- [ ] Basic analysis (monthly cost, savings potential)
- [ ] User can add current contract manually
- [ ] User can request quotes from providers
- [ ] **Admin dashboard for quote approval** 🎛️ **NEW**
- [ ] **Batch approve/reject quote requests** 🎛️ **NEW**
- [ ] **Platform overview & system health** 🎛️ **NEW**
- [ ] AI chat works with basic energy advice
- [ ] Responsive design (mobile + desktop)
- [ ] GDPR compliant (privacy policy, consent management)

### **Nice to Have:**
- [ ] Automated email parsing of quotes
- [ ] MitID signing for fuldmagt
- [ ] Automated quote scoring
- [ ] Advanced recommendations
- [ ] Email notifications
- [ ] Historical data visualization (6+ months)

### **Can Wait for V1.1:**
- [ ] Naturgas integration
- [ ] Bank integration (transaction matching)
- [ ] Premium tier
- [ ] Mobile app
- [ ] Partnership integrations with providers

---

## 📝 **DOCUMENTATION TO UPDATE**

### **Must Update:**
- [ ] README.md - New project description
- [ ] projectOverview.md - Energy focus
- [ ] QUICK_START.md - New setup instructions
- [ ] API documentation

### **Can Archive:**
- [ ] Insurance-related documentation
- [ ] Broker partnership docs (move to `/archived/`)

### **New Documentation:**
- [ ] ENERGY_API_GUIDE.md - How to use Eloverblik & EnergiDataService
- [ ] FRONTEND_COMPONENTS.md - Component library documentation
- [ ] USER_GUIDE.md - End-user documentation

---

## 💡 **SUCCESS METRICS - V1**

### **Week 4 (Mid-development):**
- [ ] Backend API functional (all energy endpoints)
- [ ] Eloverblik integration working with test account
- [ ] Frontend dashboard prototype live

### **Week 8 (Launch):**
- [ ] MVP deployed and accessible
- [ ] 10 beta users testing
- [ ] All critical bugs fixed
- [ ] Documentation complete

### **Week 12 (Post-launch):**
- [ ] 100 users onboarded
- [ ] 50+ users with Eloverblik connected
- [ ] Average 10+ quote requests per week
- [ ] User feedback collected and prioritized

---

## 🎯 **NEXT IMMEDIATE ACTIONS**

1. ✅ Git pull (DONE)
2. 📝 Create this V1_PLAN.md (IN PROGRESS)
3. 📝 Create ROADMAP_V2_PLUS.md (NEXT)
4. 🏗️ Start Week 1 tasks:
   - Rename project
   - Create domain structure
   - Archive insurance code

---

**Ready to start building! 🚀**

**Questions or adjustments needed? Let me know and we'll refine the plan before starting implementation.**

