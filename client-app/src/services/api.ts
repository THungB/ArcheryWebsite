// API Configuration for ASP.NET Backend Integration

// Replace this with your ASP.NET API URL
const API_BASE_URL = 'https://localhost:7001/api'; // Your ASP.NET API URL
// For production: const API_BASE_URL = 'https://yourdomain.com/api';

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

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Only log errors in development, silently fail otherwise
    if (process.env.NODE_ENV === 'development') {
      // Backend not running - this is expected during development
    }
    throw error;
  }
}

// ============================================
// AUTHENTICATION API
// ============================================

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
  // POST /api/auth/login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiCall<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // POST /api/auth/logout
  logout: async (token: string): Promise<void> => {
    return apiCall<void>('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// ============================================
// ARCHER API
// ============================================

export interface Score {
  id: number;
  archerId: string;
  competitionId: number;
  competitionName: string;
  roundType: string;
  distance: string;
  totalScore: number;
  endScores: number[];
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  rejectionReason?: string;
}

export interface PersonalBest {
  roundType: string;
  distance: string;
  bestScore: number;
  date: string;
  competitionName: string;
}

export interface Competition {
  id: number;
  name: string;
  date: string;
  location: string;
  roundType: string;
  distance: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'active' | 'completed';
  description?: string;
}

export const archerAPI = {
  // GET /api/archers/{archerId}/scores
  getScores: async (archerId: string, token: string): Promise<Score[]> => {
    return apiCall<Score[]>(`/archers/${archerId}/scores`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // POST /api/archers/{archerId}/scores
  submitScore: async (
    archerId: string,
    scoreData: {
      competitionId: number;
      roundType: string;
      distance: string;
      endScores: number[];
      notes?: string;
    },
    token: string
  ): Promise<Score> => {
    return apiCall<Score>(`/archers/${archerId}/scores`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(scoreData),
    });
  },

  // GET /api/archers/{archerId}/personal-bests
  getPersonalBests: async (archerId: string, token: string): Promise<PersonalBest[]> => {
    return apiCall<PersonalBest[]>(`/archers/${archerId}/personal-bests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // GET /api/archers/{archerId}/statistics
  getStatistics: async (
    archerId: string,
    token: string
  ): Promise<{
    totalScores: number;
    personalBest: number;
    competitions: number;
    averageScore: number;
  }> => {
    return apiCall(`/archers/${archerId}/statistics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // GET /api/competitions
  getCompetitions: async (token: string): Promise<Competition[]> => {
    return apiCall<Competition[]>('/competitions', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // GET /api/competitions/{competitionId}/leaderboard
  getLeaderboard: async (
    competitionId: number,
    token: string
  ): Promise<{
    rank: number;
    archerId: string;
    archerName: string;
    score: number;
    arrows: number;
  }[]> => {
    return apiCall(`/competitions/${competitionId}/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// ============================================
// RECORDER API
// ============================================

export interface Archer {
  id: number;
  archerId: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  bowType: string;
  personalBest: number;
  totalCompetitions: number;
  status: 'active' | 'inactive';
}

export interface PendingScore extends Score {
  archerName: string;
  archerNumber: string;
  flagged: boolean;
  flagReason?: string;
}

export const recorderAPI = {
  // GET /api/recorder/pending-scores
  getPendingScores: async (token: string): Promise<PendingScore[]> => {
    return apiCall<PendingScore[]>('/recorder/pending-scores', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // POST /api/recorder/scores/{scoreId}/approve
  approveScore: async (scoreId: number, token: string): Promise<void> => {
    return apiCall<void>(`/recorder/scores/${scoreId}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // POST /api/recorder/scores/{scoreId}/reject
  rejectScore: async (
    scoreId: number,
    reason: string,
    token: string
  ): Promise<void> => {
    return apiCall<void>(`/recorder/scores/${scoreId}/reject`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason }),
    });
  },

  // GET /api/recorder/archers
  getArchers: async (token: string): Promise<Archer[]> => {
    return apiCall<Archer[]>('/recorder/archers', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // POST /api/recorder/archers
  createArcher: async (
    archerData: {
      name: string;
      email: string;
      phone: string;
      archerNumber: string;
      category: string;
      bowType: string;
    },
    token: string
  ): Promise<Archer> => {
    return apiCall<Archer>('/recorder/archers', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(archerData),
    });
  },

  // PUT /api/recorder/archers/{archerId}
  updateArcher: async (
    archerId: number,
    archerData: Partial<Archer>,
    token: string
  ): Promise<Archer> => {
    return apiCall<Archer>(`/recorder/archers/${archerId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(archerData),
    });
  },

  // DELETE /api/recorder/archers/{archerId}
  deleteArcher: async (archerId: number, token: string): Promise<void> => {
    return apiCall<void>(`/recorder/archers/${archerId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // GET /api/recorder/competitions
  getCompetitions: async (token: string): Promise<Competition[]> => {
    return apiCall<Competition[]>('/recorder/competitions', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // POST /api/recorder/competitions
  createCompetition: async (
    competitionData: {
      name: string;
      date: string;
      location: string;
      roundType: string;
      distance: string;
      maxParticipants: number;
      description?: string;
    },
    token: string
  ): Promise<Competition> => {
    return apiCall<Competition>('/recorder/competitions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(competitionData),
    });
  },

  // PUT /api/recorder/competitions/{competitionId}
  updateCompetition: async (
    competitionId: number,
    competitionData: Partial<Competition>,
    token: string
  ): Promise<Competition> => {
    return apiCall<Competition>(`/recorder/competitions/${competitionId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(competitionData),
    });
  },

  // DELETE /api/recorder/competitions/{competitionId}
  deleteCompetition: async (competitionId: number, token: string): Promise<void> => {
    return apiCall<void>(`/recorder/competitions/${competitionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // GET /api/recorder/statistics
  getStatistics: async (
    token: string
  ): Promise<{
    totalArchers: number;
    activeCompetitions: number;
    pendingApprovals: number;
    approvedToday: number;
  }> => {
    return apiCall('/recorder/statistics', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
