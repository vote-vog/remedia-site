import { UserProgress, UserSession, DEFAULT_PROGRESS } from '../types/progress';
import { STORAGE_KEYS } from '../constants/progress';
import { migrateProgressData } from '../lib/progress/migration';
import { validateProgress } from '../lib/progress/validation';

export const generateUserId = (): string => {
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
};

export const generateReferralCode = (email: string): string => {
  const base = btoa(email).replace(/[^a-zA-Z0-9]/g, '');
  return `REF${base.substring(0, 6)}${Date.now().toString(36).substr(-2)}`.toUpperCase();
};

export const saveProgressToStorage = (progress: UserProgress): void => {
  try {
    if (!validateProgress(progress)) {
      console.warn('❌ Invalid progress data, not saving');
      return;
    }
    
    const progressKey = STORAGE_KEYS.PROGRESS(progress.userId);
    localStorage.setItem(progressKey, JSON.stringify(progress));
    
    // Сохраняем сессию если пользователь авторизован
    if (progress.isLoggedIn) {
      const session: UserSession = {
        userId: progress.userId,
        userEmail: progress.userEmail,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    }
  } catch (error) {
    console.error('❌ Error saving progress to storage:', error);
  }
};

export const loadProgressFromStorage = (): UserProgress => {
  try {
    // Пытаемся восстановить сессию
    const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (savedSession) {
      try {
        const session: UserSession = JSON.parse(savedSession);
        const progressKey = STORAGE_KEYS.PROGRESS(session.userId);
        const userProgress = localStorage.getItem(progressKey);
        
        if (userProgress) {
          const parsedProgress = JSON.parse(userProgress);
          const migratedProgress = migrateProgressData(parsedProgress, session.userId);
          
          if (validateProgress(migratedProgress)) {
            return migratedProgress;
          }
        }
      } catch (error) {
        console.warn('❌ Error restoring session, creating new user');
      }
    }

    // Создаем анонимного пользователя
    const userId = generateUserId();
    const progressKey = STORAGE_KEYS.PROGRESS(userId);
    const savedProgress = localStorage.getItem(progressKey);
    
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        const migratedProgress = migrateProgressData(parsedProgress, userId);
        
        if (validateProgress(migratedProgress)) {
          return migratedProgress;
        }
      } catch (error) {
        console.warn('❌ Error loading progress, using default');
      }
    }
    
    return { ...DEFAULT_PROGRESS, userId };
    
  } catch (error) {
    console.error('❌ Critical error loading progress:', error);
    const userId = generateUserId();
    return { ...DEFAULT_PROGRESS, userId };
  }
};

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};