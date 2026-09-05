// --- TVOJE ODKAZY ---
const animeGifs = [
    "https://media.tenor.com/uRlxzRNgp2MAAAAj/anime-girl.gif", "https://media1.tenor.com/m/J63bVPkM9-kAAAAd/cute-anime.gif",
    "https://media1.tenor.com/m/VD6vq8DNJx8AAAAC/kiska-sempai-shy-anime-girl.gif", "https://media1.tenor.com/m/Ve5uZMc8rnkAAAAC/kiska-sempai-art.gif",
    "https://media1.tenor.com/m/rlm5yWQY5l0AAAAC/reze-ok.gif", "https://media1.tenor.com/m/NGn8YUN00aMAAAAC/anime-girl-anime.gif",
    "https://media1.tenor.com/m/JbnLKar05tAAAAAC/anime-girl-light-blue-hair-anime.gif", "https://media1.tenor.com/m/QdD0CGh4yukAAAAC/greeting.gif",
    "https://media1.tenor.com/m/0Xax55S_ob0AAAAd/renako-amaori.gif", "https://media1.tenor.com/m/Gco2sDG_hFsAAAAd/citrus.gif",
    "https://media1.tenor.com/m/fYyxgOn8CBgAAAAC/yuri-doki-doki-literature-club.gif", "https://media1.tenor.com/m/m2BWNqQVFMAAAAAd/black-rock-shooter-brs.gif",
    "https://media1.tenor.com/m/2ZuUWp5LDfIAAAAC/konata-lucky-star.gif", "https://media1.tenor.com/m/oYkKLRrDIrgAAAAC/yuki-suou-yuki.gif",
    "https://media1.tenor.com/m/yiTklrVPiqkAAAAC/touhou-touhou-project.gif", "https://media1.tenor.com/m/gc4ws16CrTYAAAAC/reimu-touhou.gif",
    "https://media.tenor.com/gVPazpEOQ3kAAAAi/chika.gif", "https://media.tenor.com/c7KPbTAW59YAAAAi/yuri-ddlc-doki-doki-literature-club.gif"
];

const catGifs = [
    "https://media.tenor.com/GQAsycjoZG8AAAAi/scuba-scuba-cat.gif", "https://media.tenor.com/lfDATg4Bhc0AAAAM/happy-cat.gif",
    "https://media.tenor.com/LK628grSBnEAAAA1/cat-ai-pufferfish-cat.webp", "https://media.tenor.com/OF7rTi4MRhsAAAAM/cat-horse.gif",
    "https://media.tenor.com/9DYAxxYTUHQAAAAM/disturbed-cat-concerned-cat.gif", "https://media.tenor.com/BHMcmsHger8AAAAM/cat-axolotl.gif",
    "https://media.tenor.com/ihzUC8LA1CgAAAAm/komik.webp", "https://media.tenor.com/7WpdbjmyJ4gAAAAM/boomb-cat-boomb.gif",
    "https://media.tenor.com/MlzrX_X92aoAAAAM/cat-ai.gif", "https://media.tenor.com/8AtvqiYPm04AAAAM/cat-leaf.gif",
    "https://media.tenor.com/xqghrtvGNC8AAAAM/cat-cat-meme.gif", "https://media.tenor.com/YtxirAHPxrgAAAA1/boom-boom-cat-boom.webp",
    "https://media.tenor.com/6IKOpbGWD_QAAAA1/cat-with-wiered-and-cute-reactions-cat.webp", "https://media.tenor.com/ieneG2R95R4AAAAM/cat-cat-ai-instrument.gif",
    "https://media.tenor.com/AfIZuSqX0b0AAAA1/cat-smiling.webp", "https://media.tenor.com/8Iy32NCoL0AAAAA1/cat-cat-bread.webp",
    "https://media.tenor.com/5wlk_Psm6bAAAAAM/flying-cat.gif", "https://media.tenor.com/p-wIO64HN5cAAAAM/wake-up.gif",
    "https://media.tenor.com/eKcXzYB0Eu8AAAAM/angry.gif", "https://media.tenor.com/3OZtqYq-9UsAAAA1/tirbouchonchokbar.webp"
];

const otherGifs = [
    "https://media.tenor.com/GfUvHQKP1kEAAAA1/boykisser-cute.webp", "https://media.tenor.com/3DzhsHs_8G8AAAAM/boykisser-spin.gif",
    "https://media.tenor.com/V5QTscnErhwAAAAM/mauzymice-mauzy.gif", "https://media.tenor.com/p85fggAs7SgAAAAM/boy-kisser-kiss.gif",
    "https://media.tenor.com/Lg7hJzQKoxYAAAAM/its-for-me-boykisser.gif", "https://media.tenor.com/fW2_TC-J-1EAAAAm/letter-h-dance.webp",
    "https://media.tenor.com/pprxIr3IzuQAAAAM/grapheme-letter-h.gif", "https://media.tenor.com/W46eoMWLAHwAAAAm/h-the-letter-h.webp",
    "https://media.tenor.com/PNk5zda9EJgAAAAm/i-miss-you-menhara-chan.webp", "https://media.tenor.com/yMOaXav8HkAAAAAM/cement-mixer-dont-tell-anyone.gif",
    "https://media.tenor.com/px5hkjEaCwwAAAAM/i-eat-cement.gif", "https://media.tenor.com/AHckWp25mKgAAAA1/changani-indian.webp",
    "https://media.tenor.com/mj6dBHTErHEAAAAM/ice4432-indian.gif"
];

const allGifs = [...animeGifs, ...catGifs, ...otherGifs];
const slideContainer = document.getElementById('slide-container');
const pulsingText = document.getElementById('pulsing-text');
let currentIntervals = []; // Pro snadné čištění časovačů

