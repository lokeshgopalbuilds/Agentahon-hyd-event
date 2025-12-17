# Multi-Agent System Architecture Documentation

## Overview

The Audit Agent application implements a sophisticated **multi-agent system** for hierarchical file processing and analysis. Each agent specializes in specific calculations and reports results through a coordinated architecture.

## System Architecture

### Agent Hierarchy

```
                         ┌──────────────────────┐
                         │ CoordinatorAgent     │
                         │   (Orchestrator)     │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
         ┌───────▼────────┐  ┌──────▼──────┐  ┌───────▼──────────┐
         │ FileAnalysis   │  │  Batch      │  │ Aggregation      │
         │ Agent          │  │  Processing │  │ Agent            │
         │ (Level 1)      │  │  Agent      │  │ (Level 3)        │
         │                │  │ (Level 2)   │  │                  │
         └────────────────┘  └─────────────┘  └──────────────────┘
                 │
         ┌───────▼──────────────┐
         │ SecurityAnalysis     │
         │ Agent (Level 4)      │
         └──────────────────────┘
```

## Agent Specifications

### 1. BaseAgent (Abstract Base Class)

**File**: `js/agents/BaseAgent.js`

**Purpose**: Foundation class providing common agent functionality

**Key Properties**:
- `name` (String): Unique agent identifier
- `role` (String): Agent's functional role
- `status` (String): Current state (idle, running, completed, failed)
- `result` (Object): Agent's computation result
- `error` (String): Error message if execution fails
- `executionTime` (Number): Time taken to execute (ms)
- `observers` (Array): Subscribed listeners for results

**Key Methods**:
```javascript
subscribe(callback)           // Register result observer
notify(result)               // Broadcast result to observers
async execute(input)         // Main logic (override in subclasses)
async run(input)             // Execute with error handling & timing
getStatus()                  // Return current agent status
```

**Features**:
- Automatic error handling
- Execution time tracking
- Observer pattern implementation
- Status lifecycle management

---

### 2. FileAnalysisAgent

**File**: `js/agents/FileAnalysisAgent.js`

**Level**: 1 (Input Processing)

**Purpose**: Analyze individual files and extract metadata

**Input**:
```javascript
files: File[]  // Browser File API objects
```

**Output**:
```javascript
{
  filesAnalyzed: Number,
  files: [
    {
      id: Number,
      name: String,
      size: Number (bytes),
      type: String,
      extension: String,
      created: Number (timestamp),
      sizeFormatted: String
    }
  ],
  analysisTime: Number (ms)
}
```

**Key Methods**:
```javascript
execute(files)               // Main analysis logic
extractFileType(filename)    // Determine file type from extension
getFileExtension(filename)   // Extract file extension
formatFileSize(bytes)        // Convert bytes to human-readable format
```

**Supported File Types**:
- PDF, Word (DOC/DOCX), Excel (XLS/XLSX), Text, CSV
- Images (JPG, PNG, GIF)
- Archives (ZIP, RAR, 7Z)
- Other file types (generic classification)

**Processing Time**: ~300ms

---

### 3. BatchProcessingAgent

**File**: `js/agents/BatchProcessingAgent.js`

**Level**: 2 (Batch Processing)

**Purpose**: Group files into batches and validate them

**Constructor Parameter**:
```javascript
batchSize: Number = 5  // Files per batch
```

**Input**:
```javascript
fileMetadata: Object[]  // Output from FileAnalysisAgent
```

**Output**:
```javascript
{
  totalBatches: Number,
  batchSize: Number,
  processedBatches: [
    {
      batchIndex: Number,
      fileCount: Number,
      files: String[],
      batchStatus: String,
      validFiles: Number,
      invalidFiles: Number
    }
  ],
  validationStatus: String
}
```

**Key Methods**:
```javascript
execute(fileMetadata)        // Main batch processing
createBatches(fileMetadata)  // Divide into chunks
processBatch(batch, index)   // Validate individual batch
```

**Processing Time**: ~200ms per batch (parallel execution)

**Default Configuration**:
- Batch Size: 5 files per batch
- Validation: Automatic
- Execution: Parallel processing

