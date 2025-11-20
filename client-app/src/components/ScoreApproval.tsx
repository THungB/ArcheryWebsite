import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { stagingScoreAPI, StagingScore } from '../services/api';

export function ScoreApproval() {
  const [pendingScores, setPendingScores] = useState<StagingScore[]>([]);
  const [selectedScore, setSelectedScore] = useState<StagingScore | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch pending scores on component mount
  useEffect(() => {
    loadPendingScores();
  }, []);

  const loadPendingScores = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken') || 'dummy-token';
      const scores = await stagingScoreAPI.getPendingScores(token);
      setPendingScores(scores);
    } catch (err: any) {
      console.error('Error loading pending scores:', err);
      setError('Failed to load pending scores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedScore) return;
    
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('authToken') || 'dummy-token';
      await stagingScoreAPI.approveScore(selectedScore.stagingId, undefined, token);
      
      // Remove from pending list
      setPendingScores(pendingScores.filter(s => s.stagingId !== selectedScore.stagingId));
      setSelectedScore(null);
      setRejectionReason('');
    } catch (err: any) {
      console.error('Error approving score:', err);
      setError('Failed to approve score. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedScore || !rejectionReason.trim()) return;
    
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('authToken') || 'dummy-token';
      await stagingScoreAPI.rejectScore(selectedScore.stagingId, rejectionReason, token);
      
      // Remove from pending list
      setPendingScores(pendingScores.filter(s => s.stagingId !== selectedScore.stagingId));
      setSelectedScore(null);
      setRejectionReason('');
    } catch (err: any) {
      console.error('Error rejecting score:', err);
      setError('Failed to reject score. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = (endScores?: number[]) => {
    if (!endScores) return 0;
    return endScores.reduce((sum, score) => sum + score, 0);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8 gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading pending scores...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Score Approvals</CardTitle>
          <CardDescription>Review and approve archer scores submitted for approval</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                <button
                  onClick={loadPendingScores}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {pendingScores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No pending scores to review.</p>
              <p className="text-sm mt-1">All scores have been approved or rejected.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Archer</TableHead>
                  <TableHead>Round</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingScores.map((score) => (
                  <TableRow key={score.stagingId} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {score.archer?.firstName} {score.archer?.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {score.archerId}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{score.round?.roundName || `Round ${score.roundId}`}</TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{score.equipment?.divisionType || `Equipment ${score.equipmentId}`}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{score.rawScore}</span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(score.dateTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedScore(score)}
                        className="hover:bg-gray-100 dark:hover:bg-slate-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Total pending:</strong> {pendingScores.length} score{pendingScores.length !== 1 ? 's' : ''} awaiting approval
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Score Review Dialog */}
      {selectedScore && (
        <Dialog open={!!selectedScore} onOpenChange={() => {
          setSelectedScore(null);
          setRejectionReason('');
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Score Submission</DialogTitle>
              <DialogDescription>
                Verify the score details
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Archer Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Archer</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {selectedScore.archer?.firstName} {selectedScore.archer?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Archer ID</p>
                  <p className="text-gray-900 dark:text-gray-100">{selectedScore.archerId}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Round</p>
                  <p className="text-gray-900 dark:text-gray-100">{selectedScore.round?.roundName || `Round ${selectedScore.roundId}`}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Equipment</p>
                  <p className="text-gray-900 dark:text-gray-100">{selectedScore.equipment?.divisionType || `Equipment ${selectedScore.equipmentId}`}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Submitted</p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(selectedScore.dateTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Status</p>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                    {selectedScore.status?.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Score Details */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Score Details</h4>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-gray-100 font-medium">Total Raw Score:</span>
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedScore.rawScore}</span>
                  </div>
                </div>
              </div>

              {/* Rejection Reason Input */}
              <div>
                <label className="text-gray-700 dark:text-gray-300 font-medium block mb-2">
                  Rejection Reason (required if rejecting):
                </label>
                <Textarea
                  placeholder="Explain why this score is being rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedScore(null);
                    setRejectionReason('');
                  }}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
