import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Badge } from "./components/Badge/Badge";
import { Button } from "./components/Button/Button";
import { Field } from "./components/Field/Field";
import { PhotoCapture } from "./components/PhotoCapture/PhotoCapture";
import { PhotoCropper } from "./components/PhotoCropper/PhotoCropper";
import { useToast } from "./components/Toast/Toast";
import { useI18n } from "./i18n/I18nContext";
import { DEFAULT_CROP, type PhotoCrop } from "./types";
import styles from "./App.module.css";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function App() {
  const { t, locale, toggleLocale } = useI18n();
  const { show } = useToast();

  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [photo, setPhoto] = useState<PhotoCrop | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const badgeRef = useRef<HTMLDivElement>(null);

  const handleCapture = (src: string) => {
    setPhoto({ src, ...DEFAULT_CROP });
  };

  const handleCropChange = useCallback((next: Omit<PhotoCrop, "src">) => {
    setPhoto((prev) => (prev ? { ...prev, ...next } : prev));
  }, []);

  const handleResetPhoto = () => setPhoto(null);

  const canDownload = name.trim().length > 0 && photo !== null;

  const handleDownload = async () => {
    if (!badgeRef.current) return;
    if (!canDownload) {
      show(t.toast.formIncomplete, "error");
      return;
    }
    setIsDownloading(true);
    try {
      if (document.fonts?.ready) await document.fonts.ready;

      const dataUrl = await toPng(badgeRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#112a59",
      });

      const filename = `eth-lima-badge-${slugify(name) || "cohort-01"}.png`;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      show(t.toast.downloaded, "success");
    } catch (err) {
      console.error("Badge download failed", err);
      show(t.toast.downloadFailed, "error");
    } finally {
      setIsDownloading(false);
    }
  };

  const isEN = locale === "en";
  const headlineLine1 = isEN ? "Your acceptance" : "Tu badge de";
  const headlineHighlight = isEN ? "badge" : "aceptación";
  const headlineSub = "Cohort 01 · 2026";

  return (
    <div className={styles.shell}>
      {/* Floating locale toggle (no navbar) */}
      <button
        type="button"
        className={styles.localeFloat}
        onClick={toggleLocale}
        aria-label={t.locale.switchAria}
      >
        {t.locale.switch}
      </button>

      <div className={styles.body}>
        <aside className={styles.leftPanel}>
          <div className={styles.leftHeader}>
            <span className={styles.eyebrow}>ETH·LIMA · BOOTCAMP</span>
            <h1 className={styles.h1}>
              {headlineLine1}{" "}
              <span className={styles.gradientText}>{headlineHighlight}</span>
            </h1>
            <span className={styles.headlineSub}>{headlineSub}</span>
            <p className={styles.subtitle}>{t.site.subtitle}</p>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>
              <span className={styles.stepNum}>1</span>
              {t.form.photoLabel}
            </span>
            {!photo ? (
              <PhotoCapture onCapture={handleCapture} />
            ) : (
              <>
                <PhotoCropper
                  src={photo.src}
                  value={{
                    offsetXPct: photo.offsetXPct,
                    offsetYPct: photo.offsetYPct,
                    scale: photo.scale,
                  }}
                  onChange={handleCropChange}
                />
                <Button variant="ghost" onClick={handleResetPhoto}>
                  ← {t.form.photoChange}
                </Button>
              </>
            )}
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>
              <span className={styles.stepNum}>2</span>
              Info
            </span>
            <div className={styles.fieldGroup}>
              <Field
                id="name"
                label={t.form.nameLabel}
                placeholder={t.form.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={32}
                autoComplete="name"
              />
              <Field
                id="tag"
                label={t.form.tagLabel}
                placeholder={t.form.tagPlaceholder}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                maxLength={28}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              variant="accent"
              onClick={handleDownload}
              disabled={!canDownload || isDownloading}
            >
              ↓ {isDownloading ? t.form.downloading : t.form.download}
            </Button>
            {!canDownload && (
              <p className={styles.helperText}>{t.toast.formIncomplete}</p>
            )}
          </div>
        </aside>

        <main className={styles.rightPanel}>
          <div className={styles.badgeWrap}>
            <Badge ref={badgeRef} name={name} tag={tag} photo={photo} />
          </div>
          <span className={styles.previewLabel}>
            ◆ {isEN ? "LIVE PREVIEW" : "VISTA EN VIVO"} · ETH·LIMA·BOOTCAMP·2026 ◆
          </span>
        </main>
      </div>
    </div>
  );
}

export default App;
