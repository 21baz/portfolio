// /assets/app.js
// Projects grid + parallax + reveal + LiquidChrome (pure WebGL — no external libs)

// ---------------- Projects data (3 real pages) ----------------
const projects = [
  {
    title: "Real-Time Weather Dashboard",
    tag: "Data Dashboard",
    description: "Interactive Python dashboard for cleaning, analysing and visualising weather-station data with alerts and trend comparisons.",
    img: "assets/img/weather-dashboard.jpg",
    live: "https://bradford-weather-dashboard-xgg6cmuetwzafs9drjpngj.streamlit.app",
    code: "https://github.com/21baz/bradford-weather-dashboard",
    tech: ["Python", "FastAPI", "Panel", "Pandas"]
  },
  {
    title: "Tic-Tac-Toe AI",
    tag: "Web Game",
    description: "Browser game with AI difficulty levels, custom colours, dynamic game logic and win animations.",
    img: "assets/img/tictactoe.jpg",
    live: "https://21baz.github.io/tic-tac-toe-ai/",
    code: "https://github.com/21baz/tic-tac-toe-ai",
    tech: ["HTML", "CSS", "JavaScript"]
  },
  {
    title: "Sports E-Commerce Website",
    tag: "Full-Stack Web App",
    description: "Group-built sports shop with product pages, customer management and database-backed features.",
    img: "assets/img/sports-shop.jpg",
    live: "./project-sports-shop.html",
    code: "#",
    tech: ["PHP", "HTML", "CSS", "MySQL"]
  },
  {
    title: "DIGM Activity Manager",
    tag: "Java Desktop App",
    description: "Java GUI tool for viewing, editing and reassigning shared event records stored in CSV files.",
    img: "assets/img/digm-tool.jpg",
    live: "./project-digm-tool.html",
    code: "#",
    tech: ["Java", "CSV", "GUI"]
  }
];
const grid  = document.getElementById('projectGrid');
const yearEl = document.getElementById('year');

