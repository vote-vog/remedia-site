// src/components/TestReferralButton.tsx
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { useProductActions } from "@/hooks/useProductActions";

export const TestReferralButton = () => {
  const { progress } = useProgress();
  const { completeMilestone } = useProductActions();

  const handleTestReferral = () => {
    console.log('🎯 TEST: Making referral true');
    
    // 1. Запускаем реферал-завод
    completeMilestone('referral');
    
    // 2. Показываем результат
    console.log('✅ TEST: referralProduced should be true now');
    console.log('📊 Current progress:', {
      referralProduced: progress.referral,
      completionPercentage: progress.demo + progress.calculator + progress.waitlist + (progress.referral ? 20 : 0)
    });
  };

  const handleResetProgress = () => {
    console.log('🔄 TEST: Resetting progress');
    localStorage.removeItem('remedia-production-facts');
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Button 
        onClick={handleTestReferral}
        variant="outline" 
        size="sm"
        className="bg-green-500 hover:bg-green-600 text-white"
      >
        🧪 Test Referral
      </Button>
      
      <Button 
        onClick={handleResetProgress}
        variant="outline" 
        size="sm"
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        🔄 Reset Progress
      </Button>
      
      <div className="text-xs bg-black text-white p-2 rounded max-w-xs">
        <div>Email: {progress.userEmail || 'none'}</div>
        <div>Referral: {progress.referral ? '✅' : '❌'}</div>
        <div>Progress: {progress.demo ? 'D' : ''}{progress.calculator ? 'C' : ''}{progress.waitlist ? 'W' : ''}{progress.referral ? 'R' : ''}</div>
      </div>
    </div>
  );
};