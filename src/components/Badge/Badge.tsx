import { forwardRef, type CSSProperties } from "react";
import { useT } from "../../i18n/I18nContext";
import type { PhotoCrop } from "../../types";
import styles from "./Badge.module.css";

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

export const Badge = forwardRef<HTMLDivElement, Props>(function Badge(
  { name, tag, photo },
  ref
) {
  const t = useT();
  const isEN = t.locale.switch === "ES";
  const displayName = name.trim() || (isEN ? "Your name" : "Tu nombre");
  const displayTag = tag.trim();
  const tagFallback = isEN ? "@nickname" : "@nickname";
  const tagText = displayTag
    ? displayTag.startsWith("@")
      ? displayTag
      : `@${displayTag}`
    : tagFallback;

  return (
    <div ref={ref} className={styles.badge}>
      <img
        src="/badge-bootcamp.svg"
        alt=""
        className={styles.template}
        draggable={false}
      />

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
        src="/arrow-circle.svg"
        alt=""
        className={styles.arrowCircle}
        draggable={false}
      />

      <div className={styles.footerLogos}>
        <img
          src="/logo-eth-lima.svg"
          alt="Ethereum Lima"
          className={styles.footerLogoEth}
          draggable={false}
        />
        <img
          src="/logo-arbitrum.svg"
          alt="Arbitrum"
          className={styles.footerLogoArb}
          draggable={false}
        />
      </div>
    </div>
  );
});
