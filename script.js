document.addEventListener('DOMContentLoaded', () => {
    // --- Entrance and Audio ---
    const enterBtn = document.getElementById('enterBtn');
    const entranceOverlay = document.getElementById('entranceOverlay');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            // Attempt to play music
            if (bgMusic) {
                bgMusic.volume = 0.5;
                bgMusic.play().catch(e => console.log("Audio play failed:", e));
            }
            
            // Hide overlay and show main content
            entranceOverlay.style.opacity = '0';
            setTimeout(() => {
                entranceOverlay.style.display = 'none';
                mainContent.style.display = 'block';
                // Trigger reflow to ensure transition works
                void mainContent.offsetWidth;
                mainContent.style.opacity = '1';
                
                // Initialize floating elements
                createFloatingElements();
                
                // Trigger check visibility to fade in elements
                setTimeout(checkVisibility, 500);
            }, 1000);
        });
    }

    // --- Floating Background Elements ---
    function createFloatingElements() {
        const container = document.getElementById('floatingElements');
        if (!container) return;
        
        const numPetals = 20;
        for (let i = 0; i < numPetals; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            
            // Randomize properties
            const size = Math.random() * 15 + 10; // 10px to 25px
            const left = Math.random() * 100; // 0% to 100% width
            const duration = Math.random() * 10 + 10; // 10s to 20s
            const delay = Math.random() * 10; // 0s to 10s delay
            
            petal.style.width = `${size}px`;
            petal.style.height = `${size * 1.2}px`;
            petal.style.left = `${left}vw`;
            petal.style.animationDuration = `${duration}s`;
            petal.style.animationDelay = `${delay}s`;
            
            container.appendChild(petal);
        }
    }

    // --- Typing Effect ---
    let typingStarted = false;
    function startTypingEffect() {
        if (typingStarted) return;
        typingStarted = true;
        
        const typeEl = document.getElementById('typewriterText');
        const signature = document.getElementById('signature');
        if (!typeEl) return;
        
        const text = typeEl.getAttribute('data-text');
        typeEl.innerHTML = ''; // Clear the container
        
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        typeEl.appendChild(cursor);
        
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                // Insert character before the cursor
                const charNode = document.createTextNode(text.charAt(i));
                typeEl.insertBefore(charNode, cursor);
                i++;
                // Randomize typing speed a bit to look natural (30ms to 70ms)
                const speed = Math.random() * 40 + 30;
                setTimeout(typeChar, speed);
            } else {
                // Typing finished, remove cursor and show signature
                cursor.remove();
                if (signature) {
                    signature.style.opacity = '1';
                }
            }
        }
        
        // Small delay before typing starts
        setTimeout(typeChar, 300);
    }

    // --- Scroll reveal animation ---
    const fadeElements = document.querySelectorAll('.fade-in');

    const checkVisibility = () => {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top <= windowHeight * 0.85) {
                element.classList.add('visible');
                
                // (Typing effect is now triggered by clicking the image)
            }
        });
    };

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Check on load

    // Image Click Interaction
    const mainImage = document.getElementById('main-image');
    const clickHint = document.getElementById('clickHint');
    
    if (mainImage) {
        mainImage.addEventListener('click', () => {
            if (clickHint) {
                clickHint.style.opacity = '0'; // Fade out the hint
                setTimeout(() => clickHint.style.display = 'none', 500);
            }
            startTypingEffect();
        });
    }

    // Surprise Button Interaction
    const surpriseBtn = document.getElementById('surpriseBtn');
    
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', () => {
            // Hide the button
            surpriseBtn.style.display = 'none';
            
            // Show the hidden photo container
            const hiddenContainer = document.getElementById('hiddenPhotoContainer');
            if (hiddenContainer) {
                hiddenContainer.style.display = 'flex';
                // Small delay to allow the CSS transition to apply
                setTimeout(() => {
                    hiddenContainer.classList.add('show');
                }, 50);
            }
            
            // Trigger Confetti using canvas-confetti library
            const duration = 4000;
            const end = Date.now() + duration;

            (function frame() {
                // Left side
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#E6E6FA', '#967bb6', '#4B0082', '#FFD700', '#FFB6C1'] // Lavender, Purple, Gold, Pink
                });
                // Right side
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#E6E6FA', '#967bb6', '#4B0082', '#FFD700', '#FFB6C1']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        });
    }
});
