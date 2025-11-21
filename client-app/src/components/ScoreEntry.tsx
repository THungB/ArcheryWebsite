import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react'; // Đã bỏ Check, Target
import { stagingScoreAPI, commonAPI, Round, Competition } from '../services/api';

// Interface cho cấu trúc vòng đấu (nhận từ API)
interface RangeStructure {
    sequenceNumber: number;
    rangeId: number;
    distanceMeters: number;
    endCount: number;
    arrowsPerEnd: number;
}

interface RoundStructure {
    roundId: number;
    roundName: string;
    ranges: RangeStructure[];
}

// Interface cho dữ liệu gửi đi (Payload)
interface StagedRangeInput {
    rangeId: number;
    ends: string[][];
}

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
    const [roundStructure, setRoundStructure] = useState<RoundStructure | null>(null);

    const [currentRangeIdx, setCurrentRangeIdx] = useState(0);
    const [currentEndIdx, setCurrentEndIdx] = useState(0);

    const [scores, setScores] = useState<ScoreState>([]);

    const [roundsList, setRoundsList] = useState<Round[]>([]);
    const [competitionsList, setCompetitionsList] = useState<Competition[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [r, c] = await Promise.all([commonAPI.getRounds(), commonAPI.getCompetitions()]);
                setRoundsList(r);
                setCompetitionsList(c);
            } catch (error) {
                console.error("Failed to load initial data", error);
            }
        };
        loadData();
    }, []);

    const handleStartScoring = async () => {
        if (!competitionId || !roundId || !equipmentId) return alert("Please fill all fields");

        // MOCK DATA - Thay bằng API thực tế khi backend sẵn sàng: await commonAPI.getRoundStructure(roundId)
        const structure: RoundStructure = {
            roundId: parseInt(roundId),
            roundName: "WA 720",
            ranges: [
                { sequenceNumber: 1, rangeId: 7, distanceMeters: 70, endCount: 6, arrowsPerEnd: 6 },
                { sequenceNumber: 2, rangeId: 7, distanceMeters: 70, endCount: 6, arrowsPerEnd: 6 }
            ]
        };

        setRoundStructure(structure);

        const initialScores = structure.ranges.map(range =>
            Array(range.endCount).fill(null).map(() =>
                Array(range.arrowsPerEnd).fill('')
            )
        );

        setScores(initialScores);
        setStep('scoring');
    };

    const handleArrowChange = (arrowIdx: number, value: string) => {
        const cleanVal = value.toUpperCase();
        if (!/^(10|[0-9]|X|M)?$/.test(cleanVal)) return;

        setScores(prevScores => {
            const newScores = [...prevScores];
            // Deep copy mảng con để đảm bảo tính bất biến (immutability)
            newScores[currentRangeIdx] = [...prevScores[currentRangeIdx]];
            newScores[currentRangeIdx][currentEndIdx] = [...prevScores[currentRangeIdx][currentEndIdx]];

            newScores[currentRangeIdx][currentEndIdx][arrowIdx] = cleanVal;
            return newScores;
        });
    };

    const currentRange = roundStructure?.ranges[currentRangeIdx];
    const currentArrows = scores[currentRangeIdx]?.[currentEndIdx] || [];
    const isEndComplete = currentArrows.every(a => a !== '');

    const handleNext = () => {
        if (!currentRange || !roundStructure) return;
        if (!isEndComplete) return alert("Please enter all arrows for this end.");

        if (currentEndIdx < (currentRange.endCount - 1)) {
            setCurrentEndIdx((prev) => prev + 1);
        } else if (currentRangeIdx < (roundStructure.ranges.length - 1)) {
            setCurrentRangeIdx((prev) => prev + 1);
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

            // Map dữ liệu sang đúng kiểu Interface StagedRangeInput
            const payloadData: StagedRangeInput[] = roundStructure.ranges.map((range, idx) => ({
                rangeId: range.rangeId,
                ends: scores[idx]
            }));

            await stagingScoreAPI.submitScore(
                parseInt(userId),
                parseInt(roundId),
                parseInt(equipmentId),
                payloadData,
                token
            );

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
                            <select className="w-full p-2 border rounded-lg bg-transparent"
                                value={competitionId} onChange={e => setCompetitionId(e.target.value)}>
                                <option value="">Select...</option>
                                {competitionsList.map(c => <option key={c.compId} value={c.compId}>{c.compName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Round</label>
                            <select className="w-full p-2 border rounded-lg bg-transparent"
                                value={roundId} onChange={e => setRoundId(e.target.value)}>
                                <option value="">Select...</option>
                                {roundsList.map(r => <option key={r.roundId} value={r.roundId}>{r.roundName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Equipment</label>
                            <select className="w-full p-2 border rounded-lg bg-transparent"
                                value={equipmentId} onChange={e => setEquipmentId(e.target.value)}>
                                <option value="">Select...</option>
                                <option value="1">Recurve</option>
                                <option value="2">Compound</option>
                                <option value="3">Barebow</option>
                            </select>
                        </div>
                        <button onClick={handleStartScoring} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold mt-4 hover:bg-blue-700 transition">
                            Start Scoring
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
                        <p className="text-sm text-blue-100">
                            Distance: {currentRange?.distanceMeters}m | End {currentEndIdx + 1} / {currentRange?.endCount}
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
                                <span className="text-xs text-gray-500 font-medium">Arrow {idx + 1}</span>
                                <input
                                    type="text"
                                    value={val}
                                    onChange={(e) => handleArrowChange(idx, e.target.value)}
                                    className={`w-full aspect-square text-center text-2xl font-bold border-2 rounded-xl focus:ring-4 focus:ring-blue-200 outline-none transition-all
                                        ${val === '10' || val === 'X' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' :
                                            val === 'M' ? 'bg-gray-100 border-gray-300 text-gray-400' :
                                                'border-gray-200 dark:border-gray-700 dark:bg-slate-800'}
                                    `}
                                    placeholder="-"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${((currentRangeIdx * (currentRange?.endCount || 0) + currentEndIdx + 1) / ((roundStructure?.ranges.length || 1) * (currentRange?.endCount || 1))) * 100}%` }}>
                        </div>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                        Range {currentRangeIdx + 1} of {roundStructure?.ranges.length}
                    </p>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between bg-gray-50 dark:bg-slate-800 rounded-b-xl">
                    <button onClick={handleBack} className="px-6 py-3 flex items-center gap-2 font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition">
                        <ChevronLeft className="w-5 h-5" /> Back
                    </button>
                    <button onClick={handleNext} disabled={!isEndComplete || isSubmitting}
                        className={`px-8 py-3 flex items-center gap-2 font-bold text-white rounded-lg transition shadow-lg
                            ${isEndComplete ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : 'bg-gray-300 cursor-not-allowed dark:bg-slate-600'}
                        `}>
                        {isSubmitting ? 'Submitting...' :
                            (roundStructure && currentRangeIdx === roundStructure.ranges.length - 1 && currentEndIdx === currentRange!.endCount - 1)
                                ? 'Finish & Submit' : 'Next End'}
                        {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}