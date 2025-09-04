<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <!-- PWA設定 -->
    <meta name="application-name" content="OKN検査">
    <meta name="apple-mobile-web-app-title" content="OKN検査">
    
    <!-- アイコン設定 - GitHubのURLに変更してください -->
    <link rel="icon" href="FNT512.png">
    <link rel="apple-touch-icon" href="FNT512.png">
    <link rel="apple-touch-icon" sizes="180x180" href="FNT512.png">
    <link rel="icon" type="image/png" sizes="192x192" href="FNT512.png">
    <link rel="icon" type="image/png" sizes="512x512" href="FNT512.png">
    
    <!-- テーマカラー -->
    <meta name="theme-color" content="#667eea">
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="manifest.json">
    
    <title>OKN検査 - Optokinetic Nystagmus</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #0a0a0a;
            color: #ffffff;
            min-height: 100vh;
            padding: 20px;
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
            overflow-x: hidden;
            position: relative;
            width: 100%;
        }

        .container {
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            text-align: center;
            overflow: hidden;
            position: relative;
        }

        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: inline-block;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
        }

        .logo {
            height: 50px;
            width: auto;
            border-radius: 8px;
            background: transparent !important;
            background-color: transparent !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        }
        
        /* Force transparent background for all browsers */
        .header .logo,
        .header img.logo {
            background: none !important;
            background-color: rgba(0, 0, 0, 0) !important;
            background-image: none !important;
        }

        .instructions {
            background: rgba(102, 126, 234, 0.1);
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: left;
            font-size: 0.9rem;
            line-height: 1.6;
        }

        .instructions h3 {
            color: #667eea;
            margin-bottom: 10px;
        }

        .instructions ul {
            margin-left: 20px;
        }

        .instructions li {
            margin-bottom: 5px;
        }

        .display-area {
            position: relative;
            width: 100%;
            height: 400px;
            max-width: calc(100vw - 40px);
            margin: 20px auto;
            background: #000;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
        }

        #canvas {
            width: 100%;
            height: 100%;
            display: block;
        }

        .menu-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1001;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .settings-panel {
            position: fixed;
            top: 0;
            right: -350px;
            width: 320px;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            padding: 80px 20px 20px;
            transition: right 0.3s ease;
            z-index: 1000;
            overflow-y: auto;
        }

        .settings-panel.open {
            right: 0;
        }

        .settings {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .setting-group {
            background: rgba(255, 255, 255, 0.05);
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .setting-group label {
            display: block;
            margin-bottom: 8px;
            color: #aaa;
            font-size: 0.9rem;
        }

        select, input[type="range"] {
            width: 100%;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 5px;
            color: white;
            font-size: 1rem;
        }

        .controls {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        button {
            padding: 12px 30px;
            font-size: 1.1rem;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .start-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .stop-btn {
            background: #e74c3c;
            color: white;
        }

        .fullscreen-btn {
            background: #444;
            color: white;
        }

        .fullscreen-btn.active {
            background: #667eea;
        }

        .timer-display {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
            font-family: 'Courier New', monospace;
            display: none;
        }

        .copyright {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            color: #888;
            font-size: 0.9rem;
        }

        .splash-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease;
        }

        .splash-screen.show {
            opacity: 1;
            pointer-events: all;
        }

        .splash-logo {
            width: 150px;
            height: 150px;
            margin-bottom: 30px;
        }

        .splash-title {
            font-size: 1.8rem;
            color: #333;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .splash-subtitle {
            font-size: 2.2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .splash-copyright {
            color: #666;
            font-size: 0.9rem;
        }

        /* Fullscreen styles */
        body:fullscreen {
            padding-top: 40px;
        }
        
        body:-webkit-full-screen {
            padding-top: 40px;
        }
        
        body:-moz-full-screen {
            padding-top: 40px;
        }
        
        body:-ms-fullscreen {
            padding-top: 40px;
        }

        @media (max-width: 600px) {
            html, body {
                overflow-x: hidden !important;
                position: relative !important;
            }
            
            .container {
                padding: 0 10px;
                width: 100%;
                overflow-x: hidden !important;
            }
            
            .display-area {
                height: 300px;
            }
            
            .header {
                flex-direction: column;
                gap: 10px;
            }
            
            h1 {
                font-size: 1.8rem;
            }
            
            .logo {
                height: 40px;
            }
            
            .settings-panel {
                width: 280px;
                right: -300px;
            }
            
            .controls {
                padding: 0 10px;
            }
            
            button {
                font-size: 0.9rem;
                padding: 10px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="FNT512-transparent.png" alt="FNT Logo" class="logo">
            <h1>OKN検査</h1>
        </div>
        
        <div class="instructions">
            <h3>📖 使い方</h3>
            <ul>
                <li>右上の「メニュー」ボタンで設定パネルを開きます</li>
                <li>刺激方向、パターン、速度、時間を設定します</li>
                <li>「開始」ボタンで検査を開始します</li>
                <li>検査中は設定した時間まで刺激が表示されます</li>
                <li>「全画面」ボタンでフルスクリーン表示できます</li>
                <li>スペースキーでも開始/停止を制御できます</li>
            </ul>
        </div>
        
        <div class="display-area">
            <canvas id="canvas"></canvas>
        </div>
        
        <div class="controls">
            <button class="start-btn" id="startBtn">開始</button>
            <button class="stop-btn" id="stopBtn" disabled>停止</button>
            <button class="fullscreen-btn" id="fullscreenBtn">全画面</button>
        </div>
        
        <div class="copyright">
            © 2024 Functional Neuro Training. All rights reserved.
        </div>
    </div>
    
    <button class="menu-toggle" id="menuToggle">メニュー</button>
    
    <div class="settings-panel" id="settingsPanel">
        <h3 style="color: #667eea; margin-bottom: 20px;">検査設定</h3>
        
        <div class="settings">
            <div class="setting-group">
                <label>刺激方向</label>
                <select id="direction">
                    <option value="right">右方向 →</option>
                    <option value="left">左方向 ←</option>
                    <option value="up">上方向 ↑</option>
                    <option value="down">下方向 ↓</option>
                    <option value="clockwise">右回転 (tOKN) ↻</option>
                    <option value="counterclockwise">左回転 (tOKN) ↺</option>
                </select>
            </div>
            
            <div class="setting-group">
                <label>刺激パターン</label>
                <select id="pattern">
                    <option value="blackwhite">ストライプ黒白</option>
                    <option value="redwhite">ストライプ赤白</option>
                    <option value="characters">キャラクター</option>
                    <option value="zodiac">干支</option>
                </select>
            </div>
            
            <div class="setting-group">
                <label>速度: <span id="speedValue">50</span></label>
                <input type="range" id="speed" min="10" max="200" value="50" step="10">
            </div>
            
            <div class="setting-group">
                <label>刺激時間</label>
                <select id="duration">
                    <option value="30">30秒</option>
                    <option value="60" selected>1分</option>
                    <option value="120">2分</option>
                    <option value="180">3分</option>
                    <option value="300">5分</option>
                    <option value="600">10分</option>
                </select>
            </div>
        </div>
    </div>
    
    <div class="timer-display" id="timerDisplay">00:00</div>
    
    <!-- スプラッシュスクリーン -->
    <div class="splash-screen" id="splashScreen">
        <img src="FNT512.png" alt="FNT Logo" class="splash-logo">
        <div class="splash-title">Functional Neuro Training</div>
        <div class="splash-subtitle">OKN検査</div>
        <div class="splash-copyright">© 2024 Functional Neuro Training</div>
    </div>

    <script>
        // DOM elements
        const elements = {
            canvas: document.getElementById('canvas'),
            startBtn: document.getElementById('startBtn'),
            stopBtn: document.getElementById('stopBtn'),
            fullscreenBtn: document.getElementById('fullscreenBtn'),
            menuToggle: document.getElementById('menuToggle'),
            settingsPanel: document.getElementById('settingsPanel'),
            timerDisplay: document.getElementById('timerDisplay'),
            splashScreen: document.getElementById('splashScreen'),
            speedSlider: document.getElementById('speed'),
            speedValue: document.getElementById('speedValue'),
            directionSelect: document.getElementById('direction'),
            patternSelect: document.getElementById('pattern'),
            durationSelect: document.getElementById('duration')
        };

        const ctx = elements.canvas.getContext('2d');
        
        // Game state
        let animationId = null;
        let startTime = null;
        let isRunning = false;
        let offset = 0;
        let rotationAngle = 0;
        let speed = 50;
        let duration = 60;

        // Zodiac data
        const zodiacEmoji = ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐏', '🐵', '🐓', '🐕', '🐗'];
        const characterEmoji = ['🌟', '🎈', '🦋', '🌸', '🍀', '🌈', '🎵', '💫', '🐢', '🦊'];

        // Canvas setup - Enhanced for fullscreen
        function resizeCanvas() {
            const container = elements.canvas.parentElement;
            
            // Check if in fullscreen mode
            if (document.fullscreenElement || document.webkitFullscreenElement || 
                document.mozFullScreenElement || document.msFullscreenElement) {
                // Use full viewport in fullscreen
                elements.canvas.width = window.innerWidth;
                elements.canvas.height = window.innerHeight;
            } else {
                // Use container size in normal mode
                elements.canvas.width = container.clientWidth;
                elements.canvas.height = container.clientHeight;
            }
        }

        // Initialize event listeners
        function initializeEventListeners() {
            elements.startBtn.addEventListener('click', start);
            elements.stopBtn.addEventListener('click', stop);
            elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
            elements.menuToggle.addEventListener('click', toggleMenu);
            
            elements.speedSlider.addEventListener('input', (e) => {
                speed = parseInt(e.target.value);
                elements.speedValue.textContent = speed;
            });
            
            // Keyboard controls
            document.addEventListener('keydown', (e) => {
                if (e.code === 'Space') {
                    e.preventDefault();
                    if (isRunning) {
                        stop();
                    } else {
                        start();
                    }
                }
            });
            
            window.addEventListener('resize', resizeCanvas);
        }

        // Menu toggle
        function toggleMenu() {
            elements.settingsPanel.classList.toggle('open');
            elements.menuToggle.textContent = elements.settingsPanel.classList.contains('open') ? '閉じる' : 'メニュー';
        }

        // Fullscreen toggle
        function toggleFullscreen() {
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.mozFullScreenElement &&
                !document.msFullscreenElement) {
                // Enter fullscreen
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                }
                elements.fullscreenBtn.textContent = '通常表示';
                elements.fullscreenBtn.classList.add('active');
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                elements.fullscreenBtn.textContent = '全画面';
                elements.fullscreenBtn.classList.remove('active');
            }
        }

        // Draw stripe pattern
        function drawStripes(color1, color2, direction) {
            const stripeWidth = 60;
            const totalStripes = 30;
            
            ctx.save();
            
            if (direction === 'clockwise' || direction === 'counterclockwise') {
                ctx.translate(elements.canvas.width / 2, elements.canvas.height / 2);
                ctx.rotate(rotationAngle);
                
                for (let i = 0; i < 36; i++) {
                    ctx.rotate((Math.PI * 2) / 36);
                    ctx.fillStyle = i % 2 === 0 ? color1 : color2;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.max(elements.canvas.width, elements.canvas.height), 0);
                    ctx.lineTo(Math.max(elements.canvas.width, elements.canvas.height), stripeWidth);
                    ctx.lineTo(0, 0);
                    ctx.fill();
                }
            } else {
                for (let i = -2; i < totalStripes; i++) {
                    ctx.fillStyle = i % 2 === 0 ? color1 : color2;
                    
                    if (direction === 'right' || direction === 'left') {
                        let x = direction === 'right' 
                            ? (i * stripeWidth + offset) % (totalStripes * stripeWidth) - stripeWidth
                            : (i * stripeWidth - offset) % (totalStripes * stripeWidth) - stripeWidth;
                        if (x < -stripeWidth) x += totalStripes * stripeWidth;
                        ctx.fillRect(x, 0, stripeWidth, elements.canvas.height);
                    } else {
                        let y = direction === 'down'
                            ? (i * stripeWidth + offset) % (totalStripes * stripeWidth) - stripeWidth
                            : (i * stripeWidth - offset) % (totalStripes * stripeWidth) - stripeWidth;
                        if (y < -stripeWidth) y += totalStripes * stripeWidth;
                        ctx.fillRect(0, y, elements.canvas.width, stripeWidth);
                    }
                }
            }
            
            ctx.restore();
        }

        // Draw character pattern
        function drawCharacters(direction, isZodiac) {
            const emoji = isZodiac ? zodiacEmoji : characterEmoji;
            const spacing = 60;
            
            ctx.save();
            ctx.font = '32px Arial';
            ctx.fillStyle = '#FFFFFF';
            
            if (direction === 'clockwise' || direction === 'counterclockwise') {
                ctx.translate(elements.canvas.width / 2, elements.canvas.height / 2);
                ctx.rotate(rotationAngle);
                
                const gridSize = Math.ceil(Math.max(elements.canvas.width, elements.canvas.height) / spacing) * 2;
                
                for (let row = -gridSize/2; row <= gridSize/2; row++) {
                    for (let col = -gridSize/2; col <= gridSize/2; col++) {
                        const x = col * spacing;
                        const y = row * spacing;
                        const index = Math.abs((row + col)) % emoji.length;
                        ctx.fillText(emoji[index], x - 16, y + 16);
                    }
                }
            } else {
                const cols = Math.ceil(elements.canvas.width / spacing) + 3;
                const rows = Math.ceil(elements.canvas.height / spacing) + 3;
                
                for (let row = -1; row < rows; row++) {
                    for (let col = -1; col < cols; col++) {
                        let x, y;
                        
                        if (direction === 'right' || direction === 'left') {
                            x = direction === 'right'
                                ? (col * spacing + offset) % (cols * spacing)
                                : (col * spacing - offset) % (cols * spacing);
                            if (x < 0) x += cols * spacing;
                            y = row * spacing + 30;
                        } else {
                            x = col * spacing + 30;
                            y = direction === 'down'
                                ? (row * spacing + offset) % (rows * spacing)
                                : (row * spacing - offset) % (rows * spacing);
                            if (y < 0) y += rows * spacing;
                        }
                        
                        const index = Math.abs((row * cols + col)) % emoji.length;
                        ctx.fillText(emoji[index], x, y);
                    }
                }
            }
            
            ctx.restore();
        }

        // Animation loop
        function animate() {
            if (!isRunning) return;
            
            const currentTime = Date.now();
            const elapsed = (currentTime - startTime) / 1000;
            
            if (elapsed >= duration) {
                stop();
                return;
            }
            
            // Update timer
            const remaining = duration - Math.floor(elapsed);
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Clear canvas
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
            
            // Get settings
            const direction = elements.directionSelect.value;
            const pattern = elements.patternSelect.value;
            
            // Update position/rotation
            const deltaSpeed = speed / 10;
            if (direction === 'clockwise') rotationAngle += deltaSpeed * 0.01;
            else if (direction === 'counterclockwise') rotationAngle -= deltaSpeed * 0.01;
            else offset += deltaSpeed;
            
            // Draw pattern
            switch(pattern) {
                case 'blackwhite':
                    drawStripes('#000000', '#FFFFFF', direction);
                    break;
                case 'redwhite':
                    drawStripes('#FF0000', '#FFFFFF', direction);
                    break;
                case 'characters':
                    drawCharacters(direction, false);
                    break;
                case 'zodiac':
                    drawCharacters(direction, true);
                    break;
            }
            
            animationId = requestAnimationFrame(animate);
        }

        // Start function
        async function start() {
            if (isRunning) return;
            
            // Show splash screen
            elements.splashScreen.classList.add('show');
            await new Promise(resolve => setTimeout(resolve, 2000));
            elements.splashScreen.classList.remove('show');
            
            // Close menu if open
            if (elements.settingsPanel.classList.contains('open')) {
                toggleMenu();
            }
            
            isRunning = true;
            startTime = Date.now();
            duration = parseInt(elements.durationSelect.value);
            offset = 0;
            rotationAngle = 0;
            
            elements.startBtn.disabled = true;
            elements.stopBtn.disabled = false;
            elements.timerDisplay.style.display = 'block';
            
            animate();
        }

        // Stop function
        function stop() {
            isRunning = false;
            
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            
            elements.startBtn.disabled = false;
            elements.stopBtn.disabled = true;
            elements.timerDisplay.style.display = 'none';
            
            // Clear canvas
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
            ctx.fillStyle = '#666';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('設定を選択して「開始」をクリック', elements.canvas.width / 2, elements.canvas.height / 2);
        }

        // Fullscreen change event listeners
        document.addEventListener('fullscreenchange', updateFullscreenButton);
        document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
        document.addEventListener('mozfullscreenchange', updateFullscreenButton);
        document.addEventListener('MSFullscreenChange', updateFullscreenButton);

        function updateFullscreenButton() {
            if (!document.fullscreenElement && 
                !document.webkitFullscreenElement && 
                !document.mozFullScreenElement &&
                !document.msFullscreenElement) {
                elements.fullscreenBtn.textContent = '全画面';
                elements.fullscreenBtn.classList.remove('active');
                elements.exitFullscreenBtn.classList.remove('show');
            } else {
                elements.fullscreenBtn.textContent = '通常表示';
                elements.fullscreenBtn.classList.add('active');
                elements.exitFullscreenBtn.classList.add('show');
            }
        }

        // Hide address bar on mobile
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.scrollTo(0, 1);
            }, 100);
        });

        // Keep address bar hidden
        window.addEventListener('scroll', () => {
            if (window.scrollY < 1) {
                setTimeout(() => {
                    window.scrollTo(0, 1);
                }, 0);
            }
        });

        // Prevent horizontal scroll
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diffX = Math.abs(touchStartX - touchEndX);
            
            if (diffX > 10) {
                const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                if (scrollLeft > 0) {
                    e.preventDefault();
                    document.documentElement.scrollLeft = 0;
                    document.body.scrollLeft = 0;
                }
            }
        }, { passive: false });

        // Force viewport to stay at left edge
        window.addEventListener('scroll', () => {
            if (window.scrollX > 0) {
                window.scrollTo(0, window.scrollY);
            }
        });

        // Initialize
        initializeEventListeners();
        resizeCanvas();
        
        // Show splash screen on app load
        window.addEventListener('load', async () => {
            // Show splash screen
            elements.splashScreen.classList.add('show');
            await new Promise(resolve => setTimeout(resolve, 2000));
            elements.splashScreen.classList.remove('show');
            
            // Initial canvas message
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
            ctx.fillStyle = '#666';
            ctx.font = '18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('設定を選択して「開始」をクリック', elements.canvas.width / 2, elements.canvas.height / 2);
        });

        // Register Service Worker for PWA with update checking
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('SW registered:', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New service worker available
                                    if (confirm('新しいバージョンが利用可能です。更新しますか？')) {
                                        newWorker.postMessage({ action: 'skipWaiting' });
                                        window.location.reload();
                                    }
                                }
                            });
                        });
                    })
                    .catch(err => console.log('SW registration failed:', err));
            });
            
            // Handle controller change
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        }
        
        // PWA install prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button or notification
            const installButton = document.createElement('button');
            installButton.textContent = 'アプリとしてインストール';
            installButton.style.cssText = `
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 30px;
                font-weight: 600;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            `;
            
            installButton.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    console.log(`User response: ${outcome}`);
                    deferredPrompt = null;
                    installButton.remove();
                }
            });
            
            document.body.appendChild(installButton);
            
            // Auto hide after 10 seconds
            setTimeout(() => {
                if (installButton.parentNode) {
                    installButton.remove();
                }
            }, 10000);
        });
        
        // PWA installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            deferredPrompt = null;
        });
    </script>
</body>
</html>
