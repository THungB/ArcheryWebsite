// src/services/api.ts

const API_BASE_URL = 'http://localhost:5280/api';

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const config: RequestInit = { ...options, headers: { ...defaultHeaders, ...options.headers } };

    try {
        const response = await fetch(url, config);
        if (!response.ok) throw new Error(await response.text() || `API Error: ${response.status}`);
        const text = await response.text();
        return text ? (JSON.parse(text) as T) : ({} as T);
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
}

// --- INTERFACES ---
export interface StagedRangeInput { rangeId: number; ends: string[][]; }
export interface RangeDetailDto { sequenceNumber: number; rangeId: number; distanceMeters: number; endCount: number; arrowsPerEnd: number; faceSizeCm: number; }
export interface RoundStructureDto { roundId: number; roundName: string; ranges: RangeDetailDto[]; }
export interface Equipment { equipmentId: number; divisionType: string; }
export interface Round { roundId: number; roundName: string; description?: string; }
export interface Competition { compId: number; compName: string; startDate: string; endDate: string; location?: string; isClubChampionship: boolean; details?: string; }
export interface Score { scoreId: number; archerId: number; roundId: number; compId?: number; dateShot: string; totalScore: number; roundName?: string; competitionName?: string; }

export interface PersonalBest {
    scoreId: number;
    roundName: string;
    totalScore: number;
    dateShot: string;
    competitionName?: string;
}

// [NEW] Interface chi tiết cho từng lượt bắn (End) trong bảng điểm chi tiết
export interface ScoreDetailEnd {
    endId: number;
    endNumber: number;
    endScore: number;
    rangeDistance: number;
    arrows: (string | number)[];
}

// [NEW] Interface phản hồi cho API getScoreDetail
export interface ScoreDetailResponse {
    score: {
        scoreId: number;
        totalScore: number;
        dateShot: string;
        round?: { roundName: string };
        comp?: { compName: string };
    };
    ends: ScoreDetailEnd[];
}

// [NEW] Interface cho Analytics response (used by AnalyticsDashboard)
export interface AnalyticsData {
    hasData: boolean;
    overview: {
        averageScore: number;
        personalBest: number;
        consistencyRating: number;
        trend: string;
        totalRounds: number;
    };
    history: { date: string; score: number; round: string }[];
}

export interface StagingScore { stagingId: number; archerId: number; roundId: number; equipmentId: number; dateTime: string; rawScore: number; status: string; arrowValues: string; archerName?: string; roundName?: string; equipmentType?: string; }
export interface ProcessScoreResponse { message: string; scoreId?: number; }
export interface CreateArcherRequest { firstName: string; lastName: string; email: string; gender: string; dateOfBirth: string; phone?: string; defaultEquipmentId?: number; }

export interface CreateCompetitionRequest {
    compName: string;
    startDate: string;
    endDate: string;
    location?: string;
    isClubChampionship: boolean;
    details?: string;
}

export interface SystemLog {
    logId: number;
    timestamp: string;
    level: string;
    user: string;
    action: string;
    details: string;
    ipAddress: string;
}

export interface SystemStats {
    totalUsers: number;
    activeCompetitions: number;
    totalScores: number;
    pendingApprovals: number;
    totalCompetitions: number;
}

// --- API OBJECTS ---

export const commonAPI = {
    getRounds: () => apiCall<Round[]>('/Round'),
    getEquipment: () => apiCall<Equipment[]>('/Equipment'),
    getCompetitions: () => apiCall<Competition[]>('/Competition'),
    getUpcomingCompetitions: () => apiCall<Competition[]>('/Competition/upcoming'),
    getRoundStructure: (roundId: number) => apiCall<RoundStructureDto>(`/Round/${roundId}/structure`),

    // [FIXED] Thay 'any' bằng interface cụ thể ScoreDetailResponse
    getScoreDetail: (id: number) => apiCall<ScoreDetailResponse>(`/Score/${id}`),

    createCompetition: (data: CreateCompetitionRequest) => apiCall<Competition>('/Competition', { method: 'POST', body: JSON.stringify(data) }),
    updateCompetition: (id: number, data: CreateCompetitionRequest) => apiCall<Competition>(`/Competition/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCompetition: (id: number) => apiCall(`/Competition/${id}`, { method: 'DELETE' }),
};

export const stagingScoreAPI = {
    getPendingScores: (token: string) => apiCall<StagingScore[]>('/StagingScore/pending', { headers: { Authorization: `Bearer ${token}` } }),

    getAllStagingScores: (token: string) => apiCall<StagingScore[]>('/StagingScore', { headers: { Authorization: `Bearer ${token}` } }),

    submitScore: (archerId: number, roundId: number, equipmentId: number, stagedData: StagedRangeInput[], token: string, competitionId: number | null) => {
        const payload: {
            ArcherId: number;
            RoundId: number;
            EquipmentId: number;
            ScoreData: StagedRangeInput[];
            Metadata?: { competitionId: number };
        } = {
            ArcherId: archerId,
            RoundId: roundId,
            EquipmentId: equipmentId,
            ScoreData: stagedData
        };
        if (competitionId != null) {
            payload.Metadata = { competitionId };
        }

        return apiCall<StagingScore>('/StagingScore', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
        });
    },

    approveScore: (id: number, compId?: number, token?: string) => apiCall<ProcessScoreResponse>(`/StagingScore/${id}/approve${compId ? `?competitionId=${compId}` : ''}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }),
    rejectScore: (id: number, reason: string, token?: string) => apiCall<ProcessScoreResponse>(`/StagingScore/${id}/reject`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(reason) }),
};

export const archerAPI = {
    getScores: (id: string, token: string) => apiCall<Score[]>(`/Archer/${id}/scores`, { headers: { Authorization: `Bearer ${token}` } }),
    getPersonalBests: (id: number | string, token: string) =>
        apiCall<PersonalBest[]>(`/Archer/${id}/personal-bests`, { headers: { Authorization: `Bearer ${token}` } }),

    // [NEW] Use archerAPI.getAnalytics instead of manual fetch in AnalyticsDashboard
    getAnalytics: (id: string, token: string) =>
        apiCall<AnalyticsData>(`/Archer/${id}/analytics`, { headers: { Authorization: `Bearer ${token}` } })
};

export const recorderAPI = {
    createArcher: (data: CreateArcherRequest, token: string) => apiCall('/Archer', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) })
};

export const dashboardAPI = {
    getStats: () => apiCall<SystemStats>('/Dashboard/stats'),
    getLogs: () => apiCall<SystemLog[]>('/Dashboard/logs'),
};