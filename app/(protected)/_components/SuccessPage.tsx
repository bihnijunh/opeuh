import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface SuccessPageProps {
  title: string;
  message: string;
  ctaText: string;
  ctaLink: string;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ title, message, ctaText, ctaLink }) => {
  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={ctaLink}>
          <Button className="w-full">{ctaText}</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SuccessPage;