# badge-bootcamp

Generador del badge de aceptación al **Bootcamp Primera dApp en Arbitrum**
de Ethereum Lima — Cohort 01 / 2026.

Cada participante sube/captura su foto, escribe nombre y nickname, y
descarga su badge personalizado en formato Instagram (1080×1350).

## Stack

- **React 19** + **TypeScript** + **Vite 8**
- **html-to-image** para rasterizar el badge a PNG en el navegador
- **CSS Modules** para estilos componente-por-componente
- **Inter** vía Google Fonts
- i18n propio (ES/EN, persiste en `localStorage`)

## Comandos

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # tsc -b && vite build → ./dist
pnpm preview      # sirve el build local
pnpm lint
```

## Arquitectura

### Layout

```
src/
├── App.tsx                    Shell: sidebar + preview + modal de cámara
├── App.module.css
├── components/
│   ├── Badge/                 Composición del badge final (1080×1350)
│   │   ├── Badge.tsx
│   │   ├── Badge.module.css
│   │   ├── logo-bootcamp.svg  Logo "BootCamp" curvo (lima)
│   │   ├── smiley.svg         Cara del personaje (5 paths)
│   │   └── regalo.svg         Pétalos + zigzag decorativos
│   ├── Button/                4 variantes: primary, accent, secondary, ghost
│   ├── Field/                 Input + label + counter de caracteres
│   ├── PhotoCapture/          Modal centrado con cámara web (createPortal)
│   ├── PhotoCropper/          Crop con drag + zoom slider
│   └── Toast/                 Provider con stack de notificaciones
├── i18n/                      ES/EN, autodetect via navigator.language
├── styles/tokens.css          Paleta + tipografías + radii
└── types.ts                   PhotoCrop con offset/scale normalizado
```

### Composición del badge

El badge mide **1080×1350** (aspect ratio del IG post). Se renderiza en
preview a `--bs: 0.6` (648×810) y se captura a `pixelRatio: 2`.

La composición está hecha con **capas DOM (divs) + 3 SVGs inline pequeños**
para las formas con curvas:

| Capa | Tipo | Z-index | Notas |
|------|------|---------|-------|
| `bgTop` (navy) | div | 0 | Mitad superior, top corners redondeados |
| `bgBottom` (cream) | div | 1 | Mitad inferior, bottom corners |
| `limeRing` | div | 0 | Anillo decorativo (border-radius 50%) |
| `regalo.svg` | inline SVG | 1 | Pétalos + zigzag (curvas) |
| `logo-bootcamp.svg` | inline SVG | 1 | "BootCamp" lima (typography) |
| `headline` | text | 1 | "Yo estoy en el" (locale-aware) |
| `photoSlot` | div + img | 1 | Placeholder gris + foto del user |
| `checker` (3×2) | grid divs | 2 | Patrón geométrico derecho |
| `yellowBar` | div | 2 | Banda amarilla cream-zone |
| `namePill` (blue) | div + span | 2 | Nombre sobre azul, texto lima |
| `nickPill` (lime) | div + span | 2 | Nickname sobre lima, texto navy |
| `cyanSphere` | div | 3 | Círculo celeste (border-radius 50%) |
| `smiley.svg` | inline SVG | 4 | Cara con sonrisa (curva) |
| `message` | text | 3 | "ACEPTADO EN / Bootcamp / Primera dApp en Arbitrum" |
| `arrowCircle` | `<img>` | 3 | Flecha bottom-right |
| `footerLogos` | `<img>` | 3 | Eth Lima + Arbitrum |

Toda coordenada interna se expresa en unidades del canvas (1080×1350) y
se escala con `calc(<n>px * var(--bs))`. Cambiar `--bs` en `.badge` reescala
todo proporcionalmente.

### Captura del PNG

`captureRef` apunta a un wrapper transparente con padding (`captureFrame`).
`html-to-image` lo serializa con `backgroundColor: #fff8d8` para que el
PNG tenga un margen cream alrededor del badge, listo para postear.

### Foto

Flow:
1. Click en **Cámara** abre `PhotoCapture` como modal portaleado al body
   (centro de pantalla, no en sidebar). La cámara solo se activa al abrir.
2. O **Subir foto** abre file picker con `accept="image/*"`.
3. Después, `PhotoCropper` permite drag para reposicionar y slider para zoom
   (1×–3×). Las offsets se guardan como porcentajes `[-1, 1]` en
   `PhotoCrop.offsetXPct` / `offsetYPct`, así son independientes del tamaño
   final del slot.

## Paleta

```
--cream:  #fff8d8   --ink:   #112a59
--blue:   #214afe   --lime:  #c6f42d
--coral:  #ff461d   --yellow: #faed00
```

Helvetica Neue del Figma original se sustituyó por **Inter** (Google Fonts,
casi indistinguible y libre).

## i18n

Strings en `src/i18n/strings.ts`. Toggle flotante arriba a la derecha
cambia entre ES/EN — afecta el headline del badge ("Yo estoy en el" ↔
"I'm at the"), el mensaje de aceptación, los placeholders y las labels
del formulario.

## Deploy

`pnpm build` → `dist/`. Cualquier hosting estático (Vercel, Netlify, GitHub
Pages, Cloudflare Pages) sirve.
