import { useState, useEffect } from 'react';
import { X, Check, Target, Calculator } from 'lucide-react';

interface ScoreEntryProps {
    userId: string;
    onClose: () => void;
    onSubmit: () => void;
}

export default function ScoreEntry({ userId, onClose, onSubmit }: ScoreEntryProps) {
    const [competition, setCompetition] = useState('');
    const [round, setRound] = useState('');
    const [distance, setDistance] = useState('');
    const [scores, setScores] = useState<string[]>(Array(6).fill(''));
    const [hasInvalidScore, setHasInvalidScore] = useState(false);
    const [notes, setNotes] = useState('');

    const handleScoreChange = (index: number, value: string) => {
        // Only allow empty string or numbers
        if (value === '' || /^[0-9]+$/.test(value)) {
            const numValue = value === '' ? 0 : parseInt(value, 10);
            
            // If value is empty or valid (0-60), update the score
            if (value === '' || (numValue >= 0 && numValue <= 60)) {
                const newScores = [...scores];
                newScores[index] = value;
                setScores(newScores);
                
                // Check if any score is invalid
                const invalid = newScores.some(score => {
                    const scoreNum = score === '' ? 0 : parseInt(score, 10);
                    return scoreNum < 0 || scoreNum > 60;
                });
                setHasInvalidScore(invalid);
            }
        }
    };

    // Prevent invalid key presses (e, +, -, etc.)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow: backspace, delete, tab, escape, enter, decimal point, numbers
        if (
            [
                'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
                'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
            ].includes(e.key) ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.ctrlKey === true && ['a', 'c', 'v', 'x'].includes(e.key)) ||
            // Allow: home, end
            (e.key >= '0' && e.key <= '9')
        ) {
            // let it happen, don't do anything
            return;
        }
        // Prevent the default action for all other keys
        e.preventDefault();
    };

    const calculateTotal = () => {
        return scores.reduce((sum, score) => sum + (parseInt(score) || 0), 0);
    };

    const handleSubmit = () => {
        console.log('Submitting score:', {
            userId,
            competition,
            round,
            distance,
            scores,
            total: calculateTotal(),
            notes,
        });
        onSubmit();
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, handleSubmit]);

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Target className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 id="modal-title" className="text-2xl font-bold">Submit Score</h2>
                                <p id="modal-description" className="text-blue-100 text-sm">Enter your competition score details below</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                            aria-label="Close dialog"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6">
                    {/* Competition Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                            Competition Information
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="competition" className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                    Competition *
                                </label>
                                <select
                                    id="competition"
                                    value={competition}
                                    onChange={(e) => setCompetition(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="">Select competition</option>
                                    <option value="spring-championship">Spring Championship 2024</option>
                                    <option value="indoor-open">Indoor Open</option>
                                    <option value="summer-series">Summer Series Round 3</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="round" className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                    Round Type *
                                </label>
                                <select
                                    id="round"
                                    value={round}
                                    onChange={(e) => setRound(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="">Select round</option>
                                    <option value="720">720 Round</option>
                                    <option value="1440">1440 Round</option>
                                    <option value="fita">FITA Round</option>
                                    <option value="wa">WA 70m Round</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="distance" className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Distance *
                            </label>
                            <select
                                id="distance"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">Select distance</option>
                                <option value="18m">18 meters</option>
                                <option value="30m">30 meters</option>
                                <option value="50m">50 meters</option>
                                <option value="70m">70 meters</option>
                                <option value="90m">90 meters</option>
                            </select>
                        </div>
                    </div>

                    {/* End Scores */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <div className="w-1 h-5 bg-green-600 rounded-full"></div>
                                End Scores (6 ends)
                            </h3>
                            <span className={`text-sm ${hasInvalidScore ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                                Enter 0-60 points per end{hasInvalidScore ? ' (invalid score)' : ''}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {scores.map((score, index) => (
                                <div key={index} className="space-y-2">
                                    <label
                                        htmlFor={`end-${index + 1}`}
                                        className="text-xs font-medium text-gray-600 dark:text-gray-400 block text-center"
                                    >
                                        End {index + 1}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id={`end-${index + 1}`}
                                            type="number"
                                            min="0"
                                            max="60"
                                            value={score}
                                            onChange={(e) => handleScoreChange(index, e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className={`w-full px-3 py-3 text-center text-lg font-semibold border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 ${
                                                hasInvalidScore && scores[index] ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'
                                            }`}
                                            placeholder="0"
                                            inputMode="numeric"
                                            aria-label={`Score for end ${index + 1}`}
                                            aria-invalid={hasInvalidScore}
                                            maxLength={2}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Score Display */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <Calculator className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Score</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">Sum of all ends</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{calculateTotal()}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">out of 360</p>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                            Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes about this score (weather conditions, equipment used, etc.)"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                            rows={3}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!competition || !round || !distance || scores.every(s => !s)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Submit Score
                        </button>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <p>Your score will be sent to the recorder for approval</p>
                    </div>
                </div>
            </div>
        </div>
    );
}