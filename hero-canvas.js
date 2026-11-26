/**
 * AICANSMILE — Hero Aurora Particles
 * -----------------------------------------------------------
 * Hero 첫 화면 바탕의 "은은한 오로라" 배경.
 *
 * - 흐르는 오로라 커튼(보라·청록·골드) 위에 작은 입자들이 천천히 떠다닌다.
 * - 마우스 이동 / 모바일 터치(touchstart·touchmove)에 입자가 유동적으로 반응한다.
 *   (커서 주변은 살짝 밀려나며 소용돌이치고, 커서 자리에 오로라 빛이 번진다)
 * - 텍스트 가독성과 버튼 클릭을 방해하지 않도록 pointer-events: none,
 *   낮은 투명도, 화면 밖/탭 비활성 시 렌더링 정지.
 * - prefers-reduced-motion 사용자는 정지된 오로라 1프레임만 그린다.
 */

(function () {
    'use strict';

    var hero = document.querySelector('.hero');
    var canvas = document.getElementById('hero-canvas');
    if (!hero || !canvas) return;

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var width = 0;
    var height = 0;
    var dpr = 1;

    // 브랜드 팔레트 — 플럼(보라) · 청록 · 골드
    var PALETTE = [
        { rgb: '168, 138, 214', weight: 0.42 }, // 라벤더/바이올렛
        { rgb: '122, 176, 190', weight: 0.26 }, // 오로라 청록
        { rgb: '212, 165, 116', weight: 0.18 }, // 브랜드 골드
        { rgb: '196, 160, 220', weight: 0.14 }  // 연보라
    ];

    var pointer = {
        x: -9999,
        y: -9999,
        tx: -9999,
        ty: -9999,
        active: false,
        lastMove: 0,
        strength: 0
    };

    var particles = [];
    var sprites = {};
    var curtains = [
        { rgb: '150, 124, 214', baseY: 0.14, amp: 46, thickness: 0.30, phase: 0.0, speed: 0.16, alpha: 0.26, freq: 0.0032, rays: 26 },
        { rgb: '96, 190, 172', baseY: 0.38, amp: 62, thickness: 0.36, phase: 1.9, speed: 0.11, alpha: 0.20, freq: 0.0021, rays: 20 },
        { rgb: '212, 165, 116', baseY: 0.72, amp: 30, thickness: 0.22, phase: 3.6, speed: 0.09, alpha: 0.10, freq: 0.0026, rays: 0 }
    ];

    // 오로라 커튼은 저해상도 오프스크린에 그리고 블러로 확대 → 은은하게 번지는 빛
    var AURA_SCALE = 0.28;
    var auraCanvas = document.createElement('canvas');
    var auraCtx = auraCanvas.getContext('2d');
    var supportsFilter = (function () {
        try {
            var tc = document.createElement('canvas').getContext('2d');
            tc.filter = 'blur(2px)';
            return tc.filter === 'blur(2px)';
        } catch (e) { return false; }
    })();

    var rafId = null;
    var running = false;
    var inView = true;
    var t0 = performance.now();

    /* ---------------------------------------------------------
       캔버스 크기
       --------------------------------------------------------- */
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = hero.clientWidth;
        height = hero.clientHeight;
        if (!width || !height) return;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        auraCanvas.width = Math.max(160, Math.round(width * AURA_SCALE));
        auraCanvas.height = Math.max(90, Math.round(height * AURA_SCALE));

        buildParticles();
        if (reduceMotion) renderStatic();
    }

    /* ---------------------------------------------------------
       입자 스프라이트 (글로우 점) — 매 프레임 shadowBlur 대신 캐시
       --------------------------------------------------------- */
    function makeSprite(rgb) {
        var size = 64;
        var c = document.createElement('canvas');
        c.width = c.height = size;
        var g = c.getContext('2d');
        var grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, 'rgba(' + rgb + ', 1)');
        grad.addColorStop(0.28, 'rgba(' + rgb + ', 0.55)');
        grad.addColorStop(0.6, 'rgba(' + rgb + ', 0.12)');
        grad.addColorStop(1, 'rgba(' + rgb + ', 0)');
        g.fillStyle = grad;
        g.fillRect(0, 0, size, size);
        return c;
    }

    function buildSprites() {
        for (var i = 0; i < PALETTE.length; i++) {
            sprites[i] = makeSprite(PALETTE[i].rgb);
        }
    }

    function pickColor() {
        var r = Math.random();
        var acc = 0;
        for (var i = 0; i < PALETTE.length; i++) {
            acc += PALETTE[i].weight;
            if (r <= acc) return i;
        }
        return 0;
    }

    /* ---------------------------------------------------------
       입자
       --------------------------------------------------------- */
    function particleCount() {
        var area = width * height;
        var n = Math.round(area / 11000);
        return Math.max(38, Math.min(120, n));
    }

    function buildParticles() {
        var count = particleCount();
        particles = [];
        for (var i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.10,
                vy: (Math.random() - 0.5) * 0.10,
                size: 6 + Math.random() * 14,       // 스프라이트 표시 지름(px)
                baseAlpha: 0.20 + Math.random() * 0.34,
                alpha: 0,
                color: pickColor(),
                drift: Math.random() * Math.PI * 2,
                driftSpeed: 0.00016 + Math.random() * 0.00026
            });
        }
    }

    /* ---------------------------------------------------------
       오로라 커튼
       --------------------------------------------------------- */
    function drawCurtain(target, layer, time, w, h) {
        var k = height / h;              // 오프스크린 → 화면 픽셀 비율
        var step = Math.max(16, Math.round(w / 60));
        var baseY = h * layer.baseY;
        var thickness = h * layer.thickness;
        var amp = layer.amp * (h / Math.max(height, 1));
        var top = baseY - amp * 2.4;
        var bottom = baseY + thickness + amp * 2.4;

        var grad = target.createLinearGradient(0, top, 0, bottom);
        grad.addColorStop(0, 'rgba(' + layer.rgb + ', 0)');
        grad.addColorStop(0.34, 'rgba(' + layer.rgb + ', ' + layer.alpha + ')');
        grad.addColorStop(0.62, 'rgba(' + layer.rgb + ', ' + (layer.alpha * 0.7) + ')');
        grad.addColorStop(1, 'rgba(' + layer.rgb + ', 0)');

        var x, y, i;
        var xs = [];

        target.beginPath();
        // 윗변
        for (x = -step; x <= w + step; x += step) {
            y = baseY
                + Math.sin(x * k * layer.freq + time * layer.speed + layer.phase) * amp
                + Math.sin(x * k * layer.freq * 0.47 - time * layer.speed * 0.62 + layer.phase * 1.7) * amp * 0.55;
            if (xs.length === 0) target.moveTo(x, y);
            else target.lineTo(x, y);
            xs.push([x, y]);
        }
        // 아랫변 (되짚어 오기)
        for (i = xs.length - 1; i >= 0; i--) {
            var yy = xs[i][1] + thickness * (0.72 + 0.28 * Math.sin(xs[i][0] * k * 0.006 + time * 0.4 + layer.phase));
            target.lineTo(xs[i][0], yy);
        }
        target.closePath();
        target.fillStyle = grad;
        target.fill();

        // 오로라 기둥(ray) — 커튼 안쪽의 세로 빛무늬
        if (layer.rays) drawRays(target, layer, time, w, h, k, baseY, amp, thickness);
    }

    function drawRays(target, layer, time, w, h, k, baseY, amp, thickness) {
        var count = layer.rays;
        var slot = w / count;
        for (var r = 0; r < count; r++) {
            var seed = r * 2.399;
            var rx = (r + 0.5) * slot + Math.sin(seed) * slot * 0.45;
            var flick = 0.5 + 0.5 * Math.sin(seed * 2.3 + time * (0.35 + (r % 3) * 0.08) + layer.phase);
            var rw = slot * (0.16 + 0.34 * flick);
            var a = layer.alpha * (0.22 + 0.62 * flick);
            var topY = baseY
                + Math.sin(rx * k * layer.freq + time * layer.speed + layer.phase) * amp - amp * 0.9;
            var rh = thickness * (0.85 + 0.45 * Math.sin(rx * k * 0.005 + time * 0.3 + layer.phase));
            if (rh < 6) continue;

            var g = target.createLinearGradient(0, topY, 0, topY + rh);
            g.addColorStop(0, 'rgba(' + layer.rgb + ', 0)');
            g.addColorStop(0.38, 'rgba(' + layer.rgb + ', ' + a + ')');
            g.addColorStop(0.72, 'rgba(' + layer.rgb + ', ' + (a * 0.62) + ')');
            g.addColorStop(1, 'rgba(' + layer.rgb + ', 0)');
            target.fillStyle = g;
            target.fillRect(rx - rw / 2, topY, rw, rh);
        }
    }

    function drawAurora(time) {
        var w = auraCanvas.width;
        var h = auraCanvas.height;
        auraCtx.setTransform(1, 0, 0, 1, 0, 0);
        auraCtx.clearRect(0, 0, w, h);
        auraCtx.globalCompositeOperation = 'lighter';
        if (supportsFilter) auraCtx.filter = 'blur(5px)';
        for (var c = 0; c < curtains.length; c++) drawCurtain(auraCtx, curtains[c], time, w, h);
        if (supportsFilter) auraCtx.filter = 'none';
        auraCtx.globalCompositeOperation = 'source-over';

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(auraCanvas, 0, 0, width, height);
    }

    /* ---------------------------------------------------------
       포인터 오로라 블룸
       --------------------------------------------------------- */
    function drawPointerBloom() {
        if (!pointer.active || pointer.strength <= 0.01) return;
        var r = Math.min(width, height) * 0.42;
        var grad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, r);
        grad.addColorStop(0, 'rgba(196, 168, 232, ' + (0.13 * pointer.strength) + ')');
        grad.addColorStop(0.45, 'rgba(140, 176, 208, ' + (0.06 * pointer.strength) + ')');
        grad.addColorStop(1, 'rgba(140, 176, 208, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    /* ---------------------------------------------------------
       렌더 루프
       --------------------------------------------------------- */
    function frame(now) {
        var time = (now - t0) / 1000;
        var dt = Math.min(now - (frame.last || now), 48) / 16.667;
        frame.last = now;

        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';

        // 오로라 커튼
        drawAurora(time);

        // 포인터 좌표 부드럽게 따라가기
        if (pointer.active) {
            pointer.x += (pointer.tx - pointer.x) * Math.min(1, 0.16 * dt);
            pointer.y += (pointer.ty - pointer.y) * Math.min(1, 0.16 * dt);
        }
        var idle = now - pointer.lastMove;
        pointer.strength = pointer.active ? Math.max(0, 1 - Math.max(0, idle - 900) / 1400) : Math.max(0, pointer.strength - 0.02 * dt);

        drawPointerBloom();

        // 입자
        var snap = pointer.active && pointer.strength > 0.15;
        var radius = Math.min(260, Math.max(150, width * 0.22));
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];

            p.drift += p.driftSpeed * dt * 16.667;
            p.vx += Math.cos(p.drift) * 0.0022 * dt;
            p.vy += Math.sin(p.drift * 0.9) * 0.0018 * dt;

            if (snap) {
                var dx = p.x - pointer.x;
                var dy = p.y - pointer.y;
                var dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
                if (dist < radius) {
                    var f = (1 - dist / radius) * pointer.strength;
                    var nx = dx / dist;
                    var ny = dy / dist;
                    // 살짝 밀어내며 소용돌이 — 유체처럼 흐르는 느낌
                    p.vx += (nx * 0.34 + -ny * 0.52) * f * dt;
                    p.vy += (ny * 0.34 + nx * 0.52) * f * dt;
                }
            }

            p.vx *= 0.986;
            p.vy *= 0.986;
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            if (p.x < -40) p.x = width + 40;
            if (p.x > width + 40) p.x = -40;
            if (p.y < -40) p.y = height + 40;
            if (p.y > height + 40) p.y = -40;

            var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            var target = p.baseAlpha + Math.min(0.22, speed * 0.9);
            if (snap) {
                var pd = Math.sqrt((p.x - pointer.x) * (p.x - pointer.x) + (p.y - pointer.y) * (p.y - pointer.y));
                if (pd < radius) target += (1 - pd / radius) * 0.24 * pointer.strength;
            }
            p.alpha += (target - p.alpha) * Math.min(1, 0.12 * dt);

            var s = p.size;
            ctx.globalAlpha = Math.min(0.85, p.alpha);
            ctx.drawImage(sprites[p.color], p.x - s / 2, p.y - s / 2, s, s);
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';

        rafId = requestAnimationFrame(frame);
    }

    function renderStatic() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';
        drawAurora(0);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.globalAlpha = p.baseAlpha;
            ctx.drawImage(sprites[p.color], p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }

    function start() {
        if (reduceMotion || running || !inView || document.hidden) return;
        running = true;
        frame.last = 0;
        rafId = requestAnimationFrame(frame);
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    /* ---------------------------------------------------------
       입력 — 마우스 + 터치
       --------------------------------------------------------- */
    function setPointer(clientX, clientY) {
        var rect = canvas.getBoundingClientRect();
        pointer.tx = clientX - rect.left;
        pointer.ty = clientY - rect.top;
        if (!pointer.active) {
            pointer.x = pointer.tx;
            pointer.y = pointer.ty;
        }
        pointer.active = true;
        pointer.lastMove = performance.now();
        pointer.strength = 1;
    }

    function clearPointer() {
        pointer.active = false;
        pointer.tx = pointer.ty = -9999;
    }

    hero.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return; // 터치는 아래 touch 이벤트에서 처리
        setPointer(e.clientX, e.clientY);
    }, { passive: true });

    hero.addEventListener('pointerleave', clearPointer, { passive: true });
    hero.addEventListener('pointercancel', clearPointer, { passive: true });

    hero.addEventListener('touchstart', function (e) {
        if (!e.touches || !e.touches.length) return;
        setPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    hero.addEventListener('touchmove', function (e) {
        if (!e.touches || !e.touches.length) return;
        setPointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    hero.addEventListener('touchend', function () {
        // 손을 떼도 오로라는 잠시 남았다가 서서히 사라진다
        pointer.strength = 0.6;
        pointer.lastMove = performance.now() - 700;
    }, { passive: true });

    /* ---------------------------------------------------------
       표시 상태 관리
       --------------------------------------------------------- */
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop();
        else start();
    });

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            inView = entries[0].isIntersecting;
            if (inView) start();
            else stop();
        }, { threshold: 0 }).observe(hero);
    }

    if ('ResizeObserver' in window) {
        var lastW = 0;
        var lastH = 0;
        new ResizeObserver(function () {
            var w = hero.clientWidth;
            var h = hero.clientHeight;
            if (w === lastW && h === lastH) return;
            lastW = w;
            lastH = h;
            resize();
        }).observe(hero);
    } else {
        window.addEventListener('resize', resize);
    }

    /* ---------------------------------------------------------
       시작
       --------------------------------------------------------- */
    buildSprites();
    resize();
    if (reduceMotion) renderStatic();
    else start();
})();
