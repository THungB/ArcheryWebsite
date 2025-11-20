// src/components/ScoreEntry.tsx
import { useState, useEffect } from 'react';
import { X, Check, Target, Calculator, Loader2 } from 'lucide-react';
import { stagingScoreAPI, commonAPI, Round, Competition } from '../services/api';

interface ScoreEntryProps {
    userId: string;
    onClose: () => void;
    onSubmit: () => void;
}

export default function ScoreEntry({ userId, onClose, onSubmit }: ScoreEntryProps) {
    const [competition, setCompetition] = useState('');
    const [round, setRound] = useState('');
    const [equipment, setEquipment] = useState('');
    const [scores, setScores] = useState<string[]>(Array(6).fill(''));
    const [hasInvalidScore, setHasInvalidScore] = useState(false);

    // State for data
    const [activeRounds, setActiveRounds] = useState<Round[]>([]);
    const [competitionsList, setCompetitionsList] = useState<Competition[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi song song 2 API để lấy Rounds và Competitions
                const [roundsData, competitionsData] = await Promise.all([
                    commonAPI.getRounds(),
                    commonAPI.getCompetitions()
                ]);

                setActiveRounds(roundsData);
                setCompetitionsList(competitionsData);
            } catch (err) {
                console.error("Error fetching form data:", err);
                setError("Could not load form data. Please check your connection.");
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleScoreChange = (index: number, value: string) => {
        if (value === '' || /^[0-9]+$/.test(value)) {
            const newScores = [...scores];
            newScores[index] = value;
            setScores(newScores);

            const isInvalid = newScores.some(score => {
                const scoreNum = score === '' ? 0 : parseInt(score, 10);
                return scoreNum < 0 || scoreNum > 60;
            });
            setHasInvalidScore(isInvalid);
        }
    };

    const calculateTotal = () => {
        return scores.reduce((sum, score) => sum + (parseInt(score) || 0), 0);
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            if (!competition || !round || !equipment) throw new Error('Please select competition, round, and equipment');
            if (scores.every(s => !s)) throw new Error('Please enter at least one score');
            if (hasInvalidScore) throw new Error('Please fix invalid scores before submitting');

            const token = localStorage.getItem('authToken') || 'dummy-token';

            await stagingScoreAPI.submitScore(
                parseInt(userId) || 1,
                parseInt(round),
                parseInt(equipment),
                calculateTotal(),
                token
            );

            setSuccess('Score submitted successfully! Waiting for reviewer approval...');
            setTimeout(() => { onSubmit(); onClose(); }, 1500);

        } catch (err: unknown) {
            console.error("Failed to submit score:", err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit score.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3"><Target className="w-7 h-7" /><div><h2 className="text-2xl font-bold">Submit Score</h2></div></div>
                    <button onClick={onClose}><X className="w-6 h-6" /></button>
                </div>

                <div className="p-6 space-y-6">
                    {error && <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex gap-2"><X className="w-5 h-5" /> {error}</div>}
                    {success && <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex gap-2"><Check className="w-5 h-5" /> {success}</div>}

                    {isLoadingData ? (
                        <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Competition *</label>
                                    <select value={competition} onChange={(e) => setCompetition(e.target.value)} className="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-800">
                                        <option value="">Select competition</option>
                                        {competitionsList.map(comp => (
                                            <option key={comp.compId} value={comp.compId}>{comp.compName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Round Type *</label>
                                    <select value={round} onChange={(e) => setRound(e.target.value)} className="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-800">
                                        <option value="">Select round</option>
                                        {activeRounds.map((r) => (
                                            <option key={r.roundId} value={r.roundId}>
                                                {r.roundName} {r.description ? `- ${r.description}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Equipment *</label>
                                <select value={equipment} onChange={(e) => setEquipment(e.target.value)} className="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-slate-800">
                                    <option value="">Select equipment type</option>
                                    <option value="1">Recurve</option>
                                    <option value="2">Compound</option>
                                    <option value="3">Recurve Barebow</option>
                                    <option value="4">Compound Barebow</option>
                                    <option value="5">Longbow</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">End Scores (0-60)</label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {scores.map((score, index) => (
                                <div key={index}>
                                    <input type="number" value={score} onChange={(e) => handleScoreChange(index, e.target.value)} className={`w-full px-3 py-3 text-center border-2 rounded-lg font-bold text-lg ${(parseInt(score) > 60 || parseInt(score) < 0) ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200'}`} />
                                </div>
                            ))}
                        </div>
                        {hasInvalidScore && <p className="text-xs text-red-600">Scores must be between 0 and 60.</p>}
                    </div>

                    <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg"><Calculator className="w-6 h-6 text-blue-600 dark:text-blue-300" /></div>
                            <span className="font-medium">Total Score</span>
                        </div>
                        <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{calculateTotal()}</span>
                    </div>

                    <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                        <button onClick={onClose} className="flex-1 py-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                        <button onClick={handleSubmit} disabled={isSubmitting || !competition || !round || !equipment || hasInvalidScore || scores.every(s => !s)} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><Check className="w-5 h-5" /> Submit Score</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}