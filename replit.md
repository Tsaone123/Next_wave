# NextWave - Creative Talent Platform

## Overview

NextWave is a full-stack web application designed to showcase and celebrate creative talent in the community. It serves as a comprehensive platform for musicians, artists, and creatives to share their work, discover events, and engage with the community through voting and directory features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful API with JSON responses
- **Development**: Hot module replacement via Vite middleware in development

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations with schema definitions in TypeScript
- **File Storage**: Local file handling for audio uploads (MP3 format)

## Key Components

### Database Schema
The application uses the following main entities:
- **Users**: User authentication and profiles
- **Playlists**: User-submitted music playlists with songs
- **Events**: Community events with details like location, time, and capacity
- **Directory Playlists**: Curated playlists organized by genre
- **Artist of Week**: Featured artist spotlight with bio and social links
- **Nominees**: Voting system for community recognition
- **Creatives**: Directory of local creative professionals
- **Votes**: User voting records for nominees

### UI Components
- **Hero Section**: Landing page with call-to-action buttons
- **Playlist Upload**: File upload system for MP3 audio files
- **Events Management**: Event creation and listing with filtering
- **Directory**: Searchable directory of playlists and creatives
- **Voting System**: Community voting interface for nominees
- **Admin Panel**: Administrative controls for content management

### API Endpoints
- `GET/POST /api/playlists` - Playlist management
- `GET/POST /api/events` - Event management
- `GET/POST /api/directory-playlists` - Curated playlist directory
- `GET/POST /api/artist-of-week` - Featured artist management
- `GET/POST /api/nominees` - Voting nominees
- `GET/POST /api/creatives` - Creative professional directory
- `GET/POST /api/votes` - User voting system

## Data Flow

1. **User Interaction**: Users interact with React components that use React Hook Form for input validation
2. **State Management**: TanStack Query manages server state, caching, and synchronization
3. **API Communication**: Frontend communicates with Express.js backend via REST API
4. **Database Operations**: Drizzle ORM handles type-safe database queries to PostgreSQL
5. **Real-time Updates**: Query invalidation ensures fresh data after mutations

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Form Validation**: Zod for schema validation
- **Query Management**: TanStack Query for server state
- **Date Handling**: date-fns for date formatting
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Database**: Neon Database for serverless PostgreSQL
- **ORM**: Drizzle ORM for database operations
- **Validation**: Zod for request/response validation
- **Session Management**: connect-pg-simple for PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **API Integration**: Express server with Vite middleware
- **Database**: Connection to Neon Database via DATABASE_URL
- **Asset Handling**: Vite handles static assets and bundling

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild compiles Node.js server bundle
- **Database**: Drizzle migrations ensure schema consistency
- **Environment**: Uses NODE_ENV for environment-specific behavior

### Key Configuration Files
- **Vite Config**: Frontend build configuration with React plugin
- **Drizzle Config**: Database schema and migration settings
- **Tailwind Config**: Styling system configuration
- **TypeScript Config**: Shared configuration for client/server/shared code

The application follows a monorepo structure with clear separation between client, server, and shared code, enabling efficient development and deployment workflows.