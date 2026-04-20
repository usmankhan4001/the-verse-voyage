# The Verse Voyage

The Verse Voyage is a premium, professional Course Management System (CMS) and Progressive Web Application (PWA) designed for the Juz Amma Mastery Program. It provides a distraction-free, thematic learning environment for students and a robust management portal for teachers.

## Core Features

### Student Experience
- Progressive Web Application (PWA): Optimized for mobile and desktop with offline support.
- Thematic Learning: Surahs are organized into phases reflecting the thematic structure of the Quran.
- Mastery Tracking: Automated progress tracking based on audio recitation cycles and document study.
- Native Document Viewing: Integrated PDF viewer utilizing Google Drive for secure, high-performance rendering.
- Offline Capability: Critical assets (audio and PDF) can be cached locally for access without an active internet connection.

### Administrative Tools
- Teacher Gateway: A secure, password-protected portal for managing course content and students.
- Session Management: Detailed control over session topics, Urdu Tafseer summaries, and digital resources.
- Bulk Import: Support for CSV-based session data imports with a standardized template.
- Student Progress Audit: Real-time overview of student attendance and course completion rates.

## Technology Stack
- Frontend: React 19, TypeScript, Vite.
- Styling: Custom CSS with a professional design system (Obsidian/Slate).
- Animations: Framer Motion.
- Icons: Lucide React.
- Infrastructure: Docker, Nginx (Stage-based builds).

## Deployment Instructions for Dokploy

To deploy this application on a Dokploy server, follow these systematic steps:

### 1. Repository Configuration
Connect your Dokploy instance to the GitHub repository:
- URL: https://github.com/usmankhan4001/the-verse-voyage.git
- Branch: main

### 2. Service Creation
Create a new service within Dokploy and select "Docker Compose" as the deployment strategy. Dokploy will automatically detect the `docker-compose.yml` and `Dockerfile` in the repository root.

### 3. Port Configuration
The application is configured to serve content via Nginx on port 80. Ensure your Dokploy service mapping reflects this:
- Container Port: 80
- Host Port: (As per your internal network configuration)

### 4. Domain and SSL
In the Dokploy dashboard, add your custom domain. Since SSL is managed at the Cloudflare layer, ensure that:
- Your Cloudflare SSL/TLS mode is set to "Full" or "Flexible" as required by your server configuration.
- The Cloudflare Proxy (Orange Cloud) is active for the domain.

### 5. Deployment
Execute the deployment. Dokploy will pull the latest code, perform the multi-stage build (Node for compilation, Nginx for serving), and launch the container on the specified network.

## Local Development

### Prerequisites
- Node.js 20 or higher.
- npm or yarn.

### Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.

### Production Build
1. Run `npm run build` to generate the production bundle in the `dist` folder.
2. Run `npm run preview` to test the production build locally.
