/**
 * FileAnalysisAgent - Analyzes individual files
 * Responsibilities: File type detection, size calculation, metadata extraction
 */
class FileAnalysisAgent extends BaseAgent {
    constructor() {
        super('FileAnalysisAgent', 'File Processor');
        this.fileMetadata = [];
    }

    async execute(files) {
        // Validate input
        if (!Array.isArray(files) || files.length === 0) {
            throw new Error('FileAnalysisAgent requires a non-empty array of files');
        }

        // Process each file
        this.fileMetadata = files.map((file, index) => {
            return {
                id: index,
                name: file.name,
                size: file.size,
                type: this.extractFileType(file.name),
                extension: this.getFileExtension(file.name),
                created: file.lastModified,
                sizeFormatted: this.formatFileSize(file.size)
            };
        });

        // Simulate processing delay (represents actual file reading)
        await this.delay(300);

        return {
            filesAnalyzed: this.fileMetadata.length,
            files: this.fileMetadata,
            analysisTime: this.executionTime
        };
    }

    /**
     * Extract file type from extension
     */
    extractFileType(filename) {
        const ext = this.getFileExtension(filename).toLowerCase();
        
        const typeMap = {
            'pdf': 'PDF Document',
            'doc': 'Word Document',
            'docx': 'Word Document',
            'xls': 'Excel Spreadsheet',
            'xlsx': 'Excel Spreadsheet',
            'txt': 'Text File',
            'csv': 'CSV Data',
            'jpg': 'Image (JPEG)',
            'jpeg': 'Image (JPEG)',
            'png': 'Image (PNG)',
            'gif': 'Image (GIF)',
            'zip': 'Archive',
            'rar': 'Archive',
            '7z': 'Archive'
        };

        return typeMap[ext] || `${ext.toUpperCase()} File`;
    }

    /**
     * Get file extension
     */
    getFileExtension(filename) {
        return filename.split('.').pop() || 'Unknown';
    }

    /**
     * Format file size to human-readable format
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
