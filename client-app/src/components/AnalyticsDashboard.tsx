import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BrainCircuit, Loader2, Sparkles, Microscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { archerAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#9333ea', '#0891b2'];

export function AnalyticsDashboard({ userId }: { userId: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // AI State
    const [aiAdvice, setAiAdvice] = useState<string>("");
    const [aiLoading, setAiLoading] = useState(false);
    const [selectedRoundAI, setSelectedRoundAI] = useState<string>("all");
    const [isDeepAnalysis, setIsDeepAnalysis] = useState(false);

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

            // Lọc dữ liệu thống kê dựa trên dropdown
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let statsContext = data.statsByRound;
            if (selectedRoundAI !== 'all') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                statsContext = data.statsByRound.filter((r: any) => r.roundName === selectedRoundAI);
            }

            const prompt = `
                As an expert Archery Coach, analyze the following performance data: ${JSON.stringify(statsContext)}
                
                **User Request:**
                Mode: ${isDeepAnalysis ? "DEEP TECHNICAL ANALYSIS" : "General Overview"}
                Scope: ${selectedRoundAI === 'all' ? "Comparing All Round Types" : selectedRoundAI}
                
                **Instructions:**
                1. Use standard Markdown formatting. Do NOT use '***'. Use '**' for bold.
                2. If scope is 'All Round Types', YOU MUST CREATE A MARKDOWN TABLE comparing Average Score, Personal Best, and Consistency/Trend between the different rounds.
                3. ${isDeepAnalysis
                    ? "Provide specific technical drills based on the consistency rating. Explain 'why' the scores might be fluctuating."
                    : "Provide 3 concise bullet points on performance trends and a short summary."}
                4. Keep the tone encouraging but professional.
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
            setAiAdvice("Could not connect to AI Coach.");
        } finally {
            setAiLoading(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
    if (!data || !data.hasData) return <div className="text-center p-8 text-gray-500">Chưa có dữ liệu để phân tích.</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* 1. Biểu đồ đa tuyến (Multi-line Chart) */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Tiến độ điểm số (Theo loại vòng bắn)</CardTitle>
                    <CardDescription>So sánh phong độ qua từng thể loại giải đấu/tập luyện</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.history} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} padding={{ left: 20, right: 20 }} />
                            <YAxis domain={['auto', 'auto']} width={40} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                labelStyle={{ fontWeight: 'bold', color: '#333' }}
                            />
                            <Legend verticalAlign="top" height={36} />

                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {data.roundTypes.map((round: string, idx: number) => (
                                <Line
                                    key={round}
                                    type="monotone"
                                    dataKey={round}
                                    stroke={COLORS[idx % COLORS.length]}
                                    strokeWidth={3}
                                    connectNulls={true}
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 7 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 2. Biểu đồ cột chồng (Stacked Bar Chart) */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Phân bố điểm số</CardTitle>
                    <CardDescription>Tần suất điểm số đạt được theo từng loại vòng</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.distribution} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} width={30} />
                            <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px' }} />
                            <Legend verticalAlign="top" height={36} />

                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {data.roundTypes.map((round: string, idx: number) => (
                                <Bar
                                    key={round}
                                    dataKey={round}
                                    stackId="a"
                                    fill={COLORS[idx % COLORS.length]}
                                    radius={idx === data.roundTypes.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 3. AI Coach Section */}
            <Card className="bg-slate-900 text-white shadow-xl overflow-hidden border-none">
                <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                <CardHeader className="pb-2 relative z-10">
                    <div className="flex items-center gap-2 text-blue-400">
                        <BrainCircuit className="w-6 h-6" />
                        <CardTitle className="text-white">AI Performance Analyst</CardTitle>
                    </div>
                    <CardDescription className="text-slate-400">
                        Hệ thống sẽ tự động lập bảng so sánh nếu bạn chọn chế độ "Tất cả".
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4">

                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/3">
                            <label className="text-xs text-slate-400 mb-1.5 block font-medium">Phạm vi phân tích</label>
                            <Select value={selectedRoundAI} onValueChange={setSelectedRoundAI}>
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-10">
                                    <SelectValue placeholder="Select Round" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    <SelectItem value="all">Tất cả (So sánh các giải)</SelectItem>
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {data.roundTypes.map((r: string) => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full md:w-auto">
                            <Button
                                variant={isDeepAnalysis ? "default" : "secondary"}
                                onClick={() => setIsDeepAnalysis(!isDeepAnalysis)}
                                className={`w-full h-10 gap-2 border ${isDeepAnalysis ? 'bg-purple-600 hover:bg-purple-700 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                            >
                                <Microscope className="w-4 h-4" />
                                {isDeepAnalysis ? "Chế độ: Chi tiết & Kỹ thuật" : "Chế độ: Tổng quan"}
                            </Button>
                        </div>

                        <Button
                            onClick={generateAiAnalysis}
                            disabled={aiLoading}
                            className="w-full md:flex-1 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg"
                        >
                            {aiLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> AI đang lập bảng...</> : 'Phân tích ngay'}
                        </Button>
                    </div>

                    {/* Hiển thị kết quả AI với ReactMarkdown */}
                    {aiAdvice && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 bg-slate-800/50 p-5 rounded-xl border border-slate-700 mt-4">
                            <div className="flex items-center gap-2 mb-4 text-yellow-400 font-semibold border-b border-slate-700/50 pb-2">
                                <Sparkles className="w-4 h-4" /> Kết quả phân tích từ Coach AI:
                            </div>

                            {/* Khu vực render Markdown với custom components đã FIX lỗi TS */}
                            <div className="prose prose-invert max-w-none text-sm text-slate-300">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Sử dụng 'as any' để bỏ qua lỗi type 'ref' của HTML element
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                        table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="w-full border-collapse border border-slate-600 text-left" {...props as any} /></div>,
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                        thead: ({ node, ...props }) => <thead className="bg-slate-700/50 text-slate-200" {...props as any} />,
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                        tbody: ({ node, ...props }) => <tbody {...props as any} />,
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                        tr: ({ node, ...props }) => <tr className="border-b border-slate-700 hover:bg-slate-800/50" {...props as any} />,
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                        th: ({ node, ...props }) => <th className="border border-slate-600 p-3 font-bold" {...props as any} />,
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                        td: ({ node, ...props }) => <td className="border border-slate-600 p-3" {...props as any} />,
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside my-2 space-y-1" {...props as any} />,
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                        strong: ({ node, ...props }) => <span className="font-bold text-yellow-200" {...props as any} />,
                                    }}
                                >
                                    {aiAdvice}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}