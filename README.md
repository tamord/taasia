# Taasia - Articles Management App

A full-stack application for managing articles with Angular frontend and ASP.NET Core backend.

## Repository Structure

```
.
├── Avirit2/              # ASP.NET Core Backend
│   ├── Controllers/      # API Controllers
│   ├── Program.cs        # Application entry point
│   └── ...
├── avirit3/              # Angular Frontend
│   ├── src/
│   │   └── app/          # Angular components and services
│   └── ...
└── .github/
    └── workflows/        # GitHub Actions for deployment
```

## Features

- ✅ Create, Read, Update, Delete articles
- ✅ Search articles by title or text
- ✅ Responsive design
- ✅ Persistent storage (JSON file)
- ✅ RESTful API
- ✅ Custom dialogs for create/edit/delete

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

The Angular app is automatically deployed to GitHub Pages when you push to the `main` branch.

**Live URL**: `https://tamord.github.io/taasia/`

#### Enable GitHub Pages

1. Go to repository settings: `https://github.com/tamord/taasia/settings/pages`
2. Source: Deploy from a branch
3. Branch: `gh-pages`
4. Folder: `/ (root)`
5. Click Save

The GitHub Actions workflow will automatically build and deploy your app.

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

