import { AnimatePresence, motion } from "motion/react";
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

function hexToRgb(hex: string): [number, number, number] {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.min(255, Math.round(r + (255 - r) * amount))}, ${Math.min(255, Math.round(g + (255 - g) * amount))}, ${Math.min(255, Math.round(b + (255 - b) * amount))})`;
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.round(r * (1 - amount))}, ${Math.round(g * (1 - amount))}, ${Math.round(b * (1 - amount))})`;
}

function getPatternBackground(patternId: string, hex: string): string {
  switch (patternId) {
    case "gradient":
      return `linear-gradient(180deg, ${lighten(hex, 0.2)} 0%, ${hex} 50%, ${darken(hex, 0.25)} 100%)`;
    case "two-tone":
      return `linear-gradient(180deg, ${hex} 0%, ${hex} 50%, ${darken(hex, 0.3)} 50%, ${darken(hex, 0.3)} 100%)`;
    case "speckled": {
      const dark = darken(hex, 0.2);
      return `radial-gradient(circle, ${dark} 1px, transparent 1px), ${hex}`;
    }
    default:
      return hex;
  }
}

function getTextureOverlay(textureId: string): React.CSSProperties {
  switch (textureId) {
    case "ribbed":
      return {
        backgroundImage: `repeating-linear-gradient(
          180deg,
          transparent,
          transparent 3px,
          rgba(0,0,0,0.12) 3px,
          rgba(0,0,0,0.12) 4px
        )`,
      };
    case "woven":
      return {
        backgroundImage: `
          repeating-linear-gradient(90deg, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0.10) 1px, transparent 1px, transparent 4px),
          repeating-linear-gradient(180deg, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0.10) 1px, transparent 1px, transparent 4px)
        `,
      };
    case "matte":
      return {
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.08) 0%, transparent 50%),
          repeating-radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 0.5px, transparent 0.5px)
        `,
        backgroundSize: "auto, auto, 3px 3px",
      };
    case "glossy":
      return {
        backgroundImage: `
          radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.10) 45%, transparent 70%),
          linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)
        `,
      };
    case "rustic":
      return {
        backgroundImage: `
          repeating-linear-gradient(
            28deg,
            transparent,
            transparent 5px,
            rgba(0,0,0,0.07) 5px,
            rgba(0,0,0,0.07) 7px,
            transparent 7px,
            transparent 12px,
            rgba(0,0,0,0.04) 12px,
            rgba(0,0,0,0.04) 13px
          ),
          repeating-linear-gradient(
            -28deg,
            transparent,
            transparent 8px,
            rgba(0,0,0,0.05) 8px,
            rgba(0,0,0,0.05) 9px
          )
        `,
      };
    case "carbon-fiber":
      return {
        backgroundImage: `
          repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.07) 0px,
            rgba(255,255,255,0.07) 2px,
            transparent 2px,
            transparent 4px
          ),
          repeating-linear-gradient(
            180deg,
            rgba(0,0,0,0.20) 0px,
            rgba(0,0,0,0.20) 2px,
            rgba(0,0,0,0.08) 2px,
            rgba(0,0,0,0.08) 4px
          ),
          repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.04) 0px,
            rgba(255,255,255,0.04) 2px,
            transparent 2px,
            transparent 4px
          )
        `,
        backgroundSize: "4px 4px, 4px 4px, 8px 8px",
      };
    case "honeycomb":
      return {
        backgroundImage: `
          repeating-linear-gradient(
            60deg,
            rgba(0,0,0,0.10) 0px,
            rgba(0,0,0,0.10) 1px,
            transparent 1px,
            transparent 10px
          ),
          repeating-linear-gradient(
            -60deg,
            rgba(0,0,0,0.10) 0px,
            rgba(0,0,0,0.10) 1px,
            transparent 1px,
            transparent 10px
          ),
          repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.06) 0px,
            rgba(0,0,0,0.06) 1px,
            transparent 1px,
            transparent 10px
          )
        `,
        backgroundSize: "12px 20px",
      };
    default:
      return {};
  }
}

function getPatternId(pattern: CasePreviewProps["pattern"]): string {
  if (typeof pattern === "string") return pattern;
  return pattern.id;
}

// --- Phone model shape helpers ---

type PhoneSize = { width: number; height: number };
type CutoutStyle = "dynamic-island" | "notch" | "punch-hole" | "punch-hole-lg";
type CameraStyle =
  | "triple-pro-max"
  | "triple-pro"
  | "triple-14pro"
  | "dual"
  | "samsung-ultra-bar"
  | "samsung-standard"
  | "pixel-bar"
  | "circle";
type ButtonLayout = "iphone" | "samsung" | "pixel";

interface PhoneShape {
  size: PhoneSize;
  cornerRadius: number;
  cutout: CutoutStyle;
  camera: CameraStyle;
  buttons: ButtonLayout;
}

function getPhoneShape(phoneModel: string): PhoneShape {
  const m = phoneModel.toLowerCase();

  // Size
  let size: PhoneSize;
  if (
    m.includes("ultra") ||
    m.includes("pro max") ||
    m.includes("plus") ||
    m.includes("s25+") ||
    m.includes("s24+")
  ) {
    size = { width: 190, height: 400 };
  } else {
    size = { width: 180, height: 370 };
  }

  // Corner radius
  let cornerRadius: number;
  if (m.includes("iphone")) {
    cornerRadius = 32;
  } else if (m.includes("samsung")) {
    cornerRadius = 36;
  } else if (m.includes("pixel")) {
    cornerRadius = 28;
  } else {
    cornerRadius = 30;
  }

  // Cutout
  let cutout: CutoutStyle;
  if (
    m.includes("iphone 16") ||
    m.includes("iphone 15 pro") ||
    m.includes("iphone 15 plus")
  ) {
    cutout = "dynamic-island";
  } else if (m.includes("iphone")) {
    cutout = "notch";
  } else if (m.includes("pixel")) {
    cutout = "punch-hole-lg";
  } else {
    // Samsung, OnePlus, Xiaomi
    cutout = "punch-hole";
  }

  // Camera
  let camera: CameraStyle;
  if (m.includes("iphone 16 pro")) {
    camera = "triple-pro-max";
  } else if (m.includes("iphone 15 pro")) {
    camera = "triple-pro";
  } else if (m.includes("iphone 14 pro")) {
    camera = "triple-14pro";
  } else if (m.includes("iphone")) {
    camera = "dual";
  } else if (m.includes("samsung") && m.includes("ultra")) {
    camera = "samsung-ultra-bar";
  } else if (m.includes("samsung")) {
    camera = "samsung-standard";
  } else if (m.includes("pixel")) {
    camera = "pixel-bar";
  } else {
    camera = "circle";
  }

  // Buttons
  let buttons: ButtonLayout;
  if (m.includes("iphone")) {
    buttons = "iphone";
  } else if (m.includes("samsung")) {
    buttons = "samsung";
  } else {
    buttons = "pixel";
  }

  return { size, cornerRadius, cutout, camera, buttons };
}

interface PhoneCaseSVGProps {
  colorHex: string;
  textureId: string;
  patternId: string;
  phoneModel: string;
}

function renderCutout(cutout: CutoutStyle, width: number) {
  const cx = width / 2;
  if (cutout === "dynamic-island") {
    return (
      <div
        className="absolute"
        style={{
          top: 14,
          left: cx - 35,
          width: 70,
          height: 22,
          background: "rgba(0,0,0,0.75)",
          borderRadius: 12,
          boxShadow: "inset 0 1px 4px rgba(0,0,0,0.8)",
        }}
      />
    );
  }
  if (cutout === "notch") {
    return (
      <div
        className="absolute"
        style={{
          top: 0,
          left: cx - 50,
          width: 100,
          height: 20,
          background: "rgba(0,0,0,0.6)",
          borderRadius: "0 0 12px 12px",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6)",
        }}
      />
    );
  }
  if (cutout === "punch-hole-lg") {
    return (
      <div
        className="absolute"
        style={{
          top: 14,
          left: cx - 8,
          width: 16,
          height: 16,
          background: "rgba(0,0,0,0.75)",
          borderRadius: "50%",
          boxShadow: "inset 0 0 4px rgba(0,0,0,0.8)",
        }}
      />
    );
  }
  // punch-hole (Samsung / default)
  return (
    <div
      className="absolute"
      style={{
        top: 14,
        left: cx - 6,
        width: 12,
        height: 12,
        background: "rgba(0,0,0,0.75)",
        borderRadius: "50%",
        boxShadow: "inset 0 0 4px rgba(0,0,0,0.8)",
      }}
    />
  );
}

function renderCamera(camera: CameraStyle, _colorHex: string, width: number) {
  const lensStyle = {
    width: 18,
    height: 18,
    background:
      "radial-gradient(circle at 35% 35%, rgba(80,80,120,0.9), rgba(10,10,20,0.95))",
    borderRadius: "50%" as const,
    boxShadow:
      "inset 0 0 4px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)",
  };
  const lensSmall = { ...lensStyle, width: 14, height: 14 };

  const moduleBase = {
    background: "rgba(0,0,0,0.65)",
    boxShadow: "inset 0 0 8px rgba(0,0,0,0.8), 0 0 0 2px rgba(0,0,0,0.4)",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };

  if (camera === "triple-pro-max" || camera === "triple-pro") {
    const size = camera === "triple-pro-max" ? 50 : 48;
    return (
      <div
        className="absolute"
        style={{
          top: 10,
          right: 14,
          width: size,
          height: size,
          ...moduleBase,
          borderRadius: 14,
          flexDirection: "column",
          gap: 2,
          padding: 4,
        }}
      >
        {/* Triangle arrangement: top-center, bottom-left, bottom-right */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={lensStyle} />
        </div>
        <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
          <div style={lensSmall} />
          <div style={lensSmall} />
        </div>
      </div>
    );
  }

  if (camera === "triple-14pro") {
    return (
      <div
        className="absolute"
        style={{
          top: 10,
          right: 14,
          width: 44,
          height: 44,
          ...moduleBase,
          borderRadius: 12,
          flexDirection: "column",
          gap: 2,
          padding: 4,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ ...lensStyle, width: 16, height: 16 }} />
        </div>
        <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
          <div style={lensSmall} />
          <div style={lensSmall} />
        </div>
      </div>
    );
  }

  if (camera === "dual") {
    return (
      <div
        className="absolute"
        style={{
          top: 12,
          right: 14,
          width: 40,
          height: 26,
          ...moduleBase,
          borderRadius: 12,
          flexDirection: "row",
          gap: 4,
        }}
      >
        <div style={lensSmall} />
        <div style={lensSmall} />
      </div>
    );
  }

  if (camera === "samsung-ultra-bar") {
    return (
      <div
        className="absolute"
        style={{
          top: 10,
          right: 18,
          width: 28,
          height: 90,
          ...moduleBase,
          borderRadius: 14,
          flexDirection: "column",
          gap: 6,
          padding: 6,
        }}
      >
        <div style={lensStyle} />
        <div style={lensSmall} />
        <div style={lensSmall} />
        {/* Flash */}
        <div
          style={{
            width: 6,
            height: 6,
            background: "rgba(255,240,200,0.85)",
            borderRadius: "50%",
          }}
        />
      </div>
    );
  }

  if (camera === "samsung-standard") {
    return (
      <div
        className="absolute"
        style={{
          top: 12,
          right: 14,
          width: 40,
          height: 40,
          ...moduleBase,
          borderRadius: "50%",
        }}
      >
        <div style={{ ...lensStyle, width: 24, height: 24 }} />
      </div>
    );
  }

  if (camera === "pixel-bar") {
    const barLeft = Math.round(width / 2) - 50;
    return (
      <div
        className="absolute"
        style={{
          top: 10,
          left: barLeft,
          width: 100,
          height: 28,
          ...moduleBase,
          borderRadius: 14,
          flexDirection: "row",
          gap: 8,
          padding: "0 10px",
        }}
      >
        <div style={lensStyle} />
        <div style={lensSmall} />
        <div
          style={{
            width: 6,
            height: 6,
            background: "rgba(255,240,200,0.85)",
            borderRadius: "50%",
          }}
        />
      </div>
    );
  }

  // circle (OnePlus, Xiaomi, default)
  return (
    <div
      className="absolute"
      style={{
        top: 12,
        right: 18,
        width: 36,
        height: 36,
        ...moduleBase,
        borderRadius: "50%",
      }}
    >
      <div style={{ ...lensStyle, width: 22, height: 22 }} />
    </div>
  );
}

function renderButtons(
  buttons: ButtonLayout,
  colorHex: string,
  height: number,
) {
  const btnStyle = (side: "left" | "right") => ({
    background: darken(colorHex, 0.15),
    boxShadow:
      side === "right"
        ? "2px 0 4px rgba(0,0,0,0.3), inset -1px 0 2px rgba(255,255,255,0.1)"
        : "-2px 0 4px rgba(0,0,0,0.3), inset 1px 0 2px rgba(255,255,255,0.1)",
  });

  if (buttons === "samsung") {
    // Power + Bixby on right, volume on left
    return (
      <>
        {/* Right: power */}
        <div
          className="absolute"
          style={{
            right: -5,
            top: Math.round(height * 0.3),
            width: 5,
            height: 42,
            borderRadius: "0 3px 3px 0",
            ...btnStyle("right"),
          }}
        />
        {/* Right: bixby */}
        <div
          className="absolute"
          style={{
            right: -5,
            top: Math.round(height * 0.3) + 54,
            width: 5,
            height: 28,
            borderRadius: "0 3px 3px 0",
            ...btnStyle("right"),
          }}
        />
        {/* Left: volume */}
        <div
          className="absolute"
          style={{
            left: -5,
            top: Math.round(height * 0.27),
            width: 5,
            height: 52,
            borderRadius: "3px 0 0 3px",
            ...btnStyle("left"),
          }}
        />
      </>
    );
  }

  if (buttons === "pixel") {
    // Power on right only
    return (
      <>
        <div
          className="absolute"
          style={{
            right: -5,
            top: Math.round(height * 0.32),
            width: 5,
            height: 42,
            borderRadius: "0 3px 3px 0",
            ...btnStyle("right"),
          }}
        />
        {/* Volume on right below power */}
        <div
          className="absolute"
          style={{
            right: -5,
            top: Math.round(height * 0.32) + 54,
            width: 5,
            height: 32,
            borderRadius: "0 3px 3px 0",
            ...btnStyle("right"),
          }}
        />
      </>
    );
  }

  // iphone default
  return (
    <>
      {/* Right: power */}
      <div
        className="absolute"
        style={{
          right: -5,
          top: Math.round(height * 0.315),
          width: 5,
          height: 42,
          borderRadius: "0 3px 3px 0",
          ...btnStyle("right"),
        }}
      />
      {/* Left: volume up */}
      <div
        className="absolute"
        style={{
          left: -5,
          top: Math.round(height * 0.27),
          width: 5,
          height: 32,
          borderRadius: "3px 0 0 3px",
          ...btnStyle("left"),
        }}
      />
      {/* Left: volume down */}
      <div
        className="absolute"
        style={{
          left: -5,
          top: Math.round(height * 0.27) + 44,
          width: 5,
          height: 32,
          borderRadius: "3px 0 0 3px",
          ...btnStyle("left"),
        }}
      />
    </>
  );
}

function PhoneCaseSVG({
  colorHex,
  textureId,
  patternId,
  phoneModel,
}: PhoneCaseSVGProps) {
  const patternBg = getPatternBackground(patternId, colorHex);
  const textureStyle = getTextureOverlay(textureId);
  const isSpeckled = patternId === "speckled";

  const shape = getPhoneShape(phoneModel);
  const { width, height } = shape.size;

  return (
    <div className="relative" style={{ width, height }}>
      {/* Main case body */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: shape.cornerRadius,
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        {/* Color + Pattern layer */}
        {isSpeckled ? (
          <div className="absolute inset-0" style={{ background: colorHex }}>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, ${darken(colorHex, 0.22)} 1px, transparent 1px)`,
                backgroundSize: "8px 8px",
                opacity: 0.7,
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0" style={{ background: patternBg }} />
        )}

        {/* Texture overlay */}
        {textureId !== "smooth" && (
          <div className="absolute inset-0" style={textureStyle} />
        )}

        {/* Depth / edge shading */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, rgba(0,0,0,0.10) 100%)",
            borderRadius: "inherit",
          }}
        />

        {/* Inner edge highlight */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "inherit",
            boxShadow:
              "inset 0 0 0 1.5px rgba(255,255,255,0.18), inset 0 0 0 3px rgba(0,0,0,0.12)",
          }}
        />

        {/* Top cutout */}
        {renderCutout(shape.cutout, width)}

        {/* Camera module */}
        {renderCamera(shape.camera, colorHex, width)}

        {/* Coirform logo text */}
        <div
          className="absolute bottom-8 left-0 right-0 flex items-center justify-center"
          style={{ opacity: 0.25 }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.9)",
              textTransform: "uppercase",
            }}
          >
            COIRFORM
          </span>
        </div>
      </div>

      {/* Side buttons */}
      {renderButtons(shape.buttons, colorHex, height)}

      {/* Bottom port cutout */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        style={{
          width: 50,
          height: 5,
          background: "rgba(0,0,0,0.5)",
          borderRadius: "0 0 4px 4px",
        }}
      />
    </div>
  );
}

