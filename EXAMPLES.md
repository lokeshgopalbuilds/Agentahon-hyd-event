# Example Use Cases & Scenarios

## 1. Basic File Audit

### Scenario
A user wants to audit a collection of downloaded files to check their types and sizes.

### Steps
```
1. Open Audit Agent application
2. Click "Upload Files"
3. Select files: document.pdf, photo.png, spreadsheet.xlsx
4. Click "Start Audit"
5. Review results
```

### Results Shown
```
Audit ID: AUDIT-1703176234567-ABC123
Files Analyzed: 3
Total Size: 5.2 MB

File Types:
├─ PDF Document (1)
├─ Image (PNG) (1)
└─ Excel Spreadsheet (1)

Agent Execution:
├─ File Analysis: 312ms
├─ Batch Processing: 215ms
├─ Aggregation: 248ms
└─ Security Analysis: 398ms

Total Time: 1173ms
Risk Level: LOW
```

---

## 2. Large File Collection Analysis

### Scenario
A company needs to audit a large collection of mixed files to understand their distribution and identify any suspicious files.

### Setup
```
Files to audit: 47 files
├─ PDFs: 12
├─ Word Docs: 15
├─ Spreadsheets: 10
├─ Images: 8
└─ Archives: 2

Total Size: ~250 MB
```

### Agent Processing
```
FileAnalysisAgent:
├─ Analyzes all 47 files
├─ Extracts metadata
├─ Detects types
└─ Time: 312ms

BatchProcessingAgent:
├─ Creates batches of 5
├─ 10 batches total
├─ Validates all
└─ Time: 215ms

AggregationAgent:
├─ Calculates totals
├─ 250.3 MB total size
├─ Average: 5.3 MB
├─ Largest: 45 MB (archive)
├─ Smallest: 0.5 MB (txt)
└─ Time: 248ms

SecurityAnalysisAgent:
├─ Checks all file types
├─ Finds 2 large files > 40MB (info)
├─ All types safe
├─ No threats detected
└─ Time: 398ms
```

### Results
```
Statistics:
├─ Total Files: 47
├─ Total Size: 250.3 MB
├─ Average File: 5.3 MB
├─ Risk Level: LOW

Distribution:
├─ Small (<1MB): 15 files
├─ Medium (1-10MB): 28 files
└─ Large (>10MB): 4 files

File Types:
├─ PDF Document: 12 (25%)
├─ Word Document: 15 (32%)
├─ Excel Spreadsheet: 10 (21%)
├─ Image (PNG): 8 (17%)
└─ Archive: 2 (4%)

Security Findings:
✓ All files successfully scanned
ℹ Large files detected (2 files > 100MB threshold) - informational
✓ No malware signatures detected
✓ File integrity verified
```

---

## 3. Detecting Suspicious Files

### Scenario
A user downloads files from an untrusted source and wants to check for suspicious executable files.

### Files
```
Downloaded files:
├─ document.pdf
├─ image.jpg
├─ installer.exe ⚠️
├─ script.bat ⚠️
├─ video.mp4
└─ readme.txt
```

### Agent Analysis

**FileAnalysisAgent** extracts metadata:
```
file: "installer.exe"
├─ name: "installer.exe"
├─ size: 2.3 MB
├─ type: "Executable"
├─ extension: "exe"
└─ sizeFormatted: "2.3 MB"
```

**SecurityAnalysisAgent** detects:
```
Checking file types for threats...
✓ document.pdf - Safe
✓ image.jpg - Safe
⚠ installer.exe - SUSPICIOUS (Potentially executable file)
⚠ script.bat - SUSPICIOUS (Potentially executable file)
✓ video.mp4 - Safe
✓ readme.txt - Safe
```

### Results Display
```
Risk Level: MEDIUM ⚠️

Security Findings:
⚠ installer.exe: Potentially executable file detected: exe
⚠ script.bat: Potentially executable file detected: bat
✓ All files successfully scanned
✓ No malware signatures detected
✓ File integrity verified

Recommendation:
Be cautious with executable files (exe, bat). 
Verify source before executing.
```

---

## 4. Organizing Large Photo Collection

### Scenario
A photographer wants to organize 150+ photos and identify which are the largest files.

### Initial State
```
Photos folder contains:
├─ IMG_001.jpg
├─ IMG_002.jpg
├─ vacation_2024.jpg (250 MB!)
├─ ... (147 more files)
└─ thumbnail.jpg
```

### Agent Processing

**AggregationAgent** calculates:
```
Total Photos: 150
Total Size: 18.5 GB
Average Size: 125 MB
Largest File: vacation_2024.jpg (250 MB)
Smallest File: thumbnail.jpg (0.8 MB)

Size Distribution:
├─ Small (<10MB): 25 files
├─ Medium (10-50MB): 85 files
└─ Large (>50MB): 40 files
```

