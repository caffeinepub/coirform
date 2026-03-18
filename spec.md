# Coirform

## Current State
Phone case customizer with 29 models, dynamic preview. Camera shapes use 8 style variants. Preview remounts via previewKey on every selection change causing lag. Stripe backend integrated but checkout is a plain order form with no actual Stripe payment UI.

## Requested Changes (Diff)

### Add
- Stripe checkout in OrderModal: Pay with Card button calls createCheckoutSession, redirects to Stripe hosted page. Handle payment=success / payment=cancelled URL params on return.
- Accurate per-model camera renders: iPhone 16 Pro/Max triangular island, iPhone 16/Plus vertical dual, Samsung Ultra 4-lens column, Samsung standard triple column, Pixel 9 Pro horizontal 3-lens bar, Pixel 9/8 horizontal 2-lens bar, OnePlus circular 3-lens island, Xiaomi 14 Ultra large Leica-style circle.

### Modify
- Remove previewKey remount trick; use stable component identity + useMemo for shape computation to eliminate lag.
- Each camera lens uses realistic multi-layer SVG radial gradient (glass effect with highlight).

### Remove
- Nothing

## Implementation Plan
1. Refactor CasePreview: remove key-based remount, memoize getPhoneShape, rewrite renderCamera with precise SVG per model.
2. Wire Stripe in OrderModal: Pay with Card button, createCheckoutSession call, redirect, return URL handling.
