import React from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/layout/Footer";
import { RewardsPopup } from "@/components/RewardsPopup";
import { ReferralPopup } from "@/components/ReferralPopup";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface AppLayoutProps {
  children: React.ReactNode;
  ui: {
    showRewardsPopup: boolean;
    showReferralPopup: boolean;
    showReferralSuccess: boolean;
    rewardsPopupMode: 'login' | 'register';
    progress: any;
    handleOpenRewardsPopup: (mode?: 'login' | 'register') => void;
    handleOpenReferralPopup: () => void;
    handleCloseRewardsPopup: () => void;
    handleCloseReferralPopup: () => void;
    handleClaimRewards: (userData: any) => Promise<void>;
  };
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, ui }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <Header 
        onOpenRewardsPopup={ui.handleOpenRewardsPopup}
        onOpenReferralPopup={ui.handleOpenReferralPopup}
      />

      {/* УВЕДОМЛЕНИЕ О УСПЕШНОМ РЕФЕРАЛЕ */}
      {ui.showReferralSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <span>Вы получили +20% за приглашенного друга!</span>
            </div>
          </div>
        </div>
      )}

      {/* ОСНОВНОЕ СОДЕРЖИМОЕ */}
      <div className="relative z-10">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </div>

      {/* FOOTER */}
      <Footer />

      {/* POPUP'Ы */}
      {ui.showRewardsPopup && (
        <RewardsPopup
          isOpen={ui.showRewardsPopup}
          onClose={ui.handleCloseRewardsPopup}
          onClaim={ui.handleClaimRewards}
          initialMode={ui.rewardsPopupMode}
        />
      )}

      {ui.showReferralPopup && (
        <ReferralPopup
          isOpen={ui.showReferralPopup}
          onClose={ui.handleCloseReferralPopup}
          referralCode={ui.progress.referralCode}
          referralCount={ui.progress.referralCount}
          userEmail={ui.progress.userEmail}
        />
      )}
    </div>
  );
};