import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { applyReferralCode } from '@/actions/useReferralCode';

export function UseReferralCode() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await applyReferralCode(code);
        if (result.error) {
          setError(result.error);
          setMessage(null);
        } else {
          setMessage(result.message || 'Referral code applied successfully');
          setError(null);
        }
      } catch (error) {
        console.error('Error applying referral code:', error);
        setError('Failed to apply referral code. Please try again.');
      }
    });
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-2">Use a Referral Code</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter referral code"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Applying...' : 'Apply Code'}
        </Button>
      </form>
      {message && <p className="text-green-500 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}