# 🏦 Loan Application Portal - Frontend

A modern, responsive loan application management system built with React, TypeScript, and cutting-edge UI technologies.

The Loan Application Portal is a comprehensive financial management system that allows users to:
- Apply for various types of loans (Personal, Business)
- Track application status in real-time
- Manage loan installments and payments
- Receive notifications about application updates
- View detailed financial dashboard

This frontend application provides an intuitive, modern interface for both loan applicants and administrators.

## ✨ Features

### 🔐 User Authentication
- Secure login/registration system
- JWT token-based authentication
- Protected routes and role-based access
- Password reset functionality

### 📊 Dashboard
- Real-time loan application status
- Financial overview with animated statistics
- Pending, approved, and rejected applications tracking
- Notification management with delete functionality
- Auto-refresh every 30 seconds for live updates

### 💼 Loan Management
- Multi-step loan application form
- Support for multiple loan types:
  - Personal Loans
  - Auto Loans
  - Business Loans
  - Home Loans
- Document upload functionality
- Application progress tracking

### 💳 Payment System
- Stripe integration for secure payments
- Installment management
- Payment history tracking
- Due date notifications

### 🔔 Notifications
- Real-time application status updates
- Email notifications
- In-app notification system
- Mark as read/delete functionality

### 👨‍💼 Admin Panel
- Loan application review and approval
- User management
- System statistics and analytics
- Bulk operations support

## 🛠 Tech Stack

### Core Technologies
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### UI Framework
- **shadcn/ui** - Modern, accessible component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations and transitions

### State Management
- **Redux Toolkit (RTK)** - Predictable state container
- **RTK Query** - Data fetching and caching
- **React Context** - Local state management

### Form Handling
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Utilities
- **date-fns** - Modern date utility library
- **Sonner** - Toast notifications
- **clsx** - Conditional className utility

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Backend API** running on port 3001
- **MongoDB** database connection
- **Stripe** account for payment processing

### For Loan Applicants

1. **Registration/Login**
   - Create a new account or login with existing credentials
   - Complete profile information

2. **Apply for Loan**
   - Navigate to "Apply for Loan" page
   - Fill out the multi-step application form
   - Upload required documents
   - Submit application

3. **Track Application**
   - View application status on dashboard
   - Receive real-time notifications
   - Monitor approval progress

4. **Manage Payments**
   - View installment schedule
   - Make payments through Stripe
   - Track payment history

### For Administrators

1. **Admin Login**
   - Access admin panel with admin credentials
   - View system overview

2. **Review Applications**
   - Review pending loan applications
   - Approve or reject applications
   - Add review comments

3. **User Management**
   - View all registered users
   - Monitor user activities
   - Generate reports

## 📁 Project Structure

```
Frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Footer.tsx    # Footer component
│   │   └── PaymentDialog.tsx
│   ├── contexts/         # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── ReduxAuthContext.tsx
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   │   └── utils.ts
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Apply.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── AdminPanel.tsx
│   ├── services/         # API service functions
│   ├── store/            # Redux store configuration
│   │   ├── api/          # RTK Query API slices
│   │   ├── slices/       # Redux slices
│   │   └── hooks.ts      # Typed Redux hooks
│   ├── App.tsx           # Main App component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```
