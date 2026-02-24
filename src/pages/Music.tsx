import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Music as MusicIcon,
  Heart,
  List,
  Repeat,
  Shuffle
} from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration: number;
}

const defaultSongs: Song[] = [
  {
    id: 1,
    title: 'জয় মা দুর্গা',
    artist: 'ভজন মণ্ডলী',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 180
  },
  {
    id: 2,
    title: 'অমর শ্যামা সন্ধ্যা আরতী',
    artist: 'আনন্দময়ী পরিবার',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 240
  },
  {
    id: 3,
    title: 'সরস্বতী বন্দনা',
    artist: 'সংগীত শিল্পী',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 200
  },
  {
    id: 4,
    title: 'কালী মায়ের গান',
    artist: 'ভক্তমণ্ডলী',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 220
  },
  {
    id: 5,
    title: 'জগন্নাথ ভজন',
    artist: 'পুরী ধাম',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 190
  }
];

const Music = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load songs from localStorage or use defaults
  useEffect(() => {
    const savedSongs = localStorage.getItem('kollamHinduSongs');
    if (savedSongs) {
      const parsed = JSON.parse(savedSongs);
      if (parsed.songs && parsed.songs.length > 0) {
        setSongs(parsed.songs);
      } else {
        setSongs(defaultSongs);
      }
    } else {
      setSongs(defaultSongs);
    }
    
    const savedFavorites = localStorage.getItem('kollamHinduFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const currentSong = songs[currentSongIndex] || songs[0];

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentSong?.duration || 0);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex, isRepeat, songs]);

  // Play/Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSongIndex, currentSong]);

  // Volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (isShuffle) {
      const nextIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(nextIndex);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    }
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (isShuffle) {
      const prevIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(prevIndex);
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    }
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleFavorite = (songId: number) => {
    const newFavorites = favorites.includes(songId)
      ? favorites.filter(id => id !== songId)
      : [...favorites, songId];
    setFavorites(newFavorites);
    localStorage.setItem('kollamHinduFavorites', JSON.stringify(newFavorites));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-2">🎵 ধর্মীয় গান ও ভজন</h1>
          <p className="text-gray-600">পবিত্র ভজন ও আরতী সংগীত শুনুন</p>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={currentSong?.url}
          preload="metadata"
        />

        {/* Main Player Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Album Art / Visualizer */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 h-64 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-300 rounded-full animate-pulse delay-300"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-300 rounded-full animate-pulse delay-500"></div>
            </div>
            <div className="text-center z-10">
              <MusicIcon className={`w-24 h-24 text-white mx-auto mb-4 ${isPlaying ? 'animate-bounce' : ''}`} />
              <h2 className="text-2xl font-bold text-white">{currentSong?.title || 'কোনো গান নেই'}</h2>
              <p className="text-orange-100">{currentSong?.artist || ''}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Shuffle */}
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-2 rounded-full transition-colors ${isShuffle ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              {/* Previous */}
              <button
                onClick={handlePrevious}
                className="p-3 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="p-4 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors shadow-lg"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              {/* Next */}
              <button
                onClick={handleNext}
                className="p-3 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              {/* Repeat */}
              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-2 rounded-full transition-colors ${isRepeat ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            {/* Volume & Playlist Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-gray-600 hover:text-orange-600"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
              </div>

              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showPlaylist ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <List className="w-5 h-5" />
                প্লেলিস্ট
              </button>
            </div>
          </div>
        </div>

        {/* Playlist */}
        {showPlaylist && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 bg-orange-50 border-b">
              <h3 className="text-lg font-semibold text-orange-800">প্লেলিস্ট ({songs.length}টি গান)</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  onClick={() => selectSong(index)}
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                    currentSongIndex === index
                      ? 'bg-orange-50 border-l-4 border-orange-600'
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentSongIndex === index && isPlaying
                        ? 'bg-orange-600 text-white animate-pulse'
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {currentSongIndex === index && isPlaying ? (
                        <MusicIcon className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <p className={`font-semibold ${currentSongIndex === index ? 'text-orange-700' : 'text-gray-800'}`}>
                        {song.title}
                      </p>
                      <p className="text-sm text-gray-500">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">{formatTime(song.duration)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(song.id);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.includes(song.id)
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-400 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(song.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'দুর্গা ভজন', icon: '🙏' },
            { name: 'কালী ভজন', icon: '🔱' },
            { name: 'শ্যামা আরতী', icon: '🪔' },
            { name: 'সরস্বতী বন্দনা', icon: '📚' },
          ].map((category) => (
            <button
              key={category.name}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <span className="text-3xl mb-2 block">{category.icon}</span>
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Music;