export default function CasePreview({
  color,
  texture,
  pattern,
  phoneModel,
  isAiMode,
}: CasePreviewProps) {
  const patternId = getPatternId(pattern);
  const previewKey = `${phoneModel}-${color.id}-${texture.id}-${patternId}`;

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

      {/* Phone Case Preview */}
      <div className="flex-1 flex items-center justify-center w-full py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={previewKey}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <PhoneCaseSVG
              colorHex={color.hex}
              textureId={texture.id}
              patternId={patternId}
              phoneModel={phoneModel}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Variant label */}
      <div className="mb-4 text-center">
        <motion.p
          key={`${previewKey}-label`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className={`text-sm font-semibold ${
            isAiMode ? "text-white/90" : "text-foreground"
          }`}
        >
          {texture.name} ·{" "}
          {typeof pattern === "string"
            ? pattern
            : (pattern as { name: string }).name}
        </motion.p>
        <motion.div
          key={`${previewKey}-color`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="flex items-center justify-center gap-2 mt-1"
        >
          <span
            className="w-3 h-3 rounded-full border border-white/30"
            style={{ background: color.hex }}
          />
          <span
            className={`text-xs ${
              isAiMode ? "text-white/60" : "text-muted-foreground"
            }`}
          >
            {color.name}
          </span>
        </motion.div>
      </div>

      {/* Spec Strip */}
      <div
        className={`mt-2 w-full grid grid-cols-3 gap-2 text-center rounded-xl p-3 ${
          isAiMode ? "bg-white/10" : "bg-background/50"
        }`}
      >
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-widest ${
              isAiMode ? "text-white/50" : "text-muted-foreground"
            }`}
          >
            Material
          </p>
          <p
            className={`text-xs font-semibold mt-0.5 ${
              isAiMode ? "text-white" : "text-foreground"
            }`}
          >
            Biodegradable
          </p>
        </div>
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-widest ${
              isAiMode ? "text-white/50" : "text-muted-foreground"
            }`}
          >
            Case
          </p>
          <p
            className={`text-xs font-semibold mt-0.5 ${
              isAiMode ? "text-white" : "text-foreground"
            }`}
          >
            {phoneModel.split(" ").slice(-2).join(" ")}
          </p>
        </div>
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-widest ${
              isAiMode ? "text-white/50" : "text-muted-foreground"
            }`}
          >
            Color
          </p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span
              className="w-3 h-3 rounded-full inline-block border border-white/30"
              style={{ background: color.hex }}
            />
            <p
              className={`text-xs font-semibold ${
                isAiMode ? "text-white" : "text-foreground"
              }`}
            >
              {color.name}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
