# Development Guide - Extending the Multi-Agent System

## Overview

This guide helps developers extend the Audit Agent system with new agents, features, and capabilities.

## Project Structure

```
js/
├── agents/
│   ├── BaseAgent.js              # Abstract base class
│   ├── FileAnalysisAgent.js      # File metadata extraction
│   ├── BatchProcessingAgent.js   # Batch operations
│   ├── AggregationAgent.js       # Statistics calculation
│   ├── SecurityAnalysisAgent.js  # Security checks
│   └── CoordinatorAgent.js       # Main orchestrator
└── script.js                      # Application logic

css/
└── styles.css                     # Styling and animations

index.html                         # HTML structure

README.md                          # User documentation
ARCHITECTURE.md                    # Technical architecture
QUICKSTART.md                      # Quick start guide
DEVELOPMENT.md                     # This file
```

## Creating a New Agent

### 1. Agent Template

Create a new file: `js/agents/MyCustomAgent.js`

```javascript
/**
 * MyCustomAgent - Description of what this agent does
 * Responsibilities: Specific calculations or analysis
 */
class MyCustomAgent extends BaseAgent {
    constructor() {
        super('MyCustomAgent', 'My Role');
        // Initialize any agent-specific properties
        this.customProperty = null;
    }

    /**
     * Main execution logic
     * @param {*} input - Input data from previous agent or coordinator
     * @returns {Object} Agent result
     */
    async execute(input) {
        // Validate input
        if (!input) {
            throw new Error('MyCustomAgent requires input');
        }

        // Perform calculations
        const result = this.performCalculations(input);

        // Simulate processing delay if needed
        await this.delay(250);

        return result;
    }

    /**
     * Core calculation method
     */
    performCalculations(input) {
        // Your logic here
        return {
            resultKey1: 'value1',
            resultKey2: 'value2'
        };
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
```

### 2. Register Agent

Add to `index.html`:
```html
<script src="js/agents/MyCustomAgent.js"></script>
```

### 3. Integrate with Coordinator

In `js/script.js`, update `initializeAgentSystem()`:

```javascript
function initializeAgentSystem() {
    const coordinator = new CoordinatorAgent();
    
    coordinator.registerAgent(new FileAnalysisAgent());
    coordinator.registerAgent(new BatchProcessingAgent(5));
    coordinator.registerAgent(new AggregationAgent());
    coordinator.registerAgent(new SecurityAnalysisAgent());
    coordinator.registerAgent(new MyCustomAgent());  // Add here
    
    return coordinator;
}
```

### 4. Add to Execution Plan (Optional)

In `CoordinatorAgent.execute()`:

```javascript
this.executionPlan.push({
    agent: this.agents.find(a => a.name === 'MyCustomAgent'),
    input: () => this.agentResults.FileAnalysisAgent?.result?.files || [],
    resultKey: 'myCustom'
});
```

## Common Agent Patterns

### Pattern 1: Simple Calculator Agent

```javascript
class StatsAgent extends BaseAgent {
    constructor() {
        super('StatsAgent', 'Statistics');
    }

    async execute(fileMetadata) {
        return {
            count: fileMetadata.length,
            avgSize: this.calculateAverage(fileMetadata),
            maxSize: Math.max(...fileMetadata.map(f => f.size)),
            minSize: Math.min(...fileMetadata.map(f => f.size))
        };
    }

    calculateAverage(data) {
        const sum = data.reduce((acc, item) => acc + item.size, 0);
        return Math.round(sum / data.length);
    }
}
```

### Pattern 2: Classification Agent

```javascript
class ClassifierAgent extends BaseAgent {
    constructor() {
        super('ClassifierAgent', 'Classifier');
    }

    async execute(fileMetadata) {
        const categories = this.classify(fileMetadata);
        return { categories };
    }

    classify(data) {
        const categories = {};
        data.forEach(item => {
            const category = this.getCategory(item);
            categories[category] = (categories[category] || 0) + 1;
        });
        return categories;
    }

    getCategory(item) {
        // Your classification logic
        return item.type;
    }
}
```

### Pattern 3: Validation Agent

```javascript
class ValidatorAgent extends BaseAgent {
    constructor() {
        super('ValidatorAgent', 'Validator');
    }

    async execute(fileMetadata) {
        const results = fileMetadata.map(item => ({
            file: item.name,
            isValid: this.validate(item),
            errors: this.getErrors(item)
        }));
        
        return {
            validCount: results.filter(r => r.isValid).length,
            invalidCount: results.filter(r => !r.isValid).length,
            details: results
        };
    }

    validate(item) {
        // Your validation logic
        return item.size > 0;
    }

    getErrors(item) {
        const errors = [];
        if (item.size === 0) errors.push('Empty file');
        if (!item.type) errors.push('Unknown type');
        return errors;
    }
}
```

