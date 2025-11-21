import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { BrainCircuit, TrendingUp, Target, Activity, Loader2, Sparkles, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { archerAPI, AnalyticsData } from '../services/api';

export function AnalyticsDashboard({ userId }: { userId: string }) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [aiAdvice, setAiAdvice] = useState<string>("");
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const token = localStorage.getItem('authToken') || '';
                const result = await archerAPI.getAnalytics(userId, token);
                setData(result);
            } catch (error) {
                console.error("Failed to load analytics", error);
            } finally {
                setLoading(false);
            }
        };
        loadAnalytics();
    }, [userId]);

    const generateAiAnalysis = async () => {
        if (!data) return;
        setAiLoading(true);
        try {
            const token = localStorage.getItem('authToken') || '';
            const prompt = `
                Analyze this archer's performance:
                - Average Score: ${data.overview.averageScore}
                - Consistency (StdDev): ${data.overview.consistencyRating} (Lower is better)
                - Trend: ${data.overview.trend}
                - Recent Scores: ${data.history.slice(-3).map(h => h.score).join(', ')}
                
                Provide 3 short bullet points (format exactly like this):
                * **Technical:** [Assessment]
                * **Mental:** [Advice]
                * **Drill:** [Recommendation]
                
                Start with a short 1-sentence encouraging summary.
            `;

            const res = await fetch('http://localhost:5280/api/AI/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ archerId: parseInt(userId), message: prompt })
            });

            const result = await res.json();
            setAiAdvice(result.response);
        } catch (e) {
            console.error(e);
        } finally {
            setAiLoading(false);
        }
    };

    // Hàm render AI Response
    const renderAiResponse = (text: string) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        return (
            <div className="space-y-3">
                {lines.map((line, idx) => {
                    if (line.trim().startsWith('*')) {
                        const content = line.replace(/^\*\s*/, '');
                        const parts = content.split('**');
                        if (parts.length >= 3) {
                            return (
                                <div key={idx} className="flex gap-3 items-start bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    <span className="text-blue-400 mt-1 shrink-0">●</span>
                                    <div className="text-slate-200 leading-relaxed">
                                        <span className="font-bold text-yellow-400">{parts[1]}</span>
                                        <span>{parts[2]}</span>
                                    </div>
                                </div>
                            );
                        }
                        return <div key={idx} className="text-slate-300 flex gap-2"><span className="text-blue-400">●</span> {content}</div>;
                    }
                    return <p key={idx} className="text-slate-100 font-medium text-base mb-4 italic border-l-4 border-blue-500 pl-3">{line}</p>;
                })}
            </div>
        );
    };

    const getScoreDistribution = () => {
        if (!data) return [];
        const distribution = [
            { range: '<600', count: 0 },
            { range: '600-630', count: 0 },
            { range: '630-650', count: 0 },
            { range: '650-670', count: 0 },
            { range: '670+', count: 0 },
        ];

        data.history.forEach(h => {
            if (h.score < 600) distribution[0].count++;
            else if (h.score < 630) distribution[1].count++;
            else if (h.score < 650) distribution[2].count++;
            else if (h.score < 670) distribution[3].count++;
            else distribution[4].count++;
        });
        return distribution;
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
    if (!data || !data.hasData) return <div className="text-center p-8 text-gray-500">Not enough data for analysis. Please submit more scores.</div>;

    const distributionData = getScoreDistribution();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 1. KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Target size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Average Score</p>
                            <h3 className="text-2xl font-bold text-gray-900">{data.overview.averageScore}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600"><Activity size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Consistency (StdDev)</p>
                            <h3 className="text-2xl font-bold text-gray-900">{data.overview.consistencyRating}</h3>
                            <p className="text-xs text-gray-400">{data.overview.consistencyRating < 15 ? "Very Stable" : "Variable"}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className={`bg-gradient-to-br border-opacity-50 shadow-sm ${data.overview.trend === 'Improving' ? 'from-green-50 border-green-200' : 'from-amber-50 border-amber-200'}`}>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className={`p-3 rounded-full ${data.overview.trend === 'Improving' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Current Trend</p>
                            <h3 className="text-2xl font-bold text-gray-900">{data.overview.trend}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 2. Line Chart */}
                <Card className="shadow-md">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Score Progression</CardTitle>
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                        </div>
                        <CardDescription>Performance over last {data.overview.totalRounds} rounds</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.history} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis domain={['dataMin - 10', 'dataMax + 10']} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={30} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <ReferenceLine y={data.overview.averageScore} stroke="#fbbf24" strokeDasharray="3 3" label={{ value: 'Avg', fill: '#d97706', fontSize: 10, position: 'insideLeft' }} />
                                <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Bar Chart */}
                <Card className="shadow-md">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Score Distribution</CardTitle>
                            <BarChart3 className="w-4 h-4 text-gray-400" />
                        </div>
                        <CardDescription>Frequency of your scores in ranges</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distributionData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="range" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={20} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                                    {distributionData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 4 ? '#22c55e' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* 4. AI Coach Recommendation */}
            <Card className="bg-slate-900 text-white shadow-xl overflow-hidden border-none">
                <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                <CardHeader className="pb-2 relative z-10">
                    <div className="flex items-center gap-2 text-blue-400">
                        <BrainCircuit className="w-6 h-6" />
                        <CardTitle className="text-white">AI Performance Coach</CardTitle>
                    </div>
                    <CardDescription className="text-slate-400">
                        Personalized insights based on your consistency and trends.
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                    {aiAdvice ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2 mb-4 text-yellow-400 font-semibold bg-yellow-400/10 px-3 py-1 rounded-full w-fit">
                                <Sparkles className="w-4 h-4" /> Coach's Analysis
                            </div>
                            {renderAiResponse(aiAdvice)}
                        </div>
                    ) : (
                        <div className="h-32 flex flex-col items-center justify-center text-slate-500 text-sm italic border border-dashed border-slate-700 rounded-lg bg-slate-800/30">
                            <p>Ready to analyze your {data.overview.totalRounds} rounds of data.</p>
                        </div>
                    )}

                    <Button
                        onClick={generateAiAnalysis}
                        disabled={aiLoading}
                        className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-900/20 border-0 py-6"
                    >
                        {aiLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Data...</> : 'Analyze My Performance'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}