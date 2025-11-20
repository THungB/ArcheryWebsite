import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Users, Target, X, MapPin } from 'lucide-react';

export default function CompetitionManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCompetition, setNewCompetition] = useState({
    name: '',
    date: '',
    location: '',
    roundType: '',
    distance: '',
    maxParticipants: '',
      description: '',
      isClubChampionship: false
  });

  // Competitions will be loaded from backend - for now empty array
  const competitions: any[] = [];

  const handleCreate = () => {
    console.log('Creating competition:', newCompetition);
    setShowCreateDialog(false);
    setNewCompetition({
      name: '',
      date: '',
      location: '',
      roundType: '',
      distance: '',
      maxParticipants: '',
      description: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">Active</span>;
      case 'upcoming':
        return <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">Upcoming</span>;
      case 'completed':
        return <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-700 dark:from-purple-700 dark:to-violet-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Competition Management</h2>
              <p className="text-purple-100 text-sm mt-1">Create and manage archery competitions</p>
            </div>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              New Competition
            </button>
          </div>
        </div>

        {/* Competitions List */}
        <div className="p-6 space-y-4">
          {competitions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No competitions found. Create your first competition using the button above.</p>
            </div>
          ) : (
            competitions.map((comp) => (
              <div key={comp.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{comp.name}</h4>
                      {getStatusBadge(comp.status)}
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
                {/* Progress Bar */}
                <div className="relative">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-violet-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(comp.participants / comp.maxParticipants) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    {Math.round((comp.participants / comp.maxParticipants) * 100)}% filled
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Competition Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-4">
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-purple-600 to-violet-700 dark:from-purple-700 dark:to-violet-800 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Plus className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Create New Competition</h2>
                    <p className="text-purple-100 text-sm">Set up a new archery competition event</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCreateDialog(false)}
                  className="w-10 h-10 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dialog Content */}
            <div className="p-6 space-y-6">
              {/* Competition Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Competition Details</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                    Competition Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Spring Championship 2025"
                    value={newCompetition.name}
                    onChange={(e) => setNewCompetition({ ...newCompetition, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={newCompetition.date}
                      onChange={(e) => setNewCompetition({ ...newCompetition, date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Venue name"
                      value={newCompetition.location}
                      onChange={(e) => setNewCompetition({ ...newCompetition, location: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Round Configuration Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Round Configuration</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                      Round Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newCompetition.roundType}
                      onChange={(e) => setNewCompetition({ ...newCompetition, roundType: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select round type</option>
                      <option value="720">720 Round</option>
                      <option value="1440">1440 Round</option>
                      <option value="fita">FITA Round</option>
                      <option value="wa">WA Round</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                      Distance <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newCompetition.distance}
                      onChange={(e) => setNewCompetition({ ...newCompetition, distance: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Maximum Participants <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={newCompetition.maxParticipants}
                    onChange={(e) => setNewCompetition({ ...newCompetition, maxParticipants: e.target.value })}
                    min="1"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Add competition details, rules, or special instructions..."
                  value={newCompetition.description}
                  onChange={(e) => setNewCompetition({ ...newCompetition, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newCompetition.name || !newCompetition.date || !newCompetition.roundType || !newCompetition.location || !newCompetition.distance || !newCompetition.maxParticipants}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-violet-800 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Competition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}