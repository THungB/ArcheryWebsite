import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Eye, Loader2 } from 'lucide-react';
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
    console.log(`🔵 MyScores: Loading scores for userId: ${userId}`);
    loadScores();
  }, [userId]);

  const loadScores = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken') || 'dummy-token';
      console.log(`🔵 MyScores: Fetching scores with token:`, token);
      
      const data = await archerAPI.getScores(userId, token);
      console.log(`✅ MyScores: Received ${data?.length || 0} scores`);
      
      setScores(data || []);
    } catch (err: any) {
      console.error('❌ MyScores: Error loading scores:', err);
      setError(err.message || 'Failed to load scores. Please check your connection.');
      setScores([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    // Since we're only showing approved scores from the score table,
    // we can mark them all as approved
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
        <CheckCircle className="w-3 h-3 mr-1" />
        Approved
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8 gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading your scores...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Approved Scores</CardTitle>
        <CardDescription>View all your officially approved competition scores</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              <button
                onClick={loadScores}
                className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
              <Eye className="w-6 h-6 text-gray-400" />
            </div>
            <p className="font-medium">No scores submitted yet</p>
            <p className="text-sm mt-1">Click "Submit Score" to add your first competition score.</p>
            <p className="text-xs text-gray-400 mt-3">Once submitted, scores will appear here after reviewer approval.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Round</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((score) => (
                <TableRow key={score.scoreId} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <TableCell className="text-gray-900 dark:text-gray-100">
                    {new Date(score.dateShot).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-gray-100">Round {score.roundId}</TableCell>
                  <TableCell className="text-gray-900 dark:text-gray-100">-</TableCell>
                  <TableCell>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{score.totalScore}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-slate-700">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {scores.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Total approved scores:</strong> {scores.length}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
