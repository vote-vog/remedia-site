// src/components/RewardsPopup.tsx
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Loader2, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@/hooks/useProgress';
import { useToast } from '@/hooks/use-toast';

interface RewardsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (userData: { 
    email: string; 
    disease: string; 
    problem: string;
    notifyMethod: string;
    contactDetails: string;
    agreeTerms: boolean;
  }) => Promise<void>;
  initialMode?: 'rewards' | 'profile';
}

interface FormErrors {
  email?: string;
  disease?: string;
  problem?: string;
  notifyMethod?: string;
  contactDetails?: string;
  agreeTerms?: string;
  submit?: string;
}

export const RewardsPopup = ({ 
  isOpen, 
  onClose, 
  onClaim,
  initialMode = 'rewards'
}: RewardsPopupProps) => {
  const [formData, setFormData] = useState({
    email: '',
    disease: '',
    problem: '',
    notifyMethod: 'email' as string,
    contactDetails: '',
    agreeTerms: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { progress } = useProgress();
  const { toast } = useToast();

  // 🔥 TELEGRAM BOT CONFIG ДЛЯ ПОДПИСОК
  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  // 🔥 ФУНКЦИЯ ОПРЕДЕЛЕНИЯ РЕФЕРАЛЬНОГО ИСТОЧНИКА
  const getReferralSource = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    const utmSource = urlParams.get('utm_source');
    
    return {
      referralCode: ref,
      utmSource: utmSource,
      isReferral: !!ref || utmSource === 'referral'
    };
  }, []);

  // 🔥 ФУНКЦИЯ ОТПРАВКИ ДАННЫХ ПОДПИСКИ В TELEGRAM
  const sendSubscriptionToTelegram = async (userData: {
    email: string;
    disease: string;
    problem: string;
    notifyMethod: string;
    contactDetails: string;
  }) => {
    const referralData = getReferralSource();
    
    const message = `🎯 НОВАЯ ПОДПИСКА!

👤 E-mail: ${userData.email}
🏥 Заболевание: ${userData.disease}
🎯 Решаемая проблема: ${userData.problem}
📞 Способ связи: ${getNotifyMethodName(userData.notifyMethod)}
📱 Канал связи: ${userData.contactDetails}
🔗 Реферал: ${referralData.isReferral ? 'Да' : 'Нет'}
${referralData.referralCode ? `🔑 Код: ${referralData.referralCode}` : ''}
${referralData.utmSource ? `📊 UTM: ${referralData.utmSource}` : ''}

⏰ ${new Date().toLocaleString('ru-RU')}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        console.log('📊 Данные подписки отправлены в Telegram');
      }
    } catch (error) {
      console.error('Ошибка отправки данных подписки:', error);
    }
  };

  // 🔥 ФУНКЦИЯ ПОЛУЧЕНИЯ ЧЕЛОВЕКОЧИТАЕМОГО НАЗВАНИЯ МЕТОДА УВЕДОМЛЕНИЯ
  const getNotifyMethodName = (method: string) => {
    const methods: { [key: string]: string } = {
      email: 'Email',
      telegram: 'Telegram',
      sms: 'SMS'
    };
    return methods[method] || method;
  };

  const contactFieldConfig = useCallback(() => {
    const configs = {
      telegram: {
        label: 'Ваш Telegram username',
        placeholder: '@username',
        type: 'text' as const,
        disabled: false,
      },
      sms: {
        label: 'Ваш номер телефона',
        placeholder: '+7 (999) 123-45-67',
        type: 'tel' as const,
        disabled: false,
      },
      email: {
        label: 'Email для уведомлений',
        placeholder: 'your@email.com',
        type: 'email' as const,
        disabled: true,
      }
    };
    
    return configs[formData.notifyMethod as keyof typeof configs] || configs.email;
  }, [formData.notifyMethod]);

  useEffect(() => {
    if (formData.notifyMethod === 'email') {
      setFormData(prev => ({
        ...prev,
        contactDetails: prev.email
      }));
    }
  }, [formData.email, formData.notifyMethod]);

  useEffect(() => {
    if (isOpen) {
      console.log('🎁 RewardsPopup opened');
      resetForm();
    }
  }, [isOpen]);

  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      disease: '',
      problem: '',
      notifyMethod: 'email',
      contactDetails: '',
      agreeTerms: false,
    });
    setErrors({});
  }, []);

  const updateField = useCallback((field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (!formData.disease.trim()) newErrors.disease = 'Укажите ваше заболевание';
    if (!formData.problem.trim()) newErrors.problem = 'Опишите проблему, которую хотите решить';
    
    if (!formData.contactDetails.trim()) {
      newErrors.contactDetails = 'Это поле обязательно';
    } else {
      switch (formData.notifyMethod) {
        case 'telegram':
          if (!formData.contactDetails.startsWith('@')) {
            newErrors.contactDetails = 'Telegram username должен начинаться с @';
          }
          break;
        case 'sms':
          const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;
          if (!phoneRegex.test(formData.contactDetails)) {
            newErrors.contactDetails = 'Введите номер в формате +7 (999) 123-45-67';
          }
          break;
        case 'email':
          if (!/\S+@\S+\.\S+/.test(formData.contactDetails)) {
            newErrors.contactDetails = 'Введите корректный email';
          }
          break;
      }
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Необходимо согласие с условиями';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Waitlist submission started');
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('🔄 Processing waitlist submission...');
      
      const referralData = getReferralSource();
      
      // 🔥 Яндекс.Метрика - УСПЕШНАЯ РЕГИСТРАЦИЯ
      if (window.ym) {
        window.ym(12345678, 'reachGoal', 'waitlist_signup');
        
        // ОТСЛЕЖИВАЕМ РЕФЕРАЛЬНУЮ РЕГИСТРАЦИЮ
        if (referralData.isReferral) {
          window.ym(12345678, 'reachGoal', 'waitlist_referral_signup');
          console.log('📊 Яндекс.Метрика: реферальная регистрация');
        }
        
        // Дополнительная цель для детальных данных
        if (formData.disease && formData.problem) {
          window.ym(12345678, 'reachGoal', 'waitlist_detailed');
        }
        
        // Отслеживаем выбранный метод уведомления и реферальный источник
        window.ym(12345678, 'params', {
          notify_method: formData.notifyMethod,
          disease_type: formData.disease,
          problem_type: formData.problem,
          referral_code: referralData.referralCode || 'direct',
          utm_source: referralData.utmSource || 'direct'
        });
        
        console.log('📊 Яндекс.Метрика: цели отправлены');
      }
      
      // 🔥 ОТПРАВЛЯЕМ ДАННЫЕ ПОДПИСКИ В TELEGRAM
      await sendSubscriptionToTelegram({
        email: formData.email.trim(),
        disease: formData.disease.trim(),
        problem: formData.problem.trim(),
        notifyMethod: formData.notifyMethod,
        contactDetails: formData.contactDetails.trim()
      });
      
      // 🔥 ВЫЗЫВАЕМ onClaim ДЛЯ ЗАВЕРШЕНИЯ waitlist И ВЫДАЧИ НАГРАД
      await onClaim({ 
        email: formData.email.trim(), 
        disease: formData.disease.trim(), 
        problem: formData.problem.trim(),
        notifyMethod: formData.notifyMethod,
        contactDetails: formData.contactDetails.trim(),
        agreeTerms: formData.agreeTerms 
      });
      
      toast({
        title: referralData.isReferral ? "🎉 Реферальная регистрация!" : "🎉 Успешная подписка!",
        description: referralData.isReferral 
          ? "Вы получили бонусы за регистрацию по приглашению" 
          : "Вы получили бонусы за регистрацию в лист ожидания",
        variant: "default",
      });
      
      onClose();
      
      // 🔄 АВТООБНОВЛЕНИЕ СТРАНИЦЫ ЧЕРЕЗ 1 СЕКУНДУ
      setTimeout(() => {
        console.log('🔄 Auto-refreshing page to update progress...');
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('💥 Waitlist submission error:', error);
      setErrors({ submit: 'Ошибка при подписке. Попробуйте еще раз.' });
    } finally {
      setIsLoading(false);
      console.log('🏁 Waitlist submission completed');
    }
  };

  // Если пользователь уже "подписан" (есть email), показываем профиль
  if (progress.userEmail) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={onClose}
            />
            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-xl max-w-sm w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative p-6 text-center border-b">
                  <button 
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                  
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gift size={24} className="text-white" />
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900">Ваш профиль</h2>
                  <p className="text-gray-600 mt-1 text-sm">
                    {progress.userEmail}
                  </p>
                </div>

                <div className="p-6">
                  <div className="text-center space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium">✅ Вы в листе ожидания!</p>
                      <p className="text-green-600 text-sm mt-1">
                        Мы уведомим вас о запуске первыми
                      </p>
                    </div>
                    
                    <p className="text-gray-700 text-sm">
                      Ваш прогресс сохранен. Продолжайте исследовать возможности Remedia!
                    </p>
                    
                    <Button 
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
                    >
                      Продолжить
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-xl max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-6 text-center border-b">
                <button 
                  onClick={onClose}
                  className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  <X size={20} className="text-gray-500" />
                </button>
                
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift size={24} className="text-white" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">
                  Получите бонусы!
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                  Подпишитесь на лист ожидания и получите +20% к прогрессу
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="waitlist-email" className="text-sm font-medium mb-2 block">
                      Email *
                    </Label>
                    <Input
                      id="waitlist-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      disabled={isLoading}
                      className={`text-sm py-2 ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="waitlist-disease" className="text-sm font-medium mb-2 block">
                      Ваше заболевание *
                    </Label>
                    <Input
                      id="waitlist-disease"
                      type="text"
                      placeholder="Например: ревматоидный артрит, диабет и т.д."
                      value={formData.disease}
                      onChange={(e) => updateField('disease', e.target.value)}
                      disabled={isLoading}
                      className={`text-sm py-2 ${errors.disease ? 'border-red-500' : ''}`}
                    />
                    {errors.disease && (
                      <p className="text-red-500 text-xs mt-1">{errors.disease}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="waitlist-problem" className="text-sm font-medium mb-2 block">
                      Какую проблему вы хотите решить с Remedia? *
                    </Label>
                    <Input
                      id="waitlist-problem"
                      type="text"
                      placeholder="Например: контроль боли, отслеживание симптомов, напоминание о приеме лекарств и т.д."
                      value={formData.problem}
                      onChange={(e) => updateField('problem', e.target.value)}
                      disabled={isLoading}
                      className={`text-sm py-2 ${errors.problem ? 'border-red-500' : ''}`}
                    />
                    {errors.problem && (
                      <p className="text-red-500 text-xs mt-1">{errors.problem}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="waitlist-notify" className="text-sm font-medium mb-2 block">
                      Где Вас уведомить о выходе продукта? *
                    </Label>
                    <Select 
                      value={formData.notifyMethod} 
                      onValueChange={(value) => updateField('notifyMethod', value)} 
                      disabled={isLoading}
                    >
                      <SelectTrigger className={`w-full ${errors.notifyMethod ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Выберите способ уведомления" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="telegram">Telegram</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.notifyMethod && (
                      <p className="text-red-500 text-xs mt-1">{errors.notifyMethod}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="waitlist-contact" className="text-sm font-medium mb-2 block">
                      {contactFieldConfig().label} *
                    </Label>
                    <Input
                      id="waitlist-contact"
                      type={contactFieldConfig().type}
                      placeholder={contactFieldConfig().placeholder}
                      value={contactFieldConfig().disabled ? formData.email : formData.contactDetails}
                      onChange={(e) => updateField('contactDetails', e.target.value)}
                      disabled={contactFieldConfig().disabled || isLoading}
                      className={`text-sm py-2 ${errors.contactDetails ? 'border-red-500' : ''}`}
                    />
                    {errors.contactDetails && (
                      <p className="text-red-500 text-xs mt-1">{errors.contactDetails}</p>
                    )}
                    {formData.notifyMethod === 'email' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Будет использован ваш email
                      </p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="waitlist-agree"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => updateField('agreeTerms', checked as boolean)}
                      disabled={isLoading}
                      className={`mt-1 ${errors.agreeTerms ? 'border-red-500' : ''}`}
                    />
                    <Label htmlFor="waitlist-agree" className="text-sm leading-relaxed">
                      Я соглашаюсь с условиями обработки персональных данных и хочу получать уведомления о выходе продукта *
                    </Label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium text-sm">🎁 Вы получите:</p>
                    <ul className="text-blue-600 text-xs mt-1 space-y-1">
                      <li>• +20% к общему прогрессу</li>
                      <li>• Уведомление о запуске первыми</li>
                      <li>• Специальные условия при старте</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Подписка...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Gift size={16} />
                        Подписаться и получить бонусы
                      </span>
                    )}
                  </Button>
                  
                  {errors.submit && (
                    <p className="text-red-500 text-xs text-center">{errors.submit}</p>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    Подписываясь, вы сохраняете прогресс и получаете бонусы
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};