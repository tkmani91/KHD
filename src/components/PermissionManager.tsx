import React, { useState, useEffect } from 'react';
import { Shield, Users, Save, RotateCcw, AlertCircle, Upload, Check, Copy } from 'lucide-react';

const GITHUB_LOGIN_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-login.json';

interface SectionPermissions {
  view: boolean;
  edit: boolean;
  delete: boolean;
}

interface UserPermissions {
  members: SectionPermissions;
  contacts: SectionPermissions;
  invitations: SectionPermissions;
  fund: SectionPermissions;
  notice: SectionPermissions;
  live: SectionPermissions;
  accounts: SectionPermissions;
  jsonEditor: SectionPermissions;
}

interface LoginUser {
  id: string;
  name: string;
  mobile: string;
  email: string;
  password: string;
  role: 'Member' | 'Admin' | 'Super Admin';
  photo?: string;
  permissions?: UserPermissions;
}

const DEFAULT_PERMISSIONS: Record<string, UserPermissions> = {
  'Member': {
    members: { view: true, edit: false, delete: false },
    contacts: { view: true, edit: false, delete: false },
    invitations: { view: true, edit: false, delete: false },
    fund: { view: true, edit: false, delete: false },
    notice: { view: true, edit: false, delete: false },
    live: { view: true, edit: false, delete: false },
    accounts: { view: false, edit: false, delete: false },
    jsonEditor: { view: false, edit: false, delete: false }
  },
  'Admin': {
    members: { view: true, edit: false, delete: false },
    contacts: { view: true, edit: false, delete: false },
    invitations: { view: true, edit: false, delete: false },
    fund: { view: true, edit: false, delete: false },
    notice: { view: true, edit: false, delete: false },
    live: { view: true, edit: false, delete: false },
    accounts: { view: true, edit: false, delete: false },
    jsonEditor: { view: false, edit: false, delete: false }
  },
  'Super Admin': {
    members: { view: true, edit: true, delete: true },
    contacts: { view: true, edit: true, delete: true },
    invitations: { view: true, edit: true, delete: true },
    fund: { view: true, edit: true, delete: true },
    notice: { view: true, edit: true, delete: true },
    live: { view: true, edit: true, delete: true },
    accounts: { view: true, edit: true, delete: true },
    jsonEditor: { view: true, edit: true, delete: true }
  }
};

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

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
        setError('ডেটা লোড করতে সমস্যা হয়েছে');
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

  // Generate final JSON
  const generateFinalJSON = () => {
    if (!permissions || !selectedUserId || !loginData) return null;

    const updatedAccountsMembers = loginData.accountsMembers.map(user => {
      if (user.id === selectedUserId) {
        return { ...user, permissions };
      }
      return user;
    });

    return {
      accountsMembers: updatedAccountsMembers,
      normalMembers: loginData.normalMembers
    };
  };

  // Copy to clipboard
  const handleCopyJSON = () => {
    const finalJSON = generateFinalJSON();
    if (!finalJSON) return;

    navigator.clipboard.writeText(JSON.stringify(finalJSON, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Direct GitHub Upload
  const handleDirectUpload = async () => {
    const finalJSON = generateFinalJSON();
    if (!finalJSON) {
      alert('❌ কোন পরিবর্তন করা হয়নি!');
      return;
    }

    const confirmUpload = window.confirm(
      `⚠️ নিশ্চিত করুন:\n\n` +
      `ফাইল: members-login.json\n` +
      `Admin: ${adminUsers.find(u => u.id === selectedUserId)?.name}\n\n` +
      `সরাসরি GitHub এ আপলোড হবে।\n` +
      `এগিয়ে যেতে চান?`
    );

    if (!confirmUpload) return;

    setIsUploading(true);
    setError('');
    setUploadSuccess(false);

    try {
      const response = await fetch('/api/github-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath: 'members-login.json',
          content: JSON.stringify(finalJSON, null, 2),
          commitMessage: `🔐 Update permissions for ${adminUsers.find(u => u.id === selectedUserId)?.name}`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadSuccess(true);
      
      // Update local state
      setLoginData(finalJSON);
      
      alert(
        `✅ সফলভাবে GitHub এ আপলোড হয়েছে!\n\n` +
        `📁 ফাইল: members-login.json\n` +
        `🔗 Commit: ${data.commit?.sha?.substring(0, 7) || 'OK'}\n\n` +
        `২-৩ মিনিট পর সাইট রিফ্রেশ করুন। 🔄`
      );

      setTimeout(() => setUploadSuccess(false), 5000);

    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`❌ আপলোড ব্যর্থ: ${errorMessage}`);
      alert(`❌ সমস্যা হয়েছে:\n\n${errorMessage}\n\nদয়া করে JSON কপি করে manual আপলোড করুন।`);
    } finally {
      setIsUploading(false);
    }
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

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

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
              {user.name} ({user.mobile || user.email || 'No contact'})
            </option>
          ))}
        </select>
      </div>

      {/* Permissions Table */}
      {permissions && selectedUserId && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-white font-bold">
              📋 {adminUsers.find(u => u.id === selectedUserId)?.name} এর Permissions
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
              >
                <RotateCcw className="w-4 h-4" /> রিসেট
              </button>
              <button
                onClick={handleCopyJSON}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${
                  copied ? 'bg-green-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'কপি হয়েছে!' : 'JSON কপি'}
              </button>
              <button
                onClick={handleDirectUpload}
                disabled={isUploading}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  uploadSuccess 
                    ? 'bg-green-600 text-white' 
                    : isUploading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    আপলোড হচ্ছে...
                  </>
                ) : uploadSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    ✅ আপলোড হয়েছে!
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    🚀 সরাসরি আপলোড
                  </>
                )}
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
                        checked={permissions[section as keyof UserPermissions]?.view || false}
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
                        checked={permissions[section as keyof UserPermissions]?.edit || false}
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
                        checked={permissions[section as keyof UserPermissions]?.delete || false}
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
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">📄 JSON Preview:</p>
              <p className="text-xs text-gray-500">members-login.json</p>
            </div>
            <pre className="text-xs text-green-400 font-mono overflow-x-auto max-h-48">
              {JSON.stringify(permissions, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedUserId && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <p className="text-gray-600">উপর থেকে একজন Admin নির্বাচন করুন</p>
        </div>
      )}
    </div>
  );
};

export default PermissionManager;
