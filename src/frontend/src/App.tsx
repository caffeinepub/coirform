import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { VibeDesign } from "./backend.d";
import AiVibePanel from "./components/AiVibePanel";
import CartDrawer from "./components/CartDrawer";
import CasePreview from "./components/CasePreview";
import ConfigCard from "./components/ConfigCard";
import FooterSection from "./components/FooterSection";
import Header from "./components/Header";
import HowItWorks from "./components/HowItWorks";
import OrderModal from "./components/OrderModal";
import OurStory from "./components/OurStory";
import SustainabilitySection from "./components/SustainabilitySection";
import { getProduct } from "./data/products";

const queryClient = new QueryClient();

export type ColorOption = {
  id: string;
  name: string;
  hex: string;
};

export type TextureOption = {
  id: string;
  name: string;
  premium: boolean;
  cssClass: string;
};

export type PatternOption = {
  id: string;
  name: string;
  premium: boolean;
  cssClass: string;
};

export type CartItem = {
  id: string;
  phoneModel: string;
  color: ColorOption;
  texture: TextureOption;
  pattern: PatternOption;
  quantity: number;
  price: number;
  vibe: string | null;
  aiSuggestionUsed: boolean;
};

export const COLORS: ColorOption[] = [
  { id: "natural-brown", name: "Natural Brown", hex: "#8B6F4E" },
  { id: "charcoal", name: "Charcoal", hex: "#3A3A3A" },
  { id: "moss-green", name: "Moss Green", hex: "#4A7C59" },
  { id: "terracotta", name: "Terracotta", hex: "#C1603A" },
  { id: "golden-tan", name: "Golden Tan", hex: "#D4A853" },
  { id: "dark-roast", name: "Dark Roast", hex: "#2C1810" },
];

export const TEXTURES: TextureOption[] = [
  { id: "smooth", name: "Smooth", premium: false, cssClass: "texture-smooth" },
  { id: "ribbed", name: "Ribbed", premium: true, cssClass: "texture-ribbed" },
  { id: "woven", name: "Woven", premium: true, cssClass: "texture-woven" },
  { id: "matte", name: "Matte", premium: false, cssClass: "texture-matte" },
  { id: "glossy", name: "Glossy", premium: false, cssClass: "texture-glossy" },
  { id: "rustic", name: "Rustic", premium: false, cssClass: "texture-rustic" },
  {
    id: "carbon-fiber",
    name: "Carbon Fiber",
    premium: true,
    cssClass: "texture-carbon",
  },
  {
    id: "honeycomb",
    name: "Honeycomb",
    premium: true,
    cssClass: "texture-honeycomb",
  },
];

export const PATTERNS: PatternOption[] = [
  { id: "solid", name: "Solid", premium: false, cssClass: "pattern-solid" },
  {
    id: "gradient",
    name: "Gradient",
    premium: true,
    cssClass: "pattern-gradient",
  },
  {
    id: "two-tone",
    name: "Two-Tone",
    premium: true,
    cssClass: "pattern-twotone",
  },
  {
    id: "speckled",
    name: "Speckled",
    premium: true,
    cssClass: "pattern-speckled",
  },
];

export const PHONE_MODELS = [
  // Apple
  "iPhone 16 Pro Max",
  "iPhone 16 Pro",
  "iPhone 16 Plus",
  "iPhone 16",
  "iPhone 15 Pro Max",
  "iPhone 15 Pro",
  "iPhone 15 Plus",
  "iPhone 15",
  "iPhone 14 Pro",
  "iPhone 14",
  "iPhone 13",
  // Samsung
  "Samsung Galaxy S25 Ultra",
  "Samsung Galaxy S25+",
  "Samsung Galaxy S25",
  "Samsung Galaxy S24 Ultra",
  "Samsung Galaxy S24+",
  "Samsung Galaxy S24",
  "Samsung Galaxy S23",
  "Samsung Galaxy A55",
  "Samsung Galaxy A35",
  // Google
  "Google Pixel 9 Pro",
  "Google Pixel 9",
  "Google Pixel 8 Pro",
  "Google Pixel 8",
  "Google Pixel 7",
  // OnePlus
  "OnePlus 12",
  "OnePlus 11",
  // Xiaomi
  "Xiaomi 14 Ultra",
  "Xiaomi 14",
];

