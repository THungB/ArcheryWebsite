import { useState, useEffect } from 'react';
import { X, Loader2, Target, ChevronRight, ChevronLeft, Lock } from 'lucide-react';
import { stagingScoreAPI, commonAPI, Round, Competition, Equipment, RoundStructureDto } from '../services/api';

// Dữ liệu lưu trữ điểm số: [RangeIndex][EndIndex][ArrowIndex]
type ScoreState = string[][][];

interface ScoreEntryProps {
    userId: string;
    onClose: () => void;
    onSubmit: () => void;
    // [NEW] Nhận giải đấu được chọn sẵn từ màn hình trước
    preSelectedComp?: Competition | null;
}

export default function ScoreEntry({ userId, onClose, onSubmit, preSelectedComp }: ScoreEntryProps) {
    // Default to practice mode OR the pre-selected competition
    const [competitionId, setCompetitionId] = useState<string>(
        preSelectedComp ? preSelectedComp.compId.toString() : 'practice'
    );
    const [roundId, setRoundId] = useState<string>('');
    const [equipmentId, setEquipmentId] = useState<string>('');

    const [step, setStep] = useState<'setup' | 'scoring'>('setup');
    const [roundStructure, setRoundStructure] = useState<RoundStructureDto | null>(null);

    const [currentRangeIdx, setCurrentRangeIdx] = useState(0);
    const [currentEndIdx, setCurrentEndIdx] = useState(0);
    const [scores, setScores] = useState<ScoreState>([]);

    // Danh sách đầy đủ
    const [allRounds, setAllRounds] = useState<Round[]>([]);
    const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
    const [competitionsList, setCompetitionsList] = useState<Competition[]>([]);

    // Danh sách hiển thị (đã lọc theo luật giải đấu)
    const [filteredRounds, setFilteredRounds] = useState<Round[]>([]);
    const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingStructure, setIsLoadingStructure] = useState(false);

    // 1. Load Initial Data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [r, c, e] = await Promise.all([
                    commonAPI.getRounds(),
                    commonAPI.getCompetitions(),
                    commonAPI.getEquipment()
                ]);
                setAllRounds(r);
                setCompetitionsList(c);
                setAllEquipment(e);

                // Mặc định hiển thị tất cả nếu không có giải đấu nào được chọn
                if (!preSelectedComp) {
                    setFilteredRounds(r);
                    setFilteredEquipment(e);
                }
            } catch (error) {
                console.error("Failed to load initial data", error);
            }
        };
        loadData();
    }, []); // Chỉ chạy 1 lần khi mount

    // 2. [LOGIC MỚI] Lọc danh sách & Auto-select khi competitionId thay đổi
    useEffect(() => {
        // Nếu là Practice Mode -> Cho phép chọn tất cả
        if (competitionId === 'practice') {
            setFilteredRounds(allRounds);
            setFilteredEquipment(allEquipment);
            return;
        }

        // Tìm giải đấu đang chọn (có thể là preSelectedComp hoặc chọn từ dropdown)
        const selectedComp = competitionsList.find(c => c.compId.toString() === competitionId) || preSelectedComp;

        if (selectedComp && selectedComp.details) {
            try {
                const rules = JSON.parse(selectedComp.details);

                // --- Lọc Rounds ---
                let validRounds = allRounds;
                if (rules.rounds && rules.rounds.length > 0) {
                    // Chỉ lấy các round có ID nằm trong danh sách cho phép
                    validRounds = allRounds.filter(r => rules.rounds.includes(r.roundId));
                }
                setFilteredRounds(validRounds);
                // Nếu chỉ có 1 round hợp lệ -> Tự chọn luôn
                if (validRounds.length === 1) setRoundId(validRounds[0].roundId.toString());
                else setRoundId(''); // Reset nếu có nhiều lựa chọn

                // --- Lọc Equipment ---
                let validEquipment = allEquipment;
                if (rules.divisions && rules.divisions.length > 0) {
                    // [FIX] So sánh linh hoạt hơn (Trim + Lowercase) để tránh lỗi không khớp nhẹ
                    validEquipment = allEquipment.filter(eq =>
                        rules.divisions.some((allowedDiv: string) =>
                            (allowedDiv ?? '').toString().trim().toLowerCase() === (eq.divisionType ?? '').toString().trim().toLowerCase()
                        )
                    );
                }
                setFilteredEquipment(validEquipment);
                // Nếu chỉ có 1 loại cung hợp lệ -> Tự chọn luôn
                if (validEquipment.length === 1) setEquipmentId(validEquipment[0].equipmentId.toString());
                else setEquipmentId('');

            } catch (e) {
                console.warn("Invalid rules JSON", e);
                // Fallback: hiện tất cả nếu lỗi JSON
                setFilteredRounds(allRounds);
                setFilteredEquipment(allEquipment);
            }
        } else {
            // Giải đấu cũ không có details -> Hiện tất cả
            setFilteredRounds(allRounds);
            setFilteredEquipment(allEquipment);
        }
    }, [competitionId, allRounds, allEquipment, preSelectedComp, competitionsList]);

    const handleStartScoring = async () => {
        if (!roundId || !equipmentId) return alert("Please select Round and Equipment");
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

            const compIdToSend = competitionId === 'practice' ? null : (competitionId ? parseInt(competitionId) : null);

            await stagingScoreAPI.submitScore(
                parseInt(userId),
                parseInt(roundId),
                parseInt(equipmentId),
                payloadData,
                token,
                compIdToSend
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
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-xl p-6 relative">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Scorecard</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Event Mode</label>
                            <div className="relative">
                                <select
                                    className={`w-full p-3 border rounded-lg bg-white dark:bg-slate-800 appearance-none ${preSelectedComp ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                                    value={competitionId}
                                    disabled={!!preSelectedComp} // [NEW] Khóa nếu đã chọn từ trước
                                    onChange={e => setCompetitionId(e.target.value)}
                                >
                                    <option value="practice">🎯 Practice Mode</option>
                                    <optgroup label="Official Competitions">
                                        {competitionsList.map(c => (
                                            <option key={c.compId} value={c.compId}>{c.compName}</option>
                                        ))}
                                    </optgroup>
                                </select>
                                {/* Icon khóa nếu bị disabled */}
                                {preSelectedComp && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
                            </div>
                            {competitionId !== 'practice' && (
                                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                                    <Target className="w-3 h-3" /> Rules & Equipment restricted by event.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Round (Distance)</label>
                            <select className="w-full p-3 border rounded-lg bg-white dark:bg-slate-800" value={roundId} onChange={e => setRoundId(e.target.value)}>
                                <option value="">-- Select Round --</option>
                                {filteredRounds.map(r => <option key={r.roundId} value={r.roundId}>{r.roundName}</option>)}
                            </select>
                            {filteredRounds.length === 0 && <p className="text-xs text-red-500 mt-1">No valid rounds available for this event.</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Equipment (Bow Type)</label>
                            <select className="w-full p-3 border rounded-lg bg-white dark:bg-slate-800" value={equipmentId} onChange={e => setEquipmentId(e.target.value)}>
                                <option value="">-- Select Equipment --</option>
                                {filteredEquipment.map(e => (
                                    <option key={e.equipmentId} value={e.equipmentId}>{e.divisionType}</option>
                                ))}
                            </select>
                            {filteredEquipment.length === 0 && <p className="text-xs text-red-500 mt-1">No valid equipment available for this event.</p>}
                        </div>

                        <button onClick={handleStartScoring} disabled={isLoadingStructure || !roundId || !equipmentId} className="w-full py-3.5 bg-blue-600 text-white rounded-lg font-bold mt-2 hover:bg-blue-700 flex justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoadingStructure && <Loader2 className="animate-spin" />} Start Scoring
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // (Giữ nguyên phần UI khi đang Scoring ở dưới - không thay đổi)
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
                {/* ... UI Scoring giữ nguyên ... */}
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