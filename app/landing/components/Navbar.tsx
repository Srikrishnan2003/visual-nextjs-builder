'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/landing" className="text-lg font-bold">
          MyWebApp
        </Link>
        <div>
          <Link href="/main" passHref>
            <Button variant="ghost" className="text-white">
              Login
            </Button>
          </Link>
          <Link href="/main" passHref>
            <Button className="ml-4">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
