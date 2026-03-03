import React from 'react';
import type { MatchUser } from  '../../../lib/matchApi';

const COLORS = ['#f97316','#8b5cf6','#06b6d4','#10b981','#f43f5e','#3b82f6','#ec4899','#14b8a6'];

interface Props {
  user: Pick<MatchUser, 'id' | 'firstName' | 'pfpSource'>;
  size?: number;
  ring?: boolean;
}

const UserAvatar: React.FC<Props> = ({ user, size = 72, ring = false }) => {
  const bg = COLORS[user.id % COLORS.length];

  const ringStyle = ring
    ? { ring: '3px solid #f97316', outline: '3px solid #f97316', outlineOffset: 2 }
    : {};

  if (user.pfpSource) return (
    <img
      src={user.pfpSource}
      alt={user.firstName}
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size, ...ringStyle }}
    />
  );

  return (
    <div
      className="rounded-full flex-shrink-0 flex items-center justify-center text-white font-black"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38, ...ringStyle }}
    >
      {user.firstName[0]}
    </div>
  );
};

export default UserAvatar;