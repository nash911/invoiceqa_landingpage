# Deploying to Vercel

This guide walks through moving the InvoiceQA landing page from Firebase to Vercel. It covers environment setup, deployment, and domain cutover from GoDaddy.

## 1. Prerequisites

- Vercel account with access to the target organization.
- Supabase project with the `leads` table migrated (`supabase/migrations/0001_create_leads.sql`).
- GitHub repository access (Vercel integrates directly with Git).
- GoDaddy credentials for updating DNS records.

## 2. Prepare Environment Variables

Collect the following values:

| Scope        | Variable                       | Description |
|--------------|--------------------------------|-------------|
| Public       | `NEXT_PUBLIC_SUPABASE_URL`     | Supabase project URL (used for analytics or read-only references). |
| Public       | `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity project ID. |
| Public       | `NEXT_PUBLIC_CALENDLY_URL`     | Calendly scheduling link shown on the site. |
| Public       | `NEXT_PUBLIC_SITE_URL`         | Final canonical site URL (e.g., `https://www.invoiceqa.com`). |
| Optional     | `NEXT_PUBLIC_LEAD_ENDPOINT`    | Defaults to `/api/lead`; override only if you proxy elsewhere. |
| Server-only  | `SUPABASE_URL`                 | Same as the public URL; required for the API route to instantiate the client. |
| Server-only  | `SUPABASE_SERVICE_ROLE_KEY`    | Supabase service-role key; never expose publicly. |

In Vercel:
1. Create or open the Vercel project.
2. Go to **Settings → Environment Variables**.
3. Add each variable for the **Production** environment. Mirror to **Preview** if you want PR builds hitting Supabase (consider using a staging database instead).
4. Click **Save** after each entry.

## 3. Connect the Repository

1. In Vercel, choose **Add New Project → Import Git Repository**.
2. Select the `invoiceqa_landingpage` repository (ensure the `vercel` branch is pushed).
3. Build settings:
   - Framework: **Next.js** (auto-detected).
   - Build command: `pnpm run build` (Vercel will install dependencies automatically).
   - Output directory: `.vercel/output/static` (handled by Next on Vercel; leave default).
4. Click **Deploy**. The initial deployment may take a few minutes while Vercel provisions infrastructure.

## 4. Verify the Deployment

After the build completes:
1. Open the generated preview URL.
2. Submit the lead form with a test entry and confirm a new row appears in Supabase → **Table Editor → leads**.
3. Check Vercel **Deployments → Functions** logs if the API route reports errors.

## 5. Promote to Production

Once satisfied:
1. Push or merge the `vercel` branch into `main`.
2. Vercel automatically builds and deploys `main` as the Production environment.
3. Note the Production URL (e.g., `https://invoiceqa.vercel.app`); you will map your GoDaddy domain to this deployment.

## 6. Update GoDaddy DNS

1. Log into GoDaddy → **My Products → Domains → invoiceqa.com → DNS**.
2. Remove or disable existing Firebase A/AAAA records.
3. Add the records recommended by Vercel:
   - If you use the Vercel CLI/domain wizard, it will generate two `A` records and one `CNAME` (or ALIAS) pointing to Vercel edge IPs (currently `76.76.21.21` for apex).
   - Example:
     - `@` → `76.76.21.21` (A record)
     - `www` → `cname.vercel-dns.com` (CNAME)
4. In Vercel → **Domains**, add `invoiceqa.com` and `www.invoiceqa.com`. Follow the prompts until both show as **Verified**.
5. Allow DNS propagation (usually <1 hour). Confirm by visiting `https://www.invoiceqa.com` and checking it resolves to the Vercel deployment.

## 7. Post-Migration Cleanup

- Delete Firebase-specific GitHub secrets and workflows (already removed in code).
- Optionally archive or disable Firebase Hosting/Functions to avoid unexpected costs.
- Monitor Supabase insertions to ensure leads continue to populate.

## 8. Rollback Strategy

If you need to revert temporarily:
1. Keep the Firebase hosting configuration accessible.
2. Restore the old DNS records in GoDaddy pointing back to Firebase.
3. Re-enable Firebase secrets and deployment scripts as needed.

With the migration complete, future deployments happen automatically when you push to `main`. Use Vercel Preview deployments for QA on feature branches before merging. *** End Patch***
