# 🔍 Audit Agent

A modern web application for uploading and auditing files with a powerful **multi-agent system** architecture. Built with vanilla HTML, CSS, and JavaScript, featuring distributed agent-based calculations at multiple levels.

## ✨ Features

- **Multi-Agent Architecture**: Distributed calculation system with specialized agents
- **File Upload**: Upload single or multiple files of any type
- **File Management**: View uploaded files with size information and remove individual files
- **Multi-Level Processing**: Hierarchical calculation system with:
  - **File Analysis Agent**: Analyzes individual files (metadata, type, size)
  - **Batch Processing Agent**: Groups files into batches and validates them
  - **Aggregation Agent**: Calculates totals, averages, and statistics
  - **Security Analysis Agent**: Performs security checks and threat analysis
- **Results Display**: Comprehensive audit results including:
  - Unique Audit ID for each run
  - Agent execution times and status
  - Detailed file statistics
  - File type distribution
  - Security findings with severity levels
- **Responsive Design**: Modern UI with gradient backgrounds and smooth animations
- **Real-time Feedback**: Visual feedback during audit processing

## 🚀 Getting Started

### Prerequisites

No special prerequisites required! Just a modern web browser (Chrome, Firefox, Safari, Edge).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lokeshgopalbuilds/Agentahon-hyd-event.git
   cd Agentahon-hyd-event
   ```

2. Open the application:
   ```bash
   # Option 1: Direct file opening
   open index.html
   
   # Option 2: Using Python's built-in server
   python3 -m http.server 8000
   # Then open http://localhost:8000 in your browser
   ```
   
   Or simply double-click `index.html` to open it in your default browser.

## 📁 Project Structure

```
Agentahon-hyd-event/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Styling and animations
├── js/
│   ├── script.js           # Application logic and orchestration
│   └── agents/             # Multi-Agent System
│       ├── BaseAgent.js             # Abstract base class for all agents
│       ├── FileAnalysisAgent.js     # File metadata and type analysis
│       ├── BatchProcessingAgent.js  # File batch processing and validation
│       ├── AggregationAgent.js      # Statistics and aggregation
│       ├── SecurityAnalysisAgent.js # Security checks and risk assessment
│       └── CoordinatorAgent.js      # Main orchestrator agent
├── assets/                 # Static assets (images, icons, etc.)
├── data/                   # Data storage
└── README.md               # Project documentation
```

## 🤖 Multi-Agent System Architecture

### Overview

The system uses a **hierarchical agent-based architecture** where each agent specializes in specific calculations:

```
┌─────────────────┐
│  Coordinator    │  <- Orchestrates all agents
└────────┬────────┘
         │
    ┌────┴────────────┬──────────────┬──────────────┐
    │                 │              │              │
