// src/hooks/useEventBus.ts
import { useRef, useCallback, useEffect } from 'react';

// 1. Определяем типы событий
export interface EventMap {
  'milestone:completed': { type: string; data?: any };
  'analytics:track': { event: string; data?: any };
}

// 2. Типы для методов Event Bus
type EventHandler<T = any> = (data: T) => void;
type EventListeners = {
  [K in keyof EventMap]?: EventHandler<EventMap[K]>[];
};

// 3. Создаем singleton Event Bus
class EventBus {
  private listeners: EventListeners = {};

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(handler);
    
    console.log(`🎯 EventBus: подписка на "${event}", всего слушателей:`, this.listeners[event]!.length);
  }

  off<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>) {
    if (!this.listeners[event]) return;
    
    this.listeners[event] = this.listeners[event]!.filter(h => h !== handler);
    console.log(`🎯 EventBus: отписка от "${event}", осталось слушателей:`, this.listeners[event]!.length);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    console.log(`🎯 EventBus: emitting "${event}"`, data);
    
    if (!this.listeners[event]) return;
    
    this.listeners[event]!.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`❌ EventBus: ошибка в обработчике события "${event}":`, error);
      }
    });
  }

  // Метод для отладки
  getListenerCount(event: keyof EventMap): number {
    return this.listeners[event]?.length || 0;
  }
}

// 4. Создаем глобальный экземпляр
export const eventBus = new EventBus();

// 5. React Hook для использования в компонентах
export const useEventBus = () => {
  const handlerRef = useRef<Map<string, EventHandler>>(new Map());

  const on = useCallback(<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>
  ) => {
    eventBus.on(event, handler);
    
    // Сохраняем ссылку для cleanup
    const key = `${event}-${Date.now()}-${Math.random()}`;
    handlerRef.current.set(key, handler as EventHandler);
    
    return () => {
      eventBus.off(event, handler);
      handlerRef.current.delete(key);
    };
  }, []);

  const emit = useCallback(<K extends keyof EventMap>(event: K, data: EventMap[K]) => {
    eventBus.emit(event, data);
  }, []);

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      handlerRef.current.forEach((handler, key) => {
        const event = key.split('-')[0] as keyof EventMap;
        eventBus.off(event, handler);
      });
      handlerRef.current.clear();
    };
  }, []);

  return {
    on,
    emit,
    // Для отладки
    getListenerCount: eventBus.getListenerCount.bind(eventBus)
  };
};

export default useEventBus;