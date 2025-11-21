import { useState, useEffect } from 'react';
// [FIX] Đã thêm ChevronRight, ChevronLeft vào import để sửa lỗi "Cannot find name"
import { X, Loader2, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import { stagingScoreAPI, commonAPI, Round, Competition, Equipment, RoundStructureDto } from '../services/api';

// Dữ liệu lưu trữ điểm số: [RangeIndex][EndIndex][ArrowIndex]
type ScoreState = string[][][];

interface ScoreEntryProps {
    userId: string;
    onClose: () => void;
    onSubmit: () => void;
}

export default function ScoreEntry({ userId, onClose, onSubmit }: ScoreEntryProps) {
    const [competitionId, setCompetitionId] = useState('');
    const [roundId, setRoundId] = useState('');
    const [equipmentId, setEquipmentId] = useState('');

    const [step, setStep] = useState<'setup' | 'scoring'>('setup');
    const [roundStructure, setRoundStructure] = useState<RoundStructureDto | null>(null);

    const [currentRangeIdx, setCurrentRangeIdx] = useState(0);
    const [currentEndIdx, setCurrentEndIdx] = useState(0);
    const [scores, setScores] = useState<ScoreState>([]);

    const [roundsList, setRoundsList] = useState<Round[]>([]);
    const [competitionsList, setCompetitionsList] = useState<Competition[]>([]);
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingStructure, setIsLoadingStructure] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [r, c, e] = await Promise.all([
                    commonAPI.getRounds(),
                    commonAPI.getCompetitions(),
                    commonAPI.getEquipment()
                ]);
                setRoundsList(r);
                setCompetitionsList(c);
                setEquipmentList(e);
            } catch (error) {
                console.error("Failed to load initial data", error);
            }
        };
        loadData();
    }, []);

    const handleStartScoring = async () => {
        if (!competitionId || !roundId || !equipmentId) return alert("Please fill all fields");
        setIsLoadingStructure(true);
        try {
            const structure = await commonAPI.getRoundStructure(parseInt(roundId));
            if (!structure || !structure.ranges.length) {
                alert("Error: This round has no range configuration.");
                return;
            }
            setRoundStructure(structure);
            const initialScores = structure.ranges.map(range =>
                Array(range.endCount).fill(null).map(() => Array(range.arrowsPerEnd).fill(''))
            );
            setScores(initialScores);
            setStep('scoring');
        } catch (error) {
            console.error(error);
            alert("Failed to load round configuration.");
        } finally {
            setIsLoadingStructure(false);
        }
    };

    const handleArrowChange = (idx: number, val: string) => {
        const cleanVal = val.toUpperCase();
        if (!/^(10|[0-9]|X|M)?$/.test(cleanVal)) return;
        setScores(prev => {
            const next = [...prev];
            next[currentRangeIdx] = [...prev[currentRangeIdx]];
            next[currentRangeIdx][currentEndIdx] = [...prev[currentRangeIdx][currentEndIdx]];
            next[currentRangeIdx][currentEndIdx][idx] = cleanVal;
            return next;
        });
    };

    const currentRange = roundStructure?.ranges[currentRangeIdx];
    const currentArrows = scores[currentRangeIdx]?.[currentEndIdx] || [];
    const isEndComplete = currentArrows.every(a => a !== '');

    const handleNext = () => {
        if (!currentRange || !roundStructure) return;
        if (!isEndComplete) return alert("Please enter all arrows.");

        if (currentEndIdx < currentRange.endCount - 1) {
            setCurrentEndIdx(prev => prev + 1);
        } else if (currentRangeIdx < roundStructure.ranges.length - 1) {
            setCurrentRangeIdx(prev => prev + 1);
            setCurrentEndIdx(0);
        } else {
            submitFinalScore();
        }
    };

    const handleBack = () => {
        if (!roundStructure) return;

        if (currentEndIdx > 0) {
            setCurrentEndIdx((prev) => prev - 1);
        } else if (currentRangeIdx > 0) {
            setCurrentRangeIdx((prev) => prev - 1);
            setCurrentEndIdx(roundStructure.ranges[currentRangeIdx - 1].endCount - 1);
        } else {
            setStep('setup');
        }
    };

    const submitFinalScore = async () => {
        if (!roundStructure) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('authToken') || '';
            const payloadData = roundStructure.ranges.map((range, idx) => ({
                rangeId: range.rangeId,
                ends: scores[idx]
            }));
            await stagingScoreAPI.submitScore(parseInt(userId), parseInt(roundId), parseInt(equipmentId), payloadData, token);
            onSubmit();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to submit score");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === 'setup') {
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">New Scorecard</h2>
                        <button onClick={onClose}><X className="w-6 h-6" /></button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Competition</label>
                            <select className="w-full p-2 border rounded-lg bg-transparent" value={competitionId} onChange={e => setCompetitionId(e.target.value)}>
                                <option value="">Select...</option>
                                {competitionsList.map(c => <option key={c.compId} value={c.compId}>{c.compName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Round</label>
                            <select className="w-full p-2 border rounded-lg bg-transparent" value={roundId} onChange={e => setRoundId(e.target.value)}>
                                <option value="">Select...</option>
                                {roundsList.map(r => <option key={r.roundId} value={r.roundId}>{r.roundName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Equipment</label>
                            <select className="w-full p-2 border rounded-lg bg-transparent" value={equipmentId} onChange={e => setEquipmentId(e.target.value)}>
                                <option value="">Select...</option>
                                {equipmentList.map(e => (
                                    <option key={e.equipmentId} value={e.equipmentId}>{e.divisionType}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleStartScoring} disabled={isLoadingStructure} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold mt-4 hover:bg-blue-700 flex justify-center gap-2">
                            {isLoadingStructure && <Loader2 className="animate-spin" />} Start Scoring
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl">
                    <div>
                        <h2 className="font-bold text-lg">{roundStructure?.roundName}</h2>
                        <p className="text-sm text-blue-100 flex items-center gap-2">
                            <span>Dist: {currentRange?.distanceMeters}m</span>
                            <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
                            <Target className="w-3 h-3" />
                            <span>Face: {currentRange?.faceSizeCm}cm</span>
                            <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
                            <span>End {currentEndIdx + 1}/{currentRange?.endCount}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">
                            {scores.flat(2).reduce((sum, v) => {
                                if (v === 'X' || v === '10') return sum + 10;
                                if (v === 'M' || v === '') return sum;
                                return sum + parseInt(v);
                            }, 0)}
                        </div>
                        <span className="text-xs opacity-80">TOTAL</span>
                    </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8">
                        {currentArrows.map((val, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <span className="text-xs text-gray-500 font-medium">Arr {idx + 1}</span>
                                <input type="text" value={val} onChange={(e) => handleArrowChange(idx, e.target.value)}
                                    className={`w-full aspect-square text-center text-2xl font-bold border-2 rounded-xl focus:ring-4 focus:ring-blue-200 outline-none
                                        ${val === '10' || val === 'X' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' : val === 'M' ? 'bg-gray-100 border-gray-300 text-gray-400' : 'dark:bg-slate-800'}`}
                                    placeholder="-" />
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-gray-500">Range {currentRangeIdx + 1} of {roundStructure?.ranges.length}</p>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between bg-gray-50 dark:bg-slate-800 rounded-b-xl">
                    <button onClick={handleBack} className="px-6 py-3 flex items-center gap-2 font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition">
                        <ChevronLeft className="w-5 h-5" /> Back
                    </button>
                    <button onClick={handleNext} disabled={!isEndComplete || isSubmitting} className={`px-8 py-3 flex items-center gap-2 font-bold text-white rounded-lg transition shadow-lg ${isEndComplete ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}>
                        {isSubmitting ? '...' : (roundStructure && currentRangeIdx === roundStructure.ranges.length - 1 && currentEndIdx === currentRange!.endCount - 1 ? 'Finish' : 'Next')} {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}