┌───▼─────────┐ ┌────▼──────┐ ┌─────▼─────┐ ┌─────▼──────────┐
│   File      │ │ Batch     │ │Aggregation│ │Security        │
│ Analysis    │ │Processing │ │ Agent     │ │Analysis        │
└─────────────┘ └───────────┘ └───────────┘ └────────────────┘
```

### Agent Descriptions

#### 1. **BaseAgent** (Foundation)
- Abstract base class for all agents
- Provides common functionality:
  - `run()` - Execute agent with error handling and timing
  - `subscribe()` - Register observers for results
  - `notify()` - Broadcast results to observers
  - Status tracking (idle, running, completed, failed)
  - Execution time measurement

#### 2. **FileAnalysisAgent** (Level 1)
**Role**: Individual file analysis
**Inputs**: Array of File objects
**Outputs**: File metadata array with:
- File name, size, type, extension
- Formatted size (KB, MB, GB)
- File creation timestamp

**Key Methods**:
- `extractFileType()` - Categorize files by extension
- `formatFileSize()` - Convert bytes to human-readable format

#### 3. **BatchProcessingAgent** (Level 2)
**Role**: Group and validate files in batches
**Inputs**: File metadata from FileAnalysisAgent
**Outputs**: Batch processing results with:
- Total batches created
- Files per batch
- Batch validation status
- Valid/invalid file counts

**Key Methods**:
- `createBatches()` - Divide files into chunks
- `processBatch()` - Validate individual batches

#### 4. **AggregationAgent** (Level 3)
**Role**: Calculate statistics and aggregates
**Inputs**: File metadata from FileAnalysisAgent
**Outputs**: Statistical analysis including:
- Total files and total size
- Average file size
- File type distribution (with counts and percentages)
- Size distribution (small/medium/large)
- Largest and smallest files

**Key Methods**:
- `aggregateFileTypes()` - Group by file type
- `calculateSizeDistribution()` - Categorize by size
- `getLargestFile()` / `getSmallestFile()` - Find extremes

#### 5. **SecurityAnalysisAgent** (Level 4)
**Role**: Security and integrity analysis
**Inputs**: File metadata from FileAnalysisAgent
**Outputs**: Security findings with:
- Risk level assessment (low, medium, high, critical)
- Detailed findings (successes, warnings, errors)
- Threat detection status
- Integrity verification

**Key Methods**:
- `performSecurityChecks()` - Analyze file types for threats
- `calculateRiskLevel()` - Determine overall risk

#### 6. **CoordinatorAgent** (Orchestrator)
**Role**: Central orchestration and report generation
**Responsibilities**:
- Register all specialized agents
- Define execution sequence
- Execute agents in proper order
- Collect and merge results
- Generate comprehensive final report

**Key Methods**:
- `registerAgent()` - Add agents to the system
- `execute()` - Run coordinated agent sequence
- `generateFinalReport()` - Produce final audit report

### Execution Flow

1. **User uploads files** → Files stored in memory
2. **User clicks "Start Audit"** → Coordinator initializes all agents
3. **FileAnalysisAgent runs** → Analyzes each file, generates metadata
4. **BatchProcessingAgent runs** → Groups metadata into batches (in parallel)
5. **AggregationAgent runs** → Calculates statistics
6. **SecurityAnalysisAgent runs** → Performs security checks
7. **Coordinator merges results** → Creates final comprehensive report
8. **UI displays results** → Shows all agent reports and findings

### Data Flow

```
Uploaded Files
    ↓
FileAnalysisAgent
├── Output: File Metadata
    ↓
┌───────────────────────────────┬─────────────────┐
│                               │                 │
BatchProcessingAgent    AggregationAgent    SecurityAnalysisAgent
├── Output: Batches     ├── Output: Stats   ├── Output: Findings
│                       │                   │
└───────────────────────────────┴─────────────────┘
    ↓
CoordinatorAgent
├── Merges all results
├── Generates audit ID
├── Calculates total execution time
└── Creates final report
    ↓
UI Display
├── Agent execution times
├── File statistics
├── Security findings
└── Overall risk assessment
```

## 🔧 How to Use

### Basic Usage

1. **Upload Files**:
   - Click the "Upload Files" button
   - Select one or multiple files
   - Files appear in the list with size information

2. **Remove Files** (optional):
   - Click "Remove" button next to any file
   - File will be removed from the audit queue

3. **Start Audit**:
   - Click "Start Audit" button
   - Progress indicator appears
   - Agents process files at multiple levels

4. **View Results**:
   - Audit ID and timestamp
   - Total execution time across all agents
   - File statistics (count, total size, types)
   - Agent execution breakdown (time and status)
   - Detailed security findings

### Result Information

The results display includes:

- **Audit ID**: Unique identifier for this audit run
- **Timestamp**: When the audit was completed
- **Execution Times**: Individual time for each agent
- **File Statistics**: Count, total size, average size
- **File Types**: Distribution by document/image/archive types
- **Risk Level**: Overall risk assessment
- **Findings**: Detailed security checks and results

## 🎯 Key Features

### Agent Independence
Each agent operates independently with its own responsibilities, making the system:
- **Scalable**: Easy to add new agent types
- **Maintainable**: Changes to one agent don't affect others
- **Testable**: Each agent can be tested in isolation

### Observer Pattern
Agents use the observer pattern for result reporting:
- Agents notify subscribed listeners when complete
- Coordinator collects results from all agents
- UI updates with complete information

### Error Handling
- Agents catch and report errors gracefully
- Failures don't stop the entire audit
- Error information included in final report

### Performance Tracking
- Execution time measured for each agent
- Total execution time calculated
- UI displays timing breakdown

## 💡 Extending the System

### Add a New Agent

1. Create `js/agents/NewAgent.js`:
```javascript
class NewAgent extends BaseAgent {
    constructor() {
        super('NewAgent', 'New Role');
    }

