import React from 'react';
import tgIcon from "@/assets/telegram-icon.svg";
import vkIcon from "@/assets/vk-icon.svg";
import emailIcon from "@/assets/email-icon.svg";

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 border-t border-border bg-muted/20 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4">Написать основателю</h3>
            <div className="flex gap-4">
              <a
                href="mailto:gaara5249@gmail.com"
                className="flex flex-col items-center gap-2 group"
                title="Написать на email"
              >
                <div className="bg-card border border-border rounded-xl p-4 group-hover:shadow-md group-hover:border-primary/50 transition-all duration-200">
                  <img src={emailIcon} alt="Email" className="w-6 h-6" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  Email
                </span>
              </a>

              <a
                href="https://t.me/vote_vog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
                title="Личный Telegram основателя"
              >
                <div className="bg-card border border-border rounded-xl p-4 group-hover:shadow-md group-hover:border-primary/50 transition-all duration-200">
                  <img src={tgIcon} alt="Telegram" className="w-6 h-6" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  Telegram
                </span>
              </a>

              <a
                href="https://vk.com/vkalinin98"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
                title="ВКонтакте основателя"
              >
                <div className="bg-card border border-border rounded-xl p-4 group-hover:shadow-md group-hover:border-primary/50 transition-all duration-200">
                  <img src={vkIcon} alt="VK" className="w-6 h-6" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  ВКонтакте
                </span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Мы в соцсетях</h3>
            <div className="flex gap-4">
              <a
                href="https://t.me/remedia_startup"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
                title="Telegram сообщество"
              >
                <div className="bg-card border border-border rounded-xl p-4 group-hover:shadow-md group-hover:border-primary/50 transition-all duration-200">
                  <img src={tgIcon} alt="Telegram" className="w-6 h-6" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  Telegram
                </span>
              </a>

              <a
                href="https://vk.com/club233824092"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
                title="Сообщество ВКонтакте"
              >
                <div className="bg-card border border-border rounded-xl p-4 group-hover:shadow-md group-hover:border-primary/50 transition-all duration-200">
                  <img src={vkIcon} alt="VK" className="w-6 h-6" />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  ВКонтакте
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 RemediaAI. Сделано с заботой о вашем здоровье.
          </p>
        </div>
      </div>
    </footer>
  );
};