Hybiz TV (Static)

A fast, mobile‑first static media site using plain HTML, CSS, and JavaScript. Content and ads live in JSON files so you can safely update without touching code.

Features
- Mobile‑first layout; responsive hero row and cards
- Homepage shows articles sorted newest first
- Hero: first two articles; below are remaining cards
- Right sidebar lists all headlines (latest first)
- Sticky category bar + search by title
- Article page: title, author, date, category tag, summary, full content
- Responsive image gallery
- Social share buttons
- Simple ad slots from `data/ads.json` (header, sidebar, footer, corner-left, corner-right)

Project Structure
```
hybiz_tv/
  index.html
  article.html
  style.css
  app.js
  article.js
  data/
    articles.json
    ads.json
  images/
  assets/sample/ads/
  README.md
```

Content format (data/articles.json)
```
{
  "id": "unique-id-or-number",
  "title": "Article Title",
  "summary": "Short intro",
  "category": "business",
  "author": "Hybiz Desk",
  "date": "2025-09-04T08:00:00.000Z",
  "images": ["img1.jpg", "img2.jpg"],
  "content": "Full article body text..."
}
```
Notes
- Use ISO date strings; the site auto‑sorts newest first.
- You may also use the key `date time`; code normalizes it.
- Image filenames must exist inside `images/`.

Ads format (data/ads.json)
```
{
  "position": "sidebar",
  "image": "assets/sample/ads/sidebar-300x250.jpg",
  "link": "https://advertiser-site.com"
}
```
Supported positions: header, sidebar, footer, corner-left, corner-right.

Run
- Open `index.html` directly, or serve the folder with any static server.
- Add/replace images in `images/` and update `data/articles.json` accordingly.

Editing tips
- Categories are free-form; new ones automatically appear in the bar.
- Corner ads are fixed on desktop and hidden on small screens.
- No frameworks, no build step.


