import React from 'react';
import type { MatchUser } from '../../../lib/matchApi';

const COLORS = ['#E8480C', '#3D7A5C', '#B45309', '#141414', '#2563eb', '#9333ea', '#e11d48', '#0e7490'];

interface Props {
  user: Pick<MatchUser, 'id' | 'firstName' | 'pfpSource'>;
  size?: number;
  ring?: boolean;
}

const UserAvatar: React.FC<Props> = ({ user, size = 72, ring = false }) => {
  const bg = COLORS[user.id % COLORS.length];

  const ringStyle = ring ? { outline: '3px solid #E8480C', outlineOffset: 2 } : {};

  if (user.pfpSource) return (
    <img
      src={user.pfpSource}
      alt={user.firstName}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size, border: '2px solid rgba(20,20,20,0.08)', ...ringStyle }}
    />
  );

  return (
    <div
      className="rounded-full flex-shrink-0 flex items-center justify-center text-white font-black"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38, border: '2px solid rgba(20,20,20,0.08)', ...ringStyle }}
    >
      {user.firstName[0]}
    </div>
  );
};

export default UserAvatar;