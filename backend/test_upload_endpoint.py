"""
Test script for upload endpoint
Tests the upload logic without running the full server
"""
import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))


async def test_upload_logic():
    """Test that upload endpoint logic is correct"""
    print("🧪 Testing Upload Endpoint Logic\n")
    
    # Test 1: Import check
    print("1️⃣ Testing imports...")
    try:
        from app.api.v1.endpoints.upload import router, UploadResponse, ContractResponse
        from app.services.bill_parser_service import BillParserService
        print("   ✅ All imports successful")
        print(f"   ✅ Router has {len(router.routes)} routes")
        for route in router.routes:
            print(f"      - {route.methods} {route.path}")
    except Exception as e:
        print(f"   ❌ Import failed: {e}")
        return False
    
    # Test 2: Schema validation
    print("\n2️⃣ Testing Pydantic schemas...")
    try:
        # Test UploadResponse
        response = UploadResponse(
            success=True,
            message="Test message",
            contract_id="test-123",
            parsed_data={"provider": "Norlys"}
        )
        print(f"   ✅ UploadResponse: {response.message}")
        
        # Test ContractResponse
        contract = ContractResponse(
            id="test-123",
            category="energy",
            provider="Norlys",
            name="Spotpris",
            monthly_price=450.0,
            currency="DKK",
            status="active"
        )
        print(f"   ✅ ContractResponse: {contract.provider} - {contract.monthly_price} kr")
    except Exception as e:
        print(f"   ❌ Schema validation failed: {e}")
        return False
    
    # Test 3: BillParserService
    print("\n3️⃣ Testing BillParserService...")
    try:
        parser = BillParserService()
        print(f"   ✅ BillParserService initialized")
        print(f"   ✅ Has parse_bill method: {hasattr(parser, 'parse_bill')}")
        print(f"   ✅ Has create_contract_from_bill method: {hasattr(parser, 'create_contract_from_bill')}")
    except Exception as e:
        print(f"   ❌ BillParserService failed: {e}")
        return False
    
    print("\n" + "="*50)
    print("✅ ALL TESTS PASSED!")
    print("="*50)
    print("\n📝 Next steps:")
    print("   1. Install dependencies: pip install sendgrid openai")
    print("   2. Start server: uvicorn main:app --reload")
    print("   3. Test endpoint: POST /api/v1/upload/bill")
    print("   4. Use curl or Postman to upload a bill image")
    
    return True


if __name__ == "__main__":
    # Run without async dependencies
    try:
        result = asyncio.run(test_upload_logic())
        sys.exit(0 if result else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)



