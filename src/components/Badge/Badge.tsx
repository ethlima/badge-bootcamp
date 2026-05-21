import { forwardRef, useEffect, useState, type CSSProperties } from "react";
import { useT } from "../../i18n/I18nContext";
import type { PhotoCrop } from "../../types";
import bootcampLogoSvg from "./logo-bootcamp.svg?raw";
import smileySvg from "./smiley.svg?raw";
import regaloSvg from "./regalo.svg?raw";
import styles from "./Badge.module.css";

/* The visible photo slot is 360.6px wide in preview (601 canvas * 0.6).
   The photo is rendered as a square sized PHOTO_SLOT_SIZE * scale, so we
   pick 366 (>360.6) to guarantee horizontal coverage and avoid a 0.6px
   sub-pixel gap that would otherwise expose the slot's gray bg. */
const PHOTO_SLOT_SIZE = 366;

/* Pill internals in canvas units (matches Badge.module.css spec):
   namePill: 600 wide, 32 padding each side → 536 usable
   nickPill: same width/padding → 536 usable
   Font sizes match the .nameText / .nickText CSS declarations. */
const PILL_INNER = 600 - 2 * 32;
const BADGE_FONT = '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';

const measureCanvas =
  typeof document !== "undefined" ? document.createElement("canvas") : null;
const measureCtx = measureCanvas?.getContext("2d") ?? null;

function measureText(text: string, fontSize: number, fontWeight: number): number {
  if (!measureCtx) return 0;
  measureCtx.font = `${fontWeight} ${fontSize}px ${BADGE_FONT}`;
  return measureCtx.measureText(text).width;
}

function fitStyle(text: string, fontSize: number, fontWeight: number): CSSProperties {
  const w = measureText(text, fontSize, fontWeight);
  if (w <= 0 || w <= PILL_INNER) return {};
  return {
    transform: `scale(${PILL_INNER / w})`,
    transformOrigin: "left center",
  };
}

type Props = {
  name: string;
  tag: string;
  photo: PhotoCrop | null;
};

function getPhotoStyle(photo: PhotoCrop): CSSProperties {
  const offsetX = photo.offsetXPct * PHOTO_SLOT_SIZE;
  const offsetY = photo.offsetYPct * PHOTO_SLOT_SIZE;
  const eff = PHOTO_SLOT_SIZE * photo.scale;
  return {
    width: `${eff}px`,
    height: `${eff}px`,
    transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`,
  };
}

function formatTag(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "@nickname";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export const Badge = forwardRef<HTMLDivElement, Props>(function Badge(
  { name, tag, photo },
  ref
) {
  const t = useT();
  const isEN = t.locale.switch === "ES";
  const displayName = name.trim() || (isEN ? "Your name" : "Tu nombre");
  const tagText = formatTag(tag);

  // Inter loads via Google Fonts with display=swap, so initial canvas
  // measureText may use fallback metrics. Re-render once fonts are ready
  // so the auto-fit scale is correct for the actually-rendered font.
  const [, setFontsLoaded] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts?.ready) return;
    document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  return (
    <div ref={ref} className={styles.badge}>
      {/* Background colors */}
      <div className={styles.bgTop} aria-hidden="true" />
      <div className={styles.bgBottom} aria-hidden="true" />

      {/* Decorations behind the photo column */}
      <div className={styles.limeRing} aria-hidden="true" />
      <div
        className={styles.regalo}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: regaloSvg }}
      />
      <div
        className={styles.bootcampLogo}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: bootcampLogoSvg }}
      />

      {/* Right-side decorations */}
      <div className={styles.checker} aria-hidden="true">
        <span data-c="lime" />
        <span data-c="blue" />
        <span data-c="lime" />
        <span data-c="blue" />
        <span data-c="lime" />
        <span data-c="blue" />
      </div>
      <div className={styles.cyanSphere} aria-hidden="true" />
      <div
        className={styles.smiley}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: smileySvg }}
      />

      {/* Cream-zone left ribbon */}
      <div className={styles.yellowBar} aria-hidden="true" />

      {/* Foreground content */}
      <span className={styles.headline}>{t.badge.headline}</span>

      <div className={styles.photoSlot}>
        <div className={styles.photoPlaceholder}>
          <svg
            className={styles.photoPlaceholderIcon}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="32" cy="24" r="11" fill="currentColor" />
            <path
              d="M10 56c0-12.15 9.85-22 22-22s22 9.85 22 22"
              fill="currentColor"
            />
          </svg>
          <span className={styles.photoPlaceholderLabel}>
            {t.form.photoLabel}
          </span>
        </div>
        {photo && (
          <img
            src={photo.src}
            alt=""
            className={styles.photo}
            style={getPhotoStyle(photo)}
            draggable={false}
          />
        )}
      </div>

      <div className={styles.namePill}>
        <span className={styles.nameText} style={fitStyle(displayName, 64, 300)}>
          {displayName}
        </span>
      </div>

      <div className={styles.nickPill}>
        <span className={styles.nickText} style={fitStyle(tagText, 40, 500)}>
          {tagText}
        </span>
      </div>

      <div className={styles.message}>
        <span className={styles.msgLabel}>{t.badge.msgLabel}</span>
        <span className={styles.msgPre}>{t.badge.msgCoursePre}</span>
        <span className={styles.msgBrand}>{t.badge.msgCourseHighlight}</span>
        <span className={styles.msgWelcome}>
          {t.badge.msgWelcome} <span aria-hidden="true">🎉</span>
        </span>
      </div>

      <img
        src={`${import.meta.env.BASE_URL}arrow-circle.svg`}
        alt=""
        className={styles.arrowCircle}
        draggable={false}
      />

      <div className={styles.footerLogos}>
        <img
          src={`${import.meta.env.BASE_URL}logo-eth-lima.svg`}
          alt="Ethereum Lima"
          className={styles.footerLogoEth}
          draggable={false}
        />
        <img
          src={`${import.meta.env.BASE_URL}logo-arbitrum.svg`}
          alt="Arbitrum"
          className={styles.footerLogoArb}
          draggable={false}
        />
      </div>
    </div>
  );
});