// --- GLOBÁLNÍ FUNKCE ---
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function clearSlide() {
    // Vypne všechny běžící smyčky z předchozího slajdu
    currentIntervals.forEach(clearInterval);
    currentIntervals = [];
    slideContainer.innerHTML = '';
    document.body.className = ''; 
    pulsingText.classList.add('hidden');
}

// --- JEDNOTLIVÉ SLAJDY ---

// Fáze 0: Matrix úvod (běží jen jednou na začátku)
function runMatrix() {
    const textDiv = document.createElement('div');
    textDiv.className = 'matrix-text';
    slideContainer.appendChild(textDiv);
    
    const msg = "> INICIOVÁNÍ PROTOKOLU ZKÁZY...\n> TARGET LOCKED:\n> Tomáš Pospíšil je blbý";
    let i = 0;
    const typer = setInterval(() => {
        textDiv.textContent += msg[i];
        i++;
        if (i >= msg.length) {
            clearInterval(typer);
            setTimeout(nextSlide, 1500); // Počká 1.5s a spustí peklo
        }
    }, 50);
}

// Fáze 1: Hadí Grid (4x4, postupně se objevují)
function runSnakeGrid(gifArray) {
    document.body.style.backgroundColor = "black";
    const grid = document.createElement('div');
    grid.className = 'grid-container';
    
    const cells = [];
    for(let i=0; i<16; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        const img = document.createElement('img');
        img.src = getRandomItem(gifArray);
        img.className = 'grid-img';
        cell.appendChild(img);
        grid.appendChild(cell);
        cells.push(img);
    }
    slideContainer.appendChild(grid);

    // Pořadí pro hada (Zleva doprava, o řádek níž zprava doleva atd.)
    const snakePath = [0, 1, 2, 3, 7, 6, 5, 4, 8, 9, 10, 11, 15, 14, 13, 12];
    let step = 0;
    
    const snakeInterval = setInterval(() => {
        if(step < 16) {
            cells[snakePath[step]].classList.add('visible');
            step++;
        } else {
            // Až se zaplní, začnou se měnit náhodně
            cells[Math.floor(Math.random()*16)].src = getRandomItem(gifArray);
        }
    }, 100);
    currentIntervals.push(snakeInterval);
}

// Fáze 2: Totální záplava na obrazovce s blikáním
function runFlood(gifArray) {
    document.body.classList.add('epilepsy-bg');
    pulsingText.classList.remove('hidden'); // Zapne text "Tomáš Pospíšil..."

    const floodInterval = setInterval(() => {
        const img = document.createElement('img');
        img.src = getRandomItem(gifArray);
        img.className = 'absolute-chaos ' + (Math.random() > 0.5 ? 'spin-fast' : 'shake-fast');
        
        const size = Math.random() * 300 + 100;
        img.style.width = size + 'px';
        img.style.left = (Math.random() * window.innerWidth - size/2) + 'px';
        img.style.top = (Math.random() * window.innerHeight - size/2) + 'px';
        
        slideContainer.appendChild(img);
    }, 80); // Extrémně rychlý spawn
    currentIntervals.push(floodInterval);
}

// Fáze 3: Obří rotující nesmysly uprostřed
function runGiantChaos() {
    pulsingText.classList.remove('hidden');
    
    const giantInterval = setInterval(() => {
        const img = document.createElement('img');
        img.src = getRandomItem(otherGifs);
        img.className = 'absolute-chaos spin-fast';
        img.style.width = '80vw';
        img.style.height = '80vh';
        img.style.left = '10vw';
        img.style.top = '10vh';
        
        slideContainer.appendChild(img);
        
        setTimeout(() => img.remove(), 400); // Hned to zmizí do rytmu
    }, 400);
    currentIntervals.push(giantInterval);
}

// --- ENGINE PRO SPRÁVU SLAJDŮ ---
const slides = [
    () => runSnakeGrid(animeGifs),   // Slajd 1: Anime had
    () => runFlood(catGifs),         // Slajd 2: Záplava koček s textem
    () => runSnakeGrid(catGifs),     // Slajd 3: Kočičí had
    () => runGiantChaos(),           // Slajd 4: Obří točící se H a boykissové
    () => runFlood(allGifs),         // Slajd 5: Ultimátní mix všeho
    () => runSnakeGrid(otherGifs)    // Slajd 6: Had nesmyslů
];

let slideIndex = 0;

function nextSlide() {
    clearSlide();
    
    // Spustí aktuální slajd
    slides[slideIndex]();
    
    // Posune index pro příště, nebo ho resetuje (smyčka)
    slideIndex++;
    if (slideIndex >= slides.length) slideIndex = 0;
    
    // Přepne slajd každých 5 sekund (5000 ms)
    setTimeout(nextSlide, 5000);
}

// ==========================================
// --- JEDINÝ POVOLENÝ SPOUŠTĚČ NA KONCI ---
// ==========================================
let started = false;

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Zastaví obnovení stránky
    
    // Pojistka proti vícenásobnému spuštění
    if (started) return;
    started = true;
    
    // 1. Schová přihlášení a odkryje plátno
    document.getElementById('login-container').classList.add('hidden');
    slideContainer.classList.remove('hidden');

    // 2. Spustí hudbu s ošetřením pro Chrome
    const audio = document.getElementById('bg-music');
    audio.volume = 1.0;
    audio.play().catch(error => {
        console.log("Autoplay zablokován prohlížečem, pokračujeme bez audia.");
    });

    // 3. Spustí Matrix intro přesně 1x
    runMatrix();
});
