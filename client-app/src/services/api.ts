// src/services/api.ts

// API Configuration
const API_BASE_URL = 'https://localhost:7001/api';

// Helper function to make API calls
async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    console.log(`🔵 API Call: ${options.method || 'GET'} ${url}`);

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error ${response.status}:`, errorText);
            throw new Error(errorText || `API Error: ${response.status}`);
        }

        // Handle cases where API returns 204 No Content or empty body
        const text = await response.text();
        return text ? (JSON.parse(text) as T) : ({} as T);

    } catch (error) {
        console.error("❌ API Call Failed:", error);
        throw error;
    }
}

// --- INTERFACES ---

export interface LoginRequest {
    username: string;
    password: string;
    role: 'archer' | 'recorder';
}

export interface LoginResponse {
    success: boolean;
    userId: string;
    token: string;
    role: string;
    username: string;
}

export interface Score {
    scoreId: number;
    archerId: number;
    roundId: number;
    compId?: number;
    dateShot: string;
    totalScore: number;
}

export interface Equipment {
    equipmentId: number;
    divisionType: string;
}

export interface Archer {
    archerId: number;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    email: string;
}

export interface Round {
    roundId: number;
    roundName: string;
    description?: string;
}

export interface StagingScore {
    stagingId: number;
    archerId: number;
    roundId: number;
    equipmentId: number;
    dateTime: string;
    rawScore: number;
    status: 'pending' | 'approved' | 'rejected';
    archer?: Archer;
    round?: Round;
    equipment?: Equipment;
}

export interface Competition {
    compId: number;
    compName: string;
}

// DTO cho response khi approve/reject
export interface ProcessScoreResponse {
    message: string;
    scoreId?: number;
    stagingScoreId: number;
    reason?: string;
}

// Interface cho function createArcher
export interface CreateArcherRequest {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    dateOfBirth: string;
    phone?: string;
    defaultEquipmentId?: number;
}

// --- API OBJECTS ---

export const authAPI = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    userId: "1",
                    token: "dummy-jwt-token",
                    role: credentials.role,
                    username: credentials.username
                });
            }, 500);
        });
    },

    logout: async (): Promise<void> => {
        return Promise.resolve();
    },
};

export const commonAPI = {
    getRounds: async (): Promise<Round[]> => {
        return apiCall<Round[]>('/Round');
    },

    getCompetitions: async (): Promise<Competition[]> => {
        return apiCall<Competition[]>('/Competition');
    }
};

export const archerAPI = {
    getScores: async (archerId: string, token: string): Promise<Score[]> => {
        return apiCall<Score[]>(`/Archer/${archerId}/scores`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};

export const stagingScoreAPI = {
    getPendingScores: async (token: string): Promise<StagingScore[]> => {
        return apiCall<StagingScore[]>('/StagingScore/pending', {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    getAllStagingScores: async (token: string): Promise<StagingScore[]> => {
        return apiCall<StagingScore[]>('/StagingScore', {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    getStagingScore: async (stagingId: number, token: string): Promise<StagingScore> => {
        return apiCall<StagingScore>(`/StagingScore/${stagingId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    submitScore: async (
        archerId: number,
        roundId: number,
        equipmentId: number,
        rawScore: number,
        token: string
    ): Promise<StagingScore> => {
        const backendPayload = {
            ArcherId: archerId,
            RoundId: roundId,
            EquipmentId: equipmentId,
            RawScore: rawScore,
            DateTime: new Date().toISOString(),
            Status: 'pending'
        };

        return apiCall<StagingScore>('/StagingScore', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(backendPayload),
        });
    },

    approveScore: async (
        stagingId: number,
        competitionId?: number,
        token?: string
    ): Promise<ProcessScoreResponse> => {
        const queryParams = competitionId ? `?competitionId=${competitionId}` : '';
        return apiCall<ProcessScoreResponse>(`/StagingScore/${stagingId}/approve${queryParams}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    rejectScore: async (
        stagingId: number,
        reason: string,
        token?: string
    ): Promise<ProcessScoreResponse> => {
        return apiCall<ProcessScoreResponse>(`/StagingScore/${stagingId}/reject`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(reason),
        });
    },

    deleteStagingScore: async (stagingId: number, token: string): Promise<void> => {
        return apiCall<void>(`/StagingScore/${stagingId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};

export const recorderAPI = {
    getArchers: async (token: string): Promise<Archer[]> => {
        return apiCall<Archer[]>('/Archer', {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    createArcher: async (
        archerData: CreateArcherRequest,
        token: string
    ): Promise<Archer> => {
        const backendPayload = {
            FirstName: archerData.firstName,
            LastName: archerData.lastName,
            Email: archerData.email,
            Gender: archerData.gender,
            DateOfBirth: archerData.dateOfBirth,
            Phone: archerData.phone || null,
            DefaultEquipmentId: archerData.defaultEquipmentId || 1
        };

        return apiCall<Archer>('/Archer', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(backendPayload),
        });
    },

    updateArcher: async (
        archerId: number,
        archerData: Partial<Archer>,
        token: string
    ): Promise<Archer> => {
        return apiCall<Archer>(`/Archer/${archerId}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(archerData),
        });
    },

    deleteArcher: async (archerId: number, token: string): Promise<void> => {
        return apiCall<void>(`/Archer/${archerId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};