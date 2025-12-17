// ===== Multi-Agent System Initialization =====
let agentSystem = null;

function initializeAgentSystem() {
    const coordinator = new CoordinatorAgent();
    
    // Register all agents
    coordinator.registerAgent(new FileAnalysisAgent());
    coordinator.registerAgent(new BatchProcessingAgent(5));
    coordinator.registerAgent(new AggregationAgent());
    coordinator.registerAgent(new SecurityAnalysisAgent());
    
    return coordinator;
}

// ===== File Management =====
let uploadedFiles = [];

const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const auditButton = document.getElementById('auditButton');
const resultSection = document.getElementById('resultSection');
const auditResults = document.getElementById('auditResults');

// Handle file selection
fileInput.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        if (!uploadedFiles.find(f => f.name === file.name && f.size === file.size)) {
            uploadedFiles.push(file);
        }
    });
    
    updateFileList();
    updateAuditButton();
    event.target.value = '';
});

// Update the file list display
function updateFileList() {
    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '';
        return;
    }
    
    fileList.innerHTML = uploadedFiles.map((file, index) => `
        <div class="file-item">
            <span class="file-name">📄 ${file.name}</span>
            <span class="file-size">${formatFileSize(file.size)}</span>
            <button class="remove-file" onclick="removeFile(${index})">Remove</button>
        </div>
    `).join('');
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Remove a file
function removeFile(index) {
    uploadedFiles.splice(index, 1);
    updateFileList();
    updateAuditButton();
    resultSection.style.display = 'none';
}

// Enable/disable audit button
function updateAuditButton() {
    auditButton.disabled = uploadedFiles.length === 0;
}

// ===== Audit Execution with Multi-Agent System =====
auditButton.addEventListener('click', async () => {
    if (uploadedFiles.length === 0) return;
    
    auditButton.disabled = true;
    auditButton.classList.add('loading');
    
    try {
        await performAuditWithAgents();
    } catch (error) {
        console.error('Audit failed:', error);
        displayError(error.message);
    } finally {
        auditButton.classList.remove('loading');
        auditButton.disabled = false;
    }
});

async function performAuditWithAgents() {
    // Initialize agent system
    agentSystem = initializeAgentSystem();
    
    // Run the coordinator agent with uploaded files
    const finalReport = await agentSystem.run(uploadedFiles);
    
    // Display results
    displayResults(finalReport);
}

// ===== Results Display =====
function displayResults(report) {
    const {
        auditId,
        timestamp,
        status,
        totalExecutionTime,
        summary,
        agentReports,
        findings
    } = report;

    const findingsHTML = findings.map(finding => `
        <p class="${finding.type}">
            <strong>${finding.file}:</strong> ${finding.message}
        </p>
    `).join('');

    const agentExecutionHTML = Object.entries(agentReports)
        .map(([key, agent]) => `
            <div style="margin-bottom: 15px; padding: 10px; background: #f0f0f0; border-radius: 6px;">
                <p><strong>${agent.name}</strong></p>
                <p style="font-size: 0.9rem; color: #666;">
                    Status: <span style="color: #38ef7d;">${agent.status}</span> | 
                    Time: ${agent.executionTime}ms
                </p>
            </div>
        `).join('');

    const resultsHTML = `
        <div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <p><strong>Audit ID:</strong> ${auditId}</p>
                    <p><strong>Timestamp:</strong> ${timestamp}</p>
                    <p><strong>Total Execution Time:</strong> ${totalExecutionTime}ms</p>
                </div>
                <div>
                    <p><strong>Total Files:</strong> ${summary.totalFiles}</p>
                    <p><strong>Total Size:</strong> ${summary.totalSize}</p>
                    <p><strong>Risk Level:</strong> <span style="color: ${getRiskColor(summary.riskLevel)}; font-weight: bold;">${summary.riskLevel.toUpperCase()}</span></p>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px;">File Types:</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                    ${summary.fileTypes.map(ft => `
                        <span style="background: #e8f4f8; padding: 6px 12px; border-radius: 4px; font-size: 0.9rem;">
                            ${ft.type} (${ft.count})
                        </span>
                    `).join('')}
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px;">Agent Execution Report:</h4>
                ${agentExecutionHTML}
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px;">Security Findings:</h4>
                ${findingsHTML}
            </div>
        </div>
    `;

    auditResults.innerHTML = resultsHTML;
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getRiskColor(riskLevel) {
    const colors = {
        'critical': '#ff4757',
        'high': '#ffa502',
        'medium': '#ffc107',
        'low': '#38ef7d'
    };
    return colors[riskLevel.toLowerCase()] || '#999';
}

function displayError(message) {
    const errorHTML = `
        <div style="background: #fff5f5; border: 2px solid #ff4757; padding: 15px; border-radius: 8px;">
            <p class="error"><strong>Error:</strong> ${message}</p>
        </div>
    `;
    
    auditResults.innerHTML = errorHTML;
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize on page load
updateAuditButton();
