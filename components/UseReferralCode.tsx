"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { applyReferralCode } from "@/actions/useReferralCode";

export function UseReferralCode() {
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await applyReferralCode(code);
    if (result.success) {
      toast.success(result.message || "Referral code applied successfully");
      setCode('');
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Use a Referral Code</h3>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter referral code"
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        />
        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
          Apply Code
        </Button>
      </form>
    </div>
  );
}