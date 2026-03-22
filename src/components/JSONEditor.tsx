import React, { useState, useEffect } from 'react';
import '../styles/JSONEditor.css';

type JSONFile = 
  | 'chatbot-data.json'
  | 'dynamicContent.json'
  | 'gallery-images.json'
  | 'members-data.json'
  | 'members-login.json'
  | 'accountsPDFs.json'
  | 'liveChannels.json'
  | 'pdfFiles.json'
  | 'pujaData.json'
  | 'schedules.json'
  | 'songs.json';

const JSON_FILES: { value: JSONFile; label: string }[] = [
  { value: 'dynamicContent.json', label: '📰 ঘোষণা ও খবর' },
  { value: 'chatbot-data.json', label: '💬 চ্যাটবট ডেটা' },
  { value: 'gallery-images.json', label: '🖼️ গ্যালারি ছবি' },
  { value: 'members-data.json', label: '👥 সদস্য তথ্য' },
  { value: 'members-login.json', label: '🔐 সদস্য লগইন' },
  { value: 'accountsPDFs.json', label: '📊 হিসাব PDF' },
  { value: 'liveChannels.json', label: '📺 লাইভ চ্যানেল' },
  { value: 'pdfFiles.json', label: '📄 PDF ফাইল' },
  { value: 'pujaData.json', label: '🙏 পূজা তথ্য' },
  { value: 'schedules.json', label: '📅 সময়সূচী' },
  { value: 'songs.json', label: '🎵 গান' },
];

const JSONEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JSONFile>('dynamicContent.json');
  const [jsonData, setJsonData] = useState<any[]>([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [formData, setFormData] = useState<any>({});
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load JSON file from data folder
  useEffect(() => {
    setLoading(true);
    fetch(`/data/${selectedFile}`)
      .then(res => res.json())
      .then(data => {
        const dataArray = Array.isArray(data) ? data : [data];
        setJsonData(dataArray);
        setSelectedItemIndex(0);
        setFormData(dataArray[0] || {});
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading JSON:', err);
        setJsonData([]);
        setFormData({});
        setLoading(false);
      });
  }, [selectedFile]);

  // Update form data when item changes
  useEffect(() => {
    if (jsonData[selectedItemIndex]) {
      setFormData({ ...jsonData[selectedItemIndex] });
    }
  }, [selectedItemIndex, jsonData]);

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleCopy = () => {
    const updatedData = [...jsonData];
    updatedData[selectedItemIndex] = formData;
    const jsonString = JSON.stringify(updatedData, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = () => {
    const updatedData = [...jsonData];
    updatedData[selectedItemIndex] = formData;
    const jsonString = JSON.stringify(updatedData, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // বাংলা লেবেল ম্যাপিং
  const labelMap: Record<string, string> = {
    id: 'আইডি',
    title: 'শিরোনাম',
    date: 'তারিখ (বাংলা)',
    dateEn: 'তারিখ (ইংরেজি)',
    details: 'বিবরণ',
    priority: 'প্রাধান্য',
    category: 'ক্যাটাগরি',
    question: 'প্রশ্ন',
    answer: 'উত্তর',
    keywords: 'কীওয়ার্ড',
    name: 'নাম',
    role: 'পদবী',
    phone: 'ফোন',
    email: 'ইমেইল',
    address: 'ঠিকানা',
    imageUrl: 'ছবির লিংক',
    caption: 'ক্যাপশন',
    url: 'লিংক',
    audioUrl: 'অডিও লিংক',
    time: 'সময়',
    location: 'স্থান',
    description: 'বর্ণনা',
    artist: 'শিল্পী',
    duration: 'সময়কাল',
    pdfUrl: 'PDF লিংক',
    channelName: 'চ্যানেল নাম',
    streamUrl: 'স্ট্রিম লিংক',
    thumbnail: 'থাম্বনেইল',
    username: 'ইউজারনেম',
    password: 'পাসওয়ার্ড',
    year: 'বছর',
    month: 'মাস',
    amount: 'পরিমাণ',
    type: 'ধরন',
  };

  const renderFormField = (key: string, value: any) => {
    const label = labelMap[key] || key;

    // ID field - readonly
    if (key === 'id') {
      return (
        <div className="form-field" key={key}>
          <label>{label}</label>
          <input
            type="text"
            value={formData[key] || ''}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            disabled
            style={{ background: '#f0f0f0', cursor: 'not-allowed' }}
          />
        </div>
      );
    }

    // Long text fields -> Textarea
    if (
      typeof value === 'string' && 
      (value.length > 100 || 
       key === 'details' || 
       key === 'answer' || 
       key === 'description' ||
       key === 'address')
    ) {
      return (
        <div className="form-field" key={key}>
          <label>{label}</label>
          <textarea
            value={formData[key] || ''}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            rows={6}
          />
        </div>
      );
    }

    // Priority dropdown
    if (key === 'priority') {
      return (
        <div className="form-field" key={key}>
          <label>{label}</label>
          <select
            value={formData[key] || 'medium'}
            onChange={(e) => handleFieldChange(key, e.target.value)}
          >
            <option value="high">🔴 উচ্চ (High)</option>
            <option value="medium">🟡 মাঝারি (Medium)</option>
            <option value="low">🟢 নিম্ন (Low)</option>
          </select>
        </div>
      );
    }

    // Role dropdown for members
    if (key === 'role') {
      return (
        <div className="form-field" key={key}>
          <label>{label}</label>
          <select
            value={formData[key] || 'Member'}
            onChange={(e) => handleFieldChange(key, e.target.value)}
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>
        </div>
      );
    }

    // Date fields
    if (key.toLowerCase().includes('date') && typeof value === 'string' && key !== 'date') {
      return (
        <div className="form-field" key={key}>
          <label>{label}</label>
          <input
            type="date"
            value={formData[key] || ''}
            onChange={(e) => handleFieldChange(key, e.target.value)}
          />
        </div>
      );
    }

    // Boolean fields
    if (typeof value === 'boolean') {
      return (
        <div className="form-field checkbox-field" key={key}>
          <label>
            <input
              type="checkbox"
              checked={formData[key] || false}
              onChange={(e) => handleFieldChange(key, e.target.checked)}
            />
            {label}
          </label>
        </div>
      );
    }

    // Array fields (keywords, tags, etc.)
    if (Array.isArray(value)) {
      return (
        <div className="form-field" key={key}>
          <label>{label} <small>(কমা দিয়ে আলাদা করুন)</small></label>
          <input
            type="text"
            value={formData[key]?.join(', ') || ''}
            onChange={(e) => handleFieldChange(key, e.target.value.split(',').map((s: string) => s.trim()))}
          />
        </div>
      );
    }

    // Default text input
    return (
      <div className="form-field" key={key}>
        <label>{label}</label>
        <input
          type="text"
          value={formData[key] || ''}
          onChange={(e) => handleFieldChange(key, e.target.value)}
        />
      </div>
    );
  };

  // Generate updated JSON code
  const generatedJSON = JSON.stringify(
    (() => {
      const updatedData = [...jsonData];
      updatedData[selectedItemIndex] = formData;
      return updatedData;
    })(),
    null,
    2
  );

  if (loading) {
    return (
      <div className="json-editor-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>লোডিং হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="json-editor-container">
      <div className="json-editor-header">
        <h1>📝 JSON এডিটর (Super Admin)</h1>
        <p className="subtitle">ফাইল সিলেক্ট করুন → এডিট করুন → আপডেটেড JSON কপি করে GitHub এ পেস্ট করুন</p>
      </div>

      <div className="selectors">
        <div className="file-selector">
          <label>📁 ফাইল নির্বাচন করুন:</label>
          <select value={selectedFile} onChange={(e) => setSelectedFile(e.target.value as JSONFile)}>
            {JSON_FILES.map(file => (
              <option key={file.value} value={file.value}>{file.label}</option>
            ))}
          </select>
          <small className="file-path">পাথ: /data/{selectedFile}</small>
        </div>

        {jsonData.length > 1 && (
          <div className="item-selector">
            <label>📋 আইটেম নির্বাচন করুন ({jsonData.length} টি):</label>
            <select value={selectedItemIndex} onChange={(e) => setSelectedItemIndex(Number(e.target.value))}>
              {jsonData.map((item, index) => (
                <option key={index} value={index}>
                  #{index + 1} - {item.title || item.name || item.question || item.channelName || `আইটেম ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="json-editor-content">
        <div className="form-panel">
          <div className="panel-header">
            <h2>✏️ ফর্ম এডিট করুন</h2>
            <span className="field-count">{Object.keys(formData).length} টি ফিল্ড</span>
          </div>
          <div className="form-fields">
            {Object.keys(formData).length > 0 ? (
              Object.keys(formData).map(key => renderFormField(key, formData[key]))
            ) : (
              <div className="no-data">
                <p>❌ কোন ডেটা পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        </div>

        <div className="code-panel">
          <div className="code-header">
            <h2>💻 আপডেটেড JSON কোড</h2>
            <button onClick={handleCopyAll} className={`copy-btn ${copied ? 'copied' : ''}`}>
              {copied ? '✅ কপি হয়েছে!' : '📋 সম্পূর্ণ JSON কপি করুন'}
            </button>
          </div>
          <pre className="json-code">
            <code>{generatedJSON}</code>
          </pre>
          <div className="code-footer">
            <small>⚠️ পুরো JSON কোড কপি করে GitHub এর সংশ্লিষ্ট ফাইলে পেস্ট করুন</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JSONEditor;
