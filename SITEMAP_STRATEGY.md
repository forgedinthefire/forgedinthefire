# Sitemap Strategy & SEO Guide
## Forged in the Fire - forgedinthefireohio.org

---

## 📊 Current Sitemap Overview

**Total URLs:** 16 pages  
**Sitemap URL:** `https://forgedinthefireohio.org/sitemap.xml`  
**Last Updated:** May 13, 2025  
**Next Recommended Review:** Quarterly (or after major content updates)

---

## 🎯 Sitemap Hierarchy & Priorities

### Tier 1: Core Mission Pages (Priority 1.0)
These are the most important pages for both users and SEO.

| URL | Priority | Change Freq | Purpose |
|-----|----------|-------------|---------|
| `/` | 1.0 | weekly | Homepage - Primary entry point |
| `/get-help` | 1.0 | weekly | Crisis support - Most important for survivors |

**Why Priority 1.0?**
- Homepage: Main entry point, most linked-to page
- Get Help: Mission-critical for people seeking immediate assistance
- Both should be crawled frequently as they may contain urgent updates

---

### Tier 2: Service Hub (Priority 0.9)

| URL | Priority | Change Freq | Purpose |
|-----|----------|-------------|---------|
| `/services` | 0.9 | monthly | Services overview - Gateway to all programs |

**Why Priority 0.9?**
- Main services listing is key for "human trafficking survivor services" keywords
- Links to all individual service pages (critical internal linking hub)

---

### Tier 3: Individual Service Pages (Priority 0.8)

| URL | Priority | Change Freq | Purpose |
|-----|----------|-------------|---------|
| `/services/victim-advocacy` | 0.8 | monthly | Core service - most searched |
| `/services/workforce-development` | 0.8 | monthly | Employment support |
| `/services/mentorship` | 0.8 | monthly | Peer support program |
| `/services/community-education` | 0.8 | monthly | Prevention/education |
| `/services/accountability` | 0.8 | monthly | Court support program |

**Why Priority 0.8?**
- Individual service pages target specific long-tail keywords
- Important for local SEO ("victim advocacy Cleveland Ohio")
- Content updates less frequent than core pages

---

### Tier 4: Content & Engagement Pages (Priority 0.8)

| URL | Priority | Change Freq | Purpose |
|-----|----------|-------------|---------|
| `/about` | 0.8 | monthly | Organization info, founder bio |
| `/resources` | 0.8 | monthly | Educational content, downloads |
| `/donate` | 0.8 | weekly | Fundraising (updates frequently) |

**Why These Priorities?**
- About: Important for E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
- Resources: Educational content attracts organic traffic
- Donate: Frequent updates (campaigns, events, testimonials)

---

### Tier 5: Support Pages (Priority 0.7)

| URL | Priority | Change Freq | Purpose |
|-----|----------|-------------|---------|
| `/volunteer` | 0.7 | weekly | Volunteer recruitment |
| `/contact` | 0.7 | monthly | General contact form |

**Why Lower Priority?**
- Volunteer: Updates frequently but less critical than Get Help
- Contact: Static page, rarely changes

---

### Tier 6: Legal/Policy Pages (Priority 0.3)

| URL | Priority | Change Freq | Purpose |
|-----|----------|-------------|---------|
| `/privacy` | 0.3 | yearly | Privacy policy |
| `/terms` | 0.3 | yearly | Terms of use |
| `/accessibility` | 0.3 | yearly | Accessibility statement |

**Why Lowest Priority?**
- Legal pages rarely change
- Important for compliance but not for SEO rankings
- Google understands these are utility pages

---

## 🖼️ Image Sitemap Strategy

**Pages with Image Extensions:**

### Homepage (`/`)
- `/forged-logo.png` - Organization logo
- `/opengraph-image.jpeg` - Social sharing image

### About Page (`/about`)
- `/Founder-headshot.png` - Tracy Springford photo

**Why Include Images in Sitemap?**
- Helps Google discover and index important images
- Can appear in Google Images search results
- Improves visibility for brand-related image searches
- Supports local SEO (images show in local pack results)

---

## 📋 Google Sitemap Best Practices Applied

### ✅ URL Coverage
- **All important pages included:** 16 total URLs
- **Excluded pages:**
  - Error pages (`/error`, `404`)
  - API routes (`/api/*`)
  - Client component wrappers (`*-content.tsx` - these render the same content as server components)
  - Duplicate content pages

### ✅ Priority Values
- Uses standard 0.0-1.0 scale
- Only homepage and Get Help have 1.0 (true priority pages)
- Services tiered appropriately (0.9 overview, 0.8 individual)
- Legal pages correctly at 0.3

**Google's Stance:** Google says they "generally ignore" priority values, but they can help with internal site organization and some search engines still use them.