### Results & Recommendations
```
File Statistics:
├─ Total: 150 files
├─ Total Size: 18.5 GB
├─ Average: 125 MB
├─ Median: 85 MB

Storage Breakdown:
├─ Small images: 5% of space
├─ Medium images: 45% of space
└─ Large images: 50% of space

Top 5 Largest Files:
1. vacation_2024.jpg - 250 MB
2. family_reunion.jpg - 198 MB
3. wedding_2023.jpg - 189 MB
4. graduation.jpg - 156 MB
5. holiday_party.jpg - 145 MB

Recommendations:
- Archive large files (>150MB) separately
- Compress medium files for backup
- Keep small thumbnails with originals
```

---

## 5. Compliance & Audit Trail

### Scenario
A document management system needs to audit files submitted for compliance checking.

### Files Submitted
```
Legal Documents:
├─ contract_2024.pdf (512 KB)
├─ nda_template.docx (245 KB)
├─ policy_handbook.pdf (1.2 MB)
├─ employee_records.xlsx (856 KB)
└─ financial_statement.pdf (2.1 MB)

Total: 5 files, 5.0 MB
```

### Audit Process

```
FileAnalysisAgent:
├─ Analyzes 5 legal documents
├─ Confirms all are expected types (PDF, DOCX, XLSX)
├─ Verifies file sizes are reasonable
└─ Result: ✓ All files valid

BatchProcessingAgent:
├─ Groups into 1 batch (5 < batch size of 5)
├─ Validates batch integrity
├─ All files passed validation
└─ Result: ✓ Batch validated

AggregationAgent:
├─ Total: 5 documents
├─ Total Size: 5.0 MB
├─ Average Document: 1.0 MB
├─ File type breakdown calculated
└─ Result: ✓ Statistics compiled

SecurityAnalysisAgent:
├─ No executable files found
├─ No oversized files found
├─ All documents are standard office formats
├─ No threats detected
└─ Result: ✓ Security cleared
```

### Audit Report
```
AUDIT REPORT
═══════════════════════════════════════════

Audit ID: AUDIT-1703176234567-LEGAL001
Date: 12/17/2025, 2:30:45 PM
Status: PASSED ✓

Summary:
├─ Documents Audited: 5
├─ Total Size: 5.0 MB
├─ Compliance Status: APPROVED
└─ Risk Level: LOW

Document Types:
├─ PDF Document: 3
├─ Word Document: 1
└─ Excel Spreadsheet: 1

Execution Time:
├─ File Analysis: 312ms
├─ Batch Processing: 215ms
├─ Aggregation: 248ms
└─ Security Analysis: 398ms
Total Time: 1173ms

Security Verification:
✓ All files scanned successfully
✓ No malware signatures detected
✓ File integrity verified
✓ No suspicious file types

Compliance Notes:
- All files are standard office documents
- File sizes are within acceptable ranges
- No executable or potentially dangerous files
- Ready for processing

Auditor: Audit Agent v1.0
Signature: AUTO-VERIFIED
```

---

## 6. Backup Storage Analysis

### Scenario
System administrator wants to analyze backup storage to optimize space usage.

### Backup Contents
```
Backup directory:
├─ Database backups/
│  ├─ db_backup_2024_01.sql.gz (450 MB)
│  ├─ db_backup_2024_02.sql.gz (475 MB)
│  ├─ db_backup_2024_03.sql.gz (512 MB)
│  ├─ ... (9 more files)
│  └─ [12 files total]
│
├─ Log files/
│  ├─ app.log (156 MB)
│  ├─ system.log (203 MB)
│  ├─ debug.log (89 MB)
│  └─ [3 files total]
│
└─ Archive/
   ├─ old_projects.zip (1.2 GB)
   ├─ media_archive.zip (890 MB)
   └─ [2 files total]

Total: 17 files, ~6.5 GB
```

### Agent Analysis

**AggregationAgent Output:**
```
Storage Analysis:
├─ Total Files: 17
├─ Total Size: 6.5 GB
├─ Average File: 382 MB
├─ Largest: old_projects.zip (1.2 GB)
├─ Smallest: debug.log (89 MB)

File Distribution:
├─ Compressed files (.gz): 12 files (5.8 GB - 89%)
├─ Log files (.log): 3 files (448 MB - 7%)
└─ Archives (.zip): 2 files (2.09 GB - 32%)

Size Categories:
├─ Large (>500MB): 5 files (4.2 GB)
├─ Medium (100-500MB): 9 files (1.8 GB)
└─ Small (<100MB): 3 files (0.5 GB)
```

