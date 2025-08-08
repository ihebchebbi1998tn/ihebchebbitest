// Smart Product Search (Option A)
// Usage: smartSearch(products, query, { strict: true|false })
// Returns filtered & optionally sorted list based on NLP-ish rules.


// Normalize string for matching
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();


// Fuzzy match helper (Levenshtein distance)
function fuzzyMatch(a, b, maxDist = 2) {
  if (!a || !b) return false;
  a = norm(a); b = norm(b);
  if (a === b) return true;
  const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length] <= maxDist;
}

// Semantic similarity stub (for future ML/API integration)
function semanticSimilarity(a, b) {
  // For now, fallback to fuzzyMatch, but can be replaced with OpenAI or ML API
  return fuzzyMatch(a, b, 3);
}


// Expanded synonyms and plural/singular support
const synonyms = {
  "men": "men's clothing",
  "male": "men's clothing",
  "man": "men's clothing",
  "women": "women's clothing",
  "female": "women's clothing",
  "woman": "women's clothing",
  "jewelry": "jewelery",
  "jewelery": "jewelery",
  "earring": "jewelery",
  "earrings": "jewelery",
  "necklace": "jewelery",
  "bracelet": "jewelery",
  "ring": "jewelery",
  "rings": "jewelery",
  "phone": "electronics",
  "phones": "electronics",
  "smartphone": "electronics",
  "headphone": "electronics",
  "headphones": "electronics",
  "earbud": "electronics",
  "earbuds": "electronics",
  "dress": "women's clothing",
  "dresses": "women's clothing",
  "tshirt": "men's clothing",
  "t-shirt": "men's clothing",
  "shirt": "men's clothing",
  "shirts": "men's clothing",
  "shoe": "men's clothing",
  "shoes": "men's clothing",
};

export default function smartSearch(products, q, opts = { strict: true }) {
  if (!q || q.trim() === "") return products;
  const text = q.toLowerCase();


  let minPrice = null;
  let maxPrice = null;
  let minRating = null;
  let keywords = [];
  let categoryMatches = [];
  // Removed unused sortKey and sortDir

  // Price between A and B
  const between = text.match(/between\s*\$?(\d+(?:\.\d+)?)\s*(?:and|-|to)\s*\$?(\d+(?:\.\d+)?)/);
  if (between) {
    minPrice = parseFloat(between[1]);
    maxPrice = parseFloat(between[2]);
  }

  // under/below/less than
  const under = text.match(/(under|below|less than)\s*\$?(\d+(?:\.\d+)?)/);
  if (under) {
    maxPrice = parseFloat(under[2]);
  }

  // over/above/greater than
  const over = text.match(/(over|above|greater than)\s*\$?(\d+(?:\.\d+)?)/);
  if (over) {
    minPrice = parseFloat(over[2]);
  }

  // explicit star/rating thresholds
  const starDirect = text.match(/(\d(?:\.\d)?)\s*\+?\s*stars?/);
  if (starDirect) {
    minRating = parseFloat(starDirect[1]);
  }
  const atLeast = text.match(/(at least|minimum|min|>=)\s*(\d(?:\.\d)?)/);
  if (atLeast) {
    minRating = parseFloat(atLeast[2]);
  }

  // good reviews keywords
  if (/(good reviews|high rating|4\+ stars|great reviews|well reviewed)/.test(text)) {
    minRating = Math.max(4, minRating ?? 0);
  }

  // Sorting intents (handled by score-based sorting below)

  // Category detection + fuzzy/synonym support
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const textNorm = norm(text);
  for (const c of categories) {
    if (textNorm.includes(norm(c))) {
      categoryMatches.push(c);
      continue;
    }
    // Fuzzy match for category
    if (fuzzyMatch(textNorm, norm(c))) {
      categoryMatches.push(c);
      continue;
    }
  }
  for (const key in synonyms) {
    if (textNorm.includes(key) || fuzzyMatch(textNorm, key)) {
      categoryMatches.push(synonyms[key]);
    }
  }
  // Remove duplicates
  categoryMatches = Array.from(new Set(categoryMatches));

  // Keywords: remaining words minus common stopwords
  const stop = new Set(["show", "me", "with", "and", "or", "the", "a", "an", "under", "over", "below", "above", "less", "than", "greater", "between", "to", "for", "good", "reviews", "rating", "stars", "$", "usd", "cheapest", "expensive", "lowest", "highest", "price", "top", "best", "rated", "ascending", "descending", "low", "high", "at", "least", ">=", "minimum", "min"]);
  keywords = text
    .replace(/\$?\d+(?:\.\d+)?/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w && !stop.has(w));

  const requireAllKeywords = opts?.strict !== false;



  let matches = products.map((p) => {
    // Price
    const price = Number(p.price);
    if (minPrice !== null && price < minPrice) return null;
    if (maxPrice !== null && price > maxPrice) return null;

    // Rating
    const rating = typeof p.rating === "number" ? p.rating : 0;
    if (minRating !== null && rating < minRating) return null;

    // Category (support multi-category)
    if (categoryMatches.length > 0 && !categoryMatches.includes(p.category)) return null;

    // Advanced keyword matching: fuzzy, plural/singular, typo tolerance, semantic
    const hay = `${p.title} ${p.description}`.toLowerCase();
    let keywordScore = 0;
    if (keywords.length > 0) {
      for (const k of keywords) {
        if (hay.includes(k)) keywordScore += 2;
        else if (fuzzyMatch(hay, k)) keywordScore += 1;
        else if (semanticSimilarity(hay, k)) keywordScore += 1;
      }
      if (requireAllKeywords && keywordScore < keywords.length) return null;
      if (!requireAllKeywords && keywordScore === 0) return null;
    }

    // Context boosting: boost score for high rating, price match, keyword match
    let score = 0;
    score += rating * 2;
    score += keywordScore;
    if (minPrice !== null && price >= minPrice) score += 1;
    if (maxPrice !== null && price <= maxPrice) score += 1;
    if (categoryMatches.length > 0) score += 2;

    return { ...p, _score: score };
  }).filter(Boolean);



  // Sorting: always sort by score, then by rating, then by price
  matches = matches.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
    return Number(a.price) - Number(b.price);
  });


  // If no matches, try relaxed fuzzy/semantic search (if strict)
  if (matches.length === 0 && opts?.strict) {
    matches = products.map((p) => {
      const hay = `${p.title} ${p.description}`.toLowerCase();
      if (fuzzyMatch(hay, textNorm, 3) || semanticSimilarity(hay, textNorm)) {
        return { ...p, _score: (p.rating || 0) * 2 };
      }
      return null;
    }).filter(Boolean);
    matches = matches.sort((a, b) => (b._score || 0) - (a._score || 0));
  }

  // Remove _score before returning
  return matches.map(({ _score, ...rest }) => rest);
}
