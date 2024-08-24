import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { applyReferralCode } from '@/actions/useReferralCode';

export function UseReferralCode() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await applyReferralCode(code);
    if (result.error) {
      setError(result.error);
      setMessage(null);
    } else {
      setMessage(result.message || 'Referral code applied successfully');
      setError(null);
    }
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
        <Button type="submit">Apply Code</Button>
      </form>
      {message && <p className="text-green-500 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}