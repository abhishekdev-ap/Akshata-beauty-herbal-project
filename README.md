# 💇‍♀️ Parlor Appointment System

A modern **appointment booking system** for parlors and salons.  
This project allows customers to easily book, reschedule, and manage appointments, while providing the parlor owner with tools to manage schedules, payments, and customer interactions.

---

## 🏗 Project Architecture & Flow

### 📊 Project Flowchart
```mermaid
graph TD
    A[User Opens App] --> B{User Authenticated?}
    B -->|No| C[Login/Register Page]
    B -->|Yes| D[Dashboard/Booking Page]
    
    C --> E[Email/Password Input]
    E --> F[Auto-Registration if New User]
    F --> G[Authentication Service]
    G --> H{Login Success?}
    H -->|No| I[Show Error Message]
    H -->|Yes| D
    
    D --> J[Service Selection]
    J --> K[Date/Time Selection]
    K --> L[Customer Phone Input]
    L --> M[Book Appointment Button]
    
    M --> N[Real-time SMS to Akshata]
    N --> O[Payment Page]
    O --> P{Payment Method?}
    
    P -->|UPI| Q[UPI Payment Processing]
    P -->|Card| R[Card Payment Processing]
    P -->|Cash| S[Pay at Parlor Option]
    
    Q --> T[Payment Confirmation SMS]
    R --> T
    S --> U[Booking Confirmation]
    
    T --> V[Review Page]
    U --> V
    V --> W[Submit Review]
    W --> X[Thank You Page]
    
    D --> Y[View Reviews]
    Y --> Z[Customer Reviews Page]
    Z --> AA[Write/Edit Reviews]
    
    D --> BB[Account Settings]
    BB --> CC[Profile/Security/Preferences]
    
    D --> DD[Payment History]
    DD --> EE[View Receipts/Download PDF]
    
    G --> FF[Password Reset Flow]
    FF --> GG[Email Service]
    GG --> HH[Reset Link Sent]
    HH --> II[New Password Setup]


⚙️ Technology Stack
Frontend

React 18.3.1 – Modern React with hooks & functional components

TypeScript – Type-safe development

Vite – Fast build tool and dev server

Styling & UI

Tailwind CSS 3.4.1 – Utility-first CSS framework

Lucide React – Modern icon library

Custom Animations – CSS transitions & transforms

Dark Mode Support – Theme switching

State Management

React Hooks – useState, useEffect for local state

Context API – Global state management

Local Storage – Persistent data storage

Services & APIs

SMS Service (multi-provider):

TextLocal (Primary – Indian SMS)

Twilio (Backup – International)

AWS SNS (Cloud backup)

Webhook fallbacks

Email Service – For password reset

PDF Service (jsPDF) – Receipt generation

Authentication Service – User management

🚀 Core Features

User Authentication – Login/Register with auto-registration

Service Booking – Multi-service selection with pricing

Payment Processing – UPI, Card, Cash options

Real-time Notifications – SMS to parlor owner

Review System – Customer feedback & ratings

Account Management – Profile, settings, preferences

🌟 Advanced Features

Dark Mode – Complete theme switching

PDF Generation – Professional receipts

Payment History – Transaction tracking

Password Reset – Email-based recovery

Responsive Design – Mobile-first approach

Smooth Animations – Professional transitions

🔧 Environment

Node.js – Runtime environment

npm – Package management

Environment Variables – Configurable settings# -Parlor-project-Full-stack-development-
