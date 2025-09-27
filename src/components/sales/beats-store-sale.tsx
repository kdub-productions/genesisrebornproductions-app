'use client';
import React from 'react';
import { License } from '@/app/api/licenses';
import '@/styles/beats-shop-page-styles/beats-store.css';
import '@/styles/site-wide-styles/sale-component.css';

interface BeatStoreSaleProps {
  originalPrice: number;
  license?: License;
  discountPercentage?: number;
  showBadge?: boolean;
}

const BeatStoreSale: React.FC<BeatStoreSaleProps> = ({
  originalPrice,
  license,
  discountPercentage = 50,
  showBadge = true,
}) => {
  const discountMultiplier = (100 - discountPercentage) / 100;
  const discountedPrice = originalPrice * discountMultiplier;
  
  // If license is provided, apply discount to license price instead
  const licenseDiscountedPrice = license ? license.price * discountMultiplier : null;

  return (
    <div className="beat-sale-container">
      {showBadge && (
        <div className="sale-badge">
          {discountPercentage}% OFF
        </div>
      )}
      <div className="beat-price-container">
        {license ? (
          <>
            <span className="original-price">${license.price.toFixed(2)}</span>
            <span className="discounted-price">${licenseDiscountedPrice?.toFixed(2)}</span>
          </>
        ) : (
          <>
            <span className="original-price">${originalPrice.toFixed(2)}</span>
            <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default BeatStoreSale;