// hooks/useShare.ts
import { useLanguage } from './useLanguage';
import { shareContent } from '../data/shareContent';

export const useShare = () => {
  const { language } = useLanguage();

  const getShareUrl = (platform: string, text: string) => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent('https://remedia.health');
    
    const urls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}`
    };
    
    return urls[platform] || '#';
  };

  const shareToPlatform = (platform: string, eggId: string) => {
    const content = shareContent[language as 'ru' | 'en'][eggId];
    if (!content) return;

    const text = content[platform as keyof typeof content];
    const shareUrl = getShareUrl(platform, text);
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async (eggId: string) => {
    const content = shareContent[language as 'ru' | 'en'][eggId];
    if (!content) return false;

    try {
      await navigator.clipboard.writeText(content.copy || content.twitter);
      return true;
    } catch (err) {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = content.copy || content.twitter;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  };

  return {
    shareToPlatform,
    copyToClipboard,
    getShareContent: (eggId: string) => shareContent[language as 'ru' | 'en'][eggId]
  };
};