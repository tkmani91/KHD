import React, { useState, useEffect } from 'react';
import { Shield, Users, RotateCcw, Upload, Check, Copy, AlertCircle } from 'lucide-react';

const GITHUB_LOGIN_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-login.json';

// JSONEditor এর সব sections
const JSON_EDITOR_SECTIONS = [
  { id: 'dynamicContent', label: '📰 সদস্য আয় হিসাব' },
  { id: 'membersData', label: '👥 সদস্য তথ্য' },
  { id: 'contactsData', label: '📞 যোগাযোগ' },
  { id: 'invitationsData', label: '💌 নিমন্ত্রণ' },
  { id: 'quizData', label: '❓ কুইজ' },
  { id: 'loginData', label: '🔐 লগইন ডেটা' },
  { id: 'chatbotData', label: '💬 চ্যাটবট' },
  { id: 'galleryImages', label: '🖼️ গ্যালারি' },
  { id: 'accountsPDFs', label: '📊 বাৎসরিক হিসাব' },
  { id: 'liveChannels', label: '📺 লাইভ চ্যানেল' },
  { id: 'pdfFiles', label: '📄 পূজাদ্রব্যের তালিকা' },
  { id: 'pujaData', label: '🙏 পূজা তথ্য' },
  { id: 'schedules', label: '📅 সময়সূচী' },
  { id: 'songs', label: '🎵 গান' }
];

interface EditorPermissions {
  [key: string]: boolean;
}

interface LoginUser {
  id: string;
  name: string;
  mobile: string;
  email: string;
  password: string;
  role: 'Member' | 'Admin' | 'Super Admin';
  photo?: string;
  editorPermissions?: EditorPermissions;
}

interface PermissionManagerProps {
  currentUser: LoginUser;
  onUserUpdate?: (updatedUser: LoginUser) => void;
}

