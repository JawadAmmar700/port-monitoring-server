export interface SimulationState {
    isRunning: boolean;
    currentStep: number;
    totalSteps: number;
    progress: number;
    results: SimulationResults | null;
}

export interface SimulationResults {
    success: boolean;
    message: string;
    data?: any;
}

export interface SimulationProgress {
    currentStep: number;
    totalSteps: number;
    progress: number;
}

export interface SimulationError {
    code: string;
    message: string;
    details?: any;
} 