import { Service } from '../types';

// Regular Services - Individual Items with correct prices
export const regularServices: Service[] = [
    {
        id: 'threading',
        name: 'Threading',
        price: 399,
        duration: 15,
        category: 'regular',
        description: 'Eyebrow and facial threading'
    },
    {
        id: 'detan',
        name: 'Detan',
        price: 399,
        duration: 30,
        category: 'regular',
        description: 'Skin detan treatment'
    },
    {
        id: 'cleanup',
        name: 'Clean-up',
        price: 399,
        duration: 45,
        category: 'regular',
        description: 'Deep cleansing and cleanup'
    },
    {
        id: 'haircut',
        name: 'Haircut',
        price: 499,
        duration: 30,
        category: 'regular',
        description: 'Professional haircut'
    },
    {
        id: 'head-massage',
        name: 'Head Massage',
        price: 499,
        duration: 30,
        category: 'regular',
        description: 'Relaxing head massage'
    },
    {
        id: 'bleach',
        name: 'Bleach',
        price: 599,
        duration: 30,
        category: 'regular',
        description: 'Skin bleaching treatment'
    },
    {
        id: 'hand-wax',
        name: 'Hand Wax',
        price: 599,
        duration: 20,
        category: 'regular',
        description: 'Full hand waxing'
    },
    {
        id: 'facial',
        name: 'Facial',
        price: 599,
        duration: 60,
        category: 'regular',
        description: 'Rejuvenating facial treatment'
    },
    {
        id: 'leg-wax',
        name: 'Leg Wax',
        price: 699,
        duration: 30,
        category: 'regular',
        description: 'Full leg waxing'
    },
    {
        id: 'underarms-wax',
        name: 'Underarms Wax',
        price: 699,
        duration: 10,
        category: 'regular',
        description: 'Underarms waxing'
    },
    {
        id: 'manicure',
        name: 'Manicure',
        price: 799,
        duration: 45,
        category: 'regular',
        description: 'Complete nail care for hands'
    },
    {
        id: 'pedicure',
        name: 'Pedicure',
        price: 799,
        duration: 60,
        category: 'regular',
        description: 'Complete nail care for feet'
    },
    {
        id: 'waxing',
        name: 'Full Body Waxing',
        price: 1999,
        duration: 60,
        category: 'regular',
        description: 'Complete body waxing'
    },
    {
        id: 'hairstyle',
        name: 'Hair Styling',
        price: 300,
        duration: 45,
        category: 'regular',
        description: 'Professional hair styling'
    },
    {
        id: 'saree-draping',
        name: 'Saree Pre-pleating',
        price: 299,
        duration: 30,
        category: 'regular',
        description: 'Professional saree pleating and draping'
    }
];

// Package Services (combo offers) - 3 Month Package Offers
export const packageServices: Service[] = [
    {
        id: 'basic-package-399',
        name: '₹399 Package',
        price: 399,
        duration: 60,
        category: 'regular',
        description: 'Threading + Detan + Clean-up'
    },
    {
        id: 'haircare-package-499',
        name: '₹499 Package',
        price: 499,
        duration: 75,
        category: 'regular',
        description: 'Threading + Haircut + Head Massage'
    },
    {
        id: 'glow-package-599',
        name: '₹599 Package',
        price: 599,
        duration: 90,
        category: 'regular',
        description: 'Bleach + Hand-wax + Facial'
    },
    {
        id: 'waxing-package-699',
        name: '₹699 Package',
        price: 699,
        duration: 60,
        category: 'regular',
        description: 'Leg-wax + Underarms + Hand wax'
    },
    {
        id: 'nail-package-799',
        name: '₹799 Package',
        price: 799,
        duration: 120,
        category: 'regular',
        description: 'Underarms + Manicure + Pedicure'
    },
    {
        id: 'beauty-package-899',
        name: '₹899 Package',
        price: 899,
        duration: 120,
        category: 'regular',
        description: 'Haircut + Facial + Detan + Threading + Handwax'
    },
    {
        id: 'premium-package-1999',
        name: '₹1999 Premium Package',
        price: 1999,
        duration: 180,
        category: 'regular',
        description: 'Threading + Waxing + Detan/Bleach + Facial + Pedicure'
    }
];

// Bridal Services - Individual Services
export const bridalServices: Service[] = [
    {
        id: 'simple-look',
        name: 'Simple Looks',
        price: 999,
        duration: 60,
        category: 'bridal',
        description: 'Elegant simple makeup look'
    },
    {
        id: 'bridal-hairstyle',
        name: 'Only Hairstyle',
        price: 300,
        duration: 45,
        category: 'bridal',
        description: 'Professional bridal hair styling'
    },
    {
        id: 'bridal-makeup',
        name: 'Bridal Makeup (10% Discount)',
        price: 4999,
        duration: 120,
        category: 'bridal',
        description: 'Complete bridal makeup with 10% discount'
    },
    {
        id: 'bridal-saree-draping',
        name: 'Saree Pre-pleating',
        price: 299,
        duration: 30,
        category: 'bridal',
        description: 'Professional bridal saree pleating'
    }
];