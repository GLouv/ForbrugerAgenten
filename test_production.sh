#!/bin/bash

# 🧪 PRODUCTION TEST SCRIPT - ForbrugerAgenten
# Run this to automatically test all production endpoints

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_URL="${FRONTEND_URL:-https://app.forbrugeragent.dk}"
BACKEND_URL="${BACKEND_URL:-https://forbrugeragent-backend.up.railway.app}"
TEST_EMAIL="${TEST_EMAIL:-test@example.com}"

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing $name... "
    
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10 2>/dev/null || echo "000")
    
    if [ "$response_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} ($response_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $response_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

test_json_response() {
    local name="$1"
    local url="$2"
    local key="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing $name... "
    
    response=$(curl -s "$url" --max-time 10 2>/dev/null || echo "{}")
    
    if echo "$response" | grep -q "\"$key\""; then
        echo -e "${GREEN}✓ PASS${NC} (JSON valid, key '$key' found)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Key '$key' not found)"
        echo "Response: $response"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  FORBRUGERAGENT PRODUCTION TEST SUITE ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo "  Frontend: $FRONTEND_URL"
echo "  Backend:  $BACKEND_URL"
echo ""

# FRONTEND TESTS
echo -e "${BLUE}━━━ FRONTEND TESTS ━━━${NC}"
test_endpoint "Landing Page" "$FRONTEND_URL/"
test_endpoint "Privacy Policy" "$FRONTEND_URL/privacy"
test_endpoint "Terms & Conditions" "$FRONTEND_URL/terms"
test_endpoint "Cookie Policy" "$FRONTEND_URL/cookies"
echo ""

# BACKEND TESTS
echo -e "${BLUE}━━━ BACKEND API TESTS ━━━${NC}"
test_json_response "Health Check" "$BACKEND_URL/health" "status"
test_json_response "SendGrid Status" "$BACKEND_URL/api/v1/webhooks/sendgrid/test" "status"
test_json_response "Inbox Stats" "$BACKEND_URL/api/v1/inbox/stats?user_id=test123" "total"
test_json_response "Inbox Messages" "$BACKEND_URL/api/v1/inbox?user_id=test123&limit=5" "messages"
test_json_response "Admin Stats" "$BACKEND_URL/api/v1/admin-dashboard/stats" "total_users"
test_json_response "Admin Email Flows" "$BACKEND_URL/api/v1/admin-dashboard/emails/flows" "sent_today"
echo ""

# SUMMARY
echo -e "${BLUE}━━━ TEST SUMMARY ━━━${NC}"
echo "Total Tests:  $TOTAL_TESTS"
echo -e "Passed:       ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:       ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Check Railway deployment status"
    echo "2. Review backend logs for errors"
    echo "3. Verify environment variables are set"
    echo ""
    exit 1
fi
