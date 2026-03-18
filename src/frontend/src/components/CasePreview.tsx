import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
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
  | "triple-pro-15"
  | "triple-14pro"
  | "dual-vertical"
  | "dual-diagonal"
  | "samsung-ultra"
  | "samsung-triple"
  | "pixel-bar-triple"
  | "pixel-bar-dual"
  | "oneplus-circle"
  | "xiaomi-ultra"
  | "xiaomi-triple";
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
    cutout = "punch-hole";
  }

  // Camera
  let camera: CameraStyle;
  if (m.includes("iphone 16 pro")) {
    camera = "triple-pro-max";
  } else if (m.includes("iphone 15 pro")) {
    camera = "triple-pro-15";
  } else if (m.includes("iphone 14 pro")) {
    camera = "triple-14pro";
  } else if (m.includes("iphone 16") || m.includes("iphone 15")) {
    camera = "dual-vertical";
  } else if (m.includes("iphone 14") || m.includes("iphone 13")) {
    camera = "dual-diagonal";
  } else if (m.includes("samsung") && m.includes("ultra")) {
    camera = "samsung-ultra";
  } else if (m.includes("samsung")) {
    camera = "samsung-triple";
  } else if (
    m.includes("pixel") &&
    (m.includes("pro") || m.includes("8 pro"))
  ) {
    camera = "pixel-bar-triple";
  } else if (m.includes("pixel")) {
    camera = "pixel-bar-dual";
  } else if (m.includes("oneplus")) {
    camera = "oneplus-circle";
  } else if (m.includes("xiaomi") && m.includes("ultra")) {
    camera = "xiaomi-ultra";
  } else if (m.includes("xiaomi")) {
    camera = "xiaomi-triple";
  } else {
    camera = "dual-vertical";
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

// SVG lens component with realistic multi-stop radial gradient
function SvgLens({
  cx,
  cy,
  r,
  gradId,
}: { cx: number; cy: number; r: number; gradId: string }) {
  return (
    <>
      <defs>
        <radialGradient id={gradId} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#7090c8" />
          <stop offset="18%" stopColor="#1e2850" />
          <stop offset="45%" stopColor="#060810" />
          <stop offset="80%" stopColor="#030508" />
          <stop offset="100%" stopColor="#1a1a1f" />
        </radialGradient>
      </defs>
      {/* Metallic outer ring */}
      <circle cx={cx} cy={cy} r={r + 2.5} fill="#2a2a2e" />
      <circle cx={cx} cy={cy} r={r + 1.5} fill="#3a3a40" />
      {/* Lens glass */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${gradId})`} />
      {/* Specular highlight */}
      <ellipse
        cx={cx - r * 0.25}
        cy={cy - r * 0.3}
        rx={r * 0.3}
        ry={r * 0.18}
        fill="rgba(255,255,255,0.18)"
      />
    </>
  );
}

function FlashDot({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={4} fill="#2a2510" />
      <circle cx={cx} cy={cy} r={3} fill="#e8c060" />
      <circle cx={cx - 1} cy={cy - 1} r={1} fill="rgba(255,255,200,0.8)" />
    </>
  );
}

function renderCamera(camera: CameraStyle, _colorHex: string, width: number) {
  const ns = camera; // namespace for gradient IDs

  if (camera === "triple-pro-max") {
    // 56x56 square bump, top-right, triangle lens layout
    const bw = 56;
    const bh = 56;
    return (
      <div
        className="absolute"
        style={{ top: 10, right: 12, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          {/* Housing */}
          <rect
            x={0}
            y={0}
            width={bw}
            height={bh}
            rx={16}
            ry={16}
            fill="#141418"
            stroke="#2e2e34"
            strokeWidth={1}
          />
          <rect
            x={1}
            y={1}
            width={bw - 2}
            height={bh - 2}
            rx={15}
            ry={15}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
          {/* Top-center main lens */}
          <SvgLens cx={28} cy={16} r={9} gradId={`${ns}-l1`} />
          {/* Bottom-left */}
          <SvgLens cx={15} cy={40} r={7.5} gradId={`${ns}-l2`} />
          {/* Bottom-right */}
          <SvgLens cx={41} cy={40} r={7.5} gradId={`${ns}-l3`} />
          {/* Flash */}
          <FlashDot cx={43} cy={16} />
        </svg>
      </div>
    );
  }

  if (camera === "triple-pro-15") {
    const bw = 52;
    const bh = 52;
    return (
      <div
        className="absolute"
        style={{ top: 10, right: 12, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          <rect
            x={0}
            y={0}
            width={bw}
            height={bh}
            rx={15}
            ry={15}
            fill="#141418"
            stroke="#2e2e34"
            strokeWidth={1}
          />
          <rect
            x={1}
            y={1}
            width={bw - 2}
            height={bh - 2}
            rx={14}
            ry={14}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
          <SvgLens cx={26} cy={15} r={9} gradId={`${ns}-l1`} />
          <SvgLens cx={14} cy={38} r={7.5} gradId={`${ns}-l2`} />
          <SvgLens cx={38} cy={38} r={7.5} gradId={`${ns}-l3`} />
          <FlashDot cx={41} cy={15} />
        </svg>
      </div>
    );
  }

  if (camera === "triple-14pro") {
    const bw = 48;
    const bh = 48;
    return (
      <div
        className="absolute"
        style={{ top: 10, right: 12, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          <rect
            x={0}
            y={0}
            width={bw}
            height={bh}
            rx={13}
            ry={13}
            fill="#141418"
            stroke="#2e2e34"
            strokeWidth={1}
          />
          <rect
            x={1}
            y={1}
            width={bw - 2}
            height={bh - 2}
            rx={12}
            ry={12}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
          <SvgLens cx={24} cy={14} r={8} gradId={`${ns}-l1`} />
          <SvgLens cx={13} cy={35} r={7} gradId={`${ns}-l2`} />
          <SvgLens cx={35} cy={35} r={7} gradId={`${ns}-l3`} />
          <FlashDot cx={38} cy={14} />
        </svg>
      </div>
    );
  }

  if (camera === "dual-vertical") {
    const bw = 28;
    const bh = 46;
    return (
      <div
        className="absolute"
        style={{ top: 10, right: 14, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          <rect
            x={0}
            y={0}
            width={bw}
            height={bh}
            rx={10}
            ry={10}
            fill="#141418"
            stroke="#2e2e34"
            strokeWidth={1}
          />
          <SvgLens cx={14} cy={12} r={8} gradId={`${ns}-l1`} />
          <SvgLens cx={14} cy={30} r={8} gradId={`${ns}-l2`} />
          <FlashDot cx={14} cy={41} />
        </svg>
      </div>
    );
  }

  if (camera === "dual-diagonal") {
    const bw = 44;
    const bh = 28;
    return (
      <div
        className="absolute"
        style={{ top: 12, right: 12, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          <rect
            x={0}
            y={0}
            width={bw}
            height={bh}
            rx={10}
            ry={10}
            fill="#141418"
            stroke="#2e2e34"
            strokeWidth={1}
          />
          <SvgLens cx={14} cy={10} r={7.5} gradId={`${ns}-l1`} />
          <SvgLens cx={30} cy={18} r={7.5} gradId={`${ns}-l2`} />
          <FlashDot cx={38} cy={8} />
        </svg>
      </div>
    );
  }

  if (camera === "samsung-ultra") {
    // No housing — floating individual lenses, top-right
    const bw = 32;
    const bh = 110;
    return (
      <div
        className="absolute"
        style={{ top: 10, right: 14, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          {/* Individual metallic rings for each lens */}
          <SvgLens cx={16} cy={14} r={11} gradId={`${ns}-l1`} />
          <SvgLens cx={16} cy={44} r={9} gradId={`${ns}-l2`} />
          <SvgLens cx={16} cy={71} r={9} gradId={`${ns}-l3`} />
          <SvgLens cx={16} cy={96} r={9} gradId={`${ns}-l4`} />
          <FlashDot cx={27} cy={44} />
        </svg>
      </div>
    );
  }

  if (camera === "samsung-triple") {
    // Rounded rectangle on top-left, 3 lenses stacked
    const bw = 30;
    const bh = 62;
    return (
      <div
        className="absolute"
        style={{ top: 10, left: 14, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          <rect
            x={0}
            y={0}
            width={bw}
            height={bh}
            rx={10}
            ry={10}
            fill="#141418"
            stroke="#2e2e34"
            strokeWidth={1}
          />
          <SvgLens cx={15} cy={13} r={8.5} gradId={`${ns}-l1`} />
          <SvgLens cx={15} cy={35} r={7.5} gradId={`${ns}-l2`} />
          <SvgLens cx={15} cy={54} r={7.5} gradId={`${ns}-l3`} />
          <FlashDot cx={24} cy={54} />
        </svg>
      </div>
    );
  }

  if (camera === "pixel-bar-triple") {
    // Full-width horizontal bar
    const bw = width - 20;
    const bh = 32;
    return (
      <div
        className="absolute"
        style={{ top: 10, left: 10, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          <rect
            x={0}
            y={0}
            width={bw}
            height={bh}
            rx={10}
            ry={10}
            fill="#111115"
            stroke="#2a2a30"
            strokeWidth={1}
          />
          <SvgLens cx={22} cy={16} r={10} gradId={`${ns}-l1`} />
          <SvgLens cx={50} cy={16} r={8} gradId={`${ns}-l2`} />
          <SvgLens cx={74} cy={16} r={8} gradId={`${ns}-l3`} />
          <FlashDot cx={bw - 16} cy={16} />
        </svg>
      </div>
    );
  }

  if (camera === "pixel-bar-dual") {
    const bw = width - 20;
    const bh = 28;
    return (
      <div
        className="absolute"
        style={{ top: 10, left: 10, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          <rect
            x={0}
            y={0}
            width={bw}
            height={bh}
            rx={9}
            ry={9}
            fill="#111115"
            stroke="#2a2a30"
            strokeWidth={1}
          />
          <SvgLens cx={20} cy={14} r={9} gradId={`${ns}-l1`} />
          <SvgLens cx={46} cy={14} r={8} gradId={`${ns}-l2`} />
          <FlashDot cx={bw - 16} cy={14} />
        </svg>
      </div>
    );
  }

  if (camera === "oneplus-circle") {
    // Large circular housing, 3 lenses in triangle
    const r = 26;
    const bw = r * 2 + 4;
    const bh = r * 2 + 4;
    return (
      <div
        className="absolute"
        style={{ top: 10, right: 14, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          <circle cx={r + 2} cy={r + 2} r={r + 2} fill="#0c0c10" />
          <circle
            cx={r + 2}
            cy={r + 2}
            r={r}
            fill="#181820"
            stroke="#2a2a35"
            strokeWidth={1.5}
          />
          {/* Triangle: top-center, bottom-left, bottom-right */}
          <SvgLens cx={r + 2} cy={14} r={8.5} gradId={`${ns}-l1`} />
          <SvgLens cx={14} cy={38} r={7.5} gradId={`${ns}-l2`} />
          <SvgLens cx={r + 2 + 14} cy={38} r={7.5} gradId={`${ns}-l3`} />
          <FlashDot cx={r + 2 + 12} cy={14} />
        </svg>
      </div>
    );
  }

  if (camera === "xiaomi-ultra") {
    // Very large circular housing with thick metallic ring + LEICA text
    const r = 30;
    const bw = r * 2 + 4;
    const bh = r * 2 + 4;
    return (
      <div
        className="absolute"
        style={{ top: 8, right: 12, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          {/* Outer metallic ring */}
          <circle cx={r + 2} cy={r + 2} r={r + 2} fill="#3a3a42" />
          <circle cx={r + 2} cy={r + 2} r={r} fill="#222228" />
          <circle
            cx={r + 2}
            cy={r + 2}
            r={r - 4}
            fill="#141418"
            stroke="#2a2a32"
            strokeWidth={1}
          />
          {/* Main large lens centered */}
          <SvgLens cx={r + 2} cy={r + 2} r={14} gradId={`${ns}-l1`} />
          {/* Two flanking small lenses */}
          <SvgLens cx={14} cy={r + 2} r={7} gradId={`${ns}-l2`} />
          <SvgLens cx={bw - 14} cy={r + 2} r={7} gradId={`${ns}-l3`} />
          {/* LEICA text */}
          <text
            x={r + 2}
            y={bh - 8}
            textAnchor="middle"
            fontSize="5"
            fontFamily="Arial"
            fontWeight="bold"
            fill="rgba(255,255,255,0.5)"
            letterSpacing="1"
          >
            LEICA
          </text>
        </svg>
      </div>
    );
  }

  if (camera === "xiaomi-triple") {
    // Rounded square bump, L-shape lenses
    const bw = 48;
    const bh = 48;
    return (
      <div
        className="absolute"
        style={{ top: 10, right: 12, width: bw, height: bh }}
      >
        <svg
          width={bw}
          height={bh}
          viewBox={`0 0 ${bw} ${bh}`}
          role="img"
          aria-label="Camera module"
        >
          <rect
            x={0}
            y={0}
            width={bw}
            height={bh}
            rx={14}
            ry={14}
            fill="#141418"
            stroke="#2e2e34"
            strokeWidth={1}
          />
          {/* Large top-left */}
          <SvgLens cx={15} cy={15} r={10} gradId={`${ns}-l1`} />
          {/* Smaller bottom-left */}
          <SvgLens cx={15} cy={36} r={7.5} gradId={`${ns}-l2`} />
          {/* Smaller bottom-right */}
          <SvgLens cx={34} cy={36} r={7.5} gradId={`${ns}-l3`} />
          <FlashDot cx={36} cy={15} />
        </svg>
      </div>
    );
  }

  // Fallback
  const bw = 30;
  const bh = 46;
  return (
    <div
      className="absolute"
      style={{ top: 10, right: 14, width: bw, height: bh }}
    >
      <svg
        width={bw}
        height={bh}
        viewBox={`0 0 ${bw} ${bh}`}
        role="img"
        aria-label="Camera module"
      >
        <rect
          x={0}
          y={0}
          width={bw}
          height={bh}
          rx={10}
          ry={10}
          fill="#141418"
        />
        <SvgLens cx={15} cy={13} r={8} gradId={`${ns}-l1`} />
        <SvgLens cx={15} cy={33} r={8} gradId={`${ns}-l2`} />
      </svg>
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
    return (
      <>
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

  // iphone
  return (
    <>
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
  const shape = useMemo(() => getPhoneShape(phoneModel), [phoneModel]);
  const patternBg = useMemo(
    () => getPatternBackground(patternId, colorHex),
    [patternId, colorHex],
  );
  const textureStyle = useMemo(() => getTextureOverlay(textureId), [textureId]);
  const isSpeckled = patternId === "speckled";

  const { width, height } = shape.size;

  return (
    <div
      className="relative"
      style={{ width, height, transition: "all 0.3s ease" }}
    >
      {/* Main case body */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: shape.cornerRadius,
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Color + Pattern layer */}
        {isSpeckled ? (
          <div
            className="absolute inset-0"
            style={{ background: colorHex, transition: "background 0.3s ease" }}
          >
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
          <div
            className="absolute inset-0"
            style={{
              background: patternBg,
              transition: "background 0.3s ease",
            }}
          />
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
  const labelKey = `${phoneModel}-${color.id}-${texture.id}-${patternId}`;

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

      {/* Phone Case Preview — no key prop, CSS transition handles smooth updates */}
      <div className="flex-1 flex items-center justify-center w-full py-4">
        <PhoneCaseSVG
          colorHex={color.hex}
          textureId={texture.id}
          patternId={patternId}
          phoneModel={phoneModel}
        />
      </div>

      {/* Variant label */}
      <div className="mb-4 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${labelKey}-label`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`text-sm font-semibold ${
              isAiMode ? "text-white/90" : "text-foreground"
            }`}
          >
            {texture.name} ·{" "}
            {typeof pattern === "string"
              ? pattern
              : (pattern as { name: string }).name}
          </motion.p>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${labelKey}-color`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
        </AnimatePresence>
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
