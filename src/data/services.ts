import { Service } from '../types';

// 3 Month Package Offers - Combo Deals
export const regularServices: Service[] = [
    // ₹399 Package - Threading + Detan + Clean-up
    {
        id: 'package-399',
        name: '₹399 Package',
        price: 399,
        duration: 60,
        category: 'regular',
        description: 'Threading + Detan + Clean-up'
    },
    // ₹499 Package - Threading + Haircut + Head Massage
    {
        id: 'package-499',
        name: '₹499 Package',
        price: 499,
        duration: 75,
        category: 'regular',
        description: 'Threading + Haircut + Head Massage'
    },
    // ₹599 Package - Bleach + Hand-wax + Facial
    {
        id: 'package-599',
        name: '₹599 Package',
        price: 599,
        duration: 90,
        category: 'regular',
        description: 'Bleach + Hand-wax + Facial'
    },
    // ₹699 Package - Leg-wax + Underarms + Hand wax
    {
        id: 'package-699',
        name: '₹699 Package',
        price: 699,
        duration: 60,
        category: 'regular',
        description: 'Leg-wax + Underarms + Hand wax'
    },
    // ₹799 Package - Underarms + Manicure + Pedicure
    {
        id: 'package-799',
        name: '₹799 Package',
        price: 799,
        duration: 120,
        category: 'regular',
        description: 'Underarms + Manicure + Pedicure'
    },
    // ₹899 Package - Haircut + Facial + Detan + Threading + Handwax
    {
        id: 'package-899',
        name: '₹899 Package',
        price: 899,
        duration: 120,
        category: 'regular',
        description: 'Haircut + Facial + Detan + Threading + Handwax'
    },
    // ₹1999 Premium Package - Threading + Waxing + Detan/Bleach + Facial + Pedicure
    {
        id: 'package-1999',
        name: '₹1999 Premium Package',
        price: 1999,
        duration: 180,
        category: 'regular',
        description: 'Threading + Waxing + Detan/Bleach + Facial + Pedicure'
    }
];

// Package Services (same as regular - for backward compatibility)
export const packageServices: Service[] = [];

// Individual Services (Bridal & Special)
export const bridalServices: Service[] = [
    {
        id: 'bridal-makeup',
        name: 'Bridal Makeup (10% Discount)',
        price: 4999,
        duration: 120,
        category: 'bridal',
        description: 'Complete bridal makeup with 10% discount'
    },
    {
        id: 'simple-looks',
        name: 'Simple Looks',
        price: 999,
        duration: 60,
        category: 'bridal',
        description: 'Elegant simple makeup look'
    },
    {
        id: 'only-hairstyle',
        name: 'Only Hairstyle',
        price: 300,
        duration: 45,
        category: 'bridal',
        description: 'Professional hair styling'
    },
    {
        id: 'saree-prepleating',
        name: 'Saree Pre-pleating',
        price: 299,
        duration: 30,
        category: 'bridal',
        description: 'Professional saree pleating'
    }
];