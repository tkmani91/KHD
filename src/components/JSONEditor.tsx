import React, { useState, useEffect } from 'react';
import { Settings, Copy, Check, Plus, Trash2, Save, Image as ImageIcon, Music, FileText } from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface JSONFile {
  id: string;
  label: string;
  url: string;
  path: string;
  type: 'simple-array' | 'complex-object' | 'nested-sections';
  sections?: string[];
  hasImagePreview?: boolean;
  hasAudioPreview?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

const JSONEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('dynamicContent');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [rawData, setRawData] = useState<any>(null);
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ============================================
  // JSON FILES CONFIGURATION
  // ============================================

  const JSON_FILES: JSONFile[] = [
    {
      id: 'dynamicContent',
      label: '📰 ডাইনামিক কন্টেন্ট',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/dynamicContent.json',
      path: 'dynamicContent.json',
      type: 'nested-sections',
      sections: ['notices', 'liveStream', 'fundCollection']
    },
    {
      id: 'membersData',
      label: '👥 সদস্য তথ্য',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-data.json',
      path: 'members-data.json',
      type: 'nested-sections',
      sections: ['members', 'contacts', 'invitations', 'pdfLinks'],
      hasImagePreview: true
    },
    {
      id: 'loginData',
      label: '🔐 লগইন ডেটা',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-login.json',
      path: 'members-login.json',
      type: 'nested-sections',
      sections: ['accountsMembers', 'normalMembers']
    },
    {
      id: 'chatbotData',
      label: '💬 চ্যাটবট',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/chatbot-data.json',
      path: 'chatbot-data.json',
      type: 'complex-object',
      sections: ['welcomeMessage', 'quickReplies', 'faq', 'fallbackMessages']
    },
    {
      id: 'galleryImages',
      label: '🖼️ গ্যালারি',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/gallery-images.json',
      path: 'gallery-images.json',
      type: 'simple-array',
      hasImagePreview: true
    },
    {
      id: 'accountsPDFs',
      label: '📊 হিসাব PDF',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/accountsPDFs.json',
      path: 'public/data/accountsPDFs.json',
      type: 'nested-sections',
      sections: ['durgaPuja', 'shyamaPuja', 'saraswatiPuja', 'rathYatra']
    },
    {
      id: 'liveChannels',
      label: '📺 লাইভ চ্যানেল',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/liveChannels.json',
      path: 'public/data/liveChannels.json',
      type: 'simple-array'
    },
    {
      id: 'pdfFiles',
      label: '📄 PDF ফাইল',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/pdfFiles.json',
      path: 'public/data/pdfFiles.json',
      type: 'simple-array'
    },
    {
      id: 'pujaData',
      label: '🙏 পূজা তথ্য',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/pujaData.json',
      path: 'public/data/pujaData.json',
      type: 'simple-array',
      hasImagePreview: true
    },
    {
      id: 'schedules',
      label: '📅 সময়সূচী',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/schedules.json',
      path: 'public/data/schedules.json',
      type: 'nested-sections',
      sections: ['durga', 'shyama', 'saraswati', 'rath']
    },
    {
      id: 'songs',
      label: '🎵 গান',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/songs.json',
      path: 'public/data/songs.json',
      type: 'simple-array',
      hasAudioPreview: true
    }
  ];

  const currentFile = JSON_FILES.find(f => f.id === selectedFile);

  // ============================================
  // SECTION LABELS
  // ============================================

  const sectionLabels: Record<string, string> = {
    // dynamicContent
    notices: '📢 ঘোষণা',
    liveStream: '📺 লাইভ স্ট্রিম',
    fundCollection: '💰 চাঁদা সংগ্রহ',
    
    // members-data
    members: '👥 সদস্য তালিকা',
    contacts: '📞 যোগাযোগ',
    invitations: '💌 নিমন্ত্রণ',
    pdfLinks: '📄 PDF লিংক',
    
    // members-login
    accountsMembers: '🔑 Admin সদস্য',
    normalMembers: '👤 সাধারণ সদস্য',
    
    // chatbot
    welcomeMessage: '👋 স্বাগত বার্তা',
    quickReplies: '⚡ দ্রুত উত্তর',
    faq: '❓ FAQ',
    fallbackMessages: '🔄 Fallback মেসেজ',
    
    // accountsPDFs
    durgaPuja: '🎉 দূর্গাপূজা',
    shyamaPuja: '🔱 শ্যামাপূজা',
    saraswatiPuja: '📚 সরস্বতী পূজা',
    rathYatra: '🎪 রথযাত্রা',
    
    // schedules
    durga: '🎉 দূর্গাপূজা',
    shyama: '🔱 শ্যামাপূজা',
    saraswati: '📚 সরস্বতী পূজা',
    rath: '🎪 রথযাত্রা'
  };

  // ============================================
  // LOAD JSON DATA
  // ============================================

  useEffect(() => {
    const fetchJSON = async () => {
      setLoading(true);
      setError('');
      try {
        const file = JSON_FILES.find(f => f.id === selectedFile);
        if (!file) {
          setError('ফাইল পাওয়া যায়নি');
          setLoading(false);
          return;
        }

        const response = await fetch(file.url, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        setRawData(data);

        // Handle different file types
        if (file.type === 'simple-array') {
          setJsonData(Array.isArray(data) ? data : []);
          setSelectedItemIndex(0);
          setFormData(data[0] || {});
          setSelectedSection('');
        } else if (file.type === 'nested-sections' && file.sections) {
          setSelectedSection(file.sections[0]);
          processSection(data, file.sections[0]);
        } else if (file.type === 'complex-object') {
          setSelectedSection(file.sections?.[0] || '');
          if (file.sections?.[0]) {
            processSection(data, file.sections[0]);
          }
        }

      } catch (err: any) {
        console.error('Error:', err);
        setError(`লোড সমস্যা: ${err.message}`);
      }
      setLoading(false);
    };
    fetchJSON();
  }, [selectedFile]);

  // ============================================
  // PROCESS SECTION
  // ============================================

  const processSection = (data: any, section: string) => {
    if (!data || !data[section]) {
      setJsonData([]);
      setFormData({});
      return;
    }

    const sectionData = data[section];

    if (Array.isArray(sectionData)) {
      setJsonData(sectionData);
      setSelectedItemIndex(0);
      setFormData(sectionData[0] || {});
    } else if (typeof sectionData === 'object') {
      setJsonData([sectionData]);
      setFormData(sectionData);
      setSelectedItemIndex(0);
    } else if (typeof sectionData === 'string') {
      // For welcomeMessage
      setJsonData([{ value: sectionData }]);
      setFormData({ value: sectionData });
      setSelectedItemIndex(0);
    }
  };

  useEffect(() => {
    if (rawData && selectedSection && currentFile?.type !== 'simple-array') {
      processSection(rawData, selectedSection);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (jsonData.length > 0 && jsonData[selectedItemIndex]) {
      setFormData({ ...jsonData[selectedItemIndex] });
    }
  }, [selectedItemIndex, jsonData]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveItem = () => {
    const updatedData = [...jsonData];
    updatedData[selectedItemIndex] = { ...formData };
    setJsonData(updatedData);
    
    // Update rawData if needed
    if (selectedSection && rawData && currentFile?.type !== 'simple-array') {
      const newRawData = { ...rawData };
      newRawData[selectedSection] = Array.isArray(newRawData[selectedSection]) 
        ? updatedData 
        : updatedData[0];
      setRawData(newRawData);
    }
    
    alert('✅ সংরক্ষিত! JSON কপি করে GitHub এ আপলোড করুন।');
  };

  const handleAddItem = () => {
    if (!Array.isArray(jsonData)) return;
    
    const template = jsonData[0] ? { ...jsonData[0] } : {};
    Object.keys(template).forEach(key => {
      if (key === 'id') {
        const maxId = jsonData.reduce((max, item) => {
          const id = parseInt(item.id) || 0;
          return id > max ? id : max;
        }, 0);
        template[key] = String(maxId + 1);
      } else if (typeof template[key] === 'string') template[key] = '';
      else if (typeof template[key] === 'number') template[key] = 0;
      else if (Array.isArray(template[key])) template[key] = [];
    });
    
    const updatedData = [...jsonData, template];
    setJsonData(updatedData);
    setSelectedItemIndex(updatedData.length - 1);
    setFormData(template);
    alert('➕ নতুন আইটেম যোগ হয়েছে!');
  };

  const handleDeleteItem = () => {
    if (jsonData.length <= 1) {
      alert('❌ কমপক্ষে একটি আইটেম থাকতে হবে!');
      return;
    }
    if (!window.confirm('⚠️ মুছতে চান?')) return;
    
    const updatedData = jsonData.filter((_, i) => i !== selectedItemIndex);
    setJsonData(updatedData);
    const newIndex = Math.max(0, selectedItemIndex - 1);
    setSelectedItemIndex(newIndex);
    setFormData(updatedData[newIndex] || {});
    alert('🗑️ মুছে ফেলা হয়েছে!');
  };

  const handleCopyJSON = () => {
    let finalData: any;

    if (currentFile?.type === 'simple-array') {
      finalData = jsonData;
    } else if (currentFile?.type === 'nested-sections' && rawData) {
      finalData = { ...rawData };
      if (selectedSection) {
        finalData[selectedSection] = Array.isArray(rawData[selectedSection]) 
          ? jsonData 
          : jsonData[0];
      }
    } else if (currentFile?.type === 'complex-object' && rawData) {
      finalData = { ...rawData };
      if (selectedSection) {
        if (selectedSection === 'welcomeMessage') {
          finalData[selectedSection] = formData.value || '';
        } else {
          finalData[selectedSection] = jsonData;
        }
      }
    }

    navigator.clipboard.writeText(JSON.stringify(finalData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ============================================
  // LABEL MAPPING
  // ============================================

  const labelMap: Record<string, string> = {
    id: 'আইডি', title: 'শিরোনাম', name: 'নাম', description: 'বর্ণনা', details: 'বিবরণ',
    date: 'তারিখ', dateEn: 'তারিখ (EN)', year: 'বছর', month: 'মাস', time: 'সময়', day: 'দিন',
    priority: 'প্রাধান্য', category: 'ক্যাটাগরি', status: 'স্ট্যাটাস',
    question: 'প্রশ্ন', answer: 'উত্তর', keywords: 'কীওয়ার্ড',
    role: 'পদবী', phone: 'ফোন', email: 'ইমেইল', address: 'ঠিকানা',
    username: 'ইউজারনেম', password: 'পাসওয়ার্ড',
    imageUrl: 'ছবি URL', image: 'ছবি', photo: 'ফটো', thumbnail: 'থাম্বনেইল', 
    caption: 'ক্যাপশন', logo: 'লোগো',
    audioUrl: 'অডিও URL', url: 'লিংক', pdfUrl: 'PDF URL', streamUrl: 'স্ট্রিম URL',
    location: 'স্থান', artist: 'শিল্পী', duration: 'সময়কাল',
    channelName: 'চ্যানেল', fileName: 'ফাইল নাম', size: 'সাইজ',
    pujaName: 'পূজার নাম', pujaType: 'পূজার ধরন',
    mobile: 'মোবাইল', occupation: 'পেশা', designation: 'পদবী',
    bloodGroup: 'রক্তের গ্রুপ', birthDate: 'জন্ম তারিখ', gotra: 'গোত্র',
    fatherName: 'পিতার নাম', motherName: 'মাতার নাম',
    permanentAddress: 'স্থায়ী ঠিকানা',
    area: 'এলাকা', personName: 'ব্যক্তির নাম', familyCount: 'পরিবার সংখ্যা',
    dueAmount: 'বকেয়া', paidAmount: 'পরিশোধিত', remainingAmount: 'অবশিষ্ট',
    lastPaymentDate: 'শেষ পেমেন্ট', paymentMethod: 'পেমেন্ট মাধ্যম',
    transactionId: 'ট্রানজেকশন ID',
    isLive: 'লাইভ?', isActive: 'সক্রিয়?',
    streamType: 'স্ট্রিম টাইপ', offlineMessage: 'অফলাইন মেসেজ',
    message: 'মেসেজ', instructions: 'নির্দেশনা',
    totalDue: 'মোট বকেয়া', totalPaid: 'মোট পরিশোধ', totalRemaining: 'মোট অবশিষ্ট',
    lastUpdated: 'সর্বশেষ আপডেট',
    facebookLink: 'Facebook লিংক',
    event: 'অনুষ্ঠান',
    value: 'মান'
  };

  // ============================================
  // RENDER FORM FIELD
  // ============================================

  const renderFormField = (key: string, value: any) => {
    if (key.startsWith('_') || value === undefined) return null;
    
    const label = labelMap[key] || key;
    const fileConfig = currentFile;

    // ID - readonly
    if (key === 'id') {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <input type="text" value={String(formData[key] || '')} disabled 
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed text-sm" />
        </div>
      );
    }

    // Image preview fields
    if (fileConfig?.hasImagePreview && (key === 'url' || key === 'imageUrl' || key === 'image' || key === 'photo' || key === 'thumbnail')) {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            {label}
          </label>
          <input type="text" value={String(formData[key] || '')} 
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm mb-2" />
          {formData[key] && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg border">
              <img src={formData[key]} alt="Preview" 
                className="w-full h-32 object-cover rounded" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image'; }}
              />
            </div>
          )}
        </div>
      );
    }

    // Audio preview fields
    if (fileConfig?.hasAudioPreview && (key === 'url' || key === 'audioUrl')) {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Music className="w-4 h-4" />
            {label}
          </label>
          <input type="text" value={String(formData[key] || '')} 
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm mb-2" />
          {formData[key] && (
            <audio controls className="w-full mt-2">
              <source src={formData[key]} type="audio/mpeg" />
            </audio>
          )}
        </div>
      );
    }

    // Long text - textarea
    if (typeof value === 'string' && (value.length > 100 || ['details', 'answer', 'description', 'address', 'message', 'offlineMessage', 'permanentAddress'].includes(key))) {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <textarea value={String(formData[key] || '')} 
            onChange={(e) => handleFieldChange(key, e.target.value)} 
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 resize-y text-sm" />
        </div>
      );
    }

    // Priority
    if (key === 'priority') {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <select value={String(formData[key] || 'medium')} 
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm">
            <option value="high">🔴 উচ্চ</option>
            <option value="medium">🟡 মাঝারি</option>
            <option value="low">🟢 নিম্ন</option>
          </select>
        </div>
      );
    }

    // Status
    if (key === 'status') {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <select value={String(formData[key] || '')} 
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm">
            <option value="paid">✅ পরিশোধিত</option>
            <option value="partial">🟡 আংশিক</option>
            <option value="unpaid">❌ বকেয়া</option>
          </select>
        </div>
      );
    }

    // Role
    if (key === 'role') {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <select value={String(formData[key] || 'Member')} 
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm">
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>
        </div>
      );
    }

    // Boolean
    if (typeof value === 'boolean') {
      return (
        <div key={key} className="form-field flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <input type="checkbox" checked={Boolean(formData[key])} 
            onChange={(e) => handleFieldChange(key, e.target.checked)}
            className="w-5 h-5 text-orange-500 rounded" />
          <label className="font-semibold text-gray-700 text-sm">{label}</label>
        </div>
      );
    }

    // Array - simple
    if (Array.isArray(value) && value.every(v => typeof v === 'string')) {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label} <span className="text-xs text-gray-500">(প্রতি লাইনে একটি)</span>
          </label>
          <textarea 
            value={(formData[key] || []).join('\n')}
            onChange={(e) => handleFieldChange(key, e.target.value.split('\n').filter(Boolean))}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
      );
    }

    // Array - objects (complex)
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label} <span className="text-xs text-gray-500">({value.length} items - JSON এডিট করুন)</span>
          </label>
          <textarea
            value={JSON.stringify(formData[key], null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleFieldChange(key, parsed);
              } catch {}
            }}
            rows={6}
            className="w-full px-3 py-2 font-mono text-xs border rounded-lg focus:ring-2 focus:ring-orange-500 bg-gray-50"
          />
        </div>
      );
    }

    // Number
    if (typeof value === 'number') {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <input type="number" value={formData[key] || 0} 
            onChange={(e) => handleFieldChange(key, parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm" />
        </div>
      );
    }

    // Nested object
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label} <span className="text-xs text-gray-500">(Nested Object - JSON এডিট করুন)</span>
          </label>
          <textarea
            value={JSON.stringify(formData[key], null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleFieldChange(key, parsed);
              } catch {}
            }}
            rows={8}
            className="w-full px-3 py-2 font-mono text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 bg-blue-50"
          />
        </div>
      );
    }

    // Default text input
    return (
      <div key={key} className="form-field">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <input type="text" value={String(formData[key] || '')} 
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm" />
      </div>
    );
  };

  // ============================================
  // GENERATE JSON
  // ============================================

  const generatedJSON = (() => {
    let finalData: any;

    if (currentFile?.type === 'simple-array') {
      const updated = [...jsonData];
      if (updated.length > 0) updated[selectedItemIndex] = formData;
      finalData = updated;
    } else if (currentFile?.type === 'nested-sections' && rawData) {
      finalData = { ...rawData };
      if (selectedSection) {
        const updated = [...jsonData];
        updated[selectedItemIndex] = formData;
        finalData[selectedSection] = Array.isArray(rawData[selectedSection]) ? updated : updated[0];
      }
    } else if (currentFile?.type === 'complex-object' && rawData) {
      finalData = { ...rawData };
      if (selectedSection === 'welcomeMessage') {
        finalData[selectedSection] = formData.value || '';
      } else if (selectedSection) {
        finalData[selectedSection] = jsonData;
      }
    }

    return JSON.stringify(finalData, null, 2);
  })();

  const btnClass = (active: boolean) => 
    `px-3 py-2 rounded-lg text-sm font-medium transition ${active ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-orange-50'}`;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="w-7 h-7 text-orange-500" />
        <h2 className="text-2xl font-bold text-orange-600">JSON এডিটর (Super Admin)</h2>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-blue-800 font-medium">✨ Advanced JSON Editor</p>
        <p className="text-sm text-blue-700">১১টি JSON ফাইল • Section-based Editing • Image/Audio Preview • Real-time Update</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-800 font-semibold">❌ {error}</p>
        </div>
      )}

      {/* File Selector */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <label className="block text-sm font-bold text-gray-700 mb-3">📁 ফাইল নির্বাচন:</label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {JSON_FILES.map(file => (
            <button key={file.id} onClick={() => setSelectedFile(file.id)} 
              className={btnClass(selectedFile === file.id)}>
              {file.label}
            </button>
          ))}
        </div>
        {currentFile && (
          <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
            📂 <code>{currentFile.path}</code>
          </div>
        )}
      </div>

      {/* Section Selector */}
      {currentFile?.sections && currentFile.sections.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <label className="block text-sm font-bold text-gray-700 mb-3">📂 সেকশন নির্বাচন:</label>
          <div className="flex flex-wrap gap-2">
            {currentFile.sections.map(section => (
              <button key={section} onClick={() => setSelectedSection(section)}
                className={btnClass(selectedSection === section)}>
                {sectionLabels[section] || section}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Item Selector + Actions */}
      {Array.isArray(jsonData) && jsonData.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <label className="text-sm font-bold text-gray-700">
              📋 আইটেম ({jsonData.length} টি):
            </label>
            <div className="flex gap-2">
              <button onClick={handleAddItem} 
                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition">
                <Plus className="w-4 h-4" /> যোগ
              </button>
              <button onClick={handleDeleteItem} disabled={jsonData.length <= 1}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:bg-gray-400 transition">
                <Trash2 className="w-4 h-4" /> মুছুন
              </button>
            </div>
          </div>
          {jsonData.length > 1 && (
            <select value={selectedItemIndex} 
              onChange={(e) => setSelectedItemIndex(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm">
              {jsonData.map((item: any, i: number) => (
                <option key={i} value={i}>
                  #{i + 1} - {item.title || item.name || item.question || item.channelName || `আইটেম ${i + 1}`}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-orange-500">
            <h3 className="text-lg font-bold text-orange-600">✏️ ফর্ম এডিট</h3>
            <button onClick={handleSaveItem} 
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600">
              <Save className="w-4 h-4" /> সংরক্ষণ
            </button>
          </div>
          <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="mt-3 text-gray-600">লোডিং...</p>
              </div>
            ) : Object.keys(formData).length > 0 ? (
              Object.keys(formData).map(key => renderFormField(key, formData[key]))
            ) : (
              <p className="text-center text-gray-500 py-10">কোন ডেটা নেই</p>
            )}
          </div>
        </div>

        {/* Right: JSON Code */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900">
            <h3 className="text-white font-bold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              JSON কোড
            </h3>
            <button onClick={handleCopyJSON} 
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? '✅ কপি হয়েছে!' : '📋 কপি'}
            </button>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 text-xs font-mono overflow-auto max-h-[600px]">
            <code>{generatedJSON}</code>
          </pre>
          <div className="bg-yellow-50 border-t-2 border-yellow-400 p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ <code className="bg-yellow-200 px-1 rounded font-semibold">{currentFile?.path}</code> এ পেস্ট করুন
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 shadow-lg border-l-4 border-purple-500">
        <h3 className="font-bold mb-3 text-purple-800 flex items-center gap-2">
          <span className="text-lg">📝</span> GitHub এ আপডেট করার পদ্ধতি:
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-purple-900">
          <li>"📋 কপি" বাটনে ক্লিক করুন</li>
          <li><a href="https://github.com/tkmani91/KHD" target="_blank" rel="noopener noreferrer" 
            className="text-orange-600 underline font-semibold hover:text-orange-700">GitHub Repository</a> তে যান</li>
          <li><code className="bg-purple-100 px-2 py-1 rounded text-xs">{currentFile?.path}</code> ফাইলটি খুলুন</li>
          <li>✏️ Edit → পেস্ট → Commit</li>
          <li>২-৩ মিনিট পর সাইটে রিফ্রেশ করুন 🔄</li>
        </ol>
      </div>
    </div>
  );
};

export default JSONEditor;
