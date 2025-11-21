import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, Eye, AlertTriangle, Loader2, User, Target, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { stagingScoreAPI, StagingScore, StagedRangeInput } from '../services/api';

export function ScoreApproval() {
    const [pendingScores, setPendingScores] = useState<StagingScore[]>([]);
    const [selectedScore, setSelectedScore] = useState<StagingScore | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const [expandedRanges, setExpandedRanges] = useState<number[]>([0, 1]);

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
        } catch (err: unknown) {
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
            setPendingScores(prev => prev.filter(s => s.stagingId !== selectedScore.stagingId));
            setSelectedScore(null);
            setRejectionReason('');
        } catch (err: unknown) {
            console.error('Error approving score:', err);
            // [FIXED] Xử lý lỗi chuẩn TypeScript thay vì dùng any
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            alert('Failed to approve score: ' + errorMessage);
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
            setPendingScores(prev => prev.filter(s => s.stagingId !== selectedScore.stagingId));
            setSelectedScore(null);
            setRejectionReason('');
        } catch (err: unknown) {
            console.error('Error rejecting score:', err);
            alert('Failed to reject score');
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Helper Logic: Parse & Calculate Score ---

    // Parse chuỗi JSON arrowValues thành object
    const parsedDetails: StagedRangeInput[] = useMemo(() => {
        if (!selectedScore?.arrowValues) return [];
        try {
            const data = JSON.parse(selectedScore.arrowValues);
            return Array.isArray(data) ? data : [];
        } catch (e) {
            console.error("Failed to parse arrow values", e);
            return [];
        }
    }, [selectedScore]);

    // Tính tổng điểm thực tế từ chi tiết mũi tên
    const calculatedTotal = useMemo(() => {
        let total = 0;
        // Kiểm tra an toàn để tránh crash nếu dữ liệu null
        if (!parsedDetails || !Array.isArray(parsedDetails)) return 0;

        parsedDetails.forEach(range => {
            if (range && Array.isArray(range.ends)) {
                range.ends.forEach(endArrows => {
                    if (Array.isArray(endArrows)) {
                        endArrows.forEach(val => {
                            const cleanVal = val?.toString().toUpperCase() || '';
                            if (cleanVal === 'X' || cleanVal === '10') total += 10;
                            else if (cleanVal === 'M' || cleanVal === '') total += 0;
                            else total += parseInt(cleanVal) || 0;
                        });
                    }
                });
            }
        });
        return total;
    }, [parsedDetails]);

    const toggleRange = (idx: number) => {
        setExpandedRanges(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    // Helper lấy tên hiển thị an toàn (ưu tiên dữ liệu phẳng từ DTO mới)
    const getArcherName = (s: StagingScore) => s.archerName || (s.archer ? `${s.archer.firstName} ${s.archer.lastName}` : `ID: ${s.archerId}`);
    const getRoundName = (s: StagingScore) => s.roundName || s.round?.roundName || `Round #${s.roundId}`;
    const getEquipmentName = (s: StagingScore) => s.equipmentType || s.equipment?.divisionType || `Equip #${s.equipmentId}`;

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
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                                    <button onClick={loadPendingScores} className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline">Try again</button>
                                </div>
                            </div>
                        )}

                        {pendingScores.length === 0 ? (
                            <div className="text-center py-16 text-gray-500">
                                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">No pending scores</p>
                                <p className="text-sm mt-2">All caught up!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-slate-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Archer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Round</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                                                {getArcherName(score)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">ID: {score.archerId}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{getRoundName(score)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">{getEquipmentName(score)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(score.dateTime).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button onClick={() => setSelectedScore(score)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                                        <Eye className="w-4 h-4" /> Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Review Dialog */}
                {selectedScore && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">

                            {/* Dialog Header */}
                            <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="text-2xl font-bold">Review Score Submission</h3>
                                    <p className="text-blue-100 mt-1">Verify details before approving</p>
                                </div>
                                <button onClick={() => { setSelectedScore(null); setRejectionReason(''); }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 overflow-y-auto">
                                {/* Info Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-3 mb-2">
                                            <User className="w-5 h-5 text-blue-600" />
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">Archer</span>
                                        </div>
                                        <p className="text-lg font-medium">{getArcherName(selectedScore)}</p>
                                        <p className="text-sm text-gray-500">ID: {selectedScore.archerId}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Target className="w-5 h-5 text-green-600" />
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">Details</span>
                                        </div>
                                        <p className="text-sm"><span className="text-gray-500">Round:</span> {getRoundName(selectedScore)}</p>
                                        <p className="text-sm"><span className="text-gray-500">Bow:</span> {getEquipmentName(selectedScore)}</p>
                                    </div>
                                </div>

                                {/* Total Score Banner */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-blue-700 dark:text-blue-300 uppercase">Calculated Score</p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">Based on arrow values below</p>
                                    </div>
                                    <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                                        {calculatedTotal}
                                    </div>
                                </div>

                                {/* --- CHI TIẾT PHIẾU ĐIỂM --- */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-purple-600" /> Scorecard Details
                                    </h4>

                                    {(!parsedDetails || parsedDetails.length === 0) ? (
                                        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                                            No detailed arrow data available (Legacy format or Error)
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {parsedDetails.map((range, rIdx) => (
                                                <div key={rIdx} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => toggleRange(rIdx)}
                                                        className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 transition-colors text-left"
                                                    >
                                                        <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                                                            Range {rIdx + 1} <span className="font-normal text-gray-500 ml-2">(ID: {range?.rangeId})</span>
                                                        </span>
                                                        {expandedRanges.includes(rIdx) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </button>

                                                    {expandedRanges.includes(rIdx) && (
                                                        <div className="p-3 bg-white dark:bg-slate-900 grid gap-2">
                                                            {Array.isArray(range.ends) && range.ends.map((endArrows, eIdx) => {
                                                                const endTotal = Array.isArray(endArrows) ? endArrows.reduce((sum, val) => {
                                                                    const v = val?.toString().toUpperCase() || '';
                                                                    return sum + (v === 'X' || v === '10' ? 10 : (v === 'M' || v === '' ? 0 : parseInt(v) || 0));
                                                                }, 0) : 0;

                                                                return (
                                                                    <div key={eIdx} className="flex items-center gap-3 text-sm">
                                                                        <span className="w-12 font-medium text-gray-500">End {eIdx + 1}</span>
                                                                        <div className="flex-1 grid grid-cols-6 gap-1">
                                                                            {Array.isArray(endArrows) && endArrows.map((arrow, aIdx) => (
                                                                                <div key={aIdx} className={`
                                                                                    h-8 flex items-center justify-center rounded border font-bold
                                                                                    ${arrow?.toUpperCase() === '10' || arrow?.toUpperCase() === 'X'
                                                                                        ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                                                                        : arrow?.toUpperCase() === 'M'
                                                                                            ? 'bg-gray-100 text-gray-400'
                                                                                            : 'bg-white border-gray-200'}
                                                                                `}>
                                                                                    {arrow}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        <span className="w-10 text-right font-bold text-blue-600">{endTotal}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Rejection Reason Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Rejection Reason <span className="text-red-500 font-normal text-xs">(required if rejecting)</span>
                                    </label>
                                    <textarea
                                        placeholder="e.g., Incorrect equipment listed, score doesn't match target face..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800"
                                    />
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 rounded-b-2xl flex gap-3">
                                <button onClick={() => setSelectedScore(null)} disabled={isProcessing} className="flex-1 py-3 border rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleReject} disabled={!rejectionReason.trim() || isProcessing} className="flex-1 py-3 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold disabled:opacity-50 transition-colors flex justify-center gap-2">
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <><XCircle className="w-5 h-5" /> Reject</>}
                                </button>
                                <button onClick={handleApprove} disabled={isProcessing} className="flex-1 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg font-semibold shadow-lg shadow-green-200 disabled:opacity-50 transition-colors flex justify-center gap-2">
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Approve</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}