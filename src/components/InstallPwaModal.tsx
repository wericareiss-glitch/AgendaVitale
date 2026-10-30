import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ShieldCheck, 
  WifiOff, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallSuccess?: () => void;
}

export const InstallPwaModal: React.FC<InstallPwaModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallSuccess,
}) => {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('android');
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installCompleted, setInstallCompleted] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOSDevice) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Check standalone mode
    const checkStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    setIsStandalone(checkStandalone);
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setInstallCompleted(true);
          onInstallSuccess?.();
        }
      } catch (err) {
        console.error('Erro ao acionar instalação PWA:', err);
      } finally {
        setIsInstalling(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-yellow-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Glow Banner */}
        <div className="bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-yellow-500/20 px-5 sm:px-6 py-4 border-b border-yellow-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-yellow-950/60 flex items-center justify-center">
              <img 
                src="/pwa-192x192.png" 
                alt="Instituto Vitale" 
                className="w-full h-full object-cover rounded-[14px]"
                onError={(e) => {
                  // Fallback icon if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                  Instalação Direta • Sem Custos
                </span>
              </div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-white mt-0.5">
                Instalar Aplicativo Vitale
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm text-zinc-300">
          {/* Status if already in standalone */}
          {isStandalone ? (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-300">Aplicativo Já Instalado!</p>
                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                  Você já está executando o Instituto Vitale na tela inicial do seu dispositivo em modo nativo offline.
                </p>
              </div>
            </div>
          ) : installCompleted ? (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-300">Instalação Concluída com Sucesso!</p>
                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                  O ícone do Vitale foi adicionado à sua tela de início. Você pode fechar o navegador e abri-lo direto pelo ícone.
                </p>
              </div>
            </div>
          ) : null}

          {/* Value proposition pill cards */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center">
              <Smartphone className="w-4 h-4 text-yellow-400 mb-1" />
              <span className="font-semibold text-white text-[11px]">Tela Cheia</span>
              <span className="text-[10px] text-zinc-400">Sem barra de URL</span>
            </div>
            <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center">
              <WifiOff className="w-4 h-4 text-yellow-400 mb-1" />
              <span className="font-semibold text-white text-[11px]">100% Offline</span>
              <span className="text-[10px] text-zinc-400">Mesmo sem 4G/Wi-Fi</span>
            </div>
            <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-2xl flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-yellow-400 mb-1" />
              <span className="font-semibold text-white text-[11px]">Seguro & LGPD</span>
              <span className="text-[10px] text-zinc-400">Dados criptografados</span>
            </div>
          </div>

          {/* Platform Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-2xl border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setPlatform('ios')}
              className={`flex-1 py-2 px-3 rounded-xl font-medium transition-colors ${
                platform === 'ios'
                  ? 'bg-yellow-400 text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              iPhone / iPad (iOS)
            </button>
            <button
              type="button"
              onClick={() => setPlatform('android')}
              className={`flex-1 py-2 px-3 rounded-xl font-medium transition-colors ${
                platform === 'android'
                  ? 'bg-yellow-400 text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Android (Samsung / Motorola / etc)
            </button>
            <button
              type="button"
              onClick={() => setPlatform('desktop')}
              className={`flex-1 py-2 px-3 rounded-xl font-medium transition-colors hidden sm:block ${
                platform === 'desktop'
                  ? 'bg-yellow-400 text-black font-bold shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Computador / Mac
            </button>
          </div>

          {/* Platform Specific Guides */}
          {platform === 'ios' && (
            <div className="space-y-3.5 bg-black p-4 rounded-2xl border border-zinc-800/90">
              <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-4 h-4" />
                Como instalar no Safari do iPhone:
              </div>

              {/* Step 1 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-yellow-400 text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold text-white">Toque no botão Compartilhar</p>
                  <p className="text-zinc-400 mt-0.5">
                    No Safari (barra inferior do iPhone), toque no ícone com o quadrado e a seta apontando para cima:
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-yellow-400 font-medium">
                    <Share className="w-3.5 h-3.5" />
                    <span>Compartilhar (Share)</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-yellow-400 text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold text-white">Selecione "Adicionar à Tela de Início"</p>
                  <p className="text-zinc-400 mt-0.5">
                    Role a folha de opções para baixo e clique na opção indicada com o ícone quadrado:
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 font-medium">
                    <PlusSquare className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Adicionar à Tela de Início</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-yellow-400 text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold text-white">Confirme em "Adicionar"</p>
                  <p className="text-zinc-400 mt-0.5">
                    No canto superior direito, toque em <strong className="text-yellow-400">Adicionar</strong>. O ícone de alta resolução aparecerá instantaneamente na sua tela de aplicativos!
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-[11px] text-yellow-300 flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-yellow-400" />
                <span>Dica: Abra esta página pelo <strong>Safari</strong> (não navegadores embutidos de redes sociais).</span>
              </div>
            </div>
          )}

          {platform === 'android' && (
            <div className="space-y-3.5 bg-black p-4 rounded-2xl border border-zinc-800/90">
              <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-4 h-4" />
                Instalação direta no Android:
              </div>

              {deferredPrompt ? (
                <div className="p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-center space-y-3">
                  <p className="text-xs text-zinc-200">
                    Seu navegador suporta instalação com <strong>1 clique</strong>! Toque no botão abaixo para fixar o app no celular:
                  </p>
                  <button
                    type="button"
                    onClick={handleNativeInstall}
                    disabled={isInstalling}
                    className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-black rounded-xl font-bold text-sm shadow-xl shadow-yellow-950/60 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isInstalling ? 'Instalando...' : 'Instalar Agora no Celular'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="w-6 h-6 rounded-full bg-yellow-400 text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="text-xs leading-relaxed">
                      <p className="font-semibold text-white">Toque nos 3 pontinhos do Chrome</p>
                      <p className="text-zinc-400 mt-0.5">
                        No canto superior direito do Google Chrome, toque no menu de opções (⋮).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="w-6 h-6 rounded-full bg-yellow-400 text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="text-xs leading-relaxed">
                      <p className="font-semibold text-white">Toque em "Instalar aplicativo"</p>
                      <p className="text-zinc-400 mt-0.5">
                        Ou selecione <strong className="text-yellow-400">"Adicionar à tela inicial"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="w-6 h-6 rounded-full bg-yellow-400 text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="text-xs leading-relaxed">
                      <p className="font-semibold text-white">Pronto!</p>
                      <p className="text-zinc-400 mt-0.5">
                        O aplicativo Vitale será instalado na sua gaveta de aplicativos com ícone dourado e modo offline ativo.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {platform === 'desktop' && (
            <div className="space-y-3 bg-black p-4 rounded-2xl border border-zinc-800/90 text-xs">
              <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wide">
                <Sparkles className="w-4 h-4" />
                Instalação no Computador / Chrome:
              </div>
              <p className="text-zinc-300 leading-relaxed">
                Você também pode instalar o Vitale como aplicativo nativo no seu computador (Windows ou Mac):
              </p>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                <p className="text-zinc-200">
                  1. Na barra de endereços do Chrome ou Edge, clique no ícone de <strong>Instalar</strong> (ícone de computador com seta para baixo ao lado da estrela de favoritos).
                </p>
                <p className="text-zinc-200">
                  2. Clique em <strong>Instalar</strong>.
                </p>
                <p className="text-zinc-400">
                  O Vitale abrirá em sua própria janela independente, sem abas de navegador e com acesso rápido pela barra de tarefas.
                </p>
              </div>

              {deferredPrompt && (
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Instalar no Computador Agora</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-950 px-5 py-3 border-t border-zinc-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Zero consumo de plano de dados após instalado</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium transition-colors"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
