# Ozurso Volleyball Manager

A volleyball player profile management application that leverages Supabase for robust data management and provides dynamic team composition tools.

![Ozurso Logo](attached_assets/Ozurso-logo.png)

## Features

- Player profile management with customizable skills
- Dynamic team generation based on player skills
- Share team compositions without exposing player scores
- Bear Pride themed UI with dark mode support
- Responsive design for mobile and desktop

## Tech Stack

- React frontend with TypeScript
- Supabase database integration
- Vite build system
- Express.js backend API
- Tailwind CSS + shadcn/ui components
- Vercel deployment

## Supabase Setup

This application uses Supabase as its database. Before running the app, you need to set up your Supabase project:

1. Create a Supabase account and project at [supabase.com](https://supabase.com)
2. Run the SQL script in `supabase-setup.sql` in the SQL Editor of your Supabase project
3. Get your Supabase URL and API Key from the API settings section
4. Add these as environment variables (see below)

For detailed instructions, see the [Supabase Setup Guide](supabase-setup-guide.md).

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

For development inside the client folder:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment on Vercel

### Prerequisites

1. A GitHub account
2. A Vercel account
3. A Supabase account with a project set up

### Steps to Deploy

1. **Push your code to GitHub**
   - Create a new repository on GitHub
   - Push your local code to the repository

2. **Connect Vercel to GitHub**
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist/public`
     - Install Command: `npm install`

3. **Set up Environment Variables**
   - Add the following environment variables in Vercel:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_KEY`: Your Supabase API key

4. **Deploy**
   - Click "Deploy" and wait for the build to complete
   - Your app will be available at the provided Vercel URL

### Using GitHub Actions (Optional)

For automated deployments via GitHub Actions, set up the following secrets in your GitHub repository:

- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase API key

The workflow file in `.github/workflows/vercel-deploy.yml` will handle the deployment process automatically when you push to the main branch.

## License

MIT