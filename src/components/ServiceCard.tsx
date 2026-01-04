import React from 'react';
import { Clock } from 'lucide-react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  isDarkMode?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, quantity, onAdd, onRemove, isDarkMode = false }) => {
  return (
    <div className={`rounded-xl p-3 sm:p-4 transition-all duration-200 ${isDarkMode
        ? 'bg-gray-800 border border-gray-700'
        : 'bg-white shadow-sm border border-gray-100'
      } ${quantity > 0 ? (isDarkMode ? 'border-pink-500' : 'border-pink-400 shadow-md') : ''}`}>

      {/* Top Row - Name, Badge, Price */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className={`font-semibold text-sm sm:text-base leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
          {service.name}
        </h3>
        <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-medium ${service.category === 'bridal'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-pink-100 text-pink-700'
          }`}>
          {service.category === 'bridal' ? 'Bridal' : 'Regular'}
        </span>
      </div>

      {/* Description - Single line */}
      <p className={`text-xs mb-2 truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
        {service.description}
      </p>

      {/* Bottom Row - Duration, Price, Controls */}
      <div className="flex items-center justify-between">
        {/* Duration and Price */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
            <Clock className="w-3 h-3" />
            <span>{service.duration} min</span>
          </div>
          <span className={`text-base font-bold ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`}>
            ₹{service.price}
          </span>
        </div>

        {/* Quantity Controls - Compact */}
        <div className="flex items-center gap-2">
          {/* Minus */}
          <button
            onClick={onRemove}
            disabled={quantity === 0}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-semibold transition-all ${quantity === 0
                ? isDarkMode
                  ? 'bg-gray-700 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                : isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            −
          </button>

          {/* Quantity */}
          <span className={`w-6 text-center text-base font-bold ${quantity > 0
              ? (isDarkMode ? 'text-pink-400' : 'text-pink-500')
              : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
            }`}>
            {quantity}
          </span>

          {/* Plus */}
          <button
            onClick={onAdd}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-semibold transition-all ${isDarkMode
                ? 'bg-pink-600 text-white hover:bg-pink-500'
                : 'bg-pink-500 text-white hover:bg-pink-600'
              }`}
          >
            +
          </button>
        </div>
      </div>

      {/* Total - Only if selected */}
      {quantity > 0 && (
        <div className={`mt-2 pt-2 flex justify-between items-center text-sm border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
            Subtotal
          </span>
          <span className={`font-bold ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`}>
            ₹{service.price * quantity}
          </span>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;