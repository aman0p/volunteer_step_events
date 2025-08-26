import { HexColorInput, HexColorPicker } from "react-colorful";
import { useMemo, useRef, useState } from "react";
import { hexToRgba } from "@/lib/utils";

interface Props {
  value?: string; // Expect a hex color with leading '#', e.g. '#ff0000'
  onPickerChange: (color: string) => void; // Emits hex with leading '#'
}

const normalizeWithHash = (hex?: string) => {
  if (!hex) return "#ffffff"; // neutral default for internal picker, not shown as selection
  return hex.startsWith("#") ? hex : `#${hex}`;
};

const stripHash = (hex?: string) => (hex?.startsWith("#") ? hex.slice(1) : hex ?? "");

const ColorPicker = ({ value, onPickerChange }: Props) => {
  const colorWithHash = useMemo(() => normalizeWithHash(value), [value]);
  const [fallbackColor, setFallbackColor] = useState("#ffffff");
  const hiddenColorInputRef = useRef<HTMLInputElement | null>(null);
  const dynamicBorderColor = useMemo(() => {
    return value && /^#([A-Fa-f0-9]{6})$/.test(colorWithHash)
      ? (hexToRgba(colorWithHash, 0.2) as string)
      : undefined;
  }, [value, colorWithHash]);

  const handleHexInputChange = (hexNoHash: string) => {
    const next = normalizeWithHash(hexNoHash);
    onPickerChange(next);
  };

  const handlePickerChange = (hexWithHash: string) => {
    onPickerChange(normalizeWithHash(hexWithHash));
  };

  const openEyedropper = async () => {
    // EyeDropper works only under secure context (https or localhost) and with user activation
    const isSecure = window.isSecureContext || location.hostname === "localhost";
    const hasUserActivation = (navigator as any).userActivation?.isActive ?? true;
    const EyeDropperCtor = (globalThis as any).EyeDropper as
      | (new () => { open: () => Promise<{ sRGBHex: string }> })
      | undefined;

    if (isSecure && hasUserActivation && EyeDropperCtor) {
      try {
        const eyeDropper = new EyeDropperCtor();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          onPickerChange(normalizeWithHash(result.sRGBHex));
          setFallbackColor(normalizeWithHash(result.sRGBHex));
        }
        return;
      } catch (err) {
        // User may cancel with ESC or click; silently fall back
        // console.debug("EyeDropper canceled or failed", err);
      }
    }

    // Fallback: programmatically click a hidden <input type="color">
    if (hiddenColorInputRef.current) {
      hiddenColorInputRef.current.click();
    } else {
      // As a final fallback, do nothing; the user can still type the hex manually
      // alert can be too intrusive, so we avoid it here.
    }
  };

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1 border border-gray-300 rounded-md px-2 py-1 bg-gray-50"
          style={{ borderColor: dynamicBorderColor }}
        >
          <span className="text-sm text-gray-500">#</span>
          <HexColorInput
            color={stripHash(value)}
            onChange={handleHexInputChange}
            className="hex-input bg-transparent outline-none text-sm w-24"
          />
        </div>

        <button
          type="button"
          onClick={openEyedropper}
          className="inline-flex items-center gap-1 rounded-md border bg-white px-2 py-1 text-xs hover:bg-gray-50"
          style={{ borderColor: dynamicBorderColor ?? undefined }}
          title="Pick color from screen"
        >
          <span
            className="inline-block h-3 w-3 rounded border border-gray-300"
            style={{ backgroundColor: value ? colorWithHash : "transparent" }}
          />
          Eyedropper
        </button>

        {/* Hidden color input as a universal fallback */}
        <input
          ref={hiddenColorInputRef}
          type="color"
          value={fallbackColor}
          onChange={(e) => {
            const next = normalizeWithHash(e.target.value);
            setFallbackColor(next);
            onPickerChange(next);
          }}
          className="hidden"
          aria-hidden
          tabIndex={-1}
        />
      </div>

      {/* <div className="rounded-md border border-gray-300" style={{ borderColor: dynamicBorderColor }}>
        <HexColorPicker color={value ? colorWithHash : "#ffffff"} onChange={handlePickerChange} />
      </div> */}
    </div>
  );
};

export default ColorPicker;
