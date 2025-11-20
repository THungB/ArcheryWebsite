import { useState } from 'react';
import { X, Check, Target, Calculator, Loader2 } from 'lucide-react';
import { stagingScoreAPI } from '../services/api'; // Import the staging score API

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

    // Add loading and error states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const calculateTotal = () => {
        return scores.reduce((sum, score) => sum + (parseInt(score) || 0), 0);
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            // Validation
            if (!competition || !round || !equipment) {
                throw new Error('Please select competition, round, and equipment');
            }

            if (scores.every(s => !s)) {
                throw new Error('Please enter at least one score');
            }

            // Get token from localStorage
            const token = localStorage.getItem('authToken') || 'dummy-token';

            // Submit to staging score table
            await stagingScoreAPI.submitScore(
                parseInt(userId) || 1,           // archerId
                parseInt(round),                  // roundId
                parseInt(equipment),              // equipmentId
                calculateTotal(),                 // rawScore
                token
            );

            setSuccess('Score submitted successfully! Waiting for reviewer approval...');
            
            // Clear form after successful submission
            setTimeout(() => {
                onSubmit();
                onClose();
            }, 1500);

        } catch (err: any) {
            console.error("Failed to submit score:", err);
            setError(err.message || 'Failed to submit score. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-4">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Target className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Submit Score</h2>
                                <p className="text-blue-100 text-sm">Enter your competition score for approval</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 hover:bg-white/10 rounded-lg flex items-center justify-center">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                            <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                            Competition Information
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                    Competition *
                                </label>
                                <select
                                    value={competition}
                                    onChange={(e) => setCompetition(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="">Select competition</option>
                                    <option value="1">Sydney Olympic Park Open</option>
                                    <option value="2">Archery NSW State Championships</option>
                                    <option value="3">National Indoor Series</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                    Round Type *
                                </label>
                                <select
                                    value={round}
                                    onChange={(e) => setRound(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="">Select round</option>
                                    <option value="1">WA720</option>
                                    <option value="2">WA900</option>
                                    <option value="9">Indoor18</option>
                                    <option value="11">Canberra</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                                Equipment *
                            </label>
                            <select
                                value={equipment}
                                onChange={(e) => setEquipment(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">Select equipment type</option>
                                <option value="1">Recurve</option>
                                <option value="2">Compound</option>
                                <option value="3">Recurve Barebow</option>
                                <option value="4">Compound Barebow</option>
                                <option value="5">Longbow</option>
                            </select>
                        </div>
                    </div>

                    {/* Score Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <div className="w-1 h-5 bg-green-600 rounded-full"></div>
                                End Scores (6 ends, 0-60 per end)
                            </h3>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {scores.map((score, index) => (
                                <div key={index} className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600 block text-center">
                                        End {index + 1}
                                    </label>
                                    <input
                                        type="number"
                                        min="0" max="60"
                                        value={score}
                                        onChange={(e) => handleScoreChange(index, e.target.value)}
                                        className="w-full px-3 py-3 text-center text-lg font-semibold border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Score Display */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <Calculator className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Total Score</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Sum of all ends</p>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{calculateTotal()}</p>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            💡 <strong>Note:</strong> Your score will be submitted for reviewer approval. It will appear in your official record once approved.
                        </p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!competition || !round || !equipment || scores.every(s => !s) || isSubmitting || !!success}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Submit Score for Review
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}