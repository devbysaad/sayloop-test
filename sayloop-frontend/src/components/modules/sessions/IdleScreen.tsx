import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sessionActions } from '../../../redux/service/session.saga';

const TOPICS = [
  { id: 1, label: 'AI & Society',        emoji: '🤖', color: 'bg-[#1CB0F6]' },
  { id: 2, label: 'Climate Change',      emoji: '🌍', color: 'bg-[#58CC02]' },
  { id: 3, label: 'Future of Work',      emoji: '💼', color: 'bg-[#FF9600]' },
  { id: 4, label: 'Social Media',        emoji: '📱', color: 'bg-[#CE82FF]' },
  { id: 5, label: 'Space Exploration',   emoji: '🚀', color: 'bg-[#FF4B4B]' },
  { id: 6, label: 'Education System',    emoji: '📚', color: 'bg-[#1CB0F6]' },
];

const IdleScreen = ({ userId }) => {
  const dispatch       = useDispatch();
  const [selected, setSelected] = useState(null);

  const handleFind = () => {
    if (!selected) return;
    dispatch(sessionActions.findPartner({ userId, topic: selected.label }));
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex flex-col items-center justify-center px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-4xl font-black text-[#4B4B4B] mb-3">
          Find a Debate Partner
        </h1>
        <p className="text-gray-500 font-medium text-lg max-w-md">
          Pick a topic, get matched instantly, and debate face-to-face via video call.
        </p>
      </div>

      {/* Topic grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelected(topic)}
            className={`
              relative rounded-[20px] p-5 text-left transition-all duration-200 border-2
              ${selected?.id === topic.id
                ? 'border-[#58CC02] bg-white shadow-lg scale-[1.03]'
                : 'border-transparent bg-white shadow-sm hover:shadow-md hover:scale-[1.01]'
              }
            `}
          >
            {selected?.id === topic.id && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-[#58CC02] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            <div className={`w-10 h-10 ${topic.color} rounded-xl flex items-center justify-center text-xl mb-3`}>
              {topic.emoji}
            </div>
            <p className="font-bold text-[#4B4B4B] text-sm leading-tight">{topic.label}</p>
          </button>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={handleFind}
        disabled={!selected}
        className={`
          px-10 py-4 rounded-[16px] font-extrabold text-lg transition-all duration-200
          ${selected
            ? 'bg-[#58CC02] text-white shadow-[0_4px_0_#46a302] hover:shadow-[0_2px_0_#46a302] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {selected ? `Find Partner for "${selected.label}"` : 'Select a Topic First'}
      </button>
    </div>
  );
};

export default IdleScreen;
