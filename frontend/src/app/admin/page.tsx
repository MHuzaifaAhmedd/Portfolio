'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';

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
        // Token expired or invalid
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
        // Update local state
        setContacts(prev => prev.map(contact => 
          contact._id === contactId 
            ? { ...contact, status: newStatus }
            : contact
        ));
        
        // Refresh stats
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
        // Update contact status to replied
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
      case 'new': return 'bg-blue-500 text-white';
      case 'read': return 'bg-yellow-500 text-white';
      case 'replied': return 'bg-green-500 text-white';
      case 'archived': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  // ProtectedRoute component handles authentication checks

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] to-[#1a2332] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] to-[#1a2332] text-white">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#1a2332]/80 to-[#0f1a2a]/80 backdrop-blur-xl border-b border-[#2a3342]/50 p-6"
        >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Portfolio Admin
            </h1>
            <p className="text-gray-400 mt-1">Manage your contact submissions</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Welcome back, Admin</span>
                         <button 
               onClick={() => {
                 logout();
                 window.location.href = '/admin/login';
               }}
               className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-4 py-2 rounded-lg font-medium hover:from-cyan-500 hover:to-blue-600 transition-all duration-300"
             >
               Logout
             </button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        {stats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
          >
            <div className="bg-gradient-to-br from-[#1a2332]/80 to-[#0f1a2a]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Contacts</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a2332]/80 to-[#0f1a2a]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">New</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.new}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🆕</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a2332]/80 to-[#0f1a2a]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Read</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.read}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👁️</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a2332]/80 to-[#0f1a2a]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Replied</p>
                  <p className="text-3xl font-bold text-green-400">{stats.replied}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a2332]/80 to-[#0f1a2a]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Archived</p>
                  <p className="text-3xl font-bold text-gray-400">{stats.archived}</p>
                </div>
                <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contacts Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1a2332]/80 to-[#0f1a2a]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-[#2a3342]/50">
            <h2 className="text-xl font-semibold text-white">Recent Contacts</h2>
            <p className="text-gray-400 text-sm mt-1">Manage and respond to inquiries</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0f1a2a]/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a3342]/50">
                {contacts.map((contact) => (
                  <motion.tr 
                    key={contact._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-[#1a2332]/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{contact.name}</div>
                        <div className="text-sm text-gray-400">{contact.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#2a3342] text-gray-300">
                        {contact.projectType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={contact.status}
                        onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(contact.status)} border-0 focus:ring-2 focus:ring-cyan-400/50`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => updateContactStatus(contact._id, 'archived')}
                          className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors duration-200"
                        >
                          Archive
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#1a2332] to-[#0f1a2a] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Contact Details</h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <p className="text-white font-medium">{selectedContact.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white font-medium">{selectedContact.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Project Type</label>
                <p className="text-white font-medium">{selectedContact.projectType}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Message</label>
                <p className="text-white bg-[#0f1a2a]/50 p-3 rounded-lg mt-1">
                  {selectedContact.message}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Submitted</label>
                <p className="text-white font-medium">{formatDate(selectedContact.createdAt)}</p>
              </div>
            </div>

            <div className="border-t border-[#2a3342]/50 pt-4">
              <label className="text-sm text-gray-400 mb-2 block">Reply Message</label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={4}
                className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 resize-none"
                placeholder="Type your reply message..."
              />
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => sendReply(selectedContact._id)}
                  disabled={sendingReply || !replyMessage.trim()}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-6 py-2 rounded-lg font-medium hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingReply ? 'Sending...' : 'Send Reply'}
                </button>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="bg-[#2a3342] text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-[#3a4352] transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
