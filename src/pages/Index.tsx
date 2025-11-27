// src/pages/Index.tsx
import { useEffect, useState, useCallback } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ChatDemo } from "@/components/ChatDemo";
import { BenefitsSection } from "@/components/BenefitsSection";
import { PilotResults } from "@/components/PilotResults";
import { FAQ } from "@/components/FAQ";
import { WaitlistSection } from "@/components/WaitlistSection";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { RewardsPopup } from "@/components/RewardsPopup";
import { ReferralPopup } from "@/components/ReferralPopup";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { Footer } from "@/components/layout/Footer";
import { EasterEggs } from "@/components/EasterEggs";
import { YandexMetrika } from "@/components/YandexMetrika";
import { useProgress } from "@/hooks/useProgress";

const Index = () => {
  const {
    showRewardsPopup,
    showReferralPopup,
    showReferralSuccess,
    rewardsPopupMode,
    
    handleOpenRewardsPopup,
    handleOpenReferralPopup,
    handleCloseRewardsPopup,
    handleCloseReferralPopup,
    claimRewards,
    processReferralLink,
    
    progress,
    isInitialized
  } = useProgress();

  // 🎯 Состояния для отслеживания взаимодействий с пасхалками
  const [anyButtonClicked, setAnyButtonClicked] = useState(false);
  const [progressBarClicked, setProgressBarClicked] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      processReferralLink();
    }
  }, [isInitialized, processReferralLink]);

  // 🎯 Обработчики для активации пасхалок
  const handleAnyButtonClick = useCallback(() => {
    if (!anyButtonClicked) {
      console.log('🎯 Any button clicked - activating easter eggs');
      setAnyButtonClicked(true);
    }
  }, [anyButtonClicked]);

  const handleProgressBarClick = useCallback(() => {
    if (!progressBarClicked) {
      console.log('🎯 Progress bar clicked - activating token easter egg');
      setProgressBarClicked(true);
    }
  }, [progressBarClicked]);

  // 🎯 Получаем отображаемое имя пользователя
  const getUserDisplayName = () => {
    if (!progress.userEmail) return "";
    const [name] = progress.userEmail.split('@');
    return name.length > 10 ? `${name.substring(0, 10)}...` : name;
  };

  console.log('🎯 Index render:', {
    showReferralPopup,
    showRewardsPopup,
    progress: progress.userEmail,
    referral: progress.referral,
    anyButtonClicked,
    progressBarClicked
  });

  return (
    <div className="min-h-screen bg-background">
      {/* 🎯 Яндекс.Метрика */}
      <YandexMetrika />

      {/* 🎯 ПАСХАЛКИ-КАПСУЛКИ */}
      <EasterEggs 
        progressBarClicked={progressBarClicked}
        anyButtonClicked={anyButtonClicked}
      />

      {/* 🔥 HEADER - только для пользователей с email */}
      <Header 
        isLoggedIn={!!progress.userEmail}
        userDisplayName={getUserDisplayName()}
        onProfileClick={() => {
          // 🎯 Открытие попапа с наградами или профилем + активация пасхалок
          handleAnyButtonClick();
          handleOpenRewardsPopup('profile');
        }}
      />

      {/* 🔥 PROGRESS BAR - под хедером */}
      <ProgressBar 
        onOpenRewards={() => {
          console.log('🎯 onOpenRewards called from Index');
          handleProgressBarClick();
          handleAnyButtonClick();
          handleOpenRewardsPopup('rewards');
        }}
        onOpenReferral={() => {
          console.log('🎯 onOpenReferral called from Index'); 
          handleProgressBarClick();
          handleAnyButtonClick();
          handleOpenReferralPopup();
        }}
      />

      {/* 🔥 УВЕДОМЛЕНИЕ О УСПЕШНОМ РЕФЕРАЛЕ */}
      {showReferralSuccess && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <span>Вы получили +20% за приглашенного друга!</span>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 ОСНОВНОЕ СОДЕРЖИМОЕ СТРАНИЦЫ */}
      <div className="relative z-10">
        {/* HERO SECTION */}
        <div id="hero">
          <ErrorBoundary>
            <HeroSection onButtonClick={handleAnyButtonClick} />
          </ErrorBoundary>
        </div>

        {/* DEMO SECTION */}
        <section id="demo" className="py-16 px-4">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Попробуйте в действии
            </h2>
            <p className="text-lg text-muted-foreground">
              Интерактивная демонстрация: посмотрите, как AI-помощник работает с реальными сценариями
            </p>
          </div>
          <ErrorBoundary>
            <ChatDemo onButtonClick={handleAnyButtonClick} />
          </ErrorBoundary>
        </section>

        {/* CALCULATOR SECTION */}
        <section id="calculator" className="py-16 px-4 bg-muted/20">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Соберите приложение своей мечты
            </h2>
            <p className="text-lg text-muted-foreground">
              У вас есть 500₽ - выберите функции, которые действительно важны для вас
            </p>
          </div>
          <ErrorBoundary>
            <BudgetCalculator onButtonClick={handleAnyButtonClick} />
          </ErrorBoundary>
        </section>

        {/* BENEFITS SECTION */}
        <div id="benefits">
          <ErrorBoundary>
            <BenefitsSection onButtonClick={handleAnyButtonClick} />
          </ErrorBoundary>
        </div>

        {/* PILOT RESULTS */}
        <div id="pilot">
          <ErrorBoundary>
            <PilotResults onButtonClick={handleAnyButtonClick} />
          </ErrorBoundary>
        </div>

        {/* FAQ SECTION */}
        <div id="faq">
          <ErrorBoundary>
            <FAQ onButtonClick={handleAnyButtonClick} />
          </ErrorBoundary>
        </div>

        {/* WAITLIST SECTION */}
        <div id="waitlist">
          <ErrorBoundary>
            <WaitlistSection 
              onButtonClick={handleAnyButtonClick}
              onOpenRewards={() => {
                handleAnyButtonClick();
                handleOpenRewardsPopup('rewards');
              }}
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* 🔥 FOOTER */}
      <Footer onButtonClick={handleAnyButtonClick} />

      {/* 🔥 POPUP'Ы */}
      {showRewardsPopup && (
        <RewardsPopup
          isOpen={showRewardsPopup}
          onClose={handleCloseRewardsPopup}
          onClaim={claimRewards}
          initialMode={rewardsPopupMode}
        />
      )}

      {showReferralPopup && (
        <ReferralPopup
          isOpen={showReferralPopup}
          onClose={handleCloseReferralPopup}
          referralCode={progress.referralCode}
          userEmail={progress.userEmail}
        />
      )}
    </div>
  );
};

export default Index;