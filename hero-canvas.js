/**
 * AICANSMILE — Hero Data Mesh
 * -----------------------------------------------------------
 * 테마(data-hero-theme):
 *   gold   — 딥 슬레이트 네이비 위 "골드 + 에메랄드/시안 데이터 메쉬" (en.html)
 *   purple — 플럼 네이비 위 "라벤더 + 오로라 퍼플" 파티클 (index.html)
 *
 * - 24K 골드를 중심으로 은은한 에메랄드·시안 노드가 섞인 입자망이 천천히 흐른다.
 * - 가까운 노드끼리 얇은 선으로 이어져 데이터 네트워크처럼 보인다.
 * - 마우스 이동·모바일 터치에 노드가 반응하고(주변으로 밀려나며), 커서 자리에
 *   골드 빛이 번지고 주변 노드와 잔상 링크가 이어진다.
 * - 텍스트·버튼 조작을 막지 않도록 pointer-events: none, 화면 밖·탭 비활성 시 정지.
 * - prefers-reduced-motion 사용자에게는 정지된 1프레임만 보여준다.
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

    // 테마 분기 — body[data-hero-theme] ("gold" 기본 / "purple")
    //   gold   : 딥 슬레이트 네이비 위 24K 골드 + 에메랄드·시안 데이터 메쉬 (en.html)
    //   purple : 플럼 네이비 위 라벤더·오로라 퍼플 파티클 (index.html)
    var THEME = (document.body && document.body.getAttribute('data-hero-theme')) === 'purple' ? 'purple' : 'gold';

    var THEMES = {
        gold: {
            palette: [
                { rgb: '232, 201, 103', line: '232, 201, 103', weight: 0.56 }, // 골드
                { rgb: '201, 162, 39',  line: '201, 162, 39',  weight: 0.20 }, // 딥 골드
                { rgb: '47, 131, 103',  line: '72, 168, 137',  weight: 0.15 }, // 에메랄드
                { rgb: '126, 197, 190', line: '126, 197, 190', weight: 0.09 }  // 시안
            ],
            streamA: '232, 201, 103',
            streamB: '126, 197, 190',
            bloom: '232, 201, 103',
            bloomSoft: '47, 131, 103',
            link: '245, 225, 153'
        },
        purple: {
            palette: [
                { rgb: '183, 156, 232', line: '183, 156, 232', weight: 0.56 }, // 라벤더
                { rgb: '124, 95, 191',  line: '158, 128, 224', weight: 0.20 }, // 딥 바이올렛
                { rgb: '147, 197, 233', line: '147, 197, 233', weight: 0.15 }, // 오로라 스카이
                { rgb: '222, 209, 245', line: '222, 209, 245', weight: 0.09 }  // 페일 라일락
            ],
            streamA: '183, 156, 232',
            streamB: '147, 197, 233',
            bloom: '183, 156, 232',
            bloomSoft: '124, 95, 191',
            link: '222, 209, 245'
        }
    };

    var THEME_SET = THEMES[THEME];
    var PALETTE = THEME_SET.palette;

    var pointer = {
        x: -9999, y: -9999,
        tx: -9999, ty: -9999,
        active: false,
        lastMove: 0,
        strength: 0
    };

    var nodes = [];
    var sprites = {};
    var streams = [];
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

        buildNodes();
        buildStreams();
        if (reduceMotion) renderStatic();
    }

    /* ---------------------------------------------------------
       노드 글로우 스프라이트 (매 프레임 shadowBlur 대신 캐시)
       --------------------------------------------------------- */
    function makeSprite(rgb) {
        var size = 64;
        var c = document.createElement('canvas');
        c.width = c.height = size;
        var g = c.getContext('2d');
        var grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, 'rgba(' + rgb + ', 1)');
        grad.addColorStop(0.22, 'rgba(' + rgb + ', 0.72)');
        grad.addColorStop(0.55, 'rgba(' + rgb + ', 0.16)');
        grad.addColorStop(1, 'rgba(' + rgb + ', 0)');
        g.fillStyle = grad;
        g.fillRect(0, 0, size, size);
        return c;
    }

    function buildSprites() {
        for (var i = 0; i < PALETTE.length; i++) sprites[i] = makeSprite(PALETTE[i].rgb);
    }

    function pickColor() {
        var r = Math.random(), acc = 0;
        for (var i = 0; i < PALETTE.length; i++) {
            acc += PALETTE[i].weight;
            if (r <= acc) return i;
        }
        return 0;
    }

    /* ---------------------------------------------------------
       노드
       --------------------------------------------------------- */
    function nodeCount() {
        var area = width * height;
        var n = Math.round(area / 12500);
        return Math.max(26, Math.min(104, n));
    }

    function buildNodes() {
        var count = nodeCount();
        nodes = [];
        for (var i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.09,
                vy: (Math.random() - 0.5) * 0.09,
                size: 5 + Math.random() * 11,
                baseAlpha: 0.28 + Math.random() * 0.4,
                alpha: 0,
                color: pickColor(),
                phase: Math.random() * Math.PI * 2,
                twinkle: 0.0005 + Math.random() * 0.0012
            });
        }
    }

    /* ---------------------------------------------------------
       데이터 스트림(은은한 골드 물결선)
       --------------------------------------------------------- */
    function buildStreams() {
        streams = [];
        var n = width < 700 ? 3 : 5;
        for (var i = 0; i < n; i++) {
            streams.push({
                y: 0.18 + Math.random() * 0.72,
                amp: 26 + Math.random() * 46,
                freq: 0.0025 + Math.random() * 0.0035,
                speed: 0.08 + Math.random() * 0.12,
                phase: Math.random() * Math.PI * 2,
                alpha: 0.05 + Math.random() * 0.07
            });
        }
    }

    function drawStreams(time) {
        for (var i = 0; i < streams.length; i++) {
            var s = streams[i];
            var baseY = height * s.y;
            var grad = ctx.createLinearGradient(0, 0, width, 0);
            grad.addColorStop(0, 'rgba(' + THEME_SET.streamA + ', 0)');
            grad.addColorStop(0.35, 'rgba(' + THEME_SET.streamA + ', ' + s.alpha + ')');
            grad.addColorStop(0.62, 'rgba(' + THEME_SET.streamB + ', ' + (s.alpha * 0.8) + ')');
            grad.addColorStop(1, 'rgba(' + THEME_SET.streamA + ', 0)');

            ctx.beginPath();
            var step = Math.max(18, Math.round(width / 48));
            for (var x = -step; x <= width + step; x += step) {
                var y = baseY
                    + Math.sin(x * s.freq + time * s.speed + s.phase) * s.amp
                    + Math.sin(x * s.freq * 0.46 - time * s.speed * 0.7) * s.amp * 0.45;
                if (x === -step) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    /* ---------------------------------------------------------
       포인터 블룸
       --------------------------------------------------------- */
    function drawPointerBloom() {
        if (!pointer.active || pointer.strength <= 0.01) return;
        var r = Math.min(width, height) * 0.4;
        var grad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, r);
        grad.addColorStop(0, 'rgba(' + THEME_SET.bloom + ', ' + (0.1 * pointer.strength) + ')');
        grad.addColorStop(0.4, 'rgba(' + THEME_SET.bloomSoft + ', ' + (0.05 * pointer.strength) + ')');
        grad.addColorStop(1, 'rgba(' + THEME_SET.bloomSoft + ', 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    function updatePointer(dt) {
        if (pointer.active) {
            pointer.x += (pointer.tx - pointer.x) * Math.min(1, 0.16 * dt);
            pointer.y += (pointer.ty - pointer.y) * Math.min(1, 0.16 * dt);
        }
        var idle = performance.now() - pointer.lastMove;
        pointer.strength = pointer.active
            ? Math.max(0, 1 - Math.max(0, idle - 900) / 1500)
            : Math.max(0, pointer.strength - 0.02 * dt);
    }

    /* ---------------------------------------------------------
       렌더
       --------------------------------------------------------- */
    function frame(now) {
        var time = (now - t0) / 1000;
        var dt = Math.min(now - (frame.last || now), 48) / 16.667;
        frame.last = now;

        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';

        drawStreams(time);
        updatePointer(dt);
        drawPointerBloom();

        var snap = pointer.active && pointer.strength > 0.12;
        var radius = Math.min(230, Math.max(130, width * 0.18));
        var linkDist = Math.min(168, Math.max(96, width * 0.085));
        var i, j, p, q;

        /* 위치 갱신 */
        for (i = 0; i < nodes.length; i++) {
            p = nodes[i];
            p.phase += p.twinkle * dt * 16.667;
            p.vx += Math.cos(p.phase) * 0.0016 * dt;
            p.vy += Math.sin(p.phase * 0.9) * 0.0013 * dt;

            if (snap) {
                var dx = p.x - pointer.x;
                var dy = p.y - pointer.y;
                var dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
                if (dist < radius) {
                    var f = (1 - dist / radius) * pointer.strength;
                    p.vx += (dx / dist) * 0.26 * f * dt;
                    p.vy += (dy / dist) * 0.26 * f * dt;
                }
            }

            p.vx *= 0.987;
            p.vy *= 0.987;
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            if (p.x < -30) p.x = width + 30;
            if (p.x > width + 30) p.x = -30;
            if (p.y < -30) p.y = height + 30;
            if (p.y > height + 30) p.y = -30;

            var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            var targetAlpha = p.baseAlpha + Math.min(0.2, speed * 1.1);
            if (snap) {
                var pd = Math.sqrt((p.x - pointer.x) * (p.x - pointer.x) + (p.y - pointer.y) * (p.y - pointer.y));
                if (pd < radius) targetAlpha += (1 - pd / radius) * 0.26 * pointer.strength;
            }
            p.alpha += (targetAlpha - p.alpha) * Math.min(1, 0.1 * dt);
        }

        /* 메쉬 링크 */
        ctx.lineWidth = 1;
        for (i = 0; i < nodes.length; i++) {
            p = nodes[i];
            for (j = i + 1; j < nodes.length; j++) {
                q = nodes[j];
                var ddx = p.x - q.x;
                var ddy = p.y - q.y;
                var d2 = ddx * ddx + ddy * ddy;
                if (d2 > linkDist * linkDist) continue;
                var d = Math.sqrt(d2);
                var a = (1 - d / linkDist) * 0.3;
                if (a < 0.012) continue;
                /* 골드 노드끼리는 골드, 에메랄드·시안이 섞이면 청록 링크 */
                ctx.strokeStyle = 'rgba(' + PALETTE[p.color].line + ', ' + a.toFixed(3) + ')';
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        }

        /* 포인터 ↔ 노드 링크 */
        if (snap) {
            var linkR = radius * 1.15;
            for (i = 0; i < nodes.length; i++) {
                p = nodes[i];
                var ax = p.x - pointer.x;
                var ay = p.y - pointer.y;
                var ad = Math.sqrt(ax * ax + ay * ay);
                if (ad > linkR) continue;
                var la = (1 - ad / linkR) * 0.4 * pointer.strength;
                if (la < 0.015) continue;
                ctx.strokeStyle = 'rgba(' + THEME_SET.link + ', ' + la.toFixed(3) + ')';
                ctx.beginPath();
                ctx.moveTo(pointer.x, pointer.y);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            }
        }

        /* 노드 글로우 */
        for (i = 0; i < nodes.length; i++) {
            p = nodes[i];
            ctx.globalAlpha = Math.min(0.9, p.alpha);
            ctx.drawImage(sprites[p.color], p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        rafId = requestAnimationFrame(frame);
    }

    function renderStatic() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';
        drawStreams(0);
        var linkDist = Math.min(168, Math.max(96, width * 0.085));
        ctx.lineWidth = 1;
        for (var i = 0; i < nodes.length; i++) {
            var p = nodes[i];
            p.alpha = p.baseAlpha;
            for (var j = i + 1; j < nodes.length; j++) {
                var q = nodes[j];
                var dx = p.x - q.x, dy = p.y - q.y;
                var d = Math.sqrt(dx * dx + dy * dy);
                if (d > linkDist) continue;
                var a = (1 - d / linkDist) * 0.26;
                if (a < 0.012) continue;
                ctx.strokeStyle = 'rgba(' + PALETTE[p.color].line + ', ' + a.toFixed(3) + ')';
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        }
        for (var k = 0; k < nodes.length; k++) {
            var n = nodes[k];
            ctx.globalAlpha = n.alpha;
            ctx.drawImage(sprites[n.color], n.x - n.size / 2, n.y - n.size / 2, n.size, n.size);
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
        if (e.pointerType === 'touch') return;   // 터치는 아래 touch 이벤트로 처리
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
        pointer.strength = 0.6;
        pointer.lastMove = performance.now() - 700;
    }, { passive: true });

    /* ---------------------------------------------------------
       표시 상태
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
        var lastW = 0, lastH = 0;
        new ResizeObserver(function () {
            var w = hero.clientWidth, h = hero.clientHeight;
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
