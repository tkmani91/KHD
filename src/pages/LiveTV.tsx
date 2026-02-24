import { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  Play, 
  Radio,
  Video,
  Facebook,
  Youtube,
  FileVideo,
  List,
  Grid,
  Search,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface TVChannel {
  id: number;
  name: string;
  url: string;
  type: 'm3u8' | 'm3u' | 'facebook' | 'youtube' | 'mp4' | 'embed';
  category: string;
  logo?: string;
  description?: string;
}

const defaultChannels: TVChannel[] = [
  {
    id: 1,
    name: 'সনাতন টিভি',
    url: 'https://ythls.armelin.one/channel/UCYfdidRxbB8Qhf0Nx7ioOYw.m3u8',
    type: 'm3u8',
    category: 'ধর্মীয়',
    description: 'সনাতন ধর্ম বিষয়ক অনুষ্ঠান'
  },
  {
    id: 2,
    name: 'সত্সংঘ টিভি',
    url: 'https://ythls.armelin.one/channel/UC_gUM8rL-Lrg6o3NdwpSRfw.m3u8',
    type: 'm3u8',
    category: 'ধর্মীয়',
    description: 'ভজন ও কীর্তন'
  },
  {
    id: 3,
    name: 'আরতী সংগীত',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    type: 'mp4',
    category: 'সংগীত',
    description: 'ধর্মীয় সংগীত'
  },
  {
    id: 4,
    name: 'ফেসবুক লাইভ - উদাহরণ',
    url: 'https://www.facebook.com/facebook/videos/10153231379946729/',
    type: 'facebook',
    category: 'লাইভ',
    description: 'ফেসবুক লাইভ স্ট্রিম'
  },
  {
    id: 5,
    name: 'ইউটিউব লাইভ - উদাহরণ',
    url: 'https://www.youtube.com/embed/live_stream?channel=UCYfdidRxbB8Qhf0Nx7ioOYw',
    type: 'youtube',
    category: 'লাইভ',
    description: 'ইউটিউব লাইভ স্ট্রিম'
  }
];

const LiveTV = () => {
  const [channels, setChannels] = useState<TVChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<TVChannel | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সব');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load channels from localStorage or use defaults
  useEffect(() => {
    const savedChannels = localStorage.getItem('kollamHinduTVChannels');
    if (savedChannels) {
      const parsed = JSON.parse(savedChannels);
      if (parsed.channels && parsed.channels.length > 0) {
        setChannels(parsed.channels);
      } else {
        setChannels(defaultChannels);
      }
    } else {
      setChannels(defaultChannels);
    }
  }, []);

  // Filter channels
  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'সব' || channel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['সব', ...Array.from(new Set(channels.map(c => c.category)))];

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'm3u8':
      case 'm3u':
        return <Radio className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      case 'mp4':
        return <FileVideo className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  const getEmbedUrl = (channel: TVChannel): string => {
    switch (channel.type) {
      case 'youtube':
        // Convert YouTube URL to embed format
        if (channel.url.includes('watch?v=')) {
          const videoId = channel.url.split('v=')[1]?.split('&')[0];
          return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        if (channel.url.includes('youtu.be/')) {
          const videoId = channel.url.split('youtu.be/')[1]?.split('?')[0];
          return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        return channel.url;
      
      case 'facebook':
        // Facebook embed URL
        if (channel.url.includes('facebook.com')) {
          return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(channel.url)}&show_text=0&width=560`;
        }
        return channel.url;
      
      default:
        return channel.url;
    }
  };

  const isEmbedType = (type: string) => {
    return ['youtube', 'facebook', 'embed'].includes(type);
  };

  const handleChannelSelect = (channel: TVChannel) => {
    setIsLoading(true);
    setError(null);
    setSelectedChannel(channel);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleRefresh = () => {
    if (selectedChannel) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  const renderPlayer = () => {
    if (!selectedChannel) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-900 rounded-xl">
          <div className="text-center text-white">
            <Tv className="w-20 h-20 mx-auto mb-4 text-gray-600" />
            <p className="text-xl">একটি চ্যানেল নির্বাচন করুন</p>
            <p className="text-gray-400 mt-2">লাইভ স্ট্রিম দেখতে উপরের তালিকা থেকে চ্যানেল নির্বাচন করুন</p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-900 rounded-xl">
          <div className="text-center text-white">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-orange-500" />
            <p>লোড হচ্ছে...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-900 rounded-xl">
          <div className="text-center text-white p-8">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-xl text-red-400">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        </div>
      );
    }

    if (isEmbedType(selectedChannel.type)) {
      return (
        <div className="relative h-full bg-black rounded-xl overflow-hidden">
          <iframe
            src={getEmbedUrl(selectedChannel)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={selectedChannel.name}
          />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            লাইভ
          </div>
        </div>
      );
    }

    // Native video player for M3U8, M3U, MP4
    return (
      <div className="relative h-full bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          src={selectedChannel.url}
          className="w-full h-full"
          controls
          autoPlay
          playsInline
          onError={() => setError('ভিডিও লোড করতে সমস্যা হয়েছে')}
        />
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          লাইভ
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📺 লাইভ TV</h1>
          <p className="text-gray-400">ধর্মীয় চ্যানেল ও লাইভ সম্প্রচার</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Section */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
              {renderPlayer()}
            </div>

            {/* Player Info */}
            {selectedChannel && (
              <div className="mt-4 bg-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {getChannelIcon(selectedChannel.type)}
                      {selectedChannel.name}
                    </h2>
                    <p className="text-gray-400 mt-1">{selectedChannel.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="px-3 py-1 bg-orange-600 text-white text-sm rounded-full">
                        {selectedChannel.category}
                      </span>
                      <span className="text-gray-500 text-sm uppercase">
                        {selectedChannel.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Channel List */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="চ্যানেল খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-gray-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Channel List */}
            <div className="max-h-[500px] overflow-y-auto p-4">
              {filteredChannels.length === 0 ? (
                <p className="text-center text-gray-400 py-8">কোনো চ্যানেল পাওয়া যায়নি</p>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}>
                  {filteredChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => handleChannelSelect(channel)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedChannel?.id === channel.id
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedChannel?.id === channel.id ? 'bg-orange-700' : 'bg-gray-600'
                        }`}>
                          {getChannelIcon(channel.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{channel.name}</p>
                          <p className={`text-xs ${
                            selectedChannel?.id === channel.id ? 'text-orange-100' : 'text-gray-400'
                          }`}>
                            {channel.category}
                          </p>
                          {viewMode === 'list' && (
                            <p className={`text-xs mt-1 truncate ${
                              selectedChannel?.id === channel.id ? 'text-orange-200' : 'text-gray-500'
                            }`}>
                              {channel.description}
                            </p>
                          )}
                        </div>
                        {selectedChannel?.id === channel.id && (
                          <Play className="w-5 h-5 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Supported Formats Info */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Radio, label: 'M3U/M3U8', desc: 'স্ট্রিমিং লিংক' },
            { icon: Facebook, label: 'Facebook Live', desc: 'ফেসবুক লাইভ' },
            { icon: Youtube, label: 'YouTube Live', desc: 'ইউটিউব লাইভ' },
            { icon: FileVideo, label: 'MP4/Video', desc: 'ভিডিও ফাইল' },
          ].map((format) => (
            <div key={format.label} className="bg-gray-800 p-4 rounded-xl text-center">
              <format.icon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-medium text-white">{format.label}</p>
              <p className="text-sm text-gray-400">{format.desc}</p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            নির্দেশনা
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>• M3U8/M3U লিংক সরাসরি ভিডিও প্লেয়ারে চলবে</li>
            <li>• Facebook Live ভিডিও সরাসরি এম্বেড হয়ে চলবে</li>
            <li>• YouTube লিংক স্বয়ংক্রিয়ভাবে এম্বেড ফরম্যাটে রূপান্তরিত হবে</li>
            <li>• কিছু চ্যানেল ভিওজিও অঞ্চলগত বিধিনিষেধের কারণে নাও চলতে পারে</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiveTV;