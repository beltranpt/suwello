// ==UserScript==
// @name         Suwello
// @namespace    http://tampermonkey.net/
// @version      6.8
// @description  Enhance your PandaType Experience
// @author       beltran
// @match        https://pandatype.org/*
// @match        https://www.pandatype.org/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/586942/Suwello.user.js
// @updateURL https://update.greasyfork.org/scripts/586942/Suwello.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Base CSS Style Sheet & Expanded Layout Rules ---
    const glassThemeCSS = `
        html {
            overscroll-behavior: none !important;
        }

        body {
            overscroll-behavior: none !important;
            color: #ffffff !important;
            font-family: 'Trebuchet MS', sans-serif !important;
            font-size: 20px;
            text-align: center;
            overflow-x: hidden !important;
            background-size: cover !important;
            background-position: center center !important;
            background-attachment: fixed !important;
            background-repeat: no-repeat !important;
        }

        /* --- LIGHT MODE OVERRIDES --- */
        body.pt-light-mode {
            background: #f1f5f9 !important;
            background-image: none !important;
            color: #000000 !important;
        }

        body.pt-light-mode nav,
        body.pt-light-mode .navbar,
        body.pt-light-mode [class*="nav"],
        body.pt-light-mode .bar {
            background-color: #000000 !important;
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15) !important;
            text-shadow: none !important;
            border: 1px solid #000000 !important;
        }

        body.pt-light-mode nav *,
        body.pt-light-mode .navbar *,
        body.pt-light-mode [class*="nav"] * {
            color: #ffffff !important;
            font-weight: bold !important;
        }

        body.pt-light-mode .blurrer,
        body.pt-light-mode [class*="card"],
        body.pt-light-mode [class*="box"],
        body.pt-light-mode [class*="container"] div:not(#suwello-test-panel):not(#suwello-test-menu):not(#suwello-glow-modal),
        body.pt-light-mode main div,
        body.pt-light-mode #app div:not(#suwello-test-panel):not(#suwello-test-menu):not(#suwello-glow-modal) {
            background-color: #ffffff !important;
            color: #000000 !important;
            text-shadow: none !important;
        }

        body.pt-light-mode h1, body.pt-light-mode h2, body.pt-light-mode h3, body.pt-light-mode h4,
        body.pt-light-mode p, body.pt-light-mode span:not(.slider):not(.bg-btn), body.pt-light-mode b, body.pt-light-mode i {
            color: #000000 !important;
        }

        /* --- MATRIX MODE OVERRIDES --- */
        body.pt-matrix-mode {
            background-color: #000000 !important;
            background-image: none !important;
            color: #00ff00 !important;
            font-family: 'Courier New', Courier, monospace !important;
        }

        body.pt-matrix-mode h1, body.pt-matrix-mode h2, body.pt-matrix-mode h3, body.pt-matrix-mode h4,
        body.pt-matrix-mode p, body.pt-matrix-mode span:not(.slider):not(.bg-btn), body.pt-matrix-mode b, body.pt-matrix-mode i,
        body.pt-matrix-mode div:not(#suwello-test-panel):not(#suwello-test-menu):not(#suwello-glow-modal), body.pt-matrix-mode a:not(.bg-btn), body.pt-matrix-mode .ch {
            color: #00ff00 !important;
            text-shadow: 0 0 8px rgba(0, 255, 0, 0.8) !important;
        }

        body.pt-matrix-mode .blurrer,
        body.pt-matrix-mode [class*="card"],
        body.pt-matrix-mode [class*="box"],
        body.pt-matrix-mode nav, body.pt-matrix-mode .navbar, body.pt-matrix-mode [class*="nav"] {
            background-color: rgba(0, 0, 0, 0.85) !important;
            border: 1px solid #00ff00 !important;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.4) !important;
        }

        body.pt-matrix-mode .ch.correct {
            color: #ffffff !important;
            text-shadow: 0 0 10px #ffffff !important;
        }

        body.pt-matrix-mode .ch.incorrect {
            color: #ff0000 !important;
            text-shadow: 0 0 10px #ff0000 !important;
        }

        #pt-matrix-canvas {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: -1000 !important;
            pointer-events: none !important;
            display: none;
        }
        body.pt-matrix-mode #pt-matrix-canvas {
            display: block !important;
        }

        #suwello-test-panel * {
            text-shadow: none !important;
            box-sizing: border-box;
        }

        body::-webkit-scrollbar { display: none !important; }
        body { -ms-overflow-style: none !important; scrollbar-width: none !important; }

        a {
            color: #ffffff !important;
            text-decoration: none !important;
        }

        /* --- Liquid Glass Global Site Styles --- */
        nav, .navbar, [class*="nav"], .blurrer, .bar {
            border-radius: 30px !important;
            text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.4) !important;
            box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.5) !important;
            background-color: rgba(0, 0, 0, 0.15) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            transition: all 0.25s ease-in-out !important;
        }

        /* ========================================================
           ALWAYS SHOW NAMEPLATES OVERRIDES
           ======================================================== */
        body.pt-always-nameplates [class*="nameplate"],
        body.pt-always-nameplates [class*="nametag"],
        body.pt-always-nameplates [class*="player-tag"],
        body.pt-always-nameplates [class*="racer-name"],
        body.pt-always-nameplates [class*="name-box"],
        body.pt-always-nameplates .track [class*="name"],
        body.pt-always-nameplates .racetrack [class*="name"] {
            visibility: visible !important;
            opacity: 1 !important;
            filter: none !important;
            transition: opacity 0s !important;
        }

        body.pt-always-nameplates [class*="racer"] > div,
        body.pt-always-nameplates [class*="track"] > div > div {
            overflow: visible !important;
        }

        /* ========================================================
           EXPANDED CHEAT-MENU HUD LAYOUT & ANIMATIONS
           ======================================================== */
        #suwello-test-panel {
            position: fixed !important;
            top: 15px !important;
            left: 15px !important;
            z-index: 9999999 !important;
            font-family: Arial, sans-serif !important;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            pointer-events: none !important;
        }

        #suwello-top-anchor {
            width: 44px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-bottom: 8px;
            border-radius: 12px !important;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05)) !important;
            border: 1px solid rgba(255, 255, 255, 0.25) !important;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4) !important;
            backdrop-filter: blur(28px) saturate(110%) !important;
            -webkit-backdrop-filter: blur(28px) saturate(110%) !important;
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s;
            pointer-events: auto !important;
        }

        #suwello-top-anchor:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1)) !important;
            transform: scale(1.05);
        }

        .suwello-arrow-icon {
            width: 22px;
            height: 22px;
            fill: #ffffff;
            transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
        }

        #suwello-test-panel.menu-open .suwello-arrow-icon {
            transform: rotate(180deg);
        }

        #suwello-test-menu {
            width: 980px;
            max-height: 92vh;
            text-align: left;
            display: flex;
            flex-direction: column;
            border-radius: 18px !important;
            background: rgba(18, 14, 26, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.18) !important;
            box-shadow:
                0 30px 90px rgba(0, 0, 0, 0.8),
                0 4px 28px rgba(0, 0, 0, 0.5),
                inset 0 1px 1px rgba(255, 255, 255, 0.25) !important;
            backdrop-filter: blur(28px) saturate(120%) !important;
            -webkit-backdrop-filter: blur(28px) saturate(120%) !important;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-12px) scale(0.97);
            pointer-events: none !important;
            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                        visibility 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        #suwello-test-panel.menu-open #suwello-test-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
            pointer-events: auto !important;
        }

        #suwello-test-menu.panel-transparent {
            background: rgba(15, 12, 22, 0.25) !important;
        }

        .suwello-hud-header {
            background: rgba(0, 0, 0, 0.45);
            padding: 12px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .suwello-meta-title {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .suwello-svg-logo {
            width: 32px;
            height: 32px;
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        }

        .suwello-main-txt {
            font-size: 21px !important;
            font-weight: 800 !important;
            color: #ffffff !important;
            text-shadow: 0 0 12px rgba(255, 255, 255, 0.85) !important;
        }

        .suwello-hud-subtitle {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.6) !important;
            display: block;
            margin-top: 1px;
        }

        .suwello-hud-version {
            font-size: 12px;
            color: #ff9f2f;
            font-weight: bold;
            letter-spacing: 0.5px;
            text-align: right;
        }

        .suwello-hud-scroll-area {
            padding: 16px 24px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 14px;
            pointer-events: auto !important;
        }

        .suwello-hud-scroll-area::-webkit-scrollbar {
            width: 6px;
        }
        .suwello-hud-scroll-area::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 4px;
        }

        .suwello-group-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
            pointer-events: auto !important;
        }

        .suwello-group-title {
            font-size: 14px !important;
            font-weight: 700 !important;
            color: #ffffff !important;
            letter-spacing: 0.5px;
        }

        .suwello-action-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            pointer-events: auto !important;
        }

        .bg-btn {
            background: #2b6cb0 !important;
            border: none !important;
            color: #ffffff !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            text-align: center !important;
            box-shadow: 0 3px 10px rgba(43, 108, 176, 0.35) !important;
            transition: filter 0.15s, transform 0.1s !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 34px;
            flex: 1;
            min-width: 180px;
            pointer-events: auto !important;
            z-index: 10000;
        }

        .bg-btn:hover {
            filter: brightness(1.2);
        }

        .bg-btn:active {
            transform: scale(0.97);
        }

        .bg-btn.danger-action {
            background: #c53030 !important;
            box-shadow: 0 3px 10px rgba(197, 48, 48, 0.35) !important;
        }

        .bg-btn.glow-btn {
            background: #319795 !important;
            box-shadow: 0 3px 10px rgba(49, 151, 149, 0.35) !important;
        }

        .bg-btn.discord-btn {
            background: #4c51bf !important;
            box-shadow: 0 3px 10px rgba(76, 81, 191, 0.35) !important;
        }

        .bg-btn.script-link-btn {
            background: #2f855a !important;
            box-shadow: 0 3px 10px rgba(47, 133, 90, 0.35) !important;
        }

        .bg-btn.update-btn {
            background: #2b6cb0 !important;
            box-shadow: 0 3px 10px rgba(43, 108, 176, 0.35) !important;
        }

        .switch-container {
            background: rgba(255, 255, 255, 0.04) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            border-radius: 6px;
            padding: 6px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 36px;
            flex: 1;
            min-width: 220px;
            box-sizing: border-box;
            pointer-events: auto !important;
        }

        .switch-label-block { display: flex; flex-direction: column; pointer-events: none; }
        .switch-label-text { font-size: 12px; font-weight: 600; color: #ffffff !important; }
        .credits-tag { font-size: 9px; color: rgba(255, 255, 255, 0.5) !important; margin-top: 1px; }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 34px;
            height: 18px;
            flex-shrink: 0;
            pointer-events: auto !important;
            cursor: pointer !important;
        }
        .toggle-switch input { opacity: 0; width: 0; height: 0; pointer-events: auto !important; }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(255, 255, 255, 0.2);
            transition: .2s cubic-bezier(0.25, 1, 0.5, 1);
            border-radius: 20px;
            pointer-events: auto !important;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 12px;
            width: 12px;
            left: 3px;
            bottom: 3px;
            background-color: #ffffff;
            transition: .2s cubic-bezier(0.25, 1, 0.5, 1);
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #319795;
            box-shadow: 0 0 8px rgba(49, 151, 149, 0.5);
        }

        input:checked + .slider:before {
            transform: translateX(16px);
        }

        /* ========================================================
           VEHICLE EFFECTS & GLOW MODAL STYLES
           ======================================================== */
        @keyframes rainbowChroma {
            0% { filter: drop-shadow(0 0 10px #ff0000) hue-rotate(0deg); }
            50% { filter: drop-shadow(0 0 18px #00ff00) hue-rotate(180deg); }
            100% { filter: drop-shadow(0 0 10px #ff0000) hue-rotate(360deg); }
        }

        @keyframes neonPulse {
            0% { filter: drop-shadow(0 0 6px rgba(0, 255, 204, 0.6)); }
            50% { filter: drop-shadow(0 0 20px rgba(0, 255, 204, 1)); }
            100% { filter: drop-shadow(0 0 6px rgba(0, 255, 204, 0.6)); }
        }

        .pt-fx-rainbow { animation: rainbowChroma 3s infinite linear !important; }
        .pt-fx-pulse { animation: neonPulse 1.8s infinite ease-in-out !important; }

        #suwello-glow-modal-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.65) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            z-index: 2147483647 !important;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            pointer-events: none !important;
            transition: opacity 0.25s ease, visibility 0.25s ease;
        }

        #suwello-glow-modal-overlay.active {
            opacity: 1;
            visibility: visible;
            pointer-events: auto !important;
        }

        #suwello-glow-modal {
            width: 380px;
            border-radius: 18px !important;
            background: rgba(18, 14, 26, 0.96);
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 30px 90px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.3) !important;
            overflow: hidden;
            text-align: left;
            font-family: Arial, sans-serif !important;
            pointer-events: auto !important;
        }

        .pt-glow-hud-header {
            background: rgba(0, 0, 0, 0.45);
            padding: 14px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .pt-glow-meta-title { display: flex; align-items: center; gap: 12px; }
        .pt-glow-main-txt { font-size: 16px !important; font-weight: 800 !important; color: #ffffff !important; text-shadow: 0 0 12px rgba(255, 255, 255, 0.85) !important; }

        .pt-glow-close-btn {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-size: 18px;
            cursor: pointer;
            transition: color 0.15s;
        }
        .pt-glow-close-btn:hover { color: #ffffff; }

        .pt-glow-body { padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; }

        .pt-glow-select {
            background: rgba(255, 255, 255, 0.08) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: #ffffff !important;
            padding: 10px 12px !important;
            border-radius: 8px !important;
            font-size: 13px !important;
            outline: none !important;
            cursor: pointer !important;
            width: 100%;
        }

        .pt-glow-select option {
            background: #120e1a !important;
            color: #ffffff !important;
        }

        .pt-glow-slider-block {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .pt-glow-slider-label {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: space-between;
        }

        .pt-glow-slider-input {
            width: 100%;
            accent-color: #319795;
            cursor: pointer;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(glassThemeCSS);
    } else {
        const style = document.createElement('style');
        style.textContent = glassThemeCSS;
        document.head.appendChild(style);
    }

    // --- 2. Auto-Reloader Script Engine ---
    const DELAY_MS = 0;
    let scheduled = false;
    let autoReloadEnabled = localStorage.getItem('pt_auto_reload') !== 'false';

    function pressEnter() {
        if (!autoReloadEnabled) return;
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(event);
        scheduled = false;
    }

    function isRaceEndVisible() {
        const selectors = [
            '.race-results', '.results-container', '.race-end',
            '[class*="result"]', '[class*="leaderboard"]',
            '[class*="finished"]', '[class*="podium"]',
            '[class*="complete"]', '[class*="summary"]',
        ];
        return selectors.some(sel => {
            const el = document.querySelector(sel);
            return el && el.offsetParent !== null;
        });
    }

    // --- 3. FORCE-APPLY CSS OVERRIDES FOR TRACK & PANEL BG ---
    function applyCustomTrack() {
        const customTrack = localStorage.getItem('pt_custom_track');
        if (!customTrack) return;

        let trackStyle = document.getElementById('pt-custom-track-style');
        if (!trackStyle) {
            trackStyle = document.createElement('style');
            trackStyle.id = 'pt-custom-track-style';
            document.head.appendChild(trackStyle);
        }

        trackStyle.textContent = `
            .track, .racetrack, .race-track,
            [class*="track-container"], [class*="track_"], [class*="race-container"] > div {
                background-image: url("${customTrack}") !important;
                background-size: cover !important;
                background-repeat: no-repeat !important;
                background-position: center !important;
            }
        `;
    }

    function applyCustomPanelBg() {
        const customPanelBg = localStorage.getItem('pt_custom_panel_bg');
        let panelStyle = document.getElementById('pt-custom-panel-style');

        if (!panelStyle) {
            panelStyle = document.createElement('style');
            panelStyle.id = 'pt-custom-panel-style';
            document.head.appendChild(panelStyle);
        }

        if (customPanelBg) {
            panelStyle.textContent = `
                #suwello-test-menu {
                    background: linear-gradient(135deg, rgba(18, 14, 26, 0.65), rgba(10, 8, 16, 0.75)), url("${customPanelBg}") !important;
                    background-size: cover !important;
                    background-position: center !important;
                    background-repeat: no-repeat !important;
                }
            `;
        } else {
            panelStyle.textContent = '';
        }
    }

    // --- 4. Vehicle Effects & Glow State & Applicator ---
    let effectMode = localStorage.getItem('pt_fx_mode') || 'none';
    let glowRadius = localStorage.getItem('pt_fx_radius') || '12';
    let hueShift = localStorage.getItem('pt_fx_hue') || '0';

    function applyVehicleEffects() {
        let styleTag = document.getElementById('pt-vehicle-effects-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'pt-vehicle-effects-style';
            document.head.appendChild(styleTag);
        }

        let filterCSS = '';

        if (effectMode === 'neon-cyan') {
            filterCSS = `drop-shadow(0 0 ${glowRadius}px #00f3ff) hue-rotate(${hueShift}deg)`;
        } else if (effectMode === 'neon-pink') {
            filterCSS = `drop-shadow(0 0 ${glowRadius}px #ff007f) hue-rotate(${hueShift}deg)`;
        } else if (effectMode === 'gold-aura') {
            filterCSS = `drop-shadow(0 0 ${glowRadius}px #ffd700) hue-rotate(${hueShift}deg)`;
        } else if (effectMode === 'pixelate') {
            filterCSS = `contrast(180%) saturate(160%) hue-rotate(${hueShift}deg)`;
        } else if (effectMode === 'custom-hue') {
            filterCSS = `drop-shadow(0 0 ${glowRadius}px #ffffff) hue-rotate(${hueShift}deg)`;
        }

        styleTag.textContent = `
            [class*="racer"] img,
            [class*="track"] img,
            [class*="garage"] img,
            img[src*="car"],
            img[src*="vehicle"],
            svg image {
                filter: ${filterCSS} !important;
            }
        `;

        const targetCars = document.querySelectorAll('[class*="racer"] img, [class*="track"] img, [class*="garage"] img, svg image');
        targetCars.forEach(car => {
            if (effectMode === 'rainbow') {
                car.classList.add('pt-fx-rainbow');
                car.classList.remove('pt-fx-pulse');
            } else if (effectMode === 'pulse') {
                car.classList.add('pt-fx-pulse');
                car.classList.remove('pt-fx-rainbow');
            } else {
                car.classList.remove('pt-fx-rainbow', 'pt-fx-pulse');
            }
        });
    }

    // --- 5. Always Show Nameplates Engine ---
    let alwaysNameplatesEnabled = localStorage.getItem('pt_always_nameplates') === 'true';

    function restoreVisibility(el) {
        if (!alwaysNameplatesEnabled) return;
        if (el.style.display === 'none') {
            el.style.removeProperty('display');
            if (window.getComputedStyle(el).display === 'none') {
                el.style.setProperty('display', 'flex', 'important');
            }
        }
        if (el.style.opacity === '0') {
            el.style.setProperty('opacity', '1', 'important');
        }
        if (el.style.visibility === 'hidden') {
            el.style.setProperty('visibility', 'visible', 'important');
        }
    }

    function keepNameplatesVisible() {
        if (!alwaysNameplatesEnabled) return;
        const nameplates = document.querySelectorAll(
            '[class*="nameplate"], [class*="nametag"], [class*="player-tag"], [class*="name-box"]'
        );
        nameplates.forEach(restoreVisibility);
    }

    function applyAlwaysNameplatesMode() {
        if (alwaysNameplatesEnabled) {
            document.body.classList.add('pt-always-nameplates');
            keepNameplatesVisible();
        } else {
            document.body.classList.remove('pt-always-nameplates');
        }
    }

    const observer = new MutationObserver(() => {
        if (autoReloadEnabled && !scheduled && isRaceEndVisible()) {
            scheduled = true;
            console.log('[PandaType] Race ended — pressing Enter in', DELAY_MS / 1000, 's');
            setTimeout(pressEnter, DELAY_MS);
        }
        applyCustomTrack();
        keepNameplatesVisible();
        applyVehicleEffects();
    });

    // --- 6. Background State, Matrix Logic, Themes & Panel UI Injection ---
    let lightModeEnabled = localStorage.getItem('pt_light_mode') === 'true';
    let matrixModeEnabled = localStorage.getItem('pt_matrix_mode') === 'true';
    let matrixClicksEnabled = localStorage.getItem('pt_matrix_clicks') === 'true';
    let afterburnModeEnabled = localStorage.getItem('pt_afterburn_mode') === 'true';
    let blueArcadeModeEnabled = localStorage.getItem('pt_blue_arcade_mode') === 'true';
    let panelTransparentEnabled = localStorage.getItem('pt_panel_transparent') === 'true';

    let matrixCanvas, matrixCtx, matrixInterval;
    let audioCtx = null;

    const afterburnCSS = `
        body.pt-afterburn-mode {
            --bg: #16051f !important;
            --panel: rgba(35, 9, 50, .91) !important;
            --panel-2: rgba(52, 13, 67, .94) !important;
            --line: rgba(255, 112, 183, .42) !important;
            --track: #260b3d !important;
            --text: #fff7f3 !important;
            --muted: #d3a8ca !important;
            --amber: #ffb14a !important;
            --amber-dark: #e65743 !important;
            --red: #ff4f7e !important;
            --blue: #43efd0 !important;
            --green: #56efae !important;
            --danger: #ff4f72 !important;
            --afterburn-coral: #ff5f6d;
            --afterburn-gold: #ffc857;
            --afterburn-teal: #43efd0;
            --afterburn-purple: #9b5cff;
        }

        html:has(body.pt-afterburn-mode) { min-height: 100% !important; background: #120419 !important; }
        body.pt-afterburn-mode {
            position: relative !important; isolation: isolate; overflow-x: hidden; background-color: #16051f !important;
            background-image: linear-gradient(180deg, #53217b 0%, #b33979 25%, #ff735d 48%, #42135b 72%, #16051f 100%) !important;
            background-size: cover !important; background-attachment: fixed !important; color: var(--text) !important;
        }
    `;

    const blueArcadeCSS = `
        body.pt-blue-arcade-mode {
            --bg: #020819 !important;
            --panel: rgba(5, 16, 44, .91) !important;
            --panel-2: rgba(8, 26, 66, .94) !important;
            --line: rgba(66, 172, 255, .42) !important;
            --track: #07142f !important;
            --text: #f4f9ff !important;
            --muted: #9db7d8 !important;
            --amber: #35bfff !important;
        }

        html:has(body.pt-blue-arcade-mode) { min-height: 100% !important; background: #020716 !important; }
        body.pt-blue-arcade-mode {
            position: relative !important; isolation: isolate; overflow-x: hidden; background-color: #020819 !important;
            background-image: radial-gradient(ellipse at 50% -8%, #154993 0%, #071b45 36%, #020819 76%) !important;
            background-size: cover !important; background-attachment: fixed !important; color: var(--text) !important;
        }
    `;

    const abStyle = document.createElement('style');
    abStyle.id = 'pt-afterburn-stylesheet';
    abStyle.textContent = afterburnCSS;
    document.head.appendChild(abStyle);

    const baStyle = document.createElement('style');
    baStyle.id = 'pt-bluearcade-stylesheet';
    baStyle.textContent = blueArcadeCSS;
    document.head.appendChild(baStyle);

    function playClackSound() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(380 + Math.random() * 140, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.035);

            gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.035);
        } catch(e) { console.log('Audio Context Fault Check:', e); }
    }

    function startMatrixRain() {
        if (!matrixCanvas) {
            matrixCanvas = document.createElement('canvas');
            matrixCanvas.id = 'pt-matrix-canvas';
            document.body.appendChild(matrixCanvas);
            matrixCtx = matrixCanvas.getContext('2d');
        }
        const resize = () => {
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const chars = "010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const fontArr = chars.split("");
        const fontSize = 14;
        const columns = matrixCanvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function drawRain() {
            matrixCtx.fillStyle = "rgba(0, 0, 0, 0.06)";
            matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            matrixCtx.fillStyle = "#00ff00";
            matrixCtx.font = fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {
                const text = fontArr[Math.floor(Math.random() * fontArr.length)];
                matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        clearInterval(matrixInterval);
        matrixInterval = setInterval(drawRain, 33);
    }

    function stopMatrixRain() {
        clearInterval(matrixInterval);
        if (matrixCanvas && matrixCanvas.parentNode) {
            matrixCanvas.parentNode.removeChild(matrixCanvas);
            matrixCanvas = null;
        }
    }

    function applyModes() {
        if (blueArcadeModeEnabled) {
            document.body.classList.add('pt-blue-arcade-mode');
            document.body.classList.remove('pt-afterburn-mode');
            document.body.classList.remove('pt-matrix-mode');
            document.body.classList.remove('pt-light-mode');
            stopMatrixRain();
        } else if (afterburnModeEnabled) {
            document.body.classList.add('pt-afterburn-mode');
            document.body.classList.remove('pt-blue-arcade-mode');
            document.body.classList.remove('pt-matrix-mode');
            document.body.classList.remove('pt-light-mode');
            stopMatrixRain();
        } else if (matrixModeEnabled) {
            document.body.classList.add('pt-matrix-mode');
            document.body.classList.remove('pt-light-mode');
            document.body.classList.remove('pt-afterburn-mode');
            document.body.classList.remove('pt-blue-arcade-mode');
            startMatrixRain();
        } else {
            document.body.classList.remove('pt-matrix-mode');
            document.body.classList.remove('pt-afterburn-mode');
            document.body.classList.remove('pt-blue-arcade-mode');
            stopMatrixRain();
            if (lightModeEnabled) {
                document.body.classList.add('pt-light-mode');
            } else {
                document.body.classList.remove('pt-light-mode');
                const savedBg = localStorage.getItem('pt_custom_bg');
                if (savedBg) document.body.style.backgroundImage = `url("${savedBg}")`;
            }
        }
    }

    function applyPanelTransparentMode() {
        const menuEl = document.getElementById('suwello-test-menu');
        if (menuEl) {
            if (panelTransparentEnabled) {
                menuEl.classList.add('panel-transparent');
            } else {
                menuEl.classList.remove('panel-transparent');
            }
        }
    }

    function createSuwelloSVG(extraClass = '') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        if (extraClass) svg.setAttribute('class', extraClass);
        svg.innerHTML = `
            <path fill="currentColor" d="M 75 10 C 50 10, 25 22, 25 36 C 25 50, 75 50, 75 64 C 75 78, 50 90, 25 90 C 20 90, 15 88, 20 85 C 35 85, 60 76, 60 64 C 60 52, 10 50, 10 36 C 10 20, 40 10, 75 10 Z" />
        `;
        return svg;
    }

    // --- 7. Modal Injection Helper for Vehicle Effects ---
    function initGlowModal() {
        if (document.getElementById('suwello-glow-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'suwello-glow-modal-overlay';

        const modal = document.createElement('div');
        modal.id = 'suwello-glow-modal';
        modal.onclick = (e) => e.stopPropagation();

        const header = document.createElement('div');
        header.className = 'pt-glow-hud-header';

        const metaTitle = document.createElement('div');
        metaTitle.className = 'pt-glow-meta-title';
        metaTitle.appendChild(createSuwelloSVG('suwello-svg-logo'));

        const titleText = document.createElement('span');
        titleText.className = 'pt-glow-main-txt';
        titleText.textContent = 'Vehicle Effects & Glow';
        metaTitle.appendChild(titleText);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'pt-glow-close-btn';
        closeBtn.textContent = '✕';
        closeBtn.onclick = () => overlay.classList.remove('active');

        header.appendChild(metaTitle);
        header.appendChild(closeBtn);

        const bodyArea = document.createElement('div');
        bodyArea.className = 'pt-glow-body';

        const selectMode = document.createElement('select');
        selectMode.className = 'pt-glow-select';
        selectMode.innerHTML = `
            <option value="none" ${effectMode === 'none' ? 'selected' : ''}>Disabled (Default)</option>
            <option value="rainbow" ${effectMode === 'rainbow' ? 'selected' : ''}>🌈 Rainbow Chroma Wave</option>
            <option value="pulse" ${effectMode === 'pulse' ? 'selected' : ''}>⚡ Cyan Pulse Glow</option>
            <option value="neon-cyan" ${effectMode === 'neon-cyan' ? 'selected' : ''}>✨ Cyber Cyan Glow</option>
            <option value="neon-pink" ${effectMode === 'neon-pink' ? 'selected' : ''}>💖 Neon Pink Glow</option>
            <option value="gold-aura" ${effectMode === 'gold-aura' ? 'selected' : ''}>👑 Golden Aura</option>
            <option value="pixelate" ${effectMode === 'pixelate' ? 'selected' : ''}>🕹️ Retro High-Contrast</option>
            <option value="custom-hue" ${effectMode === 'custom-hue' ? 'selected' : ''}>🎨 Custom Hue Shift</option>
        `;

        selectMode.onchange = (e) => {
            effectMode = e.target.value;
            localStorage.setItem('pt_fx_mode', effectMode);
            applyVehicleEffects();
        };

        const radiusBlock = document.createElement('div');
        radiusBlock.className = 'pt-glow-slider-block';
        radiusBlock.innerHTML = `
            <div class="pt-glow-slider-label">
                <span>Glow Intensity</span>
                <span id="pt-radius-val">${glowRadius}px</span>
            </div>
            <input type="range" class="pt-glow-slider-input" min="2" max="30" value="${glowRadius}" id="pt-radius-slider">
        `;

        const hueBlock = document.createElement('div');
        hueBlock.className = 'pt-glow-slider-block';
        hueBlock.innerHTML = `
            <div class="pt-glow-slider-label">
                <span>Color Hue Shift</span>
                <span id="pt-hue-val">${hueShift}°</span>
            </div>
            <input type="range" class="pt-glow-slider-input" min="0" max="360" value="${hueShift}" id="pt-hue-slider">
        `;

        bodyArea.appendChild(selectMode);
        bodyArea.appendChild(radiusBlock);
        bodyArea.appendChild(hueBlock);

        modal.appendChild(header);
        modal.appendChild(bodyArea);
        overlay.appendChild(modal);

        overlay.onclick = () => overlay.classList.remove('active');

        document.body.appendChild(overlay);

        document.getElementById('pt-radius-slider').oninput = (e) => {
            glowRadius = e.target.value;
            document.getElementById('pt-radius-val').textContent = glowRadius + 'px';
            localStorage.setItem('pt_fx_radius', glowRadius);
            applyVehicleEffects();
        };

        document.getElementById('pt-hue-slider').oninput = (e) => {
            hueShift = e.target.value;
            document.getElementById('pt-hue-val').textContent = hueShift + '°';
            localStorage.setItem('pt_fx_hue', hueShift);
            applyVehicleEffects();
        };
    }

    function initThemeEngine() {
        applyModes();

        if (!lightModeEnabled && !matrixModeEnabled && !afterburnModeEnabled && !blueArcadeModeEnabled) {
            const savedBg = localStorage.getItem('pt_custom_bg');
            if (savedBg) document.body.style.backgroundImage = `url("${savedBg}")`;
        }

        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('keydown', (e) => {
            if (matrixClicksEnabled && e.key !== "Control" && e.key !== "Shift" && e.key !== "Alt") {
                playClackSound();
            }
        }, true);

        if (document.getElementById('suwello-test-panel')) return;

        initGlowModal();

        const panel = document.createElement('div');
        panel.id = 'suwello-test-panel';

        const topAnchor = document.createElement('div');
        topAnchor.id = 'suwello-top-anchor';
        const arrowIcon = createSuwelloSVG('suwello-arrow-icon');
        topAnchor.appendChild(arrowIcon);

        topAnchor.onclick = () => {
            panel.classList.toggle('menu-open');
        };

        const menu = document.createElement('div');
        menu.id = 'suwello-test-menu';

        const hudHeader = document.createElement('div');
        hudHeader.className = 'suwello-hud-header';

        const metaTitle = document.createElement('div');
        metaTitle.className = 'suwello-meta-title';

        const logoMark = createSuwelloSVG('suwello-svg-logo');

        const textWrapper = document.createElement('div');
        const mainTxt = document.createElement('span');
        mainTxt.className = 'suwello-main-txt';
        mainTxt.textContent = 'Suwello';
        const subtitleTxt = document.createElement('span');
        subtitleTxt.className = 'suwello-hud-subtitle';
        subtitleTxt.textContent = '@zy_122 • Created by Beltran';

        textWrapper.appendChild(mainTxt);
        textWrapper.appendChild(subtitleTxt);
        metaTitle.appendChild(logoMark);
        metaTitle.appendChild(textWrapper);

        const hudVersion = document.createElement('div');
        hudVersion.className = 'suwello-hud-version';
        hudVersion.textContent = 'VERSION 6.8';

        hudHeader.appendChild(metaTitle);
        hudHeader.appendChild(hudVersion);

        const scrollArea = document.createElement('div');
        scrollArea.className = 'suwello-hud-scroll-area';

        const buildToggleBlock = (titleText, tagText, isChecked, onChangeFn, customId) => {
            const container = document.createElement('div');
            container.className = 'switch-container';
            const labelBlock = document.createElement('div');
            labelBlock.className = 'switch-label-block';
            const sText = document.createElement('span');
            sText.className = 'switch-label-text';
            sText.textContent = titleText;
            const cTag = document.createElement('span');
            cTag.className = 'credits-tag';
            cTag.textContent = tagText;
            labelBlock.appendChild(sText);
            labelBlock.appendChild(cTag);

            const toggleLabel = document.createElement('label');
            toggleLabel.className = 'toggle-switch';
            const input = document.createElement('input');
            if(customId) input.id = customId;
            input.type = 'checkbox';
            input.checked = isChecked;
            input.onchange = onChangeFn;
            const slider = document.createElement('span');
            slider.className = 'slider';

            toggleLabel.appendChild(input);
            toggleLabel.appendChild(slider);
            container.appendChild(labelBlock);
            container.appendChild(toggleLabel);
            return container;
        };

        const processFile = (file, key) => {
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Data = event.target.result;
                try {
                    localStorage.setItem(key, base64Data);
                    if (key === 'pt_custom_bg' && !lightModeEnabled && !matrixModeEnabled && !afterburnModeEnabled && !blueArcadeModeEnabled) {
                        document.body.style.backgroundImage = `url("${base64Data}")`;
                    } else if (key === 'pt_custom_track') {
                        applyCustomTrack();
                    } else if (key === 'pt_custom_panel_bg') {
                        applyCustomPanelBg();
                    }
                } catch (error) {
                    alert("This image payload is too large for local standard browser storage allocation.");
                }
            };
            reader.readAsDataURL(file);
        };

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.png, .jpg, .jpeg';
        fileInput.style.display = 'none';

        const gifInput = document.createElement('input');
        gifInput.type = 'file';
        gifInput.accept = '.gif';
        gifInput.style.display = 'none';

        const trackFileInput = document.createElement('input');
        trackFileInput.type = 'file';
        trackFileInput.accept = '.png, .jpg, .jpeg';
        trackFileInput.style.display = 'none';

        const trackPageGifInput = document.createElement('input');
        trackPageGifInput.type = 'file';
        trackPageGifInput.accept = '.gif';
        trackPageGifInput.style.display = 'none';

        const panelFileInput = document.createElement('input');
        panelFileInput.type = 'file';
        panelFileInput.accept = '.png, .jpg, .jpeg';
        panelFileInput.style.display = 'none';

        const panelGifInput = document.createElement('input');
        panelGifInput.type = 'file';
        panelGifInput.accept = '.gif';
        panelGifInput.style.display = 'none';

        document.body.appendChild(fileInput);
        document.body.appendChild(gifInput);
        document.body.appendChild(trackFileInput);
        document.body.appendChild(trackPageGifInput);
        document.body.appendChild(panelFileInput);
        document.body.appendChild(panelGifInput);

        fileInput.onchange = (e) => processFile(e.target.files[0], 'pt_custom_bg');
        gifInput.onchange = (e) => processFile(e.target.files[0], 'pt_custom_bg');
        trackFileInput.onchange = (e) => processFile(e.target.files[0], 'pt_custom_track');
        trackPageGifInput.onchange = (e) => processFile(e.target.files[0], 'pt_custom_track');
        panelFileInput.onchange = (e) => processFile(e.target.files[0], 'pt_custom_panel_bg');
        panelGifInput.onchange = (e) => processFile(e.target.files[0], 'pt_custom_panel_bg');

        // BACKGROUND FEATURES
        const bgSection = document.createElement('div');
        bgSection.className = 'suwello-group-section';
        const bgTitle = document.createElement('div');
        bgTitle.className = 'suwello-group-title';
        bgTitle.textContent = 'Background Features';
        bgSection.appendChild(bgTitle);

        const bgGrid = document.createElement('div');
        bgGrid.className = 'suwello-action-grid';

        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'bg-btn';
        uploadBtn.textContent = '📁 Upload PNG/JPG (BG)';
        uploadBtn.onclick = (e) => { e.stopPropagation(); fileInput.click(); };

        const uploadGifBtn = document.createElement('button');
        uploadGifBtn.className = 'bg-btn';
        uploadGifBtn.style.border = '1px dashed rgba(255, 159, 47, 0.4)';
        uploadGifBtn.textContent = '🖼️ Upload GIF (BG)';
        uploadGifBtn.onclick = (e) => { e.stopPropagation(); gifInput.click(); };

        const resetBtn = document.createElement('button');
        resetBtn.className = 'bg-btn danger-action';
        resetBtn.textContent = '❌ Remove Custom Background';
        resetBtn.onclick = (e) => {
            e.stopPropagation();
            localStorage.removeItem('pt_custom_bg');
            if (!lightModeEnabled && !matrixModeEnabled && !afterburnModeEnabled && !blueArcadeModeEnabled) document.body.style.backgroundImage = 'none';
        };

        bgGrid.appendChild(uploadBtn);
        bgGrid.appendChild(uploadGifBtn);
        bgGrid.appendChild(resetBtn);
        bgSection.appendChild(bgGrid);

        // TRACK CUSTOMIZER
        const trackSection = document.createElement('div');
        trackSection.className = 'suwello-group-section';
        const trackTitle = document.createElement('div');
        trackTitle.className = 'suwello-group-title';
        trackTitle.textContent = 'Track Customizer';
        trackSection.appendChild(trackTitle);

        const trackGrid = document.createElement('div');
        trackGrid.className = 'suwello-action-grid';

        const trackUploadBtn = document.createElement('button');
        trackUploadBtn.className = 'bg-btn';
        trackUploadBtn.textContent = '📁 Upload PNG/JPG (Track)';
        trackUploadBtn.onclick = (e) => { e.stopPropagation(); trackFileInput.click(); };

        const trackUploadGifBtn = document.createElement('button');
        trackUploadGifBtn.className = 'bg-btn';
        trackUploadGifBtn.style.border = '1px dashed rgba(255, 159, 47, 0.4)';
        trackUploadGifBtn.textContent = '🖼️ Upload GIF (Track)';
        trackUploadGifBtn.onclick = (e) => { e.stopPropagation(); trackPageGifInput.click(); };

        const trackRemoveBtn = document.createElement('button');
        trackRemoveBtn.className = 'bg-btn danger-action';
        trackRemoveBtn.textContent = '❌ Remove Custom Track';
        trackRemoveBtn.onclick = (e) => {
            e.stopPropagation();
            localStorage.removeItem('pt_custom_track');
            window.location.reload();
        };

        trackGrid.appendChild(trackUploadBtn);
        trackGrid.appendChild(trackUploadGifBtn);
        trackGrid.appendChild(trackRemoveBtn);
        trackSection.appendChild(trackGrid);

        // PANEL SETTINGS
        const panelSettingsSection = document.createElement('div');
        panelSettingsSection.className = 'suwello-group-section';
        const panelSettingsTitle = document.createElement('div');
        panelSettingsTitle.className = 'suwello-group-title';
        panelSettingsTitle.textContent = 'Panel Settings';
        panelSettingsSection.appendChild(panelSettingsTitle);

        const panelSettingsGrid = document.createElement('div');
        panelSettingsGrid.className = 'suwello-action-grid';

        const panelUploadBtn = document.createElement('button');
        panelUploadBtn.className = 'bg-btn';
        panelUploadBtn.textContent = '📁 Upload PNG/JPG (Panel)';
        panelUploadBtn.onclick = (e) => { e.stopPropagation(); panelFileInput.click(); };

        const panelUploadGifBtn = document.createElement('button');
        panelUploadGifBtn.className = 'bg-btn';
        panelUploadGifBtn.style.border = '1px dashed rgba(255, 159, 47, 0.4)';
        panelUploadGifBtn.textContent = '🖼️ Upload GIF (Panel)';
        panelUploadGifBtn.onclick = (e) => { e.stopPropagation(); panelGifInput.click(); };

        const panelRemoveBtn = document.createElement('button');
        panelRemoveBtn.className = 'bg-btn danger-action';
        panelRemoveBtn.textContent = '❌ Remove Custom Background';
        panelRemoveBtn.onclick = (e) => {
            e.stopPropagation();
            localStorage.removeItem('pt_custom_panel_bg');
            applyCustomPanelBg();
        };

        panelSettingsGrid.appendChild(panelUploadBtn);
        panelSettingsGrid.appendChild(panelUploadGifBtn);
        panelSettingsGrid.appendChild(panelRemoveBtn);

        const transparentToggle = buildToggleBlock("Transparent", "Panel Transparent Mode", panelTransparentEnabled, (e) => {
            panelTransparentEnabled = e.target.checked;
            localStorage.setItem('pt_panel_transparent', panelTransparentEnabled);
            applyPanelTransparentMode();
        }, 'pt-transparent-input');

        panelSettingsSection.appendChild(panelSettingsGrid);
        panelSettingsSection.appendChild(transparentToggle);

        // THEME OVERRIDES & UTILITIES
        const utilitySection = document.createElement('div');
        utilitySection.className = 'suwello-group-section';
        const utilTitle = document.createElement('div');
        utilTitle.className = 'suwello-group-title';
        utilTitle.textContent = 'Theme Overrides & Utilities';
        utilitySection.appendChild(utilTitle);

        const utilGrid = document.createElement('div');
        utilGrid.className = 'suwello-action-grid';

        const baToggle = buildToggleBlock("Blue Arcade", "Credits: Mighty", blueArcadeModeEnabled, (e) => {
            blueArcadeModeEnabled = e.target.checked;
            localStorage.setItem('pt_blue_arcade_mode', blueArcadeModeEnabled);
            if (blueArcadeModeEnabled) {
                afterburnModeEnabled = false; matrixModeEnabled = false; lightModeEnabled = false;
                localStorage.setItem('pt_afterburn_mode', false); localStorage.setItem('pt_matrix_mode', false); localStorage.setItem('pt_light_mode', false);
                const abInput = menu.querySelector('#pt-ab-input'); const mxInput = menu.querySelector('#pt-mx-input'); const lmInput = menu.querySelector('#pt-lm-input');
                if (abInput) abInput.checked = false; if (mxInput) mxInput.checked = false; if (lmInput) lmInput.checked = false;
            }
            applyModes();
        }, 'pt-ba-input');

        const abToggle = buildToggleBlock("Afterburn '99", "Credits: Mighty", afterburnModeEnabled, (e) => {
            afterburnModeEnabled = e.target.checked;
            localStorage.setItem('pt_afterburn_mode', afterburnModeEnabled);
            if (afterburnModeEnabled) {
                blueArcadeModeEnabled = false; matrixModeEnabled = false; lightModeEnabled = false;
                localStorage.setItem('pt_blue_arcade_mode', false); localStorage.setItem('pt_matrix_mode', false); localStorage.setItem('pt_light_mode', false);
                const baInput = menu.querySelector('#pt-ba-input'); const mxInput = menu.querySelector('#pt-mx-input'); const lmInput = menu.querySelector('#pt-lm-input');
                if (baInput) baInput.checked = false; if (mxInput) mxInput.checked = false; if (lmInput) lmInput.checked = false;
            }
            applyModes();
        }, 'pt-ab-input');

        const reloaderToggle = buildToggleBlock("Ultra Auto-Reloader", "Suwello Ultra", autoReloadEnabled, (e) => {
            autoReloadEnabled = e.target.checked;
            localStorage.setItem('pt_auto_reload', autoReloadEnabled);
        });

        const mxToggle = buildToggleBlock("Matrix Theme", "Matrix Theme", matrixModeEnabled, (e) => {
            matrixModeEnabled = e.target.checked;
            localStorage.setItem('pt_matrix_mode', matrixModeEnabled);
            if (matrixModeEnabled) {
                lightModeEnabled = false; afterburnModeEnabled = false; blueArcadeModeEnabled = false;
                localStorage.setItem('pt_light_mode', false); localStorage.setItem('pt_afterburn_mode', false); localStorage.setItem('pt_blue_arcade_mode', false);
                const lmInput = menu.querySelector('#pt-lm-input'); const abInput = menu.querySelector('#pt-ab-input'); const baInput = menu.querySelector('#pt-ba-input');
                if (lmInput) lmInput.checked = false; if (abInput) abInput.checked = false; if (baInput) baInput.checked = false;
            }
            applyModes();
        }, 'pt-mx-input');

        const clkToggle = buildToggleBlock("Matrix Clicks", "Use Clicks Anywhere", matrixClicksEnabled, (e) => {
            matrixClicksEnabled = e.target.checked;
            localStorage.setItem('pt_matrix_clicks', matrixClicksEnabled);
        });

        const lmToggle = buildToggleBlock("Light Mode", "For Educational Purposes", lightModeEnabled, (e) => {
            lightModeEnabled = e.target.checked;
            localStorage.setItem('pt_light_mode', lightModeEnabled);
            if (lightModeEnabled) {
                matrixModeEnabled = false; afterburnModeEnabled = false; blueArcadeModeEnabled = false;
                localStorage.setItem('pt_matrix_mode', false); localStorage.setItem('pt_afterburn_mode', false); localStorage.setItem('pt_blue_arcade_mode', false);
                const mxInput = menu.querySelector('#pt-mx-input'); const abInput = menu.querySelector('#pt-ab-input'); const baInput = menu.querySelector('#pt-ba-input');
                if (mxInput) mxInput.checked = false; if (abInput) abInput.checked = false; if (baInput) baInput.checked = false;
            }
            applyModes();
        }, 'pt-lm-input');

        const alwaysNameplatesToggle = buildToggleBlock("Always Show Nameplates", "Always Show Nameplates During Races", alwaysNameplatesEnabled, (e) => {
            alwaysNameplatesEnabled = e.target.checked;
            localStorage.setItem('pt_always_nameplates', alwaysNameplatesEnabled);
            applyAlwaysNameplatesMode();
        }, 'pt-always-nameplates-input');

        const glowBtn = document.createElement('button');
        glowBtn.className = 'bg-btn glow-btn';
        glowBtn.textContent = '✨ Vehicle Effects & Glow';
        glowBtn.onclick = (e) => {
            e.stopPropagation();
            document.getElementById('suwello-glow-modal-overlay').classList.add('active');
        };

        const discordBtn = document.createElement('button');
        discordBtn.className = 'bg-btn discord-btn';
        discordBtn.textContent = '💬 Official Suwello Discord';
        discordBtn.onclick = (e) => {
            e.stopPropagation();
            window.open('https://discord.gg/WhpXrqgTQg', '_blank');
        };

        const singleLineBtn = document.createElement('button');
        singleLineBtn.className = 'bg-btn script-link-btn';
        singleLineBtn.textContent = '🐼 PandaType Single Line Mode';
        singleLineBtn.onclick = (e) => {
            e.stopPropagation();
            window.open('https://greasyfork.org/en/scripts/587020-pandatype-single-line-mode', '_blank');
        };

        const updateBtn = document.createElement('button');
        updateBtn.className = 'bg-btn update-btn';
        updateBtn.textContent = '🔄 Check for Updates';
        updateBtn.onclick = (e) => {
            e.stopPropagation();
            window.open('https://greasyfork.org/en/scripts/586942-suwello', '_blank');
        };

        utilGrid.appendChild(baToggle);
        utilGrid.appendChild(abToggle);
        utilGrid.appendChild(reloaderToggle);
        utilGrid.appendChild(mxToggle);
        utilGrid.appendChild(clkToggle);
        utilGrid.appendChild(lmToggle);
        utilGrid.appendChild(alwaysNameplatesToggle);
        utilGrid.appendChild(glowBtn);
        utilGrid.appendChild(discordBtn);
        utilGrid.appendChild(singleLineBtn);
        utilGrid.appendChild(updateBtn);
        utilitySection.appendChild(utilGrid);

        scrollArea.appendChild(bgSection);
        scrollArea.appendChild(trackSection);
        scrollArea.appendChild(panelSettingsSection);
        scrollArea.appendChild(utilitySection);

        menu.appendChild(hudHeader);
        menu.appendChild(scrollArea);

        panel.appendChild(topAnchor);
        panel.appendChild(menu);

        document.body.appendChild(panel);
        applyCustomPanelBg();
        applyPanelTransparentMode();
        applyAlwaysNameplatesMode();
        applyVehicleEffects();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeEngine);
    } else {
        initThemeEngine();
    }
})();
