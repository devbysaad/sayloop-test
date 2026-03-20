import React from 'react';
import { useUser } from '@clerk/clerk-react';

interface League { name: string; color: string; icon: string }

interface Props {
    points: number;
    league: League;
    profileLoading: boolean;
}

const ProfileHeroCard = ({ points, league, profileLoading }: Props) => {
    const { user } = useUser();

    const memberSince = user?.createdAt instanceof Date
        ? user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '—';

    return (
        <div className="bg-gradient-to-br from-[#1a1a26] to-[#2d2d3d] rounded-[24px] p-6 mb-3.5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[radial-gradient(circle,#fde68a,transparent_65%)] opacity-20 pointer-events-none" />

            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative shrink-0">
                    {user?.imageUrl ? (
                        <img
                            src={user.imageUrl}
                            alt="avatar"
                            className="w-[68px] h-[68px] rounded-[20px] border-[3px] border-amber-300 object-cover shadow-lg"
                        />
                    ) : (
                        <div className="w-[68px] h-[68px] rounded-[20px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[28px] font-black text-white border-[3px] border-amber-300 shadow-lg">
                            {(user?.firstName?.[0] ?? user?.username?.[0] ?? '?').toUpperCase()}
                        </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-[2.5px] border-[#1a1a26]" />
                </div>

                <div className="flex-1 min-w-0">
                    <h2 className="text-white font-black text-[19px] m-0 mb-0.5 leading-tight truncate">
                        {user?.firstName
                            ? `${user.firstName} ${user.lastName ?? ''}`.trim()
                            : user?.username ?? 'Learner'}
                    </h2>
                    <p className="text-gray-400 font-bold text-[12px] m-0 mb-1.5 uppercase tracking-wider">
                        @{user?.username ?? '—'}
                    </p>
                    <div className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 rounded-full px-2.5 py-1">
                        <span>{league.icon}</span>
                        <span className="text-amber-500 font-extrabold text-[11px] uppercase tracking-tight">
                            {league.name} League
                        </span>
                    </div>
                </div>

                <div className="bg-amber-500/10 border-2 border-amber-500/25 rounded-[14px] px-3.5 py-2.5 text-center shrink-0">
                    {profileLoading ? (
                        <div className="h-[22px] w-12 mb-1 rounded-lg bg-gradient-to-r from-gray-200 via-amber-50 to-gray-200 animate-pulse" />
                    ) : (
                        <p className="text-amber-500 font-black text-[22px] m-0 mb-px leading-none">
                            {points.toLocaleString()}
                        </p>
                    )}
                    <p className="text-gray-400 font-bold text-[10px] m-0 uppercase tracking-tight opacity-70">Total XP</p>
                </div>
            </div>

            <p className="text-gray-500 font-semibold text-[11px] m-0 mt-3.5 opacity-60">
                Member since {memberSince}
            </p>
        </div>
    );
};

export default ProfileHeroCard;