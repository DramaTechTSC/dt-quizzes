'use client'
import { HeroUIProvider } from '@heroui/react';

export default function App({ children }) {
  return <HeroUIProvider className="grow w-full flex flex-col justify-center items-center">
    {children}
  </HeroUIProvider>;
}