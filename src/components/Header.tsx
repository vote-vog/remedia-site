// src/components/Header.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import remediaIcon from "@/assets/remedia-icon.png";
import { motion } from "framer-motion";

// 🎯 Интерфейс пропсов для кнопки профиля
interface HeaderProps {
  isLoggedIn?: boolean;
  userDisplayName?: string;
  onProfileClick?: () => void;
}

export const Header = ({ 
  isLoggedIn = false, 
  userDisplayName = "",
  onProfileClick 
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (!isMounted) return;
    
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        const headerHeight = 80;
        const sectionPosition = section.offsetTop - headerHeight;
        
        window.scrollTo({
          top: sectionPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
    
    setIsMenuOpen(false);
  };

  const scrollToFooter = () => {
    if (!isMounted) return;
    
    setTimeout(() => {
      const footer = document.querySelector('footer');
      if (footer) {
        const footerPosition = footer.offsetTop - 80;
        window.scrollTo({
          top: footerPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
    setIsMenuOpen(false);
  };

  // 🎯 Обработчик клика для кнопки профиля
  const handleProfileClick = () => {
    onProfileClick?.();
    setIsMenuOpen(false);
  };

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={remediaIcon} alt="Remedia" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold">Remedia</span>
            </div>
            <div className="md:hidden">
              <Menu size={24} />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Логотип и бренд */}
          <div className="flex items-center gap-3">
            <motion.img 
              src={remediaIcon} 
              alt="Remedia" 
              className="w-8 h-8 object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
            <motion.span 
              className="text-xl font-bold"
              whileHover={{ color: "#3b82f6" }}
              transition={{ duration: 0.2 }}
            >
              Remedia
            </motion.span>
          </div>

          {/* Десктопная навигация */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { id: 'hero', label: 'Возможности' },
              { id: 'demo', label: 'Демо' },
              { id: 'calculator', label: 'Калькулятор' },
              { id: 'benefits', label: 'Преимущества' },
              { id: 'faq', label: 'FAQ' },
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative"
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                {item.label}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
            <motion.button
              onClick={scrollToFooter}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              whileHover={{ y: -1 }}
            >
              Контакты
            </motion.button>
          </nav>

          <div className="flex items-center gap-4">
            {/* 🎯 КНОПКА ПРОФИЛЯ (только для авторизованных) */}
            {isLoggedIn && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleProfileClick}
                  variant="outline"
                  className="hidden md:flex items-center gap-2 border-green-200 bg-green-50 hover:bg-green-100 text-green-700"
                >
                  <div className="relative">
                    <User size={16} className="text-green-600" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <span className="font-medium">
                    {userDisplayName || "Аккаунт"}
                  </span>
                </Button>
              </motion.div>
            )}

            {/* Кнопка меню для мобильных */}
            <motion.button 
              className="md:hidden z-50" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-16 left-0 right-0 bg-background border-b z-40"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-0 px-4 py-4">
              {[
                { id: 'hero', label: 'Возможности' },
                { id: 'demo', label: 'Демо' },
                { id: 'calculator', label: 'Калькулятор' },
                { id: 'benefits', label: 'Преимущества' },
                { id: 'faq', label: 'FAQ' },
              ].map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left py-3 px-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.button
                onClick={scrollToFooter}
                className="text-left py-3 px-2 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ x: 4 }}
              >
                Контакты
              </motion.button>

              {/* 🎯 МОБИЛЬНАЯ ВЕРСИЯ КНОПКИ ПРОФИЛЯ */}
              {isLoggedIn && (
                <motion.div
                  className="pt-2 border-t border-border mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={handleProfileClick}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-green-200 bg-green-50 hover:bg-green-100 text-green-700 py-3"
                  >
                    <User size={16} className="text-green-600" />
                    <span className="font-medium">
                      {userDisplayName || "Аккаунт"}
                    </span>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};