---

### 4. AggregationAgent

**File**: `js/agents/AggregationAgent.js`

**Level**: 3 (Statistics & Aggregation)

**Purpose**: Calculate statistics and aggregate data

**Input**:
```javascript
fileMetadata: Object[]  // Output from FileAnalysisAgent
```

**Output**:
```javascript
{
  totalFiles: Number,
  totalSize: Number (bytes),
  totalSizeFormatted: String,
  averageFileSize: Number (bytes),
  averageFileSizeFormatted: String,
  fileTypes: [
    {
      type: String,
      count: Number,
      percentage: Number
    }
  ],
  sizeDistribution: {
    small: Number,      // < 1 MB
    medium: Number,     // 1 MB - 10 MB
    large: Number       // > 10 MB
  },
  largestFile: Object,  // File metadata
  smallestFile: Object  // File metadata
}
```

**Key Methods**:
```javascript
execute(fileMetadata)              // Main aggregation logic
aggregateFileTypes(fileMetadata)   // Group by type with counts
calculateSizeDistribution(...)     // Categorize by size
getLargestFile(fileMetadata)       // Find max size file
getSmallestFile(fileMetadata)      // Find min size file
```

**Processing Time**: ~250ms

**Statistics Provided**:
- File count and total size
- Average file size
- File type distribution with percentages
- Size categories (small/medium/large)
- Extremes (largest and smallest files)

---

### 5. SecurityAnalysisAgent

**File**: `js/agents/SecurityAnalysisAgent.js`

**Level**: 4 (Security Analysis)

**Purpose**: Perform security checks and risk assessment

**Input**:
```javascript
fileMetadata: Object[]  // Output from FileAnalysisAgent
```

**Output**:
```javascript
{
  totalChecks: Number,
  findingsCount: Number,
  riskLevel: String,      // 'low', 'medium', 'high', 'critical'
  findings: [
    {
      type: String,       // 'success', 'warning', 'error', 'info'
      severity: String,   // 'low', 'medium', 'high'
      file: String,
      message: String
    }
  ],
  integrityStatus: String,
  threatDetected: Boolean
}
```

**Key Methods**:
```javascript
execute(fileMetadata)                // Main security analysis
performSecurityChecks(fileMetadata)  // Analyze threats
calculateRiskLevel(findings)         // Determine overall risk
```

**Security Checks**:
1. **Suspicious File Types**: Detects executable files (exe, bat, cmd, sh, app)
2. **Large Files**: Identifies files > 100 MB
3. **Integrity Verification**: Confirms file reading success
4. **Malware Scanning**: Placeholder for future real scanning

**Risk Levels**:
- `critical`: Errors detected
- `high`: Multiple warnings
- `medium`: Single warning
- `low`: No issues found

**Processing Time**: ~400ms

**Finding Types**:
- `success` (Green): Positive findings
- `warning` (Orange): Suspicious findings
- `error` (Red): Critical issues
- `info` (Blue): Information findings

---

### 6. CoordinatorAgent

**File**: `js/agents/CoordinatorAgent.js`

**Level**: Orchestrator (Master)

**Purpose**: Coordinate all agents and generate comprehensive reports

**Key Properties**:
```javascript
agents: BaseAgent[]           // Registered agents
executionPlan: Object[]       // Ordered execution sequence
agentResults: Object          // Collected agent results
```

**Key Methods**:
```javascript
registerAgent(agent)          // Add agent to system
execute(files)               // Orchestrate full execution
generateFinalReport()        // Merge and format results
generateAuditId()            // Create unique audit ID
calculateTotalExecutionTime()// Sum agent execution times
```

**Execution Sequence**:
1. FileAnalysisAgent runs first
2. FileAnalysis output feeds into:
   - BatchProcessingAgent (parallel)
   - AggregationAgent (parallel)
   - SecurityAnalysisAgent (parallel)
3. All results merged into final report

