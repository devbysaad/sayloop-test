import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const ProfileSettingsTab = () => {
  const { user }   = useUser();
  const { signOut } = useClerk();
  const navigate   = useNavigate();

  const [editingName, setEditingName] = useState(false);
  const [firstName,   setFirstName]   = useState(user?.firstName ?? '');
  const [lastName,    setLastName]    = useState(user?.lastName  ?? '');
  const [saving,      setSaving]      = useState(false);
  const [saveMsg,     setSaveMsg]     = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await user?.update({ firstName, lastName });
      setSaveMsg('Saved!');
      setEditingName(false);
      setTimeout(() => setSaveMsg(''), 2500);
    } catch {
      setSaveMsg('Error saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">

      {/* Display name */}
      <div className="bg-white border-2 border-amber-100 rounded-[16px] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <p className="font-black text-gray-900 text-[14px] m-0 uppercase tracking-tight">Display Name</p>
          <button
            onClick={() => { setEditingName(!editingName); setSaveMsg(''); }}
            className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-extrabold border-2 cursor-pointer transition-all
              ${editingName
                ? 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                : 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200'}`}
          >
            {editingName ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {!editingName && (
          <p className="text-gray-500 font-semibold text-[13px] m-0 mt-1.5 flex items-center gap-1.5 italic">
            <span>{user?.firstName ?? ''} {user?.lastName ?? ''}</span>
            <span className="opacity-50">·</span>
            <span className="font-bold text-gray-400">@{user?.username ?? '—'}</span>
          </p>
        )}

        {editingName && (
          <div className="flex flex-col gap-2.5 mt-3">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'First name', value: firstName, set: setFirstName },
                { label: 'Last name',  value: lastName,  set: setLastName  },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-[11px] font-extrabold text-gray-700 block mb-1 uppercase tracking-widest opacity-70">
                    {f.label}
                  </label>
                  <input
                    className="w-full px-3.5 py-2.5 rounded-[12px] border-2 border-gray-200 bg-white text-[14px] font-semibold text-gray-900 outline-none transition-all focus:border-amber-400 placeholder:text-gray-300"
                    value={f.value}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.label}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2.5 mt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-extrabold text-[13px] px-5 py-2.5 rounded-[12px] shadow-md transition-all active:scale-95 border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              {saveMsg && (
                <span className={`font-bold text-[13px] ${saveMsg === 'Saved!' ? 'text-green-500' : 'text-red-500'}`}>
                  {saveMsg}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Email */}
      <div className="bg-white border-2 border-amber-100 rounded-[16px] p-4 shadow-sm">
        <p className="font-black text-gray-900 text-[14px] m-0 mb-1 uppercase tracking-tight opacity-80">
          Email Address
        </p>
        <p className="text-gray-500 font-semibold text-[13px] m-0 mb-2">
          {user?.primaryEmailAddress?.emailAddress ?? '—'}
        </p>
        <div className="inline-flex items-center gap-1 bg-green-100 border border-green-200 rounded-full px-2.5 py-0.5">
          <span className="text-green-700 text-[10px]">✓</span>
          <span className="text-green-800 text-[11px] font-extrabold uppercase tracking-tight">Verified Account</span>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white border-2 border-red-100 rounded-[16px] p-4 shadow-sm">
        <p className="font-black text-gray-900 text-[14px] m-0 mb-1 uppercase tracking-tight opacity-80">
          Danger Zone
        </p>
        <p className="text-gray-400 font-semibold text-[12px] m-0 mb-3.5 leading-tight">
          Sign out of your Sayloop account on this device.
        </p>
        <button
          onClick={async () => { await signOut(); navigate('/'); }}
          className="bg-red-50 text-red-600 font-extrabold text-[13px] px-5 py-2.5 rounded-[12px] border-2 border-red-200 cursor-pointer transition-all hover:bg-red-100 active:scale-95 shadow-sm"
        >
          Logout 🚪
        </button>
      </div>

    </div>
  );
};

export default ProfileSettingsTab;