# RentGo - Netlify Deployment Guide

This guide will help you deploy your RentGo frontend application to Netlify.

## Prerequisites

- A GitHub account
- Your RentGo codebase pushed to a GitHub repository
- A Netlify account (sign up at [netlify.com](https://netlify.com) if you don't have one)

## Deployment Steps

### 1. Push your code to GitHub

Make sure your code is committed and pushed to a GitHub repository.

```bash
git add .
git commit -m "Ready for deployment"
git push
```

### 2. Login to Netlify

- Go to [netlify.com](https://netlify.com) and login with your account
- Click on "New site from Git"

### 3. Connect to your GitHub repository

- Select GitHub as your Git provider
- Authorize Netlify to access your repositories
- Select the repository containing your RentGo frontend

### 4. Configure build settings

Netlify should automatically detect Next.js and populate these fields, but verify they match the following:

- **Build command**: `npm run build`
- **Publish directory**: `.next`

### 5. Configure environment variables

Add the following environment variables in the Netlify dashboard under Site settings > Build & deploy > Environment:

- `NEXTAUTH_SECRET`: Your NextAuth secret (set to the same value as your local .env)
- `NEXTAUTH_URL`: The URL of your Netlify site (e.g., https://your-site-name.netlify.app)
- `NEXT_PUBLIC_API_URL`: The URL of your backend API

### 6. Deploy your site

- Click "Deploy site"
- Wait for the build process to complete

### 7. Update domain settings (optional)

- If you want to use a custom domain, go to Site settings > Domain management
- Follow the instructions to configure your custom domain

## Post-Deployment

### Update backend CORS settings

Remember to update your backend CORS settings to allow requests from your Netlify domain:

```
CORS_ORIGIN=https://your-site-name.netlify.app
```

### Update API URLs

If you're hosting your backend separately, update the `NEXT_PUBLIC_API_URL` in your Netlify environment variables to point to your deployed backend URL.

## Troubleshooting

### Image Optimization

If you're using Next.js Image component with external images, ensure those domains are added to the `next.config.js` file:

```javascript
module.exports = {
  images: {
    domains: ['images.unsplash.com', 'your-other-domain.com'],
  },
}
```

### API Connection Issues

If your frontend can't connect to your backend, verify:
- CORS is properly configured on your backend
- The API URL is correctly set in Netlify environment variables
- Your backend server is running and accessible

### Authentication Problems

If authentication is not working:
- Verify `NEXTAUTH_URL` is set to your Netlify domain
- Check that `NEXTAUTH_SECRET` is correctly set
- Ensure your backend authentication endpoints are accessible

## Continuous Deployment

Netlify will automatically rebuild and redeploy your site whenever you push changes to your GitHub repository's main branch. 