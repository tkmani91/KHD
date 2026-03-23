import React, { useState, useEffect } from 'react';
import { Settings, Copy, Check, Plus, Trash2, Save } from 'lucide-react';
import { cn } from '../lib/utils';

// GitHub URLs - আপনার App.tsx থেকে import করতে হবে বা এখানে define করুন
const GITHUB_DYNAMIC_CONTENT_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/dynamicContent.json';
const GITHUB_MEMBERS_DATA_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/members-data.json';
const GITHUB_LOGIN_URL = 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/members-login.json';

interface JSONFile {
  id: string;
  label: string;
  url: string;
  path: string;
  type: 'array' | 'object';
  itemTemplate?: Record<string, any>;
}

const JSONEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('dynamicContent');
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // All JSON files configuration
  const JSON_FILES: JSONFile[] = [
    { 
      id: 'dynamicContent', 
      label: '📰 ঘোষণা ও খবর', 
      url: GITHUB_DYNAMIC_CONTENT_URL,
      path: 'public/data/dynamicContent.json',
      type: 'array',
      itemTemplate: {
        id: '',
        title: '',
        date: '',
        dateEn: '',
        details: '',
        priority: 'medium',
        category: 'সাধারণ'
      }
    },
    { 
      id: 'membersData', 
      label: '👥 সদস্য তথ্য', 
      url: GITHUB_MEMBERS_DATA_URL,
      path: 'public/data/members-data.json',
      type: 'array',
      itemTemplate: {
        id: '',
        name: '',
        role: 'Member',
        phone: '',
        email: '',
        address: '',
        imageUrl: ''
      }
    },
    { 
      id: 'loginData', 
      label: '🔐 সদস্য লগইন', 
      url: GITHUB_LOGIN_URL,
      path: 'public/data/members-login.json',
      type: 'array',
      itemTemplate: {
        username: '',
        password: '',
        role: 'Member'
      }
    },
    { 
      id: 'chatbotData', 
      label: '💬 চ্যাটবট ডেটা', 
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/chatbot-data.json',
      path: 'public/data/chatbot-data.json',
      type: 'array',
      itemTemplate: {
        id: '',
        question: '',
        answer: '',
        keywords: []
      }
    },
    { 
      id: 'galleryImages', 
      label: '🖼️ গ্যালারি ছবি', 
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/gallery-images.json',
      path: 'public/data/gallery-images.json',
      type: 'object',
      itemTemplate: {
        id: '',
        imageUrl: '',
        caption: '',
        category: 'festivals'
      }
    },
    { 
      id: 'accountsPDFs', 
      label: '📊 হিসাব PDF', 
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/accountsPDFs.json',
      path: 'public/data/accountsPDFs.json',
      type: 'array',
      itemTemplate: {
        id: '',
        year: '',
        month: '',
        pdfUrl: '',
        fileName: ''
      }
    },
    { 
      id: 'liveChannels', 
      label: '📺 লাইভ চ্যানেল', 
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/liveChannels.json',
      path: 'public/data/liveChannels.json',
      type: 'array',
      itemTemplate: {
        id: '',
        channelName: '',
        streamUrl: '',
        thumbnail: '',
        description: ''
      }
    },
    { 
      id: 'pdfFiles', 
      label: '📄 PDF ফাইল', 
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/pdfFiles.json',
      path: 'public/data/pdfFiles.json',
      type: 'array',
      itemTemplate: {
        id: '',
        title: '',
        pdfUrl: '',
        category: '',
        description: ''
      }
    },
    { 
      id: 'pujaData', 
      label: '🙏 পূজা তথ্য', 
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/pujaData.json',
      path: 'public/data/pujaData.json',
      type: 'object',
      itemTemplate: {
        pujaName: '',
        date: '',
        time: '',
        location: '',
        description: ''
      }
    },
    { 
      id: 'schedules', 
      label: '📅 সময়সূচী', 
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/schedules.json',
      path: 'public/data/schedules.json',
      type: 'array',
      itemTemplate: {
        id: '',
        title: '',
        date: '',
        time: '',
        location: '',
        description: ''
      }
    },
    { 
      id: 'songs', 
      label: '🎵 গান', 
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/songs.json',
      path: 'public/data/songs.json',
      type: 'array',
      itemTemplate: {
        id: '',
        title: '',
        artist: '',
        audioUrl: '',
        duration: '',
        category: ''
      }
    },
  ];

  const currentFile = JSON_FILES.find(f => f.id === selectedFile);

  // Load JSON file
  useEffect(() => {
    const fetchJSON = async () => {
      setLoading(true);
      setError('');
      try {
        const file = JSON_FILES.find(f => f.id === selectedFile);
        if (!file) {
          setError('ফাইল খুঁজে পাওয়া যায়নি');
          setLoading(false);
          return;
        }
        
        const response = await fetch(file.url, { 
          cache: 'no-cache',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        let dataArray: any[] = [];
        
        if (Array.isArray(data)) {
          dataArray = data;
        } else if (data && typeof data === 'object') {
          if (selectedFile === 'galleryImages') {
            const allImages: any[] = [];
            Object.keys(data).forEach(category => {
              if (Array.isArray(data[category])) {
                data[category].forEach((img: any) => {
                  allImages.push({ ...img, category });
                });
              }
            });
            dataArray = allImages;
          } else {
            dataArray = [data];
          }
        }
        
        if (dataArray.length === 0) {
          dataArray = [file.itemTemplate || {}];
        }
        
        setJsonData(dataArray);
        setSelectedItemIndex(0);
        setFormData({ ...dataArray[0] });
        
      } catch (error: any) {
        console.error('Error loading JSON:', error);
        setError(`ডেটা লোড করতে সমস্যা: ${error.message}`);
        const file = JSON_FILES.find(f => f.id === selectedFile);
        setJsonData([file?.itemTemplate || {}]);
        setFormData(file?.itemTemplate || {});
      }
      setLoading(false);
    };
    fetchJSON();
  }, [selectedFile]);

  // Update form when item changes
  useEffect(() => {
    if (jsonData.length > 0 && jsonData[selectedItemIndex]) {
      setFormData({ ...jsonData[selectedItemIndex] });
    }
  }, [selectedItemIndex, jsonData]);

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveItem = () => {
    const updatedData = [...jsonData];
    updatedData[selectedItemIndex] = { ...formData };
    setJsonData(updatedData);
    alert('✅ পরিবর্তন সংরক্ষিত হয়েছে! এখন JSON কপি করে GitHub এ আপলোড করুন।');
  };

  const handleAddItem = () => {
    const newItem = { ...currentFile?.itemTemplate };
    // Generate new ID
    const maxId = jsonData.reduce((max, item) => {
      const id = parseInt(item.id) || 0;
      return id > max ? id : max;
    }, 0);
    if (newItem.id !== undefined) {
      newItem.id = String(maxId + 1);
    }
    
    const updatedData = [...jsonData, newItem];
    setJsonData(updatedData);
    setSelectedItemIndex(updatedData.length - 1);
    setFormData({ ...newItem });
    alert('➕ নতুন আইটেম যোগ করা হয়েছে!');
  };

  const handleDeleteItem = () => {
    if (jsonData.length <= 1) {
      alert('❌ কমপক্ষে একটি আইটেম থাকতে হবে!');
      return;
    }
    
    if (!confirm('⚠️ আপনি কি নিশ্চিত এই আইটেমটি মুছতে চান?')) {
      return;
    }
    
    const updatedData = jsonData.filter((_, index) => index !== selectedItemIndex);
    setJsonData(updatedData);
    const newIndex = selectedItemIndex > 0 ? selectedItemIndex - 1 : 0;
    setSelectedItemIndex(newIndex);
    setFormData({ ...updatedData[newIndex] });
    alert('🗑️ আইটেম মুছে ফেলা হয়েছে!');
  };

  const handleCopyJSON = () => {
    let finalData: any;
    
    if (selectedFile === 'galleryImages') {
      finalData = {};
      jsonData.forEach((item: any) => {
        const category = item.category || 'uncategorized';
        if (!finalData[category]) {
          finalData[category] = [];
        }
        const { category: _, ...itemWithoutCategory } = item;
        finalData[category].push(itemWithoutCategory);
      });
    } else if (currentFile?.type === 'object' && jsonData.length === 1) {
      finalData = jsonData[0];
    } else {
      finalData = jsonData;
    }
    
    const jsonString = JSON.stringify(finalData, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Label mapping
  const labelMap: Record<string, string> = {
    id: 'আইডি', title: 'শিরোনাম', name: 'নাম', description: 'বর্ণনা', details: 'বিবরণ',
    date: 'তারিখ (বাংলা)', dateEn: 'তারিখ (ইংরেজি)', year: 'বছর', month: 'মাস', time: 'সময়',
    priority: 'প্রাধান্য', category: 'ক্যাটাগরি', type: 'ধরন',
    question: 'প্রশ্ন', answer: 'উত্তর', keywords: 'কীওয়ার্ড',
    role: 'পদবী', phone: 'ফোন', email: 'ইমেইল', address: 'ঠিকানা',
    username: 'ইউজারনেম', password: 'পাসওয়ার্ড',
    imageUrl: 'ছবির লিংক', image: 'ছবি', thumbnail: 'থাম্বনেইল', caption: 'ক্যাপশন',
    audioUrl: 'অডিও লিংক', videoUrl: 'ভিডিও লিংক',
    url: 'লিংক', pdfUrl: 'PDF লিংক', streamUrl: 'স্ট্রিম লিংক',
    location: 'স্থান', venue: 'অনুষ্ঠানস্থল',
    artist: 'শিল্পী', duration: 'সময়কাল',
    channelName: 'চ্যানেল নাম', fileName: 'ফাইলের নাম',
    pujaName: 'পূজার নাম'
  };

  const renderFormField = (key: string, value: any) => {
    if (key.startsWith('_')) return null;
    const label = labelMap[key] || key;
    if (value === undefined || value === null) return null;

    // ID - readonly
    if (key === 'id') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <input type="text" value={String(formData[key] || '')} disabled 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
        </div>
      );
    }

    // Long text - textarea
    if (typeof value === 'string' && (value.length > 100 || ['details', 'answer', 'description', 'address'].includes(key))) {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <textarea value={String(formData[key] || '')} onChange={(e) => handleFieldChange(key, e.target.value)} rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-y" />
        </div>
      );
    }

    // Priority
    if (key === 'priority') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <select value={String(formData[key] || 'medium')} onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
            <option value="high">🔴 উচ্চ</option>
            <option value="medium">🟡 মাঝারি</option>
            <option value="low">🟢 নিম্ন</option>
          </select>
        </div>
      );
    }

    // Role
    if (key === 'role') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <select value={String(formData[key] || 'Member')} onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>
        </div>
      );
    }

    // Gallery category
    if (key === 'category' && selectedFile === 'galleryImages') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <select value={String(formData[key] || 'festivals')} onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
            <option value="festivals">উৎসব</option>
            <option value="events">অনুষ্ঠান</option>
            <option value="cultural">সাংস্কৃতিক</option>
          </select>
        </div>
      );
    }

    // Date
    if ((key.toLowerCase().includes('date') || key === 'dateEn') && typeof value === 'string') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <input type={key === 'dateEn' ? 'date' : 'text'} value={String(formData[key] || '')} 
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
        </div>
      );
    }

    // Boolean
    if (typeof value === 'boolean') {
      return (
        <div key={key} className="mb-4 flex items-center">
          <input type="checkbox" checked={Boolean(formData[key])} 
            onChange={(e) => handleFieldChange(key, e.target.checked)}
            className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500" />
          <label className="ml-3 text-sm font-semibold text-gray-700">{label}</label>
        </div>
      );
    }

    // Array
    if (Array.isArray(value)) {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label} <span className="text-xs text-gray-500">(কমা দিয়ে আলাদা করুন)</span>
          </label>
          <input type="text" value={(formData[key] || []).join(', ')}
            onChange={(e) => handleFieldChange(key, e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
        </div>
      );
    }

    // Number
    if (typeof value === 'number') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <input type="number" value={formData[key] || ''} 
            onChange={(e) => handleFieldChange(key, parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
        </div>
      );
    }

    // Default text
    return (
      <div key={key} className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <input type="text" value={String(formData[key] || '')} 
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
      </div>
    );
  };

  const generatedJSON = (() => {
    let finalData: any;
    if (selectedFile === 'galleryImages') {
      finalData = {};
      jsonData.forEach((item: any) => {
        const category = item.category || 'uncategorized';
        if (!finalData[category]) finalData[category] = [];
        const { category: _, ...rest } = item;
        finalData[category].push(rest);
      });
    } else if (currentFile?.type === 'object' && jsonData.length === 1) {
      finalData = jsonData[0];
    } else {
      finalData = jsonData;
    }
    return JSON.stringify(finalData, null, 2);
  })();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <Settings className="w-7 h-7" />
          JSON এডিটর (Super Admin)
        </h2>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-blue-800 font-medium">ℹ️ স্মার্ট এডিটর</p>
        <p className="text-sm text-blue-700 mt-1">
          আইটেম যোগ/মুছুন, এডিট করুন এবং JSON কপি করে GitHub এ আপলোড করুন।
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-800 font-medium">❌ সমস্যা: {error}</p>
        </div>
      )}

      {/* File Selector */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <label className="block text-sm font-bold text-gray-700 mb-3">📁 ফাইল নির্বাচন করুন:</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
          {JSON_FILES.map(file => (
            <button key={file.id} onClick={() => setSelectedFile(file.id)}
              className={cn("px-3 py-2 rounded-lg text-sm font-medium transition",
                selectedFile === file.id ? "bg-orange-500 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-orange-50")}>
              {file.label}
            </button>
          ))}
        </div>
        {currentFile && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              📂 <code className="bg-gray-800 text-green-400 px-2 py-1 rounded text-xs">{currentFile.path}</code>
            </p>
          </div>
        )}
      </div>

      {/* Item Selector + Actions */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-gray-700">
            📋 আইটেম ({jsonData.length} টি):
          </label>
          <div className="flex gap-2">
            <button onClick={handleAddItem} 
              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition">
              <Plus className="w-4 h-4" /> নতুন যোগ করুন
            </button>
            <button onClick={handleDeleteItem} disabled={jsonData.length <= 1}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition disabled:bg-gray-400">
              <Trash2 className="w-4 h-4" /> মুছুন
            </button>
          </div>
        </div>
        <select value={selectedItemIndex} onChange={(e) => setSelectedItemIndex(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
          {jsonData.map((item: any, index: number) => (
            <option key={index} value={index}>
              #{index + 1} - {item.title || item.name || item.question || item.channelName || item.fileName || `আইটেম ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-orange-500">
            <h3 className="text-lg font-bold text-orange-600">✏️ ফর্ম এডিট করুন</h3>
            <button onClick={handleSaveItem}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
              <Save className="w-4 h-4" /> সংরক্ষণ
            </button>
          </div>
          <div className="max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-3 text-gray-600">লোডিং...</p>
              </div>
            ) : (
              Object.keys(formData).map(key => renderFormField(key, formData[key]))
            )}
          </div>
        </div>

        {/* Right: JSON */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
            <h3 className="text-white font-bold">💻 JSON কোড</h3>
            <button onClick={handleCopyJSON}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? '✅ কপি হয়েছে!' : '📋 কপি করুন'}
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 text-xs font-mono overflow-auto max-h-[700px] custom-scrollbar">
            <code>{generatedJSON}</code>
          </pre>
          <div className="bg-yellow-50 border-t-2 border-yellow-400 p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ <code className="bg-yellow-200 px-1 rounded">{currentFile?.path}</code> এ পেস্ট করুন
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h3 className="font-bold mb-3">📝 GitHub আপডেট:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
          <li>"📋 কপি করুন" ক্লিক করুন</li>
          <li><a href="https://github.com/tkmani91/KHD" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline">GitHub</a> → <code className="bg-gray-100 px-1 rounded text-xs">{currentFile?.path}</code></li>
          <li>✏️ Edit → পেস্ট → Commit</li>
        </ol>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ff6b35; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default JSONEditor;