const PermissionManager: React.FC<PermissionManagerProps> = ({ currentUser, onUserUpdate }) => {
  const [loginData, setLoginData] = useState<{ accountsMembers: LoginUser[]; normalMembers: LoginUser[] } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [permissions, setPermissions] = useState<EditorPermissions>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Default permissions (সব false)
  const getDefaultPermissions = (): EditorPermissions => {
    const perms: EditorPermissions = {};
    JSON_EDITOR_SECTIONS.forEach(section => {
      perms[section.id] = false;
    });
    return perms;
  };

  // Load login data
  useEffect(() => {
    const fetchLoginData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(GITHUB_LOGIN_URL, { cache: 'no-cache' });
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();
        setLoginData(data);
      } catch (err) {
        console.error('Failed to load login data:', err);
        setError('ডেটা লোড করতে সমস্যা হয়েছে');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoginData();
  }, []);

  // Get all admin users (Super Admin বাদে)
  const adminUsers = loginData?.accountsMembers.filter(u => u.role === 'Admin') || [];

  // Load selected user permissions
  useEffect(() => {
    if (selectedUserId && loginData) {
      const user = loginData.accountsMembers.find(u => u.id === selectedUserId);
      if (user) {
        // যদি editorPermissions থাকে সেটা নাও, না থাকলে default
        const userPerms = user.editorPermissions || getDefaultPermissions();
        setPermissions(userPerms);
      }
    } else {
      setPermissions({});
    }
  }, [selectedUserId, loginData]);

  // Toggle single permission
  const handlePermissionToggle = (sectionId: string) => {
    setPermissions(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Select all
  const handleSelectAll = () => {
    const allTrue: EditorPermissions = {};
    JSON_EDITOR_SECTIONS.forEach(section => {
      allTrue[section.id] = true;
    });
    setPermissions(allTrue);
  };

  // Deselect all
  const handleDeselectAll = () => {
    setPermissions(getDefaultPermissions());
  };

  // Generate final JSON
  const generateFinalJSON = () => {
    if (!selectedUserId || !loginData) return null;

    const updatedAccountsMembers = loginData.accountsMembers.map(user => {
      if (user.id === selectedUserId) {
        return { ...user, editorPermissions: permissions };
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

  const handleDirectUpload = async () => {
  const finalJSON = generateFinalJSON();
  if (!finalJSON) {
    alert('❌ কোন পরিবর্তন করা হয়নি!');
    return;
  }

  const selectedUser = adminUsers.find(u => u.id === selectedUserId);
  const enabledCount = Object.values(permissions).filter(Boolean).length;

  const confirmUpload = window.confirm(
    `⚠️ নিশ্চিত করুন:\n\n` +
    `Admin: ${selectedUser?.name}\n` +
    `Permission: ${enabledCount}টি section\n\n` +
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filePath: 'members-login.json',
        content: JSON.stringify(finalJSON, null, 2),
        commitMessage: `🔐 Update editor permissions for ${selectedUser?.name}`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    setUploadSuccess(true);
    setLoginData(finalJSON);
    
    // ✅ FIX 1: Update parent if callback exists
    if (onUserUpdate && selectedUserId === currentUser.id) {
      const updatedCurrentUser = finalJSON.accountsMembers.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) {
        onUserUpdate(updatedCurrentUser);
      }
    }
    
    // ✅ FIX 2: Force refresh GitHub data এবং localStorage update
    try {
      const freshResponse = await fetch(GITHUB_LOGIN_URL, { 
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (freshResponse.ok) {
        const freshData = await freshResponse.json();
        setLoginData(freshData);
        
        // ✅ FIX 3: যদি current user এর permission update হয়ে থাকে
        if (selectedUserId === currentUser.id) {
          const updatedUser = freshData.accountsMembers.find((u: any) => u.id === currentUser.id);
          if (updatedUser) {
            // localStorage update
            localStorage.setItem('khd_logged_in_user', JSON.stringify(updatedUser));
            
            // Parent callback
            if (onUserUpdate) {
              onUserUpdate(updatedUser);
            }
          }
        }
      }
    } catch (fetchErr) {
      console.error('Fresh data fetch failed:', fetchErr);
    }
    
    alert(
      `✅ সফলভাবে আপলোড হয়েছে!\n\n` +
      `👤 ${selectedUser?.name}\n` +
      `📁 ${enabledCount}টি section এ permission দেওয়া হয়েছে\n\n` +
      (selectedUserId === currentUser.id 
        ? `⚠️ পেজ রিলোড হচ্ছে নতুন permission apply করতে...` 
        : `এই Admin এখন কন্ট্রোল প্যানেলে ঢুকে\nশুধু permitted sections edit করতে পারবে। 🎉`)
    );

    // ✅ FIX 4: যদি নিজের permission update করা হয়, তাহলে page reload
    if (selectedUserId === currentUser.id) {
      setTimeout(() => window.location.reload(), 2000);
    } else {
      setTimeout(() => setUploadSuccess(false), 5000);
    }

  } catch (err) {
    console.error('Upload error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    setError(`❌ আপলোড ব্যর্থ: ${errorMessage}`);
    alert(`❌ সমস্যা হয়েছে:\n\n${errorMessage}\n\nJSON কপি করে manual আপলোড করুন।`);
  } finally {
    setIsUploading(false);
  }
};
  // Reset to default
  const handleReset = () => {
    if (window.confirm('⚠️ সব permission বাতিল করবেন?')) {
      setPermissions(getDefaultPermissions());
    }
  };

  // Super Admin check
  if (currentUser.role !== 'Super Admin') {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
        <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <p className="text-gray-500 text-lg">শুধুমাত্র Super Admin এই পেজ দেখতে পারবেন</p>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">ডেটা লোড হচ্ছে...</p>
      </div>
    );
  }

  const selectedUser = adminUsers.find(u => u.id === selectedUserId);
  const enabledCount = Object.values(permissions).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">কন্ট্রোল প্যানেল পারমিশন</h2>
            <p className="text-purple-100">Admin দের JSONEditor এ section-wise অ্যাক্সেস দিন</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-bold mb-1">📌 কীভাবে কাজ করে:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>যে section এ ✅ টিক দিবেন, সেই Admin ওই section edit করতে পারবে</li>
              <li>Super Admin সব সময় সব section access করতে পারবে</li>
              <li>Permission দেওয়ার পর Admin কে logout করে আবার login করতে হবে</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Admin Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Admin নির্বাচন করুন:
        </label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base font-medium"
        >
          <option value="">-- একজন Admin নির্বাচন করুন --</option>
          {adminUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} {user.mobile ? `(${user.mobile})` : ''}
              {user.editorPermissions ? ' ✅' : ''}
            </option>
          ))}
        </select>
        
        {adminUsers.length === 0 && (
          <p className="mt-3 text-sm text-gray-500">কোন Admin পাওয়া যায়নি</p>
        )}
      </div>

      {/* Permission Grid */}
      {selectedUserId && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-white">
                <h3 className="font-bold text-lg">{selectedUser?.name}</h3>
                <p className="text-gray-300 text-sm">
                  {enabledCount}টি section এ permission আছে
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
                >
                  ✅ সব সিলেক্ট
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition"
                >
                  ❌ সব বাতিল
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" /> রিসেট
                </button>
              </div>
            </div>
          </div>

          {/* Sections Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {JSON_EDITOR_SECTIONS.map(section => (
                <label
                  key={section.id}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                    permissions[section.id]
                      ? 'bg-green-50 border-green-500 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions[section.id] || false}
                    onChange={() => handlePermissionToggle(section.id)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className={`font-medium ${
                    permissions[section.id] ? 'text-green-800' : 'text-gray-700'
                  }`}>
                    {section.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-100 px-6 py-4 flex flex-wrap gap-3 justify-end">
            <button
              onClick={handleCopyJSON}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'কপি হয়েছে!' : 'JSON কপি'}
            </button>
            
            <button
              onClick={handleDirectUpload}
              disabled={isUploading}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition ${
                uploadSuccess 
                  ? 'bg-green-600 text-white' 
                  : isUploading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
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
                  সফল!
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
      )}

      {/* Empty State */}
      {!selectedUserId && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-12 text-center">
          <Users className="w-20 h-20 mx-auto mb-4 text-purple-300" />
          <p className="text-gray-500 text-lg">উপর থেকে একজন Admin নির্বাচন করুন</p>
          <p className="text-gray-400 text-sm mt-2">তারপর যে sections এ permission দিতে চান সেগুলো টিক দিন</p>
        </div>
      )}
    </div>
  );
};

export default PermissionManager;
