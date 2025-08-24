'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import WorldClassLoader from '../../components/WorldClassLoader';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProjectManager from '../../components/ProjectManager';

interface Contact {
  _id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  status: string;
  createdAt: string;
  ipAddress: string;
}

interface DashboardStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
}

export default function AdminDashboard() {
  const { isAuthenticated, token, logout, loading: authLoading } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('contacts');

  // Fetch dashboard data
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDashboardData();
    }
  }, [isAuthenticated, token]);

  const fetchDashboardData = async () => {
    try {
      if (!token) {
        logout();
        window.location.href = '/admin/login';
        return;
      }

      const [contactsRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/contacts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:5000/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (contactsRes.status === 401) {
        logout();
        window.location.href = '/admin/login';
        return;
      }

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.data?.contacts || contactsData.data || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data?.stats || statsData.data || null);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      if (!token) {
        logout();
        window.location.href = '/admin/login';
        return;
      }

      const response = await fetch(`http://localhost:5000/api/admin/contacts/${contactId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setContacts(prev => prev.map(contact => 
          contact._id === contactId 
            ? { ...contact, status: newStatus }
            : contact
        ));
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const sendReply = async (contactId: string) => {
    if (!replyMessage.trim()) return;

    setSendingReply(true);
    try {
      if (!token) {
        logout();
        window.location.href = '/admin/login';
        return;
      }

      const response = await fetch(`http://localhost:5000/api/admin/contacts/${contactId}/reply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ replyMessage })
      });

      if (response.ok) {
        updateContactStatus(contactId, 'replied');
        setReplyMessage('');
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'read': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'replied': return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'archived': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return '🆕';
      case 'read': return '👁️';
      case 'replied': return '💬';
      case 'archived': return '📁';
      default: return '❓';
    }
  };

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.projectType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <WorldClassLoader 
        message="Loading Admin Dashboard..." 
        variant="pulse"
        size="lg"
      />
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#1a2332] to-[#0a0f1f] text-white">
        {/* Enhanced Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border-b border-[#2a3342]/50 sticky top-0 z-40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-black">H</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Portfolio Admin
                  </h1>
                  <p className="text-gray-400 text-xs sm:text-sm">Professional Contact Management</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-400">Welcome back</p>
                  <p className="text-white font-medium text-sm sm:text-base">Administrator</p>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    window.location.href = '/admin/login';
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 text-sm sm:text-base w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🚪</span>
                    <span>Logout</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-2 mb-6 sm:mb-8"
          >
            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'contacts'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg'
                  : 'bg-[#1a2332]/80 text-gray-300 hover:bg-[#2a3342]/80 border border-[#2a3342]/50'
              }`}
            >
              📧 Contact Management
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'projects'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg'
                  : 'bg-[#1a2332]/80 text-gray-300 hover:bg-[#2a3342]/80 border border-[#2a3342]/50'
              }`}
            >
              🚀 Project Management
            </button>
          </motion.div>

          {/* Enhanced Stats Cards */}
          {stats && activeTab === 'contacts' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Contacts</p>
                    <p className="text-2xl sm:text-4xl font-bold text-white">{stats.total}</p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">All time submissions</p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                    <span className="text-xl sm:text-3xl">📊</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">New</p>
                    <p className="text-2xl sm:text-4xl font-bold text-blue-400">{stats.new}</p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">Requires attention</p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                    <span className="text-xl sm:text-3xl">🆕</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Read</p>
                    <p className="text-2xl sm:text-4xl font-bold text-yellow-400">{stats.read}</p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">Under review</p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                    <span className="text-xl sm:text-3xl">👁️</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Replied</p>
                    <p className="text-2xl sm:text-4xl font-bold text-green-400">{stats.replied}</p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">Completed</p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center border border-green-500/30">
                    <span className="text-xl sm:text-3xl">💬</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Archived</p>
                    <p className="text-2xl sm:text-4xl font-bold text-gray-400">{stats.archived}</p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">Stored</p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-2xl flex items-center justify-center border border-gray-500/30">
                    <span className="text-xl sm:text-3xl">📁</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Enhanced Controls Section - Only show for contacts tab */}
          {activeTab === 'contacts' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Contact Management</h2>
                  <p className="text-gray-400 text-sm">Filter, search, and manage your contacts efficiently</p>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 lg:space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-48 lg:w-64 bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm sm:text-base"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="status">Sort by Status</option>
                  </select>

                  {/* Sort Order */}
                  <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-4 py-3 rounded-xl font-medium hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 text-sm sm:text-base"
                  >
                    {sortOrder === 'desc' ? '↓' : '↑'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Enhanced Contacts Table - Only show for contacts tab */}
          {activeTab === 'contacts' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="p-4 sm:px-6 border-b border-[#2a3342]/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Recent Contacts</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      {filteredContacts.length} of {contacts.length} contacts
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs sm:text-sm text-gray-400">Last updated</p>
                    <p className="text-white font-medium text-sm sm:text-base">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0f1a2a]/80">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Contact</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider hidden sm:table-cell">Project</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider hidden lg:table-cell">Date</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3342]/50">
                    {filteredContacts.map((contact, index) => (
                      <motion.tr 
                        key={contact._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-[#1a2332]/30 transition-all duration-200 group"
                      >
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-black font-bold text-xs sm:text-sm">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200 truncate">
                                {contact.name}
                              </div>
                              <div className="text-xs text-gray-400 truncate">{contact.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#2a3342] to-[#3a4352] text-gray-300 border border-[#4a5362]/30">
                            {contact.projectType}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <select
                            value={contact.status}
                            onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                            className={`text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-full font-medium ${getStatusColor(contact.status)} border-0 focus:ring-2 focus:ring-cyan-400/50 cursor-pointer transition-all duration-200 hover:scale-105`}
                          >
                            <option value="new">🆕 New</option>
                            <option value="read">👁️ Read</option>
                            <option value="replied">💬 Replied</option>
                            <option value="archived">📁 Archived</option>
                          </select>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                          <div className="text-xs sm:text-sm text-gray-400">
                            {formatDate(contact.createdAt)}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <button
                              onClick={() => setSelectedContact(contact)}
                              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-3 sm:px-4 py-2 rounded-lg font-medium hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              👁️ View
                            </button>
                            <button
                              onClick={() => updateContactStatus(contact._id, 'archived')}
                              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-gray-500/25 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              📁 Archive
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredContacts.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl sm:text-6xl mb-4">📭</div>
                    <p className="text-gray-400 text-base sm:text-lg">No contacts found</p>
                    <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Contact Detail Modal - Fully Responsive */}
        <AnimatePresence>
          {selectedContact && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-[#1a2332] to-[#0f1a2a] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-2xl lg:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto shadow-2xl border border-[#2a3342]/50"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-bold text-black">
                        {selectedContact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-bold text-white">Contact Details</h3>
                      <p className="text-gray-400 text-sm">Manage this inquiry</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2a3342] hover:bg-[#3a4352] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 self-end sm:self-auto"
                  >
                    ✕
                  </button>
                </div>

                {/* Contact Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-[#0f1a2a]/50 p-3 sm:p-4 rounded-xl border border-[#2a3342]/50">
                      <label className="text-xs sm:text-sm text-gray-400 font-medium">Name</label>
                      <p className="text-white font-semibold text-sm sm:text-lg">{selectedContact.name}</p>
                    </div>
                    <div className="bg-[#0f1a2a]/50 p-3 sm:p-4 rounded-xl border border-[#2a3342]/50">
                      <label className="text-xs sm:text-sm text-gray-400 font-medium">Email</label>
                      <p className="text-white font-semibold text-sm sm:text-lg break-all">{selectedContact.email}</p>
                    </div>
                    <div className="bg-[#0f1a2a]/50 p-3 sm:p-4 rounded-xl border border-[#2a3342]/50">
                      <label className="text-xs sm:text-sm text-gray-400 font-medium">Project Type</label>
                      <p className="text-white font-semibold text-sm sm:text-lg">{selectedContact.projectType}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-[#0f1a2a]/50 p-3 sm:p-4 rounded-xl border border-[#2a3342]/50">
                      <label className="text-xs sm:text-sm text-gray-400 font-medium">Status</label>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(selectedContact.status)}`}>
                          {getStatusIcon(selectedContact.status)} {selectedContact.status}
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#0f1a2a]/50 p-3 sm:p-4 rounded-xl border border-[#2a3342]/50">
                      <label className="text-xs sm:text-sm text-gray-400 font-medium">Submitted</label>
                      <p className="text-white font-semibold text-sm sm:text-lg">{formatDate(selectedContact.createdAt)}</p>
                    </div>
                    <div className="bg-[#0f1a2a]/50 p-3 sm:p-4 rounded-xl border border-[#2a3342]/50">
                      <label className="text-xs sm:text-sm text-gray-400 font-medium">IP Address</label>
                      <p className="text-white font-mono text-xs sm:text-sm break-all">{selectedContact.ipAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Message Section */}
                <div className="bg-[#0f1a2a]/50 p-3 sm:p-4 rounded-xl border border-[#2a3342]/50 mb-6">
                  <label className="text-xs sm:text-sm text-gray-400 font-medium mb-2 block">Message</label>
                  <p className="text-white bg-[#0f1a2a]/80 p-3 sm:p-4 rounded-lg border border-[#2a3342]/50 text-sm sm:text-lg leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>

                {/* Reply Section */}
                <div className="border-t border-[#2a3342]/50 pt-4 sm:pt-6">
                  <label className="text-xs sm:text-sm text-gray-400 font-medium mb-2 sm:mb-3 block">Reply Message</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                    className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-3 sm:px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 resize-none text-sm sm:text-lg"
                    placeholder="Type your professional reply message..."
                  />
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
                    <button
                      onClick={() => sendReply(selectedContact._id)}
                      disabled={sendingReply || !replyMessage.trim()}
                      className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/25 text-sm sm:text-lg"
                    >
                      {sendingReply ? (
                        <span className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <span>📤</span>
                          <span>Send Reply</span>
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-[#2a3342] text-gray-300 rounded-xl font-semibold hover:bg-[#3a4352] transition-all duration-300 text-sm sm:text-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Project Management Tab */}
          {activeTab === 'projects' && (
            <ProjectManager />
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
