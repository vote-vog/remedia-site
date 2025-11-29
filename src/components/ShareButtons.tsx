// components/ShareButtons.tsx
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Facebook, MessageCircle, MessageSquare, Link } from 'lucide-react';
import { useShare } from '../hooks/useShare';

interface ShareButtonsProps {
  eggId: string;
  onShare?: (platform: string) => void;
}

export const ShareButtons = ({ eggId, onShare }: ShareButtonsProps) => {
  const { shareToPlatform, copyToClipboard } = useShare();

  const platforms = [
    { id: 'twitter', icon: Twitter, color: '#1DA1F2', label: 'Twitter' },
    { id: 'linkedin', icon: Linkedin, color: '#0077B5', label: 'LinkedIn' },
    { id: 'facebook', icon: Facebook, color: '#1877F2', label: 'Facebook' },
    { id: 'telegram', icon: MessageCircle, color: '#0088CC', label: 'Telegram' },
    { id: 'whatsapp', icon: MessageSquare, color: '#25D366', label: 'WhatsApp' },
  ];

  const handleShare = async (platform: string) => {
    if (platform === 'copy') {
      const success = await copyToClipboard(eggId);
      if (success && onShare) {
        onShare('copy');
      }
    } else {
      shareToPlatform(platform, eggId);
      if (onShare) {
        onShare(platform);
      }
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <p className="text-sm text-gray-600 mb-3 text-center">
        Поделиться открытием:
      </p>
      <div className="flex justify-center gap-3">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <motion.button
              key={platform.id}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare(platform.id)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: platform.color }}
              title={`Поделиться в ${platform.label}`}
            >
              <Icon size={18} className="text-white" />
            </motion.button>
          );
        })}
        
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('copy')}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-600 hover:bg-gray-700 transition-all duration-200 hover:shadow-lg"
          title="Скопировать ссылку"
        >
          <Link size={18} className="text-white" />
        </motion.button>
      </div>
    </div>
  );
};