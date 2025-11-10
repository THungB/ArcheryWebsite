import { useState } from 'react';
import { CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

export function ScoreApproval() {
  const [selectedScore, setSelectedScore] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Mock data - would come from backend
  const pendingScores = [
    {
      id: 1,
      archerName: 'John Smith',
      archerNumber: 'A-2345',
      competition: 'Spring Championship 2024',
      round: '720 Round',
      distance: '70m',
      score: 687,
      endScores: [58, 59, 57, 58, 56, 59],
      submittedDate: '2024-11-05 14:30',
      notes: '',
      flagged: false,
    },
    {
      id: 2,
      archerName: 'Emma Davis',
      archerNumber: 'A-1289',
      competition: 'Indoor Open',
      round: 'WA 18m',
      distance: '18m',
      score: 598,
      endScores: [60, 60, 59, 60, 60, 59],
      submittedDate: '2024-11-05 13:15',
      notes: 'Personal best attempt',
      flagged: true,
      flagReason: 'Score significantly higher than average',
    },
    {
      id: 3,
      archerName: 'Michael Chen',
      archerNumber: 'A-3456',
      competition: 'Summer Series Round 3',
      round: 'FITA Round',
      distance: '50m',
      score: 645,
      endScores: [56, 54, 55, 53, 56, 51],
      submittedDate: '2024-11-05 12:00',
      notes: '',
      flagged: false,
    },
  ];

  const handleApprove = (scoreId: number) => {
    console.log('Approving score:', scoreId);
    // In real implementation, this would send to backend
    setSelectedScore(null);
  };

  const handleReject = (scoreId: number) => {
    console.log('Rejecting score:', scoreId, 'Reason:', rejectionReason);
    // In real implementation, this would send to backend
    setSelectedScore(null);
    setRejectionReason('');
  };

  const calculateTotal = (endScores: number[]) => {
    return endScores.reduce((sum, score) => sum + score, 0);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Score Approvals</CardTitle>
          <CardDescription>Review and approve archer scores</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Archer</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>Round</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingScores.map((score) => (
                <TableRow key={score.id} className={score.flagged ? 'bg-yellow-50' : ''}>
                  <TableCell>
                    <div>
                      <div>{score.archerName}</div>
                      <div className="text-gray-500">{score.archerNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>{score.competition}</TableCell>
                  <TableCell>{score.round}</TableCell>
                  <TableCell>{score.distance}</TableCell>
                  <TableCell>{score.score}</TableCell>
                  <TableCell>{score.submittedDate}</TableCell>
                  <TableCell>
                    {score.flagged ? (
                      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Flagged
                      </Badge>
                    ) : (
                      <Badge variant="outline">Normal</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedScore(score)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Score Review Dialog */}
      {selectedScore && (
        <Dialog open={!!selectedScore} onOpenChange={() => setSelectedScore(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Score Submission</DialogTitle>
              <DialogDescription>
                Verify the score details and approve or reject
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Archer Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-gray-600">Archer</p>
                  <p>{selectedScore.archerName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Archer Number</p>
                  <p>{selectedScore.archerNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Competition</p>
                  <p>{selectedScore.competition}</p>
                </div>
                <div>
                  <p className="text-gray-600">Submitted</p>
                  <p>{selectedScore.submittedDate}</p>
                </div>
              </div>

              {/* Flag Warning */}
              {selectedScore.flagged && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-900">Flagged for Review</p>
                    <p className="text-yellow-700">{selectedScore.flagReason}</p>
                  </div>
                </div>
              )}

              {/* Score Details */}
              <div>
                <h4 className="mb-3">Score Details</h4>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {selectedScore.endScores.map((score: number, index: number) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-gray-600">End {index + 1}</p>
                      <p className="text-blue-600">{score}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-blue-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span>Total Score:</span>
                    <span className="text-blue-600">{calculateTotal(selectedScore.endScores)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedScore.notes && (
                <div>
                  <p className="text-gray-600 mb-2">Archer Notes:</p>
                  <p className="p-3 bg-gray-50 rounded-lg">{selectedScore.notes}</p>
                </div>
              )}

              {/* Rejection Reason */}
              <div>
                <label className="text-gray-600 mb-2 block">
                  Rejection Reason (if rejecting):
                </label>
                <Textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
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
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleReject(selectedScore.id)}
                  disabled={!rejectionReason}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(selectedScore.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
