// ==================== NAVBAR & HAMBURGER ====================
const hamburger = document.getElementById("hamburger");
const nav = document.querySelector("nav");
const icon = document.getElementById("hamburgerIcon");

function updateHamburgerIcon(isDark) {
    if (!icon) return;

    const isOpen = nav.classList.contains("open");
    if (isOpen) {
        icon.src = isDark 
            ? "./img/hamburgerClosed_white.svg"
            : "./img/hamburgerClosed_black.svg";
    } else {
        icon.src = isDark 
            ? "./img/hamburgerOpen_white.svg"
            : "./img/hamburgerOpen_black.svg";
    }
}

if (hamburger && nav && icon) {
    hamburger.addEventListener("click", () => {
        nav.classList.toggle("open");
        const isDark = document.documentElement.classList.contains("dark");
        updateHamburgerIcon(isDark);
    });
}

// ==================== LIGHT/DARK MODE ====================
document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.documentElement;
    const toggleInput = document.querySelector('.toggle input');
    const logo = document.getElementById("site-logo");

    const updateImages = (isDark) => {
        if (logo) {
            logo.src = isDark
                ? "./img/fuhuaLogo_white.svg"
                : "./img/fuhuaLogo_black.svg";
        }
        updateHamburgerIcon(isDark);
    };

    const applyTheme = (isDark) => {
        if (isDark) {
            rootElement.classList.add('dark');
        } else {
            rootElement.classList.remove('dark');
        }
        updateImages(isDark);
    };

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    toggleInput.checked = prefersDark;
    applyTheme(prefersDark);

    toggleInput.addEventListener('input', () => {
        const isDark = toggleInput.checked;
        const toggleElement = document.querySelector('.toggle');
        const rect = toggleElement.getBoundingClientRect();

        document.documentElement.style.setProperty('--x', `${rect.left + rect.width / 2}px`);
        document.documentElement.style.setProperty('--y', `${rect.top + rect.height / 2}px`);

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                applyTheme(isDark);
            });
        } else {
            // fallback
            applyTheme(isDark);
        }
    });

});

// draggable letters
const lettersContainer = document.getElementById("lettersContainer");
const draggableLetters = document.querySelectorAll(".draggableLetter");
let isSmallScreen = window.innerWidth <= 768;

function positionLettersRandomly() {
    if (!lettersContainer || draggableLetters.length === 0) return;

    const padding = 50;
    draggableLetters.forEach(el => {
        const maxX = lettersContainer.clientWidth - el.offsetWidth - padding;
        const maxY = lettersContainer.clientHeight - el.offsetHeight - padding;
        let x = Math.random() * maxX + padding / 2;
        let y = Math.random() * maxY + padding / 2;

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    });
}
if (lettersContainer && draggableLetters.length > 0) {
    positionLettersRandomly();

    if (!isSmallScreen) {
        let active = null;
        let offsetX = 0;
        let offsetY = 0;

        draggableLetters.forEach(el => {
            el.addEventListener("mousedown", (e) => {
                active = el;
                el.style.transform = "none";

                const rect = el.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                el.style.cursor = "grabbing";
                el.style.zIndex = 1000;
            });
        });

        document.addEventListener("mousemove", (e) => {
            if (!active) return;

            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            // clamp
            x = Math.max(0, Math.min(x, lettersContainer.clientWidth - active.offsetWidth));
            y = Math.max(0, Math.min(y, lettersContainer.clientHeight - active.offsetHeight));

            active.style.left = `${x}px`;
            active.style.top = `${y}px`;
        });

        document.addEventListener("mouseup", () => {
            if (active) {
                active.style.cursor = "grab";
                active.style.zIndex = 1;
            }
            active = null;
        });
    }
}

// follow eyes https://darkcssweb.com/eyes-follow-mouse/hero-section
const pupils = document.querySelectorAll(".pupil");

document.addEventListener("mousemove", (e) => {
    pupils.forEach((pupil) => {
        const rect = pupil.getBoundingClientRect();
        const pupilCenterX = rect.left + rect.width / 2;
        const pupilCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - pupilCenterY, e.clientX - pupilCenterX);

        const maxMove = 20; // how far pupil can move inside the white of the eye

        const x = Math.cos(angle) * maxMove;
        const y = Math.sin(angle) * maxMove;

        pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// image cursor trail
const hero = document.querySelector(".hero-section");
const containerTrail = document.getElementById("trail-images");
const images = [
    "/img/sketch/sketch 1.svg",
    "/img/sketch/sketch 3.svg",
    "/img/sketch/sketch 4.svg",
    "/img/sketch/sketch 2.svg",
];
let imgIndex = 0;

if (hero && containerTrail) {
    let insideHero = false;

    hero.addEventListener("mouseenter", () => (insideHero = true));
    hero.addEventListener("mouseleave", () => (insideHero = false));

    hero.addEventListener("mousemove", (e) => {
        if (!insideHero) return;

        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        createTrailImage(x, y);
    });
}

function createTrailImage(x, y) {
    const img = document.createElement("img");
    img.src = images[imgIndex];
    img.classList.add("trail-image");

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    containerTrail.appendChild(img);

    setTimeout(() => {
        img.style.opacity = 0;
        img.style.transform = "translate(-50%, -50%) scale(3)";
    }, 10);

    setTimeout(() => img.remove(), 2000);

    imgIndex = (imgIndex + 1) % images.length;
}

// contact page
if (document.querySelector(".animated-link")) {
    document.querySelectorAll(".animated-link").forEach(link => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 10 10");
        svg.setAttribute("fill", "none");
        svg.setAttribute("aria-hidden", "true");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", "1.25");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");

        svg.appendChild(path);
        link.appendChild(svg);
    });
}

// project page
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    // If project page doesn't exist → stop
    if (!filterButtons.length || !portfolioItems.length) return;

    const filterItems = (category) => {
        portfolioItems.forEach(item => {
            const itemCategory = item.getAttribute("data-category");

            if (category === "all" || itemCategory === category) {
                item.style.display = "block";
                item.classList.add("fade-in");
            } else {
                item.style.display = "none";
                item.classList.remove("fade-in");
            }
        });
    };

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const category = btn.getAttribute("data-filter");

            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            portfolioItems.forEach(item => {
            const categories = item.getAttribute("data-category").split(" ");

            if (category === "all" || categories.includes(category)) {
                item.parentElement.style.display = "block"; 
            } else {
                item.parentElement.style.display = "none"; 
            }
            });
        });
    });

    filterItems("all");
});


// Fade-in on scroll
const fadeSections = document.querySelectorAll(
    ".project-pictures, .project-des, .project-pictures2, .docu-btn-container"
);

// Add fade-in class to each
fadeSections.forEach(section => section.classList.add("fade-in-section"));

// Create observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("fade-in-visible");
            observer.unobserve(entry.target); // animate only once
        }
    });
}, { threshold: 0.2 });

// Observe
fadeSections.forEach(section => observer.observe(section));
