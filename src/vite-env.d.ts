/// <reference types="vite/client" />
// src/vite-env.d.ts
interface Window {
  ym: (counterId: number, method: string, goal: string, params?: any) => void;
}