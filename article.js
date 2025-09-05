// Article page functionality
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  
  if (!articleId) {
    document.getElementById('article').innerHTML = '<h1>Article not found</h1>';
    return;
  }

  // Load articles and find the one with matching ID
  fetch('data/articles.json')
    .then(response => response.json())
    .then(articles => {
      const article = articles.find(a => a.id === articleId);
      
      if (!article) {
        document.getElementById('article').innerHTML = '<h1>Article not found</h1>';
        return;
      }
      
      renderArticle(article);
      loadAds();
    })
    .catch(error => {
      console.error('Error loading article:', error);
      document.getElementById('article').innerHTML = '<h1>Error loading article</h1>';
    });

  function renderArticle(article) {
    const articleElement = document.getElementById('article');
    
    // Update page title
    document.title = `${article.title} — Hybiz TV`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', article.summary || 'Hybiz TV article');
    }
    
    // Render article content
    articleElement.innerHTML = `
      <div class="article-header">
        <div class="article-meta">
          <span class="tag">${escapeHtml(article.category)}</span>
          <span class="date">${formatDate(article.date)}</span>
          <span class="author">By ${escapeHtml(article.author || 'Hybiz Desk')}</span>
        </div>
        <h1 class="article-title">${escapeHtml(article.title)}</h1>
        <p class="article-summary">${escapeHtml(article.summary || '')}</p>
      </div>
      
      ${article.images && article.images.length > 0 ? `
        <div class="article-gallery">
          ${article.images.map(img => `
            <img src="images/${img}" alt="${escapeHtml(article.title)}" class="article-image">
          `).join('')}
        </div>
      ` : ''}
      
      <div class="article-content">
        ${article.content}
      </div>
      
      <div class="share-buttons">
        <h3>Share this article:</h3>
        <div class="share-links">
          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn twitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter
          </a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </a>
          <a href="https://wa.me/?text=${encodeURIComponent(article.title + ' ' + window.location.href)}" target="_blank" class="share-btn whatsapp">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    `;
  }

  function loadAds() {
    fetch('data/ads.json')
      .then(response => response.json())
      .then(ads => {
        placeAds(ads);
      })
      .catch(error => {
        console.error('Error loading ads:', error);
      });
  }

  function placeAds(ads) {
    if (!Array.isArray(ads)) return;
    
    document.querySelectorAll('[data-ad-position]').forEach(slot => {
      const pos = slot.getAttribute('data-ad-position');
      const ad = ads.find(x => x.position === pos);
      
      if (ad) {
        const link = document.createElement('a');
        link.href = ad.link || '#';
        link.target = '_blank';
        link.rel = 'noopener';
        
        const img = document.createElement('img');
        img.src = ad.image;
        img.alt = 'Advertisement';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        
        link.appendChild(img);
        slot.innerHTML = '';
        slot.appendChild(link);
      }
    });
  }

  function formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Set current year
  document.getElementById('year').textContent = new Date().getFullYear();
})();