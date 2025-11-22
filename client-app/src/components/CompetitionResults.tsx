import { useState, useEffect } from 'react';
import { Calendar, Loader2, MapPin, Trophy, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { commonAPI, Competition } from '../services/api';

interface CompetitionResultsProps {
    userId?: string;
    onJoin?: (comp: Competition) => void;
}

export function CompetitionResults({ userId, onJoin }: CompetitionResultsProps) {
    const [upcoming, setUpcoming] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, [userId]);

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList><TabsTrigger value="upcoming">Active & Upcoming</TabsTrigger></TabsList>
            <TabsContent value="upcoming">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <CardTitle>Upcoming Competitions</CardTitle>
                        </div>
                        <CardDescription>Official events you can participate in</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcoming.length === 0 ? <p className="text-center text-gray-500">No active competitions.</p> :
                            upcoming.map((comp) => {
                                let details = { rounds: [], divisions: [] };
                                try {
                                    if (comp.details) details = JSON.parse(comp.details);
                                } catch (error) {
                                    console.warn("Failed to parse competition details", error);
                                }

                                const isActive = new Date() >= new Date(comp.startDate) && new Date() <= new Date(comp.endDate);

                                return (
                                    <div key={comp.compId} className="border rounded-xl p-5 hover:border-blue-300 transition-all bg-white dark:bg-slate-800 shadow-sm">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="font-bold text-lg text-gray-800 dark:text-white">{comp.compName}</h4>
                                                    {comp.isClubChampionship && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"><Trophy className="w-3 h-3 mr-1" /> Championship</Badge>}
                                                    {isActive && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Happening Now</Badge>}
                                                </div>

                                                <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(comp.startDate).toLocaleDateString()} - {new Date(comp.endDate).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {comp.location || 'Main Range'}</span>
                                                </div>

                                                {/* Hiển thị tóm tắt luật thi đấu */}
                                                {(details.divisions?.length > 0 || details.rounds?.length > 0) && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {details.divisions?.map((div: string) => (
                                                            <span key={div} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full border text-slate-600 dark:text-slate-300">{div}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <Button
                                                onClick={() => onJoin && onJoin(comp)}
                                                className={`shrink-0 ${isActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                                            >
                                                {isActive ? 'Shoot This Event' : 'View Details'} <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}