/**
 * AggregationAgent - Aggregates data from lower-level agents
 * Responsibilities: Total calculations, statistics, summaries
 */
class AggregationAgent extends BaseAgent {
    constructor() {
        super('AggregationAgent', 'Aggregator');
    }

    async execute(fileMetadata) {
        if (!Array.isArray(fileMetadata) || fileMetadata.length === 0) {
            throw new Error('AggregationAgent requires file metadata');
        }

        await this.delay(250);

        const totalSize = fileMetadata.reduce((sum, file) => sum + file.size, 0);
        const fileTypes = this.aggregateFileTypes(fileMetadata);
        const sizeDistribution = this.calculateSizeDistribution(fileMetadata);

        return {
            totalFiles: fileMetadata.length,
            totalSize: totalSize,
            totalSizeFormatted: this.formatFileSize(totalSize),
            averageFileSize: Math.round(totalSize / fileMetadata.length),
            averageFileSizeFormatted: this.formatFileSize(Math.round(totalSize / fileMetadata.length)),
            fileTypes: fileTypes,
            sizeDistribution: sizeDistribution,
            largestFile: this.getLargestFile(fileMetadata),
            smallestFile: this.getSmallestFile(fileMetadata)
        };
    }

    /**
     * Aggregate file types with counts
     */
    aggregateFileTypes(fileMetadata) {
        const typeMap = {};
        
        fileMetadata.forEach(file => {
            const type = file.type;
            typeMap[type] = (typeMap[type] || 0) + 1;
        });

        return Object.entries(typeMap).map(([type, count]) => ({
            type,
            count,
            percentage: Math.round((count / fileMetadata.length) * 100)
        }));
    }

    /**
     * Calculate size distribution (small, medium, large)
     */
    calculateSizeDistribution(fileMetadata) {
        const sizes = {
            small: 0,      // < 1 MB
            medium: 0,     // 1 MB - 10 MB
            large: 0       // > 10 MB
        };

        fileMetadata.forEach(file => {
            if (file.size < 1048576) sizes.small++;
            else if (file.size < 10485760) sizes.medium++;
            else sizes.large++;
        });

        return sizes;
    }

    /**
     * Get largest file
     */
    getLargestFile(fileMetadata) {
        return fileMetadata.reduce((largest, file) => 
            file.size > largest.size ? file : largest
        );
    }

    /**
     * Get smallest file
     */
    getSmallestFile(fileMetadata) {
        return fileMetadata.reduce((smallest, file) => 
            file.size < smallest.size ? file : smallest
        );
    }

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