function AppContent() {
  const [phoneModel, setPhoneModel] = useState(PHONE_MODELS[0]);
  const [color, setColor] = useState<ColorOption>(COLORS[2]);
  const [texture, setTexture] = useState<TextureOption>(TEXTURES[0]);
  const [pattern, setPattern] = useState<PatternOption>(PATTERNS[0]);
  const [isAiMode, setIsAiMode] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ id: string } | null>(null);

  const price = getProduct(color.id, texture.id, pattern.id)?.priceInr ?? 399;

  function addToCart(vibe: string | null = null, aiUsed = false) {
    const item: CartItem = {
      id: Date.now().toString(),
      phoneModel,
      color,
      texture,
      pattern,
      quantity: 1,
      price,
      vibe,
      aiSuggestionUsed: aiUsed,
    };
    setCart((prev) => [...prev, item]);
    setCartOpen(true);
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQty(id: string, qty: number) {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    );
  }

  function applyVibeDesign(design: VibeDesign, editMode = false) {
    const foundColor =
      COLORS.find(
        (c) =>
          c.id === design.color ||
          c.name.toLowerCase() === design.color.toLowerCase(),
      ) || COLORS[0];
    const foundTexture =
      TEXTURES.find(
        (t) =>
          t.id === design.texture ||
          t.name.toLowerCase() === design.texture.toLowerCase(),
      ) || TEXTURES[0];
    const foundPattern =
      PATTERNS.find(
        (p) =>
          p.id === design.pattern ||
          p.name.toLowerCase() === design.pattern.toLowerCase(),
      ) || PATTERNS[0];
    setColor(foundColor);
    setTexture(foundTexture);
    setPattern(foundPattern);
    if (editMode) setIsAiMode(false);
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onCartOpen={() => setCartOpen(true)}
      />

      {/* Hero Customizer Section */}
      <main id="customizer" className="flex-1">
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold uppercase tracking-tight text-foreground">
                Design Your Coirform
              </h1>
              <p className="mt-2 text-muted-foreground text-base">
                Biodegradable. Beautiful. Yours.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: Preview */}
              <CasePreview
                color={color}
                texture={texture}
                pattern={pattern}
                phoneModel={phoneModel}
                isAiMode={isAiMode}
              />

              {/* Right: Config or AI Panel */}
              {isAiMode ? (
                <AiVibePanel
                  selectedVibe={selectedVibe}
                  onSelectVibe={setSelectedVibe}
                  onApply={(design) => {
                    applyVibeDesign(design, false);
                    addToCart(design.vibe, true);
                  }}
                  onEdit={(design) => applyVibeDesign(design, true)}
                  onClose={() => setIsAiMode(false)}
                  color={color}
                  texture={texture}
                  pattern={pattern}
                  price={price}
                  onAddToCart={() => addToCart(selectedVibe, true)}
                />
              ) : (
                <ConfigCard
                  phoneModel={phoneModel}
                  onModelChange={setPhoneModel}
                  color={color}
                  onColorChange={setColor}
                  texture={texture}
                  onTextureChange={setTexture}
                  pattern={pattern}
                  onPatternChange={setPattern}
                  price={price}
                  onAddToCart={() => addToCart()}
                  onAiMode={() => {
                    setIsAiMode(true);
                    setSelectedVibe(null);
                  }}
                />
              )}
            </div>
          </div>
        </section>

        <HowItWorks />
        <OurStory />
        <SustainabilitySection />
      </main>

      <FooterSection />

      {/* Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          items={cart}
          total={cartTotal}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
          onCheckout={() => {
            setCartOpen(false);
            setOrderModalOpen(true);
          }}
        />
      )}

      {/* Order Modal */}
      {orderModalOpen && (
        <OrderModal
          items={cart}
          total={cartTotal}
          onClose={() => {
            setOrderModalOpen(false);
            setOrderSuccess(null);
          }}
          onSuccess={(orderId) => {
            setOrderSuccess({ id: orderId });
            setCart([]);
          }}
          orderSuccess={orderSuccess}
          phoneModel={phoneModel}
          color={color}
          texture={texture}
          pattern={pattern}
          selectedVibe={selectedVibe}
        />
      )}

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
