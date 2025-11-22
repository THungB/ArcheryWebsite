import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Award, Loader2, BarChart3, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { archerAPI, PersonalBest, Score } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PersonalBestsProps {
    userId: string;
}

export function PersonalBests({ userId }: PersonalBestsProps) {
    const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
    const [historyScores, setHistoryScores] = useState<Score[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken') || "dummy_token";

                const [pbs, scores] = await Promise.all([
                    archerAPI.getPersonalBests(userId, token),
                    archerAPI.getScores(userId, token)
                ]);

                setPersonalBests(pbs || []);
                setHistoryScores(scores || []);
                setError(null);
            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Failed to load data. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadData();
        }
    }, [userId]);

    if (loading) return (
        <div className="flex justify-center items-center p-12">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600 mr-2" />
            <span className="text-gray-500">Loading analytics...</span>
        </div>
    );

    if (error) {
        return (
            <div className="p-6 border border-red-200 bg-red-50 rounded-xl text-red-600 flex flex-col items-center gap-2">
                <Target className="w-8 h-8" />
                <p className="font-medium">{error}</p>
            </div>
        );
    }

    const chartData = personalBests.map(pb => ({
        name: pb.roundName.length > 15 ? pb.roundName.substring(0, 15) + '...' : pb.roundName,
        fullName: pb.roundName,
        score: pb.totalScore,
        date: new Date(pb.dateShot).toLocaleDateString(),
    }));

    const highestScore = personalBests.length > 0 ? Math.max(...personalBests.map(p => p.totalScore)) : 0;
    const totalRounds = historyScores.length;
    const latestRound = historyScores.length > 0 ? historyScores[0] : null;

    return (
        <div className="space-y-8">
            {/* --- DASHBOARD --- */}
            {historyScores.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Chart: Best Scores */}
                    <Card className="border-blue-100 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                <CardTitle>Personal Bests</CardTitle>
                            </div>
                            <CardDescription>Your highest achievements per round type.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} interval={0} angle={-15} textAnchor="end" />
                                    <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} width={30} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="score" name="Best Score" radius={[4, 4, 0, 0]} barSize={40}>
                                        {chartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={'#3b82f6'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* KPI Cards */}
                    <Card className="border-green-100 shadow-sm">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <CardTitle>Growth Metrics</CardTitle>
                            </div>
                            <CardDescription>Overall career statistics.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 h-full content-start">
                                <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">Highest Score Ever</p>
                                    <p className="text-4xl font-bold text-blue-700 mt-1">{highestScore}</p>
                                </div>
                                <div className="p-5 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100">
                                    <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Total Events</p>
                                    <p className="text-4xl font-bold text-green-700 mt-1">{totalRounds}</p>
                                </div>
                                <div className="col-span-2 p-5 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-purple-500 uppercase tracking-wide">Latest Activity</p>
                                            {/* SỬA LỖI: Dùng roundName trực tiếp */}
                                            <p className="font-bold text-purple-900 text-lg mt-1">
                                                {latestRound?.roundName || "N/A"}
                                            </p>
                                            <p className="text-sm text-purple-600 mt-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {latestRound ? new Date(latestRound.dateShot).toLocaleDateString() : ""}
                                            </p>
                                        </div>
                                        <div className="bg-purple-100 p-2 rounded-full">
                                            <Award className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                    {latestRound && (
                                        <div className="mt-3 pt-3 border-t border-purple-100 flex justify-between items-center">
                                            <span className="text-sm text-purple-700">Score Achieved:</span>
                                            <span className="text-xl font-bold text-purple-700">{latestRound.totalScore}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50 p-8 text-center">
                    <p className="text-gray-500">No data available yet. Start scoring to see insights!</p>
                </Card>
            )}

            {/* --- DETAILED RECORDS TABLE --- */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <CardTitle>Detailed Records</CardTitle>
                    </div>
                    <CardDescription>Complete history of all your approved scores.</CardDescription>
                </CardHeader>
                <CardContent>
                    {historyScores.length === 0 ? (
                        <p className="text-center text-gray-500 py-8 italic">No records found yet.</p>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="font-semibold">Date</TableHead>
                                        <TableHead className="font-semibold">Round Type</TableHead>
                                        <TableHead className="font-semibold">Competition / Event</TableHead>
                                        <TableHead className="font-semibold text-right">Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {historyScores.map((score, idx) => (
                                        <TableRow key={score.scoreId || idx} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="text-slate-600 font-medium">
                                                {new Date(score.dateShot).toLocaleDateString()}
                                            </TableCell>
                                            {/* SỬA LỖI: Dùng roundName trực tiếp */}
                                            <TableCell className="text-slate-900">
                                                {score.roundName || "Unknown Round"}
                                            </TableCell>
                                            {/* SỬA LỖI: Dùng competitionName trực tiếp */}
                                            <TableCell className="text-slate-600">
                                                <span className="inline-flex items-center gap-1.5">
                                                    {score.competitionName ? (
                                                        <>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                            {score.competitionName}
                                                        </>
                                                    ) : (
                                                        <span className="text-slate-400 italic">Practice</span>
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold min-w-[3rem]
                                                    ${score.totalScore >= 600 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                                                    {score.totalScore}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}