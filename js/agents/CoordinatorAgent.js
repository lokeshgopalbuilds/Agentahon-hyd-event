/**
 * CoordinatorAgent - Orchestrates all other agents
 * Responsibilities: Agent execution sequencing, result aggregation, final report generation
 */
class CoordinatorAgent extends BaseAgent {
    constructor() {
        super('CoordinatorAgent', 'Coordinator');
        this.agents = [];
        this.executionPlan = [];
        this.agentResults = {};
    }

    /**
     * Register agents to be coordinated
     */
    registerAgent(agent) {
        this.agents.push(agent);
        
        // Subscribe to agent results
        agent.subscribe((result) => {
            this.agentResults[agent.name] = result;
        });
    }

    /**
     * Main execution - orchestrates all agents
     */
    async execute(files) {
        if (!Array.isArray(files) || files.length === 0) {
            throw new Error('CoordinatorAgent requires files');
        }

        // Define execution plan - sequential for proper data flow
        this.executionPlan = [
            {
                agent: this.agents.find(a => a.name === 'FileAnalysisAgent'),
                input: files,
                resultKey: 'fileAnalysis'
            },
            {
                agent: this.agents.find(a => a.name === 'BatchProcessingAgent'),
                input: () => this.agentResults.FileAnalysisAgent?.result?.files || [],
                resultKey: 'batchProcessing'
            },
            {
                agent: this.agents.find(a => a.name === 'AggregationAgent'),
                input: () => this.agentResults.FileAnalysisAgent?.result?.files || [],
                resultKey: 'aggregation'
            },
            {
                agent: this.agents.find(a => a.name === 'SecurityAnalysisAgent'),
                input: () => this.agentResults.FileAnalysisAgent?.result?.files || [],
                resultKey: 'security'
            }
        ];

        // Execute agents in sequence
        for (const step of this.executionPlan) {
            if (!step.agent) continue;

            const input = typeof step.input === 'function' ? step.input() : step.input;
            await step.agent.run(input);
        }

        // Generate final report
        return this.generateFinalReport();
    }

    /**
     * Generate comprehensive final report
     */
    generateFinalReport() {
        const fileAnalysis = this.agentResults.FileAnalysisAgent?.result;
        const batchProcessing = this.agentResults.BatchProcessingAgent?.result;
        const aggregation = this.agentResults.AggregationAgent?.result;
        const security = this.agentResults.SecurityAnalysisAgent?.result;

        return {
            auditId: this.generateAuditId(),
            timestamp: new Date().toLocaleString(),
            status: 'completed',
            totalExecutionTime: this.calculateTotalExecutionTime(),
            
            summary: {
                totalFiles: aggregation?.totalFiles || 0,
                totalSize: aggregation?.totalSizeFormatted || '0 Bytes',
                fileTypes: aggregation?.fileTypes || [],
                riskLevel: security?.riskLevel || 'unknown'
            },

            agentReports: {
                fileAnalysis: {
                    name: 'File Analysis',
                    status: this.agentResults.FileAnalysisAgent?.status,
                    executionTime: this.agentResults.FileAnalysisAgent?.executionTime,
                    filesAnalyzed: fileAnalysis?.filesAnalyzed || 0
                },
                batchProcessing: {
                    name: 'Batch Processing',
                    status: this.agentResults.BatchProcessingAgent?.status,
                    executionTime: this.agentResults.BatchProcessingAgent?.executionTime,
                    totalBatches: batchProcessing?.totalBatches || 0
                },
                aggregation: {
                    name: 'Aggregation',
                    status: this.agentResults.AggregationAgent?.status,
                    executionTime: this.agentResults.AggregationAgent?.executionTime,
                    statistics: {
                        averageFileSize: aggregation?.averageFileSizeFormatted,
                        largestFile: aggregation?.largestFile?.name,
                        smallestFile: aggregation?.smallestFile?.name
                    }
                },
                security: {
                    name: 'Security Analysis',
                    status: this.agentResults.SecurityAnalysisAgent?.status,
                    executionTime: this.agentResults.SecurityAnalysisAgent?.executionTime,
                    findingsCount: security?.findingsCount || 0,
                    threatDetected: security?.threatDetected || false
                }
            },

            findings: security?.findings || [],
            
            detailedResults: {
                files: fileAnalysis?.files || [],
                aggregationData: aggregation,
                securityAnalysis: security
            }
        };
    }

    /**
     * Generate unique audit ID
     */
    generateAuditId() {
        return 'AUDIT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    /**
     * Calculate total execution time across all agents
     */
    calculateTotalExecutionTime() {
        return Object.values(this.agentResults).reduce((sum, result) => {
            return sum + (result?.executionTime || 0);
        }, 0);
    }
}