### ✅ Change Frequency
- `weekly`: Dynamic pages (homepage, get-help, donate, volunteer)
- `monthly`: Content pages (services, about, resources, contact)
- `yearly`: Legal pages (privacy, terms, accessibility)

**Google's Stance:** Google mostly ignores `changefreq` now and uses their own crawl scheduling based on:
- Page importance
- Update frequency (detected from actual changes)
- Site speed and server capacity

### ✅ Last Modified Dates
- Using static date: `2025-05-13`
- Update this date in `sitemap.ts` whenever significant content changes are made
- **Why static?** Using `new Date()` changes every build, which can confuse Google about what's actually new

**Google's Recommendation:** Only update lastmod when content actually changes. Don't change it just because you rebuilt the site.

### ✅ Canonical URLs
- All URLs use `https://forgedinthefireohio.org`
- No trailing slashes (consistent with Next.js App Router)
- All lowercase
- No parameters or session IDs

---

## 🚀 How to Submit to Google

### Step 1: Verify Site Ownership
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `forgedinthefireohio.org`
3. Verify ownership via:
   - DNS record (recommended for nonprofits)
   - HTML file upload
   - HTML tag in head
   - Google Analytics
   - Google Tag Manager

### Step 2: Submit Sitemap
1. In Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `sitemap.xml`
3. Click **Submit**

### Step 3: Monitor
1. Check **Coverage** report for indexing status
2. Check **Sitemaps** report for errors
3. Look for "Sitemap could not be read" or "URL not allowed" errors

---

## 📈 Sitemap Performance Metrics to Track

### In Google Search Console:

| Metric | What It Means | Target |
|--------|---------------|--------|
| **Submitted URLs** | Total in sitemap | 16 |
| **Indexed URLs** | Successfully indexed | 16 (100%) |
| **Excluded URLs** | Not indexed (blocked, error, etc.) | 0 |
| **Discovered - Currently Not Indexed** | Google knows about them but hasn't crawled | Should decrease over time |

### In Google Analytics 4:

| Metric | What to Look For |
|--------|------------------|
| **Organic Traffic by Landing Page** | Which sitemap pages get the most SEO traffic |
| **Bounce Rate** | High bounce rate may indicate content/expectation mismatch |
| **Avg. Session Duration** | Longer = content is engaging |

---

## 🔄 Sitemap Maintenance Schedule

### Monthly
- [ ] Check Google Search Console for sitemap errors
- [ ] Review Coverage report for indexing issues
- [ ] Check if new pages need to be added

### Quarterly
- [ ] Review priority values (are they still accurate?)
- [ ] Update lastmod dates for pages with content changes
- [ ] Audit for orphaned pages (pages not in sitemap or navigation)

### Annually
- [ ] Comprehensive sitemap audit
- [ ] Review URL structure for SEO best practices
- [ ] Consider adding new page types (blog, events, testimonials)

### After Major Changes
- [ ] Add new pages to sitemap immediately
- [ ] Update lastmod dates
- [ ] Resubmit sitemap to Google
- [ ] Request indexing for critical new pages

---

## ⚠️ Common Sitemap Issues & Solutions

### Issue: "Sitemap could not be read"
**Solution:** 
- Check sitemap.xml is accessible (no 404)
- Verify no syntax errors
- Ensure proper XML formatting
- Check file size < 50MB

### Issue: "URL not allowed"
**Solution:**
- URL is blocked by robots.txt
- URL redirects to different domain
- URL returns error status (4xx, 5xx)

### Issue: "Discovered - Currently Not Indexed"
**Solution:**
- Normal for new sites (Google prioritizes crawling)
- Ensure internal links point to the page
- Check page has unique, valuable content
- Verify no technical issues (canonical, noindex)

### Issue: Duplicate content in sitemap
**Solution:**
- Remove duplicate URLs
- Use canonical tags to indicate preferred version
- Redirect duplicates to canonical version

---

## 🎯 Advanced Sitemap Strategies (Future)

### 1. Image Sitemap (Separate File)
If you have many important images:
```
https://forgedinthefireohio.org/sitemap-images.xml
```
Benefits: Better image indexing, Google Images visibility

### 2. News Sitemap (If Applicable)
If you have a blog/news section:
```
https://forgedinthefireohio.org/sitemap-news.xml
```
Benefits: Faster indexing for time-sensitive content

### 3. Sitemap Index (If > 50,000 URLs)
Currently not needed (only 16 URLs), but for future growth:
```xml
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://forgedinthefireohio.org/sitemap-pages.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://forgedinthefireohio.org/sitemap-images.xml</loc>
  </sitemap>
</sitemapindex>
```

---

## 📚 Resources

- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Next.js Sitemap Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google Search Console Help](https://support.google.com/webmasters/topic/9455938)

---

**Document Created:** May 13, 2025  
**Last Updated:** May 13, 2025  
**Next Review:** August 13, 2025 (Quarterly)

