import { useState, useEffect, useRef } from 'react';
import { X, Check, Calculator, Loader2, Target } from 'lucide-react'; // Đã thêm Target
import { stagingScoreAPI, commonAPI, Round, Competition } from '../services/api';

interface ScoreEntryProps {
    userId: string;
    onClose: () => void;
    onSubmit: () => void;
}

export default function ScoreEntry({ userId, onClose, onSubmit }: ScoreEntryProps) {
    // State
    const [competition, setCompetition] = useState('');
    const [round, setRound] = useState('');
    const [equipment, setEquipment] = useState('');

    // 6 ô input cho 6 mũi tên
    const [arrows, setArrows] = useState<string[]>(['', '', '', '', '', '']);

    // Ref để điều khiển focus chuyển ô khi nhấn Enter
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Data loading state
    const [activeRounds, setActiveRounds] = useState<Round[]>([]);
    const [competitionsList, setCompetitionsList] = useState<Competition[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Load data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roundsData, competitionsData] = await Promise.all([
                    commonAPI.getRounds(),
                    commonAPI.getCompetitions()
                ]);
                setActiveRounds(roundsData);
                setCompetitionsList(competitionsData);
            } catch (err) {
                console.error(err);
                setError("Failed to load data.");
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);

    // Xử lý thay đổi giá trị input
    const handleArrowChange = (index: number, value: string) => {
        // Chỉ cho phép nhập số, X, M (không phân biệt hoa thường)
        const cleanValue = value.toUpperCase();

        // Validate: Chỉ cho phép 1-2 ký tự, là số hoặc X, M
        if (cleanValue === '' || /^(10|[0-9]|X|M)$/.test(cleanValue)) {
            const newArrows = [...arrows];
            newArrows[index] = cleanValue;
            setArrows(newArrows);

            // UX: Nếu nhập X, M hoặc 10 -> Tự động nhảy sang ô tiếp theo
            if ((cleanValue === 'X' || cleanValue === 'M' || cleanValue === '10') && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    // Xử lý phím Enter để nhảy ô
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
        // Xử lý nút Backspace khi ô trống -> lùi lại ô trước
        if (e.key === 'Backspace' && arrows[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Tính tổng điểm
    const calculateTotal = () => {
        return arrows.reduce((sum, val) => {
            if (val === 'X') return sum + 10; // X tính là 10
            if (val === 'M' || val === '') return sum; // M tính là 0
            return sum + parseInt(val, 10);
        }, 0);
    };

    const handleSubmit = async () => {
        setError('');
        setIsSubmitting(true);
        try {
            if (!competition || !round || !equipment) throw new Error('Please fill all required fields (*)');
            if (arrows.some(a => a === '')) throw new Error('Please enter scores for all 6 arrows');

            const token = localStorage.getItem('authToken') || 'dummy-token';

            await stagingScoreAPI.submitScore(
                parseInt(userId) || 1,
                parseInt(round),
                parseInt(equipment),
                arrows, // Gửi mảng chi tiết ["9", "10", "X"...]
                token
            );

            onSubmit();
            onClose();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to submit';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // Modal Overlay
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">

            {/* Card Container - Giống hệt hình ảnh */}
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header Xanh Dương */}
                <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white/20 rounded-full">
                            <Target className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold">Submit Score</h2>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    {isLoadingData ? (
                        <div className="py-10 text-center text-gray-500 flex flex-col items-center">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                            <p>Loading details...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">

                            {/* Row 1: Competition & Round */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Competition <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={competition}
                                        onChange={e => setCompetition(e.target.value)}
                                        className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Select competition</option>
                                        {competitionsList.map(c => (
                                            <option key={c.compId} value={c.compId}>{c.compName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Round Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={round}
                                        onChange={e => setRound(e.target.value)}
                                        className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="">Select round</option>
                                        {activeRounds.map(r => (
                                            <option key={r.roundId} value={r.roundId}>{r.roundName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 2: Equipment */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Equipment <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={equipment}
                                    onChange={e => setEquipment(e.target.value)}
                                    className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Select equipment type</option>
                                    <option value="1">Recurve</option>
                                    <option value="2">Compound</option>
                                    <option value="3">Barebow</option>
                                </select>
                            </div>

                            {/* Row 3: Score Inputs */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    End Scores (Inputs: 0-10, X, M)
                                </label>
                                <div className="grid grid-cols-6 gap-3">
                                    {arrows.map((val, idx) => (
                                        <input
                                            key={idx}
                                            ref={(el) => { inputRefs.current[idx] = el; }}
                                            type="text"
                                            value={val}
                                            onChange={e => handleArrowChange(idx, e.target.value)}
                                            onKeyDown={e => handleKeyDown(idx, e)}
                                            placeholder="-"
                                            className={`
                                                h-12 sm:h-14 w-full text-center rounded-lg border text-xl font-bold outline-none transition-all
                                                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                                ${val === 'X' || val === '10' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' : ''}
                                                ${val === 'M' ? 'text-gray-400 bg-gray-50' : ''}
                                                ${!val && 'bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600'}
                                            `}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Total Score Display */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-md">
                                        <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                    </div>
                                    <span className="font-semibold text-gray-700 dark:text-gray-200">Total Score</span>
                                </div>
                                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {calculateTotal()}
                                </span>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                                    {error}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-slate-800/50">
                    <button
                        onClick={onClose}
                        className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Submit Score</>}
                    </button>
                </div>
            </div>
        </div>
    );
}