    async execute(input) {
        // Your agent logic here
        return result;
    }
}
```

2. Register in `script.js`:
```javascript
coordinator.registerAgent(new NewAgent());
```

3. Update `index.html`:
```html
<script src="js/agents/NewAgent.js"></script>
```

### Modify Agent Behavior

- Edit agent file in `js/agents/`
- Modify `execute()` method for calculation logic
- Update `performSecurityChecks()` for new security rules
- Changes take effect immediately

## 🐛 Troubleshooting

### Files not uploading?
- Check browser console (F12) for errors
- Ensure files are readable by browser

### Audit not starting?
- Verify all agent files are loaded (check Network tab in DevTools)
- Check browser console for JavaScript errors

### Results not displaying?
- Check that all agent files are linked in `index.html`
- Verify agents are registered in `initializeAgentSystem()`

## 📊 Performance

Typical execution times:
- FileAnalysisAgent: ~300ms (per analysis)
- BatchProcessingAgent: ~200ms (per batch)
- AggregationAgent: ~250ms (calculations)
- SecurityAnalysisAgent: ~400ms (security checks)
- **Total**: Usually 1000-1500ms for typical file sets

## 🔐 Security Notes

- All processing happens client-side (no server uploads)
- Files are analyzed but not stored
- No data collection or tracking
- Browser File API used for file handling

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created with ❤️ for the Agentahon Hyderabad event

## 🎨 Usage

1. **Upload Files**:
   - Click the "Upload Files" button
   - Select one or multiple files from your device
   - Uploaded files will appear in the list with their names and sizes

2. **Manage Files**:
   - Review the list of uploaded files
   - Remove any file by clicking the "Remove" button next to it

3. **Run Audit**:
   - Click the "Start Audit" button (enabled once files are uploaded)
   - Wait for the audit process to complete (indicated by loading animation)
   - View the detailed results including file statistics and findings

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and flexbox
- **JavaScript (ES6+)**: File handling, DOM manipulation, and async operations

## 🎯 Features Breakdown

### File Upload System
- Multiple file selection support
- File size formatting (Bytes, KB, MB, GB)
- Duplicate file prevention
- Dynamic file list rendering

### Audit Engine
- Simulated audit processing
- File type detection
- Security scanning simulation
- Comprehensive results generation

### UI/UX
- Gradient background design
- Smooth hover effects and transitions
- Loading animations
- Responsive card layout
- Color-coded results (success, warning, error)

## 🔧 Customization

### Styling
Edit `css/styles.css` to customize:
- Color schemes and gradients
- Button styles and sizes
- Card dimensions and spacing
- Animation timings

### Functionality
Modify `js/script.js` to:
- Integrate with real audit APIs
- Add custom file validation
- Implement actual security scanning
- Extend audit result types

## 📝 Future Enhancements

- [ ] Backend integration for actual file auditing
- [ ] File type validation and restrictions
- [ ] Progress bar for large file uploads
- [ ] Export audit results as PDF/CSV
- [ ] User authentication and history
- [ ] Drag-and-drop file upload
- [ ] Real-time audit processing
- [ ] Advanced security scanning algorithms

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Lokesh Gopal**
- GitHub: [@lokeshgopalbuilds](https://github.com/lokeshgopalbuilds)

## 🙏 Acknowledgments

- Developed for Agentahon Hyderabad Event
- Inspired by modern web design principles
- Built with ❤️ using vanilla JavaScript

---

**Note**: This is a demo application with simulated audit functionality. For production use, integrate with actual security scanning and file analysis APIs.
