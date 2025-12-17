/**
 * Browser-based Test Runner
 * Loads agents in browser and runs comprehensive tests
 */
const puppeteer = require('puppeteer');

(async () => {
    console.log('🧪 Starting Browser-based Agent System Tests\n');
    console.log('=' .repeat(60));
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Capture console logs
        const consoleLogs = [];
        page.on('console', (msg) => {
            consoleLogs.push(msg.text());
        });
        
        // Navigate to test page
        console.log('Navigating to test page...');
        await page.goto('http://localhost:8000/test.html', { waitUntil: 'networkidle0' });
        
        // Run tests
        console.log('Running tests...\n');
        const results = await page.evaluate(async () => {
            return new Promise((resolve) => {
                // Call runTests from the page
                if (typeof runTests === 'function') {
                    runTests().then(() => {
                        resolve(testResults);
                    });
                }
                
                // Wait up to 10 seconds
                setTimeout(() => resolve(testResults || []), 10000);
            });
        });
        
        // Display results
        let passed = 0;
        let failed = 0;
        
        for (const result of results) {
            const status = result.passed ? '✓ PASS' : '✗ FAIL';
            const statusClass = result.passed ? 'PASS' : 'FAIL';
            console.log(`${status}: ${result.testName}`);
            if (result.details) {
                console.log(`       ${result.details}`);
            }
            
            if (result.passed) passed++;
            else failed++;
        }
        
        console.log('=' .repeat(60));
        console.log(`\n📊 Test Results: ${passed}/${results.length} passed, ${failed} failed\n`);
        
        await browser.close();
        
        process.exit(failed > 0 ? 1 : 0);
    } catch (error) {
        console.error('❌ Test Error:', error.message);
        if (browser) await browser.close();
        process.exit(1);
    }
})();
