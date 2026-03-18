# Coirform

## Current State
The app has a customizer with 6 color options, 8 textures, and 4 patterns. Price is calculated dynamically in USD using a base price + premiums formula. Products have no named variants.

## Requested Changes (Diff)

### Add
- A named product catalog with 192 SKUs across 6 color families, each SKU having: name, color family, texture, pattern, and price in INR
- Product data file (`data/products.ts`) exporting the full catalog
- Price displayed as ₹ (INR) throughout — in ConfigCard, CartDrawer, OrderModal, and CasePreview

### Modify
- `COLORS`, `TEXTURES`, `PATTERNS` in `App.tsx` remain the same structure but price calculation is replaced: look up the matching named product by (color × texture × pattern) and return its INR price
- `calcPrice` replaced by `getProductPrice(colorId, textureId, patternId): number` that returns the INR price from the catalog
- `CartItem.price` now stores INR price
- All price displays changed from `$X.XX` to `₹X` format
- ConfigCard should show the product name (e.g., "Sahara Dawn") when a valid combo is selected

### Remove
- `BASE_PRICE` constant and old USD-based premium logic

## Implementation Plan
1. Create `src/frontend/src/data/products.ts` with all 192 products (6 colors × 8 textures × 4 patterns), each with: id, name, colorId, texture, pattern, priceInr
2. Update `App.tsx`: remove BASE_PRICE, replace `calcPrice` with `getProductPrice`, update CartItem price type
3. Update `ConfigCard`: show active product name, display ₹ price
4. Update `CartDrawer` and `OrderModal`: display ₹ prices
5. Update `CasePreview` if it shows price
