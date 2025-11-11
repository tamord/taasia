# Avirit Articles App

A full-stack application for managing articles with Angular frontend and ASP.NET Core backend.

## Features

- ✅ Create, Read, Update, Delete articles
- ✅ Search articles by title or text
- ✅ Responsive design
- ✅ Persistent storage (JSON file)
- ✅ RESTful API

## Tech Stack

### Frontend
- Angular 16
- TypeScript
- HTML/CSS

### Backend
- ASP.NET Core 6.0
- C#
- JSON file storage

## Development

### Frontend (Angular)
```bash
cd avirit3
npm install
npm start
```
App runs on `http://localhost:4200`

### Backend (ASP.NET Core)
```bash
cd Avirit2
dotnet run
```
API runs on `http://localhost:5020`

## Deployment

### GitHub Pages

The app is configured to deploy to GitHub Pages at: `https://[username].github.io/tamord/`

#### Automatic Deployment (GitHub Actions)

1. Push your code to the `main` or `master` branch
2. GitHub Actions will automatically build and deploy
3. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (created automatically)
   - Folder: `/ (root)`

#### Manual Deployment

```bash
cd avirit3
npm run build
# The dist/avirit3 folder contains the production build
# Deploy the contents to your hosting service
```

## API Endpoints

- `GET /api/Mody` - Get all articles
- `GET /api/Mody/{id}` - Get article by ID
- `POST /api/Mody/articles` - Create new article
- `PUT /api/Mody/articles/{id}` - Update article
- `DELETE /api/Mody/articles/{id}` - Delete article

## Notes

- The backend API must be running for the frontend to work
- Articles are stored in `Avirit2/bin/Debug/net6.0/Data/articles.json`
- CORS is configured to allow requests from `http://localhost:4200`
