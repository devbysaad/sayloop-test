import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../lib/axiosInstance';

interface Props {
  realName: string;        // the typed first name from the input above
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
  const [selected, setSelected]       = useState<string>('');
  const [loading, setLoading]         = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch every time realName changes (debounced 700ms)
  useEffect(() => {
    if (realName.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(realName.trim()), 700);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [realName]);

  const fetchSuggestions = async (name: string) => {
    setLoading(true);
    console.log('[NicknamePicker] Fetching suggestions for:', name);
    try {
      const res = await axiosInstance.post('/api/ai/name-suggestions', { name });
      console.log('[NicknamePicker] Response:', res.data);
      if (res.data?.success && Array.isArray(res.data.suggestions)) {
        setSuggestions(res.data.suggestions);
      } else {
        throw new Error('Bad response');
      }
    } catch (err: any) {
      console.warn('[NicknamePicker] API failed, using fallback:', err?.message);
      setSuggestions(fallbackNames(name));
    }
    setLoading(false);
  };

  const handleSelect = (nick: string) => {
    console.log('[NicknamePicker] Selected:', nick);
    setSelected(nick);
    onSelect(nick);
  };

  const handleRefresh = () => {
    if (realName.trim().length >= 2) fetchSuggestions(realName.trim());
  };

  if (realName.trim().length < 2) return null;

  return (
    <div className="mt-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
          🎭 Choose a nickname
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="text-xs font-bold text-amber-500 hover:text-amber-600 transition flex items-center gap-1 disabled:opacity-50"
        >
          {loading
            ? <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin inline-block" />
            : '🔄'
          }
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Skeleton while loading (first load) */}
      {loading && suggestions.length === 0 && (
        <div className="flex flex-col gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-11 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Suggestion chips */}
      {!loading && suggestions.length === 0 && realName.trim().length >= 2 && (
        <p className="text-xs text-gray-400 font-semibold">
          Generating suggestions...
        </p>
      )}

      <div className="flex flex-col gap-2">
        {suggestions.map((nick, i) => (
          <button
            key={nick + i}
            type="button"
            onClick={() => handleSelect(nick)}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all flex items-center gap-2
              ${selected === nick
                ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-md scale-[1.01]'
                : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50/50'
              }`}
          >
            <span className="text-base shrink-0">
              {selected === nick ? '✅' : ['😊','🎭','✨','🌟'][i] ?? '•'}
            </span>
            <span className="flex-1">{nick}</span>
            {selected === nick && (
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                Selected!
              </span>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <p className="mt-2 text-xs text-green-600 font-bold flex items-center gap-1">
          🔒 Your real name is hidden — partners see <span className="underline">{selected}</span>
        </p>
      )}
    </div>
  );
};

export default NicknamePicker;
