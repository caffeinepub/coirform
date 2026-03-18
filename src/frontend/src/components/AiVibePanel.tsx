import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ColorOption, PatternOption, TextureOption } from "../App";
import { COLORS } from "../App";
import type { VibeDesign } from "../backend.d";
import { useGetVibeDesigns } from "../hooks/useQueries";

const VIBES = [
  "Gaming",
  "Music",
  "Minimalist",
  "Bold",
  "Nature",
  "Festival",
  "Athletic",
  "Creative",
];

const FALLBACK_DESIGNS: Record<string, VibeDesign[]> = {
  Gaming: [
    {
      id: "g1",
      name: "Neon Strike",
      description: "Bold charcoal with carbon fiber texture",
      color: "charcoal",
      texture: "carbon-fiber",
      pattern: "gradient",
      vibe: "Gaming",
      trending: true,
    },
    {
      id: "g2",
      name: "Hex Grid",
      description: "Dark roast with honeycomb pattern",
      color: "dark-roast",
      texture: "honeycomb",
      pattern: "solid",
      vibe: "Gaming",
      trending: false,
    },
    {
      id: "g3",
      name: "Stealth Mode",
      description: "Charcoal matte with speckled finish",
      color: "charcoal",
      texture: "matte",
      pattern: "speckled",
      vibe: "Gaming",
      trending: true,
    },
  ],
  Music: [
    {
      id: "m1",
      name: "Bass Drop",
      description: "Terracotta with ribbed texture",
      color: "terracotta",
      texture: "ribbed",
      pattern: "gradient",
      vibe: "Music",
      trending: true,
    },
    {
      id: "m2",
      name: "Vinyl",
      description: "Dark roast with glossy finish",
      color: "dark-roast",
      texture: "glossy",
      pattern: "two-tone",
      vibe: "Music",
      trending: false,
    },
    {
      id: "m3",
      name: "Acoustic",
      description: "Natural brown woven texture",
      color: "natural-brown",
      texture: "woven",
      pattern: "solid",
      vibe: "Music",
      trending: true,
    },
  ],
  Minimalist: [
    {
      id: "min1",
      name: "Zen",
      description: "Moss green smooth matte",
      color: "moss-green",
      texture: "smooth",
      pattern: "solid",
      vibe: "Minimalist",
      trending: true,
    },
    {
      id: "min2",
      name: "Clean Slate",
      description: "Charcoal matte, pure minimal",
      color: "charcoal",
      texture: "matte",
      pattern: "solid",
      vibe: "Minimalist",
      trending: false,
    },
    {
      id: "min3",
      name: "Sand Dune",
      description: "Golden tan smooth finish",
      color: "golden-tan",
      texture: "smooth",
      pattern: "solid",
      vibe: "Minimalist",
      trending: false,
    },
  ],
  Bold: [
    {
      id: "b1",
      name: "Fire Earth",
      description: "Terracotta with two-tone speckled",
      color: "terracotta",
      texture: "rustic",
      pattern: "two-tone",
      vibe: "Bold",
      trending: true,
    },
    {
      id: "b2",
      name: "Carbon King",
      description: "Charcoal carbon fiber gradient",
      color: "charcoal",
      texture: "carbon-fiber",
      pattern: "gradient",
      vibe: "Bold",
      trending: true,
    },
    {
      id: "b3",
      name: "Golden Hour",
      description: "Golden tan with woven texture",
      color: "golden-tan",
      texture: "woven",
      pattern: "speckled",
      vibe: "Bold",
      trending: false,
    },
  ],
  Nature: [
    {
      id: "n1",
      name: "Forest Floor",
      description: "Moss green ribbed texture",
      color: "moss-green",
      texture: "ribbed",
      pattern: "solid",
      vibe: "Nature",
      trending: true,
    },
    {
      id: "n2",
      name: "Bark",
      description: "Natural brown rustic finish",
      color: "natural-brown",
      texture: "rustic",
      pattern: "gradient",
      vibe: "Nature",
      trending: false,
    },
    {
      id: "n3",
      name: "Terrain",
      description: "Golden tan woven speckled",
      color: "golden-tan",
      texture: "woven",
      pattern: "speckled",
      vibe: "Nature",
      trending: true,
    },
  ],
  Festival: [
    {
      id: "f1",
      name: "Sunset Groove",
      description: "Terracotta ribbed gradient",
      color: "terracotta",
      texture: "ribbed",
      pattern: "gradient",
      vibe: "Festival",
      trending: true,
    },
    {
      id: "f2",
      name: "Golden Dust",
      description: "Golden tan speckled honeycomb",
      color: "golden-tan",
      texture: "honeycomb",
      pattern: "speckled",
      vibe: "Festival",
      trending: false,
    },
    {
      id: "f3",
      name: "Earth Rave",
      description: "Moss green two-tone woven",
      color: "moss-green",
      texture: "woven",
      pattern: "two-tone",
      vibe: "Festival",
      trending: true,
    },
  ],
  Athletic: [
    {
      id: "a1",
      name: "Sprint",
      description: "Charcoal carbon fiber two-tone",
      color: "charcoal",
      texture: "carbon-fiber",
      pattern: "two-tone",
      vibe: "Athletic",
      trending: true,
    },
    {
      id: "a2",
      name: "Trail",
      description: "Moss green honeycomb solid",
      color: "moss-green",
      texture: "honeycomb",
      pattern: "solid",
      vibe: "Athletic",
      trending: false,
    },
    {
      id: "a3",
      name: "Endure",
      description: "Natural brown ribbed gradient",
      color: "natural-brown",
      texture: "ribbed",
      pattern: "gradient",
      vibe: "Athletic",
      trending: true,
    },
  ],
  Creative: [
    {
      id: "cr1",
      name: "Studio",
      description: "Terracotta woven two-tone",
      color: "terracotta",
      texture: "woven",
      pattern: "two-tone",
      vibe: "Creative",
      trending: true,
    },
    {
      id: "cr2",
      name: "Palette",
      description: "Golden tan speckled rustic",
      color: "golden-tan",
      texture: "rustic",
      pattern: "speckled",
      vibe: "Creative",
      trending: false,
    },
    {
      id: "cr3",
      name: "Mosaic",
      description: "Moss green honeycomb gradient",
      color: "moss-green",
      texture: "honeycomb",
      pattern: "gradient",
      vibe: "Creative",
      trending: true,
    },
  ],
};

