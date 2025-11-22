import { useState, useEffect } from 'react';
// [FIX] Xóa AlertCircle không dùng
import { CheckCircle, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { archerAPI, commonAPI, Score } from '../services/api';
import { ScoreDetailModal } from './ScoreDetailModal';

interface MyScoresProps {
    userId: string;
}

export function MyScores({ userId }: MyScoresProps) {
    const [scores, setScores] = useState<Score[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // [NEW] State cho modal chi tiết
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedScoreDetail, setSelectedScoreDetail] = useState<any>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // [FIX] Di chuyển hàm loadScores vào trong useEffect hoặc dùng useCallback để tránh lỗi dependency
    useEffect(() => {
        const loadScores = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('authToken') || 'dummy-token';
                const data = await archerAPI.getScores(userId, token);
                setScores(data || []);
            } catch (err: unknown) {
                console.error(err);
                const msg = err instanceof Error ? err.message : "Failed to load scores";
                setError(msg); // [FIX] Sử dụng setError để biến error được dùng
                setScores([]);
            } finally {
                setLoading(false);
            }
        };

        loadScores();
    }, [userId]);

    const handleViewDetail = async (scoreId: number) => {
        setLoadingDetail(true);
        try {
            const detail = await commonAPI.getScoreDetail(scoreId);
            setSelectedScoreDetail(detail);
        } catch (e) {
            console.error("Failed to load detail", e);
        } finally {
            setLoadingDetail(false);
        }
    };

    const getStatusBadge = () => {
        return (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" /> Approved
            </Badge>
        );
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading your scores...
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>My Approved Scores</CardTitle>
                    <CardDescription>View all your officially approved competition scores</CardDescription>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
                            {error}
                        </div>
                    ) : scores.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No scores found.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Round</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scores.map((score) => (
                                    <TableRow key={score.scoreId} className="cursor-pointer hover:bg-slate-50">
                                        <TableCell className="font-medium">
                                            {new Date(score.dateShot).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{score.roundName || `Round ${score.roundId}`}</TableCell>
                                        <TableCell>
                                            <span className="font-bold text-blue-600">{score.totalScore}</span>
                                        </TableCell>
                                        <TableCell>{getStatusBadge()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewDetail(score.scoreId)}
                                                disabled={loadingDetail}
                                            >
                                                {loadingDetail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4 text-slate-500 hover:text-blue-600" />}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {selectedScoreDetail && (
                <ScoreDetailModal
                    score={selectedScoreDetail}
                    onClose={() => setSelectedScoreDetail(null)}
                />
            )}
        </>
    );
}