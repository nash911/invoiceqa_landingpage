# InvoiceQA Landing Page

This repository contains the source code for the InvoiceQA landing page, a production-ready site built with Next.js, Tailwind CSS, Firebase, and Supabase.

## Features

- **Modern Frontend**: Built with Next.js 14+ (App Router) and TypeScript.
- **Premium Design**: Styled with Tailwind CSS and shadcn/ui for a premium, conversion-focused look.
- **Dark Mode**: System-based theme with a manual toggle.
- **Lead Capture**: Secure HTTPS Cloud Function endpoint for capturing leads.
- **Database**: Uses Supabase for lead storage, accessed securely from the backend.
- **Analytics**: Integrated with Microsoft Clarity for user behavior insights.
- **Hosting**: Deployed on Firebase Hosting with seamless Next.js integration.
- **Developer Experience**: Includes ESLint, Prettier, and type-checking for code quality.

## Project Structure

```
/invoiceqa
├── .env.local.example      # Example environment variables
├── .firebaseignore         # Files to ignore during Firebase deployment
├── .firebaserc             # Firebase project configuration
├── .gitignore
├── .prettierrc             # Prettier configuration
├── firebase.json           # Firebase Hosting and Functions configuration
├── functions/              # Firebase Cloud Functions (backend)
│   ├── src/
│   │   ├── index.ts        # Functions entry point
│   │   └── lead.ts         # Lead capture HTTPS function
│   ├── package.json
│   └── tsconfig.json
├── next.config.ts
├── package.json
├── public/                 # Static assets (images, sitemap, robots.txt)
├── src/                    # Next.js source code
│   ├── app/                # App Router pages
│   ├── components/         # React components (UI, layout, features)
│   ├── lib/                # Helper utilities and libraries
│   └── types/              # TypeScript type definitions
└── supabase/
    └── migrations/         # Supabase database migrations
        └── 0001_create_leads.sql
```

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

- Node.js (v20 or later)
- pnpm (or npm/yarn)
- Firebase CLI (`npm i -g firebase-tools`)
- A Supabase project
- A Firebase project

### 2. Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd invoiceqa
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Copy the example environment file:
    ```bash
    cp .env.local.example .env.local
    ```
    Now, edit `.env.local` and fill in the values:
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
    - `NEXT_PUBLIC_CLARITY_PROJECT_ID`: Your Microsoft Clarity project ID.
    - `NEXT_PUBLIC_CALENDLY_URL`: Your Calendly link for booking demos.
    - `NEXT_PUBLIC_SITE_URL`: The final public URL of your site (e.g., `https://your-project.firebaseapp.com`).

4.  **Start the development server:**
    ```bash
    pnpm run dev
    ```
    The site will be available at [http://localhost:3000](http://localhost:3000).

### 3. Supabase Setup

1.  **Create a Supabase Project**: If you haven't already, create a new project on [Supabase](https://supabase.com/).

2.  **Apply the Database Migration**:
    - Go to the **SQL Editor** in your Supabase project dashboard.
    - Open the `supabase/migrations/0001_create_leads.sql` file from this repository.
    - Copy its content, paste it into the SQL editor, and click **Run**.
    - This will create the `leads` table with the correct schema and security policies.

3.  **Get Credentials**:
    - **URL**: Find your project URL in **Project Settings > API**.
    - **Service Role Key**: Find your `service_role` secret key in **Project Settings > API**. **Keep this secret and do not share it.**

### 4. Firebase Setup & Deployment

1.  **Log in to Firebase:**
    ```bash
    firebase login
    ```

2.  **Initialize Firebase in the project:**
    Although configuration files are provided, you may need to associate this project with your Firebase account.
    ```bash
    firebase init
    ```
    - Select **Hosting** and **Functions**.
    - Choose an existing Firebase project or create a new one.
    - When prompted, do **not** overwrite the existing `firebase.json` or other configuration files.

3.  **Set Server-Side Secrets:**
    These environment variables are for the `lead` Cloud Function and are stored securely in Firebase.
    ```bash
    # Replace with your Supabase Project URL
    firebase functions:secrets:set SUPABASE_URL

    # Replace with your Supabase Service Role Key
    firebase functions:secrets:set SUPABASE_SERVICE_ROLE_KEY

    # (Optional) Set allowed origins for CORS, e.g., "https://your-site.web.app"
    firebase functions:secrets:set ALLOW_ORIGINS
    ```

4.  **Deploy to Firebase:**
    This command will build the Next.js app, build the Cloud Function, and deploy everything to Firebase.
    ```bash
    firebase deploy
    ```

## Performance

### Lighthouse

To measure performance, run a Lighthouse audit in Chrome DevTools:

1.  Open your deployed site in an incognito window.
2.  Open Chrome DevTools (`Ctrl+Shift+I` or `Cmd+Opt+I`).
3.  Go to the **Lighthouse** tab.
4.  Select **Navigation** mode and check all categories.
5.  Click **Analyze page load**.

**Target**: Aim for a score of **≥90** across all categories (Performance, Accessibility, Best Practices, SEO).

## Security Notes

- **Service Role Key**: The `SUPABASE_SERVICE_ROLE_KEY` is highly sensitive. It is stored exclusively as a Firebase Secret and is only accessible by the Cloud Function. It is **never** exposed to the client-side.
- **API Endpoint**: The `/api/lead` endpoint is protected against abuse with:
    - **CORS**: Configured in `firebase.json` and can be restricted with the `ALLOW_ORIGINS` secret.
    - **Rate Limiting**: A simple in-memory token bucket algorithm limits the number of requests per IP address.
- **Bot Protection**: The lead form includes a hidden honeypot field and a minimum dwell time requirement to deter simple bots.

## Tailwind v4 Semantic Tokens (@theme)

This project uses Tailwind CSS v4 with semantic color tokens (shadcn-style) mapped via an `@theme` block.

- Where: See `src/app/globals.css`.
  - `:root` and `.dark` define CSS variables like `--background`, `--foreground`, `--border`, etc.
  - The `@theme` block maps them to Tailwind colors like `--color-background`, `--color-border`, enabling utilities: `bg-background`, `text-foreground`, `border-border`, `ring-ring`, etc.
- Why: Tailwind v4 shifts theme configuration into CSS. This keeps tokens colocated with styles and removes the need for a separate `tailwind.config.js` just for colors.

Common usages
- Page base: `bg-background text-foreground`
- Borders and inputs: `border-border`, `border-input`
- Focus styles: `focus-visible:ring-1 focus-visible:ring-ring ring-offset-background`
- Muted/accent: `text-muted-foreground`, `bg-muted/30`, `bg-accent`
- Opacity modifiers work: `bg-background/80`, `text-foreground/90`

Adding or changing a token
1. Add/update the CSS variables in `:root` and `.dark`, e.g.:
   - `--brand: 220 90% 55%` and optional `--brand-foreground`
2. Map them in the `@theme` block:
   - `--color-brand: hsl(var(--brand));`
   - (optional) `--color-brand-foreground: hsl(var(--brand-foreground));`
3. Use them in classes:
   - Background/text: `bg-brand text-brand-foreground`
   - Borders/rings: `border-brand focus:ring-brand`

Notes
- Keep using `@tailwindcss/postcss` (already configured in `postcss.config.mjs`). No separate `tailwind.config.js` is required for these colors in v4.
- Dark mode is handled by the `.dark` class swapping variable values; utilities automatically reflect the correct colors.
