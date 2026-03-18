import { motion } from "motion/react";
import type { ColorOption, TextureOption } from "../App";

interface CasePreviewProps {
  color: ColorOption;
  texture: TextureOption;
  pattern:
    | string
    | { id: string; name: string; premium: boolean; cssClass: string };
  phoneModel: string;
  isAiMode: boolean;
}

function getCaseImage(color: ColorOption, texture: TextureOption): string {
  if (color.id === "moss-green" && texture.id === "ribbed") {
    return "/assets/generated/case-preview-green.dim_400x500.png";
  }
  if (color.id === "natural-brown" && texture.id === "smooth") {
    return "/assets/generated/case-preview-brown.dim_400x500.png";
  }
  if (color.id === "charcoal" && texture.id === "carbon-fiber") {
    return "/assets/generated/case-preview-charcoal.dim_400x500.png";
  }
  return "/assets/generated/case-preview-green.dim_400x500.png";
}

export default function CasePreview({
  color,
  texture,
  phoneModel,
  isAiMode,
}: CasePreviewProps) {
  const imgSrc = getCaseImage(color, texture);

  return (
    <motion.div
      layout
      className={`rounded-2xl p-6 shadow-card-lg flex flex-col items-center min-h-[500px] transition-all duration-500 ${
        isAiMode ? "text-white" : "bg-eco-preview"
      }`}
      style={
        isAiMode
          ? { background: "linear-gradient(160deg, #1F3C2A 0%, #4A2F22 100%)" }
          : {}
      }
    >
      <h2
        className={`text-lg font-bold uppercase tracking-wider mb-1 ${isAiMode ? "text-white" : "text-foreground"}`}
      >
        Your Custom Coirform
      </h2>
      <p
        className={`text-xs mb-6 ${isAiMode ? "text-white/70" : "text-muted-foreground"}`}
      >
        {isAiMode
          ? "AI-designed just for you"
          : "Tap options to preview your design"}
      </p>

      <motion.div
        key={imgSrc}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="flex-1 flex items-center justify-center w-full"
      >
        <img
          src={imgSrc}
          alt={`${color.name} ${texture.name} phone case`}
          className="max-h-72 object-contain drop-shadow-xl"
        />
      </motion.div>

      {/* Spec Strip */}
      <div
        className={`mt-6 w-full grid grid-cols-3 gap-2 text-center rounded-xl p-3 ${isAiMode ? "bg-white/10" : "bg-background/50"}`}
      >
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-widest ${isAiMode ? "text-white/50" : "text-muted-foreground"}`}
          >
            Material
          </p>
          <p
            className={`text-xs font-semibold mt-0.5 ${isAiMode ? "text-white" : "text-foreground"}`}
          >
            Biodegradable
          </p>
        </div>
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-widest ${isAiMode ? "text-white/50" : "text-muted-foreground"}`}
          >
            Case
          </p>
          <p
            className={`text-xs font-semibold mt-0.5 ${isAiMode ? "text-white" : "text-foreground"}`}
          >
            {phoneModel.split(" ").slice(-2).join(" ")}
          </p>
        </div>
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-widest ${isAiMode ? "text-white/50" : "text-muted-foreground"}`}
          >
            Color
          </p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span
              className="w-3 h-3 rounded-full inline-block border border-white/30"
              style={{ background: color.hex }}
            />
            <p
              className={`text-xs font-semibold ${isAiMode ? "text-white" : "text-foreground"}`}
            >
              {color.name}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
