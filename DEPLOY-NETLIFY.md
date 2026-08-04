# GGHB Website — Netlify Deployment Checklist

## Before deployment

1. Open `src/App.jsx` and replace the placeholder `STRIPE_PAYMENT_LINK` with your Stripe Payment Link.
2. Keep all API keys out of the code and GitHub repository.
3. Prepare these Netlify environment variables:
   - `ANTHROPIC_API_KEY`
   - `RESEND_API_KEY`
   - `RESEND_AUDIENCE_ID` (optional)
   - `RESEND_FROM`
4. Confirm the Anthropic model name in `netlify/functions/generate-reading.js` is available to your account.

## Recommended deployment method

1. Create a private GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In Netlify, choose **Add new project** → **Import an existing project** → **GitHub**.
4. Select your repository.
5. Netlify will read `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
6. Add the environment variables under **Project configuration** → **Environment variables**.
7. Deploy the project.
8. Test the free report, email delivery, payment flow, full report, and PDF printing.

## Important production warning

The current paid unlock checks only whether the return URL contains `?paid=true`. This can be bypassed. Before accepting real customer payments, replace this with server-side Stripe Checkout Session verification and/or a Stripe webhook.

The AI-generating function is publicly callable. Add rate limiting or another abuse-control layer before promoting the site widely.
