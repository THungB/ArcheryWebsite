import { Target, Calendar, Trophy } from 'lucide-react';

interface ScoreDetailModalProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    score: any; 
    onClose: () => void;
}

export function ScoreDetailModal({ score, onClose }: ScoreDetailModalProps) {
    if (!score) return null;

    const { score: scoreInfo, ends } = score;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="bg-blue-600 p-6 text-white shrink-0 flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Target className="w-6 h-6" /> {scoreInfo.round?.roundName || "Unknown Round"}
                        </h3>
                        <div className="flex gap-4 mt-2 text-blue-100 text-sm">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(scoreInfo.dateShot).toLocaleDateString()}</span>
                            {scoreInfo.comp && <span className="flex items-center gap-1"><Trophy className="w-4 h-4" /> {scoreInfo.comp.compName}</span>}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold">{scoreInfo.totalScore}</div>
                        <div className="text-xs opacity-80 uppercase font-bold">Total Score</div>
                    </div>
                </div>

                {/* Body - Score Sheet */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-1">
                        {/* Header Row */}
                        <div className="grid grid-cols-8 gap-2 text-center text-sm font-bold text-gray-500 mb-2 px-2">
                            <div className="col-span-1 text-left">End</div>
                            <div className="col-span-6">Arrows</div>
                            <div className="col-span-1 text-right">Total</div>
                        </div>

                        {/* Ends Rows */}
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {ends.map((end: any, idx: number) => (
                            <div key={idx} className="grid grid-cols-8 gap-2 items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg px-2 transition-colors">
                                <div className="col-span-1 font-medium text-gray-900 dark:text-gray-200">
                                    #{end.endNumber}
                                </div>
                                <div className="col-span-6 flex justify-center gap-2">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {end.arrows.map((val: any, aIdx: number) => (
                                        <div key={aIdx} className={`
                                            w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm border shadow-sm
                                            ${val === 10 || val === 'X' || val === '10'
                                                ? 'bg-yellow-400 text-yellow-900 border-yellow-500'
                                                : val >= 9
                                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                                    : val >= 7
                                                        ? 'bg-red-100 text-red-800 border-red-300'
                                                        : val >= 5
                                                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                                                            : 'bg-gray-100 text-gray-600 border-gray-300'}
                                        `}>
                                            {val === 0 ? 'M' : val}
                                        </div>
                                    ))}
                                </div>
                                <div className="col-span-1 text-right font-bold text-blue-600 dark:text-blue-400">
                                    {end.endScore}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 dark:bg-slate-800 shrink-0 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition shadow-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}