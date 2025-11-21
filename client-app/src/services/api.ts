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
export interface Competition { compId: number; compName: string; startDate: string; endDate: string; location?: string; isClubChampionship: boolean; }
export interface Score { scoreId: number; archerId: number; roundId: number; compId?: number; dateShot: string; totalScore: number; roundName?: string; competitionName?: string; }

// [FIXED] Cập nhật Interface để khớp với dữ liệu Backend trả về (ArcherController)
export interface PersonalBest { 
    scoreId: number; 
    roundName: string; 
    totalScore: number;      // Sửa từ bestScore -> totalScore
    dateShot: string;        // Sửa từ dateAchieved -> dateShot
    competitionName?: string;// Sửa từ competitionId -> competitionName
}

export interface StagingScore { stagingId: number; archerId: number; roundId: number; equipmentId: number; dateTime: string; rawScore: number; status: string; arrowValues: string; archerName?: string; roundName?: string; equipmentType?: string; }
export interface ProcessScoreResponse { message: string; scoreId?: number; }
export interface CreateArcherRequest { firstName: string; lastName: string; email: string; gender: string; dateOfBirth: string; phone?: string; defaultEquipmentId?: number; }

// --- System / Dashboard Interfaces ---
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
    getRoundStructure: (roundId: number) => apiCall<RoundStructureDto>(`/Round/${roundId}/structure`)
};

export const stagingScoreAPI = {
    getPendingScores: (token: string) => apiCall<StagingScore[]>('/StagingScore/pending', { headers: { Authorization: `Bearer ${token}` } }),
    submitScore: (archerId: number, roundId: number, equipmentId: number, stagedData: StagedRangeInput[], token: string) =>
        apiCall<StagingScore>('/StagingScore', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ArcherId: archerId, RoundId: roundId, EquipmentId: equipmentId, ScoreData: stagedData }),
        }),
    approveScore: (id: number, compId?: number, token?: string) => apiCall<ProcessScoreResponse>(`/StagingScore/${id}/approve${compId ? `?competitionId=${compId}` : ''}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }),
    rejectScore: (id: number, reason: string, token?: string) => apiCall<ProcessScoreResponse>(`/StagingScore/${id}/reject`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(reason) }),
};

export const archerAPI = {
    getScores: (id: string, token: string) => apiCall<Score[]>(`/Archer/${id}/scores`, { headers: { Authorization: `Bearer ${token}` } }),
    
    // [FIXED] Sửa đường dẫn API (Archer thay vì Score) và thêm tham số token
    getPersonalBests: (id: number | string, token: string) => 
        apiCall<PersonalBest[]>(`/Archer/${id}/personal-bests`, { headers: { Authorization: `Bearer ${token}` } })
};

export const recorderAPI = {
    createArcher: (data: CreateArcherRequest, token: string) => apiCall('/Archer', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) })
};

// --- Dashboard API ---
export const dashboardAPI = {
    getStats: () => apiCall<SystemStats>('/Dashboard/stats'),
    getLogs: () => apiCall<SystemLog[]>('/Dashboard/logs'),
};