### Pattern 4: Transformer Agent

```javascript
class TransformerAgent extends BaseAgent {
    constructor() {
        super('TransformerAgent', 'Transformer');
    }

    async execute(data) {
        const transformed = this.transform(data);
        return { transformed };
    }

    transform(data) {
        return data.map(item => ({
            ...item,
            processed: true,
            timestamp: new Date().toISOString(),
            hash: this.simpleHash(item.name)
        }));
    }

    simpleHash(str) {
        // Simple hash function
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
}
```

## Extending Existing Agents

### Extend FileAnalysisAgent

Add new file types:

```javascript
// In FileAnalysisAgent.extractFileType()
const typeMap = {
    // ... existing types ...
    'mp3': 'Audio File (MP3)',
    'mp4': 'Video File (MP4)',
    'mov': 'Video File (MOV)',
    'json': 'JSON Data',
    'yaml': 'YAML Configuration'
};
```

### Extend AggregationAgent

Add new statistics:

```javascript
// Add method to AggregationAgent
calculateMedianFileSize(fileMetadata) {
    const sizes = fileMetadata.map(f => f.size).sort((a, b) => a - b);
    const mid = Math.floor(sizes.length / 2);
    return sizes.length % 2 ? sizes[mid] : (sizes[mid - 1] + sizes[mid]) / 2;
}

// Include in execute() output
return {
    // ... existing ...
    medianFileSize: this.calculateMedianFileSize(fileMetadata)
};
```

### Extend SecurityAnalysisAgent

Add new security checks:

```javascript
// Add to performSecurityChecks()
performSecurityChecks(fileMetadata) {
    const findings = [];

    // ... existing checks ...

    // New check: Suspicious extensions
    const suspicious = ['scr', 'pif', 'com', 'vbs'];
    fileMetadata.forEach(file => {
        if (suspicious.includes(file.extension.toLowerCase())) {
            findings.push({
                type: 'warning',
                severity: 'high',
                file: file.name,
                message: 'Highly suspicious file type detected'
            });
        }
    });

    return findings;
}
```

## Working with CoordinatorAgent

### Access Results in Real-time

```javascript
class MyAgent extends BaseAgent {
    constructor(coordinator) {
        super('MyAgent', 'Custom');
        this.coordinator = coordinator;
    }

    async execute(input) {
        // Access previous agent results
        const fileAnalysisResult = this.coordinator.agentResults.FileAnalysisAgent;
        
        if (fileAnalysisResult) {
            return {
                basedOn: fileAnalysisResult.result
            };
        }
    }
}
```

### Modify Execution Plan

```javascript
// In CoordinatorAgent.execute()
// Define custom execution plan
this.executionPlan = [
    // Sequential execution
    { agent: fileAnalysis, input: files },
    // Parallel execution (same input)
    { agent: batch, input: () => ... },
    { agent: agg, input: () => ... },
    // Conditional execution
    ...(someCondition ? [{ agent: custom, input: () => ... }] : [])
];
```

## Testing Agents

### Unit Test Example

```javascript
// Test file: test/agents.test.js
function testFileAnalysisAgent() {
    const agent = new FileAnalysisAgent();
    const mockFiles = [
        { name: 'test.pdf', size: 1024, lastModified: Date.now() },
        { name: 'test.txt', size: 512, lastModified: Date.now() }
    ];

    agent.run(mockFiles).then(result => {
        console.assert(result.filesAnalyzed === 2, 'Should analyze 2 files');
        console.assert(result.files.length === 2, 'Should return 2 files');
        console.assert(result.files[0].type === 'PDF Document', 'Should detect PDF');
    });
}

testFileAnalysisAgent();
```

### Integration Test Example

```javascript
function testFullSystem() {
    const coordinator = new CoordinatorAgent();
    
    coordinator.registerAgent(new FileAnalysisAgent());
    coordinator.registerAgent(new BatchProcessingAgent());
    coordinator.registerAgent(new AggregationAgent());
    coordinator.registerAgent(new SecurityAnalysisAgent());

    const mockFiles = generateMockFiles(10);

    coordinator.run(mockFiles).then(report => {
        console.assert(report.auditId, 'Should have audit ID');
        console.assert(report.summary.totalFiles === 10, 'Should have 10 files');
        console.assert(report.agentReports.fileAnalysis, 'Should have file analysis report');
    });
}
```

## UI Integration

### Display Custom Agent Results

