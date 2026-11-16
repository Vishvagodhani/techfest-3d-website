# TECHFEST — Enter the Next Dimension

## About
An interactive, scroll-driven 3D website for **Techfest**, a science and technology festival. A single Three.js scene is explored by one continuous camera path: from a metallic technology core, through an innovation cube, a robotics / AI / space triad and a rotatable showcase machine, into a ring tunnel and a final portal. Built from scratch with plain HTML, CSS and JavaScript — no framework and no build step.

## Features
- Interactive 3D hero with a metallic core that reacts to the mouse and to scrolling
- Scroll-driven 3D experience: one connected scene instead of separate sections
- Interactive objects: a cube whose parts react on hover, three technology objects (Robotics, AI, Space) that move forward on hover, and a showcase machine with four inspectable modules
- Dynamic camera movement, with lighting, fog and background shifting from section to section
- Mouse interactions: parallax, hover responses, and drag-to-rotate on the showcase machine
- Smooth transitions and reveal animations (respects `prefers-reduced-motion`)
- Responsive design for desktop, laptop, tablet and mobile
- Mobile support: lower geometry detail, fewer particles, capped pixel ratio, re-framed camera and a full-screen menu
- Graceful fallback when WebGL is unavailable or the context is lost

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- [Three.js](https://threejs.org/) r128, loaded from the cdnjs CDN
- Google Fonts: Archivo and JetBrains Mono

## Project Structure
```
techfest-3d-website/
├── index.html      Page markup and content; loads the CSS, Three.js (CDN) and main.js
├── css/
│   └── style.css   All layout, typography, responsive rules and transitions
├── js/
│   └── main.js     UI logic, the Three.js scene, scroll-to-camera mapping and interactions
├── assets/         Reserved for future images or models (the site currently needs none)
├── .gitignore
└── README.md
```

## How to Run
No build step is required. The project is plain HTML, CSS and JavaScript, with Three.js and the fonts loaded from public CDNs, so you need an internet connection the first time.

**Quickest:** download or clone the repository and open `index.html` in your browser.

**Recommended (local server):**
```bash
# Python 3
python -m http.server 8000
# or Node.js
npx serve
```
Then open `http://localhost:8000`.

**GitHub Pages:** push the repository, then go to *Settings → Pages* and deploy from the `main` branch root.

## Browser Support
Modern browsers with WebGL: current versions of Chrome, Edge, Firefox and Safari (desktop and mobile). If WebGL is unavailable, the page falls back to a static background with all content still readable.
