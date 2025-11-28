// components/ReferralPopup.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Copy, Check, Share2, Gift, Smartphone, Users } from "lucide-react";
import { useProductActions } from '@/hooks/useProductActions';
import { useProgress } from '@/hooks/useProgress';
import { useLanguage } from '@/hooks/useLanguage';

interface ReferralPopupProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  userEmail?: string;
  onNativeShare?: (referralLink: string) => Promise<void>;
}

export const ReferralPopup = ({ 
  isOpen, 
  onClose, 
  referralCode,
  userEmail,
  onNativeShare 
}: ReferralPopupProps) => {
  const [copied, setCopied] = useState(false);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);
  const { completeMilestone } = useProductActions();
  const { progress } = useProgress();
  const { t } = useLanguage();
  
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  // 🔥 ПРОВЕРЯЕМ ПОДДЕРЖКУ WEB SHARE API
  useEffect(() => {
    setIsWebShareSupported(!!navigator.share);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      
      // 🎯 ЗАПУСКАЕМ РЕФЕРАЛ-ЗАВОД КАЖДЫЙ РАЗ
      completeMilestone('referral');
      console.log('🎯 Реферал-завод запущен! +20%');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // 🔥 УНИВЕРСАЛЬНОЕ РАСШАРИВАНИЕ ЧЕРЕЗ WEB SHARE API
  const handleNativeShare = async () => {
    const shareData = {
      title: t('referralPopup.share.title'),
      text: t('referralPopup.share.text'),
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        
        // 🎯 ЗАПУСКАЕМ РЕФЕРАЛ-ЗАВОД КАЖДЫЙ РАЗ
        completeMilestone('referral');
        console.log('🎯 Реферал-завод запущен через шеринг! +20%');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Ошибка расшаривания:', err);
        // Если есть внешний обработчик, используем его
        if (onNativeShare) {
          await onNativeShare(referralLink);
        }
      }
    }
  };

  // 🔥 ФОЛБЭК ДЛЯ СТАРЫХ БРАУЗЕРОВ
  const handleFallbackShare = () => {
    copyToClipboard();
  };

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Share2 className="w-6 h-6 text-purple-500" />
            {t('referralPopup.title')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t('referralPopup.description')}
            </p>
          </div>

          {/* 🎯 СТАТИСТИКА РЕФЕРАЛОВ */}
          <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>
                {t('referralPopup.stats.shares', { count: progress.referralEvents || 0 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-green-500" />
              <span>
                {t('referralPopup.stats.progress', { percent: (progress.referralEvents || 0) * 20 })}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('referralPopup.referralLink.label')}
            </label>
            <div className="flex gap-2">
              <Input 
                value={referralLink} 
                readOnly 
                className="flex-1 font-mono text-sm"
              />
              <Button 
                onClick={copyToClipboard}
                size="sm"
                variant={copied ? "default" : "outline"}
                className={copied ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {copied && (
              <p className="text-green-600 text-xs">
                {t('referralPopup.referralLink.copied')}
              </p>
            )}
          </div>

          {/* 🎯 УНИВЕРСАЛЬНАЯ КНОПКА РАСШАРИВАНИЯ */}
          <div className="space-y-3">
            {isWebShareSupported ? (
              // 🔥 НАТИВНЫЙ ШЕРИНГ (iOS Safari, Android Chrome, etc)
              <Button
                onClick={handleNativeShare}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t('referralPopup.share.nativeButton')}
              </Button>
            ) : (
              // 🔥 ФОЛБЭК ДЛЯ СТАРЫХ БРАУЗЕРОВ
              <Button
                onClick={handleFallbackShare}
                variant="outline"
                className="w-full py-3"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                {t('referralPopup.share.fallbackButton')}
              </Button>
            )}

            <p className="text-xs text-muted-foreground text-center">
              {isWebShareSupported 
                ? t('referralPopup.share.nativeDescription')
                : t('referralPopup.share.fallbackDescription')
              }
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 font-medium text-sm mb-2">
              {t('referralPopup.bonuses.title')}
            </p>
            <ul className="text-blue-600 text-xs space-y-1">
              <li>• <strong>{t('referralPopup.bonuses.items.0')}</strong></li>
              <li>• <strong>{t('referralPopup.bonuses.items.1')}</strong></li>
              <li>• {t('referralPopup.bonuses.items.2')}</li>
              <li>• {t('referralPopup.bonuses.items.3')}</li>
              <li>• {t('referralPopup.bonuses.items.4')}</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={onClose} variant="outline" size="sm">
              {t('referralPopup.closeButton')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};