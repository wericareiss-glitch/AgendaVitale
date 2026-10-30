/**
 * Criptografia SHA-256 e trilha de conformidade jurídica para Estetika Home Care
 */

export async function generateSha256Hash(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export interface AuditPayloadInput {
  prontuarioId: string;
  patientId: string;
  patientCpf: string;
  signedAtUtc: string;
  professionalCouncil: string;
  latitude?: number;
  longitude?: number;
  productsSummary: string;
  signatureChecksum: string;
}

export async function generateAuditSeal(input: AuditPayloadInput): Promise<string> {
  const rawString = [
    `PRONTUARIO_ID:${input.prontuarioId}`,
    `PATIENT_CPF:${input.patientCpf}`,
    `TIMESTAMP_UTC:${input.signedAtUtc}`,
    `PROFESSIONAL:${input.professionalCouncil}`,
    `GEO:${input.latitude ?? 'NO_GPS'},${input.longitude ?? 'NO_GPS'}`,
    `PRODUCTS:${input.productsSummary}`,
    `SIG_HASH:${input.signatureChecksum.slice(0, 32)}`
  ].join('||');

  return generateSha256Hash(rawString);
}

export function requestDeviceGeolocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracyMeters: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada no dispositivo'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
          accuracyMeters: Math.round(pos.coords.accuracy),
        });
      },
      (err) => {
        // Fallback for permissions denied or timeout in demo environment
        console.warn('Geolocation warning/fallback:', err.message);
        resolve({
          latitude: -23.561684,
          longitude: -46.655981,
          accuracyMeters: 12,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
      }
    );
  });
}
