// Store uploaded files
let uploadedFiles = [];

// Get DOM elements
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const auditButton = document.getElementById('auditButton');
const resultSection = document.getElementById('resultSection');
const auditResults = document.getElementById('auditResults');

// Handle file selection
fileInput.addEventListener('change', (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        // Check if file is already uploaded
        if (!uploadedFiles.find(f => f.name === file.name && f.size === file.size)) {
            uploadedFiles.push(file);
        }
    });
    
    updateFileList();
    updateAuditButton();
    
    // Reset input to allow re-uploading the same file
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

// Format file size to human-readable format
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Remove a file from the list
function removeFile(index) {
    uploadedFiles.splice(index, 1);
    updateFileList();
    updateAuditButton();
    resultSection.style.display = 'none';
}

// Enable/disable audit button based on files
function updateAuditButton() {
    auditButton.disabled = uploadedFiles.length === 0;
}

// Handle audit button click
auditButton.addEventListener('click', async () => {
    if (uploadedFiles.length === 0) return;
    
    // Disable button and show loading state
    auditButton.disabled = true;
    auditButton.classList.add('loading');
    
    // Simulate audit process
    await performAudit();
    
    // Re-enable button and remove loading state
    auditButton.classList.remove('loading');
    auditButton.disabled = false;
});

// Simulate audit process
async function performAudit() {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock audit results
    const results = generateAuditResults();
    
    // Display results
    displayResults(results);
}

// Generate mock audit results
function generateAuditResults() {
    const totalFiles = uploadedFiles.length;
    const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
    
    return {
        totalFiles,
        totalSize,
        fileTypes: getFileTypes(),
        status: 'completed',
        timestamp: new Date().toLocaleString(),
        findings: [
            { type: 'success', message: 'All files successfully scanned' },
            { type: 'success', message: 'No security threats detected' },
            { type: 'success', message: 'File integrity verified' }
        ]
    };
}

// Get unique file types
function getFileTypes() {
    const types = uploadedFiles.map(file => {
        const ext = file.name.split('.').pop().toUpperCase();
        return ext || 'Unknown';
    });
    
    return [...new Set(types)];
}

// Display audit results
function displayResults(results) {
    const { totalFiles, totalSize, fileTypes, timestamp, findings } = results;
    
    const resultsHTML = `
        <div>
            <p><strong>Audit Completed:</strong> ${timestamp}</p>
            <p><strong>Files Audited:</strong> ${totalFiles}</p>
            <p><strong>Total Size:</strong> ${formatFileSize(totalSize)}</p>
            <p><strong>File Types:</strong> ${fileTypes.join(', ')}</p>
            <br>
            <strong>Findings:</strong>
            ${findings.map(finding => `
                <p class="${finding.type}">• ${finding.message}</p>
            `).join('')}
        </div>
    `;
    
    auditResults.innerHTML = resultsHTML;
    resultSection.style.display = 'block';
    
    // Smooth scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize
updateAuditButton();
