/* Papilz Foods — "still here?" engagement nudge
   Counts only ACTIVE time (tab visible + focused), persisted across visits,
   and surfaces a toast every 60s of that active time. Messages lean on
   food psychology (craving/sensory language) and a Naija voice, on the
   theory that a small, friendly nudge beats a silent, forgettable page. */

(function () {
  const STORAGE_KEY = "papilz_active_seconds";
  const MAX_TOASTS_PER_SESSION = 6; // stay a nudge, not a nag
  let toastsShown = 0;

  const MESSAGES = [
    { emoji: "🍲", html: "<b>1 minute</b> in and that jollof aroma is still calling you." },
    { emoji: "🌶️", html: "Still deciding? Your taste buds already made up their mind." },
    { emoji: "🍗", html: "The chicken lap is plated and waiting — just saying." },
    { emoji: "🥤", html: "Pro tip: a cold malt makes any plate hit different." },
    { emoji: "😋", html: "No dulling — your stomach is already placing the order." },
    { emoji: "🍽️", html: "Home-style Naija comfort, one tap away. Oya now." },
    { emoji: "🔥", html: "Still browsing? The pot is hot and ready for you." },
    { emoji: "🫓", html: "Small chops and swallow don dey wait patiently for you." },
  ];

  function getStoredSeconds() {
    const v = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    return Number.isFinite(v) ? v : 0;
  }

  function setStoredSeconds(v) {
    try {
      localStorage.setItem(STORAGE_KEY, String(v));
    } catch (e) {}
  }

  function isActive() {
    return document.visibilityState === "visible" && document.hasFocus();
  }

  function showToast(msg) {
    let el = document.getElementById("papilzEngagementToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "papilzEngagementToast";
      el.className = "papilz-engagement-toast";
      el.innerHTML = `<span class="et-emoji"></span><span class="et-text"></span>`;
      el.addEventListener("click", () => {
        if (!location.pathname.endsWith("menu.html")) {
          location.href = "menu.html";
        }
      });
      document.body.appendChild(el);
    }
    el.querySelector(".et-emoji").textContent = msg.emoji;
    el.querySelector(".et-text").innerHTML = msg.html;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => el.classList.remove("show"), 4200);
  }

  let seconds = getStoredSeconds();
  let lastMinuteMark = Math.floor(seconds / 60);

  setInterval(() => {
    if (!isActive()) return;
    seconds += 1;
    setStoredSeconds(seconds);

    const currentMinuteMark = Math.floor(seconds / 60);
    if (currentMinuteMark > lastMinuteMark && toastsShown < MAX_TOASTS_PER_SESSION) {
      lastMinuteMark = currentMinuteMark;
      toastsShown += 1;
      const msg = MESSAGES[(currentMinuteMark - 1) % MESSAGES.length];
      showToast(msg);
    } else {
      lastMinuteMark = currentMinuteMark;
    }
  }, 1000);
})();
