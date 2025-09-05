'use client';
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useProfile } from '@/lib/useProfile';
import { useUser } from '@/components/auth/UserContextProvider';
import Avatar from 'boring-avatars';
import type { Tables } from '@/lib/types';

type ProfileRow = Tables<'profiles'>;

/**
 * Modal para editar el perfil del usuario (nombre y avatar).
 * Inspirado en el diseño de AdPreviewModal.
 * Ubicación: /components/account/EditProfileModal.tsx
 */
export default function EditProfileModal({
  open,
  onClose,
  userId,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
}) {
  const { user: authUser } = useUser();
  const profileResp = useProfile(userId) as unknown as { data: ProfileRow | null; mutate: () => Promise<any> };
  const { data: profile, mutate } = profileResp;
  const [name, setName] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile?.full_name ?? '');
      setEmail(authUser?.email ?? '');
      // Genera un seed único para el avatar
      const base = profile?.full_name || authUser?.email || Math.random().toString(36);
      const seed = base.slice(0, 16);
      setAvatarSeed(seed);
    }
  }, [profile, open, authUser]);

  const save = async () => {
    setLoading(true);
    // Genera la url del avatar SVG para guardar en Supabase
    const avatar_url = `https://source.boringavatars.com/beam/160/${avatarSeed}?colors=ff006f,fff538,00d1ff,000000,f1f1f1`;
    await fetch('/api/profile/update', {
      method: 'POST',
      body: JSON.stringify({ full_name: name, email, avatar_url }),
    });
    await mutate();
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-[200] flex justify-center items-center">
      <Dialog.Panel className="bg-white border-2 border-black rounded-2xl p-6 w-[30rem] max-w-full shadow-retro space-y-4 flex flex-col items-center">
        <Dialog.Title className="font-bold text-lg mb-2">Editar perfil</Dialog.Title>
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="w-16 h-16 rounded-full border-2 border-black bg-neutral-100 flex items-center justify-center mb-2 overflow-hidden">
            <Avatar
              size={64}
              name={name || email || avatarSeed}
              variant="beam"
              colors={["#ff006f", "#fff538", "#00d1ff", "#000000", "#f1f1f1"]}
              square={false}
            />
          </div>
          <button
            type="button"
            className="underline text-xs text-neutral-500 hover:text-black mb-1"
            onClick={() => setAvatarSeed(Math.random().toString(36).slice(2, 10))}
            disabled={loading}
          >
            Cambiar avatar
          </button>
          <input
            className="input input-bordered w-full"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <p className="text-[10px]">Cambiar e-mail enviará un link de confirmación.</p>
        </div>
        <button className="w-full dopamine-btn-secondary mb-2" disabled={loading} onClick={save}>
          {loading ? 'Guardando…' : 'Guardar cambios'}
        </button>
        <button
          className="w-full dopamine-btn-secondary mb-2 bg-[#fff538] text-black border-2 border-black hover:bg-yellow-300"
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </button>
      </Dialog.Panel>
    </Dialog>
  );
} 