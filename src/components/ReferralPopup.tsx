// components/ReferralPopup.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Copy, Check, Share2, Gift, Smartphone, Users } from "lucide-react";
import { useProductActions } from '@/hooks/useProductActions';
import { useProgress } from '@/hooks/useProgress';

interface ReferralPopupProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  userEmail?: string;
}

export const ReferralPopup = ({ 
  isOpen, 
  onClose, 
  referralCode,
  userEmail 
}: ReferralPopupProps) => {
  const [copied, setCopied] = useState(false);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);
  const { completeMilestone } = useProductActions();
  const { progress } = useProgress(); // 🎯 ДОБАВЛЯЕМ ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ
  
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
      title: 'Remedia - приложение для управления здоровьем',
      text: 'Привет! Посмотри крутое приложение для управления здоровьем. Оно помогает отслеживать симптомы, принимать лекарства и консультироваться с AI-помощником!',
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
      }
    }
  };

  // 🔥 ФОЛБЭК ДЛЯ СТАРЫХ БРАУЗЕРОВ
  const handleFallbackShare = () => {
    // Показываем ручные варианты если Web Share API не поддерживается
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
            Поделитесь с друзьями!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Расскажите друзьям о Remedia и получите +20% к прогрессу за каждое распространение!
            </p>
          </div>

          {/* 🎯 СТАТИСТИКА РЕФЕРАЛОВ */}
          <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Распространений: {progress.referralEvents || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-green-500" />
              <span>+{(progress.referralEvents || 0) * 20}% к прогрессу</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ваша реферальная ссылка:</label>
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
              <p className="text-green-600 text-xs">✅ Ссылка скопирована! +20% к прогрессу</p>
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
                Поделиться через приложение
              </Button>
            ) : (
              // 🔥 ФОЛБЭК ДЛЯ СТАРЫХ БРАУЗЕРОВ
              <Button
                onClick={handleFallbackShare}
                variant="outline"
                className="w-full py-3"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Скопировать ссылку для расшаривания
              </Button>
            )}

            <p className="text-xs text-muted-foreground text-center">
              {isWebShareSupported 
                ? 'Откроется меню с доступными приложениями для расшаривания'
                : 'Скопируйте ссылку и поделитесь в любом мессенджере'
              }
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 font-medium text-sm mb-2">🎁 Что вы получаете:</p>
            <ul className="text-blue-600 text-xs space-y-1">
              <li>• <strong>+20% к прогрессу за каждое распространение</strong></li>
              <li>• <strong>Без ограничений</strong> - чем больше делитесь, тем выше прогресс</li>
              <li>• Помогаете друзьям и родным заботиться о здоровье</li>
              <li>• Уже при первом скачивании Вы получите бонус за каждого присоединившегося друга</li>
              <li>• Чем выше Ваш прогресс, тем больше бонусов Вы получите при скачивании</li>
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={onClose} variant="outline" size="sm">
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};