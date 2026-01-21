// --- 1. FLASHLIGHT LOGIC ---
const flashlight = document.getElementById("flashlight");
const body = document.body;

// Mouse hareketi ile feneri güncelle
document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  flashlight.style.setProperty("--x", x + "px");
  flashlight.style.setProperty("--y", y + "px");
});

// --- 2. KONAMI CODE LOGIC ---
const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a"
];
let keyIndex = 0;

// Elements
const panel = document.getElementById("panel");
const statusText = document.getElementById("status-text");
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");
const successMsg = document.getElementById("successMessage");

window.addEventListener("keydown", (e) => {
  if (
    e.key === konamiCode[keyIndex] ||
    e.key.toLowerCase() === konamiCode[keyIndex]
  ) {
    keyIndex++;

    // Feedback: Doğru tuşa basıldığında fener parlasın ve panel oynasın
    flashlight.style.background = `radial-gradient(circle ${
      330 + keyIndex * 10
    }px at var(--x, 50%) var(--y, 50%), transparent 10%, rgba(20,50,20,0.5) 30%, rgba(0,0,0,0.95) 50%, rgba(0,0,0,1) 80%)`;

    panel.style.transform = `translate(${Math.random() * 6 - 3}px, ${
      Math.random() * 6 - 3
    }px)`;

    if (keyIndex === konamiCode.length) {
      initiateSequence(); // FİNAL BAŞLASIN
      keyIndex = 0;
    }
  } else {
    // Hata durumu
    keyIndex = 0;
    panel.style.transform = "translate(0,0)";
    // Feneri resetle
    flashlight.style.background = ``;
  }
});

// --- 3. CINEMATIC SEQUENCE (FİNAL SAHNESİ) ---
function initiateSequence() {
  // SAHNE 1: KIRMIZI ALARM (0. saniye)
  // Fener kırmızı olur, titrer. Panel çıldırır. Yazı bozulur.
  flashlight.classList.add("emergency-mode");
  panel.classList.add("shake-hard");
  scrambleText(statusText, "BREACH DETECTED");

  // SAHNE 2: KARARTMA (2.2 saniye)
  // Her şey kararır. Panik biter, sessizlik başlar.
  setTimeout(() => {
    // Panel yok olur
    panel.style.transition = "all 1.5s ease";
    panel.style.opacity = "0";
    panel.style.transform = "scale(0.8) rotate(5deg)";

    // Fener kapanır
    flashlight.classList.remove("emergency-mode");
    flashlight.style.transition = "opacity 2s ease";
    flashlight.style.opacity = "0";

    // Arkaplan tam siyah
    body.style.background = "#000";
    body.style.cursor = "none";
  }, 2200);

  // SAHNE 3: UYANIŞ (4.5 saniye)
  // Matrix yağmuru silik bir şekilde başlar, sonra belirginleşir.
  setTimeout(() => {
    canvas.style.display = "block";
    resizeCanvas();
    startMatrixRain();

    // Yavaşça görünür yap
    setTimeout(() => {
      canvas.style.opacity = "1";
    }, 100);

    // Mouse geri gelsin
    body.style.cursor = "default";
  }, 4500);

  // SAHNE 4: MESAJ (6.0 saniye)
  // Final mesajı ekrana gelir.
  setTimeout(() => {
    successMsg.innerHTML = `
                    <h1 class="huge-text">ACCESS GRANTED</h1>
                    <p style="font-size:1.5rem; letter-spacing:8px; margin:40px 0; opacity:0.8; color:#fff;">
                        welcome back, neo.
                    </p>
                    <button onclick="location.reload()">TAKE THE RED PILL</button>
                `;
    successMsg.classList.add("overlay-visible");
    successMsg.style.opacity = "1";
    successMsg.style.transform = "scale(1)";
  }, 6000);
}

// Yardımcı: Yazı Karıştırma Efekti
function scrambleText(element, finalString) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*01";
  let iterations = 0;
  const interval = setInterval(() => {
    element.innerText = finalString
      .split("")
      .map((letter, index) => {
        if (index < iterations) return finalString[index];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join("");

    if (iterations >= finalString.length) clearInterval(interval);
    iterations += 1 / 2;
  }, 50);
}

// --- 4. MATRIX RAIN ---
let matrixInterval;
const katakana =
  "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const nums = "01";
const alphabet = katakana + latin + nums;

let fontSize = 14;
let columns;
let drops = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  fontSize = 14;
  columns = canvas.width / fontSize;
  drops = [];
  for (let x = 0; x < columns; x++) drops[x] = 1;
}
window.addEventListener("resize", resizeCanvas);

function startMatrixRain() {
  if (matrixInterval) clearInterval(matrixInterval);

  function draw() {
    // İz bırakma efekti için siyah, yarı saydam dikdörtgen çiz
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0"; // Yeşil Yazı
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
        drops[i] = 0;
      drops[i]++;
    }
  }
  matrixInterval = setInterval(draw, 33);
}
