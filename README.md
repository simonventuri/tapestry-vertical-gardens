# Tapestry Vertical Gardens - Redis Migration

This project has been migrated from SQLite to Redis for better hosting compatibility.

# Tapestry Vertical Gardens

A Next.js website for a vertical gardens and living walls company, featuring a portfolio system with Redis backend.

## Prerequisites

- Node.js 18+ 
- Redis server (local or hosted)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Redis:**
   
   **Local Development:**
   - Install Redis locally or use Docker:
     ```bash
     # macOS (using Homebrew)
     brew install redis
     brew services start redis
     
     # Or using Docker
     docker run -d -p 6379:6379 redis:latest
     ```
   
   **Production:**
   - Use a hosted Redis service (Railway, Render, Heroku Redis, etc.)
   - Set the `REDIS_URL` environment variable

3. **Environment Variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your Redis URL and email settings
   REDIS_URL=redis://localhost:6379  # For local development
   # or
   REDIS_URL=redis://username:password@hostname:port  # For production
   
   # Email configuration (required for contact form)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@tapestryverticalgardens.com
   ```

4. **Seed the database:**
   ```bash
   npm run seed
   ```
   This will populate Redis with 10 sample portfolio projects.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## Database Structure

The application uses Redis with the following data structures:

### Projects
- `project:{id}` - Hash containing project data (id, title, story, hero_image, slug, created_at)
- `projects:sorted` - Sorted set for ordering projects by creation date
- `slug:{slug}` - String mapping slugs to project IDs

### Project Photos
- `photo:{id}` - Hash containing photo data (id, project_id, image_path, created_at)
- `project:{project_id}:photos` - List of photo IDs for each project

### Contacts
- `contact:{id}` - Hash containing contact form data
- `contacts:sorted` - Sorted set for ordering contacts by submission date

## Admin System

The admin system is available at `/admin` with the following credentials:
- Username: `joey_deacon`
- Password: `spazzmatron2025`

Features:
- View all projects in a paginated table
- Create new projects with drag-and-drop image uploads
- Edit existing projects (title, story, slug, hero image, gallery images)
- Delete projects with confirmation
- Authentication protection for all admin routes

### Contact Form System

The contact form includes:
- **Required field validation** for all inputs
- **Email validation** with proper formatting
- **Thank you modal** after successful submission
- **Email notifications** sent to info@tapestryverticalgardens.com
- **Database storage** of all contact submissions
- **Professional email formatting** with all submission details

Form fields:
- Name, Email, Phone (contact information)
- Project Type, Location, Budget Range (project details)
- Message (detailed project description)

## Deployment

1. **Environment Variables:**
   Set the `REDIS_URL` and email configuration environment variables on your hosting platform:
   ```
   REDIS_URL=redis://username:password@hostname:port
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@tapestryverticalgardens.com
   ```

2. **Redis Service:**
   Ensure you have a Redis instance running and accessible from your hosting environment.

3. **Seed Data:**
   After deployment, run the seed command to populate your Redis database:
   ```bash
   npm run seed
   ```

4. **Build and Start:**
   ```bash
   npm run build
   npm start
   ```

## Common Redis Hosting Providers

- **Railway**: Provides Redis add-on services
- **Render**: Redis hosting with simple setup
- **Heroku**: Heroku Redis add-on
- **DigitalOcean**: Managed Redis databases
- **AWS**: ElastiCache for Redis

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed Redis with sample data

## File Structure

```
├── components/
│   ├── Footer.js
│   ├── Nav.js
│   └── AdminLogin.js
├── lib/
│   ├── database.js      # Redis database functions
│   └── auth.js          # Admin authentication
├── pages/
│   ├── admin/           # Admin system
│   ├── api/             # API routes
│   ├── projects/        # Dynamic project pages
│   └── ...
├── scripts/
│   └── seed-redis.js    # Database seeding
└── ...
```

## Troubleshooting

**Redis Connection Issues:**
- Verify Redis is running: `redis-cli ping`
- Check your Redis URL and credentials
- Ensure firewall allows connections on Redis port (6379)

**Empty Portfolio:**
- Run the seed script: `npm run seed`
- Check Redis data: `redis-cli` then `KEYS *`

**Contact Form Issues:**
- Verify email configuration in environment variables
- Check email provider settings (Gmail requires app passwords)
- Test with a simple SMTP service like Mailtrap for development

**Email Setup for Gmail:**
1. Enable 2-factor authentication on your Google account
2. Generate an app-specific password
3. Use the app password (not your regular password) in `EMAIL_PASS`
4. Set `EMAIL_USER` to your full Gmail address

**Admin Login Issues:**
- Clear browser cookies and try again
- Check console for authentication errors

## Data Migration

### From SQLite to Redis

If you have existing SQLite data to migrate:

```bash
# Install temporary SQLite dependencies
npm install sqlite sqlite3 --save-dev

# Run migration
npm run migrate

# Remove SQLite dependencies
npm uninstall sqlite sqlite3
```

### Fresh Installation

For a fresh installation with sample data:

```bash
npm run seed
```

## Redis Data Structure

The application uses the following Redis keys:

### Projects
- `project:{id}` - Hash containing project data
- `slug:{slug}` - String mapping slug to project ID
- `projects:sorted` - Sorted set for project ordering

### Project Photos
- `photo:{id}` - Hash containing photo data
- `project:{id}:photos` - List of photo IDs for a project

### Contacts
- `contact:{id}` - Hash containing contact data
- `contacts:sorted` - Sorted set for contact ordering

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Migrate from SQLite to Redis
- `npm run seed` - Seed Redis with sample data

## Environment Variables

Create a `.env.local` file for local development:

```
REDIS_URL=redis://localhost:6379
```

See `.env.example` for more configuration options.

## Admin Access

Admin panel is available at `/admin` with credentials:
- Username: `joey_deacon`
- Password: `spazzmatron2025`

## Features

- **Portfolio Management**: Full CRUD operations for projects
- **Image Uploads**: Drag & drop file uploads for hero and gallery images
- **Responsive Design**: Mobile-first responsive grid layout
- **Admin Authentication**: Password-protected admin area
- **Contact Forms**: Contact submission handling (ready for Redis storage)
- **SEO Optimized**: Static generation with dynamic routing

## Troubleshooting

### Redis Connection Issues

1. Ensure Redis is running:
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

2. Check the `REDIS_URL` environment variable

3. Verify network connectivity to Redis server

### Data Migration Issues

1. Ensure SQLite database exists before migration
2. Check Redis connection before running migration
3. Verify sufficient Redis memory for data storage
