import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import {
  COLORS,
  type ColorOption,
  PATTERNS,
  PHONE_MODELS,
  type PatternOption,
  TEXTURES,
  type TextureOption,
} from "../App";
import { getProduct } from "../data/products";

interface ConfigCardProps {
  phoneModel: string;
  onModelChange: (m: string) => void;
  color: ColorOption;
  onColorChange: (c: ColorOption) => void;
  texture: TextureOption;
  onTextureChange: (t: TextureOption) => void;
  pattern: PatternOption;
  onPatternChange: (p: PatternOption) => void;
  price: number;
  onAddToCart: () => void;
  onAiMode: () => void;
}

function StepLabel({
  num,
  children,
}: { num: number; children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-2">
      <span className="w-5 h-5 rounded-full bg-eco-green text-white text-[10px] font-bold flex items-center justify-center">
        {num}
      </span>
      {children}
    </div>
  );
}

export default function ConfigCard({
  phoneModel,
  onModelChange,
  color,
  onColorChange,
  texture,
  onTextureChange,
  pattern,
  onPatternChange,
  price,
  onAddToCart,
  onAiMode,
}: ConfigCardProps) {
  const productName = getProduct(color.id, texture.id, pattern.id)?.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-card border border-border shadow-card p-6 space-y-6"
    >
      {/* Step 1: Model */}
      <div>
        <StepLabel num={1}>Phone Model</StepLabel>
        <Select value={phoneModel} onValueChange={onModelChange}>
          <SelectTrigger
            className="w-full bg-background"
            data-ocid="config.model_select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PHONE_MODELS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Step 2: Color */}
      <div>
        <StepLabel num={2}>Color</StepLabel>
        <div className="grid grid-cols-3 gap-2" data-ocid="config.color_select">
          {COLORS.map((c, idx) => (
            <button
              type="button"
              key={c.id}
              onClick={() => onColorChange(c)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                color.id === c.id
                  ? "border-eco-green shadow-sm"
                  : "border-transparent hover:border-border"
              }`}
              aria-pressed={color.id === c.id}
              data-ocid={`config.color.${idx + 1}`}
            >
              <span
                className="w-8 h-8 rounded-lg border border-border/40 shadow-xs"
                style={{ background: c.hex }}
              />
              <span className="text-[10px] font-medium text-foreground text-center leading-tight">
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Texture */}
      <div>
        <StepLabel num={3}>Texture</StepLabel>
        <div
          className="grid grid-cols-4 gap-2"
          data-ocid="config.texture_select"
        >
          {TEXTURES.map((t, i) => (
            <button
              type="button"
              key={t.id}
              onClick={() => onTextureChange(t)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border-2 transition-all ${
                texture.id === t.id
                  ? "border-eco-green shadow-sm"
                  : "border-transparent hover:border-border"
              }`}
              aria-pressed={texture.id === t.id}
              data-ocid={`config.texture.${i + 1}`}
            >
              <div className={`w-10 h-10 rounded-lg ${t.cssClass}`} />
              <span className="text-[9px] font-medium text-center leading-tight text-foreground">
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 4: Pattern */}
      <div>
        <StepLabel num={4}>Pattern</StepLabel>
        <div
          className="grid grid-cols-4 gap-2"
          data-ocid="config.pattern_select"
        >
          {PATTERNS.map((p, i) => (
            <button
              type="button"
              key={p.id}
              onClick={() => onPatternChange(p)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border-2 transition-all ${
                pattern.id === p.id
                  ? "border-eco-green shadow-sm"
                  : "border-transparent hover:border-border"
              }`}
              aria-pressed={pattern.id === p.id}
              data-ocid={`config.pattern.${i + 1}`}
            >
              <div className={`w-10 h-10 rounded-lg ${p.cssClass}`} />
              <span className="text-[9px] font-medium text-center leading-tight text-foreground">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price + CTAs */}
      <div className="pt-2 border-t border-border">
        {productName && (
          <p className="text-sm font-semibold text-foreground mb-1">
            {productName}
          </p>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-foreground">₹{price}</span>
        </div>
        <Button
          variant="outline"
          className="w-full rounded-full border-2 border-eco-green text-eco-green font-semibold mb-3 hover:bg-eco-green/10"
          onClick={onAiMode}
          data-ocid="config.ai_design_button"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Design Your Case with AI
        </Button>
        <Button
          className="w-full rounded-full bg-eco-green text-white font-bold text-base py-6 hover:bg-eco-green/90"
          onClick={onAddToCart}
          data-ocid="config.add_to_cart_button"
        >
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}
