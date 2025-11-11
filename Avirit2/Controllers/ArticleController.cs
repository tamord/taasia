using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading;
using System.Text.Json;
using System.IO;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Avirit2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private static readonly List<Article> Articles = new();
        private static readonly object ArticlesLock = new();
        private static int _nextArticleId;
        private static readonly string ArticlesFilePath = Path.Combine(
            AppContext.BaseDirectory, 
            "Data", 
            "articles.json");

        static ArticleController()
        {
            // Ensure Data directory exists
            var dataDirectory = Path.GetDirectoryName(ArticlesFilePath);
            if (!string.IsNullOrEmpty(dataDirectory) && !Directory.Exists(dataDirectory))
            {
                Directory.CreateDirectory(dataDirectory);
            }

            // Always try to load articles from file first
            LoadArticlesFromFile();

            // If no articles were loaded (file doesn't exist or is empty), initialize with dummy articles
            if (!Articles.Any())
            {
                InitializeDefaultArticles();
                SaveArticlesToFile();
            }
        }

        private static void InitializeDefaultArticles()
        {
            Articles.Clear();
            
            // Initialize with dummy articles
            Articles.Add(new Article
            {
                Id = 1,
                Title = "Getting Started with ASP.NET Core",
                Text = "ASP.NET Core is a cross-platform, high-performance, open-source framework for building modern, cloud-based, internet-connected applications. This article covers the basics of getting started with ASP.NET Core and building your first web API."
            });

            Articles.Add(new Article
            {
                Id = 2,
                Title = "Understanding RESTful APIs",
                Text = "REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP methods like GET, POST, PUT, and DELETE to perform operations on resources. This article explains the core concepts and best practices."
            });

            Articles.Add(new Article
            {
                Id = 3,
                Title = "Introduction to Angular Framework",
                Text = "Angular is a platform and framework for building single-page client applications using HTML and TypeScript. Angular is written in TypeScript and implements core and optional functionality as a set of TypeScript libraries that you import into your applications."
            });

            Articles.Add(new Article
            {
                Id = 4,
                Title = "Best Practices for Web Development",
                Text = "Modern web development requires following best practices to ensure code quality, maintainability, and performance. This includes proper error handling, code organization, security considerations, and testing strategies."
            });

            Articles.Add(new Article
            {
                Id = 5,
                Title = "Building Full-Stack Applications",
                Text = "Full-stack development involves working with both frontend and backend technologies. This article explores how to integrate Angular frontend applications with ASP.NET Core Web API backends, including CORS configuration and API communication patterns."
            });

            _nextArticleId = 5; // Set the next ID to continue from 5
        }

        private static void LoadArticlesFromFile()
        {
            try
            {
                if (System.IO.File.Exists(ArticlesFilePath))
                {
                    var json = System.IO.File.ReadAllText(ArticlesFilePath);
                    
                    if (!string.IsNullOrWhiteSpace(json))
                    {
                        // First try with case-insensitive (to handle both PascalCase and camelCase)
                        var options = new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        };
                        
                        var loadedArticles = JsonSerializer.Deserialize<List<Article>>(json, options);
                        
                        if (loadedArticles != null && loadedArticles.Any())
                        {
                            lock (ArticlesLock)
                            {
                                Articles.Clear();
                                Articles.AddRange(loadedArticles);
                                _nextArticleId = Articles.Max(a => a.Id);
                            }
                            
                            System.Diagnostics.Debug.WriteLine($"Successfully loaded {Articles.Count} articles from {ArticlesFilePath}");
                            
                            // Re-save in camelCase format for consistency
                            SaveArticlesToFile();
                        }
                    }
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine($"Articles file not found at {ArticlesFilePath}. Will initialize with default articles.");
                }
            }
            catch (Exception ex)
            {
                // Log error - will fall back to default articles
                System.Diagnostics.Debug.WriteLine($"Error loading articles from file {ArticlesFilePath}: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }

        private static void SaveArticlesToFile()
        {
            try
            {
                lock (ArticlesLock)
                {
                    var options = new JsonSerializerOptions
                    {
                        WriteIndented = true,
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                    };
                    
                    var json = JsonSerializer.Serialize(Articles, options);
                    System.IO.File.WriteAllText(ArticlesFilePath, json);
                }
            }
            catch (Exception ex)
            {
                // Log error or handle it appropriately
                System.Diagnostics.Debug.WriteLine($"Error saving articles to file: {ex.Message}");
            }
        }

        // GET: api/<ArticleController>
        [HttpGet]
        public ActionResult<IEnumerable<Article>> GetArticles()
        {
            lock (ArticlesLock)
            {
                // Sort by ID descending (newest first)
                return Ok(Articles.OrderByDescending(a => a.Id).ToList());
            }
        }

        // GET api/<ArticleController>/5
        [HttpGet("{id}")]
        public ActionResult<Article> GetArticleById(int id)
        {
            lock (ArticlesLock)
            {
                var article = Articles.FirstOrDefault(a => a.Id == id);
                if (article == null)
                {
                    return NotFound();
                }

                return Ok(article);
            }
        }

        // PUT api/<ArticleController>/articles/{id}
        [HttpPut("articles/{id}")]
        public ActionResult<Article> UpdateArticle(int id, [FromBody] ArticleRequest request)
        {
            if (request == null)
            {
                return BadRequest("Article payload is required.");
            }

            if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Text))
            {
                return BadRequest("Title and text are required.");
            }

            lock (ArticlesLock)
            {
                var article = Articles.FirstOrDefault(a => a.Id == id);
                if (article == null)
                {
                    return NotFound($"Article with ID {id} not found.");
                }

                article.Title = request.Title;
                article.Text = request.Text;
                
                SaveArticlesToFile(); // Save to file after updating article
                
                return Ok(article);
            }
        }

        // DELETE api/<ArticleController>/articles/{id}
        [HttpDelete("articles/{id}")]
        public ActionResult DeleteArticle(int id)
        {
            lock (ArticlesLock)
            {
                var article = Articles.FirstOrDefault(a => a.Id == id);
                if (article == null)
                {
                    return NotFound($"Article with ID {id} not found.");
                }

                Articles.Remove(article);
                SaveArticlesToFile(); // Save to file after deleting article
                
                return NoContent();
            }
        }

        // POST api/<ArticleController>/articles
        [HttpPost("articles")]
        public ActionResult<Article> CreateArticle([FromBody] ArticleRequest request)
        {
            if (request == null)
            {
                return BadRequest("Article payload is required.");
            }

            if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Text))
            {
                return BadRequest("Title and text are required.");
            }

            var article = new Article
            {
                Id = Interlocked.Increment(ref _nextArticleId),
                Title = request.Title,
                Text = request.Text
            };

            lock (ArticlesLock)
            {
                Articles.Add(article);
                SaveArticlesToFile(); // Save to file after adding new article
            }

            // Return the created article with 201 status
            return CreatedAtAction(nameof(GetArticleById), new { id = article.Id }, article);
        }

        public class Article
        {
            public int Id { get; set; }
            public string Title { get; set; } = string.Empty;
            public string Text { get; set; } = string.Empty;
        }

        public class ArticleRequest
        {
            public string? Title { get; set; }
            public string? Text { get; set; }
        }
    }
}
