// Dynamic Pricing Engine (Option B)
// Usage: compute(product) -> { adjusted, factor }

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const round2 = (n) => Math.round(n * 100) / 100;

const categoryMap = { electronics: 0.06, "men's clothing": 0.02, "women's clothing": 0.03, jewelery: 0.01 };
const ratingFactor = (r) => (r >= 4.7 ? 0.05 : r >= 4.3 ? 0.03 : r >= 4.0 ? 0.01 : 0);

const timeFactor = () => {
  const d = new Date();
  const day = d.getDay(); // 0 Sun - 6 Sat
  const hour = d.getHours();
  let f = 0;
  if (day === 0 || day === 6) f += 0.04; // weekend uplift
  if (day >= 1 && day <= 5 && hour >= 14 && hour < 16) f -= 0.05; // weekday afternoon dip
  return f;
};

const demandSpike = (id) => {
  const d = new Date();
  const h = d.getHours();
  const numeric = Number(String(id).replace(/\D/g, "")) || 0;
  const seed = (numeric + h) % 7;
  const table = [0.0, 0.01, 0.02, 0.03, -0.01, 0.015, 0.0];
  return table[seed];
};

export function compute(product) {
  const base = Number(product.price) || 0;
  const totalFactor = clamp(
    (categoryMap[product.category] || 0) + ratingFactor(product.rating || 0) + timeFactor() + demandSpike(product.id),
    -0.15,
    0.2
  );
  const adjusted = round2(base * (1 + totalFactor));
  return { adjusted, factor: totalFactor };
}