### Results & Recommendations
```
Storage Optimization Report:

Current Usage: 6.5 GB

Top 3 Space Consumers:
1. old_projects.zip - 1.2 GB (18%)
2. media_archive.zip - 890 MB (13%)
3. db_backup_2024_12.sql.gz - 512 MB (8%)

Recommendations:
✓ Database backups are well compressed (using .gz)
→ Consider older logs (debug.log - 89 MB) for archiving
→ Verify if old_projects.zip still needed
→ Set up automated backup rotation

Potential Savings:
- Delete old logs: ~100 MB
- Archive unused projects: ~1.2 GB
- Compress remaining logs: ~50 MB
Total Potential: 1.35 GB saved (21% reduction)

Risk Assessment: LOW
All files are backup/archive types - no threats detected
```

---

## 7. Educational Institution File Management

### Scenario
School needs to organize and audit student submission files.

### Submissions Received
```
Student Submissions:
├─ Batch 1: 25 assignments (PDF, DOCX)
├─ Batch 2: 30 projects (ZIP archives)
├─ Batch 3: 18 presentations (PPTX)
└─ Batch 4: 12 videos (MP4)

Total: 85 files, ~12 GB
```

### Multi-Level Analysis

**Level 1 - File Analysis:**
```
Analyzing all 85 student files...
✓ Detected file types
✓ Verified file formats
✓ Calculated individual sizes
```

**Level 2 - Batch Processing:**
```
Organizing into batches (5 per batch):
├─ Batch 1: 5 files - Validated ✓
├─ Batch 2: 5 files - Validated ✓
├─ Batch 3: 5 files - Validated ✓
... (14 batches total)
└─ All batches processed and validated
```

**Level 3 - Aggregation:**
```
Statistics Generated:
├─ Total Submissions: 85
├─ Total Size: 12.0 GB
├─ Average Submission: 141 MB
├─ Largest: video.mp4 (850 MB)
├─ Smallest: notes.txt (15 KB)
```

**Level 4 - Security:**
```
Security Verification:
├─ No executable files found
├─ All files are expected types
├─ No suspicious extensions
└─ All files safe for review
Risk Level: LOW ✓
```

### Teacher Dashboard Results
```
STUDENT SUBMISSION AUDIT REPORT
═════════════════════════════════════

Total Submissions: 85
Total Size: 12.0 GB
Status: ALL SUBMITTED ✓

Submission Breakdown:
├─ Assignments (PDF/DOCX): 25 files (1.2 GB)
├─ Projects (ZIP): 30 files (8.5 GB)
├─ Presentations (PPTX): 18 files (1.8 GB)
└─ Videos (MP4): 12 files (0.5 GB)

Quality Metrics:
├─ Average Submission Size: 141 MB
├─ Largest Submission: 850 MB
├─ Smallest Submission: 15 KB
├─ On-Time: 83 (98%)
└─ Late: 2 (2%)

Storage Analysis:
├─ All files properly formatted
├─ No corrupted files detected
├─ Safe for grading and archiving
└─ Ready for download to grading system

Audit Time: 1.2 seconds
Security Status: VERIFIED ✓
```

---

## 8. Media Asset Library Audit

### Scenario
Creative agency wants to audit and organize media assets library.

### Library Contents
```
Assets Library:
├─ Images/
│  ├─ logos/ (50 PNG files)
│  ├─ photos/ (200 JPG files)
│  └─ icons/ (150 SVG files)
│
├─ Videos/
│  ├─ 4K videos/ (25 MP4 files, ~50 GB)
│  └─ HD videos/ (40 MP4 files, ~20 GB)
│
├─ Audio/
│  ├─ music/ (100 MP3 files)
│  └─ effects/ (200 WAV files)
│
└─ Documents/
   └─ briefs/ (50 PDF files)

Total: 815 files, ~75 GB
```

### Audit Results

**Aggregation Report:**
```
Library Statistics:
├─ Total Assets: 815 files
├─ Total Size: 75.0 GB
├─ Average Asset: 92 MB
├─ Largest Category: 4K Videos (50 GB - 67%)

Asset Distribution:
├─ Images: 400 files (8.2 GB - 11%)
├─ Videos: 65 files (70.0 GB - 93%)
├─ Audio: 300 files (2.1 GB - 3%)
└─ Documents: 50 files (0.5 GB - 1%)

Storage Breakdown:
├─ 4K Videos: 50 GB (67%)
├─ HD Videos: 20 GB (27%)
├─ Other: 5 GB (6%)
```

**Security Findings:**
```
✓ No executable files in library
✓ All media files in standard formats
✓ No corrupted files detected
✓ All assets verified and safe
Risk Level: LOW
```

**Recommendations:**
```
✓ Archive old 4K masters separately
✓ Consider cloud storage for video library
✓ Create compressed preview versions
✓ Organize by project/campaign
✓ Implement version control
Potential Savings: 20-30% with optimization
```

---

These examples demonstrate the multi-agent system in various real-world scenarios.
