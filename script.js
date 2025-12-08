// AUDIO
const correctSound = new Audio("assets/correct.wav");
const wrongSound = new Audio("assets/wrong.wav");
const celebrationSound = new Audio("assets/celebration.mp3");

// Create cookies
const flavours = [];
const flavourOptions = ["Chocolate", "Strawberry", "Vanilla"];
for (let i = 0; i < 30; i++) flavours.push(flavourOptions[i % 3]);

const cookieBox = document.getElementById("cookie-box");
let sortedCount = 0;
const totalCookies = flavours.length;

// Generate cookies in box
flavours.forEach(flavour => {
    const cookie = document.createElement("div");
    cookie.classList.add("cookie");
    cookie.draggable = true;
    cookie.dataset.flavour = flavour;

    const tooltip = document.createElement("span");
    tooltip.classList.add("flavour-tooltip");
    tooltip.textContent = flavour;

    cookie.appendChild(tooltip);
    cookie.addEventListener("dragstart", dragStart);
    cookieBox.appendChild(cookie);
});

function dragStart(e) {
    e.dataTransfer.setData("flavour", e.target.dataset.flavour);
    window.draggedCookie = e.target;
}

document.querySelectorAll(".jar").forEach(jar => {
    jar.addEventListener("dragover", e => e.preventDefault());
    jar.addEventListener("drop", dropCookie);
});

function dropCookie(e) {
    const jarFlavour = e.currentTarget.dataset.flavour;
    const cookieFlavour = e.dataTransfer.getData("flavour");
    const jarCookieArea = e.currentTarget.querySelector(".jar-cookies");

    if (jarFlavour === cookieFlavour && window.draggedCookie) {
        correctSound.currentTime = 0;
        correctSound.play();

        const newCookie = window.draggedCookie.cloneNode(true);
        newCookie.innerHTML = "";
        newCookie.draggable = false;
        newCookie.style.cursor = "default";

        jarCookieArea.appendChild(newCookie);
        window.draggedCookie.remove();
        sortedCount++;

        const countEl = e.currentTarget.querySelector(".count");
        countEl.textContent = parseInt(countEl.textContent) + 1;

        // Dynamic resize
        const jarHeight = jarCookieArea.clientHeight;
        const cookiesInJar = jarCookieArea.children;
        const cookieCount = cookiesInJar.length;
        const gap = 6; 
        const maxPerRow = Math.floor(jarCookieArea.clientWidth / 60);
        const rowsNeeded = Math.ceil(cookieCount / maxPerRow);
        let maxCookieHeight = (jarHeight - (rowsNeeded - 1) * gap) / rowsNeeded;
        maxCookieHeight = Math.min(maxCookieHeight, 60);

        for (let c of cookiesInJar) {
            c.style.width = `${maxCookieHeight}px`;
            c.style.height = `${maxCookieHeight}px`;
        }

        checkWin();
    } else {
        wrongSound.currentTime = 0;
        wrongSound.play();
    }

    window.draggedCookie = null;
}

function checkWin() {
    if (sortedCount === totalCookies) {
        celebrationSound.play();
        const duration = 3000;
        const end = Date.now() + duration;
        (function frame() {
            confetti({
                particleCount: 6,
                spread: 70,
                origin: { x: Math.random(), y: Math.random() - 0.2 }
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
        setTimeout(() => {
            alert("🎉 All cookies sorted! Amazing job! 🍪");
        }, 200);
    }
}
