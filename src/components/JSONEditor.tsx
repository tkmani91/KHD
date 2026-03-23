mport React, { useState, useEffect } from 'react';
import { Settings, Copy, Check, Plus, Trash2, Save, Image as ImageIcon, Music, FileText } from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface JSONFile {
  id: string;
  label: string;
  url: string;
  path: string;
  type: 'simple-array' | 'complex-object' | 'nested-sections' | 'gallery-special' | 'accounts-special';
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
  
  // Gallery special states
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedPujaType, setSelectedPujaType] = useState<string>('');
  
  // Accounts PDF special states
  const [selectedPdfYear, setSelectedPdfYear] = useState<string>('');

  // ============================================
  // JSON FILES CONFIGURATION
  // ============================================

  const JSON_FILES: JSONFile[] = [
    {
      id: 'dynamicContent',
      label: '📰 সদস্য আয় হিসাব',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/dynamicContent.json',
      path: 'dynamicContent.json',
      type: 'nested-sections',
      sections: ['notices', 'liveStream', 'fundCollection', 'members', 'paymentStats']
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
      type: 'gallery-special',
      hasImagePreview: true
    },
    {
      id: 'accountsPDFs',
      label: '📊 বাৎসরিক হিসাব',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/accountsPDFs.json',
      path: 'public/data/accountsPDFs.json',
      type: 'accounts-special',
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
      label: '📄 পূজাদ্রব্যের তালিকা',
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
  // PUJA TYPES FOR GALLERY
  // ============================================

  const PUJA_TYPES = [
    { id: 'durga', label: '🎉 দুর্গাপূজা', value: 'দুর্গাপূজা' },
    { id: 'shyama', label: '🔱 শ্যামাপূজা', value: 'শ্যামাপূজা' },
    { id: 'saraswati', label: '📚 সরস্বতী পূজা', value: 'সরস্বতী পূজা' },
    { id: 'rath', label: '🎪 রথযাত্রা', value: 'রথযাত্রা' },
    { id: 'other', label: '🙏 অন্যান্য', value: 'অন্যান্য' }
  ];

  // ============================================
  // SECTION LABELS
  // ============================================

  const sectionLabels: Record<string, string> = {
    // dynamicContent
    notices: '📢 ঘোষণা',
    liveStream: '📺 লাইভ স্ট্রিম',
    fundCollection: '💰 চাঁদা সংগ্রহ',
    members: '👥 সদস্য তালিকা',
    paymentStats: '📊 পেমেন্ট পরিসংখ্যান',
    
    // members-data
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
    durgaPuja: '🎉 দুর্গাপূজা',
    shyamaPuja: '🔱 শ্যামাপূজা',
    saraswatiPuja: '📚 সরস্বতী পূজা',
    rathYatra: '🎪 রথযাত্রা',
    
    // schedules
    durga: '🎉 দুর্গাপূজা',
    shyama: '🔱 শ্যামাপূজা',
    saraswati: '📚 সরস্বতী পূজা',
    rath: '🎪 রথযাত্রা'
  };

  // ============================================
  // SCHEDULE DAY LABELS (for schedules.json)
  // ============================================

  const scheduleDayLabels: Record<string, string> = {
    'mahalaya': 'মহালয়া',
    'panchami': 'পঞ্চমী',
    'shasthi': 'ষষ্ঠী',
    'saptami': 'সপ্তমী',
    'ashtami': 'অষ্টমী',
    'navami': 'নবমী',
    'dashami': 'দশমী',
    'ekadashi': 'একাদশী',
    'kaliPuja': 'কালীপূজা',
    'lakshmiPuja': 'লক্ষ্মীপূজা',
    'saraswatiPuja': 'সরস্বতী পূজা',
    'rathYatra': 'রথযাত্রা',
    'ultoRath': 'উল্টোরথ'
  };

  // ============================================
  // LOAD JSON DATA
  // ============================================

  useEffect(() => {
    const fetchJSON = async () => {
      setLoading(true);
      setError('');
      setSelectedYear('');
      setSelectedPujaType('');
      setSelectedPdfYear('');
      
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
        } else if (file.type === 'gallery-special') {
          // Gallery special handling
          handleGalleryData(data);
        } else if (file.type === 'accounts-special') {
          // Accounts PDF special handling
          setSelectedSection(file.sections?.[0] || 'durgaPuja');
          handleAccountsPdfData(data, file.sections?.[0] || 'durgaPuja');
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
  // HANDLE GALLERY DATA
  // ============================================

  const handleGalleryData = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      setJsonData([]);
      setFormData({});
      return;
    }

    // Extract unique years
    const years = [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
    const firstYear = years[0]?.toString() || '';
    setSelectedYear(firstYear);

    // Extract unique puja types for first year
    const yearData = data.filter(item => item.year?.toString() === firstYear);
    const pujaTypes = [...new Set(yearData.map(item => item.pujaType || item.category))];
    const firstPujaType = pujaTypes[0] || '';
    setSelectedPujaType(firstPujaType);

    // Filter data
    const filteredData = yearData.filter(item => (item.pujaType || item.category) === firstPujaType);
    setJsonData(filteredData);
    setSelectedItemIndex(0);
    setFormData(filteredData[0] || {});
  };

  // ============================================
  // HANDLE ACCOUNTS PDF DATA
  // ============================================

  const handleAccountsPdfData = (data: any, section: string) => {
    if (!data || !data[section]) {
      setJsonData([]);
      setFormData({});
      return;
    }

    const sectionData = data[section];
    if (sectionData.years && typeof sectionData.years === 'object') {
      const years = Object.keys(sectionData.years).sort((a, b) => parseInt(b) - parseInt(a));
      const firstYear = years[0] || '';
      setSelectedPdfYear(firstYear);
      
      if (firstYear && sectionData.years[firstYear]) {
        setFormData({ 
          year: firstYear, 
          url: sectionData.years[firstYear] 
        });
        setJsonData(years.map(y => ({ year: y, url: sectionData.years[y] })));
        setSelectedItemIndex(0);
      }
    }
  };

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

    // Special handling for quickReplies and fallbackMessages (string arrays)
    if (section === 'quickReplies' || section === 'fallbackMessages') {
      if (Array.isArray(sectionData)) {
        const converted = sectionData.map((item, index) => {
          if (typeof item === 'string') {
            return { id: index + 1, text: item };
          }
          return item;
        });
        setJsonData(converted);
        setSelectedItemIndex(0);
        setFormData(converted[0] || {});
        return;
      }
    }

    if (Array.isArray(sectionData)) {
      setJsonData(sectionData);
      setSelectedItemIndex(0);
      setFormData(sectionData[0] || {});
    } else if (typeof sectionData === 'object') {
      setJsonData([sectionData]);
      setFormData(sectionData);
      setSelectedItemIndex(0);
    } else if (typeof sectionData === 'string') {
      setJsonData([{ value: sectionData }]);
      setFormData({ value: sectionData });
      setSelectedItemIndex(0);
    }
  };

  useEffect(() => {
    if (rawData && selectedSection && currentFile?.type !== 'simple-array' && currentFile?.type !== 'gallery-special') {
      if (currentFile?.type === 'accounts-special') {
        handleAccountsPdfData(rawData, selectedSection);
      } else {
        processSection(rawData, selectedSection);
      }
    }
  }, [selectedSection]);

  useEffect(() => {
    if (jsonData.length > 0 && jsonData[selectedItemIndex]) {
      setFormData({ ...jsonData[selectedItemIndex] });
    }
  }, [selectedItemIndex, jsonData]);

  // ============================================
  // GALLERY FILTER HANDLERS
  // ============================================

  useEffect(() => {
    if (currentFile?.type === 'gallery-special' && rawData && selectedYear) {
      const yearData = rawData.filter((item: any) => item.year?.toString() === selectedYear);
      const pujaTypes = [...new Set(yearData.map((item: any) => item.pujaType || item.category))];
      
      if (!pujaTypes.includes(selectedPujaType) && pujaTypes.length > 0) {
        setSelectedPujaType(pujaTypes[0] as string);
      }
      
      const filteredData = selectedPujaType 
        ? yearData.filter((item: any) => (item.pujaType || item.category) === selectedPujaType)
        : yearData;
      
      setJsonData(filteredData);
      setSelectedItemIndex(0);
      setFormData(filteredData[0] || {});
    }
  }, [selectedYear, selectedPujaType]);

  // ============================================
  // GET UNIQUE YEARS FROM GALLERY DATA
  // ============================================

  const getGalleryYears = (): string[] => {
    if (!rawData || !Array.isArray(rawData)) return [];
    return [...new Set(rawData.map((item: any) => item.year?.toString()))].filter(Boolean).sort((a, b) => parseInt(b) - parseInt(a));
  };

  const getGalleryPujaTypes = (): string[] => {
    if (!rawData || !Array.isArray(rawData) || !selectedYear) return [];
    const yearData = rawData.filter((item: any) => item.year?.toString() === selectedYear);
    return [...new Set(yearData.map((item: any) => item.pujaType || item.category))].filter(Boolean);
  };

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
    
    // Update rawData based on file type
    if (currentFile?.type === 'gallery-special' && rawData) {
      // For gallery, we need to update the specific item in rawData
      const newRawData = rawData.map((item: any) => {
        if (item.id === formData.id) {
          return { ...formData };
        }
        return item;
      });
      setRawData(newRawData);
    } else if (currentFile?.type === 'accounts-special' && rawData && selectedSection) {
      // For accounts PDF, update the years object
      const newRawData = { ...rawData };
      if (!newRawData[selectedSection]) newRawData[selectedSection] = { years: {} };
      newRawData[selectedSection].years[formData.year] = formData.url;
      setRawData(newRawData);
    } else if (selectedSection && rawData && currentFile?.type !== 'simple-array') {
      const newRawData = { ...rawData };
      
      // Special handling for quickReplies and fallbackMessages
      if (selectedSection === 'quickReplies' || selectedSection === 'fallbackMessages') {
        newRawData[selectedSection] = updatedData.map(item => item.text);
      } else {
        newRawData[selectedSection] = Array.isArray(rawData[selectedSection]) 
          ? updatedData 
          : updatedData[0];
      }
      setRawData(newRawData);
    }
    
    alert('✅ সংরক্ষিত! JSON কপি করে GitHub এ আপলোড করুন।');
  };

  const handleAddItem = () => {
    if (!Array.isArray(jsonData)) return;
    
    // For gallery special
    if (currentFile?.type === 'gallery-special') {
      // Generate unique ID based on timestamp
      const newId = `img_${Date.now()}`;
      const template = {
        id: newId,
        url: '',
        caption: '',
        year: parseInt(selectedYear) || new Date().getFullYear(),
        pujaType: selectedPujaType || 'দুর্গাপূজা'
      };
      
      const newRawData = [...(rawData || []), template];
      setRawData(newRawData);
      
      const filteredData = [...jsonData, template];
      setJsonData(filteredData);
      setSelectedItemIndex(filteredData.length - 1);
      setFormData(template);
      alert('➕ নতুন ছবি যোগ হয়েছে!');
      return;
    }

    // For accounts special
    if (currentFile?.type === 'accounts-special') {
      const currentYear = new Date().getFullYear();
      const existingYears = jsonData.map(item => parseInt(item.year));
      let newYear = currentYear;
      while (existingYears.includes(newYear)) {
        newYear--;
      }
      
      const template = { year: newYear.toString(), url: '' };
      const updatedData = [...jsonData, template];
      setJsonData(updatedData);
      setSelectedItemIndex(updatedData.length - 1);
      setFormData(template);
      setSelectedPdfYear(newYear.toString());
      alert('➕ নতুন বছর যোগ হয়েছে!');
      return;
    }

    // For quickReplies and fallbackMessages
    if (selectedSection === 'quickReplies' || selectedSection === 'fallbackMessages') {
      const maxId = jsonData.reduce((max, item) => Math.max(max, item.id || 0), 0);
      const template = { id: maxId + 1, text: '' };
      const updatedData = [...jsonData, template];
      setJsonData(updatedData);
      setSelectedItemIndex(updatedData.length - 1);
      setFormData(template);
      alert('➕ নতুন আইটেম যোগ হয়েছে!');
      return;
    }
    
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
    
    // For gallery special
    if (currentFile?.type === 'gallery-special' && rawData) {
      const itemToDelete = jsonData[selectedItemIndex];
      const newRawData = rawData.filter((item: any) => item.id !== itemToDelete.id);
      setRawData(newRawData);
    }
    
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
    } else if (currentFile?.type === 'gallery-special') {
      finalData = rawData;
    } else if (currentFile?.type === 'accounts-special' && rawData) {
      finalData = { ...rawData };
      if (selectedSection) {
        const yearsObj: Record<string, string> = {};
        jsonData.forEach(item => {
          yearsObj[item.year] = item.url;
        });
        finalData[selectedSection] = { years: yearsObj };
      }
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
        } else if (selectedSection === 'quickReplies' || selectedSection === 'fallbackMessages') {
          finalData[selectedSection] = jsonData.map(item => item.text);
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
  // GET ITEM DISPLAY NAME
  // ============================================

  const getItemDisplayName = (item: any, index: number): string => {
    // For schedules - use day labels
    if (selectedFile === 'schedules' && item.day) {
      const dayKey = item.day.toLowerCase().replace(/\s/g, '');
      return scheduleDayLabels[dayKey] || item.day || item.event || `আইটেম ${index + 1}`;
    }
    
    // For invitations - use person name
    if (selectedSection === 'invitations') {
      return item.personName || item.name || item.familyName || `আইটেম ${index + 1}`;
    }
    
    // For members in dynamicContent
    if (selectedSection === 'members') {
      return item.name || item.personName || `সদস্য ${index + 1}`;
    }
    
    // For quickReplies and fallbackMessages
    if (selectedSection === 'quickReplies' || selectedSection === 'fallbackMessages') {
      return item.text ? (item.text.substring(0, 30) + (item.text.length > 30 ? '...' : '')) : `আইটেম ${index + 1}`;
    }
    
    // Default
    return item.title || item.name || item.question || item.channelName || item.personName || item.day || `আইটেম ${index + 1}`;
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
    value: 'মান',
    text: 'টেক্সট',
    familyName: 'পরিবারের নাম'
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

    // PujaType - dropdown for gallery
    if (key === 'pujaType' && fileConfig?.type === 'gallery-special') {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <select value={String(formData[key] || '')} 
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm">
            {PUJA_TYPES.map(puja => (
              <option key={puja.id} value={puja.value}>{puja.label}</option>
            ))}
          </select>
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
    if (typeof value === 'string' && (value.length > 100 || ['details', 'answer', 'description', 'address', 'message', 'offlineMessage', 'permanentAddress', 'text'].includes(key))) {
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
  // RENDER PAYMENT STATS EDITOR
  // ============================================

  const renderPaymentStatsEditor = () => {
    if (selectedSection !== 'paymentStats' || !formData) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="form-field">
            <label className="block text-sm font-semibold text-gray-700 mb-2">💰 মোট বকেয়া</label>
            <input type="number" value={formData.totalDue || 0} 
              onChange={(e) => handleFieldChange('totalDue', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm" />
          </div>
          <div className="form-field">
            <label className="block text-sm font-semibold text-gray-700 mb-2">✅ মোট পরিশোধ</label>
            <input type="number" value={formData.totalPaid || 0} 
              onChange={(e) => handleFieldChange('totalPaid', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm" />
          </div>
          <div className="form-field">
            <label className="block text-sm font-semibold text-gray-700 mb-2">⏳ মোট অবশিষ্ট</label>
            <input type="number" value={formData.totalRemaining || 0} 
              onChange={(e) => handleFieldChange('totalRemaining', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm" />
          </div>
          <div className="form-field">
            <label className="block text-sm font-semibold text-gray-700 mb-2">📅 সর্বশেষ আপডেট</label>
            <input type="text" value={formData.lastUpdated || ''} 
              onChange={(e) => handleFieldChange('lastUpdated', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm" />
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER ACCOUNTS PDF EDITOR
  // ============================================

  const renderAccountsPdfEditor = () => {
    if (currentFile?.type !== 'accounts-special') return null;

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3">📊 {sectionLabels[selectedSection]} - বছর অনুযায়ী PDF</h4>
          
          {/* Year selector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">📅 বছর নির্বাচন:</label>
            <div className="flex flex-wrap gap-2">
              {jsonData.map((item, index) => (
                <button
                  key={item.year}
                  onClick={() => {
                    setSelectedPdfYear(item.year);
                    setSelectedItemIndex(index);
                    setFormData(item);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedPdfYear === item.year 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-white text-gray-700 hover:bg-blue-50 border'
                  }`}
                >
                  {item.year}
                </button>
              ))}
            </div>
          </div>

          {/* Edit form for selected year */}
          {formData && (
            <div className="bg-white p-4 rounded-lg border space-y-4">
              <div className="form-field">
                <label className="block text-sm font-semibold text-gray-700 mb-2">📅 বছর</label>
                <input type="text" value={formData.year || ''} 
                  onChange={(e) => handleFieldChange('year', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div className="form-field">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  PDF লিংক
                </label>
                <input type="text" value={formData.url || ''} 
                  onChange={(e) => handleFieldChange('url', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                {formData.url && (
                  <a href={formData.url} target="_blank" rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 mt-2 text-blue-600 text-sm hover:underline">
                    <FileText className="w-4 h-4" /> PDF দেখুন
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
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
    } else if (currentFile?.type === 'gallery-special') {
      finalData = rawData;
    } else if (currentFile?.type === 'accounts-special' && rawData) {
      finalData = { ...rawData };
      if (selectedSection) {
        const yearsObj: Record<string, string> = {};
        jsonData.forEach(item => {
          yearsObj[item.year] = item.url;
        });
        finalData[selectedSection] = { years: yearsObj };
      }
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
      } else if (selectedSection === 'quickReplies' || selectedSection === 'fallbackMessages') {
        finalData[selectedSection] = jsonData.map(item => item.text);
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

      {/* Section Selector - for nested-sections, complex-object, accounts-special */}
      {currentFile?.sections && currentFile.sections.length > 0 && currentFile.type !== 'gallery-special' && (
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

      {/* Gallery Special Filters */}
      {currentFile?.type === 'gallery-special' && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">📅 বছর নির্বাচন:</label>
              <div className="flex flex-wrap gap-2">
                {getGalleryYears().map(year => (
                  <button key={year} onClick={() => setSelectedYear(year)}
                    className={btnClass(selectedYear === year)}>
                    {year}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Puja Type Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">🙏 পূজার ধরন:</label>
              <div className="flex flex-wrap gap-2">
                {getGalleryPujaTypes().map(puja => (
                  <button key={puja} onClick={() => setSelectedPujaType(puja)}
                    className={btnClass(selectedPujaType === puja)}>
                    {PUJA_TYPES.find(p => p.value === puja)?.label || puja}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Gallery Stats */}
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <p className="text-sm text-purple-800">
              📊 <strong>{selectedYear}</strong> সালের <strong>{selectedPujaType}</strong>: 
              <span className="ml-2 font-bold text-orange-600">{jsonData.length} টি ছবি</span>
            </p>
          </div>
        </div>
      )}

      {/* Accounts PDF Editor */}
      {currentFile?.type === 'accounts-special' && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          {renderAccountsPdfEditor()}
        </div>
      )}

      {/* Item Selector + Actions - Not for accounts-special or paymentStats */}
      {Array.isArray(jsonData) && jsonData.length > 0 && 
       currentFile?.type !== 'accounts-special' && 
       selectedSection !== 'paymentStats' && (
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
                  #{i + 1} - {getItemDisplayName(item, i)}
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
            ) : selectedSection === 'paymentStats' ? (
              renderPaymentStatsEditor()
            ) : currentFile?.type === 'accounts-special' ? (
              // Already rendered above
              <div className="text-center py-6 text-gray-500">
                👆 উপরে বছর সিলেক্ট করে এডিট করুন
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
