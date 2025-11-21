import { useState, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { commonAPI, Competition } from '../services/api';

interface CompetitionResultsProps { userId?: string; }

export function CompetitionResults({ userId }: CompetitionResultsProps) {
    const [upcoming, setUpcoming] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // [FIX] Log userId để tránh lỗi "unused variable" của ESLint
        if (userId) console.log(`Loading competitions for user: ${userId}`);

        const loadComps = async () => {
            try {
                const data = await commonAPI.getUpcomingCompetitions();
                setUpcoming(data || []);
            } catch (error) {
                console.error("Failed to load competitions:", error);
            } finally {
                setLoading(false);
            }
        };
        loadComps();
    }, [userId]); // [FIX] Thêm userId vào dependency

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList><TabsTrigger value="upcoming">Upcoming</TabsTrigger></TabsList>
            <TabsContent value="upcoming">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <CardTitle>Upcoming Competitions</CardTitle>
                        </div>
                        <CardDescription>Official events scheduled</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcoming.length === 0 ? <p className="text-center text-gray-500">No upcoming competitions.</p> :
                            upcoming.map((comp) => (
                                <div key={comp.compId} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="mb-1 font-bold">{comp.compName}</h4>
                                            <p className="text-gray-600 text-sm">{comp.location || 'TBA'}</p>
                                        </div>
                                        {comp.isClubChampionship && <Badge className="bg-amber-100 text-amber-800">Championship</Badge>}
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                                        <span>{new Date(comp.startDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}