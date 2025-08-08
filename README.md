
# Welcome to the E-commerce Catalog!

Hey there! 👋 This is a small demo project for a product catalog, featuring a cool AI-powered search to help you find what you want, faster and smarter.


## 🚀 Getting Started

To run the app locally:
1. Open your terminal in this folder.
2. Run:
	```bash
	npm install
	npm start
	```
3. Head to [http://localhost:3000](http://localhost:3000) in your browser.
4. Check out `/product` for the catalog and smart search features!

*Note: The catalog uses a static JSON dataset. You don't need the Express API for this demo, but `npm start` will launch it anyway.*



## 🧠 AI Feature: Smart Product Search

Our search bar goes way beyond basic filters—it's designed to understand what you really want, just like a helpful shop assistant! Try typing things like:
- "Show me running shoes under $100 with good reviews"
- "between $50 and $120 electronics"
- "top rated jewelry under 200"
- "cheapest men's clothing"



### 🚀 Improvements & Features

#### Smart Product Search (NLP)
- Advanced natural language understanding: supports price, rating, category, and keyword queries
- Fuzzy matching, typo tolerance, plural/singular, and synonym support
- Semantic similarity scoring for smarter results (can be extended to use OpenAI or other APIs)
- Context boosting: results are ranked by relevance and rating
- Live dropdown menu: as you type, top-rated results appear instantly for quick selection
- Auto-filtering: product grid updates live as you type
- Graceful fallback: if no perfect match, closest results are shown
- Modular design: logic is separated for easy maintenance and future upgrades


#### Dynamic Pricing Engine & Stock Verification
- Rule-based price adjustments based on demand, ratings, category, and time
- Simulated demand spikes and safety rails for realistic pricing
- Dynamic price badges show discounts or surcharges in real time
- Easily extendable for machine learning or external data sources
- Pricing logic is modular and can be swapped for more advanced ML or external APIs
- All price changes are capped to prevent extreme values, ensuring a fair user experience
- **Stock verification:** Each product now includes a `stock` property. If stock is zero, the product card automatically shows "Out of Stock" and disables the Add to Cart button, ensuring users can't purchase unavailable items.

#### Product Card & UI Features
- Responsive product cards display image, name, price (with dynamic pricing), rating, and variant options
- "Add to Cart" button is disabled or replaced with "Out of Stock" if the product is unavailable
- Modern, clean layout with Bootstrap for best UI/UX practices
- Live dropdown search results appear directly below the search input, sorted by rating
- Product grid auto-filters as you type for instant feedback

---

### 🪙 Bonus: Blockchain Integration (Optional)
This AI-powered catalog could be integrated with blockchain features by using token-gated pricing (special prices for users holding certain tokens), storing user preferences or purchase history on-chain for privacy and portability, and enabling loyalty programs via smart contracts that reward users with discounts or perks based on their on-chain activity. This would make pricing and personalization transparent, secure, and user-owned. Additionally, dynamic pricing rules could be published on-chain for auditability, and product recommendations could be personalized based on verified, decentralized user data.

---

### 🪙 Bonus: Blockchain Integration (Optional)
This AI-powered catalog could be integrated with blockchain features by using token-gated pricing (special prices for users holding certain tokens), storing user preferences or purchase history on-chain for privacy and portability, and enabling loyalty programs via smart contracts that reward users with discounts or perks based on their on-chain activity. This would make pricing and personalization transparent, secure, and user-owned.

**Why is the AI logic separated in `products.ts`?**
To keep the codebase clean and easy to maintain, all the smart search logic lives in its own file (`products.ts`). This separation means:
- The UI stays simple and focused on displaying products
- The search logic can be improved or reused without touching the UI code
- It's easier to test, debug, and extend the AI features in the future

This approach helps keep everything organized, so you (or anyone else) can quickly find and update the search functionality without wading through unrelated code.


## 💸 Bonus: Dynamic Pricing Engine

There's also a rule-based engine that tweaks product prices based on simulated demand:
- Category demand: electronics (+6%), women's (+3%), men's (+2%), jewelry (+1%)
- Ratings: 4.7+ (+5%), 4.3–4.69 (+3%), 4.0–4.29 (+1%)
- Time-based: weekends (+4%), weekdays 14:00–16:00 (−5%)
- Random demand spikes: small changes every hour/product
- Safety rails: prices never go below −15% or above +20%

**To see it in action:**
- Go to `/product` and check the product cards. You'll see either a single price or a dynamic price (with the original price struck through and a badge like “12% off” or “+6%”).
- Try changing your system clock or browsing different categories/ratings to see the price updates!

*Fun fact: This dynamic pricing trick is something I use for real e‑commerce clients too!*


## 🛠️ Tech Stack
- React (Create React App)
- react-router-dom (for routing)
- Redux (cart actions are ready to go)
- Bootstrap (styling)
- react-hot-toast (user feedback)
- react-loading-skeleton (loading placeholders)


## 🤔 Assumptions
- The product data is static, stored at `project/src/data/products.json` (10 products)
- All the smart search magic happens on the client—no external APIs or keys needed
- Prices are in USD; ratings go from 0 to 5
- Categories are fixed to what's in the sample data
- You don't need the server for these features; just run `npm start` and you're good!


## 🗂️ File Map
- **Data:** `project/src/data/products.json`
- **Catalog UI, Smart Search, Dynamic Pricing:** `project/src/components/Products.jsx`

---

Enjoy exploring, and feel free to play around with the search and pricing features! If you have any questions or feedback, just let me know. 😊
# ihebchebbitest
