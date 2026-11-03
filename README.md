# Space Gear Stories — React Welcome Page V8

An updated professional React/Vite landing page. The old intro, Discovery Collection, and closing quote have been removed. This version includes a responsive cinematic globe, short About, interactive feature selector, NASA mission timeline, luminous selectable discovery cards, narrative How It Works, Create Account entry, and footer.

## Run

Install Node.js 20+, open a terminal in this folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Real accounts

Firebase Email/Password Authentication is implemented but **does not work until you connect your own Firebase project**. Copy `.env.example` to `.env` and fill in your Firebase project web-app values, then enable **Authentication → Sign-in method → Email/Password** in Firebase. Restart the dev server. The API key is a public Firebase web config value, not an admin secret. Configure Firebase security rules separately for any user data you add.

Without configuration the form explains the required setup; it will **never pretend an account has been created**.

## Boundaries

- This delivers the **welcome website**. The full animated storytelling game and webcam gesture console are **not implemented**. A signed-in user sees an honest adventure handoff preview.
- Featured NASA mission information links to NASA for verification; the stylized mission-card artwork is illustrative, not an official NASA image.
- The Earth hero uses a self-contained supplied cinematic background and 3D Earth model; the 3D globe uses a locally packaged texture.
- On opening, scroll reveal animations use GSAP ScrollTrigger. Discovery cards glow and reveal source-credited descriptions when selected.

## Build

```bash
npm run build
npm run preview
```

Use HTTPS or localhost for future webcam gesture controls.


## V8 hero correction
The inaccurate flat-green 3D globe has been removed. The cinematic Earth asset provides the realistic appearance, with GSAP-powered pointer parallax, opening camera-style movement, scroll depth, and a clickable Apollo mission signal. This is a 2.5D scene, not a physically accurate rotating 3D globe. The full hand-tracking adventure remains a separate module.
