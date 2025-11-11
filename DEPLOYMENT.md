# Deployment Guide for Avirit Articles App

## GitHub Pages Deployment

This guide will help you deploy the Angular app to GitHub Pages.

### Prerequisites

1. A GitHub account
2. A repository named `tamord` (or update the baseHref in `angular.json`)

### Steps to Deploy

#### 1. Initialize Git Repository (if not already done)

```bash
cd D:\mody\avirit\Avirit2
git init
git add .
git commit -m "Initial commit"
```

#### 2. Connect to GitHub Repository

```bash
git remote add origin https://github.com/YOUR_USERNAME/tamord.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

#### 3. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/tamord`
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select:
   - **Deploy from a branch**
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. Click **Save**

#### 4. Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build the Angular app when you push to `main` branch
- Deploy to GitHub Pages on the `gh-pages` branch

#### 5. Access Your App

After deployment, your app will be available at:
```
https://YOUR_USERNAME.github.io/tamord/
```

### Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
cd Avirit3
npm run build
# Copy the contents of dist/avirit3 to your hosting service
```

### Important Notes

⚠️ **API Configuration**: The Angular app is configured to connect to `http://localhost:5020`. For production, you'll need to:
1. Deploy your ASP.NET Core API to a hosting service (Azure, AWS, etc.)
2. Update the API URL in `Avirit3/src/app/article.service.ts` to point to your production API

### Troubleshooting

- If the app doesn't load, check that GitHub Pages is enabled and the `gh-pages` branch exists
- Verify the baseHref in `angular.json` matches your repository name
- Check GitHub Actions tab for build errors

