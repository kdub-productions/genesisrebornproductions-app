'use client';
import React from 'react';
import '../../styles/site-wide-styles/sale-component.css';

interface MixingMasteringSaleProps {
  originalPrice: number;
  serviceName: string;
}

const MixingMasteringSale: React.FC<MixingMasteringSaleProps> = ({
  originalPrice,
  serviceName
}) => {
  const discountedPrice = originalPrice * 0.5; // Fixed 50% discount

  return (
    <div className="service-sale-container">
      <div className="sale-badge">
        50% OFF
        </div>
      <div className="price-container">
        <span className="original-price">${originalPrice.toFixed(2)}</span>
        <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default MixingMasteringSale;