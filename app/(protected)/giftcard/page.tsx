import React from 'react';
import { ShopByCategory } from '../_components/ShopByCategory';
import RateChange from '../_components/Rate';
import { GiftCardTransactionHistory } from './_components/GiftCardTransactionHistory';

const GiftCardPage: React.FC = () => {
  return (
    <div>
    <ShopByCategory />
    <GiftCardTransactionHistory />
    <RateChange />
    </div>
  );
};

export default GiftCardPage;
