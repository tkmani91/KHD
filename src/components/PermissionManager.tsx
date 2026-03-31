import React, { useState, useEffect } from 'react';
import { LoginUser, UserPermissions, DEFAULT_PERMISSIONS } from '../types/permissions';
import { Shield, Users, Save, RotateCcw, AlertCircle } from 'lucide-react';

const GITHUB_LOGIN_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-login.json';

const SECTION_LABELS: Record<string, string> = {
  members: '👥 সদস্য তালিকা',
  contacts: '📞 যোগাযোগ',
  invitations: '💌 নিমন্ত্রণ',
  fund: '💰 চাঁদা হিসাব',
  notice: '📢 বিজ্ঞপ্তি',
  live: '📺 লাইভ সম্প্রচার',
  accounts: '📊 বাৎসরিক হিসাব',
  jsonEditor: '⚙️ কন্ট্রোল প্যানেল'
};

interface PermissionManagerProps {
  currentUser: LoginUser;
}

const PermissionManager: React.FC<PermissionManagerProps> = ({ currentUser }) => {
  const [loginData, setLoginData] = useState<{ accountsMembers: LoginUser[]; normalMembers: LoginUser[] } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load login data
  useEffect(() => {
    const fetchLoginData = async () => {
      try {
        const response = await fetch(GITHUB_LOGIN_URL, { cache: 'no-cache' });
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        setLoginData(data);
      } catch (err) {
        console.error('Failed to load login data:', err);
      }
    };
    fetchLoginData();
  }, []);

  // Get all admin users
  const adminUsers = loginData?.accountsMembers.filter(u => u.role === 'Admin') || [];

  // Load selected user permissions
  useEffect(() => {
    if (selectedUserId && loginData) {
      const user = loginData.accountsMembers.find(u => u.id === selectedUserId);
      if (user) {
        setPermissions(user.permissions || DEFAULT_PERMISSIONS[user.role]);
      }
    }
  }, [selectedUserId, loginData]);

  const handlePermissionChange = (section: keyof UserPermissions, action: 'view' | 'edit' | 'delete', value: boolean) => {
    if (!permissions) return;
    
    setPermissions(prev => {
      if (!prev) return null;
      
      const newPerms = { ...prev };
      newPerms[section] = { ...newPerms[section], [action]: value };
      
      // Auto-enable view if edit is enabled
      if (action === 'edit' && value) {
        newPerms[section].view = true;
      }
      // Auto-enable edit if delete is enabled
      if (action === 'delete' && value) {
        newPerms[section].view = true;
        newPerms[section].edit = true;
      }
      // Auto-disable delete and edit if view is disabled
      if (action === 'view' && !value) {
        newPerms[section].edit = false;
        newPerms[section].delete = false;
      }
      
      return newPerms;
    });
  };

  const handleSave = () => {
    if (!permissions || !selectedUserId || !loginData) return;
    
    const updatedAccountsMembers = loginData.accountsMembers.map(user => {
      if (user.id === selectedUserId) {
        return { ...user, permissions };
      }
      return user;
    });

    const finalJSON = {
      accountsMembers: updatedAccountsMembers,
      normalMembers: loginData.normalMembers
    };

    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(finalJSON, null, 2));
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    
    alert(
      '✅ JSON কপি করা হয়েছে!\n\n' +
      'এখন GitHub এ:\n' +
      '1. members-login.json ওপেন করুন\n' +
      '2. Edit → Paste করুন\n' +
      '3. Commit করুন\n\n' +
      '২-৩ মিনিট পর রিফ্রেশ করুন। 🔄'
    );
  };

  const handleReset = () => {
    if (!selectedUserId || !loginData) return;
    const user = loginData.accountsMembers.find(u => u.id === selectedUserId);
    if (user && window.confirm('⚠️ Default permissions এ রিসেট করবেন?')) {
      setPermissions(DEFAULT_PERMISSIONS[user.role]);
    }
  };

  if (currentUser.role !== 'Super Admin') {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <p className="text-gray-500">শুধুমাত্র Super Admin দেখতে পারবেন</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">পারমিশন ম্যানেজমেন্ট</h2>
            <p className="text-purple-100 text-sm">Admin দের জন্য Section-wise অ্যাক্সেস কন্ট্রোল</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">কীভাবে কাজ করে:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li><strong>View:</strong> দেখতে পারবে</li>
              <li><strong>Edit:</strong> পরিবর্তন করতে পারবে (JSON Editor এ)</li>
              <li><strong>Delete:</strong> মুছতে পারবে</li>
            </ul>
          </div>
        </div>
      </div>

      {/* User Selector */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Admin সদস্য নির্বাচন করুন:
        </label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
        >
          <option value="">একজন Admin নির্বাচন করুন...</option>
          {adminUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.mobile || user.email})
            </option>
          ))}
        </select>
      </div>

      {/* Permissions Table */}
      {permissions && selectedUserId && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between">
            <h3 className="text-white font-bold">
              📋 {adminUsers.find(u => u.id === selectedUserId)?.name} এর Permissions
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
              >
                <RotateCcw className="w-4 h-4" /> রিসেট
              </button>
              <button
                onClick={handleSave}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                  saveSuccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Save className="w-4 h-4" />
                {saveSuccess ? '✅ সংরক্ষিত!' : '💾 সংরক্ষণ'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Section</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">👁️ View</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">✏️ Edit</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">🗑️ Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(SECTION_LABELS).map(([section, label]) => (
                  <tr key={section} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{label}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[section as keyof UserPermissions].view}
                        onChange={(e) => handlePermissionChange(
                          section as keyof UserPermissions, 
                          'view', 
                          e.target.checked
                        )}
                        className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[section as keyof UserPermissions].edit}
                        onChange={(e) => handlePermissionChange(
                          section as keyof UserPermissions, 
                          'edit', 
                          e.target.checked
                        )}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[section as keyof UserPermissions].delete}
                        onChange={(e) => handlePermissionChange(
                          section as keyof UserPermissions, 
                          'delete', 
                          e.target.checked
                        )}
                        className="w-5 h-5 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* JSON Preview */}
          <div className="bg-gray-900 p-4">
            <p className="text-xs text-gray-400 mb-2">📄 JSON Preview:</p>
            <pre className="text-xs text-green-400 font-mono overflow-x-auto">
              {JSON.stringify(permissions, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionManager;
