import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, AlertTriangle, Loader2, User, Target, Calendar, Award } from 'lucide-react';
import { stagingScoreAPI, StagingScore } from '../services/api';

export function ScoreApproval() {
    const [pendingScores, setPendingScores] = useState<StagingScore[]>([]);
    const [selectedScore, setSelectedScore] = useState<StagingScore | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

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

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-center py-12 gap-2 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading pending scores...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-6">
                        <h2 className="text-2xl font-bold mb-2">Pending Score Approvals</h2>
                        <p className="text-blue-100">Review and approve archer scores submitted for approval</p>
                    </div>

                    <div className="p-6">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
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

                        {/* Empty State */}
                        {pendingScores.length === 0 ? (
                            <div className="text-center py-16 text-gray-500">
                                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">No pending scores to review</p>
                                <p className="text-sm mt-2">All scores have been approved or rejected.</p>
                            </div>
                        ) : (
                            <>
                                {/* Scores Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-slate-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Archer
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Round
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Equipment
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Score
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Submitted
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-800">
                                            {pendingScores.map((score) => (
                                                <tr key={score.stagingId} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                                    {score.archer?.firstName} {score.archer?.lastName}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">ID: {score.archerId}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                        {score.round?.roundName || `Round ${score.roundId}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                        {score.equipment?.divisionType || `Equipment ${score.equipmentId}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                            {score.rawScore}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                        {new Date(score.dateTime).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => setSelectedScore(score)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            Review
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary */}
                                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                        <strong>Total pending:</strong> {pendingScores.length} score{pendingScores.length !== 1 ? 's' : ''} awaiting approval
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Review Dialog */}
                {selectedScore && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            {/* Dialog Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold">Review Score Submission</h3>
                                        <p className="text-blue-100 mt-1">Verify the score details and approve or reject</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedScore(null);
                                            setRejectionReason('');
                                        }}
                                        className="w-10 h-10 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Archer Information Card */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Archer</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    {selectedScore.archer?.firstName} {selectedScore.archer?.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {selectedScore.archerId}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Target className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Round</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    {selectedScore.round?.roundName || `Round ${selectedScore.roundId}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Award className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Equipment</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    {selectedScore.equipment?.divisionType || `Equipment ${selectedScore.equipmentId}`}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                                    {new Date(selectedScore.dateTime).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(selectedScore.dateTime).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
                                            STATUS: {selectedScore.status?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Total Score Display */}
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                                <Target className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium uppercase tracking-wide">
                                                    Total Score
                                                </p>
                                                <p className="text-xs text-blue-600 dark:text-blue-400">Raw score submitted</p>
                                            </div>
                                        </div>
                                        <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                                            {selectedScore.rawScore}
                                        </p>
                                    </div>
                                </div>

                                {/* Rejection Reason */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Rejection Reason <span className="text-red-500">(required if rejecting)</span>
                                    </label>
                                    <textarea
                                        placeholder="Explain why this score is being rejected..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => {
                                            setSelectedScore(null);
                                            setRejectionReason('');
                                        }}
                                        disabled={isProcessing}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={!rejectionReason.trim() || isProcessing}
                                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Rejecting...
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-5 h-5" />
                                                Reject Score
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        disabled={isProcessing}
                                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Approving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Approve Score
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}