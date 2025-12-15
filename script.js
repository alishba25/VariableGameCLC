// --- Audio System (Synthesizer fallback so it works without files) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playSound(type) {
    // If you have files, uncomment these lines and remove the synth code below:
    // if(type === 'pop') new Audio('assets/pop.wav').play();
    // if(type === 'win') new Audio('assets/win.mp3').play();
    
    // Synth Fallback
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.2);
        osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
    }
}

// --- Game Logic ---

const totalCookies = 30; // Number of cookies to generate
const cookieBox = document.getElementById("cookie-box");
let sortedCount = 0;

// Initialize Game
function initGame() {
    for (let i = 0; i < totalCookies; i++) {
        createCookie();
    }
}

function createCookie() {
    const cookie = document.createElement("div");
    cookie.classList.add("cookie");
    
    // Click Event
    cookie.addEventListener("click", function() {
        // Prevent double clicking
        if (cookie.classList.contains("active") || cookie.classList.contains("sorted")) return;

        // 1. Enlarge & Select
        cookie.classList.add("active");
        playSound('pop');

        // 2. Generate Random Number (0-3)
        const randomJarIndex = Math.floor(Math.random() * 4);
        cookie.textContent = randomJarIndex; // Show number

        // 3. Move to Jar after delay
        setTimeout(() => {
            moveCookieToJar(cookie, randomJarIndex);
        }, 600); // 0.6 second delay to read the number
    });

    cookieBox.appendChild(cookie);
}

function moveCookieToJar(cookieElement, jarIndex) {
    const jar = document.getElementById(`jar-${jarIndex}`);
    const jarContainer = jar.querySelector('.jar-cookies');
    const countSpan = jar.querySelector('.count');

    // Visual transition: Remove from box, create clone in jar
    // We use a clone to make it look like it arrived there cleanly
    cookieElement.style.visibility = "hidden"; // Hide original in box
    cookieElement.classList.add("sorted");

    const newCookie = document.createElement("div");
    newCookie.classList.add("cookie");
    // We don't copy the textContent because inside the jar they are just cookies
    
    jarContainer.appendChild(newCookie);

    // Update Count
    let currentCount = parseInt(countSpan.textContent);
    countSpan.textContent = currentCount + 1;

    sortedCount++;
    checkWin();
}

function checkWin() {
    if (sortedCount === totalCookies) {
        setTimeout(() => {
            playSound('win');
            triggerConfetti();
            // Custom alert style
            const h1 = document.querySelector('h1');
            h1.textContent = "🎉 All sorted! Great job! 🍪";
            h1.style.color = "#d84315";
        }, 500);
    }
}

function triggerConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            spread: 70,
            origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

// Start
initGame();