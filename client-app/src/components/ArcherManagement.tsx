import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Mail, Phone, Award, AlertCircle, Check, User, Target, X } from 'lucide-react';
import { recorderAPI } from '../services/api';

export default function ArcherManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newArcher, setNewArcher] = useState({
    name: '',
    email: '',
    phone: '',
    archerNumber: '',
    category: '',
    bowType: '',
  });

  // Mock data
  const archers = [
    {
      id: 1,
      name: 'John Smith',
      archerNumber: 'A-2345',
      email: 'john.smith@email.com',
      phone: '+1234567890',
      category: 'Recurve - Senior Men',
      bowType: 'Recurve',
      personalBest: 687,
      competitions: 12,
      status: 'active',
    },
    {
      id: 2,
      name: 'Emma Davis',
      archerNumber: 'A-1289',
      email: 'emma.davis@email.com',
      phone: '+1234567891',
      category: 'Compound - Senior Women',
      bowType: 'Compound',
      personalBest: 692,
      competitions: 8,
      status: 'active',
    },
    {
      id: 3,
      name: 'Michael Chen',
      archerNumber: 'A-3456',
      email: 'michael.chen@email.com',
      phone: '+1234567892',
      category: 'Recurve - Senior Men',
      bowType: 'Recurve',
      personalBest: 658,
      competitions: 15,
      status: 'active',
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      archerNumber: 'A-4567',
      email: 'sarah.j@email.com',
      phone: '+1234567893',
      category: 'Recurve - Senior Women',
      bowType: 'Recurve',
      personalBest: 698,
      competitions: 20,
      status: 'active',
    },
  ];

  const filteredArchers = archers.filter(
    (archer) =>
      archer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      archer.archerNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    if (!newArcher.name || !newArcher.email || !newArcher.archerNumber || !newArcher.bowType) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newArcher.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Creating archer:', newArcher);

    setIsLoading(false);
    setSuccess('Archer created successfully!');
    setTimeout(() => {
      setShowCreateDialog(false);
      setSuccess('');
      setNewArcher({
        name: '',
        email: '',
        phone: '',
        archerNumber: '',
        category: '',
        bowType: '',
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-700 dark:to-emerald-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Archer Management</h2>
              <p className="text-green-100 text-sm mt-1">Manage registered archers and their profiles</p>
            </div>
            <button
              onClick={() => setShowCreateDialog(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Archer
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or archer number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Archer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bow Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Personal Best</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Competitions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredArchers.map((archer) => (
                <tr key={archer.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{archer.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{archer.archerNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{archer.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{archer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{archer.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                      {archer.bowType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{archer.personalBest}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{archer.competitions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex gap-2 justify-end">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Archer Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-4">
            {/* Dialog Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-700 dark:to-emerald-800 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Plus className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Add New Archer</h2>
                    <p className="text-green-100 text-sm">Register a new archer in the system</p>
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
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={newArcher.name}
                      onChange={(e) => setNewArcher({ ...newArcher, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                      Archer Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., A-1234"
                      value={newArcher.archerNumber}
                      onChange={(e) => setNewArcher({ ...newArcher, archerNumber: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="archer@email.com"
                      value={newArcher.email}
                      onChange={(e) => setNewArcher({ ...newArcher, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1234567890"
                      value={newArcher.phone}
                      onChange={(e) => setNewArcher({ ...newArcher, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Archery Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Archery Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                      Bow Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newArcher.bowType}
                      onChange={(e) => setNewArcher({ ...newArcher, bowType: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select bow type</option>
                      <option value="Recurve">Recurve</option>
                      <option value="Compound">Compound</option>
                      <option value="Barebow">Barebow</option>
                      <option value="Longbow">Longbow</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                      Category
                    </label>
                    <select
                      value={newArcher.category}
                      onChange={(e) => setNewArcher({ ...newArcher, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select category</option>
                      <option value="Recurve - Senior Men">Recurve - Senior Men</option>
                      <option value="Recurve - Senior Women">Recurve - Senior Women</option>
                      <option value="Compound - Senior Men">Compound - Senior Men</option>
                      <option value="Compound - Senior Women">Compound - Senior Women</option>
                      <option value="Recurve - Junior Men">Recurve - Junior Men</option>
                      <option value="Recurve - Junior Women">Recurve - Junior Women</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowCreateDialog(false)}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newArcher.name || !newArcher.email || !newArcher.archerNumber || !newArcher.bowType || isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-800 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Archer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}