# Visual Architecture Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUDIT AGENT SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   USER INTERFACE                        │    │
│  │  ┌──────────────┐ ┌──────────┐ ┌──────────────────┐    │    │
│  │  │ File Upload  │ │ File List│ │ Results Display  │    │    │
│  │  └──────────────┘ └──────────┘ └──────────────────┘    │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                             │                                     │
│  ┌──────────────────────────▼──────────────────────────────┐    │
│  │             MULTI-AGENT SYSTEM                          │    │
│  │                                                          │    │
│  │  ┌────────────────────────────────────────────────┐    │    │
│  │  │         COORDINATOR AGENT                      │    │    │
│  │  │  • Orchestrates all agents                     │    │    │
│  │  │  • Manages execution sequence                  │    │    │
│  │  │  • Generates final report                      │    │    │
│  │  └────────────┬───────────────────────────────────┘    │    │
│  │               │                                          │    │
│  │      ┌────────┼────────┬──────────────┐                 │    │
│  │      │        │        │              │                 │    │
│  │  ┌───▼──┐ ┌───▼──┐ ┌───▼──┐ ┌─────────▼────┐           │    │
│  │  │FILE  │ │BATCH │ │AGGR. │ │SECURITY      │           │    │
│  │  │      │ │      │ │      │ │              │           │    │
│  │  │AGENT │ │AGENT │ │AGENT │ │AGENT         │           │    │
│  │  └──────┘ └──────┘ └──────┘ └──────────────┘           │    │
│  │                                                          │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Agent Interaction Flow

```
USER ACTION: Click "Start Audit"
        │
        ▼
┌─────────────────────────────┐
│  Coordinator.run(files)     │
│  └─ Initialize agents       │
└──────────────┬──────────────┘
               │
               ▼
        ┌──────────────────────────┐
        │ STAGE 1: FILE ANALYSIS   │
        │                          │
        │ FileAnalysisAgent.run()  │ ◄─── Input: Raw Files
        │ ├─ Extract metadata      │
        │ ├─ Detect type           │
        │ └─ Calculate size        │
        │                          │
        │ ✓ Output: File Metadata  │
        └────┬──────────────────────┘
             │
      ┌──────┴──────────────────────┐
      │                             │
      ▼                             ▼
┌──────────────────┐    ┌────────────────────────┐
│STAGE 2a:BATCH    │    │STAGE 2b:STATISTICS     │
│                  │    │                        │
│BatchProcessor... │    │AggregationAgent...     │ (PARALLEL)
│├─Group files     │    │├─ Count totals        │
│├─Validate batch  │    │├─ Calculate average   │
│└─Check validity  │    │├─ File distribution   │
│                  │    │└─ Find extremes       │
│✓ Batches        │    │✓ Statistics           │
└─────────┬────────┘    └──────────┬─────────────┘
          │                        │
          └──────────┬─────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │STAGE 2c:SECURITY         │
        │                          │
        │SecurityAnalysisAgent...  │ (PARALLEL)
        │├─ Check file types       │
        │├─ Scan for threats       │
        │├─ Verify integrity       │
        │└─ Calculate risk level   │
        │                          │
        │✓ Findings & Risk Level   │
        └────┬─────────────────────┘
             │
      ┌──────┴────────────┐
      │                   │
      ▼                   ▼
      Results Collected
      (From all agents)
             │
             ▼
        ┌────────────────────┐
        │ STAGE 3: MERGE     │
        │                    │
        │ Coordinator merges │
        │ all results into   │
        │ final report       │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ FINAL REPORT       │
        │ ├─ Audit ID        │
        │ ├─ Timestamp       │
        │ ├─ Summary         │
        │ ├─ Agent Reports   │
        │ ├─ Findings        │
        │ └─ Details         │
        └────────┬───────────┘
                 │
                 ▼
        UI Displays Results
```

## Data Transformation Pipeline

