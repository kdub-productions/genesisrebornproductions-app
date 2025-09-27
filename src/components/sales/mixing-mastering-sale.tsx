'use client';
import React from 'react';
import '../../styles/site-wide-styles/sale-component.css';

interface MixingMasteringSaleProps {
  originalPrice: number;
  serviceName: string;
  discountPercentage?: number;
}

const MixingMasteringSale: React.FC<MixingMasteringSaleProps> = ({
  originalPrice,
  serviceName
  ,discountPercentage = 30
}) => {
  const multiplier = (100 - discountPercentage) / 100;
  const discountedPrice = originalPrice * multiplier;

  return (
    <div className="beat-sale-container">
      <div className="sale-badge">
        {discountPercentage}% OFF
      </div>
      <div className="beat-price-container">
        <span className="original-price">${originalPrice.toFixed(2)}</span>
        <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default MixingMasteringSale;