In `displayResults()`:

```javascript
// Add custom agent report section
if (report.agentReports.myCustom) {
    agentExecutionHTML += `
        <div style="margin-bottom: 15px; padding: 10px; background: #f0f0f0; border-radius: 6px;">
            <p><strong>${report.agentReports.myCustom.name}</strong></p>
            <p style="font-size: 0.9rem; color: #666;">
                Status: ${report.agentReports.myCustom.status} | 
                Time: ${report.agentReports.myCustom.executionTime}ms
            </p>
        </div>
    `;
}
```

### Add Custom Styles

In `css/styles.css`:

```css
.custom-agent-report {
    margin-bottom: 15px;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 6px;
}

.custom-agent-report h4 {
    margin: 0 0 8px 0;
    font-size: 0.95rem;
}

.custom-metric {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 10px;
}
```

## Performance Optimization

### 1. Lazy Loading Agents

```javascript
class LazyCoordinator extends CoordinatorAgent {
    async registerAgentLazy(name, AgentClass) {
        const agent = new AgentClass();
        this.agents.push(agent);
        // Load only when needed
    }
}
```

### 2. Caching Results

```javascript
class CachedAgent extends BaseAgent {
    constructor() {
        super('CachedAgent', 'Cached');
        this.cache = new Map();
    }

    async execute(input) {
        const key = this.getKey(input);
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        
        const result = await this.calculate(input);
        this.cache.set(key, result);
        return result;
    }
}
```

### 3. Parallel Processing

```javascript
// Process items in parallel chunks
async executeInParallel(items, chunkSize = 10) {
    const results = [];
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        const chunkResults = await Promise.all(
            chunk.map(item => this.processItem(item))
        );
        results.push(...chunkResults);
    }
    return results;
}
```

## Debugging

### Enable Debug Logging

```javascript
// Add to BaseAgent.run()
async run(input) {
    console.log(`[${this.name}] Starting execution...`);
    // ... rest of code ...
    console.log(`[${this.name}] Completed in ${this.executionTime}ms`);
}
```

### Agent Status Monitoring

```javascript
class DebugCoordinator extends CoordinatorAgent {
    async execute(files) {
        // Monitor each agent
        this.agents.forEach(agent => {
            agent.subscribe((result) => {
                console.log('Agent Result:', {
                    agent: result.agent,
                    status: result.status,
                    time: result.executionTime,
                    error: result.error
                });
            });
        });
        
        return super.execute(files);
    }
}
```

## Best Practices

### 1. Single Responsibility
Each agent should do one thing well.

### 2. Clear Input/Output
Define expected input and output formats.

### 3. Error Handling
Always catch and report errors gracefully.

### 4. Documentation
Document what each agent does and its parameters.

### 5. Consistent Naming
Use consistent naming patterns across agents.

### 6. Performance Aware
Consider execution time and memory usage.

### 7. Testable Design
Make agents independently testable.

### 8. Observable
Use observer pattern for result reporting.

## Common Modifications

### Change Agent Execution Order

In `CoordinatorAgent.execute()`:
```javascript
// Change order of agents
this.executionPlan = [
    { agent: security, input: files },  // Run security first
    { agent: fileAnalysis, input: files },
    // ... rest ...
];
```

### Skip Agents Conditionally

```javascript
if (skipSecurityCheck) {
    this.executionPlan = this.executionPlan.filter(
        step => step.agent.name !== 'SecurityAnalysisAgent'
    );
}
```

### Modify Batch Size

```javascript
coordinator.registerAgent(new BatchProcessingAgent(10)); // Change from 5 to 10
```

### Adjust Execution Delays

In agents, modify `delay()` calls:
```javascript
await this.delay(100); // Reduce from 300 to 100
```

## Deploying Changes

1. **Test locally**: Open `index.html` in browser
2. **Verify console**: Check for JavaScript errors (F12)
3. **Test functionality**: Upload files and run audit
4. **Review results**: Check all agent outputs
5. **Commit changes**: Push to git repository

```bash
git add -A
git commit -m "Add new agent: [AgentName]"
git push origin feature/lokesh
```

## Resources

- JavaScript: [MDN Web Docs](https://developer.mozilla.org/)
- Async/Await: [JavaScript.info](https://javascript.info/)
- Design Patterns: [Observer Pattern](https://refactoring.guru/design-patterns/observer)
- Git: [Git Documentation](https://git-scm.com/doc)

## Support

For questions or issues:
1. Check `ARCHITECTURE.md` for detailed design
2. Review existing agent code
3. Consult browser console logs
4. Check git history for similar changes

---

Happy coding! 🚀
