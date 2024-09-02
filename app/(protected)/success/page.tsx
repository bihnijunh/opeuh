"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the values from URL search params or use defaults
  const title = searchParams?.get('title') || 'Success!';
  const message = searchParams?.get('message') || 'Your action was completed successfully.';
  const ctaText = searchParams?.get('ctaText') || 'Continue';
  const ctaLink = searchParams?.get('ctaLink') || '/';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">{title}</h1>
        <p className="text-xl text-gray-700 mb-8">{message}</p>
        <Button
          onClick={() => router.push(ctaLink)}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
