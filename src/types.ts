export type PhotoCrop = {
  src: string;
  offsetXPct: number;
  offsetYPct: number;
  scale: number;
};

export const DEFAULT_CROP: Omit<PhotoCrop, "src"> = {
  offsetXPct: 0,
  offsetYPct: 0,
  scale: 1,
};
