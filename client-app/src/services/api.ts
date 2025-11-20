// API Configuration for ASP.NET Backend Integration
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
        const result = text ? JSON.parse(text) : {} as T;
        console.log(`✅ API Response:`, result);
        return result;

    } catch (error) {
        console.error("❌ API Call Failed:", error);
        throw error;
    }
}

// AUTHENTICATION API

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

export const authAPI = {
    // Mock Login (Simulated)
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

    // Placeholder Logout
    // Note: '_token' has an underscore to silence "unused variable" warnings
    logout: async (_token: string): Promise<void> => {
        return Promise.resolve();
    },
};

// ARCHER API

export interface Score {
    scoreId: number;
    archerId: number;
    roundId: number;
    compId?: number;
    dateShot: string;
    totalScore: number;
}

export interface Archer {
    archerId: number;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    email: string;
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
    round?: any;
    equipment?: any;
}

export const archerAPI = {
    // GET /api/Archer/{id}/scores
    getScores: async (archerId: string, token: string): Promise<Score[]> => {
        return apiCall<Score[]>(`/Archer/${archerId}/scores`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    // POST /api/Score (Submit Score) - DEPRECATED, use stagingScoreAPI instead
    submitScore: async (
        archerId: string,
        scoreData: any,
        token: string
    ): Promise<any> => {

        const backendPayload = {
            ArcherId: parseInt(archerId) || 1, // Fallback to ID 1 if parsing fails
            RoundId: parseInt(scoreData.roundId),
            CompId: parseInt(scoreData.competitionId),
            TotalScore: scoreData.totalScore,
            DateShot: scoreData.dateShot, // YYYY-MM-DD string is compatible with DateOnly
        };

        return apiCall<any>('/Score', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(backendPayload),
        });
    },
};

// STAGING SCORE API

export const stagingScoreAPI = {
    // GET /api/StagingScore/pending - Get all pending scores waiting for approval
    getPendingScores: async (token: string): Promise<StagingScore[]> => {
        return apiCall<StagingScore[]>('/StagingScore/pending', {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    // GET /api/StagingScore - Get all staging scores
    getAllStagingScores: async (token: string): Promise<StagingScore[]> => {
        return apiCall<StagingScore[]>('/StagingScore', {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    // GET /api/StagingScore/{id} - Get single staging score
    getStagingScore: async (stagingId: number, token: string): Promise<StagingScore> => {
        return apiCall<StagingScore>(`/StagingScore/${stagingId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    // POST /api/StagingScore - Submit score for approval
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

    // PUT /api/StagingScore/{id}/approve - Approve score and move to official table
    approveScore: async (
        stagingId: number,
        competitionId?: number,
        token?: string
    ): Promise<any> => {
        const queryParams = competitionId ? `?competitionId=${competitionId}` : '';
        return apiCall<any>(`/StagingScore/${stagingId}/approve${queryParams}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    // PUT /api/StagingScore/{id}/reject - Reject score
    rejectScore: async (
        stagingId: number,
        reason: string,
        token?: string
    ): Promise<any> => {
        return apiCall<any>(`/StagingScore/${stagingId}/reject`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(reason),
        });
    },

    // DELETE /api/StagingScore/{id} - Delete staging score
    deleteStagingScore: async (stagingId: number, token: string): Promise<void> => {
        return apiCall<void>(`/StagingScore/${stagingId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};

// RECORDER API

export const recorderAPI = {
    // GET /api/Archer
    getArchers: async (token: string): Promise<Archer[]> => {
        return apiCall<Archer[]>('/Archer', {
            headers: { Authorization: `Bearer ${token}` },
        });
    },

    // POST /api/Archer
    createArcher: async (
        archerData: {
            firstName: string;
            lastName: string;
            email: string;
            gender: string;
            dateOfBirth: string;
            phone?: string;
            defaultEquipmentId?: number;
        },
        token: string
    ): Promise<Archer> => {

        const backendPayload = {
            FirstName: archerData.firstName,
            LastName: archerData.lastName,
            Email: archerData.email,
            Gender: archerData.gender,
            DateOfBirth: archerData.dateOfBirth, // Send as DD/MM/YYYY or YYYY-MM-DD
            Phone: archerData.phone || null,
            DefaultEquipmentId: archerData.defaultEquipmentId || 1
        };

        return apiCall<Archer>('/Archer', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(backendPayload),
        });
    },

    // PUT /api/Archer/{id}
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

    // DELETE /api/Archer/{id}
    deleteArcher: async (archerId: number, token: string): Promise<void> => {
        return apiCall<void>(`/Archer/${archerId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};