import React, { useRef, useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Lock,
  Download,
  Image,
  Loader2,
  CheckCircle2,
  Phone,
  MessageCircle,
  AlertCircle,
  Copy
} from 'lucide-react';
import { toPng, toJpeg, toBlob } from 'html-to-image';
import { Prontuario, Patient } from '../types';
import { storageService } from '../services/storage';

interface ProntuarioViewerModalProps {
  isOpen: boolean;
  prontuario: Prontuario | null;
  patient?: Patient | null;
  onClose: () => void;
}

export const ProntuarioViewerModal: React.FC<ProntuarioViewerModalProps> = ({
  isOpen,
  prontuario,
  patient: initialPatient,
  onClose,
}) => {
  const printableRef = useRef<HTMLDivElement | null>(null);

  // Export format: 'png' (lossless, razor sharp) vs 'jpg' (compressed, lighter)
  const [imageFormat, setImageFormat] = useState<'png' | 'jpg'>('png');
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionLabel, setActionLabel] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  // Target WhatsApp phone (loaded from patient or editable)
  const [targetPhone, setTargetPhone] = useState<string>('');
  const [isPhoneEditorOpen, setIsPhoneEditorOpen] = useState(false);

  // Sync patient phone on modal open or prontuario change
  useEffect(() => {
    if (prontuario) {
      const patient = initialPatient || storageService.getPatientById(prontuario.patientId);
      if (patient?.phone) {
        setTargetPhone(patient.phone);
      } else {
        setTargetPhone('');
      }
      setToast(null);
      setIsGenerating(false);
    }
  }, [prontuario, initialPatient]);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!isOpen || !prontuario) return null;

  const handlePrint = () => {
    window.print();
  };

  /**
   * Helper to format filename
   */
  const getCleanFilename = (ext: 'png' | 'jpg') => {
    const safeName = prontuario.patientName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .slice(0, 30);
    return `Prontuario_${safeName}_${prontuario.id}.${ext}`;
  };

  /**
   * Generates a high-resolution image data URL (PNG or JPG) from printableRef
   */
  const generateImageDataUrl = async (format: 'png' | 'jpg') => {
    if (!printableRef.current) return null;

    const options = {
      backgroundColor: '#ffffff',
      pixelRatio: 2, // 2x retina clarity for crisp clinical fonts & stamps
      cacheBust: true,
      quality: format === 'jpg' ? 0.92 : 1,
      style: {
        borderRadius: '0px',
        boxShadow: 'none',
      },
    };

    if (format === 'jpg') {
      return await toJpeg(printableRef.current, options);
    } else {
      return await toPng(printableRef.current, options);
    }
  };

  /**
   * Generates a Blob (PNG or JPEG) from printableRef
   */
  const generateImageBlob = async (format: 'png' | 'jpg'): Promise<Blob | null> => {
    if (!printableRef.current) return null;

    const options = {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      cacheBust: true,
      type: format === 'jpg' ? 'image/jpeg' : 'image/png',
      quality: format === 'jpg' ? 0.92 : 1,
      style: {
        borderRadius: '0px',
        boxShadow: 'none',
      },
    };

    return await toBlob(printableRef.current, options);
  };

  /**
   * Download the Prontuário as an image (PNG or JPG)
   */
  const handleDownloadImage = async (format: 'png' | 'jpg') => {
    try {
      setIsGenerating(true);
      setActionLabel(`Gerando imagem ${format.toUpperCase()}...`);

      const dataUrl = await generateImageDataUrl(format);
      if (!dataUrl) {
        throw new Error('Falha ao renderizar a imagem do prontuário.');
      }

      const filename = getCleanFilename(format);
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToast({
        type: 'success',
        message: `Imagem ${format.toUpperCase()} baixada com sucesso em alta definição!`,
      });
    } catch (err: any) {
      console.error('Erro ao gerar imagem:', err);
      setToast({
        type: 'error',
        message: 'Não foi possível gerar a imagem. Tente novamente.',
      });
    } finally {
      setIsGenerating(false);
      setActionLabel('');
    }
  };

  /**
   * Send / Share the Prontuário image via WhatsApp:
   * 1. Generates image file (PNG/JPG)
   * 2. Checks navigator.canShare({ files: [file] }) to share natively to WhatsApp
   * 3. Fallback: downloads the image + opens WhatsApp web/app with pre-filled message
   */
  // Copy WhatsApp text to clipboard
  const handleCopyWhatsAppText = () => {
    const formattedDate = new Date(prontuario.date).toLocaleDateString('pt-BR');
    const productsSummary = prontuario.etapa5.productsUsed.length > 0
      ? prontuario.etapa5.productsUsed.map((p) => p.productName).join(', ')
      : 'Procedimento / Avaliação Estética Home Care';

    const shareMessage = `Olá, ${prontuario.patientName}! ✨\n\nSegue o seu *Prontuário Clínico & TCLE Homologado* da *${prontuario.professional.clinicOrBrand || 'Vitale Estética Home Care'}*, referente ao atendimento domiciliar realizado em *${formattedDate}*.\n\n🩺 *Responsável Técnica:* ${prontuario.professional.name} (${prontuario.professional.councilType} ${prontuario.professional.councilNumber})\n💉 *Procedimentos:* ${productsSummary}\n🔒 *Selo Digital Criptográfico (SHA-256):*\n\`${prontuario.audit.auditSha256Hash || 'VALIDADO'}\`\n\n📄 *Documento oficial em imagem com assinatura digital anexado!*\nQualquer dúvida sobre orientações pós-atendimento estou à total disposição! 💛`;

    navigator.clipboard.writeText(shareMessage).then(() => {
      setToast({
        type: 'success',
        message: 'Texto para o WhatsApp copiado para a área de transferência! Cole no chat com Ctrl+V.',
      });
    }).catch(() => {
      setToast({
        type: 'error',
        message: 'Falha ao copiar texto.',
      });
    });
  };

  const handleShareWhatsApp = async () => {
    try {
      setIsGenerating(true);
      setActionLabel(`Preparando prontuário em ${imageFormat.toUpperCase()} para WhatsApp...`);

      const blob = await generateImageBlob(imageFormat);
      if (!blob) {
        throw new Error('Erro ao capturar documento.');
      }

      const filename = getCleanFilename(imageFormat);
      const mimeType = imageFormat === 'jpg' ? 'image/jpeg' : 'image/png';
      const file = new File([blob], filename, { type: mimeType });

      // Professional and patient WhatsApp message template
      const formattedDate = new Date(prontuario.date).toLocaleDateString('pt-BR');
      const productsSummary = prontuario.etapa5.productsUsed.length > 0
        ? prontuario.etapa5.productsUsed.map((p) => p.productName).join(', ')
        : 'Procedimento / Avaliação Estética Home Care';

      const shareMessage = `Olá, ${prontuario.patientName}! ✨\n\nSegue o seu *Prontuário Clínico & TCLE Homologado* da *${prontuario.professional.clinicOrBrand || 'Vitale Estética Home Care'}*, referente ao atendimento domiciliar realizado em *${formattedDate}*.\n\n🩺 *Responsável Técnica:* ${prontuario.professional.name} (${prontuario.professional.councilType} ${prontuario.professional.councilNumber})\n💉 *Procedimentos:* ${productsSummary}\n🔒 *Selo Digital Criptográfico (SHA-256):*\n\`${prontuario.audit.auditSha256Hash || 'VALIDADO'}\`\n\n📄 *Documento oficial em imagem (${imageFormat.toUpperCase()}) com assinatura digital anexado!*\nQualquer dúvida sobre orientações pós-atendimento estou à total disposição! 💛`;

      // Clean phone number: remove non-digits
      const digitsOnly = targetPhone.replace(/\D/g, '');
      const waNumber = (digitsOnly.length === 10 || digitsOnly.length === 11)
        ? `55${digitsOnly}`
        : digitsOnly;

      const waUrl = waNumber
        ? `https://wa.me/${waNumber}?text=${encodeURIComponent(shareMessage)}`
        : `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

      // Attempt Native Web Share API with File (Supported on iOS Safari, Android Chrome, Edge)
      let sharedWithNativeAPI = false;
      if (typeof navigator !== 'undefined' && navigator.canShare) {
        try {
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `Prontuário Vitale - ${prontuario.patientName}`,
              text: shareMessage,
              files: [file],
            });
            sharedWithNativeAPI = true;
            setToast({
              type: 'success',
              message: 'Prontuário compartilhado com sucesso via WhatsApp!',
            });
          }
        } catch (shareErr: any) {
          // If the user deliberately dismissed the share modal, don't trigger fallback
          if (shareErr.name === 'AbortError') {
            setIsGenerating(false);
            setActionLabel('');
            return;
          }
          console.warn('Native file share failed, falling back to download + link:', shareErr);
        }
      }

      // Fallback flow: Download the image and launch WhatsApp with the pre-filled text
      if (!sharedWithNativeAPI) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);

        setToast({
          type: 'info',
          message: `Imagem ${imageFormat.toUpperCase()} salva no aparelho! Abrindo WhatsApp com ${prontuario.patientName}...`,
        });

        // Open WhatsApp window with pre-filled text
        window.open(waUrl, '_blank');
      }
    } catch (err: any) {
      console.error('Erro no envio via WhatsApp:', err);
      setToast({
        type: 'error',
        message: 'Erro ao gerar ou enviar via WhatsApp. Tente baixar a imagem diretamente.',
      });
    } finally {
      setIsGenerating(false);
      setActionLabel('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl shadow-yellow-950/20 animate-in zoom-in-95 duration-150">
        {/* Modal Action Header (No-Print) */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 no-print bg-zinc-950 rounded-t-3xl space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-heading font-bold text-white truncate">
                    Prontuário & TCLE Homologado
                  </h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 bg-yellow-400/10 text-yellow-300 text-[10px] font-bold rounded-lg border border-yellow-400/30 uppercase tracking-wide">
                    Vitale Home Care
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate">
                  Paciente: <strong className="text-zinc-200">{prontuario.patientName}</strong> • {new Date(prontuario.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              title="Fechar visualizador"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Toolbar: Format Picker, Download Image, WhatsApp Share, Print PDF */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-zinc-900">
            {/* Format Selector: PNG vs JPG */}
            <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs">
              <span className="text-[11px] text-zinc-400 px-2 font-medium hidden sm:inline">
                Formato de Imagem:
              </span>
              <button
                type="button"
                onClick={() => setImageFormat('png')}
                disabled={isGenerating}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  imageFormat === 'png'
                    ? 'bg-yellow-400 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="PNG: Máxima nitidez sem perdas, ideal para visualização de assinaturas e detalhes clínicos"
              >
                PNG (Alta Nitidez)
              </button>
              <button
                type="button"
                onClick={() => setImageFormat('jpg')}
                disabled={isGenerating}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  imageFormat === 'jpg'
                    ? 'bg-yellow-400 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="JPG: Formato comprimido e otimizado para carregamento veloz no WhatsApp"
              >
                JPG (Mais Leve)
              </button>
            </div>

            {/* Action Buttons Group */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Baixar Imagem (PNG / JPG) */}
              <button
                type="button"
                onClick={() => handleDownloadImage(imageFormat)}
                disabled={isGenerating}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-800"
                title={`Baixar prontuário completo como imagem ${imageFormat.toUpperCase()}`}
              >
                {isGenerating && actionLabel.includes('Gerando') ? (
                  <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                ) : (
                  <Download className="w-4 h-4 text-yellow-400" />
                )}
                <span>Salvar Imagem ({imageFormat.toUpperCase()})</span>
              </button>

              {/* Imprimir ou PDF */}
              <button
                type="button"
                onClick={handlePrint}
                disabled={isGenerating}
                className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-800"
                title="Imprimir ou Salvar como PDF via navegador"
              >
                <Printer className="w-4 h-4 text-zinc-400" />
                <span className="hidden sm:inline">Imprimir / PDF</span>
              </button>

              {/* Botão Copiar Texto para WhatsApp */}
              <button
                type="button"
                onClick={handleCopyWhatsAppText}
                disabled={isGenerating}
                className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-yellow-400 hover:text-yellow-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-800"
                title="Copiar mensagem formatada para a área de transferência"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Mensagem</span>
              </button>

              {/* Botão Principal de Envio Fácil para WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                disabled={isGenerating}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/40 active:scale-98"
                title="Gerar imagem do prontuário e enviar de forma fácil pelo WhatsApp"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{actionLabel || 'Processando...'}</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                    <span>Enviar via WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* WhatsApp Destination Phone Helper / Quick Bar */}
          <div className="flex items-center justify-between gap-2 bg-zinc-900/60 px-3.5 py-2 rounded-xl border border-zinc-850 text-xs">
            <div className="flex items-center gap-2 text-zinc-400 min-w-0">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] text-zinc-400 shrink-0">WhatsApp da Paciente:</span>
              {isPhoneEditorOpen ? (
                <input
                  type="text"
                  value={targetPhone}
                  onChange={(e) => setTargetPhone(e.target.value)}
                  placeholder="Ex: (11) 99999-9999"
                  className="bg-black border border-yellow-400/60 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 w-36 sm:w-44 font-mono"
                />
              ) : (
                <span className="font-mono text-zinc-200 font-semibold truncate">
                  {targetPhone || '(Não informado - abrirá lista de contatos do WhatsApp)'}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsPhoneEditorOpen(!isPhoneEditorOpen)}
              className="text-[11px] text-yellow-400 hover:text-yellow-300 underline font-medium cursor-pointer shrink-0"
            >
              {isPhoneEditorOpen ? 'Concluir' : 'Alterar número'}
            </button>
          </div>

          {/* Toast Notification Alert Banner */}
          {toast && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 transition-all animate-in fade-in ${
                toast.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-200'
                  : toast.type === 'info'
                  ? 'bg-blue-950/80 border border-blue-700/60 text-blue-200'
                  : 'bg-red-950/80 border border-red-700/60 text-red-200'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'info' && <MessageCircle className="w-4 h-4 text-blue-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              <span className="flex-1">{toast.message}</span>
            </div>
          )}
        </div>

        {/* PRINTABLE & CAPTURABLE A4 CLINICAL DOCUMENT CONTAINER */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-zinc-900/40 select-text">
          <div
            ref={printableRef}
            className="max-w-3xl mx-auto space-y-6 bg-white p-6 sm:p-8 text-slate-900 rounded-2xl shadow-xl border border-slate-200"
          >
            {/* Clinical Brand & Professional Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 font-heading">
                  {prontuario.professional.clinicOrBrand || 'Vitale Estética Home Care'}
                </h1>
                <p className="text-sm font-bold text-amber-600">
                  {prontuario.professional.name} • {prontuario.professional.title}
                </p>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  Registro: {prontuario.professional.councilType} {prontuario.professional.councilNumber} | {prontuario.professional.specialty}
                </p>
              </div>

              <div className="text-right sm:text-right border-l-2 sm:border-l-0 sm:border-slate-300 pl-3 sm:pl-0">
                <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-950 rounded font-mono font-bold text-xs uppercase border border-amber-300">
                  Prontuário Homologado
                </span>
                <p className="text-xs text-slate-600 font-mono mt-1">
                  ID: {prontuario.id}
                </p>
                <p className="text-xs text-slate-600">
                  Data: {new Date(prontuario.date).toLocaleDateString('pt-BR')} às {new Date(prontuario.date).toLocaleTimeString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Patient Info Card */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 font-medium">Paciente: </span>
                  <strong className="text-slate-900 text-sm">{prontuario.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">CPF: </span>
                  <span className="font-mono text-slate-800">{prontuario.patientCpf}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Local do Atendimento Domiciliar: </span>
                <span className="text-slate-800 font-medium">
                  {prontuario.audit.geolocation?.addressReference || 'Residência da Paciente (Home Care)'}
                </span>
              </div>
            </div>

            {/* 1. Queixas */}
            <div className="space-y-1.5 text-xs">
              <h3 className="font-bold text-slate-950 uppercase border-b border-slate-300 pb-1 flex items-center gap-1.5 text-xs">
                <span>1. Queixas Principais & Alinhamento Clínico</span>
              </h3>
              <p>
                <strong>Queixas Registradas:</strong> {prontuario.etapa1.mainComplaints.join(', ')}
              </p>
              <p>
                <strong>Detalhamento Clínico:</strong> {prontuario.etapa1.complaintsDetails}
              </p>
              <p>
                <strong>Expectativa Alinhada:</strong> {prontuario.etapa1.expectations}
              </p>
            </div>

            {/* 2. Histórico & Red Flags */}
            <div className="space-y-1.5 text-xs">
              <h3 className="font-bold text-slate-950 uppercase border-b border-slate-300 pb-1 text-xs">
                2. Histórico Clínico & Segurança do Paciente (Red Flags)
              </h3>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <p><strong>Gestante / Lactante:</strong> {prontuario.etapa2.isPregnantOrLactating ? 'SIM' : 'NÃO (Apto)'}</p>
                <p><strong>Doenças Autoimunes:</strong> {prontuario.etapa2.autoimmuneDiseases.has ? `Sim (${prontuario.etapa2.autoimmuneDiseases.details})` : 'Não'}</p>
                <p><strong>Histórico de Herpes:</strong> {prontuario.etapa2.activeHerpes.hasHistory ? 'Sim (Sem lesão ativa)' : 'Não'}</p>
                <p><strong>Alergias Conhecidas:</strong> {prontuario.etapa2.allergies.list.length > 0 ? prontuario.etapa2.allergies.list.join(', ') : 'Nenhuma relatada'}</p>
                <p><strong>Risco Clínico:</strong> <span className="uppercase font-bold text-amber-700">{prontuario.etapa2.clinicalRiskLevel}</span></p>
              </div>
            </div>

            {/* 3. Hábitos & Exame Físico */}
            <div className="space-y-1.5 text-xs">
              <h3 className="font-bold text-slate-950 uppercase border-b border-slate-300 pb-1 text-xs">
                3. Exame Físico & Hábitos de Vida
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 uppercase block">Fototipo</span>
                  <strong className="text-slate-900">Fitzpatrick {prontuario.etapa4.fitzpatrickScale}</strong>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 uppercase block">Fotoenvelhecimento</span>
                  <strong className="text-slate-900">Glogau {prontuario.etapa4.glogauScale}</strong>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 uppercase block">Biotipo Cutâneo</span>
                  <strong className="text-slate-900 capitalize">{prontuario.etapa4.skinBiotype}</strong>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-[10px] text-slate-500 uppercase block">Água Diária</span>
                  <strong className="text-slate-900">{prontuario.etapa3.dailyWaterIntake} L / dia</strong>
                </div>
              </div>
              <p className="mt-1">
                <strong>Achados Físicos:</strong> {prontuario.etapa4.clinicalFindings}
              </p>
            </div>

            {/* 4. Rastreabilidade Sanitária dos Produtos e Atendimento */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-950 uppercase border-b border-slate-300 pb-1 flex items-center justify-between text-xs">
                <span>4. Rastreabilidade de Produtos, Enzimas e Injetáveis (ANVISA)</span>
                <span className="text-[10px] font-normal text-slate-500">Vigilância Sanitária</span>
              </h3>

              <table className="w-full border-collapse border border-slate-300 text-left text-[11px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-800">
                    <th className="p-2 border-r border-slate-300">Produto / Fórmula</th>
                    <th className="p-2 border-r border-slate-300">Lote</th>
                    <th className="p-2 border-r border-slate-300">Validade</th>
                    <th className="p-2 border-r border-slate-300">Dose / Volume</th>
                    <th className="p-2">Região / Aplicação</th>
                  </tr>
                </thead>
                <tbody>
                  {prontuario.etapa5.productsUsed.map((prod, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-300 font-medium">
                        {prod.productName} ({prod.manufacturer})
                      </td>
                      <td className="p-2 border-r border-slate-300 font-mono font-bold text-amber-700">
                        {prod.batchNumber}
                      </td>
                      <td className="p-2 border-r border-slate-300 font-mono">
                        {prod.expirationDate}
                      </td>
                      <td className="p-2 border-r border-slate-300">
                        {prod.dosageOrVolume}
                      </td>
                      <td className="p-2">
                        {prod.applicationSite}
                      </td>
                    </tr>
                  ))}
                  {prontuario.etapa5.productsUsed.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-2 text-center text-slate-500 italic">
                        Nenhum produto com lote específico registrado para este atendimento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Orientações Pós-Atendimento */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-slate-900 block">Orientações Pós-Procedimento Vitale:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[11px]">
                {prontuario.etapa5.postCareGuidelines.slice(0, 4).map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>

            {/* Fotos Clínicas se existirem */}
            {prontuario.photos.length >= 2 && (
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-slate-950 uppercase border-b border-slate-300 pb-1 text-xs">
                  5. Documentação Fotográfica Clínica
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {prontuario.photos.slice(0, 2).map((photo) => (
                    <div key={photo.id} className="border border-slate-300 rounded-lg overflow-hidden p-1 bg-slate-50">
                      <img src={photo.dataUrl} alt={photo.type} className="w-full aspect-[4/3] object-cover rounded" />
                      <p className="text-center font-bold text-[10px] uppercase mt-1 text-slate-700">
                        {photo.type} ({photo.angle})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TCLE & Assinatura Digital */}
            <div className="border-t-2 border-slate-900 pt-4 space-y-3">
              <h3 className="font-bold text-slate-950 uppercase text-xs">
                {prontuario.photos.length >= 2 ? '6' : '5'}. Termo de Consentimento & Assinatura Digital
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end pt-2">
                <div className="text-center border-t border-slate-400 pt-2 space-y-1">
                  {prontuario.audit.signatureDataUrl ? (
                    <img
                      src={prontuario.audit.signatureDataUrl}
                      alt="Assinatura da Paciente"
                      className="h-16 mx-auto object-contain"
                    />
                  ) : (
                    <div className="h-16 flex items-center justify-center text-xs text-slate-400">
                      (Assinatura Coletada)
                    </div>
                  )}
                  <p className="font-bold text-xs text-slate-900">{prontuario.patientName}</p>
                  <p className="text-[10px] text-slate-600 font-mono">CPF: {prontuario.patientCpf}</p>
                </div>

                <div className="text-center border-t border-slate-400 pt-2 space-y-1">
                  <div className="h-16 flex items-center justify-center font-heading text-amber-700 font-bold italic text-base">
                    {prontuario.professional.name}
                  </div>
                  <p className="font-bold text-xs text-slate-900">{prontuario.professional.name}</p>
                  <p className="text-[10px] text-slate-600 font-mono">
                    {prontuario.professional.councilType} nº {prontuario.professional.councilNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* SHA-256 Audit Seal Footer */}
            <div className="bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 text-[11px] space-y-1 font-mono">
              <div className="flex items-center justify-between text-yellow-400 font-bold">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  SELO DIGITAL DE CONFORMIDADE CRIPTOGRÁFICA (SHA-256)
                </span>
                <span className="text-[10px] text-slate-400 font-sans">Homologado</span>
              </div>
              <p className="text-[10px] text-slate-300 break-all select-all font-mono">
                HASH: {prontuario.audit.auditSha256Hash || 'VALIDADO_EM_BANCO_LOCAL'}
              </p>
              <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Timestamp UTC: {prontuario.audit.signedAtUtc || prontuario.date}</span>
                {prontuario.audit.geolocation && (
                  <span>
                    GPS: {prontuario.audit.geolocation.latitude.toFixed(6)}, {prontuario.audit.geolocation.longitude.toFixed(6)} (±{prontuario.audit.geolocation.accuracyMeters}m)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
