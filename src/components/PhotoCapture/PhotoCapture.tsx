import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Button } from "../Button/Button";
import { useT } from "../../i18n/I18nContext";
import { useToast } from "../Toast/Toast";
import styles from "./PhotoCapture.module.css";

type Props = {
  onCapture: (dataUrl: string) => void;
};

type CameraError = "denied" | "unavailable" | null;

export function PhotoCapture({ onCapture }: Props) {
  const t = useT();
  const { show } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<CameraError>(null);

  useEffect(() => {
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
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const stopStream = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

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
    stopStream();
    onCapture(dataUrl);
    show(t.toast.photoCaptured, "success");
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      stopStream();
      onCapture(reader.result as string);
      show(t.toast.photoCaptured, "success");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className={styles.wrap}>
      {error ? (
        <div className={styles.placeholder}>
          {error === "denied" ? t.photo.cameraDenied : t.photo.cameraUnavailable}
        </div>
      ) : (
        <div className={styles.videoWrap}>
          <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
          <span className={styles.guideline} aria-hidden="true" />
          <div className={styles.hint}>
            <span className={styles.hintText}>{t.photo.cameraHint}</span>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        {!error && (
          <Button variant="accent" onClick={handleCapture} disabled={!stream}>
            ● {t.photo.capture}
          </Button>
        )}
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
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
    </div>
  );
}
