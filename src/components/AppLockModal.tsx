import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Fingerprint, Sparkles, AlertCircle, ScanFace } from 'lucide-react';
import { ProfessionalProfile } from '../types';

interface AppLockModalProps {
  isLocked: boolean;
  professional: ProfessionalProfile;
  onUnlock: (pin: string) => boolean;
}

export const AppLockModal: React.FC<AppLockModalProps> = ({
  isLocked,
  professional,
  onUnlock,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

  useEffect(() => {
    if (isLocked && window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then((available) => {
        setBiometricAvailable(available);
      }).catch(() => {
        setBiometricAvailable(false);
      });
    }
  }, [isLocked]);

  if (!isLocked) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(pinInput);
    if (!success) {
      setError(true);
      setPinInput('');
    } else {
      setError(false);
      setPinInput('');
    }
  };

  const handleBiometricUnlock = async () => {
    setBiometricLoading(true);
    setError(false);
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      let credential;
      try {
        credential = await navigator.credentials.get({
          publicKey: {
            challenge,
            timeout: 60000,
            userVerification: 'required',
            rpId: window.location.hostname,
          }
        });
      } catch {
        // If no credentials registered yet for this domain, create one for biometric login
        const createChallenge = new Uint8Array(32);
        window.crypto.getRandomValues(createChallenge);
        
        const userId = new Uint8Array(16);
        window.crypto.getRandomValues(userId);

        credential = await navigator.credentials.create({
          publicKey: {
            challenge: createChallenge,
            rp: { name: 'Vitale Home Care Pro', id: window.location.hostname },
            user: {
              id: userId,
              name: professional.email || 'profissional@vitale.com',
              displayName: professional.name,
            },
            pubKeyCredParams: [{ alg: -7, type: 'public-key' }, { alg: -257, type: 'public-key' }],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification: 'required',
            },
            timeout: 60000,
          }
        });
      }

      if (credential) {
        const success = onUnlock(professional.securityPin || '1234');
        if (!success) {
          setError(true);
        }
      }
    } catch (err: any) {
      console.warn('Biometric auth cancelled or failed:', err?.message);
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 select-none">
      <div className="bg-zinc-950 border border-yellow-500/40 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl shadow-yellow-950/50 space-y-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-yellow-400 via-amber-400 to-yellow-300 flex items-center justify-center mx-auto text-black shadow-xl shadow-yellow-950/60 ring-4 ring-yellow-400/20">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-400">
            Segurança & Proteção de Dados Clínicos
          </span>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            Aplicativo Bloqueado
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Área restrita de atendimento domiciliar de <strong className="text-white">{professional.name}</strong> ({professional.councilType} {professional.councilNumber}). Use biometria ou PIN para desbloquear.
          </p>
        </div>

        {/* Biometric / FaceID Button if available */}
        {biometricAvailable && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleBiometricUnlock}
              disabled={biometricLoading}
              className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-yellow-400/40 text-yellow-400 font-bold rounded-2xl text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-yellow-950/20"
            >
              <ScanFace className="w-5 h-5 text-yellow-400" />
              <span>{biometricLoading ? 'Verificando Biometria...' : 'Desbloquear com Biometria / FaceID'}</span>
            </button>
            <div className="flex items-center gap-2 my-2 text-[11px] text-zinc-500">
              <div className="flex-1 h-px bg-zinc-800" />
              <span>ou digite o PIN</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={6}
              autoFocus
              placeholder="Digite o PIN (ex: 1234)"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setError(false);
              }}
              className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
            />
            {error && (
              <p className="text-red-400 text-xs mt-2 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>PIN incorreto. (Padrão inicial: 1234)</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 text-black font-extrabold rounded-2xl text-sm shadow-xl shadow-yellow-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Desbloquear com PIN</span>
          </button>
        </form>

        <div className="pt-3 border-t border-zinc-900 text-[10px] text-zinc-500 flex items-center justify-center gap-2">
          <span>Proteção contra vazamento de dados de pacientes • LGPD</span>
        </div>
      </div>
    </div>
  );
};
