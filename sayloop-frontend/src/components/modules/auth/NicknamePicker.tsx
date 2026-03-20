import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../lib/axiosInstance';

interface Props {
  realName: string;
  onSelect: (nickname: string) => void;
}

function fallbackNames(name: string): string[] {
  const n = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return [
    n,
    n.endsWith('a') ? n.slice(0, -1) + 'ah' : n + 'a',
    n.endsWith('y') ? n.slice(0, -1) + 'ie' : n + 'y',
    n.length > 3 ? n.slice(0, -1) + 'o' : n + 'i',
  ].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 4);
}

const NicknamePicker: React.FC<Props> = ({ realName, onSelect }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (realName.trim().length < 2) { setSuggestions([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(realName.trim()), 700);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [realName]);

  const fetchSuggestions = async (name: string) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/ai/name-suggestions', { name });
      if (res.data?.success && Array.isArray(res.data.suggestions)) {
        setSuggestions(res.data.suggestions);
      } else throw new Error('Bad response');
    } catch {
      setSuggestions(fallbackNames(name));
    }
    setLoading(false);
  };

  const handleSelect = (nick: string) => {
    setSelected(nick);
    onSelect(nick);
  };

  const handleRefresh = () => {
    if (realName.trim().length >= 2) fetchSuggestions(realName.trim());
  };

  if (realName.trim().length < 2) return null;

  return (
    <div className="mt-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'rgba(20,20,20,0.4)' }}>
          🎭 Choose a nickname
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="text-xs font-black flex items-center gap-1 disabled:opacity-50 transition-opacity hover:opacity-70"
          style={{ color: '#E8480C' }}
        >
          {loading
            ? <span className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin inline-block" style={{ borderColor: 'rgba(232,72,12,0.3)', borderTopColor: '#E8480C' }} />
            : '🔄'
          }
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {loading && suggestions.length === 0 && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-11 rounded-xl animate-pulse" style={{ background: 'rgba(20,20,20,0.05)' }} />
          ))}
        </div>
      )}

      {!loading && suggestions.length === 0 && realName.trim().length >= 2 && (
        <p className="text-xs font-normal" style={{ color: 'rgba(20,20,20,0.4)' }}>Generating suggestions...</p>
      )}

      <div className="flex flex-col gap-2">
        {suggestions.map((nick, i) => (
          <button
            key={nick + i}
            type="button"
            onClick={() => handleSelect(nick)}
            className="w-full text-left px-4 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 hover:scale-[1.01]"
            style={selected === nick
              ? { border: '1.5px solid rgba(232,72,12,0.4)', background: '#FFF4EF', color: '#E8480C', boxShadow: '0 2px 10px rgba(232,72,12,0.12)' }
              : { border: '1px solid rgba(20,20,20,0.1)', background: 'white', color: '#141414' }
            }
          >
            <span className="text-base shrink-0">
              {selected === nick ? '✅' : ['😊', '🎭', '✨', '🌟'][i] ?? '•'}
            </span>
            <span className="flex-1">{nick}</span>
            {selected === nick && (
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#E8480C' }}>Selected!</span>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <p className="mt-2 text-xs font-medium flex items-center gap-1" style={{ color: '#3D7A5C' }}>
          🔒 Your real name is hidden — partners see <span className="font-black underline">{selected}</span>
        </p>
      )}
    </div>
  );
};

export default NicknamePicker;