```
INPUT LAYER
────────────────────────────────────────
        ↓
    [File Objects]
    (Browser File API)
    ├─ name
    ├─ size
    ├─ type
    └─ lastModified
        │
────────────────────────────────────────
PROCESSING LAYER 1: FileAnalysisAgent
────────────────────────────────────────
        │
        ├→ Extract extension
        ├→ Detect file type
        ├→ Format file size
        └→ Collect metadata
        │
        ▼
    [File Metadata Array]
    ├─ id
    ├─ name
    ├─ size (bytes)
    ├─ type (string)
    ├─ extension
    ├─ created
    └─ sizeFormatted
        │
────────────────────────────────────────
PROCESSING LAYER 2: Three Parallel Agents
────────────────────────────────────────
        │
    ┌───┴───────────┬─────────────┐
    │               │             │
    ▼               ▼             ▼
[Batch Data]  [Statistics]  [Findings]
├─Batches      ├─Total Size   ├─Risk Level
├─Validation   ├─Average Size │─Threats
└─Status       ├─File Types   └─Integrity
              ├─Distribution
              └─Extremes
        │
────────────────────────────────────────
COORDINATOR LAYER: Result Merge
────────────────────────────────────────
        │
        ├→ Assign Audit ID
        ├→ Record Timestamp
        ├→ Calculate Total Time
        ├→ Merge Agent Reports
        ├→ Combine Findings
        └→ Organize Details
        │
        ▼
OUTPUT LAYER
────────────────────────────────────────
    [Comprehensive Report]
    ├─ Meta Information
    │  ├─ auditId
    │  ├─ timestamp
    │  └─ totalExecutionTime
    │
    ├─ Summary
    │  ├─ totalFiles
    │  ├─ totalSize
    │  ├─ fileTypes
    │  └─ riskLevel
    │
    ├─ Agent Reports
    │  ├─ fileAnalysis
    │  ├─ batchProcessing
    │  ├─ aggregation
    │  └─ security
    │
    ├─ Detailed Findings
    │  ├─ Security findings
    │  ├─ File details
    │  └─ Statistics
    │
    └─ UI Display
```

## Agent Communication Pattern

```
OBSERVER PATTERN IMPLEMENTATION
════════════════════════════════════════

        ┌─────────────────┐
        │   BaseAgent     │
        │                 │
        │ Properties:     │
        │ • observers[]   │ ◄─── Subscriber list
        │ • status        │
        │ • result        │
        │ • executionTime │
        └─────────────────┘
             ▲   │
             │   │
    subscribe│   │notify
             │   ▼
        ┌──────────────┐
        │ Subscribers  │
        │              │
        │ ┌──────────┐ │
        │ │Coordinator◄┼┤ Listens for results
        │ └──────────┘ │
        │ ┌──────────┐ │
        │ │Logger    ◄┼┤ Logs execution
        │ └──────────┘ │
        │ ┌──────────┐ │
        │ │UI Display◄┼┤ Updates display
        │ └──────────┘ │
        └──────────────┘

EXECUTION FLOW
════════════════════════════════════════

Agent.run(input)
  │
  ├─ Set status = 'running'
  ├─ Record start time
  │
  ├─ Execute agent.execute(input)
  │   └─ Perform calculations
  │       └─ Return result object
  │
  ├─ Set status = 'completed'
  ├─ Calculate executionTime
  │
  └─ notify({
       agent: name,
       status: 'completed',
       result: result,
       executionTime: ms
     })
       │
       ▼
     [Call all subscribed callbacks]
       │
       ├─ Coordinator collects result
       ├─ Logger records execution
       └─ UI updates metrics
```

## Execution Timeline

```
TIME AXIS
─────────────────────────────────────────────────────────────────

0ms   100ms  200ms  300ms  400ms  500ms  600ms  700ms  800ms...
│      │      │      │      │      │      │      │      │
│      │      │      │      │      │      │      │      │
├──────────────────────────────────────────────────────────────
│  FileAnalysisAgent
│  ◄──────┤ (300ms)
│         ├─ Analyze files
│         ├─ Extract metadata
│         └─ Done!
│
│         ├──────────────────────────────────────────────
│         │  BatchProcessingAgent (parallel)
│         │  ◄──┤ (200ms for batch work)
│         │
│         ├──────────────────────────────────────────────
│         │  AggregationAgent (parallel)
│         │  ◄────────┤ (250ms)
│         │
│         ├──────────────────────────────────────────────
│         │  SecurityAnalysisAgent (parallel)
│         │  ◄──────────────────┤ (400ms)
│         │
│         │                    ├─ All parallel complete
│         │                    │
│         │                    ├──────────────────────────
│         │                    │  CoordinatorAgent merges
│         │                    │  ◄─┤ (minimal)
│         │                    │
│         │                    └─ Final Report Ready!
│         │
│         └─ Total: ~1000-1500ms
│
└──────────────────────────────────────────────────────────────
```

## Class Hierarchy

```
                    ┌─────────────┐
                    │  BaseAgent  │
                    │  (Abstract) │
                    └────────┬────┘
                             │
                   ┌─────────┼─────────┬────────────┬────────────┐
                   │         │         │            │            │
                   ▼         ▼         ▼            ▼            ▼
            ┌─────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
            │FileAnaly│ │Batch   │ │Aggreg. │ │Security  │ │Coordinator   │
            │sis      │ │Process │ │        │ │Analysis  │ │              │
            │Agent    │ │Agent   │ │Agent   │ │Agent     │ │Agent         │
            └─────────┘ └────────┘ └────────┘ └──────────┘ └──────────────┘
               │           │          │           │             │
               │           │          │           │             │
            Methods:    Methods:   Methods:   Methods:      Methods:
            • execute  • execute  • execute  • execute      • execute
            • extract  • create   • aggregate• perform      • register
            • format   • process  • calculate• calculate    • generateReport
            • delay    • delay    • delay    • delay        • calculateTime
            
            ┌─────────────────────────────────────────────────────────┐
            │  ALL inherit from BaseAgent                             │
            │  ├─ run(input)      - Execute with timing & errors     │
            │  ├─ subscribe()     - Register observers               │
            │  ├─ notify()        - Broadcast results                │
            │  └─ getStatus()     - Return current status            │
            └─────────────────────────────────────────────────────────┘
```

## Result Object Structure

```
┌─ FINAL REPORT (Root)
│
├─ auditId: "AUDIT-1703...-ABC123"
│
├─ timestamp: "12/17/2025, 2:30:45 PM"
│
├─ status: "completed"
│
├─ totalExecutionTime: 1245 (ms)
│
├─ summary: {
│    ├─ totalFiles: 15
│    ├─ totalSize: "45.32 MB"
│    ├─ fileTypes: [
│    │   { type: "PDF Document", count: 5, percentage: 33 },
│    │   { type: "Word Document", count: 4, percentage: 27 },
│    │   { type: "Image (PNG)", count: 6, percentage: 40 }
│    │ ]
│    └─ riskLevel: "low"
│
├─ agentReports: {
│    ├─ fileAnalysis: {
│    │    ├─ name: "File Analysis"
│    │    ├─ status: "completed"
│    │    ├─ executionTime: 312
│    │    └─ filesAnalyzed: 15
│    │ }
│    ├─ batchProcessing: {
│    │    ├─ name: "Batch Processing"
│    │    ├─ status: "completed"
│    │    ├─ executionTime: 215
│    │    └─ totalBatches: 3
│    │ }
│    ├─ aggregation: {
│    │    ├─ name: "Aggregation"
│    │    ├─ status: "completed"
│    │    ├─ executionTime: 248
│    │    └─ statistics: { ... }
│    │ }
│    └─ security: {
│         ├─ name: "Security Analysis"
│         ├─ status: "completed"
│         ├─ executionTime: 398
│         ├─ findingsCount: 8
│         └─ threatDetected: false
│    }
│
├─ findings: [
│    ├─ { type: "success", severity: "low", file: "System", message: "..." }
│    ├─ { type: "success", severity: "low", file: "System", message: "..." }
│    ├─ { type: "info", severity: "low", file: "large.pdf", message: "..." }
│    └─ ...
│ ]
│
└─ detailedResults: {
     ├─ files: [ ... ]
     ├─ aggregationData: { ... }
     └─ securityAnalysis: { ... }
   }
```

## Extension Points

```
                    ┌──────────────────┐
                    │ BaseAgent        │
                    │ (Extend here)    │
                    └──────────────────┘
                           ▲
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        │                  │                  │
    ┌───┴──┐          ┌────┴────┐       ┌─────┴──┐
    │      │          │         │       │        │
    │CUSTOM│    EXTEND EXISTING │       │PLUGIN  │
    │AGENT │    ├─ File Types   │       │AGENT   │
    │      │    ├─ Security     │       │        │
    └──────┘    ├─ Statistics   │       └────────┘
                └─ Batch Ops    │
                                │
                    ┌───────────┴──────────┐
                    │ Extend Methods:      │
                    │ • execute()          │
                    │ • Helper functions   │
                    │ • Output format      │
                    └──────────────────────┘
```

---

These diagrams illustrate the complete architecture of the multi-agent system and how all components interact.
