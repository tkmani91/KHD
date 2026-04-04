import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Eye, 
  Printer,
  Search,
  X,
  Building
} from 'lucide-react';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface Resolution {
  id: number;
  title: string;
  date: string;
  category?: string;
  pdfUrl: string;
  amount?: string;
  source?: string;
}

interface ResolutionsData {
  meetingDecisions: Resolution[];
  fundAllocations: Resolution[];
}

const Resolutions: React.FC = () => {
  const [data, setData] = useState<ResolutionsData>({
    meetingDecisions: [],
    fundAllocations: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'decisions' | 'funds'>('decisions');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/data/resolutions.json')
      .then(res => res.json())
      .then(jsonData => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading resolutions:', error);
        setLoading(false);
      });
  }, []);

  // ============================================
  // SEARCH FILTER
  // ============================================
  const filteredDecisions = useMemo(() => {
    if (!searchQuery.trim()) return data.meetingDecisions;
    const query = searchQuery.toLowerCase().trim();
    return data.meetingDecisions.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.date.includes(query) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  }, [data.meetingDecisions, searchQuery]);

  const filteredFunds = useMemo(() => {
    if (!searchQuery.trim()) return data.fundAllocations;
    const query = searchQuery.toLowerCase().trim();
    return data.fundAllocations.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.date.includes(query) ||
      (item.source && item.source.toLowerCase().includes(query)) ||
      (item.amount && item.amount.includes(query))
    );
  }, [data.fundAllocations, searchQuery]);

  const handleViewPDF = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  // ============================================
  // PRINT FUNCTION
  // ============================================
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = activeTab === 'decisions' 
      ? 'মিটিং-সিদ্ধান্ত-কলম-হিন্দু-ধর্মসভা' 
      : 'অনুদান-বরাদ্ধ-কলম-হিন্দু-ধর্মসভা';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentData = activeTab === 'decisions' ? filteredDecisions : filteredFunds;
  const totalCount = activeTab === 'decisions' ? data.meetingDecisions.length : data.fundAllocations.length;

  return (
    <div className="space-y-4">
      {/* ============================================ */}
      {/* PRINT STYLES */}
      {/* ============================================ */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          .print-section, .print-section * {
            visibility: visible;
          }
          
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .print-container {
            padding: 0;
            font-family: 'Segoe UI', Tahoma, sans-serif;
          }
          
          .print-header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
            color: white !important;
            padding: 6px 12px;
            border-radius: 6px;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            justify-content: 
