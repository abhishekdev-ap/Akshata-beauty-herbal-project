# 🌿 Akshata Beauty Herbal Parlour

A modern, full-stack appointment booking system designed for **Akshata Beauty Herbal Parlour**. This application transforms a traditional salon business into a digital SaaS platform, offering seamless booking for customers and powerful management tools for the owner.

**🚀 Live Demo:** [https://akshata-beauty-world.vercel.app](https://akshata-beauty-world.vercel.app)

---

## ✨ Key Features

### 💳 Smart Payments (New)
*   **Direct UPI Integration**: Seamlessly pay using **Google Pay**, **PhonePe**, or any UPI app directly from the mobile browser.
*   **Deep Linking**: Automatically opens payment apps on mobile devices for a friction-less experience.
*   **Zero-Commission**: Direct bank-to-bank transfer layout without third-party gateway fees.

### 📍 Location & Contact
*   **Interactive Location Card**: Stylish, clickable location card that opens the **exact street view** of the parlour in Google Maps.
*   **Smart Contact Form**: Integrated with **Web3Forms** for reliable email delivery, with intelligent error handling and fallback support.
*   **Real-time Availability**: Status indicator shows if the parlour is currently open or closed.

### 👤 SaaS Customer Experience
*   **Seamless Booking**: Intuitive flow for selecting services, specialists, dates, and time slots.
*   **User Dashboard**: Users can manage profile, view booking history, and download PDF receipts.
*   **Authentication**: Secure login/signup via Firebase Auth, with password reset functionality.
*   **Dark Mode**: Stunning system-wide dark mode with premium aesthetics.

### 🛠️ Owner & Admin Features
*   **Admin Dashboard**: comprehensive view of all bookings, revenue, and customer stats.
*   **Service Management**: Add, edit, or remove services and packages dynamically.
*   **Multi-tenancy Architecture**: Scalable codebase designed to support multiple salon branches in the future.

---

## 🏗 Technological Excellence

### ⚙️ Tech Stack
*   **Frontend**: React 18, TypeScript, Vite
*   **Styling**: Tailwind CSS, Framer Motion (Animations), Lucide React (Icons)
*   **Backend / Auth**: Firebase (Authentication, Firestore, Storage)
*   **Email Services**: Web3Forms (Primary)
*   **Deployment**: Vercel (CI/CD)

### ⚡ Performance Optimizations
*   **Lazy Loading**: Route-based code splitting for instant load times.
*   **3D Animations**: Premium scroll-reveal animations optimized for mobile GPU.
*   **PWA-Ready**: Mobile-first responsive design that feels like a native app.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/abhishekdev-ap/Akshata-beauty-herbal-project.git
    cd Akshata-beauty-herbal-project
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    VITE_FIREBASE_API_KEY=your_key
    VITE_FIREBASE_AUTH_DOMAIN=your_domain
    VITE_FIREBASE_PROJECT_ID=your_id
    VITE_WEB3FORMS_KEY=your_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

### Deployment

Project is configured for **Vercel**.
1.  Push to GitHub.
2.  Import project in Vercel.
3.  Add Environment Variables in Vercel Settings.
4.  Deploy!

---

## 🔒 License

This project is proprietary software developed for **Akshata Beauty Herbal Parlour**.
Copyright © 2024. All rights reserved.
