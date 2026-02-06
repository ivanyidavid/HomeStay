# Overview

This is a rental house booking website built as a modern, Airbnb-style single-page application. The project showcases a guest house in Verőce Hills, Hungary, featuring comprehensive property information, image galleries, and an integrated booking system with dynamic pricing. The application uses a full-stack architecture with React frontend, Express backend, and PostgreSQL database to handle property listings and reservation management with Google Sheets integration for real-time pricing and availability updates.

# Recent Changes

## September 21, 2025 - Dynamic Pricing System Implementation
- ✅ **Complete Photo Optimization**: 57 photos converted to WebP with 60-85% mobile performance improvement
- ✅ **Whole House Cleaning Fee**: Reads from Google Sheets cell N2 (€40) with real-time updates  
- ✅ **Room Cleaning Fee**: Reads from Google Sheets cell O2 (€15) for individual room bookings
- ✅ **Extra Guest Fee System**: Implemented dynamic pricing for Whole House bookings over 6 guests using column M values (€15 per extra guest)
- ✅ **Google Sheets Integration**: Live sync for pricing, availability, and fee calculations
- ✅ **Smart Booking Summary**: Conditional display of fees based on room selection and guest count

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern UI components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for booking management
- **Data Storage**: In-memory storage with interface for future database integration
- **Validation**: Zod schemas for request/response validation

## Database Schema
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Tables**: 
  - Users table with authentication fields
  - Bookings table with date ranges, guest information, and pricing
- **Validation**: Drizzle-zod integration for type-safe database operations

## Component Structure
- **Hero Section**: Full-screen image with call-to-action
- **Features Grid**: Card-based layout showcasing property amenities
- **Image Gallery**: Responsive photo gallery with modal viewing
- **Booking Calendar**: Interactive date picker with availability checking
- **Features Carousel**: Auto-rotating highlights with emoji icons

## Development Setup
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Development**: Hot module replacement and live reloading
- **TypeScript**: Strict type checking with path aliases for clean imports

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library

## UI Component Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **shadcn/ui**: Pre-built component system built on Radix UI
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

## Form and Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Validation resolver for Zod integration
- **zod**: Schema validation and type inference

## Date Handling
- **date-fns**: Modern date utility library
- **react-day-picker**: Flexible date picker component

## Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **eslint/prettier**: Code formatting and linting (implied by modern React setup)

## Database and Storage
- **connect-pg-simple**: PostgreSQL session store (prepared for session management)
- **drizzle-kit**: Database migration and introspection tools

The application is designed to be easily deployable on platforms like Replit, with environment-based configuration for database connections and development vs. production builds.