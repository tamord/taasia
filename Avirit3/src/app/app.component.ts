import { Component, OnInit } from '@angular/core';
import { ArticleService, Article } from './article.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Avirit Articles';
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  loading = true;
  error: string | null = null;
  searchQuery: string = '';
  showCreateDialog: boolean = false;
  isCreatingArticle: boolean = false;
  isUpdatingArticle: boolean = false;
  isDeletingArticle: boolean = false;
  articleToEdit: Article | null = null;
  articleToDelete: Article | null = null;
  showDeleteDialog: boolean = false;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.loading = true;
    this.error = null;
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        console.log('Articles received:', articles);
        this.articles = articles || [];
        this.applySearchFilter(); // Apply search filter after loading
        this.loading = false;
        if (this.articles.length === 0) {
          console.warn('No articles received from API');
        }
      },
      error: (err) => {
        this.error = 'Failed to load articles. Please make sure the API server is running.';
        this.loading = false;
        console.error('Error loading articles:', err);
        console.error('Error details:', JSON.stringify(err, null, 2));
      }
    });
  }

  openCreateDialog(): void {
    this.articleToEdit = null;
    this.showCreateDialog = true;
  }

  openEditDialog(article: Article): void {
    this.articleToEdit = { ...article }; // Create a copy
    this.showCreateDialog = true;
  }

  closeCreateDialog(): void {
    this.showCreateDialog = false;
    this.isCreatingArticle = false;
    this.isUpdatingArticle = false;
    this.articleToEdit = null;
  }

  onCreateArticle(articleData: { title: string; text: string }): void {
    this.isCreatingArticle = true;
    this.error = null;
    
    console.log('Creating article with data:', articleData);
    
    this.articleService.createArticle(articleData).subscribe({
      next: (newArticle) => {
        console.log('Article created successfully:', newArticle);
        // Insert at the beginning to show newest first
        this.articles.unshift(newArticle);
        this.applySearchFilter(); // Update filtered list
        this.isCreatingArticle = false;
        this.closeCreateDialog();
      },
      error: (err) => {
        console.error('Error creating article:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error body:', err.error);
        
        let errorMessage = 'Failed to create article. Please try again.';
        if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error && err.error.title) {
          errorMessage = err.error.title;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        this.error = errorMessage;
        this.isCreatingArticle = false;
      }
    });
  }

  onUpdateArticle(articleData: { id: number; title: string; text: string }): void {
    this.isUpdatingArticle = true;
    this.error = null;
    
    console.log('Updating article with data:', articleData);
    
    this.articleService.updateArticle(articleData.id, {
      title: articleData.title,
      text: articleData.text
    }).subscribe({
      next: (updatedArticle) => {
        console.log('Article updated successfully:', updatedArticle);
        // Update the article in the list
        const index = this.articles.findIndex(a => a.id === updatedArticle.id);
        if (index !== -1) {
          this.articles[index] = updatedArticle;
          this.applySearchFilter(); // Update filtered list
        }
        this.isUpdatingArticle = false;
        this.closeCreateDialog();
      },
      error: (err) => {
        console.error('Error updating article:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error body:', err.error);
        
        let errorMessage = 'Failed to update article. Please try again.';
        if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error && err.error.title) {
          errorMessage = err.error.title;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        this.error = errorMessage;
        this.isUpdatingArticle = false;
      }
    });
  }

  onSearch(): void {
    this.applySearchFilter();
  }

  onSearchInputChange(): void {
    // Real-time search as user types
    this.applySearchFilter();
  }

  applySearchFilter(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      // If search is empty, show all articles
      this.filteredArticles = [...this.articles];
    } else {
      // Filter articles by title or text (case-insensitive)
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredArticles = this.articles.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.text.toLowerCase().includes(query)
      );
    }
  }

  deleteArticle(article: Article): void {
    this.articleToDelete = article;
    this.showDeleteDialog = true;
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.articleToDelete = null;
    this.isDeletingArticle = false;
  }

  confirmDelete(): void {
    if (!this.articleToDelete) {
      return;
    }

    this.isDeletingArticle = true;
    console.log('Deleting article with ID:', this.articleToDelete.id);
    
    this.articleService.deleteArticle(this.articleToDelete.id).subscribe({
      next: () => {
        console.log('Article deleted successfully');
        // Remove article from the list
        this.articles = this.articles.filter(a => a.id !== this.articleToDelete!.id);
        this.applySearchFilter(); // Update filtered list
        this.isDeletingArticle = false;
        this.closeDeleteDialog();
      },
      error: (err) => {
        console.error('Error deleting article:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error body:', err.error);
        
        let errorMessage = 'Failed to delete article. Please try again.';
        if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        this.error = errorMessage;
        this.isDeletingArticle = false;
      }
    });
  }

  getCurrentLocation(): void {
    // TODO: Implement geolocation functionality
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location:', position.coords.latitude, position.coords.longitude);
          // TODO: Use location to search
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }
}
