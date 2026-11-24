import { Patient } from '../types';

class NotificationService {
  private timer: any = null;

  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações.');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  public checkAndNotify(patients: Patient[]) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const now = new Date();

    patients.forEach((patient) => {
      if (!patient.scheduledDate) return;
      if (!patient.scheduledDate.startsWith(todayStr)) return;

      const schedTime = new Date(patient.scheduledDate);
      const diffMinutes = Math.floor((schedTime.getTime() - now.getTime()) / (1000 * 60));

      // Notify if appointment is in 30 minutes or happening right now (within 5 minutes)
      if (diffMinutes >= 25 && diffMinutes <= 35) {
        new Notification('Vitale Home Care - Lembrete de Agendamento', {
          body: `Atendimento com ${patient.name} (${patient.address.neighborhood}) em 30 minutos!`,
          icon: '/public/assets/vitale_icon_square.png',
        });
      } else if (diffMinutes >= -5 && diffMinutes <= 5) {
        new Notification('Vitale Home Care - Hora do Atendimento!', {
          body: `Chegou o horário do atendimento domiciliar com ${patient.name} (${patient.address.neighborhood}).`,
          icon: '/public/assets/vitale_icon_square.png',
        });
      }
    });
  }

  public startScheduler(getPatients: () => Patient[]) {
    // Check every 5 minutes
    if (this.timer) clearInterval(this.timer);
    
    this.timer = setInterval(() => {
      const patients = getPatients();
      this.checkAndNotify(patients);
    }, 5 * 60 * 1000);

    // Initial check
    const patients = getPatients();
    this.checkAndNotify(patients);
  }

  public stopScheduler() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const notificationService = new NotificationService();
