export type Locale = "es" | "en";

export const LOCALES: Locale[] = ["es", "en"];

export type StringSet = {
  site: { title: string; subtitle: string };
  form: {
    nameLabel: string;
    namePlaceholder: string;
    tagLabel: string;
    tagPlaceholder: string;
    photoLabel: string;
    photoCapture: string;
    photoUpload: string;
    photoRetake: string;
    photoChange: string;
    download: string;
    downloading: string;
    generate: string;
  };
  badge: {
    cohort: string;
    accepted: string;
    headline: string;
    msgLabel: string;
    msgCourse: string;
    msgCoursePre: string;
    msgCourseHighlight: string;
    msgCoursePost: string;
    msgWelcome: string;
    watermark: string;
  };
  photo: {
    cameraHint: string;
    capture: string;
    cameraDenied: string;
    cameraUnavailable: string;
    zoom: string;
    dragHint: string;
  };
  toast: {
    downloaded: string;
    downloadFailed: string;
    photoCaptured: string;
    formIncomplete: string;
  };
  locale: { switch: string; switchAria: string };
};

export const strings: Record<Locale, StringSet> = {
  es: {
    site: {
      title: "Ethereum Lima Bootcamp — Badge",
      subtitle: "Genera tu badge de aceptación al Cohort 01",
    },
    form: {
      nameLabel: "Tu nombre",
      namePlaceholder: "Ej: Andre Neyra",
      tagLabel: "Tu rol o tag",
      tagPlaceholder: "Ej: Builder, Frontend, etc.",
      photoLabel: "Tu foto",
      photoCapture: "Tomar foto",
      photoUpload: "Subir foto",
      photoRetake: "Volver a tomar",
      photoChange: "Cambiar foto",
      download: "Descargar badge",
      downloading: "Generando…",
      generate: "Generar",
    },
    badge: {
      cohort: "Cohort 01",
      accepted: "ACEPTADO",
      headline: "Yo estoy en el",
      msgLabel: "ACEPTADO EN",
      msgCourse: "Bootcamp Primera dApp en Arbitrum",
      msgCoursePre: "Bootcamp",
      msgCourseHighlight: "Primera dApp en Arbitrum",
      msgCoursePost: "2026",
      msgWelcome: "¡Bienvenido a la comunidad!",
      watermark: "ETH·LIMA·BOOTCAMP",
    },
    photo: {
      cameraHint: "Centra tu rostro",
      capture: "Capturar",
      cameraDenied: "Permiso de cámara denegado. Sube una foto en su lugar.",
      cameraUnavailable: "Cámara no disponible en este dispositivo.",
      zoom: "Zoom",
      dragHint: "Arrastra para reposicionar",
    },
    toast: {
      downloaded: "Badge descargado",
      downloadFailed: "No se pudo generar el badge",
      photoCaptured: "Foto capturada",
      formIncomplete: "Completa nombre y foto primero",
    },
    locale: {
      switch: "EN",
      switchAria: "Cambiar a inglés",
    },
  },
  en: {
    site: {
      title: "Ethereum Lima Bootcamp — Badge",
      subtitle: "Generate your Cohort 01 acceptance badge",
    },
    form: {
      nameLabel: "Your name",
      namePlaceholder: "e.g. Andre Neyra",
      tagLabel: "Your role or tag",
      tagPlaceholder: "e.g. Builder, Frontend, etc.",
      photoLabel: "Your photo",
      photoCapture: "Take photo",
      photoUpload: "Upload photo",
      photoRetake: "Retake",
      photoChange: "Change photo",
      download: "Download badge",
      downloading: "Generating…",
      generate: "Generate",
    },
    badge: {
      cohort: "Cohort 01",
      accepted: "ACCEPTED",
      headline: "I'm at the",
      msgLabel: "ACCEPTED INTO",
      msgCourse: "Bootcamp First dApp on Arbitrum",
      msgCoursePre: "Bootcamp",
      msgCourseHighlight: "First dApp on Arbitrum",
      msgCoursePost: "2026",
      msgWelcome: "Welcome to the community!",
      watermark: "ETH·LIMA·BOOTCAMP",
    },
    photo: {
      cameraHint: "Center your face",
      capture: "Capture",
      cameraDenied: "Camera permission denied. Upload a photo instead.",
      cameraUnavailable: "Camera not available on this device.",
      zoom: "Zoom",
      dragHint: "Drag to reposition",
    },
    toast: {
      downloaded: "Badge downloaded",
      downloadFailed: "Could not generate badge",
      photoCaptured: "Photo captured",
      formIncomplete: "Complete name and photo first",
    },
    locale: {
      switch: "ES",
      switchAria: "Switch to Spanish",
    },
  },
};
