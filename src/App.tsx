import { useCallback, useRef, useState, type ChangeEvent } from "react";
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
  const { t, toggleLocale } = useI18n();
  const { show } = useToast();

  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [photo, setPhoto] = useState<PhotoCrop | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const badgeRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (src: string) => {
    setPhoto({ src, ...DEFAULT_CROP });
    setCameraOpen(false);
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto({ src: reader.result as string, ...DEFAULT_CROP });
      show(t.toast.photoCaptured, "success");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropChange = useCallback((next: Omit<PhotoCrop, "src">) => {
    setPhoto((prev) => (prev ? { ...prev, ...next } : prev));
  }, []);

  const handleResetPhoto = () => setPhoto(null);

  const canDownload = name.trim().length > 0 && photo !== null;

  const handleDownload = async () => {
    const target = captureRef.current ?? badgeRef.current;
    if (!target) return;
    if (!canDownload) {
      show(t.toast.formIncomplete, "error");
      return;
    }
    setIsDownloading(true);
    try {
      if (document.fonts?.ready) await document.fonts.ready;

      const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#fff8d8",
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

  return (
    <div className={styles.shell}>
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
            <img
              src="/logo.webp"
              alt="Ethereum Lima"
              className={styles.brandLogo}
              draggable={false}
            />
            <h1 className={styles.h1}>{t.site.title}</h1>
            <span className={styles.subtitle}>{t.site.subtitle}</span>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>
              <span className={styles.stepNum}>1</span>
              Info
            </span>
            <div className={styles.fieldGroup}>
              <Field
                id="name"
                label={t.form.nameLabel}
                placeholder={t.form.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={18}
                autoComplete="off"
              />
              <Field
                id="tag"
                label={t.form.tagLabel}
                placeholder={t.form.tagPlaceholder}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                maxLength={23}
              />
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>
              <span className={styles.stepNum}>2</span>
              {t.form.photoLabel}
            </span>
            {!photo ? (
              <div className={styles.photoButtons}>
                <Button
                  variant="accent"
                  onClick={() => setCameraOpen(true)}
                >
                  ◉ {t.form.photoCapture}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  ↑ {t.form.photoUpload}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className={styles.fileInput}
                />
              </div>
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

          <div className={styles.actions}>
            <Button
              variant="primary"
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
          <div ref={captureRef} className={styles.captureFrame}>
            <div className={styles.badgeWrap}>
              <Badge ref={badgeRef} name={name} tag={tag} photo={photo} />
            </div>
          </div>
          <span className={styles.previewLabel}>
            {t.locale.switch === "ES" ? "LIVE PREVIEW" : "VISTA EN VIVO"}
          </span>
        </main>
      </div>

      <PhotoCapture
        open={cameraOpen}
        onCapture={handleCapture}
        onClose={() => setCameraOpen(false)}
      />
    </div>
  );
}

export default App;
