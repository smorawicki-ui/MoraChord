<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#0b1118">
  
  <!-- Ícono SVG a sangre completa para evitar el marco blanco de Android -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' fill='%230b1118' /%3E%3Cg fill='%2338bdf8'%3E%3Crect x='140' y='216' width='32' height='80' rx='16' /%3E%3Crect x='188' y='156' width='32' height='200' rx='16' /%3E%3Crect x='236' y='96' width='32' height='320' rx='16' /%3E%3Crect x='284' y='136' width='32' height='240' rx='16' /%3E%3Crect x='332' y='206' width='32' height='100' rx='16' /%3E%3C/g%3E%3C/svg%3E">
  <link rel="apple-touch-icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Crect width='512' height='512' fill='%230b1118' /%3E%3Cg fill='%2338bdf8'%3E%3Crect x='140' y='216' width='32' height='80' rx='16' /%3E%3Crect x='188' y='156' width='32' height='200' rx='16' /%3E%3Crect x='236' y='96' width='32' height='320' rx='16' /%3E%3Crect x='284' y='136' width='32' height='240' rx='16' /%3E%3Crect x='332' y='206' width='32' height='100' rx='16' /%3E%3C/g%3E%3C/svg%3E">
  
  <link rel="manifest" href="manifest.json">
  
  <title>MoraChord</title>
  <style>
    :root {
      --bg: #0b1118; --panel: #131c26; --panel-light: #1b2836;
      --border: rgba(255, 255, 255, 0.05);
      --accent: #0ea5e9; --accent-hover: #38bdf8; --accent-glow: rgba(56, 189, 248, 0.4);
      --text: #f0f9ff; --text-muted: #94a3b8;
      --shadow-out: 4px 4px 10px rgba(0,0,0,0.5), -2px -2px 6px rgba(255,255,255,0.03);
      --shadow-in: inset 3px 3px 8px rgba(0,0,0,0.6), inset -2px -2px 5px rgba(255,255,255,0.03);
    }
    
    * { box-sizing: border-box; user-select: none; -webkit-user-select: none; touch-action: none; margin: 0; padding: 0; }
    
    body {
      background: var(--bg); color: var(--text);
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      height: 100dvh; width: 100vw; display: flex; flex-direction: row; overflow: hidden;
    }
    
    .main-column { flex: 1; display: flex; flex-direction: column; overflow: hidden; position: relative; }

    .top-section {
      background: var(--panel);
      padding: 10px 16px; display: flex; flex-direction: column; gap: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4); z-index: 10;
      border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;
      overflow-y: auto; max-height: 52dvh;
    }
    .header-row { display: flex; align-items: center; justify-content: space-between; }
    
    .pill-group {
      display: flex; align-items: center; background: var(--bg);
      border-radius: 20px; padding: 4px; box-shadow: var(--shadow-in);
    }
    
    .ctrl-btn {
      background: transparent; border: none; color: var(--text-muted);
      padding: 6px 12px; border-radius: 16px; font-weight: 600; font-size: 0.75rem;
      transition: all 0.2s ease; outline: none; cursor: pointer;
    }
    .ctrl-btn.active { background: var(--panel-light); color: var(--accent-hover); box-shadow: var(--shadow-out); }
    #key-display { font-size: 1.1rem; font-weight: 800; width: 26px; text-align: center; color: #fff; }

    select.inst-select {
      background: transparent; border: none; color: var(--accent-hover);
      font-weight: 700; font-size: 0.8rem; outline: none; padding: 4px 8px; cursor: pointer;
    }
    select.inst-select option { background: var(--panel); color: var(--text); }
    select.inst-select optgroup { color: var(--text-muted); font-style: italic; }

    .params-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; padding: 4px 8px; }
    
    .custom-fm-grid {
      display: none; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 6px 8px;
      background: #070d14; border-radius: 12px; border: 1px dashed var(--accent); margin-top: 4px;
    }
    .custom-fm-grid.visible { display: grid; }

    /* PANELES FLOTANTES A PANTALLA COMPLETA */
    .custom-drum-sequencer, .custom-modal-panel {
      display: none; flex-direction: column; gap: 10px; padding: 16px;
      background: #0e1622; border-radius: 16px; border: 2px solid var(--accent);
      position: absolute; top: 10px; left: 16px; right: 16px; bottom: 16px;
      z-index: 100; box-shadow: 0 15px 40px rgba(0,0,0,0.9); overflow-y: auto;
    }
    .custom-drum-sequencer.visible, .custom-modal-panel.visible { display: flex; }
    
    .seq-row { display: flex; align-items: center; gap: 8px; }
    .seq-label { font-size: 0.7rem; font-weight: bold; width: 65px; color: var(--accent-hover); letter-spacing: 0.5px;}
    .seq-pads { display: grid; grid-template-columns: repeat(16, 1fr); gap: 4px; flex: 1; }
    .seq-pad {
      height: 36px; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; cursor: pointer;
    }
    .seq-pad.active { background: var(--accent); box-shadow: 0 0 10px var(--accent-glow); }

    .param-group { display: flex; flex-direction: column; gap: 4px; }
    .param-group label { display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem; font-weight: 600; color: var(--text-muted); letter-spacing: 0.5px;}
    .param-group label span:last-child { color: var(--accent-hover); }
    .param-group input[type=range], .param-group select { 
      width: 100%; height: 24px; background: var(--bg); outline: none; border: 1px solid var(--border); 
      border-radius: 6px; color: var(--accent-hover); font-size: 0.7rem; font-weight: bold; padding: 0 4px;
      box-shadow: var(--shadow-in);
    }
    .param-group input[type=range] { height: 6px; border: none; -webkit-appearance: none; border-radius: 10px; }
    .param-group input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; width: 16px; height: 16px; background: var(--panel-light); 
      border-radius: 50%; box-shadow: var(--shadow-out); border: 2px solid var(--accent-hover);
    }

    .drum-row {
      display: flex; align-items: center; gap: 8px; margin-top: 4px; 
      padding-top: 10px; border-top: 1px solid var(--border); flex-wrap: wrap;
    }
    #btn-drum-play { background: var(--accent); color: #fff; box-shadow: var(--shadow-out); font-weight: 800; letter-spacing: 1px; }
    #btn-drum-play.playing { background: #e11d48; border-color: transparent; }
    #drum-pattern, #drum-kit, #po-sync-select, #quantize-select { background: var(--bg); box-shadow: var(--shadow-in); border: 1px solid var(--border); color: var(--accent-hover); }

    .middle-section { flex: 1; display: flex; padding: 16px; gap: 16px; }

    .joystick-container {
      flex: 0 0 135px; background: var(--panel); border-radius: 24px; 
      display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-out);
    }
    .joy-wrapper {
      display: grid; grid-template-columns: 36px 52px 36px; grid-template-rows: 36px 52px 36px;
      gap: 2px; align-items: center; justify-items: center; padding: 4px;
    }
    .lbl { 
      font-size: 0.55rem; color: var(--text-muted); text-align: center; font-weight: 700; 
      transition: 0.2s; line-height: 1.1; white-space: nowrap;
    }
    .lbl.active { color: var(--accent-hover); transform: scale(1.15); font-weight: 800; text-shadow: 0 0 8px var(--accent-glow); }
    .joy-center {
      width: 52px; height: 52px; border-radius: 50%; background: var(--bg); position: relative; box-shadow: var(--shadow-in);
      grid-column: 2; grid-row: 2;
    }
    .joy-stick {
      width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(145deg, #38bdf8, #0284c7);
      position: absolute; top: 13px; left: 13px; pointer-events: none;
      box-shadow: 0 4px 8px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3);
    }

    .keys-container { flex: 1; display: grid; gap: 10px; }
    
    .keys-container.layout-diatonic {
      grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(2, 1fr);
      grid-template-areas: 
        "v vi vii viii"
        "i ii iii iv";
    }
    .keys-container.layout-diatonic .btn-key.chromatic-only { display: none; }
    .layout-diatonic .btn-key[data-idx="0"] { grid-area: i; border-radius: 20px; }
    .layout-diatonic .btn-key[data-idx="1"] { grid-area: ii; }
    .layout-diatonic .btn-key[data-idx="2"] { grid-area: iii; }
    .layout-diatonic .btn-key[data-idx="3"] { grid-area: iv; }
    .layout-diatonic .btn-key[data-idx="4"] { grid-area: v; }
    .layout-diatonic .btn-key[data-idx="5"] { grid-area: vi; }
    .layout-diatonic .btn-key[data-idx="6"] { grid-area: vii; }
    .layout-diatonic .btn-key[data-idx="7"] { grid-area: viii; }

    .keys-container.layout-chromatic {
      grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(3, 1fr);
      grid-template-areas: 
        "c9 c10 c11 c12"
        "c5 c6 c7 c8"
        "c1 c2 c3 c4";
    }
    .keys-container.layout-chromatic .btn-key { grid-area: auto; border-radius: 12px; }
    .keys-container.layout-chromatic .roman { display: none; }
    .keys-container.layout-chromatic .btn-key[data-idx="0"] { grid-area: c1; border-radius: 12px; }
    .keys-container.layout-chromatic .btn-key[data-idx="1"] { grid-area: c2; }
    .keys-container.layout-chromatic .btn-key[data-idx="2"] { grid-area: c3; }
    .keys-container.layout-chromatic .btn-key[data-idx="3"] { grid-area: c4; }
    .keys-container.layout-chromatic .btn-key[data-idx="4"] { grid-area: c5; }
    .keys-container.layout-chromatic .btn-key[data-idx="5"] { grid-area: c6; }
    .keys-container.layout-chromatic .btn-key[data-idx="6"] { grid-area: c7; }
    .keys-container.layout-chromatic .btn-key[data-idx="7"] { grid-area: c8; }
    .keys-container.layout-chromatic .btn-key[data-idx="8"] { grid-area: c9; }
    .keys-container.layout-chromatic .btn-key[data-idx="9"] { grid-area: c10; }
    .keys-container.layout-chromatic .btn-key[data-idx="10"] { grid-area: c11; }
    .keys-container.layout-chromatic .btn-key[data-idx="11"] { grid-area: c12; }

    .btn-key {
      background: var(--panel); border-radius: 16px; color: var(--text);
      display: flex; flex-direction: column; align-items: center; justify-content: center; 
      transition: all 0.1s ease; box-shadow: var(--shadow-out); border: 1px solid rgba(255,255,255,0.02);
    }
    .btn-key.armed { background: var(--panel-light); border-color: var(--accent); box-shadow: 0 0 15px var(--accent-glow), var(--shadow-out); }
    .btn-key:active, .btn-key.active { transform: scale(0.94); background: var(--accent); color: #fff; box-shadow: var(--shadow-in); border-color: transparent; }
    .btn-key .chord-name { font-size: 1.3rem; font-weight: 800; pointer-events: none; letter-spacing: -0.5px;}
    .btn-key .roman { font-size: 0.65rem; color: inherit; opacity: 0.7; font-weight: 700; margin-top: 2px; pointer-events: none; }

    .strum-section {
      height: 100dvh; width: 140px; background: var(--bg); padding: 16px 12px; 
      display: flex; flex-direction: column; border-left: 2px solid var(--border);
    }
    .strum-header-row { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; align-items: center;}
    .strum-header { font-size: 0.7rem; color: var(--text-muted); font-weight: 700; letter-spacing: 1px;}
    #main-chord-display { font-size: 1.4rem; font-weight: 800; color: #fff; text-shadow: 0 0 10px var(--accent-glow);}
    
    .strum-plate {
      flex: 1; background: var(--panel); border-radius: 12px;
      display: flex; flex-direction: column; overflow: hidden; position: relative;
      box-shadow: var(--shadow-in);
    }
    .strum-string {
      flex: 1; display: flex; align-items: center; justify-content: center; 
      transition: background 0.1s; position: relative; border-bottom: 1px solid #1a2c3a;
    }
    .strum-string:last-child { border-bottom: none; }
    .strum-string.hit { background: rgba(56, 189, 248, 0.2); }
    .string-line { width: 100%; height: 4px; background: linear-gradient(90deg, #1e293b, #475569, #1e293b); pointer-events: none; border-radius: 2px; }
    .strum-string.hit .string-line { background: var(--accent-hover); box-shadow: 0 0 10px var(--accent-hover); }
  </style>
</head>
<body>

  <div class="main-column">
    <div class="top-section">
      <div class="header-row">
        <div class="pill-group">
          <button class="ctrl-btn" id="btn-key-down">-</button>
          <span id="key-display">C</span>
          <button class="ctrl-btn" id="btn-key-up">+</button>
          <div style="width: 1px; height: 16px; background: var(--border); margin: 0 4px;"></div>
          
          <select id="scale-select" class="inst-select">
            <optgroup label="Occidentales">
              <option value="0">Mayor (Jónica)</option>
              <option value="1">Menor Natural (Eólica)</option>
              <option value="2">Menor Armónica</option>
              <option value="3">Menor Melódica</option>
            </optgroup>
            <optgroup label="Modos Griegos">
              <option value="4">Dórica</option>
              <option value="5">Frigia</option>
              <option value="6">Lidia</option>
              <option value="7">Mixolidia</option>
              <option value="8">Locria</option>
            </optgroup>
            <optgroup label="Exóticas y del Mundo">
              <option value="9">Frigia Dominante (Árabe)</option>
              <option value="10">Doble Armónica (Bizantina)</option>
              <option value="11">Húngara Menor</option>
              <option value="12">Japonesa (Hirajoshi)</option>
            </optgroup>
            <optgroup label="Pentatónicas & Blues">
              <option value="13">Pentatónica Mayor</option>
              <option value="14">Pentatónica Menor</option>
              <option value="15">Blues</option>
            </optgroup>
            <optgroup label="Libre">
              <option value="16">Libre (Cromático 12)</option>
            </optgroup>
          </select>
        </div>

        <div class="pill-group" style="padding-left: 10px; padding-right: 10px;">
          <span style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; margin-right: 6px;">SONIDO:</span>
          <select id="inst-select" class="inst-select">
            <optgroup label="Clásicos">
              <option value="analog">🎹 Synth Pad</option>
              <option value="strings">🎻 Cuerdas Caoticas</option>
              <option value="organ">🎹 Órgano Hammond</option>
              <option value="guitar">🎸 Guitarra Eléctrica</option>
              <option value="acidbass">⚡ Bajo Ácido (303)</option>
            </optgroup>
            <optgroup label="Falopa / FX">
              <option value="8bit">👾 8-Bit (Chiptune)</option>
              <option value="crystal">🍷 Cristal Mágico</option>
              <option value="sweep">🔫 Laser Sweep (Rave)</option>
              <option value="alien">🛸 Alienígena (FM)</option>
            </optgroup>
            <optgroup label="Laboratorio">
              <option value="custom">🎛️ Custom FM Synth</option>
              <option value="vocal">🤖 Vocoder Daft Punk</option>
            </optgroup>
          </select>
        </div>
      </div>
      
      <div class="params-grid">
        <div class="param-group"><label><span>Attack</span> <span id="val-atk">0.05s</span></label><input type="range" id="p-attack" min="0.01" max="2.0" step="0.01" value="0.05"></div>
        <div class="param-group"><label><span>Release</span> <span id="val-rel">1.5s</span></label><input type="range" id="p-release" min="0.1" max="4.0" step="0.1" value="1.5"></div>
        <div class="param-group"><label><span>Cutoff</span> <span id="val-cut">800Hz</span></label><input type="range" id="p-cutoff" min="200" max="4000" step="50" value="800"></div>
        
        <div class="param-group">
          <label>
            <span style="display:inline-flex; align-items:center; gap:3px;">Echo
              <select id="echo-subdiv" style="background:var(--bg); border:1px solid var(--border); border-radius:4px; color:var(--accent-hover); font-size:0.58rem; font-weight:700; padding:0 2px; height:16px; cursor:pointer; outline:none;" title="Subdivisión del Eco">
                <option value="0.75">1/8 D</option>
                <option value="0.5">1/8</option>
                <option value="0.25">1/16</option>
                <option value="1.0">1/4</option>
                <option value="0.3333">1/8 T</option>
              </select>
            </span>
            <span id="val-echo">20%</span>
          </label>
          <input type="range" id="p-echo" min="0" max="0.8" step="0.05" value="0.2">
        </div>

        <div class="param-group"><label><span>Glide</span> <span id="val-glide">0.05s</span></label><input type="range" id="p-glide" min="0.001" max="0.5" step="0.005" value="0.05"></div>
      </div>

      <div class="custom-fm-grid" id="custom-fm-panel">
        <div class="param-group">
          <label><span>Onda Principal</span></label>
          <select id="cf-carrier">
            <option value="sine">Senoidal</option>
            <option value="square">Cuadrada</option>
            <option value="sawtooth">Sierra</option>
            <option value="triangle">Triangular</option>
          </select>
        </div>
        <div class="param-group">
          <label><span>Onda Moduladora</span></label>
          <select id="cf-modulator">
            <option value="sine">Senoidal</option>
            <option value="square">Cuadrada</option>
            <option value="sawtooth">Sierra</option>
            <option value="triangle">Triangular</option>
          </select>
        </div>
        <div class="param-group">
          <label><span>Ratio FM</span> <span id="val-fm-ratio">2.0x</span></label>
          <input type="range" id="cf-ratio" min="0.5" max="8.0" step="0.1" value="2.0">
        </div>
        <div class="param-group">
          <label><span>Profundidad FM</span> <span id="val-fm-depth">300Hz</span></label>
          <input type="range" id="cf-depth" min="0" max="1500" step="25" value="300">
        </div>
      </div>

      <!-- SECUENCIADOR FLOTANTE A PANTALLA COMPLETA -->
      <div class="custom-drum-sequencer" id="custom-drum-panel">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
          <span style="font-size:0.8rem; color:var(--accent-hover); font-weight:bold; letter-spacing:1px;">EDICIÓN DE RITMO (16 PASOS)</span>
          <button id="btn-close-seq" class="ctrl-btn" style="padding: 6px 14px; background: var(--bg); border: 1px solid var(--accent); color: var(--accent-hover);">✕ Cerrar Editor</button>
        </div>
        <div class="seq-row"><div class="seq-label">KICK</div><div class="seq-pads" id="seq-kick-pads"></div></div>
        <div class="seq-row"><div class="seq-label">DEEP BD</div><div class="seq-pads" id="seq-deepkick-pads"></div></div>
        <div class="seq-row"><div class="seq-label">SNARE</div><div class="seq-pads" id="seq-snare-pads"></div></div>
        <div class="seq-row"><div class="seq-label">C. HH</div><div class="seq-pads" id="seq-hihat-pads"></div></div>
        <div class="seq-row"><div class="seq-label">O. HH</div><div class="seq-pads" id="seq-openhat-pads"></div></div>
        <div class="seq-row"><div class="seq-label">RIDE</div><div class="seq-pads" id="seq-ride-pads"></div></div>
      </div>

      <!-- PANEL VOCODER DAFT PUNK -->
      <div class="custom-modal-panel" id="vocal-panel">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">
          <span style="font-size:0.85rem; color:var(--accent-hover); font-weight:800; letter-spacing:1px;">🤖 VOCODER LAB (DAFT STYLE)</span>
          <button id="btn-close-vocal" class="ctrl-btn" style="padding: 6px 14px; background: var(--bg); border: 1px solid var(--accent); color: var(--accent-hover);">✕ Cerrar</button>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px; padding: 6px 0;">
          <div style="display:flex; gap:10px; align-items:center; justify-content:center; flex-wrap:wrap;">
            <button id="btn-rec-vocal" class="ctrl-btn" style="background:#e11d48; color:#fff; font-size:0.85rem; padding:12px 20px; font-weight:800; border-radius:24px; box-shadow:var(--shadow-out);">
              🎙️ GRABAR FRASE (MIC)
            </button>
            <button id="btn-sync-vocal" class="ctrl-btn" style="background:var(--panel-light); border:1px solid var(--accent); color:var(--accent-hover); font-size:0.75rem; padding:10px 16px;">
              🔄 SYNC BPM (CALZAR EN BEAT)
            </button>
          </div>

          <div id="vocal-status-text" style="text-align:center; font-size:0.75rem; color:var(--accent-hover); font-weight:700;">
            Muestra activa: Frase Robótica Sintetizada ("MORA-CHORD-RO-BOT")
          </div>

          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; background:rgba(0,0,0,0.3); padding:12px; border-radius:12px; border:1px solid var(--border);">
            <div class="param-group">
              <label><span>Velocidad / Stretch</span> <span id="val-vocal-speed">1.00x</span></label>
              <input type="range" id="vocal-speed" min="0.5" max="2.0" step="0.05" value="1.0">
            </div>

            <div class="param-group">
              <label><span>Color Portadora</span></label>
              <select id="vocal-carrier-type">
                <option value="dual-saw">Daft Saw (Cuerpo)</option>
                <option value="bright-pulse">Laser Pulse (Brillante)</option>
                <option value="pure-robot">Cybernetic RingMod</option>
              </select>
            </div>

            <div class="param-group">
              <label><span>Sensibilidad Modulador</span> <span id="val-vocal-sens">100%</span></label>
              <input type="range" id="vocal-sens" min="0.5" max="3.0" step="0.1" value="1.5">
            </div>
          </div>

          <div style="font-size:0.65rem; color:var(--text-muted); text-align:center; line-height:1.4;">
            💡 <b>Modo Legato continuo:</b> Toca acordes en el teclado o el strumplate; la frase vocal continúa cantando sin cortarse a medida que cambias de armonía.
          </div>
        </div>
      </div>

      <div class="drum-row">
        <button class="ctrl-btn" id="btn-drum-play">▶ PLAY BEAT</button>
        
        <select id="quantize-select" class="inst-select" style="background: var(--bg); border: 1px solid var(--border);" title="Cuantizar notas">
          <option value="off">Quant: OFF</option>
          <option value="16">Quant: 1/16</option>
          <option value="8">Quant: 1/8</option>
          <option value="4">Quant: 1/4</option>
        </select>

        <select id="po-sync-select" class="inst-select" style="background: var(--bg); border: 1px solid var(--border);">
          <option value="off">Sync PO: OFF</option>
          <option value="on">Sync PO: ON</option>
        </select>

        <select id="drum-kit" class="inst-select" style="background: var(--bg); border: 1px solid var(--border);">
          <option value="classic">Kit Clásico</option>
          <option value="chiptune">Kit 8-Bit</option>
        </select>

        <select id="drum-pattern" class="inst-select" style="background: var(--bg); border: 1px solid var(--border);">
          <optgroup label="Occidentales & Urbanos">
            <option value="rock">Rock Básico</option>
            <option value="rockalt">Rock Alternativo</option>
            <option value="french">French Touch</option>
            <option value="disco">Disco / House 909</option>
            <option value="synth">Synthwave 80s</option>
            <option value="hiphop">Hip-Hop Boom Bap</option>
            <option value="trap">Trap 808</option>
            <option value="dnb">Drum & Bass</option>
            <option value="techno">Techno Berlin</option>
          </optgroup>
          <optgroup label="Latinoamérica & Caribe">
            <option value="reggaeton">Reggaeton / Dembow</option>
            <option value="cumbia">Cumbia</option>
            <option value="salsa">Salsa / Clave</option>
            <option value="bossa">Bossa Nova</option>
            <option value="reggae">Reggae One Drop</option>
          </optgroup>
          <optgroup label="Ritmos del Mundo">
            <option value="maqsum">Árabe: Maqsum</option>
            <option value="saidi">Árabe: Saidi</option>
            <option value="malfuf">Árabe: Malfuf</option>
            <option value="taiko">Japonés: Taiko</option>
            <option value="flamenco">Flamenco / Rumba</option>
            <option value="afrobeats">Afrobeats</option>
          </optgroup>
          <optgroup label="Tradicionales">
            <option value="waltz">Waltz (3/4)</option>
            <option value="swing">Jazz Swing</option>
          </optgroup>
          <optgroup label="Usuario">
            <option value="custom">✏️ Personalizado (16 pasos)</option>
          </optgroup>
        </select>

        <button id="btn-edit-seq" class="ctrl-btn" style="background: var(--bg); border: 1px solid var(--accent);">⚙️ Editar</button>

        <div class="pill-group" title="Tempo BPM">
          <button class="ctrl-btn" id="btn-bpm-down">-</button>
          <span id="val-bpm" style="font-size:0.75rem; font-weight:800; min-width:54px; text-align:center; color:#fff;">120 BPM</span>
          <button class="ctrl-btn" id="btn-bpm-up">+</button>
        </div>

        <div class="pill-group" title="Volumen Batería">
          <button class="ctrl-btn" id="btn-dvol-down">-</button>
          <span id="val-dvol" style="font-size:0.75rem; font-weight:800; min-width:40px; text-align:center; color:#fff;">60%</span>
          <button class="ctrl-btn" id="btn-dvol-up">+</button>
        </div>
      </div>
    </div>

    <div class="middle-section">
      <div class="joystick-container">
        <div class="joy-wrapper">
          <div class="lbl" style="grid-column:1; grid-row:1;" id="lbl-aug">↖<br>Aug</div>
          <div class="lbl" style="grid-column:2; grid-row:1;" id="lbl-flip">↑<br>M/m</div>
          <div class="lbl" style="grid-column:3; grid-row:1;" id="lbl-dom7">↗<br>Dom7</div>
          <div class="lbl" style="grid-column:1; grid-row:2;" id="lbl-dim">←<br>Dim</div>
          <div class="joy-center" id="joyCenter"><div class="joy-stick" id="joyStick"></div></div>
          <div class="lbl" style="grid-column:3; grid-row:2;" id="lbl-7th">→<br>M/m7</div>
          <div class="lbl" style="grid-column:1; grid-row:3;" id="lbl-6th">↙<br>6th</div>
          <div class="lbl" style="grid-column:2; grid-row:3;" id="lbl-sus4">↓<br>Sus4</div>
          <div class="lbl" style="grid-column:3; grid-row:3;" id="lbl-9th">↘<br>9th</div>
        </div>
      </div>

      <div class="keys-container layout-diatonic" id="keys-container">
        <div class="btn-key armed" data-idx="0"><div class="chord-name"></div><div class="roman"></div></div>
        <div class="btn-key" data-idx="1"><div class="chord-name"></div><div class="roman"></div></div>
        <div class="btn-key" data-idx="2"><div class="chord-name"></div><div class="roman"></div></div>
        <div class="btn-key" data-idx="3"><div class="chord-name"></div><div class="roman"></div></div>
        <div class="btn-key" data-idx="4"><div class="chord-name"></div><div class="roman"></div></div>
        <div class="btn-key" data-idx="5"><div class="chord-name"></div><div class="roman"></div></div>
        <div class="btn-key" data-idx="6"><div class="chord-name"></div><div class="roman"></div></div>
        <div class="btn-key" data-idx="7"><div class="chord-name"></div><div class="roman"></div></div>
        
        <div class="btn-key chromatic-only" data-idx="8"><div class="chord-name"></div><div class="roman"></div></div>
        <div class="btn-key chromatic-only" data-idx="9"><div class="chord-name"></div><div class="roman"></div></div>
        <div class="btn-key chromatic-only" data-idx="10"><div class="chord-name"></div><div class="roman"></div></div>
        <div class="btn-key chromatic-only" data-idx="11"><div class="chord-name"></div><div class="roman"></div></div>
      </div>
    </div>
  </div>

  <div class="strum-section">
    <div class="strum-header-row">
      <span class="strum-header">STRUMPLATE</span>
      <div id="main-chord-display">C Maj</div>
    </div>
    <div class="strum-plate" id="strumplate">
      <div class="strum-string" data-idx="0"><div class="string-line"></div></div><div class="strum-string" data-idx="1"><div class="string-line"></div></div>
      <div class="strum-string" data-idx="2"><div class="string-line"></div></div><div class="strum-string" data-idx="3"><div class="string-line"></div></div>
      <div class="strum-string" data-idx="4"><div class="string-line"></div></div><div class="strum-string" data-idx="5"><div class="string-line"></div></div>
      <div class="strum-string" data-idx="6"><div class="string-line"></div></div><div class="strum-string" data-idx="7"><div class="string-line"></div></div>
    </div>
  </div>

  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(()=>{});
    }

    const PATTERNS = {
      'french': {
        kick:     [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        deepkick: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
        hihat:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        openhat:  [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        ride:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]
      },
      'rock': {
        kick:     [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        deepkick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat:    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        openhat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,0],
        ride:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      'rockalt': {
        kick:     [1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
        deepkick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat:    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        openhat:  [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,1,0],
        ride:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      'disco': {
        kick:     [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        deepkick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        openhat:  [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        ride:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      'synth': {
        kick:     [1,0,0,0, 0,0,0,0, 1,0,1,0, 0,0,0,0],
        deepkick: [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat:    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        openhat:  [0,0,1,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
        ride:     [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0]
      },
      'hiphop': {
        kick:     [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,1,0,0],
        deepkick: [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat:    [1,0,1,1, 1,0,1,0, 1,0,1,1, 1,0,1,0],
        openhat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,0],
        ride:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      'trap': {
        kick:     [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        deepkick: [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
        snare:    [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        hihat:    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        openhat:  [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,1],
        ride:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      'dnb': {
        kick:     [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
        deepkick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat:    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        openhat:  [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
        ride:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]
      },
      'techno': {
        kick:     [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        deepkick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        snare:    [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        hihat:    [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        openhat:  [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        ride:     [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1]
      },
      'reggaeton': {
        kick:     [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        deepkick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0],
        hihat:    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        openhat:  [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0],
        ride:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      'cumbia': {
        kick:     [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0],
        deepkick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat:    [0,1,1,0, 1,1,0,1, 1,0,1,1, 0,1,1,0],
        openhat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,1],
        ride:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      'salsa': {
        kick:     [0,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
        deepkick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [1,0,0,1, 0,0,1,0, 0,0,1,0, 1,0,0,0],
        hihat:    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        openhat:  [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        ride:     [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,0]
      },
      'bossa': {
        kick:     [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0],
        deepkick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,1],
        hihat:    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        openhat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        ride:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]
      },
      'reggae': {
        kick:     [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        deepkick: [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        hihat:    [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        openhat:  [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        ride:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      'maqsum': {
        kick:     [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
        deepkick: [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat:    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        openhat:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        ride:     [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]
      },
      'saidi': {
        kick:     [1,0,0,0, 0,0,0,0, 1,0,0,0, 1,0,0,0],
        deepkick: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 0,0,1,0],
        hihat:    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        openhat:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 0,0,1,0],
        ride:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      'malfuf': {
        kick:     [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        deepkick: [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0],
        hihat:    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        openhat:  [0,0,0,1, 0,0,1,0, 0,0,0,1, 0,0,1,0],
        ride:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      'taiko': {
        kick:     [1,0,1,0, 0,0,1,0, 1,0,1,0, 0,0,1,0],
        deepkick: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat:    [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        openhat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        ride:     [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0]
      },
      'flamenco': {
        kick:     [1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0],
        deepkick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,1,0, 1,0,0,1, 0,1,0,0, 1,0,1,0],
        hihat:    [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        openhat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,0],
        ride:     [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
      },
      'afrobeats': {
        kick:     [1,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
        deepkick: [1,0,0,0, 0,0,0,0, 0,0,0,0, 1,0,0,0],
        snare:    [0,0,0,1, 0,0,0,0, 1,0,0,1, 0,0,1,0],
        hihat:    [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
        openhat:  [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,0,0],
        ride:     [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,0]
      },
      'waltz': {
        kick:     [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        deepkick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 1,0,0,0, 0,0,0,0],
        hihat:    [1,0,0,0, 1,0,0,0, 1,0,0,0, 0,0,0,0],
        openhat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        ride:     [1,0,0,0, 1,0,0,0, 1,0,0,0, 0,0,0,0]
      },
      'swing': {
        kick:     [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
        deepkick: [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        snare:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat:    [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        openhat:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
        ride:     [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0]
      }
    };

    const synthParams = { attack: 0.05, release: 1.5, cutoff: 800, echo: 0.2, glide: 0.05, bpm: 120, drumVol: 0.6 };

    const INST_DEFAULTS = {
      'analog':   { attack: 0.05, release: 1.5, cutoff: 800,  echo: 0.20, glide: 0.05 },
      'strings':  { attack: 0.35, release: 2.2, cutoff: 1600, echo: 0.25, glide: 0.08 },
      'organ':    { attack: 0.01, release: 0.3, cutoff: 3500, echo: 0.10, glide: 0.01 },
      'guitar':   { attack: 0.01, release: 0.9, cutoff: 2400, echo: 0.15, glide: 0.02 },
      'acidbass': { attack: 0.01, release: 0.35, cutoff: 550, echo: 0.10, glide: 0.09 },
      '8bit':     { attack: 0.01, release: 0.15, cutoff: 4000, echo: 0.00, glide: 0.01 },
      'crystal':  { attack: 0.03, release: 2.8, cutoff: 3000, echo: 0.35, glide: 0.03 },
      'sweep':    { attack: 0.20, release: 1.8, cutoff: 1900, echo: 0.25, glide: 0.05 },
      'alien':    { attack: 0.04, release: 1.3, cutoff: 2600, echo: 0.35, glide: 0.04 },
      'vocal':    { attack: 0.02, release: 0.4, cutoff: 2800, echo: 0.20, glide: 0.04 },
      'custom':   null
    };

    const PARAM_INPUT_MAP = {
      attack:  { input: 'p-attack',  label: 'val-atk',  unit: 's' },
      release: { input: 'p-release', label: 'val-rel',  unit: 's' },
      cutoff:  { input: 'p-cutoff',  label: 'val-cut',  unit: 'Hz' },
      echo:    { input: 'p-echo',    label: 'val-echo', unit: '%' },
      glide:   { input: 'p-glide',   label: 'val-glide',unit: 's' }
    };

    function applyInstrumentDefaults(inst) {
      const def = INST_DEFAULTS[inst];
      if (!def) return;
      for (let key in def) {
        synthParams[key] = def[key];
        const m = PARAM_INPUT_MAP[key];
        const inp = document.getElementById(m.input);
        const lbl = document.getElementById(m.label);
        if (inp) inp.value = def[key];
        if (lbl) {
          if (key === 'echo') lbl.innerText = Math.round(def[key] * 100) + '%';
          else if (key === 'cutoff') lbl.innerText = Math.round(def[key]) + 'Hz';
          else lbl.innerText = def[key] + 's';
        }
      }
      if (delayInputGain) delayInputGain.gain.value = synthParams.echo;
      updateLiveCutoff();
    }

    let customSteps = JSON.parse(JSON.stringify(PATTERNS.rock));

    function buildCustomPads() {
      ['kick', 'deepkick', 'snare', 'hihat', 'openhat', 'ride'].forEach(track => {
        const container = document.getElementById(`seq-${track}-pads`);
        if(!container) return;
        container.innerHTML = '';
        for (let i = 0; i < 16; i++) {
          const pad = document.createElement('div');
          pad.className = `seq-pad ${customSteps[track][i] ? 'active' : ''}`;
          pad.addEventListener('pointerdown', () => {
            customSteps[track][i] = customSteps[track][i] ? 0 : 1;
            pad.className = `seq-pad ${customSteps[track][i] ? 'active' : ''}`;
          });
          container.appendChild(pad);
        }
      });
    }
    buildCustomPads();

    const patternSelect = document.getElementById('drum-pattern');
    const customDrumPanel = document.getElementById('custom-drum-panel');
    const btnEditSeq = document.getElementById('btn-edit-seq');
    const btnCloseSeq = document.getElementById('btn-close-seq');

    patternSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'custom') {
        customDrumPanel.classList.add('visible');
      } else {
        if (PATTERNS[val]) {
          customSteps = JSON.parse(JSON.stringify(PATTERNS[val]));
          buildCustomPads();
        }
        customDrumPanel.classList.remove('visible');
      }
    });

    btnEditSeq.addEventListener('pointerdown', () => {
      patternSelect.value = 'custom';
      customDrumPanel.classList.add('visible');
    });

    btnCloseSeq.addEventListener('pointerdown', () => {
      customDrumPanel.classList.remove('visible');
    });

    const SCALES = [
      { name: 'Mayor (Jónica)',           intervals: [0,2,4,5,7,9,11,12], qual: ['maj','min','min','maj','maj','min','dim','maj'], roman: ['I','ii','iii','IV','V','vi','vii°','VIII'] },
      { name: 'Menor Natural (Eólica)',   intervals: [0,2,3,5,7,8,10,12], qual: ['min','dim','maj','min','min','maj','maj','min'], roman: ['i','ii°','bIII','iv','v','bVI','bVII','VIII'] },
      { name: 'Menor Armónica',           intervals: [0,2,3,5,7,8,11,12], qual: ['min','dim','aug','min','maj','maj','dim','min'], roman: ['i','ii°','bIII+','iv','V','bVI','vii°','VIII'] },
      { name: 'Menor Melódica',           intervals: [0,2,3,5,7,9,11,12], qual: ['min','min','aug','maj','maj','dim','dim','min'], roman: ['i','ii','bIII+','IV','V','vi°','vii°','VIII'] },
      { name: 'Dórica',                  intervals: [0,2,3,5,7,9,10,12], qual: ['min','min','maj','maj','min','dim','maj','min'], roman: ['i','ii','bIII','IV','v','vi°','bVII','VIII'] },
      { name: 'Frigia',                  intervals: [0,1,3,5,7,8,10,12], qual: ['min','maj','maj','min','dim','maj','min','min'], roman: ['i','bII','bIII','iv','v°','bVI','bvii','VIII'] },
      { name: 'Lidia',                   intervals: [0,2,4,6,7,9,11,12], qual: ['maj','maj','min','dim','maj','min','min','maj'], roman: ['I','II','iii','#iv°','V','vi','vii','VIII'] },
      { name: 'Mixolidia',               intervals: [0,2,4,5,7,9,10,12], qual: ['maj','min','dim','maj','min','min','maj','maj'], roman: ['I','ii','iii°','IV','v','vi','bVII','VIII'] },
      { name: 'Locria',                  intervals: [0,1,3,5,6,8,10,12], qual: ['dim','maj','min','min','maj','maj','min','dim'], roman: ['i°','bII','biii','iv','bV','bVI','bvii','VIII'] },
      { name: 'Frigia Dominante (Árabe)',intervals: [0,1,4,5,7,8,10,12], qual: ['maj','maj','dim','min','dim','maj','min','maj'], roman: ['I','bII','iii°','iv','v°','bVI','bvii','VIII'] },
      { name: 'Doble Armónica (Bizantina)',intervals: [0,1,4,5,7,8,11,12], qual: ['maj','maj','min','min','maj','aug','dim','maj'], roman: ['I','bII','iii','iv','V','bVI+','vii°','VIII'] },
      { name: 'Húngara Menor',            intervals: [0,2,3,6,7,8,11,12], qual: ['min','dim','aug','dim','maj','maj','dim','min'], roman: ['i','ii°','bIII+','#iv°','V','bVI','vii°','VIII'] },
      { name: 'Japonesa (Hirajoshi)',     intervals: [0,2,3,7,8,12,14,15], qual: ['min','maj','min','min','maj','min','maj','min'], roman: ['i','II','bIII','v','bVI','VIII','IX','bX'] },
      { name: 'Pentatónica Mayor',        intervals: [0,2,4,7,9,12,14,16], qual: ['maj','min','min','maj','min','maj','min','min'], roman: ['I','ii','iii','V','vi','VIII','IX','X'] },
      { name: 'Pentatónica Menor',        intervals: [0,3,5,7,10,12,15,17], qual: ['min','maj','min','min','maj','min','maj','min'], roman: ['i','bIII','iv','v','bVII','VIII','bX','XI'] },
      { name: 'Blues',                   intervals: [0,3,5,6,7,10,12,15], qual: ['min','maj','min','dim','min','maj','min','min'], roman: ['i','bIII','iv','iv#°','v','bVII','VIII','X'] },
      { name: 'Libre (Cromático 12)',    isChromatic: true }
    ];
    let currentScaleIdx = 0;

    const customParams = { carrierWave: 'sine', modulatorWave: 'sine', fmRatio: 2.0, fmDepth: 300 };

    document.getElementById('cf-carrier').addEventListener('change', (e) => { customParams.carrierWave = e.target.value; });
    document.getElementById('cf-modulator').addEventListener('change', (e) => { customParams.modulatorWave = e.target.value; });
    document.getElementById('cf-ratio').addEventListener('input', (e) => {
      customParams.fmRatio = parseFloat(e.target.value);
      document.getElementById('val-fm-ratio').innerText = customParams.fmRatio.toFixed(1) + 'x';
    });
    document.getElementById('cf-depth').addEventListener('input', (e) => {
      customParams.fmDepth = parseFloat(e.target.value);
      document.getElementById('val-fm-depth').innerText = Math.round(customParams.fmDepth) + 'Hz';
    });

    function updateLiveCutoff() {
      if (!actx) return;
      const t = actx.currentTime;
      activeKeys.forEach(voices => {
        voices.forEach(v => {
          if (v && v.filterNode) v.filterNode.frequency.setTargetAtTime(synthParams.cutoff, t, 0.05);
        });
      });
      strumVoices.forEach(v => {
        if (v && v.filterNode) v.filterNode.frequency.setTargetAtTime(synthParams.cutoff, t, 0.05);
      });
    }

    function updateDelayTime() {
      if (!actx || !delayNode) return;
      const beatSec = 60.0 / synthParams.bpm;
      const subdivEl = document.getElementById('echo-subdiv');
      const subdiv = subdivEl ? parseFloat(subdivEl.value) : 0.75;
      const calculatedDelay = Math.min(Math.max(0.02, beatSec * subdiv), 2.8);
      delayNode.delayTime.setTargetAtTime(calculatedDelay, actx.currentTime, 0.05);
    }

    function bindParam(inputId, labelId, key, unit) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const label = document.getElementById(labelId);
      input.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        synthParams[key] = val;
        if(label) label.innerText = val + unit;
        if(key === 'echo' && delayInputGain) delayInputGain.gain.value = val;
        if(key === 'cutoff') updateLiveCutoff();
      });
    }
    bindParam('p-attack', 'val-atk', 'attack', 's'); 
    bindParam('p-release', 'val-rel', 'release', 's');
    bindParam('p-cutoff', 'val-cut', 'cutoff', 'Hz'); 
    bindParam('p-echo', 'val-echo', 'echo', '%');
    bindParam('p-glide', 'val-glide', 'glide', 's');

    document.getElementById('echo-subdiv').addEventListener('change', updateDelayTime);

    document.getElementById('btn-bpm-down').addEventListener('pointerdown', () => {
      synthParams.bpm = Math.max(40, synthParams.bpm - 1);
      document.getElementById('val-bpm').innerText = synthParams.bpm + ' BPM';
      updateDelayTime();
    });
    document.getElementById('btn-bpm-up').addEventListener('pointerdown', () => {
      synthParams.bpm = Math.min(260, synthParams.bpm + 1);
      document.getElementById('val-bpm').innerText = synthParams.bpm + ' BPM';
      updateDelayTime();
    });

    document.getElementById('btn-dvol-down').addEventListener('pointerdown', () => {
      synthParams.drumVol = Math.max(0, Math.round((synthParams.drumVol - 0.05) * 100) / 100);
      document.getElementById('val-dvol').innerText = Math.round(synthParams.drumVol * 100) + '%';
      if(drumMasterGain) drumMasterGain.gain.value = synthParams.drumVol;
    });
    document.getElementById('btn-dvol-up').addEventListener('pointerdown', () => {
      synthParams.drumVol = Math.min(1, Math.round((synthParams.drumVol + 0.05) * 100) / 100);
      document.getElementById('val-dvol').innerText = Math.round(synthParams.drumVol * 100) + '%';
      if(drumMasterGain) drumMasterGain.gain.value = synthParams.drumVol;
    });

    let currentInst = 'analog';
    const instSelect = document.getElementById('inst-select');
    const customPanel = document.getElementById('custom-fm-panel');
    const vocalPanel = document.getElementById('vocal-panel');
    const btnCloseVocal = document.getElementById('btn-close-vocal');

    instSelect.addEventListener('change', (e) => {
      currentInst = e.target.value;
      if (currentInst === 'custom') {
        customPanel.classList.add('visible');
        vocalPanel.classList.remove('visible');
      } else if (currentInst === 'vocal') {
        vocalPanel.classList.add('visible');
        customPanel.classList.remove('visible');
        applyInstrumentDefaults('vocal');
      } else {
        customPanel.classList.remove('visible');
        vocalPanel.classList.remove('visible');
        applyInstrumentDefaults(currentInst);
      }
    });

    btnCloseVocal.addEventListener('pointerdown', () => {
      vocalPanel.classList.remove('visible');
    });

    let actx = null, masterGain = null, delayNode = null, delayInputGain = null, masterLimiter = null, drumMasterGain = null;
    let distortionCurve = null;
    function getDistortionCurve() {
      if (distortionCurve) return distortionCurve;
      distortionCurve = new Float32Array(44100);
      const k = 50;
      for (let i = 0; i < 44100; ++i) {
        let x = (i * 2) / 44100 - 1;
        distortionCurve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
      }
      return distortionCurve;
    }

    let globalNoiseBuffer = null;
    let globalChiptuneNoiseBuffer = null;

    // --- VOCODER & ROBOT ENGINE ---
    let userVocalBuffer = null;
    let defaultVocalBuffer = null;
    let vocalSpeed = 1.0;
    let vocalSens = 1.5;
    let vocalCarrierType = 'dual-saw';
    let vocalEnvelopeBus = null;
    let vocalModSource = null;
    let vocalIsActiveCount = 0;
    let vocalRectifierCurve = null;

    function getRectifierCurve() {
      if (vocalRectifierCurve) return vocalRectifierCurve;
      const n = 1024;
      vocalRectifierCurve = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const x = (i * 2) / n - 1;
        vocalRectifierCurve[i] = Math.max(0, x); // Rectificación de media onda para extraer la envolvente de voz
      }
      return vocalRectifierCurve;
    }

    // Crea un patrón robótico rítmico ("MORA-CHORD-RO-BOT") para que suene de fábrica
    function createDefaultRobotBuffer() {
      if (!actx) return null;
      const sr = actx.sampleRate;
      const dur = 2.0; // 2 segundos
      const buf = actx.createBuffer(1, sr * dur, sr);
      const data = buf.getChannelData(0);
      const syllables = [
        { f1: 800, f2: 1250, start: 0.05, len: 0.35 }, // "MO"
        { f1: 650, f2: 1800, start: 0.50, len: 0.35 }, // "RA"
        { f1: 500, f2: 900,  start: 1.00, len: 0.35 }, // "CHORD"
        { f1: 400, f2: 800,  start: 1.50, len: 0.35 }  // "BOT"
      ];
      for (let i = 0; i < data.length; i++) {
        const t = i / sr;
        let val = 0;
        syllables.forEach(s => {
          if (t >= s.start && t < s.start + s.len) {
            const st = t - s.start;
            const env = Math.sin((Math.PI * st) / s.len);
            const pulse = (Math.sin(2 * Math.PI * 130 * st) > 0 ? 1 : -1);
            const formants = Math.sin(2 * Math.PI * s.f1 * st) * 0.6 + Math.sin(2 * Math.PI * s.f2 * st) * 0.4;
            val += pulse * formants * env * 0.6;
          }
        });
        data[i] = val;
      }
      return buf;
    }

    function ensureVocalModulator() {
      if (!actx) return;
      if (!vocalEnvelopeBus) {
        vocalEnvelopeBus = actx.createGain();
        vocalEnvelopeBus.gain.value = vocalSens;
      }
      if (!defaultVocalBuffer) {
        defaultVocalBuffer = createDefaultRobotBuffer();
      }
      
      if (vocalIsActiveCount === 0 || !vocalModSource) {
        try { if(vocalModSource) vocalModSource.stop(); } catch(e){}
        
        const buf = userVocalBuffer || defaultVocalBuffer;
        vocalModSource = actx.createBufferSource();
        vocalModSource.buffer = buf;
        vocalModSource.loop = true;
        vocalModSource.playbackRate.value = vocalSpeed;

        if (vocalCarrierType === 'pure-robot') {
          // RingMod directo
          vocalModSource.connect(vocalEnvelopeBus);
        } else {
          // Extractor de envolvente de formantes (Vocoder clásico)
          const bq = actx.createBiquadFilter();
          bq.type = 'bandpass';
          bq.frequency.value = 1100;
          bq.Q.value = 0.9;

          const shaper = actx.createWaveShaper();
          shaper.curve = getRectifierCurve();

          const envLp = actx.createBiquadFilter();
          envLp.type = 'lowpass';
          envLp.frequency.value = 35; // Suavizado de fonemas

          vocalModSource.connect(bq);
          bq.connect(shaper);
          shaper.connect(envLp);
          envLp.connect(vocalEnvelopeBus);
        }
        vocalModSource.start(actx.currentTime);
      }
      vocalIsActiveCount++;
    }

    function releaseVocalModulator() {
      vocalIsActiveCount = Math.max(0, vocalIsActiveCount - 1);
      if (vocalIsActiveCount === 0 && vocalModSource) {
        try {
          vocalModSource.stop(actx.currentTime + 0.3);
          vocalModSource = null;
        } catch(e){}
      }
    }

    // Controles del Panel Vocoder
    const btnRecVocal = document.getElementById('btn-rec-vocal');
    const vocalStatus = document.getElementById('vocal-status-text');
    let isRecordingVocal = false;
    let vocalMediaRecorder = null;
    let vocalChunks = [];

    btnRecVocal.addEventListener('pointerdown', async () => {
      initAudio();
      if (!isRecordingVocal) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          vocalMediaRecorder = new MediaRecorder(stream);
          vocalChunks = [];
          vocalMediaRecorder.ondataavailable = e => vocalChunks.push(e.data);
          vocalMediaRecorder.onstop = async () => {
            const blob = new Blob(vocalChunks, { type: 'audio/ogg; codecs=opus' });
            const arrayBuf = await blob.arrayBuffer();
            userVocalBuffer = await actx.decodeAudioData(arrayBuf);
            vocalStatus.innerText = `¡Grabado con éxito! Duración: ${userVocalBuffer.duration.toFixed(1)}s`;
            btnRecVocal.innerText = '🎙️ GRABAR FRASE (MIC)';
            btnRecVocal.style.background = '#e11d48';
            isRecordingVocal = false;
            stream.getTracks().forEach(t => t.stop());
          };
          vocalMediaRecorder.start();
          isRecordingVocal = true;
          btnRecVocal.innerText = '⏹️ DETENER GRABACIÓN';
          btnRecVocal.style.background = '#0284c7';
          vocalStatus.innerText = 'Grabando... habla o canta ahora.';
        } catch(err) {
          vocalStatus.innerText = 'Error: no se pudo acceder al micrófono.';
        }
      } else {
        if (vocalMediaRecorder && vocalMediaRecorder.state === 'recording') {
          vocalMediaRecorder.stop();
        }
      }
    });

    document.getElementById('vocal-speed').addEventListener('input', (e) => {
      vocalSpeed = parseFloat(e.target.value);
      document.getElementById('val-vocal-speed').innerText = vocalSpeed.toFixed(2) + 'x';
      if (vocalModSource) vocalModSource.playbackRate.value = vocalSpeed;
    });

    document.getElementById('vocal-sens').addEventListener('input', (e) => {
      vocalSens = parseFloat(e.target.value);
      document.getElementById('val-vocal-sens').innerText = Math.round(vocalSens * 66) + '%';
      if (vocalEnvelopeBus) vocalEnvelopeBus.gain.value = vocalSens;
    });

    document.getElementById('vocal-carrier-type').addEventListener('change', (e) => {
      vocalCarrierType = e.target.value;
      if (vocalModSource) {
        vocalIsActiveCount = 0;
        try { vocalModSource.stop(); vocalModSource = null; } catch(err){}
      }
    });

    // Calcula el multiplicador para encajar exactamente en compases de 4 beats
    document.getElementById('btn-sync-vocal').addEventListener('pointerdown', () => {
      const buf = userVocalBuffer || defaultVocalBuffer;
      if (!buf) return;
      const beatSec = 60.0 / synthParams.bpm;
      const barSec = beatSec * 4;
      let targetBars = Math.max(1, Math.round(buf.duration / barSec));
      let targetDur = targetBars * barSec;
      vocalSpeed = Math.min(2.0, Math.max(0.5, buf.duration / targetDur));
      document.getElementById('vocal-speed').value = vocalSpeed;
      document.getElementById('val-vocal-speed').innerText = vocalSpeed.toFixed(2) + 'x';
      if (vocalModSource) vocalModSource.playbackRate.value = vocalSpeed;
      vocalStatus.innerText = `Sincronizado a ${targetBars} compás(es) de ${synthParams.bpm} BPM`;
    });

    const MAX_VOICES = 28;
    let activeVoicePool = [];

    function cleanVoice(voice) {
      if (!voice || voice.cleaned) return;
      voice.cleaned = true;
      voice.oscillators.forEach(o => {
        try { o.stop(); } catch(e){}
        try { o.disconnect(); } catch(e){}
      });
      if (voice.filterNode) {
        try { voice.filterNode.disconnect(); } catch(e){}
      }
      if (voice.extraNodes) {
        voice.extraNodes.forEach(n => { try { n.disconnect(); } catch(e){} });
      }
      if (voice.voiceGain) {
        try { voice.voiceGain.disconnect(); } catch(e){}
      }
      if (voice.inst === 'vocal') {
        releaseVocalModulator();
      }
      const idx = activeVoicePool.indexOf(voice);
      if (idx !== -1) activeVoicePool.splice(idx, 1);
    }

    function initAudio() {
      if (actx) return;
      try { if (screen.orientation && screen.orientation.lock) { screen.orientation.lock('landscape').catch(()=>{}); } } catch(e) {}
      
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      try {
        actx = new AudioCtx({ latencyHint: 'interactive' });
      } catch(e) {
        actx = new AudioCtx();
      }
      
      masterLimiter = actx.createDynamicsCompressor();
      masterLimiter.threshold.value = -6.0;
      masterLimiter.knee.value = 4.0;
      masterLimiter.ratio.value = 14.0;
      masterLimiter.attack.value = 0.002;
      masterLimiter.release.value = 0.06;
      
      masterGain = actx.createGain(); 
      masterGain.gain.value = 0.55; 

      delayInputGain = actx.createGain(); 
      delayInputGain.gain.value = synthParams.echo;
      
      delayNode = actx.createDelay(3.0); 
      updateDelayTime();

      const delayFeedback = actx.createGain(); 
      delayFeedback.gain.value = 0.35;
      const delayFilter = actx.createBiquadFilter(); 
      delayFilter.type = 'lowpass'; 
      delayFilter.frequency.value = 1200;
      
      delayInputGain.connect(delayNode); 
      delayNode.connect(delayFilter); 
      delayFilter.connect(delayFeedback); 
      delayFeedback.connect(delayNode);
      
      masterGain.connect(masterLimiter); 
      delayNode.connect(masterLimiter); 
      masterLimiter.connect(actx.destination);

      drumMasterGain = actx.createGain(); 
      drumMasterGain.gain.value = synthParams.drumVol;
      drumMasterGain.connect(masterLimiter); 

      const size = actx.sampleRate * 2;
      globalNoiseBuffer = actx.createBuffer(1, size, actx.sampleRate);
      const data = globalNoiseBuffer.getChannelData(0);
      for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;

      globalChiptuneNoiseBuffer = actx.createBuffer(1, size, actx.sampleRate);
      const cData = globalChiptuneNoiseBuffer.getChannelData(0);
      for (let i = 0; i < size; i++) cData[i] = Math.random() > 0.5 ? 1 : -1;
    }

    function getQuantizedTime() {
      if (!actx) return 0;
      const quant = document.getElementById('quantize-select').value;
      if (quant === 'off') return actx.currentTime;
      
      const divSteps = quant === '4' ? 4 : (quant === '8' ? 2 : 1);
      const stepDur = 0.25 * (60.0 / synthParams.bpm);

      if (isPlayingDrums) {
        let stepsUntil = (divSteps - (currentStep % divSteps)) % divSteps;
        if (stepsUntil === 0 && (nextNoteTime - actx.currentTime < stepDur * 0.2)) {
          stepsUntil = divSteps;
        }
        return Math.max(actx.currentTime, nextNoteTime + (stepsUntil - 1) * stepDur);
      } else {
        const grid = stepDur * divSteps;
        const remainder = actx.currentTime % grid;
        let delta = grid - remainder;
        if (delta < 0.015) delta += grid;
        return actx.currentTime + delta;
      }
    }

    function playPOSyncPulse(time) {
      if (document.getElementById('po-sync-select').value !== 'on') return;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1000, time);
      gain.gain.setValueAtTime(1.0, time);
      gain.gain.linearRampToValueAtTime(0.01, time + 0.01);
      osc.connect(gain);
      gain.connect(drumMasterGain);
      osc.start(time);
      osc.stop(time + 0.015);
    }

    function playKick(time) {
      const isChiptune = document.getElementById('drum-kit').value === 'chiptune';
      const osc = actx.createOscillator(); const gain = actx.createGain(); 
      osc.connect(gain); gain.connect(drumMasterGain);
      if (isChiptune) {
        osc.type = 'square'; osc.frequency.setValueAtTime(300, time); osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
        gain.gain.setValueAtTime(0.8, time); gain.gain.linearRampToValueAtTime(0.01, time + 0.1);
        osc.start(time); osc.stop(time + 0.15);
      } else {
        osc.frequency.setValueAtTime(140, time); osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.45);
        gain.gain.setValueAtTime(0.9, time); gain.gain.exponentialRampToValueAtTime(0.01, time + 0.45);
        osc.start(time); osc.stop(time + 0.45);
      }
      osc.onended = () => { try{ osc.disconnect(); gain.disconnect(); }catch(e){} };
    }
    
    function playDeepKick(time) {
      const osc = actx.createOscillator(); const gain = actx.createGain(); 
      osc.connect(gain); gain.connect(drumMasterGain);
      osc.type = 'sine'; 
      osc.frequency.setValueAtTime(95, time); 
      osc.frequency.exponentialRampToValueAtTime(35, time + 0.1);
      gain.gain.setValueAtTime(0.9, time); 
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.7);
      osc.start(time); osc.stop(time + 0.75);
      osc.onended = () => { try{ osc.disconnect(); gain.disconnect(); }catch(e){} };
    }

    function playSnare(time) {
      if (!globalNoiseBuffer) initAudio();
      const isChiptune = document.getElementById('drum-kit').value === 'chiptune';
      const noise = actx.createBufferSource(); 
      noise.buffer = isChiptune ? globalChiptuneNoiseBuffer : globalNoiseBuffer; 
      const noiseGain = actx.createGain();
      noiseGain.gain.setValueAtTime(isChiptune ? 0.5 : 0.8, time); 
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);
      
      if (isChiptune) {
        noise.connect(noiseGain); noiseGain.connect(drumMasterGain); noise.start(time); noise.stop(time + 0.18);
        const osc = actx.createOscillator(); const oscGain = actx.createGain(); osc.type = 'square'; osc.connect(oscGain);
        osc.frequency.setValueAtTime(800, time); osc.frequency.exponentialRampToValueAtTime(200, time + 0.1);
        oscGain.gain.setValueAtTime(0.4, time); oscGain.gain.linearRampToValueAtTime(0.01, time + 0.15);
        oscGain.connect(drumMasterGain); osc.start(time); osc.stop(time + 0.15);
        osc.onended = () => { try{ osc.disconnect(); oscGain.disconnect(); }catch(e){} };
      } else {
        const osc = actx.createOscillator(); const oscGain = actx.createGain(); osc.type = 'triangle'; osc.connect(oscGain); osc.frequency.setValueAtTime(230, time);
        oscGain.gain.setValueAtTime(0.6, time); oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);
        const noiseFilter = actx.createBiquadFilter(); noiseFilter.type = 'highpass'; noiseFilter.frequency.value = 1000;
        noise.connect(noiseFilter); noiseFilter.connect(noiseGain); oscGain.connect(drumMasterGain); noiseGain.connect(drumMasterGain);
        osc.start(time); osc.stop(time + 0.18); noise.start(time); noise.stop(time + 0.18);
        osc.onended = () => { try{ osc.disconnect(); oscGain.disconnect(); noiseFilter.disconnect(); noiseGain.disconnect(); }catch(e){} };
      }
    }
    
    function playHiHat(time) {
      if (!globalNoiseBuffer) initAudio();
      const isChiptune = document.getElementById('drum-kit').value === 'chiptune';
      const noise = actx.createBufferSource(); 
      noise.buffer = isChiptune ? globalChiptuneNoiseBuffer : globalNoiseBuffer;
      const noiseFilter = actx.createBiquadFilter(); noiseFilter.type = 'highpass'; noiseFilter.frequency.value = isChiptune ? 4000 : 5000;
      const noiseGain = actx.createGain(); noiseGain.gain.setValueAtTime(isChiptune ? 0.35 : 0.28, time); noiseGain.gain.exponentialRampToValueAtTime(0.01, time + (isChiptune ? 0.05 : 0.08));
      noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(drumMasterGain); 
      noise.start(time); noise.stop(time + 0.09);
      noise.onended = () => { try{ noise.disconnect(); noiseFilter.disconnect(); noiseGain.disconnect(); }catch(e){} };
    }
    
    function playOpenHiHat(time) {
      if (!globalNoiseBuffer) initAudio();
      const isChiptune = document.getElementById('drum-kit').value === 'chiptune';
      const noise = actx.createBufferSource(); 
      noise.buffer = isChiptune ? globalChiptuneNoiseBuffer : globalNoiseBuffer;
      const noiseFilter = actx.createBiquadFilter(); noiseFilter.type = 'highpass'; noiseFilter.frequency.value = isChiptune ? 3000 : 4000;
      const noiseGain = actx.createGain(); noiseGain.gain.setValueAtTime(isChiptune ? 0.35 : 0.28, time); noiseGain.gain.exponentialRampToValueAtTime(0.01, time + (isChiptune ? 0.2 : 0.35));
      noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(drumMasterGain); 
      noise.start(time); noise.stop(time + 0.36);
      noise.onended = () => { try{ noise.disconnect(); noiseFilter.disconnect(); noiseGain.disconnect(); }catch(e){} };
    }

    function playRide(time) {
      if (!globalNoiseBuffer) initAudio();
      const isChiptune = document.getElementById('drum-kit').value === 'chiptune';
      const noiseGain = actx.createGain(); noiseGain.gain.setValueAtTime(0.18, time); noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.45);
      noiseGain.connect(drumMasterGain);

      const noise = actx.createBufferSource(); noise.buffer = isChiptune ? globalChiptuneNoiseBuffer : globalNoiseBuffer;
      const noiseFilter = actx.createBiquadFilter(); noiseFilter.type = 'highpass'; noiseFilter.frequency.value = 6000;
      noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noise.start(time); noise.stop(time + 0.45);

      if (!isChiptune) {
         const osc1 = actx.createOscillator(); osc1.type = 'square'; osc1.frequency.value = 3200;
         const osc2 = actx.createOscillator(); osc2.type = 'square'; osc2.frequency.value = 4800;
         const oscGain = actx.createGain(); oscGain.gain.setValueAtTime(0.08, time); oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.45);
         const oscFilter = actx.createBiquadFilter(); oscFilter.type = 'highpass'; oscFilter.frequency.value = 2000;
         osc1.connect(oscFilter); osc2.connect(oscFilter); oscFilter.connect(oscGain); oscGain.connect(drumMasterGain);
         osc1.start(time); osc2.start(time); osc1.stop(time + 0.5); osc2.stop(time + 0.5);
         osc1.onended = () => { try{ osc1.disconnect(); osc2.disconnect(); oscFilter.disconnect(); oscGain.disconnect(); }catch(e){} };
      }
      noise.onended = () => { try{ noise.disconnect(); noiseFilter.disconnect(); noiseGain.disconnect(); }catch(e){} };
    }

    let isPlayingDrums = false; let currentStep = 0; let nextNoteTime = 0; let timerID;
    function nextNote() {
      const secondsPerBeat = 60.0 / synthParams.bpm; nextNoteTime += 0.25 * secondsPerBeat;
      currentStep++; 
      if (currentStep >= 16) currentStep = 0;
    }
    function scheduleNote(stepNumber, time) {
      playPOSyncPulse(time);

      const pKey = document.getElementById('drum-pattern').value;
      const p = (pKey === 'custom') ? customSteps : (PATTERNS[pKey] || PATTERNS.rock);

      if (p.kick && p.kick[stepNumber]) playKick(time);
      if (p.deepkick && p.deepkick[stepNumber]) playDeepKick(time);
      if (p.snare && p.snare[stepNumber]) playSnare(time);
      if (p.hihat && p.hihat[stepNumber]) playHiHat(time);
      if (p.openhat && p.openhat[stepNumber]) playOpenHiHat(time);
      if (p.ride && p.ride[stepNumber]) playRide(time);
    }
    function scheduler() {
      while (nextNoteTime < actx.currentTime + 0.1) { scheduleNote(currentStep, nextNoteTime); nextNote(); }
      timerID = window.setTimeout(scheduler, 25.0);
    }
    document.getElementById('btn-drum-play').addEventListener('pointerdown', (e) => {
      initAudio(); isPlayingDrums = !isPlayingDrums;
      if (isPlayingDrums) {
        if (actx.state === 'suspended') actx.resume();
        currentStep = 0; nextNoteTime = actx.currentTime + 0.05; scheduler();
        e.target.innerText = '■ STOP BEAT'; e.target.classList.add('playing');
      } else { window.clearTimeout(timerID); e.target.innerText = '▶ PLAY BEAT'; e.target.classList.remove('playing'); }
    });

    const NOTE_NAMES = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
    let keyOffset = 0; let currentMod = 'center'; let armedDegree = 0; let activeKeys = new Map(); 

    function getNoteName(midi) { return NOTE_NAMES[(midi % 12 + 12) % 12]; }
    function getIntervalsAndName(baseQual, mod) {
      const b = -12; let i = []; let s = '';
      if (mod === 'center') {
        if (baseQual === 'maj') { i = [b, 0,4,7]; s = ''; }
        if (baseQual === 'min') { i = [b, 0,3,7]; s = 'm'; }
        if (baseQual === 'dim') { i = [b, 0,3,6]; s = 'dim'; }
        if (baseQual === 'aug') { i = [b, 0,4,8]; s = 'aug'; }
      } else if (mod === 'flip') { 
        if (baseQual === 'maj') { i = [b, 0,3,7]; s = 'm'; } else { i = [b, 0,4,7]; s = ''; }
      } else if (mod === 'dom7') { i = [b, 0,4,7,10]; s = '7'; }
      else if (mod === '7th') {
        if (baseQual === 'maj') { i = [b, 0,4,7,11]; s = 'Maj7'; } else { i = [b, 0,3,7,10]; s = 'm7'; }
      } else if (mod === '9th') { 
        if (baseQual === 'maj') { i = [b, 0,4,7,11,14]; s = 'Maj9'; } else { i = [b, 0,3,7,10,14]; s = 'm9'; }
      } else if (mod === 'sus4') { i = [b, 0,5,7]; s = 'sus4'; }
      else if (mod === '6th') {
        if (baseQual === 'maj') { i = [b, 0,4,7,9]; s = '6'; } else { i = [b, 0,3,7,9]; s = 'm6'; }
      } else if (mod === 'dim') { i = [b, 0,3,6,9]; s = 'dim7'; }
      else if (mod === 'aug') { i = [b, 0,4,8]; s = 'aug'; }
      return { i: i || [b,0,4,7], s }; 
    }

    function playChordNote(midi, inst, isBass, isStrum = false, startTime = null, prevFreq = null) {
      while (activeVoicePool.length >= MAX_VOICES) {
        const oldest = activeVoicePool.shift();
        if (oldest && !oldest.cleaned) {
          const now = actx.currentTime;
          oldest.voiceGain.gain.cancelScheduledValues(now);
          oldest.voiceGain.gain.setValueAtTime(oldest.voiceGain.gain.value, now);
          oldest.voiceGain.gain.setTargetAtTime(0.0001, now, 0.006);
          setTimeout(() => cleanVoice(oldest), 25);
        }
      }

      const freq = 440 * Math.pow(2, (midi - 69) / 12);
      const t = startTime !== null ? startTime : actx.currentTime;
      
      // Compensación de volumen para agudos
      const noteGainCompensation = Math.max(0.4, 1 - ((midi - 48) / 75));

      const voiceGain = actx.createGain();
      const oscillators = [];
      const extraNodes = [];
      const currentAttack = isStrum ? 0.035 : Math.max(0.005, synthParams.attack);

      const filterNode = actx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(synthParams.cutoff, t);

      let targetGain = 0.05;

      if (inst === 'vocal') {
        filterNode.Q.value = 2.0;
        targetGain = 0.065;
        ensureVocalModulator();

        const osc1 = actx.createOscillator();
        const osc2 = actx.createOscillator();
        const carrierMix = actx.createGain();
        extraNodes.push(carrierMix);

        if (vocalCarrierType === 'bright-pulse') {
          osc1.type = 'sawtooth';
          osc2.type = 'square';
          osc1.detune.value = -6;
          osc2.detune.value = 6;
        } else if (vocalCarrierType === 'pure-robot') {
          osc1.type = 'square';
          osc2.type = 'square';
          osc1.detune.value = -12;
          osc2.detune.value = 12;
        } else {
          // Dual Saw Daft
          osc1.type = 'sawtooth';
          osc2.type = 'sawtooth';
          osc1.detune.value = -7;
          osc2.detune.value = 7;
        }

        osc1.frequency.setValueAtTime(prevFreq || freq, t);
        osc2.frequency.setValueAtTime(prevFreq || freq, t);
        osc1.freqMultiplier = 1;
        osc2.freqMultiplier = 1;

        if (prevFreq && synthParams.glide > 0.005) {
          osc1.frequency.setTargetAtTime(freq, t, synthParams.glide);
          osc2.frequency.setTargetAtTime(freq, t, synthParams.glide);
        }

        osc1.connect(carrierMix);
        osc2.connect(carrierMix);
        oscillators.push(osc1, osc2);

        // VCA modulado por la voz
        const vocoderVCA = actx.createGain();
        vocoderVCA.gain.value = 0.15; // Ganancia base ligera para claridad
        if (vocalEnvelopeBus) {
          vocalEnvelopeBus.connect(vocoderVCA.gain);
        }
        extraNodes.push(vocoderVCA);

        carrierMix.connect(vocoderVCA);
        vocoderVCA.connect(filterNode);

      } else if (inst === 'custom') {
        filterNode.Q.value = 1.0;
        targetGain = 0.048;
        const carrier = actx.createOscillator();
        const modulator = actx.createOscillator();
        const modGain = actx.createGain();
        extraNodes.push(modGain);

        carrier.type = customParams.carrierWave;
        carrier.frequency.setValueAtTime(prevFreq || freq, t);
        if (prevFreq && synthParams.glide > 0.005) {
          carrier.frequency.setTargetAtTime(freq, t, synthParams.glide);
        }
        carrier.freqMultiplier = 1;

        modulator.type = customParams.modulatorWave;
        modulator.frequency.setValueAtTime((prevFreq || freq) * customParams.fmRatio, t);
        if (prevFreq && synthParams.glide > 0.005) {
          modulator.frequency.setTargetAtTime(freq * customParams.fmRatio, t, synthParams.glide);
        }
        modulator.freqMultiplier = customParams.fmRatio;

        modGain.gain.value = customParams.fmDepth;
        modulator.connect(modGain);
        modGain.connect(carrier.frequency);

        carrier.connect(filterNode);
        oscillators.push(carrier, modulator);

      } else if (inst === 'guitar') {
        filterNode.Q.value = 2.5;
        targetGain = 0.042;
        const distortion = actx.createWaveShaper();
        distortion.curve = getDistortionCurve();
        extraNodes.push(distortion);

        const osc1 = actx.createOscillator(); osc1.type = 'sawtooth'; osc1.frequency.setValueAtTime(prevFreq || freq, t); osc1.freqMultiplier = 1;
        const osc2 = actx.createOscillator(); osc2.type = 'square'; osc2.frequency.setValueAtTime(prevFreq || freq, t); osc2.detune.value = 4; osc2.freqMultiplier = 1;
        
        if (prevFreq && synthParams.glide > 0.005) {
          osc1.frequency.setTargetAtTime(freq, t, synthParams.glide);
          osc2.frequency.setTargetAtTime(freq, t, synthParams.glide);
        }

        osc1.connect(distortion); osc2.connect(distortion);
        distortion.connect(filterNode);
        oscillators.push(osc1, osc2);

      } else if (inst === 'acidbass') {
        filterNode.Q.value = 16.0; 
        targetGain = 0.06;
        filterNode.frequency.setValueAtTime(Math.min(14000, synthParams.cutoff * 3.5), t);
        filterNode.frequency.exponentialRampToValueAtTime(Math.max(80, synthParams.cutoff), t + 0.3);

        const osc = actx.createOscillator(); osc.type = 'sawtooth'; osc.frequency.setValueAtTime(prevFreq || freq, t); osc.freqMultiplier = 1;
        if (prevFreq && synthParams.glide > 0.005) {
          osc.frequency.setTargetAtTime(freq, t, synthParams.glide);
        }
        osc.connect(filterNode);
        oscillators.push(osc);

      } else if (inst === 'analog') {
        filterNode.Q.value = 0.8;
        targetGain = 0.048;
        const osc1 = actx.createOscillator(); osc1.type = 'sawtooth'; osc1.frequency.setValueAtTime(prevFreq || freq, t); osc1.detune.value = -2; osc1.freqMultiplier = 1;
        const osc2 = actx.createOscillator(); osc2.type = 'triangle'; osc2.frequency.setValueAtTime(prevFreq || freq, t); osc2.detune.value = 2; osc2.freqMultiplier = 1;
        if (prevFreq && synthParams.glide > 0.005) {
          osc1.frequency.setTargetAtTime(freq, t, synthParams.glide);
          osc2.frequency.setTargetAtTime(freq, t, synthParams.glide);
        }
        osc1.connect(filterNode); osc2.connect(filterNode);
        oscillators.push(osc1, osc2);

        if (isBass && !isStrum) { 
          const sub = actx.createOscillator(); sub.type = 'sine'; sub.frequency.setValueAtTime((prevFreq || freq) / 2, t); sub.freqMultiplier = 0.5;
          if (prevFreq && synthParams.glide > 0.005) sub.frequency.setTargetAtTime(freq / 2, t, synthParams.glide);
          const subGain = actx.createGain(); subGain.gain.value = 0.35; sub.connect(subGain); subGain.connect(filterNode);
          extraNodes.push(subGain);
          oscillators.push(sub);
        }

      } else if (inst === 'strings') {
        filterNode.Q.value = 0.4;
        targetGain = 0.038;
        const osc1 = actx.createOscillator(); osc1.type = 'sawtooth'; osc1.frequency.setValueAtTime(prevFreq || freq, t); osc1.detune.value = -4; osc1.freqMultiplier = 1;
        const osc2 = actx.createOscillator(); osc2.type = 'sawtooth'; osc2.frequency.setValueAtTime(prevFreq || freq, t); osc2.detune.value = 4; osc2.freqMultiplier = 1;
        const osc3 = actx.createOscillator(); osc3.type = 'sawtooth'; osc3.frequency.setValueAtTime(prevFreq || freq, t); osc3.detune.value = 0; osc3.freqMultiplier = 1;
        if (prevFreq && synthParams.glide > 0.005) {
          osc1.frequency.setTargetAtTime(freq, t, synthParams.glide);
          osc2.frequency.setTargetAtTime(freq, t, synthParams.glide);
          osc3.frequency.setTargetAtTime(freq, t, synthParams.glide);
        }
        osc1.connect(filterNode); osc2.connect(filterNode); osc3.connect(filterNode);
        oscillators.push(osc1, osc2, osc3);

        if (isBass && !isStrum) { 
          const sub = actx.createOscillator(); sub.type = 'sawtooth'; sub.frequency.setValueAtTime((prevFreq || freq) / 2, t); sub.freqMultiplier = 0.5;
          if (prevFreq && synthParams.glide > 0.005) sub.frequency.setTargetAtTime(freq / 2, t, synthParams.glide);
          const subGain = actx.createGain(); subGain.gain.value = 0.4; sub.connect(subGain); subGain.connect(filterNode);
          extraNodes.push(subGain);
          oscillators.push(sub);
        }

      } else if (inst === 'organ') {
        filterNode.Q.value = 0.4;
        targetGain = 0.045;
        const osc1 = actx.createOscillator(); osc1.type = 'sine'; osc1.frequency.setValueAtTime(prevFreq || freq, t); osc1.freqMultiplier = 1;
        const osc2 = actx.createOscillator(); osc2.type = 'triangle'; osc2.frequency.setValueAtTime(prevFreq || freq, t); osc2.freqMultiplier = 1;
        const osc3 = actx.createOscillator(); osc3.type = 'square'; osc3.frequency.setValueAtTime((prevFreq || freq) * 2, t); osc3.freqMultiplier = 2; 
        if (prevFreq && synthParams.glide > 0.005) {
          osc1.frequency.setTargetAtTime(freq, t, synthParams.glide);
          osc2.frequency.setTargetAtTime(freq, t, synthParams.glide);
          osc3.frequency.setTargetAtTime(freq * 2, t, synthParams.glide);
        }
        const g1 = actx.createGain(); g1.gain.value = 0.55; osc1.connect(g1); g1.connect(filterNode);
        const g2 = actx.createGain(); g2.gain.value = 0.25; osc2.connect(g2); g2.connect(filterNode);
        const g3 = actx.createGain(); g3.gain.value = 0.04; osc3.connect(g3); g3.connect(filterNode);
        extraNodes.push(g1, g2, g3);
        oscillators.push(osc1, osc2, osc3);

      } else if (inst === '8bit') {
        filterNode.Q.value = 0.4;
        targetGain = 0.042;
        const osc1 = actx.createOscillator(); osc1.type = 'square'; osc1.frequency.setValueAtTime(prevFreq || freq, t); osc1.freqMultiplier = 1;
        const osc2 = actx.createOscillator(); osc2.type = 'square'; osc2.frequency.setValueAtTime(prevFreq || freq, t); osc2.detune.value = 2; osc2.freqMultiplier = 1;
        if (prevFreq && synthParams.glide > 0.005) {
          osc1.frequency.setTargetAtTime(freq, t, synthParams.glide);
          osc2.frequency.setTargetAtTime(freq, t, synthParams.glide);
        }
        osc1.connect(filterNode); osc2.connect(filterNode);
        oscillators.push(osc1, osc2);

        if (isBass && !isStrum) { 
          const sub = actx.createOscillator(); sub.type = 'square'; sub.frequency.setValueAtTime((prevFreq || freq) / 2, t); sub.freqMultiplier = 0.5;
          if (prevFreq && synthParams.glide > 0.005) sub.frequency.setTargetAtTime(freq / 2, t, synthParams.glide);
          const subGain = actx.createGain(); subGain.gain.value = 0.35; sub.connect(subGain); subGain.connect(filterNode);
          extraNodes.push(subGain);
          oscillators.push(sub);
        }

      } else if (inst === 'crystal') {
        filterNode.Q.value = 1.6;
        targetGain = 0.045;
        const osc1 = actx.createOscillator(); osc1.type = 'sine'; osc1.frequency.setValueAtTime(prevFreq || freq, t); osc1.freqMultiplier = 1;
        const osc2 = actx.createOscillator(); osc2.type = 'sine'; osc2.frequency.setValueAtTime((prevFreq || freq) * 2.78, t); osc2.freqMultiplier = 2.78; 
        const osc3 = actx.createOscillator(); osc3.type = 'triangle'; osc3.frequency.setValueAtTime((prevFreq || freq) * 2, t); osc3.freqMultiplier = 2;
        if (prevFreq && synthParams.glide > 0.005) {
          osc1.frequency.setTargetAtTime(freq, t, synthParams.glide);
          osc2.frequency.setTargetAtTime(freq * 2.78, t, synthParams.glide);
          osc3.frequency.setTargetAtTime(freq * 2, t, synthParams.glide);
        }
        osc1.connect(filterNode);
        const g2 = actx.createGain(); g2.gain.value = 0.25; osc2.connect(g2); g2.connect(filterNode);
        const g3 = actx.createGain(); g3.gain.value = 0.18; osc3.connect(g3); g3.connect(filterNode);
        extraNodes.push(g2, g3);
        oscillators.push(osc1, osc2, osc3);

      } else if (inst === 'sweep') {
        filterNode.Q.value = 7.0; 
        targetGain = 0.045;
        filterNode.frequency.setValueAtTime(Math.min(14000, synthParams.cutoff * 3.5), t);
        filterNode.frequency.exponentialRampToValueAtTime(Math.max(120, synthParams.cutoff), t + currentAttack * 2.2);

        const osc1 = actx.createOscillator(); osc1.type = 'sawtooth'; osc1.frequency.setValueAtTime(prevFreq || freq, t); osc1.detune.value = -3; osc1.freqMultiplier = 1;
        const osc2 = actx.createOscillator(); osc2.type = 'square'; osc2.frequency.setValueAtTime(prevFreq || freq, t); osc2.detune.value = 3; osc2.freqMultiplier = 1;
        if (prevFreq && synthParams.glide > 0.005) {
          osc1.frequency.setTargetAtTime(freq, t, synthParams.glide);
          osc2.frequency.setTargetAtTime(freq, t, synthParams.glide);
        }
        osc1.connect(filterNode); osc2.connect(filterNode);
        oscillators.push(osc1, osc2);

      } else if (inst === 'alien') {
        filterNode.Q.value = 1.0;
        targetGain = 0.048;
        const carrier = actx.createOscillator(); carrier.type = 'sine'; carrier.frequency.setValueAtTime(prevFreq || freq, t); carrier.freqMultiplier = 1;
        const modulator = actx.createOscillator(); modulator.type = 'sawtooth';
        modulator.frequency.setValueAtTime((prevFreq || freq) * 0.5, t); modulator.freqMultiplier = 0.5;
        if (prevFreq && synthParams.glide > 0.005) {
          carrier.frequency.setTargetAtTime(freq, t, synthParams.glide);
          modulator.frequency.setTargetAtTime(freq * 0.5, t, synthParams.glide);
        }
        const modGain = actx.createGain(); modGain.gain.value = freq * 3; 
        modulator.connect(modGain); modGain.connect(carrier.frequency);
        carrier.connect(filterNode);
        extraNodes.push(modGain);
        oscillators.push(carrier, modulator);
      }
      
      targetGain *= noteGainCompensation;

      filterNode.connect(voiceGain);
      voiceGain.connect(masterGain);
      voiceGain.connect(delayInputGain);

      voiceGain.gain.setValueAtTime(0, t);
      voiceGain.gain.linearRampToValueAtTime(targetGain, t + currentAttack);

      oscillators.forEach(o => o.start(t));
      const voice = { oscillators, extraNodes, voiceGain, filterNode, inst, isBass, startTime: t, freq, cleaned: false };
      activeVoicePool.push(voice);
      return voice;
    }

    function stopChordNote(voice) {
      if (!voice || voice.cleaned || voice.isStopping) return;
      voice.isStopping = true;
      const t = actx.currentTime;
      const rel = synthParams.release; 
      const stopT = Math.max(t, (voice.startTime || t) + 0.02);
      
      voice.voiceGain.gain.cancelScheduledValues(stopT); 
      voice.voiceGain.gain.setValueAtTime(voice.voiceGain.gain.value || 0.05, stopT);
      voice.voiceGain.gain.setTargetAtTime(0.0001, stopT, Math.max(0.02, rel / 3.5));

      const durationMs = (stopT - t + Math.max(0.08, rel) + 0.05) * 1000;
      setTimeout(() => {
        cleanVoice(voice);
      }, Math.max(40, durationMs));
    }

    function updateActiveChordsFrequencies() {
      if (!actx) return;
      const t = actx.currentTime;
      const scale = SCALES[currentScaleIdx];
      const isChrom = scale.isChromatic;

      activeKeys.forEach((voices, btn) => {
        let idx = parseInt(btn.dataset.idx);
        let rootMidi = isChrom ? (48 + keyOffset + idx) : (48 + keyOffset + scale.intervals[idx]);
        let baseQual = isChrom ? 'maj' : scale.qual[idx];
        let intervalData = getIntervalsAndName(baseQual, currentMod);
        
        voices.forEach((voice, index) => {
          if (!voice || voice.cleaned) return;
          if (index >= intervalData.i.length) {
            voice.voiceGain.gain.setTargetAtTime(0.0001, t, 0.05); return;
          }
          if (voice.voiceGain.gain.value < 0.01) {
            voice.voiceGain.gain.setTargetAtTime(0.05, t, 0.05);
          }
          let newMidi = rootMidi + intervalData.i[index];
          let newFreq = 440 * Math.pow(2, (newMidi - 69) / 12);
          voice.freq = newFreq;
          
          voice.oscillators.forEach(osc => {
            if(osc.freqMultiplier !== undefined) {
              let finalFreq = newFreq * osc.freqMultiplier;
              osc.frequency.setTargetAtTime(finalFreq, t, Math.max(0.02, synthParams.glide));
            }
          });
        });
      });
    }

    function updateUI() {
      const scale = SCALES[currentScaleIdx];
      const isChrom = scale.isChromatic;
      document.getElementById('scale-select').value = currentScaleIdx;
      document.getElementById('key-display').innerText = getNoteName(48 + keyOffset);
      
      const container = document.getElementById('keys-container');
      container.className = isChrom ? 'keys-container layout-chromatic' : 'keys-container layout-diatonic';

      if (!isChrom && armedDegree > 7) armedDegree = 0;

      document.querySelectorAll('.btn-key').forEach(btn => {
        let idx = parseInt(btn.dataset.idx);
        if (!isChrom && idx > 7) return;

        let midi = isChrom ? (48 + keyOffset + idx) : (48 + keyOffset + scale.intervals[idx]);
        let baseQual = isChrom ? 'maj' : scale.qual[idx];
        let intervalData = getIntervalsAndName(baseQual, currentMod);
        
        btn.querySelector('.chord-name').innerText = getNoteName(midi) + intervalData.s;
        if (!isChrom && scale.roman && scale.roman[idx]) {
          btn.querySelector('.roman').innerText = scale.roman[idx];
        } else {
          btn.querySelector('.roman').innerText = '';
        }

        if (idx === armedDegree) btn.classList.add('armed'); else btn.classList.remove('armed');
      });

      document.querySelectorAll('.lbl').forEach(el => el.classList.remove('active'));
      if(currentMod !== 'center') document.getElementById('lbl-' + currentMod).classList.add('active');

      let armedMidi = isChrom ? (48 + keyOffset + armedDegree) : (48 + keyOffset + scale.intervals[armedDegree]);
      let armedBaseQual = isChrom ? 'maj' : scale.qual[armedDegree];
      let armedIntData = getIntervalsAndName(armedBaseQual, currentMod);
      document.getElementById('main-chord-display').innerText = getNoteName(armedMidi) + " " + armedIntData.s;

      if (activeKeys.size > 0) updateActiveChordsFrequencies();
    }

    document.getElementById('scale-select').addEventListener('change', (e) => { currentScaleIdx = parseInt(e.target.value); updateUI(); });
    document.getElementById('btn-key-up').addEventListener('pointerdown', () => { keyOffset = (keyOffset + 1) % 12; updateUI(); });
    document.getElementById('btn-key-down').addEventListener('pointerdown', () => { keyOffset = (keyOffset - 1 + 12) % 12; updateUI(); });

    // JOYSTICK
    const joyCenter = document.getElementById('joyCenter'); const joyStick = document.getElementById('joyStick'); let joyPointerId = null;
    joyCenter.addEventListener('pointerdown', (e) => { joyPointerId = e.pointerId; joyCenter.setPointerCapture(joyPointerId); handleJoy(e); });
    joyCenter.addEventListener('pointermove', (e) => { if (e.pointerId === joyPointerId) handleJoy(e); });
    function releaseJoy(e) { if (e.pointerId !== joyPointerId) return; joyPointerId = null; joyStick.style.transform = `translate(0px, 0px)`; currentMod = 'center'; updateUI(); }
    joyCenter.addEventListener('pointerup', releaseJoy); joyCenter.addEventListener('pointercancel', releaseJoy);

    function handleJoy(e) {
      const rect = joyCenter.getBoundingClientRect(); let dx = e.clientX - rect.left - (rect.width/2); let dy = e.clientY - rect.top - (rect.height/2);
      const dist = Math.sqrt(dx*dx + dy*dy); const maxR = 15;
      if (dist > maxR) { dx = (dx/dist)*maxR; dy = (dy/dist)*maxR; }
      joyStick.style.transform = `translate(${dx}px, ${dy}px)`;
      let newMod = 'center';
      if (dist >= 8) {
        let a = Math.atan2(dy, dx) * 180 / Math.PI; a = a < 0 ? a + 360 : a;
        if (a < 22.5 || a >= 337.5) newMod = '7th'; else if (a < 67.5) newMod = '9th';
        else if (a < 112.5) newMod = 'sus4'; else if (a < 157.5) newMod = '6th';
        else if (a < 202.5) newMod = 'dim'; else if (a < 247.5) newMod = 'aug';
        else if (a < 292.5) newMod = 'flip'; else newMod = 'dom7';
      }
      if (currentMod !== newMod) { currentMod = newMod; updateUI(); }
    }

    let lastNoteFreq = null;

    document.querySelectorAll('.btn-key').forEach(btn => {
      btn.addEventListener('pointerdown', (e) => {
        initAudio(); 
        if (actx.state === 'suspended') actx.resume();
        let idx = parseInt(btn.dataset.idx); armedDegree = idx; 
        updateUI(); 
        btn.classList.add('active'); btn.setPointerCapture(e.pointerId);
        
        const scale = SCALES[currentScaleIdx];
        const isChrom = scale.isChromatic;
        let rootMidi = isChrom ? (48 + keyOffset + idx) : (48 + keyOffset + scale.intervals[idx]);
        let baseQual = isChrom ? 'maj' : scale.qual[idx];
        
        let maxIntervals = getIntervalsAndName(baseQual, '9th').i; 
        let currentIntervals = getIntervalsAndName(baseQual, currentMod).i;
        let voices = []; 
        let qTime = getQuantizedTime();

        maxIntervals.forEach((_, i) => { 
          let voiceMidi = rootMidi + (currentIntervals[i] !== undefined ? currentIntervals[i] : maxIntervals[i]);
          let voice = playChordNote(voiceMidi, currentInst, i === 0, false, qTime, lastNoteFreq);
          if (currentIntervals[i] === undefined) { voice.voiceGain.gain.setValueAtTime(0, qTime); }
          voices.push(voice); 
        });

        lastNoteFreq = 440 * Math.pow(2, (rootMidi - 69) / 12);
        activeKeys.set(btn, voices);
      });
      function releaseBtn() {
        btn.classList.remove('active'); 
        if (activeKeys.has(btn)) { activeKeys.get(btn).forEach(v => stopChordNote(v)); activeKeys.delete(btn); }
      }
      btn.addEventListener('pointerup', releaseBtn); btn.addEventListener('pointercancel', releaseBtn);
    });

    const strumplate = document.getElementById('strumplate'); let lastStrumIdx = -1; let strumVoices = [];
    function handleStrum(e) {
      initAudio(); const elem = document.elementFromPoint(e.clientX, e.clientY);
      if (elem && elem.classList.contains('strum-string')) {
        let idx = parseInt(elem.dataset.idx);
        if (idx !== lastStrumIdx) {
          lastStrumIdx = idx; elem.classList.add('hit'); setTimeout(() => elem.classList.remove('hit'), 150);
          
          const scale = SCALES[currentScaleIdx];
          const isChrom = scale.isChromatic;
          let midi = isChrom ? (48 + keyOffset + armedDegree) : (48 + keyOffset + scale.intervals[armedDegree]);
          let baseQual = isChrom ? 'maj' : scale.qual[armedDegree];
          
          let intervalData = getIntervalsAndName(baseQual, currentMod);
          let chordTones = intervalData.i.filter(v => v >= 0);
          if (chordTones.length === 0) chordTones = [0, 4, 7];
          
          let extendedHarmonics = [
            chordTones[0],
            chordTones[1] || chordTones[0] + 3,
            chordTones[2] || chordTones[0] + 7,
            chordTones[3] || chordTones[0] + 10,
            chordTones[0] + 12,
            (chordTones[1] || chordTones[0] + 3) + 12,
            (chordTones[2] || chordTones[0] + 7) + 12,
            chordTones[0] + 24
          ];
          let noteInterval = extendedHarmonics[idx];
          let qTime = getQuantizedTime();
          
          let voice = playChordNote(midi + noteInterval, currentInst, false, true, qTime); 
          strumVoices.push(voice);
        }
      }
    }
    strumplate.addEventListener('pointerdown', (e) => { strumplate.setPointerCapture(e.pointerId); lastStrumIdx = -1; handleStrum(e); });
    strumplate.addEventListener('pointermove', (e) => { if(e.buttons > 0 || e.pressure > 0) handleStrum(e); });
    function releaseStrum(e) {
      lastStrumIdx = -1; 
      strumVoices.forEach(v => { stopChordNote(v); }); 
      strumVoices = [];
    }
    strumplate.addEventListener('pointerup', releaseStrum); strumplate.addEventListener('pointercancel', releaseStrum);

    updateUI();
  </script>
</body>
</html>
