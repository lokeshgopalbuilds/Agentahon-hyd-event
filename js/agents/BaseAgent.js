/**
 * BaseAgent - Abstract base class for all agents
 * Provides common functionality for agent communication and execution
 */
class BaseAgent {
    constructor(name, role) {
        this.name = name;
        this.role = role;
        this.status = 'idle'; // idle, running, completed, failed
        this.result = null;
        this.error = null;
        this.executionTime = 0;
        this.observers = []; // For reporting results
    }

    /**
     * Register observer to receive results from this agent
     */
    subscribe(callback) {
        this.observers.push(callback);
    }

    /**
     * Notify all observers of result
     */
    notify(result) {
        this.observers.forEach(callback => callback(result));
    }

    /**
     * Main execution method - to be overridden by subclasses
     */
    async execute(input) {
        throw new Error('execute() must be implemented by subclass');
    }

    /**
     * Run the agent with error handling and timing
     */
    async run(input) {
        try {
            this.status = 'running';
            const startTime = performance.now();
            
            this.result = await this.execute(input);
            
            const endTime = performance.now();
            this.executionTime = Math.round(endTime - startTime);
            this.status = 'completed';
            
            this.notify({
                agent: this.name,
                role: this.role,
                status: this.status,
                result: this.result,
                executionTime: this.executionTime,
                timestamp: new Date().toISOString()
            });
            
            return this.result;
        } catch (err) {
            this.status = 'failed';
            this.error = err.message;
            
            this.notify({
                agent: this.name,
                role: this.role,
                status: this.status,
                error: this.error,
                executionTime: this.executionTime,
                timestamp: new Date().toISOString()
            });
            
            throw err;
        }
    }

    /**
     * Get agent status and results
     */
    getStatus() {
        return {
            name: this.name,
            role: this.role,
            status: this.status,
            executionTime: this.executionTime,
            hasResult: this.result !== null,
            hasError: this.error !== null
        };
    }
}
