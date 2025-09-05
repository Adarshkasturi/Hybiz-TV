/* Light, fast homepage script: loads JSON, sorts, filters, renders */
(function(){
  const state = { articles: [], filtered: [], categories: new Set(), activeCategory: 'all', query: '' };

  const els = {
    categoryBar: document.getElementById('categoryBar'),
    searchInput: document.getElementById('searchInput'),
    searchForm: document.getElementById('searchForm'),
    hero: document.getElementById('hero'),
    list: document.getElementById('articlesList'),
    latest: document.getElementById('latestList')
  };

  document.getElementById('year').textContent = new Date().getFullYear();

  Promise.all([
    fetch('data/articles.json').then(r=>r.json()),
    fetch('data/ads.json').then(r=>r.json()).catch(()=>[])
  ]).then(([articles, ads])=>{
    state.articles = normalizeAndSort(articles);
    state.filtered = state.articles;
    state.categories = new Set(['all', ...state.articles.map(a=>a.category)]);
    renderCategoryBar();
    renderAll();
    placeAds(ads);
  }).catch(err=>{
    console.error(err);
  });

  function normalizeAndSort(items){
    return items.map(a=>({
      ...a,
      date: a.date || a["date time"] || new Date().toISOString(),
      images: Array.isArray(a.images)? a.images : (a.image?[a.image]:[]),
    })).sort((a,b)=> new Date(b.date) - new Date(a.date));
  }

  function renderAll(){
    const two = state.filtered.slice(0,2);
    const rest = state.filtered.slice(2);
    renderHero(two);
    renderCards(rest);
    renderLatest(state.filtered);
  }

  function renderCategoryBar(){
    els.categoryBar.innerHTML = '';
    state.categories.forEach(cat=>{
      const btn = document.createElement('button');
      btn.textContent = cat[0].toUpperCase()+cat.slice(1);
      btn.className = cat===state.activeCategory? 'active' : '';
      btn.addEventListener('click',()=>{
        state.activeCategory = cat;
        applyFilters();
      });
      els.categoryBar.appendChild(btn);
    });
    if (els.searchInput) {
      els.searchInput.addEventListener('input', e=>{ state.query = e.target.value.trim().toLowerCase(); applyFilters(); });
    }
    if (els.searchForm) {
      els.searchForm.addEventListener('submit', e=>{ e.preventDefault(); applyFilters(); });
    }
  }

  function applyFilters(){
    let data = [...state.articles];
    if(state.activeCategory !== 'all') data = data.filter(a=>a.category===state.activeCategory);
    if(state.query) data = data.filter(a=> a.title.toLowerCase().includes(state.query));
    state.filtered = data;
    renderAll();
    // update active button state
    [...els.categoryBar.children].forEach(ch=>{
      ch.classList.toggle('active', ch.textContent.toLowerCase()===state.activeCategory);
    });
  }

  function renderHero(items){
    els.hero.innerHTML = '';
    if(items.length===0) return;
    const [lead, side] = [items[0], items[1]];
    els.hero.appendChild(createCard(lead,'lead'));
    if(side) els.hero.appendChild(createCard(side,'side'));
  }

  function renderCards(items){
    els.list.innerHTML = '';
    items.forEach(a=> els.list.appendChild(createCard(a,'small')));
  }

  function createCard(a,variant){
    const card = document.createElement('article');
    card.className = 'card ' + (variant||'');
    const firstImg = a.images && a.images[0]? 'images/'+a.images[0] : '';
    card.innerHTML = `
      <a href="article.html?id=${encodeURIComponent(a.id)}">
        ${firstImg? `<img class="image" src="${firstImg}" alt="${escapeHtml(a.title)}">` : ''}
        <div class="body">
          <div class="meta"><span class="tag">${escapeHtml(a.category)}</span><span>${formatDate(a.date)}</span></div>
          <h3 class="title">${escapeHtml(a.title)}</h3>
          <p>${escapeHtml(a.summary||'')}</p>
        </div>
      </a>`;
    return card;
  }

  function renderLatest(items){
    els.latest.innerHTML = '';
    items.forEach(a=>{
      const li = document.createElement('li');
      li.innerHTML = `<a href="article.html?id=${encodeURIComponent(a.id)}">${escapeHtml(a.title)}</a>`;
      els.latest.appendChild(li);
    });
  }

  function placeAds(ads){
    if(!Array.isArray(ads)) return;
    document.querySelectorAll('[data-ad-position]').forEach(slot=>{
      const pos = slot.getAttribute('data-ad-position');
      const ad = ads.find(x=>x.position===pos);
      if(ad){
        const link = document.createElement('a');
        link.href = ad.link || '#';
        link.target = '_blank';
        const img = document.createElement('img');
        img.src = ad.image;
        img.alt = 'Advertisement';
        link.appendChild(img);
        slot.innerHTML='';
        slot.appendChild(link);
        // For corner anchors (are already <a>)
        if(slot.classList.contains('ad-corner')){
          slot.setAttribute('href', ad.link || '#');
          slot.innerHTML='';
          slot.appendChild(img.cloneNode(true));
        }
      }
    });
  }

  function formatDate(d){
    try{ return new Date(d).toLocaleString(); }catch(e){ return d; }
  }
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  const dateElem = document.getElementById('currentDate');
  if (dateElem) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElem.textContent = now.toLocaleDateString('en-US', options);
  }
});