**Final Report Structure**:
```javascript
{
  auditId: String,                    // Unique identifier
  timestamp: String,                  // When audit completed
  status: String,                     // 'completed'
  totalExecutionTime: Number,         // ms
  
  summary: {
    totalFiles: Number,
    totalSize: String,
    fileTypes: Object[],
    riskLevel: String
  },

  agentReports: {
    fileAnalysis: { name, status, executionTime, filesAnalyzed },
    batchProcessing: { name, status, executionTime, totalBatches },
    aggregation: { name, status, executionTime, statistics },
    security: { name, status, executionTime, findingsCount, threatDetected }
  },

  findings: Object[],                 // Security findings
  
  detailedResults: {
    files: Object[],
    aggregationData: Object,
    securityAnalysis: Object
  }
}
```

**Processing Time**: Depends on total agent execution (typically 1000-1500ms)

---

## Execution Flow Diagram

```
User Uploads Files
        │
        ▼
┌──────────────────────┐
│ User Clicks "Audit"  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ CoordinatorAgent.run()       │
└──────────┬───────────────────┘
           │
           ├─────────────────────────────────────┐
           │                                     │
           ▼                                     │
┌──────────────────────────────┐                │
│ FileAnalysisAgent.run()      │                │
│ (300ms)                      │                │
└──────────┬───────────────────┘                │
           │                                     │
           ├─ Output: File Metadata              │
           │                                     │
           │ (Triggers next 3 agents in         │
           │  parallel)                         │
           │                                     │
    ┌──────┼──────────────┬──────────────┐      │
    │      │              │              │      │
    ▼      ▼              ▼              ▼      │
┌────┐ ┌──────┐      ┌────────┐    ┌──────┐   │
│BAT │ │AGGR │      │SECURITY│    │      │   │
│200ms│ │250ms │      │400ms   │    │      │   │
└────┘ └──────┘      └────────┘    └──────┘   │
    │      │              │              │      │
    └──────┼──────────────┴──────────────┘      │
           │                                     │
           ▼                                     │
┌──────────────────────────────┐                │
│ All Results Collected        │                │
└──────────┬───────────────────┘                │
           │                                     │
           ▼                                     │
┌──────────────────────────────┐                │
│ generateFinalReport()        │ ◄──────────────┘
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Display Results in UI        │
└──────────────────────────────┘
```

---

## Data Flow Between Agents

### Level 1: Input
```
Browser File API
    ↓
uploadedFiles: File[]
```

### Level 2: FileAnalysisAgent Output
```
fileMetadata: [
  { id, name, size, type, extension, created, sizeFormatted },
  { id, name, size, type, extension, created, sizeFormatted },
  ...
]
```

### Level 3: Agent Processing
```
FileMetadata
  ├→ BatchProcessingAgent
  │   └→ Batches: { batchIndex, fileCount, files, status }
  │
  ├→ AggregationAgent
  │   └→ Statistics: { totalSize, averageSize, fileTypes, distribution }
  │
  └→ SecurityAnalysisAgent
      └→ Findings: { riskLevel, findings[] }
```

### Level 4: Final Report
```
CoordinatorAgent merges:
  - FileAnalysis results
  - BatchProcessing results
  - Aggregation results
  - SecurityAnalysis results
  
  ↓
  
Final comprehensive report
```

---

## Performance Characteristics

### Execution Times
| Agent | Time | Parallelization |
|-------|------|-----------------|
| FileAnalysisAgent | ~300ms | Sequential |
| BatchProcessingAgent | ~200ms/batch | Parallel |
| AggregationAgent | ~250ms | Sequential |
| SecurityAnalysisAgent | ~400ms | Sequential |
| **Total (typical)** | **1000-1500ms** | **Mixed** |

### Memory Usage
- Small files (< 10 files): ~2-5 MB
- Medium files (10-50 files): ~5-15 MB
- Large files (50+ files): ~15-50 MB

### Scalability
- Handles up to 1000+ files efficiently
- Batch processing ensures manageable memory
- Parallel agent execution reduces total time

---

## Observer Pattern Implementation

### Architecture

