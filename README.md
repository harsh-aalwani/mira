# MIRA — Pure Static Marketing Website

A premium, tactile, pure static marketing website for **MIRA** — Multimodal Intelligent Retrieval & Autonomous Assistant.

Built using a refined **Claymorphism** design language: soft rounded surfaces, dual inset rim lights, multi-layered ambient shadows, pill-shaped tactile buttons, and light porcelain palettes with muted accents.

---

## 🎨 Design Philosophy: Claymorphism

- **Tactile, Physical Feel**: Surfaces mimic physical clay cards with soft top-left specular highlights (`inset 2px 2px 4px rgba(255, 255, 255, 0.85)`) and bottom-right bevel shadows (`inset -2.5px -2.5px 5px rgba(150, 160, 180, 0.12)`).
- **Spacious & Human**: Light, warm background canvas (`#f6f5f0`) avoiding dark cyberpunk AI tropes or developer dashboard clutter.
- **Micro-Interactions**: Gentle floating animations, responsive card lifts, interactive citation inspection, and multi-format synthesis tabs.

---

## 📂 File Architecture

```
mira-website/
├── index.html              # Main marketing homepage (14 core sections)
├── download.html           # Dedicated Claymorphism "Coming Soon" page
├── css/
│   ├── claymorphism.css    # Clay tokens, dual/triple inset shadows, rim lights, pill buttons
│   ├── style.css           # Typography, layouts, component styles, responsive breakpoints
│   └── animations.css      # Floating keyframes, convergence transitions, pulse, scroll reveals
├── js/
│   └── main.js             # Interactive demos: citation inspector, scattered files convergence,
│                           # cross-modal synthesis switcher, conversation replay, mobile drawer
└── README.md               # Documentation & local preview instructions
```

---

## 🚀 How to Run & Preview Locally

Since this is a **pure static website** with zero build steps or npm dependencies, you can preview it instantly:

### Method 1: Direct File Opening (Fastest)
Simply open `index.html` directly in any web browser (Chrome, Edge, Safari, Firefox).

### Method 2: Python HTTP Server
Run from the `mira-website` directory:
```bash
python -m http.server 8000
```
Then visit: [http://localhost:8000](http://localhost:8000)

### Method 3: Node.js / npx serve
```bash
npx serve .
```

---

## 🌐 Free Static Deployment

This website is 100% static and can be deployed directly to:
- **GitHub Pages**: Push repo and enable GitHub Pages in Settings.
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop the `mira-website` folder into Netlify Drop.
- **Cloudflare Pages**: Connect repo or run `npx wrangler pages deploy .`

---

## 🛡️ Truth & Privacy Compliance
- **Source of Truth**: Features directly reflect MIRA's local-first multimodal capabilities.
- **Honest Disclosures**: Clearly communicates that privacy characteristics depend on the language model and external services selected by the user.
- **Authentic CTAs**: "Download Now" navigates transparently to the dedicated Coming Soon page (`download.html`) without fake installer releases.
