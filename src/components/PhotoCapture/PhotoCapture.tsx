import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button/Button";
import { useT } from "../../i18n/I18nContext";
import { useToast } from "../Toast/Toast";
import styles from "./PhotoCapture.module.css";

type Props = {
  open: boolean;
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
};

type CameraError = "denied" | "unavailable" | null;

export function PhotoCapture({ open, onCapture, onClose }: Props) {
  const t = useT();
  const { show } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<CameraError>(null);

  useEffect(() => {
    if (!open) {
      setError(null);
      return;
    }
    let active = true;
    let acquired: MediaStream | null = null;

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("unavailable");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
        audio: false,
      })
      .then((s) => {
        if (!active) {
          s.getTracks().forEach((track) => track.stop());
          return;
        }
        acquired = s;
        setStream(s);
      })
      .catch((e: unknown) => {
        if (!active) return;
        const name = (e as { name?: string })?.name;
        setError(name === "NotAllowedError" ? "denied" : "unavailable");
      });

    return () => {
      active = false;
      if (acquired) acquired.getTracks().forEach((track) => track.stop());
      setStream(null);
    };
  }, [open]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    onCapture(dataUrl);
    show(t.toast.photoCaptured, "success");
  };

  if (!open) return null;

  const overlay = (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={t.form.photoLabel}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={t.common.close}
        >
          ×
        </button>

        {error ? (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>
              {error === "denied"
                ? t.photo.cameraDenied
                : t.photo.cameraUnavailable}
            </p>
            <Button variant="secondary" onClick={onClose}>
              {t.common.close}
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.videoWrap}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={styles.video}
              />
              <span className={styles.guideline} aria-hidden="true" />
            </div>
            <p className={styles.hintText}>{t.photo.cameraHint}</p>
            <div className={styles.actions}>
              <Button
                variant="accent"
                onClick={handleCapture}
                disabled={!stream}
              >
                ● {t.photo.capture}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
