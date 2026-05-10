import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { useT } from "../../i18n/I18nContext";
import { DEFAULT_CROP, type PhotoCrop } from "../../types";
import styles from "./PhotoCropper.module.css";

const PREVIEW_SIZE = 240;
const MIN_SCALE = 1;
const MAX_SCALE = 3;

type Props = {
  src: string;
  value?: Omit<PhotoCrop, "src">;
  onChange?: (next: Omit<PhotoCrop, "src">) => void;
};

type DragState = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startOffsetXPx: number;
  startOffsetYPx: number;
};

export function PhotoCropper({ src, value, onChange }: Props) {
  const t = useT();
  const initial = value ?? DEFAULT_CROP;

  const [scale, setScale] = useState<number>(initial.scale);
  const [offsetXPx, setOffsetXPx] = useState<number>(initial.offsetXPct * PREVIEW_SIZE);
  const [offsetYPx, setOffsetYPx] = useState<number>(initial.offsetYPct * PREVIEW_SIZE);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  const ratio = naturalSize ? naturalSize.w / naturalSize.h : 1;
  const baseW = ratio >= 1 ? PREVIEW_SIZE * ratio : PREVIEW_SIZE;
  const baseH = ratio >= 1 ? PREVIEW_SIZE : PREVIEW_SIZE / ratio;
  const effW = baseW * scale;
  const effH = baseH * scale;
  const maxOffsetX = Math.max(0, (effW - PREVIEW_SIZE) / 2);
  const maxOffsetY = Math.max(0, (effH - PREVIEW_SIZE) / 2);

  const clamp = (x: number, lim: number) => Math.max(-lim, Math.min(lim, x));

  useEffect(() => {
    setOffsetXPx((prev) => clamp(prev, maxOffsetX));
    setOffsetYPx((prev) => clamp(prev, maxOffsetY));
  }, [maxOffsetX, maxOffsetY]);

  useEffect(() => {
    if (!onChange) return;
    onChange({
      scale,
      offsetXPct: offsetXPx / PREVIEW_SIZE,
      offsetYPct: offsetYPx / PREVIEW_SIZE,
    });
  }, [scale, offsetXPx, offsetYPx, onChange]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startOffsetXPx: offsetXPx,
      startOffsetYPx: offsetYPx,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startClientX;
    const dy = e.clientY - drag.startClientY;
    setOffsetXPx(clamp(drag.startOffsetXPx + dx, maxOffsetX));
    setOffsetYPx(clamp(drag.startOffsetYPx + dy, maxOffsetY));
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
    }
  };

  const imageStyle: CSSProperties = {
    width: `${effW}px`,
    height: `${effH}px`,
    transform: `translate(calc(-50% + ${offsetXPx}px), calc(-50% + ${offsetYPx}px))`,
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.preview}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label="Photo crop preview"
      >
        <img src={src} alt="" className={styles.image} draggable={false} style={imageStyle} />
      </div>
      <div className={styles.controls}>
        <span className={styles.zoomLabel}>{t.photo.zoom}</span>
        <input
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step={0.01}
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
          className={styles.slider}
          aria-label={t.photo.zoom}
        />
      </div>
      <p className={styles.hint}>{t.photo.dragHint}</p>
    </div>
  );
}
