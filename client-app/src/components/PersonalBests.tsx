import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Award, Loader2, BarChart3, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { archerAPI } from '../services/api';
// Import thư viện vẽ biểu đồ từ recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Định nghĩa Interface cho dữ liệu Personal Best
// Đảm bảo khớp với dữ liệu trả về từ API (ArcherController)
interface PersonalBest {
    scoreId: number;
    roundName: string;
    totalScore: number;
    dateShot: string;
    competitionName?: string;
}

interface PersonalBestsProps {
    userId: string;
}

export function PersonalBests({ userId }: PersonalBestsProps) {
    const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPB = async () => {
            try {
                setLoading(true);
                // Lấy token xác thực từ localStorage
                const token = localStorage.getItem('authToken') || "dummy_token";
                
                // Gọi API lấy danh sách thành tích tốt nhất
                const data = await archerAPI.getPersonalBests(userId, token);
                
                // Cập nhật state, đảm bảo là mảng rỗng nếu data null
                setPersonalBests(data || []);
                setError(null);
            } catch (err) {
                console.error("Failed to load personal bests:", err);
                setError("Failed to load data. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadPB();
        }
    }, [userId]);

    // Hiển thị loading spinner khi đang tải dữ liệu
    if (loading) return (
        <div className="flex justify-center items-center p-12">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600 mr-2" />
            <span className="text-gray-500">Loading analytics...</span>
        </div>
    );

    // Hiển thị thông báo lỗi nếu có
    if (error) {
        return (
            <div className="p-6 border border-red-200 bg-red-50 rounded-xl text-red-600 flex flex-col items-center gap-2">
                <Target className="w-8 h-8" />
                <p className="font-medium">{error}</p>
                <p className="text-sm opacity-80">Ensure backend is running on port 5280</p>
            </div>
        );
    }

    // --- DATA SCIENCE: XỬ LÝ & TRỰC QUAN HÓA DỮ LIỆU ---

    // 1. Data Transformation: Chuyển đổi dữ liệu thô sang định dạng biểu đồ
    const chartData = personalBests.map(pb => ({
        name: pb.roundName.length > 15 ? pb.roundName.substring(0, 15) + '...' : pb.roundName, // Rút gọn tên dài
        fullName: pb.roundName,
        score: pb.totalScore,
        date: new Date(pb.dateShot).toLocaleDateString(),
    }));

    // 2. Descriptive Analytics: Tính toán các chỉ số KPI
    const highestScore = personalBests.length > 0 ? Math.max(...personalBests.map(p => p.totalScore)) : 0;
    const totalRounds = personalBests.length;
    const latestRound = personalBests.length > 0 ? personalBests[0] : null;

    return (
        <div className="space-y-8">
            {/* --- PHẦN 1: DASHBOARD PHÂN TÍCH (Data Science Visualization) --- */}
            
            {/* Chỉ hiển thị Dashboard nếu có dữ liệu */}
            {personalBests.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* BIỂU ĐỒ CỘT: So sánh hiệu suất giữa các vòng bắn */}
                    <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                <CardTitle>Performance Analytics</CardTitle>
                            </div>
                            <CardDescription>
                                Comparative analysis of your best scores across different rounds.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{fontSize: 11, fill: '#6b7280'}} 
                                        interval={0}
                                        angle={-15}
                                        textAnchor="end" 
                                    />
                                    <YAxis 
                                        tick={{fontSize: 11, fill: '#6b7280'}} 
                                        label={{ value: 'Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: 12 } }}
                                    />
                                    <Tooltip 
                                        cursor={{fill: '#f9fafb'}}
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                    />
                                    <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.score >= 600 ? '#2563eb' : '#60a5fa'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* THẺ KPI: Các chỉ số tăng trưởng quan trọng */}
                    <Card className="border-green-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <CardTitle>Growth Metrics</CardTitle>
                            </div>
                            <CardDescription>Key Performance Indicators (KPIs) derived from your data.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 h-full content-start">
                                <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 flex flex-col justify-center">
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Highest Score</p>
                                    <p className="text-4xl font-bold text-blue-700 mt-1">{highestScore}</p>
                                </div>
                                <div className="p-5 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 flex flex-col justify-center">
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Events</p>
                                    <p className="text-4xl font-bold text-green-700 mt-1">{totalRounds}</p>
                                </div>
                                <div className="col-span-2 p-5 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Latest Achievement</p>
                                            <p className="font-bold text-purple-900 text-lg mt-1">
                                                {latestRound?.roundName || "N/A"}
                                            </p>
                                            <p className="text-sm text-purple-600 mt-1 flex items-center gap-1">
                                                <span className="inline-block w-2 h-2 rounded-full bg-purple-400"></span>
                                                {latestRound ? new Date(latestRound.dateShot).toLocaleDateString() : ""}
                                            </p>
                                        </div>
                                        <div className="bg-purple-100 p-2 rounded-full">
                                            <Award className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                // Hiển thị trạng thái rỗng (Empty State) đẹp mắt hơn
                <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <BarChart3 className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No Data Available for Analysis</h3>
                        <p className="text-gray-500 max-w-sm mt-2">
                            Complete your first round and get it approved to unlock the Performance Analytics Dashboard.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* --- PHẦN 2: BẢNG DỮ LIỆU CHI TIẾT (Raw Data Table) --- */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <CardTitle>Detailed Records</CardTitle>
                    </div>
                    <CardDescription>Your complete history of officially approved scores.</CardDescription>
                </CardHeader>
                <CardContent>
                    {personalBests.length === 0 ? (
                        <p className="text-center text-gray-500 py-8 italic">No records found yet. Time to hit the range!</p>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="font-semibold">Round Type</TableHead>
                                        <TableHead className="font-semibold text-center">Score</TableHead>
                                        <TableHead className="font-semibold">Date Achieved</TableHead>
                                        <TableHead className="font-semibold">Competition / Event</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {personalBests.map((pb, idx) => (
                                        <TableRow key={idx} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="font-medium text-slate-900">{pb.roundName}</TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 min-w-[3rem]">
                                                    {pb.totalScore}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-slate-600">{new Date(pb.dateShot).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-slate-600">
                                                <span className="inline-flex items-center gap-1.5">
                                                    {pb.competitionName ? (
                                                        <>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                            {pb.competitionName}
                                                        </>
                                                    ) : (
                                                        <span className="text-slate-400 italic">Practice</span>
                                                    )}
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