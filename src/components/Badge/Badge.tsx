import { forwardRef, type CSSProperties } from "react";
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
        <span className={styles.nameText}>{displayName}</span>
      </div>

      <div className={styles.nickPill}>
        <span className={styles.nickText}>{tagText}</span>
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
        src={new URL("arrow-circle.svg", import.meta.env.BASE_URL).href}
        alt=""
        className={styles.arrowCircle}
        draggable={false}
      />

      <div className={styles.footerLogos}>
        <img
          src={new URL("logo-eth-lima.svg", import.meta.env.BASE_URL).href}
          alt="Ethereum Lima"
          className={styles.footerLogoEth}
          draggable={false}
        />
        <img
          src={new URL("logo-arbitrum.svg", import.meta.env.BASE_URL).href}
          alt="Arbitrum"
          className={styles.footerLogoArb}
          draggable={false}
        />
      </div>
    </div>
  );
});