interface AiVibePanelProps {
  selectedVibe: string | null;
  onSelectVibe: (v: string) => void;
  onApply: (design: VibeDesign) => void;
  onEdit: (design: VibeDesign) => void;
  onClose: () => void;
  color: ColorOption;
  texture: TextureOption;
  pattern: PatternOption;
  price: number;
  onAddToCart: () => void;
}

export default function AiVibePanel({
  selectedVibe,
  onSelectVibe,
  onApply,
  onEdit,
  onClose,
  price,
  onAddToCart,
}: AiVibePanelProps) {
  const { data: backendDesigns, isLoading } = useGetVibeDesigns(selectedVibe);

  const designs: VibeDesign[] =
    backendDesigns && backendDesigns.length > 0
      ? backendDesigns
      : selectedVibe
        ? (FALLBACK_DESIGNS[selectedVibe] ?? [])
        : [];

  function getColorHex(colorId: string): string {
    return (
      COLORS.find(
        (c) =>
          c.id === colorId || c.name.toLowerCase() === colorId.toLowerCase(),
      )?.hex ?? "#888"
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-eco-green" />
          <h2 className="text-lg font-bold text-foreground">
            AI Vibe Suggestion
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-ocid="ai_panel.close_button"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">What&apos;s your vibe?</p>

      {/* Vibe chips */}
      <div className="flex flex-wrap gap-2" data-ocid="ai_panel.vibe_select">
        {VIBES.map((v, idx) => (
          <button
            type="button"
            key={v}
            onClick={() => onSelectVibe(v)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
              selectedVibe === v
                ? "border-eco-green bg-eco-green/10 text-eco-green"
                : "border-border text-muted-foreground hover:border-eco-green/50"
            }`}
            data-ocid={`ai_panel.vibe.${idx + 1}`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Designs */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <div
            className="flex items-center justify-center py-8"
            data-ocid="ai_panel.loading_state"
          >
            <Loader2 className="w-6 h-6 animate-spin text-eco-green" />
            <span className="ml-2 text-sm text-muted-foreground">
              Finding your perfect designs...
            </span>
          </div>
        )}
        {!isLoading && selectedVibe && designs.length > 0 && (
          <motion.div
            key={selectedVibe}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
            data-ocid="ai_panel.list"
          >
            {designs.map((design, i) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:border-eco-green/30 transition-all"
                data-ocid={`ai_panel.item.${i + 1}`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 border border-border/40"
                  style={{ background: getColorHex(design.color) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {design.name}
                    </p>
                    {design.trending && (
                      <span className="text-[9px] font-bold bg-eco-green/10 text-eco-green px-1.5 py-0.5 rounded-full">
                        TRENDING
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {design.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                    {design.color} · {design.texture} · {design.pattern}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => onApply(design)}
                    className="text-xs px-3 py-1 rounded-full bg-eco-green text-white font-semibold hover:bg-eco-green/90 transition"
                    data-ocid={`ai_panel.select_button.${i + 1}`}
                  >
                    Select
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(design)}
                    className="text-xs px-3 py-1 rounded-full border border-eco-green text-eco-green font-semibold hover:bg-eco-green/10 transition"
                    data-ocid={`ai_panel.edit_button.${i + 1}`}
                  >
                    Edit
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        {!isLoading && !selectedVibe && (
          <p className="text-center text-sm text-muted-foreground py-6">
            Select a vibe above to see AI suggestions
          </p>
        )}
      </AnimatePresence>

      {/* Price + CTAs */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-foreground">₹{price}</span>
        </div>
        <Button
          className="w-full rounded-full bg-eco-green text-white font-bold py-6 mb-2 hover:bg-eco-green/90"
          onClick={onAddToCart}
          data-ocid="ai_panel.add_to_cart_button"
        >
          Add to Cart
        </Button>
        <Button
          variant="outline"
          className="w-full rounded-full border-2 border-foreground text-foreground font-semibold py-6 hover:bg-foreground/5"
          onClick={onAddToCart}
          data-ocid="ai_panel.checkout_button"
        >
          Checkout Now
        </Button>
      </div>
    </motion.div>
  );
}
