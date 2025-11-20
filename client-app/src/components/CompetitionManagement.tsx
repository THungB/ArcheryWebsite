import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Users, Target, X, MapPin, Trophy } from 'lucide-react';

// [QUAN TRỌNG] Interface định nghĩa kiểu dữ liệu để tránh lỗi "Unexpected any"
interface Competition {
    id: number;
    name: string;
    status: 'active' | 'upcoming' | 'completed';
    date: string;
    roundType: string;
    distance: string;
    participants: number;
    maxParticipants: number;
    location: string;
    isClubChampionship: boolean;
}

export default function CompetitionManagement() {
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    // State form nhập liệu
    const [newCompetition, setNewCompetition] = useState({
        name: '',
        date: '',
        location: '',
        roundType: '',
        distance: '',
        maxParticipants: '',
        description: '',
        isClubChampionship: false // Trường này bắt buộc có để khớp kiểu
    });

    // [FIX] Dùng Competition[] thay vì any[]
    const competitions: Competition[] = [];

    const handleCreate = () => {
        console.log('Creating competition:', newCompetition);

        // TODO: Gọi API backend tại đây

        setShowCreateDialog(false);

        // Reset form về mặc định
        setNewCompetition({
            name: '',
            date: '',
            location: '',
            roundType: '',
            distance: '',
            maxParticipants: '',
            description: '',
            isClubChampionship: false
        });
    };

    const getStatusBadge = (status: 'active' | 'upcoming' | 'completed') => {
        switch (status) {
            case 'active': return <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">Active</span>;
            case 'upcoming': return <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">Upcoming</span>;
            case 'completed': return <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">Completed</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-violet-700 dark:from-purple-700 dark:to-violet-800 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Competition Management</h2>
                            <p className="text-purple-100 text-sm mt-1">Create and manage archery competitions</p>
                        </div>
                        <button onClick={() => setShowCreateDialog(true)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2 font-medium">
                            <Plus className="w-4 h-4" /> New Competition
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {competitions.length === 0 ? (
                        <div className="text-center py-8"><p className="text-gray-600 dark:text-gray-400">No competitions found.</p></div>
                    ) : (
                        competitions.map((comp) => (
                            <div key={comp.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-slate-800">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{comp.name}</h4>
                                            {getStatusBadge(comp.status)}
                                            {comp.isClubChampionship && (
                                                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded ml-2">
                                                    <Trophy className="w-3 h-3" /> Club Champ
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>{comp.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Target className="w-4 h-4" />
                                                <span>{comp.roundType} - {comp.distance}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Users className="w-4 h-4" />
                                                <span>{comp.participants} / {comp.maxParticipants} participants</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <MapPin className="w-4 h-4" />
                                                <span>{comp.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        </button>
                                        <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                        <div className="bg-gradient-to-r from-purple-600 to-violet-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(comp.participants / comp.maxParticipants) * 100}%` }} />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{Math.round((comp.participants / comp.maxParticipants) * 100)}% filled</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Dialog */}
            {showCreateDialog && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-4">
                        <div className="bg-gradient-to-r from-purple-600 to-violet-700 text-white p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center gap-3"><Plus className="w-7 h-7" /> Create New Competition</h2>
                            <button onClick={() => setShowCreateDialog(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"><Target className="w-4 h-4" /><h3 className="text-lg font-semibold">Details</h3></div>

                                {/* Checkbox Club Championship */}
                                <div className="flex items-center space-x-3 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800">
                                    <input type="checkbox" id="isClubChamp" checked={newCompetition.isClubChampionship} onChange={(e) => setNewCompetition({ ...newCompetition, isClubChampionship: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                                    <label htmlFor="isClubChamp" className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2 cursor-pointer">
                                        <Trophy className="w-4 h-4 text-amber-500" /> This is a Club Championship Event
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Name *</label>
                                    <input type="text" className="w-full px-4 py-2 border rounded-lg" value={newCompetition.name} onChange={e => setNewCompetition({ ...newCompetition, name: e.target.value })} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Date *</label>
                                        <input type="date" className="w-full px-4 py-2 border rounded-lg" value={newCompetition.date} onChange={e => setNewCompetition({ ...newCompetition, date: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Location *</label>
                                        <input type="text" placeholder="Venue name" className="w-full px-4 py-2 border rounded-lg" value={newCompetition.location} onChange={e => setNewCompetition({ ...newCompetition, location: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700"><Target className="w-4 h-4" /><h3 className="text-lg font-semibold">Round Configuration</h3></div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Round Type *</label>
                                        <select className="w-full px-4 py-2 border rounded-lg" value={newCompetition.roundType} onChange={e => setNewCompetition({ ...newCompetition, roundType: e.target.value })}>
                                            <option value="">Select Round Type</option>
                                            <option value="WA720">WA 720</option>
                                            <option value="WA1440">WA 1440</option>
                                            <option value="FITA">FITA</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Distance *</label>
                                        <select className="w-full px-4 py-2 border rounded-lg" value={newCompetition.distance} onChange={e => setNewCompetition({ ...newCompetition, distance: e.target.value })}>
                                            <option value="">Select Distance</option>
                                            <option value="70m">70m</option>
                                            <option value="50m">50m</option>
                                            <option value="30m">30m</option>
                                            <option value="18m">18m</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">Max Participants *</label>
                                    <input type="number" placeholder="e.g. 64" className="w-full px-4 py-2 border rounded-lg" value={newCompetition.maxParticipants} onChange={e => setNewCompetition({ ...newCompetition, maxParticipants: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowCreateDialog(false)} className="flex-1 py-3 border rounded-lg">Cancel</button>
                                <button onClick={handleCreate} disabled={!newCompetition.name} className="flex-1 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50">Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}