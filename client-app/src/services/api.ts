// src/services/api.ts

const API_BASE_URL = 'https://localhost:7001/api';

// Helper function to make API calls
async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const config: RequestInit = {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `API Error: ${response.status}`);
        }
        const text = await response.text();
        return text ? (JSON.parse(text) as T) : ({} as T);
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
}

// --- INTERFACES ---

export interface StagedRangeInput {
    rangeId: number;
    ends: string[][];
}

export interface LoginRequest { username: string; password: string; role: 'archer' | 'recorder'; }
export interface LoginResponse { success: boolean; userId: string; token: string; role: string; username: string; }
export interface Score { scoreId: number; archerId: number; roundId: number; compId?: number; dateShot: string; totalScore: number; }
export interface Equipment { equipmentId: number; divisionType: string; }
export interface Archer { archerId: number; firstName: string; lastName: string; gender: string; dateOfBirth: string; email: string; }
export interface Round { roundId: number; roundName: string; description?: string; }
export interface StagingScore {
    stagingId: number;
    archerId: number;
    roundId: number;
    equipmentId: number;
    dateTime: string;
    rawScore: number;
    status: 'pending' | 'approved' | 'rejected';
    arrowValues: string;
    archer?: Archer;
    round?: Round;
    equipment?: Equipment;
    archerName?: string;
    roundName?: string;
    equipmentType?: string;
}
export interface Competition { compId: number; compName: string; }
export interface ProcessScoreResponse { message: string; scoreId?: number; stagingScoreId: number; reason?: string; }
export interface CreateArcherRequest { firstName: string; lastName: string; email: string; gender: string; dateOfBirth: string; phone?: string; defaultEquipmentId?: number; }

// --- API OBJECTS ---

export const commonAPI = {
    getRounds: async (): Promise<Round[]> => apiCall<Round[]>('/Round'),
    getCompetitions: async (): Promise<Competition[]> => apiCall<Competition[]>('/Competition')
};

export const stagingScoreAPI = {
    getPendingScores: async (token: string): Promise<StagingScore[]> => {
        return apiCall<StagingScore[]>('/StagingScore/pending', { headers: { Authorization: `Bearer ${token}` } });
    },

    getAllStagingScores: async (token: string): Promise<StagingScore[]> => {
        return apiCall<StagingScore[]>('/StagingScore', { headers: { Authorization: `Bearer ${token}` } });
    },

    getStagingScore: async (stagingId: number, token: string): Promise<StagingScore> => {
        return apiCall<StagingScore>(`/StagingScore/${stagingId}`, { headers: { Authorization: `Bearer ${token}` } });
    },

    // [UPDATED] submitScore nhận StagedRangeInput[]
    submitScore: async (
        archerId: number,
        roundId: number,
        equipmentId: number,
        stagedData: StagedRangeInput[],
        token: string
    ): Promise<StagingScore> => {
        const backendPayload = {
            ArcherId: archerId,
            RoundId: roundId,
            EquipmentId: equipmentId,
            ScoreData: stagedData
        };

        return apiCall<StagingScore>('/StagingScore', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(backendPayload),
        });
    },

    approveScore: async (stagingId: number, competitionId?: number, token?: string): Promise<ProcessScoreResponse> => {
        const queryParams = competitionId ? `?competitionId=${competitionId}` : '';
        return apiCall<ProcessScoreResponse>(`/StagingScore/${stagingId}/approve${queryParams}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    rejectScore: async (stagingId: number, reason: string, token?: string): Promise<ProcessScoreResponse> => {
        return apiCall<ProcessScoreResponse>(`/StagingScore/${stagingId}/reject`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(reason),
        });
    },
};

export const authAPI = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => ({ 
        success: true, 
        userId: "1", 
        token: "dummy", 
        role: credentials.role, 
        username: credentials.username 
    }),
    logout: async (): Promise<void> => {}
};

export const archerAPI = {
    getScores: async (id: string, token: string): Promise<Score[]> => 
        apiCall<Score[]>(`/Archer/${id}/scores`, { headers: { Authorization: `Bearer ${token}` } })
};

export const recorderAPI = {
    getArchers: async (token: string): Promise<Archer[]> => 
        apiCall<Archer[]>('/Archer', { headers: { Authorization: `Bearer ${token}` } }),
    createArcher: async (data: CreateArcherRequest, token: string): Promise<Archer> => 
        apiCall<Archer>('/Archer', { 
            method: 'POST', 
            headers: { Authorization: `Bearer ${token}` }, 
            body: JSON.stringify(data) 
        })
};