function renderProjects(items){
  const frag = document.createDocumentFragment();
  const spans = ['sp-feat', 'sp-auxTall', 'sp-wide'];

  items.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = `project-card reveal ${spans[i] || 'sp-wide'}`;

    // If the project has live+code, render project card with image + links
    if (p.live && p.code) {
    
      // Background image
      const bg = document.createElement('div');
      bg.className = 'bg';
      bg.style.backgroundImage = `url('${p.img}')`;
    
      // Meta container
      const meta = document.createElement('div');
      meta.className = 'meta';
    
      // Left side (title)
      const left = document.createElement('div');
    
      const h3 = document.createElement('h3');
      h3.textContent = p.title;
    
      left.append(h3);
    
      // Links container
      const links = document.createElement('div');
      links.className = 'project-links';
    
      // Live demo button
      const live = document.createElement('a');
      live.className = 'pill-link';
      live.href = p.live;
      live.target = '_blank';
      live.rel = 'noopener';
      live.textContent = 'Live demo →';
    
      // Code button
      const code = document.createElement('a');
      code.className = 'pill-link';
      code.href = p.code;
      code.target = '_blank';
      code.rel = 'noopener';
      code.textContent = 'Code →';
    
      links.append(live, code);
      meta.append(left, links);
    
      // Add image + content to card
      card.append(bg, meta);
    
      frag.appendChild(card);
      return;
    }

    // Otherwise render your existing “local case-study page” tile style
    const bg = document.createElement('div');
    bg.className = 'bg';
    bg.style.backgroundImage = `url('${p.img}')`;

    const meta = document.createElement('div'); 
    meta.className = 'meta';

    const left = document.createElement('div');
    const h3 = document.createElement('h3'); 
    h3.textContent = p.title;

    const sub = document.createElement('div'); 
    sub.className = 'sub'; 
    sub.textContent = p.desc || '';

    left.append(h3, sub);

    const btn = document.createElement('a');
    btn.className = 'circle-btn'; 
    btn.href = p.url; 
    btn.target = '_self';
    btn.rel = 'noopener';
    btn.setAttribute('aria-label', `Open ${p.title}`);
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" class="arrow-icon" aria-hidden="true">
        <path d="M7 12h10M13 8l4 4-4 4"/>
      </svg>
    `;

    const stretched = document.createElement('a');
    stretched.className = 'stretched';
    stretched.href = p.url; 
    stretched.target = '_self';
    stretched.rel = 'noopener';
    stretched.setAttribute('aria-label', `View ${p.title}`);

    meta.append(left, btn);
    card.append(bg, meta, stretched);
    frag.appendChild(card);
  });

  grid.innerHTML = '';
  grid.appendChild(frag);
}



// ---------------- Reveal + Parallax ----------------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.style.opacity = 1;
      e.target.style.setProperty('--ry', '0px');
      revealObserver.unobserve(e.target);
    }
  });
}, {threshold: .14});

function primeReveal(){
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = 0;
    el.style.setProperty('--ry', '16px');
    revealObserver.observe(el);
  });
}

const parallaxNodes = [];
function collectParallax(){
  parallaxNodes.length = 0;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-speed') || '0.08');
    const start = el.getBoundingClientRect().top + window.scrollY;
    parallaxNodes.push({el, speed, start});
  });
}

let ticking = false;
function onScroll(){
  if(!ticking){
    requestAnimationFrame(() => {
      const y = window.scrollY || window.pageYOffset;
      for(const {el, speed, start} of parallaxNodes){
        const delta = (y - start);
        el.style.setProperty('--py', `${delta * speed}px`);
      }
      ticking = false;
    });
    ticking = true;
  }
}

function enableSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if(id.length > 1){
        const target = document.querySelector(id);
        if(target){
          e.preventDefault();
          target.scrollIntoView({behavior:'smooth', block:'start'});
        }
      }
    });
  });
}

// ---------------- Liquid Chrome (pure WebGL, non-interactive + stronger silver) ----------------
function initLiquidChrome(){
  const mount  = document.getElementById('liquidMount');
  const canvas = document.getElementById('liquidCanvas');
  if(!mount || !canvas) return;

  const gl = canvas.getContext('webgl', { alpha:true, antialias:true, depth:false, stencil:false, premultipliedAlpha:true });
  if(!gl){ console.error('[LC] WebGL not available'); return; }

  const vertSrc = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main(){
      vUv = (aPosition + 1.0) * 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fragSrc = `
    precision highp float;
    varying vec2 vUv;

    uniform float uTime;
    uniform vec2  uResolution;
    uniform vec3  uBaseColor;
    uniform vec3  uAccentColor;
    uniform float uAccentMix;   // how much silver to blend
    uniform float uAmplitude;
    uniform float uFrequencyX;
    uniform float uFrequencyY;
    uniform vec2  uMouse;       // kept fixed (non-interactive)

    // simple "chrome" bands + fresnel-ish boost
    float metallicMask(vec2 uv, float t){
      float bx = sin(uv.x * 7.0 - t * 0.8);
      float by = cos(uv.y * 5.0 + t * 0.6);
      float bands = abs(bx * by);              // interference pattern
      bands = pow(bands, 1.2);                 // harder edges
      float vign = smoothstep(1.3, 0.25, length(uv));
      // Fake fresnel: brighter at edges (higher |uv|)
      float fres = smoothstep(0.2, 1.0, length(uv));
      return clamp(bands * vign * (0.65 + 0.35 * fres), 0.0, 1.0);
    }

    vec4 renderImage(vec2 uvCoord){
      vec2 fragCoord = uvCoord * uResolution.xy;
      vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

      // Organic warping
      for (float i = 1.0; i < 10.0; i++){
        uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
        uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
      }

      // Base field (pink)
      vec3 baseCol = uBaseColor / abs(sin(uTime - uv.y - uv.x));

      // Metallic mask (0..1), stronger = more silver
      float m = metallicMask(uv, uTime);
      vec3 mixed = mix(baseCol, uAccentColor, m * uAccentMix);

      // Gentle tone-map so highlights don't nuke detail
      mixed = mixed / (mixed + vec3(0.6));

      return vec4(mixed, 1.0);
    }

    void main(){
      vec4 col = vec4(0.0);
      for (int i=-1; i<=1; i++){
        for (int j=-1; j<=1; j++){
          vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
          col += renderImage(vUv + offset);
        }
      }
      gl_FragColor = col / 9.0;
    }
  `;

  function compile(type, src){
    const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh);
    if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){ console.error('Shader compile error:', gl.getShaderInfoLog(sh)); gl.deleteShader(sh); return null; }
    return sh;
  }

  const vs = compile(gl.VERTEX_SHADER,   vertSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){ console.error('Program link error:', gl.getProgramInfoLog(prog)); return; }
  gl.useProgram(prog);

  // Full-screen triangle
  const verts = new Float32Array([ -1,-1,  3,-1,  -1,3 ]);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPosition'); gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Uniforms
  const uTime       = gl.getUniformLocation(prog, 'uTime');
  const uResolution = gl.getUniformLocation(prog, 'uResolution');
  const uBaseColor  = gl.getUniformLocation(prog, 'uBaseColor');
  const uAccentColor= gl.getUniformLocation(prog, 'uAccentColor');
  const uAccentMix  = gl.getUniformLocation(prog, 'uAccentMix');
  const uAmplitude  = gl.getUniformLocation(prog, 'uAmplitude');
  const uFrequencyX = gl.getUniformLocation(prog, 'uFrequencyX');
  const uFrequencyY = gl.getUniformLocation(prog, 'uFrequencyY');
  const uMouse      = gl.getUniformLocation(prog, 'uMouse');

  // Theme (NOTE: colours are 0..1 — not 0..255)
  gl.uniform3f(uBaseColor,   1.00, 0.56, 0.82);  // pink
  gl.uniform3f(uAccentColor, 0.90, 0.92, 0.98);  // cool silver
  gl.uniform1f(uAccentMix,   0.65);              // 0..1 — increase for more silver
  gl.uniform1f(uAmplitude,   0.45);              // wave strength
  gl.uniform1f(uFrequencyX,  3.0);
  gl.uniform1f(uFrequencyY,  2.6);

  // Non-interactive: fixed centre (no handlers added)
  gl.uniform2f(uMouse, 0.5, 0.5);

  function setSize(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = mount.getBoundingClientRect();
    canvas.width  = Math.max(1, Math.round(r.width  * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    canvas.style.width  = r.width + 'px';
    canvas.style.height = r.height + 'px';
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
  }
  new ResizeObserver(setSize).observe(mount);
  window.addEventListener('resize', setSize);
  setSize();

  let start = performance.now();
  function frame(now){
    gl.uniform1f(uTime, (now - start) / 1000 * 0.40);
    gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ---------------- Boot ----------------
function init(){
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  renderProjects(projects);
  collectParallax();
  primeReveal();
  enableSmoothScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', collectParallax);
  document.addEventListener('visibilitychange', () => { if(document.visibilityState === 'visible') onScroll(); });
  onScroll();

  initLiquidChrome(); // start the effect
}
document.addEventListener('DOMContentLoaded', init);
 
