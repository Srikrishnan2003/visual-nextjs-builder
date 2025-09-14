'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">
          Build Next.js Websites, Visually.
        </h1>
        <p className="text-xl mb-8">
          Drag, Drop, Code. Seamlessly craft static Next.js sites with ready-made UI components, intuitive property controls, and a powerful integrated code editor.
        </p>
        {/* Placeholder for a compelling visual demo (e.g., GIF or video) */}
        <div className="my-10 p-5 border-2 border-dashed border-gray-600 rounded-lg mx-auto max-w-2xl">
          <p className="text-gray-400">[Placeholder for Animated Demo/Video of the builder in action]</p>
        </div>
        <Link href="/main" passHref>
          <Button size="lg">
            Start Building for Free
          </Button>
        </Link>
      </div>
    </section>
  );
}
