import { useState, useEffect } from 'react';
import { Trophy, Loader2 } from 'lucide-react'; // [FIX] Removed unused imports
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { archerAPI, PersonalBest } from '../services/api';

interface PersonalBestsProps {
    userId: string;
}

export function PersonalBests({ userId }: PersonalBestsProps) {
    const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPB = async () => {
            try {
                const data = await archerAPI.getPersonalBests(userId);
                setPersonalBests(data || []);
            } catch (error) { // [FIX] Used 'error' instead of 'err' to match console.error
                console.error("Failed to load personal bests:", error);
            } finally {
                setLoading(false);
            }
        };
        loadPB();
    }, [userId]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <CardTitle>Personal Best Scores</CardTitle>
                    </div>
                    <CardDescription>Your highest officially approved scores</CardDescription>
                </CardHeader>
                <CardContent>
                    {personalBests.length === 0 ? <p className="text-center text-gray-500">No records found yet.</p> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Round</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {personalBests.map((pb, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{pb.roundName}</TableCell>
                                        <TableCell><span className="text-blue-600 font-bold">{pb.bestScore}</span></TableCell>
                                        <TableCell>{new Date(pb.dateAchieved).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}