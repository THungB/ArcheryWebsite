import { useState, useEffect } from 'react';
// [FIX] Đã xóa FileText khỏi import vì không dùng
import { Shield, Activity, Database, Users, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { dashboardAPI, SystemLog, SystemStats } from '../services/api';

export function AdminPanel() {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [fetchedStats, fetchedLogs] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getLogs()
            ]);
            setStats(fetchedStats);
            setLogs(fetchedLogs);
        } catch (error) {
            console.error("Failed to load admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getLogLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'error': return 'bg-red-100 text-red-800 border-red-200';
            case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8" />
                        <h2 className="text-2xl font-bold">Administrator Panel</h2>
                    </div>
                    <p className="text-purple-100">Live System Monitoring</p>
                </div>
                <Button variant="secondary" size="sm" onClick={loadData} disabled={loading}>
                    <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Archers</p>
                                <h3 className="text-2xl font-bold">{stats?.totalUsers || 0}</h3>
                            </div>
                            <Users className="text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Active Competitions</p>
                                <h3 className="text-2xl font-bold">{stats?.activeCompetitions || 0}</h3>
                            </div>
                            <Activity className="text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Scores</p>
                                <h3 className="text-2xl font-bold">{stats?.totalScores || 0}</h3>
                            </div>
                            <Database className="text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Pending Approvals</p>
                                <h3 className="text-2xl font-bold">{stats?.pendingApprovals || 0}</h3>
                            </div>
                            <AlertTriangle className="text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Logs */}
            <Tabs defaultValue="logs">
                <TabsList>
                    <TabsTrigger value="logs">System Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="logs">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            {/* [FIX] Đã thêm CardDescription vào đây để sử dụng biến import */}
                            <CardDescription>Real-time log of system events and user actions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] border rounded-lg p-4">
                                {logs.length === 0 ? <p className="text-center text-gray-500">No logs found.</p> : (
                                    <div className="space-y-3">
                                        {logs.map((log) => (
                                            <div key={log.logId} className="p-3 border rounded bg-slate-50 hover:bg-white transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex gap-3">
                                                        <Badge variant="outline" className={getLogLevelColor(log.level)}>
                                                            {log.level.toUpperCase()}
                                                        </Badge>
                                                        <div>
                                                            <p className="font-medium text-sm">{log.action}</p>
                                                            <p className="text-xs text-gray-500">{log.details}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                                                        <p className="text-xs text-gray-400">User: {log.user}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}