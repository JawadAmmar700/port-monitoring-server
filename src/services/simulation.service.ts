import { Server, Socket } from 'socket.io';

interface EnvironmentalRecord {
    timestamp: Date;
    temperature: number;
    humidity: number;
    airQuality: number;
    noiseLevel: number;
    lightIntensity: number;
    windSpeed: number;
    rainfall: number;
    pressure: number;
    location: {
        latitude: number;
        longitude: number;
    };
}

interface SimulationState {
    isRunning: boolean;
    currentStep: number;
    totalSteps: number;
    progress: number;
    records: EnvironmentalRecord[];
}

export class SimulationService {
    private simulationState: SimulationState;
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        this.simulationState = {
            isRunning: false,
            currentStep: 0,
            totalSteps: 0,
            progress: 0,
            records: []
        };

        this.setupSocketHandlers();
    }

    private setupSocketHandlers() {
        this.io.on('connection', (socket: Socket) => {
            console.log('Client connected to simulation service');

            // Handle simulation start
            socket.on('startSimulation', (data: { totalSteps: number }) => {
                this.startSimulation(socket, data);
            });

            // Handle simulation stop
            socket.on('stopSimulation', () => {
                this.stopSimulation(socket);
            });

            // Handle simulation pause
            socket.on('pauseSimulation', () => {
                this.pauseSimulation(socket);
            });

            // Handle simulation resume
            socket.on('resumeSimulation', () => {
                this.resumeSimulation(socket);
            });

            // Handle client disconnect
            socket.on('disconnect', () => {
                console.log('Client disconnected from simulation service');
            });
        });
    }

    private startSimulation(socket: Socket, data: { totalSteps: number }) {
        if (this.simulationState.isRunning) {
            socket.emit('error', 'Simulation is already running');
            return;
        }

        this.simulationState = {
            isRunning: true,
            currentStep: 0,
            totalSteps: data.totalSteps || 100,
            progress: 0,
            records: []
        };

        // Start the simulation loop
        this.runSimulation(socket);
    }

    private stopSimulation(socket: Socket) {
        this.simulationState.isRunning = false;
        socket.emit('simulationStopped', {
            message: 'Simulation stopped',
            finalState: this.simulationState
        });
    }

    private pauseSimulation(socket: Socket) {
        this.simulationState.isRunning = false;
        socket.emit('simulationPaused', {
            message: 'Simulation paused',
            currentState: this.simulationState
        });
    }

    private resumeSimulation(socket: Socket) {
        if (!this.simulationState.isRunning) {
            this.simulationState.isRunning = true;
            this.runSimulation(socket);
        }
    }

    private generateEnvironmentalRecord(): EnvironmentalRecord {
        return {
            timestamp: new Date(),
            temperature: this.generateRandomValue(15, 35), // Celsius
            humidity: this.generateRandomValue(30, 90), // Percentage
            airQuality: this.generateRandomValue(0, 500), // AQI
            noiseLevel: this.generateRandomValue(30, 90), // dB
            lightIntensity: this.generateRandomValue(0, 1000), // Lux
            windSpeed: this.generateRandomValue(0, 30), // km/h
            rainfall: this.generateRandomValue(0, 50), // mm
            pressure: this.generateRandomValue(980, 1020), // hPa
            location: {
                latitude: this.generateRandomValue(-90, 90),
                longitude: this.generateRandomValue(-180, 180)
            }
        };
    }

    private generateRandomValue(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    private async runSimulation(socket: Socket) {
        while (this.simulationState.isRunning && 
               this.simulationState.currentStep < this.simulationState.totalSteps) {
            
            // Generate new environmental record
            const newRecord = this.generateEnvironmentalRecord();
            this.simulationState.records.push(newRecord);
            
            // Update simulation state
            this.simulationState.currentStep++;
            this.simulationState.progress = 
                (this.simulationState.currentStep / this.simulationState.totalSteps) * 100;

            // Emit progress update with the new record
            socket.emit('simulationProgress', {
                currentStep: this.simulationState.currentStep,
                totalSteps: this.simulationState.totalSteps,
                progress: this.simulationState.progress,
                latestRecord: newRecord
            });

            // If simulation is complete
            if (this.simulationState.currentStep >= this.simulationState.totalSteps) {
                this.simulationState.isRunning = false;
                socket.emit('simulationComplete', {
                    message: 'Simulation completed successfully',
                    totalRecords: this.simulationState.records.length,
                    records: this.simulationState.records
                });
            }

            // Wait for 5 seconds before generating next record (slowed down from 1 second)
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
} 