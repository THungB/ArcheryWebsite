import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { archerAPI, Score } from '../services/api';

interface MyScoresProps {
  userId: string;
}

export function MyScores({ userId }: MyScoresProps) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScores();
  }, [userId]);

  const loadScores = async () => {
    setLoading(true);
    setError(null);
    
    // Check if backend is configured
    const token = localStorage.getItem('authToken');
    
    // If no token, use mock data (backend not configured yet)
    if (!token) {
      // Using mock data - backend not connected
      setTimeout(() => {
        setScores([
          {
            id: 1,
            archerId: userId,
            competitionId: 1,
            competitionName: 'Spring Championship 2024',
            roundType: '720 Round',
            distance: '70m',
            totalScore: 687,
            endScores: [58, 59, 57, 58, 56, 59],
            submittedDate: '2024-11-05',
            status: 'approved',
          },
          {
            id: 2,
            archerId: userId,
            competitionId: 2,
            competitionName: 'Indoor Open',
            roundType: 'WA 18m',
            distance: '18m',
            totalScore: 578,
            endScores: [56, 58, 57, 59, 58, 60],
            submittedDate: '2024-11-03',
            status: 'pending',
          },
          {
            id: 3,
            archerId: userId,
            competitionId: 3,
            competitionName: 'Summer Series Round 3',
            roundType: 'FITA Round',
            distance: '50m',
            totalScore: 645,
            endScores: [56, 54, 55, 53, 56, 51],
            submittedDate: '2024-11-01',
            status: 'approved',
          },
          {
            id: 4,
            archerId: userId,
            competitionId: 4,
            competitionName: 'Club Championship',
            roundType: '720 Round',
            distance: '70m',
            totalScore: 623,
            endScores: [54, 52, 51, 53, 52, 51],
            submittedDate: '2024-10-28',
            status: 'rejected',
            rejectionReason: 'Missing witness signature',
          },
        ]);
        setLoading(false);
      }, 500);
      return;
    }

    // Try to connect to backend
    try {
      const data = await archerAPI.getScores(userId, token);
      setScores(data);
    } catch (err) {
      // Backend not available, use mock data
      setScores([
        {
          id: 1,
          archerId: userId,
          competitionId: 1,
          competitionName: 'Spring Championship 2024',
          roundType: '720 Round',
          distance: '70m',
          totalScore: 687,
          endScores: [58, 59, 57, 58, 56, 59],
          submittedDate: '2024-11-05',
          status: 'approved',
        },
        {
          id: 2,
          archerId: userId,
          competitionId: 2,
          competitionName: 'Indoor Open',
          roundType: 'WA 18m',
          distance: '18m',
          totalScore: 578,
          endScores: [56, 58, 57, 59, 58, 60],
          submittedDate: '2024-11-03',
          status: 'pending',
        },
        {
          id: 3,
          archerId: userId,
          competitionId: 3,
          competitionName: 'Summer Series Round 3',
          roundType: 'FITA Round',
          distance: '50m',
          totalScore: 645,
          endScores: [56, 54, 55, 53, 56, 51],
          submittedDate: '2024-11-01',
          status: 'approved',
        },
        {
          id: 4,
          archerId: userId,
          competitionId: 4,
          competitionName: 'Club Championship',
          roundType: '720 Round',
          distance: '70m',
          totalScore: 623,
          endScores: [54, 52, 51, 53, 52, 51],
          submittedDate: '2024-10-28',
          status: 'rejected',
          rejectionReason: 'Missing witness signature',
        },
      ]);
      setError('Backend not connected - using demo data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">Loading scores...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Submitted Scores</CardTitle>
        <CardDescription>View all your competition scores and their approval status</CardDescription>
      </CardHeader>
      <CardContent>
        {scores.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No scores submitted yet. Click "Submit Score" to add your first score.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Round</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score) => (
                <TableRow key={score.id}>
                  <TableCell>{score.submittedDate}</TableCell>
                  <TableCell>{score.competitionName}</TableCell>
                  <TableCell>{score.roundType}</TableCell>
                  <TableCell>{score.distance}</TableCell>
                  <TableCell>{score.totalScore}</TableCell>
                  <TableCell>{getStatusBadge(score.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
