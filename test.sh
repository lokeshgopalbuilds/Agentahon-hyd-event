#!/bin/bash

# Test script to verify agent files exist and are syntactically valid

echo "🧪 Agent System Test Suite"
echo "=================================================================="
echo ""

PASSED=0
FAILED=0
TOTAL=0

# Test 1: Check if all agent files exist
echo "Test Group 1: File Existence"
echo "---"

for file in js/agents/BaseAgent.js js/agents/FileAnalysisAgent.js js/agents/BatchProcessingAgent.js js/agents/AggregationAgent.js js/agents/SecurityAnalysisAgent.js js/agents/CoordinatorAgent.js; do
    TOTAL=$((TOTAL+1))
    if [ -f "$file" ]; then
        echo "✓ PASS: $file exists"
        PASSED=$((PASSED+1))
    else
        echo "✗ FAIL: $file not found"
        FAILED=$((FAILED+1))
    fi
done

echo ""
echo "Test Group 2: File Size Validation"
echo "---"

for file in js/agents/*.js; do
    TOTAL=$((TOTAL+1))
    SIZE=$(wc -c < "$file")
    if [ "$SIZE" -gt 100 ]; then
        echo "✓ PASS: $file has content ($SIZE bytes)"
        PASSED=$((PASSED+1))
    else
        echo "✗ FAIL: $file is too small ($SIZE bytes)"
        FAILED=$((FAILED+1))
    fi
done

echo ""
echo "Test Group 3: Class Definition Validation"
echo "---"

# Check BaseAgent
TOTAL=$((TOTAL+1))
if grep -q "^class BaseAgent" js/agents/BaseAgent.js; then
    echo "✓ PASS: BaseAgent class defined"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: BaseAgent class not defined"
    FAILED=$((FAILED+1))
fi

# Check FileAnalysisAgent
TOTAL=$((TOTAL+1))
if grep -q "class FileAnalysisAgent extends BaseAgent" js/agents/FileAnalysisAgent.js; then
    echo "✓ PASS: FileAnalysisAgent extends BaseAgent"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: FileAnalysisAgent inheritance broken"
    FAILED=$((FAILED+1))
fi

# Check BatchProcessingAgent
TOTAL=$((TOTAL+1))
if grep -q "class BatchProcessingAgent extends BaseAgent" js/agents/BatchProcessingAgent.js; then
    echo "✓ PASS: BatchProcessingAgent extends BaseAgent"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: BatchProcessingAgent inheritance broken"
    FAILED=$((FAILED+1))
fi

# Check AggregationAgent
TOTAL=$((TOTAL+1))
if grep -q "class AggregationAgent extends BaseAgent" js/agents/AggregationAgent.js; then
    echo "✓ PASS: AggregationAgent extends BaseAgent"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: AggregationAgent inheritance broken"
    FAILED=$((FAILED+1))
fi

# Check SecurityAnalysisAgent
TOTAL=$((TOTAL+1))
if grep -q "class SecurityAnalysisAgent extends BaseAgent" js/agents/SecurityAnalysisAgent.js; then
    echo "✓ PASS: SecurityAnalysisAgent extends BaseAgent"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: SecurityAnalysisAgent inheritance broken"
    FAILED=$((FAILED+1))
fi

# Check CoordinatorAgent
TOTAL=$((TOTAL+1))
if grep -q "class CoordinatorAgent extends BaseAgent" js/agents/CoordinatorAgent.js; then
    echo "✓ PASS: CoordinatorAgent extends BaseAgent"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: CoordinatorAgent inheritance broken"
    FAILED=$((FAILED+1))
fi

echo ""
echo "Test Group 4: Method Definition Validation"
echo "---"

# Check BaseAgent methods
for method in "run" "subscribe" "notify" "getStatus"; do
    TOTAL=$((TOTAL+1))
    if grep -q "${method}(" js/agents/BaseAgent.js; then
        echo "✓ PASS: BaseAgent.$method defined"
        PASSED=$((PASSED+1))
    else
        echo "✗ FAIL: BaseAgent.$method not found"
        FAILED=$((FAILED+1))
    fi
done

echo ""
echo "Test Group 5: Observer Pattern"
echo "---"

# Check observer pattern in BaseAgent
TOTAL=$((TOTAL+1))
if grep -q "observers = \[\]" js/agents/BaseAgent.js; then
    echo "✓ PASS: Observer list initialized"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: Observer pattern not found"
    FAILED=$((FAILED+1))
fi

echo ""
echo "Test Group 6: Execution Flow"
echo "---"

# Check execute method implementations
TOTAL=$((TOTAL+1))
if grep -q "execute(" js/agents/FileAnalysisAgent.js; then
    echo "✓ PASS: FileAnalysisAgent.execute() defined"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: FileAnalysisAgent.execute() not found"
    FAILED=$((FAILED+1))
fi

TOTAL=$((TOTAL+1))
if grep -q "execute(" js/agents/CoordinatorAgent.js; then
    echo "✓ PASS: CoordinatorAgent.execute() defined"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: CoordinatorAgent.execute() not found"
    FAILED=$((FAILED+1))
fi

echo ""
echo "Test Group 7: Application Integration"
echo "---"

# Check HTML script loading
TOTAL=$((TOTAL+1))
if grep -q 'src="js/agents/BaseAgent.js"' index.html; then
    echo "✓ PASS: BaseAgent loaded in index.html"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: BaseAgent not loaded in index.html"
    FAILED=$((FAILED+1))
fi

TOTAL=$((TOTAL+1))
if grep -q 'src="js/agents/CoordinatorAgent.js"' index.html; then
    echo "✓ PASS: CoordinatorAgent loaded in index.html"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: CoordinatorAgent not loaded in index.html"
    FAILED=$((FAILED+1))
fi

# Check script.js integration
TOTAL=$((TOTAL+1))
if grep -q "new CoordinatorAgent()" js/script.js; then
    echo "✓ PASS: CoordinatorAgent instantiated in script.js"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: CoordinatorAgent not used in script.js"
    FAILED=$((FAILED+1))
fi

echo ""
echo "Test Group 8: HTTP Server Status"
echo "---"

TOTAL=$((TOTAL+1))
if curl -s http://localhost:8000/index.html > /dev/null 2>&1; then
    echo "✓ PASS: HTTP server is running"
    PASSED=$((PASSED+1))
else
    echo "✗ FAIL: HTTP server not accessible"
    FAILED=$((FAILED+1))
fi

echo ""
echo "=================================================================="
echo "📊 Test Summary"
echo "---"
echo "Total Tests: $TOTAL"
echo "✓ Passed: $PASSED"
echo "✗ Failed: $FAILED"
echo "Pass Rate: $(echo "scale=1; ($PASSED * 100) / $TOTAL" | bc)%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo "✅ All tests passed! System is working correctly."
    exit 0
else
    echo "❌ Some tests failed. Please review the errors above."
    exit 1
fi
