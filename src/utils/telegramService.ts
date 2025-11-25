import { TELEGRAM_CONFIG } from '../constants/progress';
import { UserProgress, ProgressStep, RegistrationData } from '../types/progress';
import { STEP_NAMES } from '../constants/progress';

const sendTelegramMessage = async (message: string): Promise<void> => {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        text: message,
      })
    });
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error);
  }
};

export const sendProgressAnalytics = async (
  userId: string, 
  step: ProgressStep, 
  progress: UserProgress
): Promise<void> => {
  const message = `📊 Прогресс пользователя:

👤 ID: ${userId}
📧 Email: ${progress.userEmail || 'Аноним'}
🔐 Статус: ${progress.isLoggedIn ? 'Авторизован' : 'Аноним'}
🎯 Завершен этап: ${STEP_NAMES[step] || step}
👥 Рефералов: ${progress.referralCount}
⏰ Время: ${new Date().toLocaleString('ru-RU')}`;

  await sendTelegramMessage(message);
};

export const sendRegistrationToTelegram = async (
  userId: string, 
  userData: RegistrationData, 
  progress: UserProgress
): Promise<void> => {
  const message = `🎉 НОВАЯ РЕГИСТРАЦИЯ!

👤 Пользователь: ${userId}
📧 Email: ${userData.email}
🔗 Реферальный код: ${progress.referralCode}
🏥 Заболевание: ${userData.disease}
❓ Проблема: ${userData.problem}
📱 Уведомлять через: ${userData.notifyMethod}
✅ Согласие с условиями: ${userData.agreeTerms ? 'Да' : 'Нет'}

⏰ ${new Date().toLocaleString('ru-RU')}`;

  await sendTelegramMessage(message);
};

export const sendReferralNotification = async (
  referralCode: string, 
  currentUser: string, 
  newReferralCount: number
): Promise<void> => {
  const message = `👥 НОВЫЙ РЕФЕРАЛ!

🔗 Код приглашения: ${referralCode}
👤 Текущий пользователь: ${currentUser}
📊 Новый счетчик рефералов: ${newReferralCount}
⏰ Время: ${new Date().toLocaleString('ru-RU')}

🎯 Статус реферальной программы:
• Активных рефералов: ${newReferralCount}
• Бонус к прогрессу: +${newReferralCount * 20}%`;

  await sendTelegramMessage(message);
};