```
Agent                          Observers
┌─────────────┐          ┌──────────────────┐
│ BaseAgent   │          │ Observer List    │
│             │──┬─register─→ [Coordinator] │
│ observers[] │  │       │   [UI]           │
│             │  │       │   [Logger]       │
└─────────────┘  │       └──────────────────┘
                 │
             notify()
                 │
              Results
```

### Usage Pattern

```javascript
// Subscribe to agent results
agent.subscribe((result) => {
  console.log(`${result.agent} completed in ${result.executionTime}ms`);
  // Handle result
});

// Run agent (automatically notifies subscribers)
await agent.run(input);
```

---

## Error Handling Strategy

### Error Flow

```
Agent.execute() throws Error
        ↓
Agent.run() catches it
        ↓
Status = 'failed'
        ↓
notify({
  status: 'failed',
  error: message,
  agent: name
})
        ↓
Error propagated to CoordinatorAgent
        ↓
Coordinator continues with other agents
        ↓
Final report includes error information
```

### Error Recovery
- Individual agent failures don't stop entire audit
- Partial results are still included
- Error details preserved in final report
- User notified of failures in UI

---

## Extending the System

### Adding a New Agent

1. **Create Agent File**:
```javascript
// js/agents/CustomAgent.js
class CustomAgent extends BaseAgent {
    constructor() {
        super('CustomAgent', 'Custom Role');
    }

    async execute(input) {
        // Your logic here
        return { result: 'data' };
    }
}
```

2. **Register in index.html**:
```html
<script src="js/agents/CustomAgent.js"></script>
```

3. **Add to Coordinator**:
```javascript
coordinator.registerAgent(new CustomAgent());
```

4. **Update Execution Plan** (in CoordinatorAgent):
```javascript
this.executionPlan.push({
    agent: this.agents.find(a => a.name === 'CustomAgent'),
    input: () => inputData,
    resultKey: 'custom'
});
```

### Common Extension Points

- **New file type detection**: Extend `FileAnalysisAgent.extractFileType()`
- **New statistics**: Extend `AggregationAgent`
- **New security checks**: Extend `SecurityAnalysisAgent.performSecurityChecks()`
- **Custom formatting**: Extend agent output methods

---

## Integration with UI

### Result Display Components

1. **Audit Header**:
   - Audit ID, Timestamp, Execution Time

2. **Summary Section**:
   - Total files, total size, risk level

3. **File Types Section**:
   - File type distribution with counts

4. **Agent Reports Section**:
   - Individual agent status and timing

5. **Findings Section**:
   - Security findings with severity

6. **Details Section** (optional):
   - Expandable detailed results

### Event Handling

```javascript
// User interaction
auditButton.addEventListener('click', async () => {
    agentSystem = initializeAgentSystem();
    const report = await agentSystem.run(uploadedFiles);
    displayResults(report);
});
```

---

## Testing Strategy

### Unit Testing Agents

```javascript
// Test FileAnalysisAgent
const agent = new FileAnalysisAgent();
const result = await agent.execute(mockFiles);
assert.equal(result.filesAnalyzed, mockFiles.length);

// Test with observer
agent.subscribe(result => {
  assert.equal(result.status, 'completed');
});
await agent.run(mockFiles);
```

### Integration Testing

```javascript
// Test full coordinator flow
const coordinator = new CoordinatorAgent();
coordinator.registerAgent(new FileAnalysisAgent());
// ... register all agents
const report = await coordinator.run(mockFiles);
assert(report.auditId);
assert(report.summary.totalFiles > 0);
```

---

## Future Enhancements

1. **Real Security Scanning**: Integrate actual antivirus/malware detection
2. **Persistent Storage**: Save audit results to database
3. **Backend Agents**: Distribute agents across multiple servers
4. **Advanced Analytics**: Machine learning for threat detection
5. **Report Generation**: PDF/Excel export functionality
6. **Audit History**: Track previous audits
7. **Scheduled Audits**: Automatic periodic scanning
8. **Real-time Updates**: WebSocket for live result streaming

---

## Conclusion

The multi-agent system provides a scalable, maintainable architecture for complex file audit operations. Each agent specializes in specific calculations, results are coordinated centrally, and the entire system remains flexible for future enhancements.
