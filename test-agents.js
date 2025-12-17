#!/usr/bin/env node

/**
 * Agent System Test Suite
 * Tests all agents independently and in coordination
 */

// Simulated file object
class MockFile {
    constructor(name, size = 1024) {
        this.name = name;
        this.size = size;
        this.lastModified = Date.now();
    }
}

// Test Helper Functions
const tests = [];
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
    tests.push({ name, fn });
}

async function runTests() {
    console.log('\n🧪 Starting Agent System Test Suite\n');
    console.log('=' .repeat(60));

    for (const { name, fn } of tests) {
        try {
            process.stdout.write(`Testing: ${name}... `);
            await fn();
            console.log('✓ PASS');
            passedTests++;
        } catch (error) {
            console.log(`✗ FAIL: ${error.message}`);
            failedTests++;
        }
    }

    console.log('=' .repeat(60));
    console.log(`\n📊 Test Results: ${passedTests}/${tests.length} passed, ${failedTests} failed\n`);
    
    return failedTests === 0 ? 0 : 1;
}

// Test Suite
test('BaseAgent class exists', () => {
    if (typeof BaseAgent === 'undefined') throw new Error('BaseAgent not found');
});

test('BaseAgent instantiation', () => {
    const agent = new BaseAgent('TestAgent', 'Test');
    if (agent.name !== 'TestAgent') throw new Error('Name mismatch');
    if (agent.type !== 'Test') throw new Error('Type mismatch');
});

test('BaseAgent has required methods', () => {
    const agent = new BaseAgent('Test', 'Test');
    if (typeof agent.run !== 'function') throw new Error('Missing run method');
    if (typeof agent.subscribe !== 'function') throw new Error('Missing subscribe method');
    if (typeof agent.notify !== 'function') throw new Error('Missing notify method');
});

test('FileAnalysisAgent loads', () => {
    if (typeof FileAnalysisAgent === 'undefined') throw new Error('FileAnalysisAgent not found');
});

test('FileAnalysisAgent instantiation', () => {
    const agent = new FileAnalysisAgent();
    if (agent.name !== 'FileAnalysisAgent') throw new Error('Name mismatch');
});

test('FileAnalysisAgent executes', async () => {
    const agent = new FileAnalysisAgent();
    const mockFiles = [
        new MockFile('test.pdf', 1024 * 100),
        new MockFile('image.png', 1024 * 50)
    ];
    
    const result = await agent.run(mockFiles);
    if (result.filesAnalyzed !== 2) throw new Error(`Expected 2 files, got ${result.filesAnalyzed}`);
});

test('FileAnalysisAgent detects file types', async () => {
    const agent = new FileAnalysisAgent();
    const mockFiles = [
        new MockFile('doc.pdf'),
        new MockFile('image.jpg'),
        new MockFile('video.mp4')
    ];
    
    const result = await agent.run(mockFiles);
    const types = result.fileMetadata.map(f => f.type);
    if (!types.includes('PDF')) throw new Error('PDF not detected');
    if (!types.includes('Image')) throw new Error('Image not detected');
    if (!types.includes('Video')) throw new Error('Video not detected');
});

test('BatchProcessingAgent loads', () => {
    if (typeof BatchProcessingAgent === 'undefined') throw new Error('BatchProcessingAgent not found');
});

test('BatchProcessingAgent instantiation', () => {
    const agent = new BatchProcessingAgent(5);
    if (agent.batchSize !== 5) throw new Error('Batch size mismatch');
});

test('BatchProcessingAgent executes', async () => {
    const agent = new BatchProcessingAgent(2);
    const mockFiles = [
        { name: 'f1.txt', size: 100 },
        { name: 'f2.txt', size: 200 },
        { name: 'f3.txt', size: 300 }
    ];
    
    const result = await agent.run(mockFiles);
    if (result.batchCount !== 2) throw new Error(`Expected 2 batches, got ${result.batchCount}`);
});

test('AggregationAgent loads', () => {
    if (typeof AggregationAgent === 'undefined') throw new Error('AggregationAgent not found');
});

test('AggregationAgent instantiation', () => {
    const agent = new AggregationAgent();
    if (agent.name !== 'AggregationAgent') throw new Error('Name mismatch');
});

test('AggregationAgent executes', async () => {
    const agent = new AggregationAgent();
    const mockFiles = [
        { name: 'f1.txt', size: 100, type: 'Text' },
        { name: 'f2.pdf', size: 200, type: 'PDF' },
        { name: 'f3.txt', size: 300, type: 'Text' }
    ];
    
    const result = await agent.run(mockFiles);
    if (result.totalSize !== 600) throw new Error(`Expected total 600, got ${result.totalSize}`);
    if (result.averageSize !== 200) throw new Error(`Expected avg 200, got ${result.averageSize}`);
});

test('SecurityAnalysisAgent loads', () => {
    if (typeof SecurityAnalysisAgent === 'undefined') throw new Error('SecurityAnalysisAgent not found');
});

test('SecurityAnalysisAgent instantiation', () => {
    const agent = new SecurityAnalysisAgent();
    if (agent.name !== 'SecurityAnalysisAgent') throw new Error('Name mismatch');
});

