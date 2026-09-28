/* =========================
   START STORY
========================= */

const backgroundVideoSources = [
    "assets/WhatsApp Video 2026-09-28 at 11.42.21.mp4",
    "assets/WhatsApp Video 2026-09-28 at 11.42.24.mp4"
];

const emailConfig = {
    serviceId: "",
    templateId: "",
    publicKey: "",
    recipientEmail: ""
};

let backgroundVideoIndex = 0;
const attemptedBackgroundVideoSources = new Set();

function playBackgroundVideo(index) {

    const video = document.getElementById("backgroundVideo");
    const source = backgroundVideoSources[index];

    if (!video || attemptedBackgroundVideoSources.has(source)) {
        return;
    }

    backgroundVideoIndex = index;
    attemptedBackgroundVideoSources.add(source);
    video.src = source;
    video.play().catch(() => {
        if (attemptedBackgroundVideoSources.size < backgroundVideoSources.length) {
            playBackgroundVideo((index + 1) % backgroundVideoSources.length);
        }
    });

}

function startBackgroundVideo() {

    const video = document.getElementById("backgroundVideo");

    if (!video) {
        return;
    }

    video.muted = true;
    video.playsInline = true;

    video.addEventListener("ended", () => {
        attemptedBackgroundVideoSources.clear();
        backgroundVideoIndex =
            (backgroundVideoIndex + 1) % backgroundVideoSources.length;

        playBackgroundVideo(backgroundVideoIndex);
    });

    video.addEventListener("error", () => {
        if (attemptedBackgroundVideoSources.size < backgroundVideoSources.length) {
            playBackgroundVideo((backgroundVideoIndex + 1) % backgroundVideoSources.length);
        }
    });

    playBackgroundVideo(backgroundVideoIndex);

}

function startMusic() {

    const song = document.getElementById("ourSong");

    if (!song || !song.paused) {
        return;
    }

    const playback = song.play();

    if (playback !== undefined) {
        playback.catch(() => {});
    }

}

document.addEventListener("DOMContentLoaded", () => {
    startBackgroundVideo();
    startMusic();
}, { once: true });

function startStory() {

    startMusic();

    const opening = document.getElementById("opening");
    const story = document.getElementById("story");

    opening.style.display = "none";
    story.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================
   YES BUTTON
========================= */

function sayYes() {

    const story = document.getElementById("story");
    const yesScreen = document.getElementById("yes-screen");

    story.style.display = "none";
    yesScreen.style.display = "flex";

    createExplosion();
    sendLovelyEmail();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================
   MOVING "LET ME THINK"
========================= */

function moveButton(button) {

    const messages = [
        "Are you sure? 🥺",
        "Think again 😭",
        "Big Smoke won't approve 😂",
        "Come onnn ❤️",
        "I know you want to 😌",
        "One more chance? 🥹"
    ];

    const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

    button.innerText = randomMessage;

    const x =
        Math.random() * 180 - 90;

    const y =
        Math.random() * 150 - 75;

    button.style.transform =
        `translate(${x}px, ${y}px)`;

}


/* =========================
   FLOATING HEARTS
========================= */

function createHeart() {

    const heart = document.createElement("div");

    heart.classList.add("heart");

    const hearts = ["❤️", "💕", "💗", "💖", "💘"];

    heart.innerHTML =
        hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left =
        Math.random() * 100 + "vw";

    heart.style.animationDuration =
        (5 + Math.random() * 5) + "s";

    heart.style.fontSize =
        (12 + Math.random() * 20) + "px";

    document.body.appendChild(heart);

    setTimeout(() => {

        heart.remove();

    }, 10000);

}


setInterval(createHeart, 900);


/* =========================
   YES CELEBRATION
========================= */

function createExplosion() {

    for (let i = 0; i < 60; i++) {

        const heart = document.createElement("div");

        heart.classList.add("heart");

        heart.innerHTML = "❤️";

        heart.style.left =
            Math.random() * 100 + "vw";

        heart.style.bottom =
            Math.random() * 30 + "vh";

        heart.style.fontSize =
            (15 + Math.random() * 30) + "px";

        heart.style.animationDuration =
            (2 + Math.random() * 4) + "s";

        document.body.appendChild(heart);

        setTimeout(() => {

            heart.remove();

        }, 6000);

    }

}

function sendLovelyEmail() {

    if (Object.values(emailConfig).some(value => !value)) {
        console.warn("Set the EmailJS service, template, public key, and recipient in emailConfig to enable the email.");
        return;
    }

    fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            service_id: emailConfig.serviceId,
            template_id: emailConfig.templateId,
            user_id: emailConfig.publicKey,
            template_params: {
                to_email: emailConfig.recipientEmail,
                subject: "She said yes ❤️",
                message: "Hey Em,\n\nYou said yes, and I can't stop smiling. I'm so grateful for you and excited for all the little moments still ahead of us.\n\nBobo Shanti, Obroni, Fremps... I'm just happy it's you. ❤️\n\nWith love"
            }
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error(`EmailJS returned ${response.status}`);
        }
    }).catch(error => {
        console.error("The lovely email could not be sent:", error);
    });

}