import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, X, MapPin, Trophy, RefreshCcw, Settings, CheckCircle } from 'lucide-react';
import { commonAPI, Competition, Round } from '../services/api';
import { toast } from 'sonner';

// Competition rules configuration from AA Rules/PDF documents
const DIVISIONS = [
    "Recurve",
    "Compound",
    "Recurve Barebow",
    "Compound Barebow",
    "Longbow",
    "Crossbow"
];

const AGE_CLASSES = [
    "Open", "50+", "60+", "70+", "Under 21", "Under 18", "Under 16", "Under 14"
];

// Interface for the form
interface CompetitionFormData {
    compName: string;
    startDate: string;
    endDate: string;
    location: string;
    isClubChampionship: boolean;
    // Detailed data (Restrictions)
    allowedRoundIds: number[];
    allowedDivisions: string[];
    allowedClasses: string[];
}

export default function CompetitionManagement() {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [availableRounds, setAvailableRounds] = useState<Round[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCompId, setSelectedCompId] = useState<number | null>(null);

    const [formData, setFormData] = useState<CompetitionFormData>({
        compName: '', startDate: '', endDate: '', location: '',
        isClubChampionship: false,
        allowedRoundIds: [],
        allowedDivisions: [],
        allowedClasses: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [comps, rounds] = await Promise.all([
                commonAPI.getCompetitions(),
                commonAPI.getRounds()
            ]);
            setCompetitions(comps || []);
            setAvailableRounds(rounds || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    // Logic to parse JSON from DB to Form
    const handleEdit = (comp: Competition) => {
        let details = { rounds: [], divisions: [], classes: [] };
        try {
            if (comp.details) details = JSON.parse(comp.details);
        } catch (e) { console.error("JSON Parse Error", e); }

        const validDivisions = (details.divisions || []).filter((d: string) => DIVISIONS.includes(d));
        const validClasses = (details.classes || []).filter((c: string) => AGE_CLASSES.includes(c));

        // For Rounds, check if the ID still exists in availableRounds
        const validRoundIds = (details.rounds || []).filter((id: number) =>
            availableRounds.some(r => r.roundId === id)
        );

        setFormData({
            compName: comp.compName,
            startDate: comp.startDate.toString().split('T')[0],
            endDate: comp.endDate.toString().split('T')[0],
            location: comp.location || '',
            isClubChampionship: comp.isClubChampionship,
            allowedRoundIds: validRoundIds,
            allowedDivisions: validDivisions, 
            allowedClasses: validClasses     
        });
        setSelectedCompId(comp.compId);
        setIsEditing(true);
        setShowDialog(true);
    };

    // Handle Form Submit logic (Create or Update)
    const handleSubmit = async () => {
        if (!formData.compName || !formData.startDate || !formData.endDate) {
            toast.error("Event Name and Dates are required!");
            return;
        }

        setSaving(true);

        // Package configuration details into JSON
        const detailsJson = JSON.stringify({
            rounds: formData.allowedRoundIds,
            divisions: formData.allowedDivisions,
            classes: formData.allowedClasses
        });

        const payload = {
            compId: isEditing ? selectedCompId : 0,
            compName: formData.compName,
            startDate: formData.startDate,
            endDate: formData.endDate,
            location: formData.location,
            isClubChampionship: formData.isClubChampionship,
            details: detailsJson
        };

        try {
            if (isEditing && selectedCompId) {
                await commonAPI.updateCompetition(selectedCompId, payload);
                toast.success("Competition updated successfully!");
            } else {
                await commonAPI.createCompetition(payload);
                toast.success("New competition created!");
            }

            setShowDialog(false);
            resetForm();
            loadData();
        } catch (error: unknown) {
            // Replaced 'any' with 'unknown' and safe error handling
            console.error("Submit Error:", error);
            const msg = error instanceof Error ? error.message : "Unknown error";
            toast.error(`Operation failed: ${msg}`);
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setFormData({
            compName: '', startDate: '', endDate: '', location: '',
            isClubChampionship: false, allowedRoundIds: [], allowedDivisions: [], allowedClasses: []
        });
        setIsEditing(false);
        setSelectedCompId(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Permanently delete this event?")) return;
        try {
            await commonAPI.deleteCompetition(id);
            toast.success("Deleted successfully");
            loadData();
        } catch (error) {
            // Used the error variable to avoid 'unused variable' warning
            console.error("Delete failed", error);
            toast.error("Failed to delete");
        }
    };

    // Replaced 'any' with generic <T> for type safety
    const toggleItem = <T,>(list: T[], item: T) => {
        return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="w-6 h-6" /> Competition Management
                        </h2>
                        <p className="text-violet-100 text-sm mt-1">Create events, set rules, and manage formats</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={loadData} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button onClick={() => { resetForm(); setShowDialog(true); }} className="px-4 py-2 bg-white text-violet-700 font-bold rounded-lg hover:bg-slate-100 flex items-center gap-2 transition shadow-lg">
                            <Plus className="w-5 h-5" /> Create Event
                        </button>
                    </div>
                </div>

                {/* List Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading events...</div>
                    ) : competitions.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed rounded-xl">
                            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No competitions found</p>
                            <p className="text-sm text-gray-400">Create your first event to get started</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {competitions.map(comp => (
                                <CompetitionItem
                                    key={comp.compId}
                                    comp={comp}
                                    onEdit={() => handleEdit(comp)}
                                    onDelete={() => handleDelete(comp.compId)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- CREATE / EDIT DIALOG --- */}
            {showDialog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        {/* Dialog Header */}
                        <div className="p-5 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-t-2xl">
                            <div>
                                <h3 className="font-bold text-xl text-slate-800 dark:text-white">
                                    {isEditing ? 'Edit Competition Details' : 'Create New Competition'}
                                </h3>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1 font-bold">Basic Info & Strictions</p>
                            </div>
                            <button onClick={() => setShowDialog(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition"><X className="w-5 h-5" /></button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                            {/* SECTION 1: BASIC INFO */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-violet-600 uppercase tracking-wide border-b pb-2">1. Basic Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1.5">Event Name <span className="text-red-500">*</span></label>
                                        <input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none dark:bg-slate-800 dark:border-slate-600"
                                            placeholder="e.g., National Qualification Round 2025"
                                            value={formData.compName} onChange={e => setFormData({ ...formData, compName: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Start Date <span className="text-red-500">*</span></label>
                                        <input type="date" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none dark:bg-slate-800 dark:border-slate-600"
                                            value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">End Date <span className="text-red-500">*</span></label>
                                        <input type="date" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none dark:bg-slate-800 dark:border-slate-600"
                                            value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-1.5">Location / Venue</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input type="text" className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none dark:bg-slate-800 dark:border-slate-600"
                                                placeholder="e.g., 123 Main Street, City"
                                                value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 2: ROUNDS & FORMATS */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-violet-600 uppercase tracking-wide border-b pb-2 flex items-center gap-2">
                                    2. Format & Regulations <span className="text-xs font-normal text-slate-500 normal-case">(Restrictions)</span>
                                </h4>

                                <div>
                                    <label className="block text-sm font-medium mb-3">Allowed Rounds (Distances)</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {availableRounds.map(round => (
                                            <div key={round.roundId}
                                                onClick={() => setFormData(prev => ({ ...prev, allowedRoundIds: toggleItem(prev.allowedRoundIds, round.roundId) }))}
                                                className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center gap-3 select-none
                                                    ${formData.allowedRoundIds.includes(round.roundId)
                                                        ? 'bg-violet-50 border-violet-500 ring-1 ring-violet-500 shadow-sm'
                                                        : 'hover:bg-slate-50 border-slate-200'}`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                    ${formData.allowedRoundIds.includes(round.roundId) ? 'bg-violet-600 border-violet-600' : 'border-slate-300 bg-white'}`}>
                                                    {formData.allowedRoundIds.includes(round.roundId) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-800">{round.roundName}</p>
                                                    <p className="text-xs text-slate-500 truncate">{round.description || 'Standard Format'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: RESTRICTIONS (DIVISIONS & CLASSES) */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Divisions */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium block">Allowed Divisions</label>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                                            {DIVISIONS.map(div => (
                                                <label key={div} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition">
                                                    <input type="checkbox"
                                                        className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                                                        checked={formData.allowedDivisions.includes(div)}
                                                        onChange={() => setFormData(prev => ({ ...prev, allowedDivisions: toggleItem(prev.allowedDivisions, div) }))}
                                                    />
                                                    <span className="text-sm">{div}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Age Classes */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium block">Allowed Age Classes</label>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                            {AGE_CLASSES.map(cls => (
                                                <label key={cls} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition">
                                                    <input type="checkbox"
                                                        className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                                                        checked={formData.allowedClasses.includes(cls)}
                                                        onChange={() => setFormData(prev => ({ ...prev, allowedClasses: toggleItem(prev.allowedClasses, cls) }))}
                                                    />
                                                    <span className="text-sm">{cls}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Championship Toggle */}
                                <div className="mt-4 flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                    <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="isChamp" className="font-bold text-amber-900 cursor-pointer block">Official Club Championship</label>
                                        <p className="text-xs text-amber-700">Scores count towards records and seasonal rankings.</p>
                                    </div>
                                    <input type="checkbox" id="isChamp" className="w-6 h-6 text-amber-600 accent-amber-600 rounded"
                                        checked={formData.isClubChampionship} onChange={e => setFormData({ ...formData, isClubChampionship: e.target.checked })} />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-5 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-b-2xl flex gap-3 justify-end">
                            <button onClick={() => setShowDialog(false)} disabled={saving} className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={saving} className="px-8 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200 flex items-center gap-2 disabled:opacity-70">
                                {saving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : (isEditing ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
                                {isEditing ? 'Save Changes' : 'Create Event'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CompetitionItem({ comp, onEdit, onDelete }: { comp: Competition, onEdit: () => void, onDelete: () => void }) {
    const isPast = new Date(comp.endDate) < new Date();

    // Helper to display info from JSON details if available
    let detailsCount = 0;
    try {
        if (comp.details) {
            const d = JSON.parse(comp.details);
            if (d.rounds?.length) detailsCount += d.rounds.length;
        }
    } catch (error) {
        console.warn(`Could not parse details for comp ${comp.compId}:`, error);
    }

    return (
        <div className={`group border rounded-xl p-5 bg-white dark:bg-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-all ${isPast ? 'opacity-70 hover:opacity-100 bg-slate-50' : 'border-l-4 border-l-emerald-500'}`}>
            <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">{comp.compName}</h4>
                    {comp.isClubChampionship && <span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-1 rounded-md font-bold border border-amber-200 flex items-center gap-1"><Trophy className="w-3 h-3" /> Championship</span>}
                    {isPast && <span className="text-[10px] uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-1 rounded-md font-bold">Completed</span>}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(comp.startDate).toLocaleDateString()} — {new Date(comp.endDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {comp.location || 'TBA'}</span>
                    {detailsCount > 0 && <span className="flex items-center gap-1.5 text-violet-600"><Settings className="w-4 h-4" /> {detailsCount} Rounds Configured</span>}
                </div>
            </div>

            <div className="flex gap-2 self-end sm:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-100"><Edit className="w-4 h-4" /></button>
                <button onClick={onDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100"><Trash2 className="w-4 h-4" /></button>
            </div>
        </div>
    );
}