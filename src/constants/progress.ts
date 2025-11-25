export const TELEGRAM_CONFIG = {
  BOT_TOKEN: import.meta.env.VITE_TELEGRAM_BOT_TOKEN,
  CHAT_ID: import.meta.env.VITE_TELEGRAM_CHAT_ID
} as const;

export const STORAGE_KEYS = {
  USER_ID: 'remedia-user-id',
  SESSION: 'remedia-user-session',
  PROGRESS: (userId: string) => `remedia-progress-${userId}`,
} as const;

export const DEFAULT_PROGRESS: UserProgress = {
  demo: false,
  calculator: false,
  calculatorCredit: false,
  feedback: false,
  waitlist: false,
  rewardsClaimed: false,
  userId: '',
  isLoggedIn: false,
  referralCount: 0,
  referralCode: '',
};

export const STEP_NAMES: Record<ProgressStep, string> = {
  'demo': 'Знакомство с демо',
  'calculator': 'Сборка приложения',
  'calculatorCredit': 'Сборка приложения с кредитом',
  'feedback': 'Обратная связь',
  'waitlist': 'Регистрация в списке'
};