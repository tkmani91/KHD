import React, { useState, useEffect } from 'react';
import { Settings, Copy, Check, Plus, Trash2, Save, Upload, Image as ImageIcon, Music, FileText, Filter, Users, DollarSign, TrendingUp, Calendar, MapPin } from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface JSONFile {
  id: string;
  label: string;
  url: string;
  path: string;
  type: 'simple-array' | 'complex-object' | 'nested-sections' | 'gallery-special' | 'accounts-special' | 'fund-collection-special' | 'invitations-special' | 'quiz-special';
  sections?: string[];
  hasImagePreview?: boolean;
  hasAudioPreview?: boolean;
}

// ✅ NEW: Props interface.
interface JSONEditorProps {
  userRole: 'Member' | 'Admin' | 'Super Admin';
  editorPermissions?: Record<string, boolean>;
}

// ============================================
// MAIN COMPONENT
// ============================================

const JSONEditor: React.FC<JSONEditorProps> = ({ userRole, editorPermissions = {} }) => {
  // ... (আগের সব state গুলো একই থাকবে)
  const [selectedFile, setSelectedFile] = useState<string>('dynamicContent');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [rawData, setRawData] = useState<any>(null);
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedPujaType, setSelectedPujaType] = useState<string>('');
  const [selectedPdfYear, setSelectedPdfYear] = useState<string>('');
  const [fundSubSection, setFundSubSection] = useState<string>('settings');
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [fundMembers, setFundMembers] = useState<any[]>([]);
  const [fundSettings, setFundSettings] = useState<any>({});
  const [paymentStats, setPaymentStats] = useState<any>({});
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedQuizYear, setSelectedQuizYear] = useState<string>('');

  // ============================================
  // ✅ JSON FILES CONFIGURATION (১৬টি ফাইল - নতুন ২টি যোগ)
  // ============================================

  const JSON_FILES: JSONFile[] = [
    {
      id: 'dynamicContent',
      label: '📰 সদস্য আয় হিসাব',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/dynamicContent.json',
      path: 'dynamicContent.json',
      type: 'fund-collection-special',
      sections: ['notices', 'liveStream', 'fundCollection']
    },
    {
      id: 'membersData',
      label: '👥 সদস্য তথ্য',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/members-data.json',
      path: 'members-data.json',
      type: 'nested-sections',
      sections: ['members', 'pdfLinks'],
      hasImagePreview: true
    },
    {
      id: 'contactsData',
      label: '📞 যোগাযোগ',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/contacts.json',
      path: 'contacts.json',
      type: 'nested-sections',
      sections: ['contacts', 'pdfLink'],
      hasImagePreview: true
    },
    {
      id: 'invitationsData',
      label: '💌 নিমন্ত্রণ',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/invitations.json',
      path: 'invitations.json',
      type: 'invitations-special',
      sections: ['invitations', 'pdfLink']
    },
    {
      id: 'quizData',
      label: '❓ কুইজ',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/quiz-archive.json',
      path: 'quiz-archive.json',
      type: 'quiz-special'
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
    },
    // ✅ NEW: সাংগঠনিক প্রোফাইল
    {
      id: 'organizationalProfile',
      label: '🏛️ সাংগঠনিক প্রোফাইল',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/organizationalProfile.json',
      path: 'public/data/organizationalProfile.json',
      type: 'nested-sections',
      sections: ['leaders'],
      hasImagePreview: true
    },
    // ✅ NEW: রেজুলেশন
    {
      id: 'resolutions',
      label: '📋 রেজুলেশন',
      url: 'https://raw.githubusercontent.com/tkmani91/KHD/main/public/data/resolutions.json',
      path: 'public/data/resolutions.json',
      type: 'nested-sections',
      sections: ['meetingDecisions', 'fundAllocations']
    }
  ];

  // ✅ NEW: Filter files based on permissions
  const getAvailableFiles = () => {
    if (userRole === 'Super Admin') {
      return JSON_FILES; // সব দেখতে পারবে
    }
    
    if (userRole === 'Admin') {
      return JSON_FILES.filter(file => editorPermissions[file.id] === true);
    }
    
    return []; // Member কিছু দেখতে পারবে না
  };

  const availableFiles = getAvailableFiles();
    const currentFile = availableFiles.find(f => f.id === selectedFile);

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
  // ✅ UPDATED SECTION LABELS (নতুন ২টি যোগ)
  // ============================================

  const sectionLabels: Record<string, string> = {
    notices: '📢 ঘোষণা',
    liveStream: '📺 লাইভ স্ট্রিম',
    fundCollection: '💰 চাঁদা সংগ্রহ',
    members: '👥 সদস্য তালিকা',
    contacts: '📞 যোগাযোগ',
    invitations: '💌 নিমন্ত্রণ',
    pdfLinks: '📄 PDF লিংক',
    pdfLink: '📄 PDF লিংক',
    accountsMembers: '🔑 Admin সদস্য',
    normalMembers: '👤 সাধারণ সদস্য',
    welcomeMessage: '👋 স্বাগত বার্তা',
    quickReplies: '⚡ দ্রুত উত্তর',
    faq: '❓ FAQ',
    fallbackMessages: '🔄 Fallback মেসেজ',
    durgaPuja: '🎉 দুর্গাপূজা',
    shyamaPuja: '🔱 শ্যামাপূজা',
    saraswatiPuja: '📚 সরস্বতী পূজা',
    rathYatra: '🎪 রথযাত্রা',
    durga: '🎉 দুর্গাপূজা',
    shyama: '🔱 শ্যামাপূজা',
    saraswati: '📚 সরস্বতী পূজা',
    rath: '🎪 রথযাত্রা',
    leaders: '👔 নেতৃবৃন্দ', // ✅ NEW
    meetingDecisions: '📝 মিটিং সিদ্ধান্ত', // ✅ NEW
    fundAllocations: '💵 অনুদান বরাদ্ধ' // ✅ NEW
  };

  const scheduleDayLabels: Record<string, string> = {
    'mahalaya': 'মহালয়া',
    'panchami': 'পঞ্চমী',
    'shasthi': 'ষষ্ঠী',
    'saptami': 'সপ্তমী',
    'ashtami': 'অষ্টমী',
    'navami': 'নবমী',
    'dashami': 'দশমী'
  };

  // ============================================
  // ✅ LOAD JSON DATA - useEffect UPDATED
  // ============================================

  useEffect(() => {
    const fetchJSON = async () => {
      // ✅ Check if user has access to any files
      if (availableFiles.length === 0) {
        setError('আপনার কোনো ফাইল এডিট করার অনুমতি নেই');
        setLoading(false);
        return;
      }

      // ✅ Auto-select first available file
      const firstFile = availableFiles[0];
      if (selectedFile !== firstFile.id && !availableFiles.find(f => f.id === selectedFile)) {
        setSelectedFile(firstFile.id);
        return; // Re-run with new selectedFile
      }

      setLoading(true);
      setError('');
      setSelectedYear('');
      setSelectedPujaType('');
      setSelectedPdfYear('');
      setFundSubSection('settings');
      setMemberFilter('all');
      setSelectedArea('');
      setSelectedQuizYear('');
      
      try {
        const file = availableFiles.find(f => f.id === selectedFile);
        if (!file) {
          setError('ফাইল পাওয়া যায়নি');
          setLoading(false);
          return;
        }

        const response = await fetch(file.url, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        setRawData(data);

        if (file.type === 'simple-array') {
          setJsonData(Array.isArray(data) ? data : []);
          setSelectedItemIndex(0);
          setFormData(data[0] || {});
          setSelectedSection('');
        } else if (file.type === 'gallery-special') {
          handleGalleryData(data);
        } else if (file.type === 'accounts-special') {
          setSelectedSection(file.sections?.[0] || 'durgaPuja');
          handleAccountsPdfData(data, file.sections?.[0] || 'durgaPuja');
        } else if (file.type === 'fund-collection-special') {
          setSelectedSection('notices');
          processFundCollectionFile(data, 'notices');
        } else if (file.type === 'invitations-special') {
          setSelectedSection('invitations');
          handleInvitationsData(data);
        } else if (file.type === 'quiz-special') {
          handleQuizData(data);
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
  }, [selectedFile, userRole, editorPermissions]); // ✅ Dependencies updated

  // ============================================
  // HANDLE INVITATIONS DATA
  // ============================================

  const handleInvitationsData = (data: any) => {
    if (!data || !data.invitations || !Array.isArray(data.invitations)) {
      setJsonData([]);
      setFormData({});
      return;
    }

    const invitations = data.invitations;
    const areas = [...new Set(invitations.map((item: any) => item.area))].filter(Boolean) as string[];
    
    if (areas.length > 0) {
      setSelectedArea(areas[0]);
      const filteredData = invitations.filter((item: any) => item.area === areas[0]);
      setJsonData(filteredData);
      setSelectedItemIndex(0);
      setFormData(filteredData[0] || {});
    } else {
      setJsonData(invitations);
      setSelectedItemIndex(0);
      setFormData(invitations[0] || {});
    }
  };

  // ============================================
  // HANDLE QUIZ DATA
  // ============================================

  const handleQuizData = (data: any) => {
    if (!Array.isArray(data) || data.length === 0) {
      setJsonData([]);
      setFormData({});
      return;
    }

    const years = [...new Set(data.map((item: any) => item.year?.toString()))].filter(Boolean).sort((a, b) => parseInt(b) - parseInt(a)) as string[];
    
    if (years.length > 0) {
      setSelectedQuizYear(years[0]);
      const filteredData = data.filter((item: any) => item.year?.toString() === years[0]);
      setJsonData(filteredData);
      setSelectedItemIndex(0);
      setFormData(filteredData[0] || {});
    } else {
      setJsonData(data);
      setSelectedItemIndex(0);
      setFormData(data[0] || {});
    }
  };

  // ============================================
  // GET HELPER FUNCTIONS
  // ============================================

  const getInvitationAreas = (): string[] => {
    if (!rawData || !rawData.invitations || !Array.isArray(rawData.invitations)) return [];
    return [...new Set(rawData.invitations.map((item: any) => item.area))].filter(Boolean) as string[];
  };

  const getQuizYears = (): string[] => {
    if (!rawData || !Array.isArray(rawData)) return [];
    return [...new Set(rawData.map((item: any) => item.year?.toString()))].filter(Boolean).sort((a, b) => parseInt(b) - parseInt(a)) as string[];
  };

  // ============================================
  // FILTER EFFECTS
  // ============================================

  useEffect(() => {
    if (currentFile?.type === 'invitations-special' && rawData?.invitations && selectedArea && selectedSection === 'invitations') {
      const filteredData = rawData.invitations.filter((item: any) => item.area === selectedArea);
      setJsonData(filteredData);
      setSelectedItemIndex(0);
      setFormData(filteredData[0] || {});
    }
  }, [selectedArea]);

  useEffect(() => {
    if (currentFile?.type === 'quiz-special' && rawData && Array.isArray(rawData) && selectedQuizYear) {
      const filteredData = rawData.filter((item: any) => item.year?.toString() === selectedQuizYear);
      setJsonData(filteredData);
      setSelectedItemIndex(0);
      setFormData(filteredData[0] || {});
    }
  }, [selectedQuizYear]);

  // ============================================
  // PROCESS FUND COLLECTION FILE
  // ============================================

  const processFundCollectionFile = (data: any, section: string) => {
    if (section === 'fundCollection') {
      const fc = data.fundCollection || {};
      
      const settings = {
        isActive: fc.isActive ?? true,
        year: fc.year || '',
        pujaName: fc.pujaName || '',
        message: fc.message || '',
        instructions: fc.instructions || [],
        totalDue: fc.totalDue || 0,
        totalPaid: fc.totalPaid || 0,
        totalRemaining: fc.totalRemaining || 0,
        lastUpdated: fc.lastUpdated || ''
      };
      setFundSettings(settings);
      
      const members = fc.members || [];
      setFundMembers(members);
      
      const stats = fc.paymentStats || {
        totalMembers: members.length,
        paidMembers: members.filter((m: any) => m.status === 'paid').length,
        partialMembers: members.filter((m: any) => m.status === 'partial').length,
        unpaidMembers: members.filter((m: any) => m.status === 'unpaid').length,
        paymentPercentage: 0
      };
      setPaymentStats(stats);
      
      setJsonData([]);
      setFormData({});
    } else {
      processSection(data, section);
    }
  };

  // ============================================
  // HANDLE GALLERY DATA
  // ============================================

  const handleGalleryData = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      setJsonData([]);
      setFormData({});
      return;
    }

    const years = [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
    const firstYear = years[0]?.toString() || '';
    setSelectedYear(firstYear);

    const yearData = data.filter(item => item.year?.toString() === firstYear);
    const pujaTypes = [...new Set(yearData.map(item => item.pujaType || item.category))];
    const firstPujaType = pujaTypes[0] || '';
    setSelectedPujaType(firstPujaType);

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
          title: sectionData.title || '',
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
    if (!data) {
      setJsonData([]);
      setFormData({});
      return;
    }

    if (section === 'pdfLink') {
      const pdfLinkValue = data.pdfLink || '';
      setJsonData([{ pdfLink: pdfLinkValue }]);
      setFormData({ pdfLink: pdfLinkValue });
      setSelectedItemIndex(0);
      return;
    }

    const sectionData = data[section];
    if (!sectionData) {
      setJsonData([]);
      setFormData({});
      return;
    }

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
    if (rawData && selectedSection) {
      if (currentFile?.type === 'fund-collection-special') {
        processFundCollectionFile(rawData, selectedSection);
      } else if (currentFile?.type === 'accounts-special') {
        handleAccountsPdfData(rawData, selectedSection);
      } else if (currentFile?.type === 'invitations-special') {
        if (selectedSection === 'invitations') {
          handleInvitationsData(rawData);
        } else {
          processSection(rawData, selectedSection);
        }
      } else if (currentFile?.type !== 'simple-array' && currentFile?.type !== 'gallery-special' && currentFile?.type !== 'quiz-special') {
        processSection(rawData, selectedSection);
      }
    }
  }, [selectedSection]);

  useEffect(() => {
    if (jsonData.length > 0 && jsonData[selectedItemIndex]) {
      setFormData({ ...jsonData[selectedItemIndex] });
    }
  }, [selectedItemIndex, jsonData]);

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
  // HELPER FUNCTIONS
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

  const getFilteredMembers = () => {
    if (memberFilter === 'all') return fundMembers;
    return fundMembers.filter(m => m.status === memberFilter);
  };

  const getItemDisplayName = (item: any, index: number): string => {
    if (selectedFile === 'schedules' && item.day) {
      const dayKey = item.day.toLowerCase().replace(/\s/g, '');
      return scheduleDayLabels[dayKey] || item.day || item.event || `আইটেম ${index + 1}`;
    }
    
    if (currentFile?.type === 'invitations-special' || selectedSection === 'invitations') {
      return item.personName || item.name || item.familyName || `আইটেম ${index + 1}`;
    }

    if (currentFile?.type === 'quiz-special') {
      return item.title || `${item.year} সালের কুইজ` || `কুইজ ${index + 1}`;
    }

    if (selectedSection === 'contacts') {
      return item.name || item.designation || `যোগাযোগ ${index + 1}`;
    }
    
    // ✅ NEW: organizationalProfile leaders
    if (selectedSection === 'leaders') {
      return item.name || item.position || `নেতা ${index + 1}`;
    }

    // ✅ NEW: resolutions
    if (selectedSection === 'meetingDecisions' || selectedSection === 'fundAllocations') {
      return item.title || `রেজুলেশন ${index + 1}`;
    }
    
    if (selectedSection === 'quickReplies' || selectedSection === 'fallbackMessages') {
      return item.text ? (item.text.substring(0, 30) + (item.text.length > 30 ? '...' : '')) : `আইটেম ${index + 1}`;
    }
    
    return item.title || item.name || item.question || item.channelName || item.personName || item.day || `আইটেম ${index + 1}`;
  };

  // ============================================
  // AUTO CALCULATION FUNCTIONS
  // ============================================

  const handleMemberPaymentChange = (memberId: string, key: string, value: any) => {
    setFundMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const updated = { ...m, [key]: value };
        
        if (key === 'paidAmount') {
          const dueAmount = updated.dueAmount || 0;
          const paidAmount = parseFloat(value) || 0;
          updated.remainingAmount = Math.max(0, dueAmount - paidAmount);
          
          if (paidAmount === 0) {
            updated.status = 'unpaid';
          } else if (paidAmount >= dueAmount) {
            updated.status = 'paid';
            updated.remainingAmount = 0;
          } else {
            updated.status = 'partial';
          }
        }
        
        if (key === 'dueAmount') {
          const dueAmount = parseFloat(value) || 0;
          const paidAmount = updated.paidAmount || 0;
          updated.remainingAmount = Math.max(0, dueAmount - paidAmount);
          
          if (paidAmount === 0) {
            updated.status = 'unpaid';
          } else if (paidAmount >= dueAmount) {
            updated.status = 'paid';
            updated.remainingAmount = 0;
          } else {
            updated.status = 'partial';
          }
        }
        
        return updated;
      }
      return m;
    }));
  };

  const autoRecalculateTotals = () => {
    const totalMembers = fundMembers.length;
    const paidMembers = fundMembers.filter(m => m.status === 'paid').length;
    const partialMembers = fundMembers.filter(m => m.status === 'partial').length;
    const unpaidMembers = fundMembers.filter(m => m.status === 'unpaid').length;
    const totalPaid = fundMembers.reduce((sum, m) => sum + (m.paidAmount || 0), 0);
    const totalDue = fundMembers.reduce((sum, m) => sum + (m.dueAmount || 0), 0);
    const totalRemaining = fundMembers.reduce((sum, m) => sum + (m.remainingAmount || 0), 0);
    const paymentPercentage = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;

    setPaymentStats({
      totalMembers,
      paidMembers,
      partialMembers,
      unpaidMembers,
      paymentPercentage
    });

    setFundSettings((prev: any) => ({
      ...prev,
      totalDue,
      totalPaid,
      totalRemaining
    }));
  };

  useEffect(() => {
    if (currentFile?.type === 'fund-collection-special' && selectedSection === 'fundCollection' && fundMembers.length > 0) {
      autoRecalculateTotals();
    }
  }, [fundMembers]);
  
  // ============================================
  // HANDLERS
  // ============================================

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFundSettingsChange = (key: string, value: any) => {
    setFundSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleMemberChange = (memberId: string, key: string, value: any) => {
    setFundMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, [key]: value } : m
    ));
  };

  const handlePaymentStatsChange = (key: string, value: any) => {
    setPaymentStats((prev: any) => ({ ...prev, [key]: value }));
  };

  const recalculateStats = () => {
    const totalMembers = fundMembers.length;
    const paidMembers = fundMembers.filter(m => m.status === 'paid').length;
    const partialMembers = fundMembers.filter(m => m.status === 'partial').length;
    const unpaidMembers = fundMembers.filter(m => m.status === 'unpaid').length;
    const totalPaid = fundMembers.reduce((sum, m) => sum + (m.paidAmount || 0), 0);
    const totalDue = fundMembers.reduce((sum, m) => sum + (m.dueAmount || 0), 0);
    const totalRemaining = fundMembers.reduce((sum, m) => sum + (m.remainingAmount || 0), 0);
    const paymentPercentage = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;

    setPaymentStats({
      totalMembers,
      paidMembers,
      partialMembers,
      unpaidMembers,
      paymentPercentage
    });

    setFundSettings((prev: any) => ({
      ...prev,
      totalDue,
      totalPaid,
      totalRemaining
    }));

    alert('✅ পরিসংখ্যান পুনরায় গণনা করা হয়েছে!');
  };

  const handleSaveItem = () => {
    if (currentFile?.type === 'fund-collection-special' && selectedSection === 'fundCollection') {
      alert('✅ সংরক্ষিত! JSON কপি করে GitHub এ আপলোড করুন।');
      return;
    }

    const updatedData = [...jsonData];
    updatedData[selectedItemIndex] = { ...formData };
    setJsonData(updatedData);
    
    if (currentFile?.type === 'gallery-special' && rawData) {
      const newRawData = rawData.map((item: any) => {
        if (item.id === formData.id) {
          return { ...formData };
        }
        return item;
      });
      setRawData(newRawData);
    } else if (currentFile?.type === 'invitations-special' && rawData && selectedSection === 'invitations') {
      const newRawData = { ...rawData };
      newRawData.invitations = rawData.invitations.map((item: any) => {
        if (item.id === formData.id) {
          return { ...formData };
        }
        return item;
      });
      setRawData(newRawData);
    } else if (currentFile?.type === 'quiz-special' && rawData && Array.isArray(rawData)) {
      const newRawData = rawData.map((item: any) => {
        if (item.year === formData.year && item.title === jsonData[selectedItemIndex]?.title) {
          return { ...formData };
        }
        return item;
      });
      setRawData(newRawData);
    } else if (currentFile?.type === 'accounts-special' && rawData && selectedSection) {
      const newRawData = { ...rawData };
      if (!newRawData[selectedSection]) newRawData[selectedSection] = { years: {} };
      newRawData[selectedSection].years[formData.year] = formData.url;
      setRawData(newRawData);
    } else if (selectedSection && rawData && currentFile?.type !== 'simple-array') {
      const newRawData = { ...rawData };
      
      if (selectedSection === 'pdfLink') {
        newRawData.pdfLink = formData.pdfLink || '';
      } else if (selectedSection === 'quickReplies' || selectedSection === 'fallbackMessages') {
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
    if (currentFile?.type === 'fund-collection-special' && selectedSection === 'fundCollection' && fundSubSection === 'members') {
      const maxId = fundMembers.reduce((max, m) => Math.max(max, parseInt(m.id) || 0), 0);
      const newMember = {
        id: String(maxId + 1),
        name: '',
        dueAmount: 5000,
        paidAmount: 0,
        remainingAmount: 5000,
        lastPaymentDate: null,
        paymentMethod: null,
        status: 'unpaid',
        transactionId: null
      };
      setFundMembers([...fundMembers, newMember]);
      alert('➕ নতুন সদস্য যোগ হয়েছে!');
      return;
    }

    if (!Array.isArray(jsonData)) return;
    
    if (currentFile?.type === 'gallery-special') {
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

    if (currentFile?.type === 'invitations-special' && selectedSection === 'invitations') {
      const maxId = rawData?.invitations?.reduce((max: number, item: any) => Math.max(max, parseInt(item.id) || 0), 0) || 0;
      const template = {
        id: String(maxId + 1),
        area: selectedArea || '',
        personName: '',
        familyCount: 1
      };
      
      const newRawData = { ...rawData };
      newRawData.invitations = [...(rawData.invitations || []), template];
      setRawData(newRawData);
      
      const filteredData = [...jsonData, template];
      setJsonData(filteredData);
      setSelectedItemIndex(filteredData.length - 1);
      setFormData(template);
      alert('➕ নতুন নিমন্ত্রণ যোগ হয়েছে!');
      return;
    }

    if (currentFile?.type === 'quiz-special') {
      const template = {
        year: parseInt(selectedQuizYear) || new Date().getFullYear(),
        title: `কুইজ প্রতিযোগিতা ${selectedQuizYear || new Date().getFullYear()}`,
        eventDate: '',
        venue: 'কলম হিন্দু ধর্মসভা মন্দির',
        questions: []
      };
      
      const newRawData = [...(rawData || []), template];
      setRawData(newRawData);
      
      const filteredData = [...jsonData, template];
      setJsonData(filteredData);
      setSelectedItemIndex(filteredData.length - 1);
      setFormData(template);
      alert('➕ নতুন কুইজ যোগ হয়েছে!');
      return;
    }

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
      setFormData({ ...formData, year: newYear.toString(), url: '' });
      setSelectedPdfYear(newYear.toString());
      alert('➕ নতুন বছর যোগ হয়েছে!');
      return;
    }

    // ✅ NEW: Handle organizationalProfile leaders
    if (selectedFile === 'organizationalProfile' && selectedSection === 'leaders') {
      const maxId = jsonData.reduce((max, item) => Math.max(max, parseInt(item.id) || 0), 0);
      const template = {
        id: maxId + 1,
        name: '',
        position: '',
        tenure: '',
        photo: '',
        current: false
      };
      const updatedData = [...jsonData, template];
      setJsonData(updatedData);
      setSelectedItemIndex(updatedData.length - 1);
      setFormData(template);
      
      const newRawData = { ...rawData };
      newRawData.leaders = updatedData;
      setRawData(newRawData);
      
      alert('➕ নতুন নেতা যোগ হয়েছে!');
      return;
    }

    // ✅ NEW: Handle resolutions
    if (selectedFile === 'resolutions' && (selectedSection === 'meetingDecisions' || selectedSection === 'fundAllocations')) {
      const maxId = jsonData.reduce((max, item) => Math.max(max, parseInt(item.id) || 0), 0);
      const template = selectedSection === 'meetingDecisions' 
        ? {
            id: maxId + 1,
            title: '',
            date: '',
            category: '',
            pdfUrl: ''
          }
        : {
            id: maxId + 1,
            title: '',
            amount: '',
            date: '',
            source: '',
            pdfUrl: ''
          };
      
      const updatedData = [...jsonData, template];
      setJsonData(updatedData);
      setSelectedItemIndex(updatedData.length - 1);
      setFormData(template);
      
      const newRawData = { ...rawData };
      newRawData[selectedSection] = updatedData;
      setRawData(newRawData);
      
      alert('➕ নতুন রেজুলেশন যোগ হয়েছে!');
      return;
    }

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

    if (selectedSection === 'contacts') {
      const maxId = jsonData.reduce((max, item) => Math.max(max, parseInt(item.id) || 0), 0);
      const template = {
        id: String(maxId + 1),
        name: '',
        mobile: '',
        address: '',
        occupation: '',
        photo: ''
      };
      const updatedData = [...jsonData, template];
      setJsonData(updatedData);
      setSelectedItemIndex(updatedData.length - 1);
      setFormData(template);
      
      const newRawData = { ...rawData };
      newRawData.contacts = updatedData;
      setRawData(newRawData);
      
      alert('➕ নতুন যোগাযোগ যোগ হয়েছে!');
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
    if (currentFile?.type === 'fund-collection-special' && selectedSection === 'fundCollection' && fundSubSection === 'members') {
      if (fundMembers.length <= 1) {
        alert('❌ কমপক্ষে একজন সদস্য থাকতে হবে!');
        return;
      }
      const memberToDelete = getFilteredMembers()[selectedItemIndex];
      if (!memberToDelete) return;
      if (!window.confirm(`⚠️ "${memberToDelete.name}" মুছতে চান?`)) return;
      
      setFundMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
      setSelectedItemIndex(0);
      alert('🗑️ সদস্য মুছে ফেলা হয়েছে!');
      return;
    }

    if (jsonData.length <= 1) {
      alert('❌ কমপক্ষে একটি আইটেম থাকতে হবে!');
      return;
    }
    if (!window.confirm('⚠️ মুছতে চান?')) return;
    
    if (currentFile?.type === 'gallery-special' && rawData) {
      const itemToDelete = jsonData[selectedItemIndex];
      const newRawData = rawData.filter((item: any) => item.id !== itemToDelete.id);
      setRawData(newRawData);
    } else if (currentFile?.type === 'invitations-special' && rawData && selectedSection === 'invitations') {
      const itemToDelete = jsonData[selectedItemIndex];
      const newRawData = { ...rawData };
      newRawData.invitations = rawData.invitations.filter((item: any) => item.id !== itemToDelete.id);
      setRawData(newRawData);
    } else if (currentFile?.type === 'quiz-special' && rawData && Array.isArray(rawData)) {
      const itemToDelete = jsonData[selectedItemIndex];
      const newRawData = rawData.filter((item: any) => !(item.year === itemToDelete.year && item.title === itemToDelete.title));
      setRawData(newRawData);
    } else if (selectedSection === 'contacts' && rawData) {
      const newRawData = { ...rawData };
      newRawData.contacts = jsonData.filter((_, i) => i !== selectedItemIndex);
      setRawData(newRawData);
    } else if (selectedFile === 'organizationalProfile' && selectedSection === 'leaders' && rawData) {
      const newRawData = { ...rawData };
      newRawData.leaders = jsonData.filter((_, i) => i !== selectedItemIndex);
      setRawData(newRawData);
    } else if (selectedFile === 'resolutions' && (selectedSection === 'meetingDecisions' || selectedSection === 'fundAllocations') && rawData) {
      const newRawData = { ...rawData };
      newRawData[selectedSection] = jsonData.filter((_, i) => i !== selectedItemIndex);
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
      const updated = [...jsonData];
      if (updated.length > 0) updated[selectedItemIndex] = formData;
      finalData = updated;
    } else if (currentFile?.type === 'gallery-special') {
      finalData = rawData;
    } else if (currentFile?.type === 'fund-collection-special' && rawData) {
      finalData = { ...rawData };
      finalData.fundCollection = {
        ...fundSettings,
        members: fundMembers,
        paymentStats: paymentStats
      };
    } else if (currentFile?.type === 'invitations-special' && rawData) {
      finalData = { ...rawData };
    } else if (currentFile?.type === 'quiz-special' && rawData) {
      finalData = rawData;
    } else if (currentFile?.type === 'accounts-special' && rawData) {
      finalData = { ...rawData };
      if (selectedSection && rawData[selectedSection]) {
        const yearsObj: Record<string, string> = {};
        jsonData.forEach(item => {
          yearsObj[item.year] = item.url;
        });
        if (formData.year && formData.url) {
          yearsObj[formData.year] = formData.url;
        }
        finalData[selectedSection] = { 
          title: formData.title || rawData[selectedSection]?.title || '',
          years: yearsObj 
        };
      }
    } else if (currentFile?.type === 'nested-sections' && rawData) {
      finalData = { ...rawData };
      if (selectedSection) {
        if (selectedSection === 'pdfLink') {
          finalData.pdfLink = formData.pdfLink || '';
        } else {
          const updated = [...jsonData];
          if (updated.length > 0) updated[selectedItemIndex] = formData;
          finalData[selectedSection] = Array.isArray(rawData[selectedSection]) ? updated : updated[0];
        }
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
  // DIRECT GITHUB UPLOAD
  // ============================================

  const handleDirectUpload = async () => {
    if (!currentFile) {
      alert('❌ কোন ফাইল নির্বাচন করা নেই!');
      return;
    }

    const confirmUpload = window.confirm(
      `⚠️ নিশ্চিত করুন:\n\n` +
      `ফাইল: ${currentFile.path}\n` +
      `লেবেল: ${currentFile.label}\n\n` +
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
          filePath: currentFile.path,
          content: generatedJSON,
          commitMessage: `📝 Update ${currentFile.label} via Admin Panel`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadSuccess(true);
      alert(
        `✅ সফলভাবে GitHub এ আপলোড হয়েছে!\n\n` +
        `📁 ফাইল: ${currentFile.label}\n` +
        `🔗 Commit: ${data.commit.sha.substring(0, 7)}\n\n` +
        `২-৩ মিনিট পর সাইট রিফ্রেশ করুন। 🔄`
      );

      setTimeout(() => setUploadSuccess(false), 5000);

    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`❌ আপলোড ব্যর্থ: ${errorMessage}`);
      alert(`❌ সমস্যা হয়েছে:\n\n${errorMessage}\n\nদয়া করে আবার চেষ্টা করুন অথবা manual copy করুন।`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // ============================================
  // ✅ UPDATED LABEL MAPPING (নতুন fields যোগ)
  // ============================================

  const labelMap: Record<string, string> = {
    id: 'আইডি', title: 'শিরোনাম', name: 'নাম', description: 'বর্ণনা', details: 'বিবরণ',
    date: 'তারিখ', dateEn: 'তারিখ (EN)', year: 'বছর', month: 'মাস', time: 'সময়', day: 'দিন',
    eventDate: 'অনুষ্ঠানের তারিখ', venue: 'স্থান',
    priority: 'প্রাধান্য', category: 'ক্যাটাগরি', status: 'স্ট্যাটাস',
    question: 'প্রশ্ন', answer: 'উত্তর', keywords: 'কীওয়ার্ড', questions: 'প্রশ্নসমূহ',
    role: 'পদবী', phone: 'ফোন', email: 'ইমেইল', address: 'ঠিকানা', area: 'এলাকা',
    username: 'ইউজারনেম', password: 'পাসওয়ার্ড',
    imageUrl: 'ছবি URL', image: 'ছবি', photo: 'ফটো', thumbnail: 'থাম্বনেইল', 
    caption: 'ক্যাপশন', logo: 'লোগো',
    audioUrl: 'অডিও URL', url: 'লিংক', pdfUrl: 'PDF URL', streamUrl: 'স্ট্রিম URL',
    pdfLink: 'PDF লিংক',
    location: 'স্থান', artist: 'শিল্পী', duration: 'সময়কাল',
    channelName: 'চ্যানেল', fileName: 'ফাইল নাম', size: 'সাইজ',
    pujaName: 'পূজার নাম', pujaType: 'পূজার ধরন',
    mobile: 'মোবাইল', occupation: 'পেশা', designation: 'পদবী',
    personName: 'ব্যক্তির নাম', familyName: 'পরিবারের নাম', familyCount: 'পরিবারের সদস্য',
    dueAmount: 'বকেয়া', paidAmount: 'পরিশোধিত', remainingAmount: 'অবশিষ্ট',
    lastPaymentDate: 'শেষ পেমেন্ট', paymentMethod: 'পেমেন্ট মাধ্যম',
    transactionId: 'ট্রানজেকশন ID',
    isLive: 'লাইভ?', isActive: 'সক্রিয়?',
    streamType: 'স্ট্রিম টাইপ', offlineMessage: 'অফলাইন মেসেজ',
    message: 'মেসেজ', instructions: 'নির্দেশনা',
    totalDue: 'মোট বকেয়া', totalPaid: 'মোট পরিশোধ', totalRemaining: 'মোট অবশিষ্ট',
    lastUpdated: 'সর্বশেষ আপডেট',
    event: 'অনুষ্ঠান', value: 'মান', text: 'টেক্সট',
    // ✅ NEW: organizationalProfile fields
    position: 'পদবী',
    tenure: 'মেয়াদকাল',
    current: 'বর্তমান?',
    // ✅ NEW: resolutions fields
    amount: 'পরিমাণ',
    source: 'উৎস'
  };

  // ============================================
  // RENDER FORM FIELD
  // ============================================

  const renderFormField = (key: string, value: any) => {
    if (key.startsWith('_') || value === undefined) return null;
    
    const label = labelMap[key] || key;
    const fileConfig = currentFile;

    if (key === 'id') {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <input type="text" value={String(formData[key] || '')} disabled 
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed text-sm" />
        </div>
      );
    }
// ============================================
  // ✅ NEW: EDITOR PERMISSIONS UI
  // ============================================
  if (key === 'editorPermissions' && typeof value === 'object') {
    const allFiles = [
      'dynamicContent',
      'membersData',
      'contactsData',
      'invitationsData',
      'quizData',
      'loginData',
      'chatbotData',
      'galleryImages',
      'accountsPDFs',
      'liveChannels',
      'pdfFiles',
      'pujaData',
      'schedules',
      'songs',
      'organizationalProfile',
      'resolutions'
    ];

    const fileLabels: Record<string, string> = {
      'dynamicContent': '📰 সদস্য আয় হিসাব',
      'membersData': '👥 সদস্য তথ্য',
      'contactsData': '📞 যোগাযোগ',
      'invitationsData': '💌 নিমন্ত্রণ',
      'quizData': '❓ কুইজ',
      'loginData': '🔐 লগইন ডেটা',
      'chatbotData': '💬 চ্যাটবট',
      'galleryImages': '🖼️ গ্যালারি',
      'accountsPDFs': '📊 বাৎসরিক হিসাব',
      'liveChannels': '📺 লাইভ চ্যানেল',
      'pdfFiles': '📄 পূজাদ্রব্যের তালিকা',
      'pujaData': '🙏 পূজা তথ্য',
      'schedules': '📅 সময়সূচী',
      'songs': '🎵 গান',
      'organizationalProfile': '🏛️ সাংগঠনিক প্রোফাইল',
      'resolutions': '📋 রেজুলেশন'
    };

    // যদি editorPermissions না থাকে, তাহলে সব false করে initialize করুন
    if (!formData.editorPermissions || Object.keys(formData.editorPermissions).length === 0) {
      const initialPermissions: Record<string, boolean> = {};
      allFiles.forEach(f => { initialPermissions[f] = false; });
      handleFieldChange('editorPermissions', initialPermissions);
    }

    const currentPermissions = formData.editorPermissions || {};
    const grantedCount = Object.values(currentPermissions).filter(v => v === true).length;

    return (
      <div key={key} className="form-field">
        <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-purple-200">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            🔒 এডিটর পারমিশন
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">
              {grantedCount}/{allFiles.length} অনুমোদিত
            </span>
          </label>
        </div>
        
        <div className="space-y-2 max-h-80 overflow-y-auto bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
          {allFiles.map(fileId => {
            const isGranted = currentPermissions[fileId] === true;
            return (
              <div key={fileId} className={`flex items-center gap-3 p-3 rounded-lg shadow-sm hover:shadow-md transition ${
                isGranted ? 'bg-green-50 border-2 border-green-200' : 'bg-white'
              }`}>
                <input 
                  type="checkbox" 
                  id={`perm-${fileId}`}
                  checked={isGranted}
                  onChange={(e) => {
                    const updatedPermissions = {
                      ...currentPermissions,
                      [fileId]: e.target.checked
                    };
                    handleFieldChange('editorPermissions', updatedPermissions);
                  }}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor={`perm-${fileId}`} className="flex-1 cursor-pointer font-medium text-gray-800 text-sm">
                  {fileLabels[fileId] || fileId}
                </label>
                {isGranted && (
                  <span className="text-green-600 text-xs bg-green-200 px-2 py-0.5 rounded-full font-bold animate-pulse">
                    ✓ Active
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>💡 টিপস:</strong> যে ফাইলগুলোতে ✓ চেক দেবেন, এই Admin শুধু সেই ফাইলগুলোই Control Panel এ দেখতে ও এডিট করতে পারবে।
            <br />
            <strong className="text-red-600">⚠️ সাবধান:</strong> "🔐 লগইন ডেটা" অনুমতি দিলে Admin নিজের ও অন্যদের পাসওয়ার্ড পরিবর্তন করতে পারবে!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const allTrue: Record<string, boolean> = {};
              allFiles.forEach(f => { allTrue[f] = true; });
              handleFieldChange('editorPermissions', allTrue);
            }}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
          >
            <Check className="w-4 h-4" />
            সব অনুমতি দিন
          </button>
          <button
            type="button"
            onClick={() => {
              const allFalse: Record<string, boolean> = {};
              allFiles.forEach(f => { allFalse[f] = false; });
              handleFieldChange('editorPermissions', allFalse);
            }}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
          >
            <X className="w-4 h-4" />
            সব বাতিল করুন
          </button>
          <button
            type="button"
            onClick={() => {
              const safePermissions: Record<string, boolean> = {
                dynamicContent: false,
                membersData: false,
                contactsData: true,
                invitationsData: true,
                quizData: true,
                loginData: false, // ⚠️ Dangerous
                chatbotData: false,
                galleryImages: true,
                accountsPDFs: false,
                liveChannels: true,
                pdfFiles: true,
                pujaData: true,
                schedules: true,
                songs: true,
                organizationalProfile: true,
                resolutions: true
              };
              handleFieldChange('editorPermissions', safePermissions);
            }}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
          >
            <Settings className="w-4 h-4" />
            📌 নিরাপদ সেটিং (১১টি ফাইল)
          </button>
        </div>
      </div>
    );
  }
    if (key === 'area' && currentFile?.type === 'invitations-special') {
      const areas = getInvitationAreas();
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
          <div className="flex gap-2">
            <select value={String(formData[key] || '')} 
              onChange={(e) => handleFieldChange(key, e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm">
              <option value="">এলাকা নির্বাচন করুন</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="বা নতুন এলাকা লিখুন"
              value={areas.includes(formData[key]) ? '' : formData[key] || ''}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm" 
            />
          </div>
        </div>
      );
    }
    
    if (key === 'questions' && Array.isArray(value)) {
      return (
        <div key={key} className="form-field">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
            <span>{label} ({value.length} টি প্রশ্ন)</span>
            <button
              onClick={() => {
                const newQuestion = {
                  id: value.length + 1,
                  question: '',
                  answer: '',
                  options: ['', '', '', '']
                };
                handleFieldChange(key, [...value, newQuestion]);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
            >
              <Plus className="w-3 h-3" /> প্রশ্ন যোগ
            </button>
          </label>
          
          <div className="space-y-3 max-h-96 overflow-y-auto bg-gray-50 p-3 rounded-lg">
            {value.map((q: any, idx: number) => (
              <div key={idx} className="bg-white p-3 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-blue-700">প্রশ্ন {idx + 1}</strong>
                  <button
                    onClick={() => {
                      if (value.length <= 1) {
                        alert('❌ কমপক্ষে একটি প্রশ্ন থাকতে হবে!');
                        return;
                      }
                      if (window.confirm(`⚠️ প্রশ্ন ${idx + 1} মুছতে চান?`)) {
                        handleFieldChange(key, value.filter((_: any, i: number) => i !== idx));
                      }
                    }}
                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">প্রশ্ন:</label>
                  <textarea
                    value={q.question || ''}
                    onChange={(e) => {
                      const updated = [...value];
                      updated[idx] = { ...updated[idx], question: e.target.value };
                      handleFieldChange(key, updated);
                    }}
                    rows={2}
                    placeholder="প্রশ্ন লিখুন..."
                    className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-green-600 mb-1">সঠিক উত্তর:</label>
                  <input
                    type="text"
                    value={q.answer || ''}
                    onChange={(e) => {
                      const updated = [...value];
                      updated[idx] = { ...updated[idx], answer: e.target.value };
                      handleFieldChange(key, updated);
                    }}
                    placeholder="সঠিক উত্তর লিখুন..."
                    className="w-full px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                {q.options && Array.isArray(q.options) && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">অপশনসমূহ:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt: string, optIdx: number) => (
                        <input
                          key={optIdx}
                          type="text"
                          value={opt || ''}
                          onChange={(e) => {
                            const updated = [...value];
                            updated[idx].options[optIdx] = e.target.value;
                            handleFieldChange(key, updated);
                          }}
                          placeholder={`অপশন ${optIdx + 1}`}
                          className="w-full px-2 py-1 border rounded text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

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

    if (typeof value === 'string' && (value.length > 100 || ['details', 'answer', 'description', 'address', 'message', 'offlineMessage', 'text'].includes(key))) {
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
  // RENDER FUND COLLECTION EDITOR (একই থাকবে - কোন পরিবর্তন নেই)
  // ============================================

  const renderFundCollectionEditor = () => {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
          <button onClick={() => setFundSubSection('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              fundSubSection === 'settings' ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-green-50'
            }`}>
            <Settings className="w-4 h-4" /> সেটিংস
          </button>
          <button onClick={() => setFundSubSection('members')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              fundSubSection === 'members' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}>
            <Users className="w-4 h-4" /> সদস্য ({fundMembers.length})
          </button>
          <button onClick={() => setFundSubSection('stats')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              fundSubSection === 'stats' ? 'bg-purple-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-purple-50'
            }`}>
            <TrendingUp className="w-4 h-4" /> পরিসংখ্যান
          </button>
        </div>

        {fundSubSection === 'settings' && (
          <div className="space-y-4 p-4 bg-white rounded-lg border">
            <h4 className="font-bold text-green-700 flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> চাঁদা সংগ্রহ সেটিংস
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input type="checkbox" checked={fundSettings.isActive} 
                  onChange={(e) => handleFundSettingsChange('isActive', e.target.checked)}
                  className="w-5 h-5 text-green-500 rounded" />
                <label className="font-semibold text-gray-700">সক্রিয়?</label>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">বছর</label>
                <input type="text" value={fundSettings.year || ''} 
                  onChange={(e) => handleFundSettingsChange('year', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পূজার নাম</label>
                <input type="text" value={fundSettings.pujaName || ''} 
                  onChange={(e) => handleFundSettingsChange('pujaName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">সর্বশেষ আপডেট</label>
                <input type="text" value={fundSettings.lastUpdated || ''} 
                  onChange={(e) => handleFundSettingsChange('lastUpdated', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">মেসেজ</label>
              <textarea value={fundSettings.message || ''} 
                onChange={(e) => handleFundSettingsChange('message', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                নির্দেশনা <span className="text-xs text-gray-500">(প্রতি লাইনে একটি)</span>
              </label>
              <textarea value={(fundSettings.instructions || []).join('\n')} 
                onChange={(e) => handleFundSettingsChange('instructions', e.target.value.split('\n').filter(Boolean))}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm" />
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  💰 মোট দায্যকৃত টাকা
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">Auto</span>
                </label>
                <input 
                  type="number" 
                  value={fundSettings.totalDue || 0} 
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-orange-50 text-orange-700 font-bold text-sm cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  ✅ মোট পরিশোধ
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">Auto</span>
                </label>
                <input 
                  type="number" 
                  value={fundSettings.totalPaid || 0} 
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-green-50 text-green-700 font-bold text-sm cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  ⏳ মোট বাকি
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Auto</span>
                </label>
                <input 
                  type="number" 
                  value={fundSettings.totalRemaining || 0} 
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-red-50 text-red-700 font-bold text-sm cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-3xl">💡</div>
                <div className="flex-1">
                  <p className="font-bold text-blue-800 mb-1">🔄 Auto Calculation সক্রিয়</p>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    <strong className="text-blue-900">সদস্য সেকশনে</strong> পরিশোধিত টাকা বসালে এই তিনটি field <strong>automatically</strong> update হবে। 
                    Manual edit করার দরকার নেই। <strong className="text-green-700">Real-time calculation!</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {fundSubSection === 'members' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">ফিল্টার:</span>
                <select value={memberFilter} onChange={(e) => { setMemberFilter(e.target.value); setSelectedItemIndex(0); }}
                  className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  <option value="all">সকল ({fundMembers.length})</option>
                  <option value="paid">✅ পরিশোধিত ({fundMembers.filter(m => m.status === 'paid').length})</option>
                  <option value="partial">🟡 আংশিক ({fundMembers.filter(m => m.status === 'partial').length})</option>
                  <option value="unpaid">❌ বকেয়া ({fundMembers.filter(m => m.status === 'unpaid').length})</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddItem}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                  <Plus className="w-4 h-4" /> সদস্য যোগ
                </button>
                <button onClick={handleDeleteItem} disabled={getFilteredMembers().length <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:bg-gray-400">
                  <Trash2 className="w-4 h-4" /> মুছুন
                </button>
              </div>
            </div>

            <select value={selectedItemIndex} 
              onChange={(e) => setSelectedItemIndex(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
              {getFilteredMembers().map((member, i) => (
                <option key={member.id} value={i}>
                  {member.status === 'paid' ? '✅' : member.status === 'partial' ? '🟡' : '❌'} {member.name || `সদস্য ${member.id}`} 
                  - ৳{member.paidAmount || 0}/{member.dueAmount || 0}
                </option>
              ))}
            </select>

            {getFilteredMembers()[selectedItemIndex] && (
              <div className="p-4 bg-white rounded-lg border space-y-4">
                <h4 className="font-bold text-blue-700 border-b pb-2">
                  সদস্য #{getFilteredMembers()[selectedItemIndex].id} এডিট
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">নাম</label>
                    <input type="text" value={getFilteredMembers()[selectedItemIndex].name || ''} 
                      onChange={(e) => handleMemberChange(getFilteredMembers()[selectedItemIndex].id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">স্ট্যাটাস</label>
                    <select value={getFilteredMembers()[selectedItemIndex].status || 'unpaid'} 
                      onChange={(e) => handleMemberChange(getFilteredMembers()[selectedItemIndex].id, 'status', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="paid">✅ পরিশোধিত</option>
                      <option value="partial">🟡 আংশিক</option>
                      <option value="unpaid">❌ বকেয়া</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      💰 দায্যকৃত টাকা
                    </label>
                    <input 
                      type="number" 
                      value={getFilteredMembers()[selectedItemIndex].dueAmount || 0}
                      onChange={(e) => handleMemberPaymentChange(getFilteredMembers()[selectedItemIndex].id, 'dueAmount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border-2 border-orange-500 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm font-semibold" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      ✅ পরিশোধিত
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded font-bold animate-pulse">Auto Calculate</span>
                    </label>
                    <input 
                      type="number" 
                      value={getFilteredMembers()[selectedItemIndex].paidAmount || 0} 
                      onChange={(e) => handleMemberPaymentChange(getFilteredMembers()[selectedItemIndex].id, 'paidAmount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border-2 border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 text-sm font-bold text-green-700 bg-green-50" 
                    />
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <span className="text-lg">💡</span>
                      <strong>টাকা বসালে</strong> অবশিষ্ট এবং স্ট্যাটাস auto update হবে
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      ⏳ বকেয়া
                      <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded font-bold">Read Only</span>
                    </label>
                    <input 
                      type="number" 
                      value={getFilteredMembers()[selectedItemIndex].remainingAmount || 0} 
                      disabled
                      className="w-full px-3 py-2 border-2 border-red-300 rounded-lg bg-red-50 text-red-700 font-bold text-lg text-center cursor-not-allowed" 
                    />
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span className="text-lg">🔒</span>
                      <strong>Auto calculated:</strong> দায্যকৃত - পরিশোধিত = {getFilteredMembers()[selectedItemIndex].remainingAmount || 0}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">পেমেন্ট মাধ্যম</label>
                    <select value={getFilteredMembers()[selectedItemIndex].paymentMethod || ''} 
                      onChange={(e) => handleMemberChange(getFilteredMembers()[selectedItemIndex].id, 'paymentMethod', e.target.value || null)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
                      <option value="">নির্বাচন করুন</option>
                      <option value="বিকাশ">💳 বিকাশ</option>
                      <option value="নগদ">💵 নগদ</option>
                      <option value="রকেট">🚀 রকেট</option>
                      <option value="ব্যাংক">🏦 ব্যাংক</option>
                      <option value="নগদ অর্থ">💲 নগদ অর্থ</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">শেষ পেমেন্ট তারিখ</label>
                    <input type="text" value={getFilteredMembers()[selectedItemIndex].lastPaymentDate || ''} 
                      onChange={(e) => handleMemberChange(getFilteredMembers()[selectedItemIndex].id, 'lastPaymentDate', e.target.value || null)}
                      placeholder="২০২৬-০৯-২০"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ট্রানজেকশন ID</label>
                    <input type="text" value={getFilteredMembers()[selectedItemIndex].transactionId || ''} 
                      onChange={(e) => handleMemberChange(getFilteredMembers()[selectedItemIndex].id, 'transactionId', e.target.value || null)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {fundSubSection === 'stats' && (
          <div className="space-y-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-purple-700 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> পেমেন্ট পরিসংখ্যান
              </h4>
              <button onClick={recalculateStats}
                className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 flex items-center gap-1">
                🔄 পুনরায় গণনা
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{paymentStats.totalMembers || 0}</div>
                <div className="text-sm text-blue-800">মোট সদস্য</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">{paymentStats.paidMembers || 0}</div>
                <div className="text-sm text-green-800">পরিশোধিত</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-yellow-600">{paymentStats.partialMembers || 0}</div>
                <div className="text-sm text-yellow-800">আংশিক</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600">{paymentStats.unpaidMembers || 0}</div>
                <div className="text-sm text-red-800">বকেয়া</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center col-span-2">
                <div className="text-3xl font-bold text-purple-600">{paymentStats.paymentPercentage || 0}%</div>
                <div className="text-sm text-purple-800">পেমেন্ট সম্পন্ন</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-purple-500 h-2 rounded-full transition-all" 
                    style={{ width: `${paymentStats.paymentPercentage || 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">মোট সদস্য</label>
                <input type="number" value={paymentStats.totalMembers || 0} 
                  onChange={(e) => handlePaymentStatsChange('totalMembers', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পরিশোধিত সদস্য</label>
                <input type="number" value={paymentStats.paidMembers || 0} 
                  onChange={(e) => handlePaymentStatsChange('paidMembers', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">আংশিক সদস্য</label>
                <input type="number" value={paymentStats.partialMembers || 0} 
                  onChange={(e) => handlePaymentStatsChange('partialMembers', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">বকেয়া সদস্য</label>
                <input type="number" value={paymentStats.unpaidMembers || 0} 
                  onChange={(e) => handlePaymentStatsChange('unpaidMembers', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">পেমেন্ট শতাংশ</label>
                <input type="number" value={paymentStats.paymentPercentage || 0} 
                  onChange={(e) => handlePaymentStatsChange('paymentPercentage', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // RENDER ACCOUNTS PDF EDITOR (একই থাকবে)
  // ============================================

  const renderAccountsPdfEditor = () => {
    if (currentFile?.type !== 'accounts-special' || !rawData) return null;

    const sectionData = rawData[selectedSection];
    const years = sectionData?.years ? Object.keys(sectionData.years).sort((a, b) => parseInt(b) - parseInt(a)) : [];

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
          <h4 className="font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {sectionLabels[selectedSection]} - PDF লিংক
          </h4>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">শিরোনাম</label>
            <input type="text" value={formData.title || sectionData?.title || ''} 
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">📅 বছর নির্বাচন:</label>
            <div className="flex flex-wrap gap-2">
              {years.map((year, index) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedPdfYear(year);
                    setSelectedItemIndex(index);
                    setFormData(prev => ({ ...prev, year, url: sectionData.years[year] }));
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    selectedPdfYear === year 
                      ? 'bg-indigo-500 text-white shadow-lg' 
                      : 'bg-white text-gray-700 hover:bg-indigo-50 border'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  {year}
                </button>
              ))}
              <button
                onClick={handleAddItem}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> নতুন বছর
              </button>
            </div>
          </div>

          {selectedPdfYear && (
            <div className="bg-white p-4 rounded-lg border space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-indigo-700">{selectedPdfYear} সালের PDF</h5>
                <button
                  onClick={() => {
                    if (years.length <= 1) {
                      alert('❌ কমপক্ষে একটি বছর থাকতে হবে!');
                      return;
                    }
                    if (!window.confirm(`⚠️ ${selectedPdfYear} সাল মুছতে চান?`)) return;
                    
                    const newYears = { ...sectionData.years };
                    delete newYears[selectedPdfYear];
                    
                    const newRawData = { ...rawData };
                    newRawData[selectedSection] = { ...sectionData, years: newYears };
                    setRawData(newRawData);
                    
                    const remainingYears = Object.keys(newYears).sort((a, b) => parseInt(b) - parseInt(a));
                    setSelectedPdfYear(remainingYears[0] || '');
                    setJsonData(remainingYears.map(y => ({ year: y, url: newYears[y] })));
                    
                    alert('🗑️ বছর মুছে ফেলা হয়েছে!');
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> মুছুন
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">বছর</label>
                <input type="text" value={formData.year || ''} 
                  onChange={(e) => handleFieldChange('year', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">PDF URL</label>
                <input type="text" value={formData.url || ''} 
                  onChange={(e) => handleFieldChange('url', e.target.value)}
                  placeholder="/pdfs/accounts/example-2024.pdf"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
              </div>
              
              {formData.url && (
                <a href={formData.url} target="_blank" rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-indigo-600 text-sm hover:underline">
                  <FileText className="w-4 h-4" /> PDF দেখুন →
                </a>
              )}
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
    } else if (currentFile?.type === 'fund-collection-special' && rawData) {
      finalData = { ...rawData };
      finalData.fundCollection = {
        ...fundSettings,
        members: fundMembers,
        paymentStats: paymentStats
      };
    } else if (currentFile?.type === 'invitations-special' && rawData) {
      finalData = { ...rawData };
    } else if (currentFile?.type === 'quiz-special' && rawData) {
      finalData = rawData;
    } else if (currentFile?.type === 'accounts-special' && rawData) {
      finalData = { ...rawData };
      if (selectedSection && rawData[selectedSection]) {
        const yearsObj: Record<string, string> = {};
        jsonData.forEach(item => {
          yearsObj[item.year] = item.url;
        });
        if (formData.year && formData.url) {
          yearsObj[formData.year] = formData.url;
        }
        finalData[selectedSection] = { 
          title: formData.title || rawData[selectedSection]?.title || '',
          years: yearsObj 
        };
      }
    } else if (currentFile?.type === 'nested-sections' && rawData) {
      finalData = { ...rawData };
      if (selectedSection) {
        if (selectedSection === 'pdfLink') {
          finalData.pdfLink = formData.pdfLink || '';
        } else {
          const updated = [...jsonData];
          if (updated.length > 0) updated[selectedItemIndex] = formData;
          finalData[selectedSection] = Array.isArray(rawData[selectedSection]) ? updated : updated[0];
        }
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

    return JSON.stringify(finalData, null, 2);
  })();

  const btnClass = (active: boolean) => 
    `px-3 py-2 rounded-lg text-sm font-medium transition ${active ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-orange-50'}`;
    // ============================================
  // ✅ FINAL RENDER
  // ============================================

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="w-7 h-7 text-orange-500" />
        <h2 className="text-2xl font-bold text-orange-600">অ্যাডমিন ড্যাশবোর্ড</h2>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="text-blue-800 font-medium">✨ Advanced JSON Editor</p>
        <p className="text-sm text-blue-700">
          {userRole === 'Super Admin' 
            ? '১৬টি JSON ফাইল • Section-based Editing • Image/Audio Preview • Real-time Update'
            : `${availableFiles.length}টি অনুমোদিত ফাইল • আপনার Role: ${userRole}`
          }
        </p>
      </div>

      {/* ✅ NEW: Admin এর জন্য অনুমতি না থাকলে মেসেজ */}
      {userRole === 'Admin' && availableFiles.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-yellow-800 mb-2">কোনো ফাইল এডিট করার অনুমতি নেই</h3>
          <p className="text-yellow-700">Super Admin আপনাকে নির্দিষ্ট ফাইল এডিট করার অনুমতি দিলে এখানে দেখাবে।</p>
          <p className="text-sm text-yellow-600 mt-2">অনুমতির জন্য Super Admin এর সাথে যোগাযোগ করুন।</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-800 font-semibold">❌ {error}</p>
        </div>
      )}

      {/* ✅ UPDATED: File Selector - শুধু অনুমোদিত ফাইল দেখাবে */}
      {availableFiles.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <label className="block text-sm font-bold text-gray-700 mb-3">
            📁 ফাইল নির্বাচন:
            {userRole === 'Admin' && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                {availableFiles.length}/{JSON_FILES.length} ফাইল অনুমোদিত
              </span>
            )}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {availableFiles.map(file => (
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
      )}

      {/* Section Selector */}
      {currentFile?.sections && currentFile.sections.length > 0 && currentFile.type !== 'gallery-special' && currentFile.type !== 'quiz-special' && (
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

      {/* Invitations Special Filters */}
      {currentFile?.type === 'invitations-special' && selectedSection === 'invitations' && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500" />
              <label className="text-sm font-bold text-gray-700">এলাকা নির্বাচন:</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {getInvitationAreas().map(area => (
                <button key={area} onClick={() => setSelectedArea(area)}
                  className={btnClass(selectedArea === area)}>
                  📍 {area}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
            <p className="text-sm text-pink-800">
              📊 <strong>{selectedArea}</strong> এলাকা: 
              <span className="ml-2 font-bold text-orange-600">{jsonData.length} টি নিমন্ত্রণ</span>
            </p>
          </div>
        </div>
      )}

      {/* Quiz Special Filters */}
      {currentFile?.type === 'quiz-special' && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <label className="text-sm font-bold text-gray-700">বছর নির্বাচন:</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {getQuizYears().map(year => (
                <button key={year} onClick={() => setSelectedQuizYear(year)}
                  className={btnClass(selectedQuizYear === year)}>
                  📅 {year}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
            <p className="text-sm text-purple-800">
              📊 <strong>{selectedQuizYear}</strong> সাল: 
              <span className="ml-2 font-bold text-orange-600">{jsonData.length} টি কুইজ</span>
            </p>
          </div>
        </div>
      )}

      {/* Gallery Special Filters */}
      {currentFile?.type === 'gallery-special' && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <p className="text-sm text-purple-800">
              📊 <strong>{selectedYear}</strong> সালের <strong>{selectedPujaType}</strong>: 
              <span className="ml-2 font-bold text-orange-600">{jsonData.length} টি ছবি</span>
            </p>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      {availableFiles.length > 0 && (
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
            
            <div className="max-h-[700px] overflow-y-auto pr-2 space-y-4">
              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="mt-3 text-gray-600">লোডিং...</p>
                </div>
              ) : currentFile?.type === 'fund-collection-special' && selectedSection === 'fundCollection' ? (
                renderFundCollectionEditor()
              ) : currentFile?.type === 'accounts-special' ? (
                renderAccountsPdfEditor()
              ) : (
                <>
                  {/* Item Selector for other types */}
                  {Array.isArray(jsonData) && jsonData.length > 0 && selectedSection !== 'pdfLink' && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <label className="text-sm font-bold text-gray-700">
                          📋 আইটেম ({jsonData.length} টি):
                        </label>
                        <div className="flex gap-2">
                          <button onClick={handleAddItem} 
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">
                            <Plus className="w-4 h-4" /> যোগ
                          </button>
                          <button onClick={handleDeleteItem} disabled={jsonData.length <= 1}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:bg-gray-400">
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

                  {/* Form Fields */}
                  {Object.keys(formData).length > 0 ? (
                    Object.keys(formData).map(key => renderFormField(key, formData[key]))
                  ) : (
                    <p className="text-center text-gray-500 py-10">কোন ডেটা নেই</p>
                  )}
                </>
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
              <div className="flex gap-2">
                <button onClick={handleCopyJSON} 
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '✅ কপি' : '📋 কপি'}
                </button>
                
                <button 
                  onClick={handleDirectUpload} 
                  disabled={isUploading || loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    uploadSuccess 
                      ? 'bg-green-600 text-white' 
                      : isUploading 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}>
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
            <pre className="bg-gray-900 text-green-400 p-4 text-xs font-mono overflow-auto max-h-[650px]">
              <code>{generatedJSON}</code>
            </pre>
            <div className="bg-yellow-50 border-t-2 border-yellow-400 p-3">
              <p className="text-xs text-yellow-800">
                ⚠️ <code className="bg-yellow-200 px-1 rounded font-semibold">{currentFile?.path}</code> এ পেস্ট করুন
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {availableFiles.length > 0 && (
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
      )}
    </div>
  );
};

export default JSONEditor;