test('SecurityAnalysisAgent executes', async () => {
    const agent = new SecurityAnalysisAgent();
    const mockFiles = [
        { name: 'program.exe', size: 1024, type: 'Executable' },
        { name: 'document.pdf', size: 500, type: 'PDF' }
    ];
    
    const result = await agent.run(mockFiles);
    if (!Array.isArray(result.findings)) throw new Error('Findings not an array');
});

test('SecurityAnalysisAgent detects threats', async () => {
    const agent = new SecurityAnalysisAgent();
    const mockFiles = [
        { name: 'virus.exe', size: 1024 * 5, type: 'Executable' }
    ];
    
    const result = await agent.run(mockFiles);
    if (result.findingsCount === 0) throw new Error('Should detect threat');
});

test('CoordinatorAgent loads', () => {
    if (typeof CoordinatorAgent === 'undefined') throw new Error('CoordinatorAgent not found');
});

test('CoordinatorAgent instantiation', () => {
    const agent = new CoordinatorAgent();
    if (agent.name !== 'CoordinatorAgent') throw new Error('Name mismatch');
});

test('CoordinatorAgent registers agents', () => {
    const coordinator = new CoordinatorAgent();
    coordinator.registerAgent(new FileAnalysisAgent());
    coordinator.registerAgent(new AggregationAgent());
    
    if (coordinator.agents.length !== 2) throw new Error(`Expected 2 agents, got ${coordinator.agents.length}`);
});

test('CoordinatorAgent executes full pipeline', async () => {
    const coordinator = new CoordinatorAgent();
    coordinator.registerAgent(new FileAnalysisAgent());
    coordinator.registerAgent(new BatchProcessingAgent(5));
    coordinator.registerAgent(new AggregationAgent());
    coordinator.registerAgent(new SecurityAnalysisAgent());
    
    const mockFiles = [
        new MockFile('file1.pdf', 1024 * 100),
        new MockFile('file2.docx', 1024 * 200)
    ];
    
    const report = await coordinator.run(mockFiles);
    if (!report.auditId) throw new Error('Missing audit ID');
    if (!report.summary) throw new Error('Missing summary');
    if (report.summary.totalFiles !== 2) throw new Error('File count mismatch');
});

test('CoordinatorAgent generates proper report', async () => {
    const coordinator = new CoordinatorAgent();
    coordinator.registerAgent(new FileAnalysisAgent());
    coordinator.registerAgent(new BatchProcessingAgent(5));
    coordinator.registerAgent(new AggregationAgent());
    coordinator.registerAgent(new SecurityAnalysisAgent());
    
    const mockFiles = [new MockFile('test.txt', 500)];
    const report = await coordinator.run(mockFiles);
    
    if (!report.timestamp) throw new Error('Missing timestamp');
    if (typeof report.totalExecutionTime !== 'number') throw new Error('Missing execution time');
    if (!Array.isArray(report.findings)) throw new Error('Missing findings');
});

test('Observer pattern works', async () => {
    let notified = false;
    const agent = new FileAnalysisAgent();
    agent.subscribe(() => { notified = true; });
    
    await agent.run([new MockFile('test.txt')]);
    
    if (!notified) throw new Error('Observer not notified');
});

test('Agent execution timing', async () => {
    const agent = new FileAnalysisAgent();
    const mockFiles = [new MockFile('test.txt')];
    
    const result = await agent.run(mockFiles);
    if (typeof result.executionTime !== 'number') throw new Error('Missing execution time');
    if (result.executionTime < 0) throw new Error('Invalid execution time');
});

test('Error handling - null input', async () => {
    const agent = new FileAnalysisAgent();
    try {
        await agent.run(null);
        throw new Error('Should have thrown error');
    } catch (e) {
        if (e.message === 'Should have thrown error') throw e;
        // Expected error
    }
});

test('Error handling - invalid input', async () => {
    const agent = new FileAnalysisAgent();
    try {
        await agent.run('invalid');
        throw new Error('Should have thrown error');
    } catch (e) {
        if (e.message === 'Should have thrown error') throw e;
        // Expected error
    }
});

// Load agents and run tests
console.log('📦 Loading agent files...');

// Read and eval agent files in correct order
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const agentFiles = [
    'js/agents/BaseAgent.js',
    'js/agents/FileAnalysisAgent.js',
    'js/agents/BatchProcessingAgent.js',
    'js/agents/AggregationAgent.js',
    'js/agents/SecurityAnalysisAgent.js',
    'js/agents/CoordinatorAgent.js'
];

const context = vm.createContext(global);

for (const file of agentFiles) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        const code = fs.readFileSync(fullPath, 'utf8');
        try {
            vm.runInContext(code, context, { filename: file });
            console.log(`✓ Loaded: ${file}`);
        } catch (error) {
            console.error(`✗ Error loading ${file}:`, error.message);
            process.exit(1);
        }
    } else {
        console.error(`✗ Not found: ${file}`);
        process.exit(1);
    }
}

console.log('\n');

// Run tests
runTests().then(code => process.exit(code));
