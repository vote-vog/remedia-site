export type ProgressStep = 'demo' | 'calculator' | 'calculatorCredit' | 'feedback' | 'waitlist';

export interface UserProgress {
  demo: boolean;
  calculator: boolean;
  calculatorCredit: boolean;
  feedback: boolean;
  waitlist: boolean;
  rewardsClaimed: boolean;
  userId: string;
  isLoggedIn: boolean;
  userEmail?: string;
  referralCount: number;
  referralCode: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface UserSession {
  userId: string;
  userEmail?: string;
  loginTime: string;
}

export interface RegistrationData {
  email: string;
  disease: string;
  problem: string;
  notifyMethod: string;
  contactDetails: string;
  agreeTerms: boolean;
}