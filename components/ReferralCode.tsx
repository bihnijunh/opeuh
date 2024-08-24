import React, { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { generateReferralCode } from '@/actions/generateReferralCode';

export function ReferralCode() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-2">Your Referral Code</h2>
      {referralCode ? (
        <div>
          <p className="mb-2">Share this code with your friends:</p>
          <code className="bg-gray-100 p-2 rounded">{referralCode}</code>
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