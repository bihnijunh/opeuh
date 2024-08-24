"use client"
import React, { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { generateReferralCode } from '@/actions/generateReferralCode';
import { Clipboard } from 'lucide-react';

export function ReferralCode() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check for existing referral code on component mount
    handleGenerateCode();
  }, []);

  const handleGenerateCode = () => {
    startTransition(async () => {
      try {
        const result = await generateReferralCode();
        console.log('Generate referral code result:', result); // Add logging
        if (result.error) {
          setError(result.error);
          console.error('Error generating referral code:', result.error);
        } else {
          setReferralCode(result.referralCode || null);
          setError(null);
        }
      } catch (error) {
        console.error('Exception in generateReferralCode:', error);
        setError("Failed to generate referral code");
      }
    });
  };

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-2">Your Referral Code</h2>
      {referralCode ? (
        <div>
          <p className="mb-2">Share this code with your friends:</p>
          <div className="flex items-center">
            <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded mr-2 flex-grow">{referralCode}</code>
            <Button
              onClick={handleCopyCode}
              variant="outline"
              size="icon"
              className="flex-shrink-0"
              title="Copy referral code"
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
          {copied && <p className="text-green-500 mt-2">Copied to clipboard!</p>}
        </div>
      ) : (
        <Button onClick={handleGenerateCode} disabled={isPending}>
          {isPending ? 'Generating...' : 'Generate Referral Code'}
        </Button>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}