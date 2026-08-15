/* Papilz Foods — Food Shorts feed
   Renders a TikTok/Reels-style vertical video feed. Each card either
   sends people to the menu or prompts them to install the app — every
   short earns its place by pointing somewhere.

   To add/change clips: edit the SHORTS array below. `video` should be
   a filename inside /videos (see videos/README.md for the exact list
   this ships with). Until that file exists, the card just shows its
   `poster` still image — nothing breaks. */

const SHORTS = [
  {
    video: "videos/short-1.mp4",
    poster: "images/jollof-rice-with-chicken.webp",
    caption: "This is the only thing that can kidnap me",
    cta: "menu",
  },
  {
    video: "videos/short-2.mp4",
    poster: "images/small-chop.webp",
    caption: "Spagetti and fish sauce",
    cta: "install",
  },
  {
    video: "videos/short-3.mp4",
    poster: "images/stir-fry-spaghetti.webp",
    caption: "Jollofff",
    cta: "menu",
  },
  {
    video: "videos/short-4.mp4",
    poster: "images/chiken-fries.webp",
    caption: "Spaggggg",
    cta: "install",
  },
];

(function () {
  const feed = document.getElementById("shortsFeed");
  const template = document.getElementById("shortCardTemplate");
  const toast = document.getElementById("shortsToast");
  const toastText = document.getElementById("shortsToastText");
  const soundPrompt = document.getElementById("soundPrompt");
  const soundEnableBtn = document.getElementById("soundEnableBtn");
  const soundSkipBtn = document.getElementById("soundSkipBtn");
  const SOUND_KEY = "papilz_shorts_sound_on";

  if (!feed || !template) return;

  if (!SHORTS.length) {
    feed.innerHTML = `
      <div class="shorts-empty">
        <p>No shorts yet — check back soon.</p>
      </div>`;
    return;
  }

  // Sound stays off by default (browsers block unmuted autoplay
  // without a user gesture anyway). If someone already said yes on a
  // past visit, start unmuted; otherwise we'll ask.
  let userMuted = localStorage.getItem(SOUND_KEY) !== "1";
  const muteButtons = [];

  SHORTS.forEach((short) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".short-card");
    const video = node.querySelector(".short-video");
    const caption = node.querySelector(".short-caption");
    const menuBtn = node.querySelector(".short-cta-menu");
    const installBtn = node.querySelector(".short-cta-install");
    const muteBtn = node.querySelector(".short-mute");

    video.src = short.video;
    video.poster = short.poster;
    caption.textContent = short.caption;

    // Show one primary CTA per short. Shorts tagged "install" push the
    // install prompt — but for people who already have the app
    // installed, that CTA is dead weight, so swap it for a menu link
    // instead (worded differently from the "menu" shorts' CTA so the
    // feed doesn't read as repetitive).
    const alreadyInstalled = window.PapilzPWA && window.PapilzPWA.isInstalled();
    const wantsInstall = short.cta === "install" && !alreadyInstalled;

    if (wantsInstall) {
      menuBtn.remove();
      installBtn.addEventListener("click", async () => {
        if (!window.PapilzPWA) return;
        const result = await window.PapilzPWA.triggerInstall();
        if (result === "accepted") {
          showToast("Installed! Find Papilz on your home screen.");
        } else if (result === "installed") {
          showToast("Papilz is already installed.");
        } else if (result === "ios") {
          showToast("Tap Share, then “Add to Home Screen.”");
        } else if (result === "unavailable") {
          showToast("Keep browsing a moment, then try again.");
        }
      });
    } else {
      installBtn.remove();
      if (short.cta === "install" && alreadyInstalled) {
        const arrowSvg = menuBtn.querySelector("svg").outerHTML;
        menuBtn.innerHTML = "Checkout the menu" + arrowSvg;
      }
    }

    muteBtn.addEventListener("click", () => {
      userMuted = !userMuted;
      video.muted = userMuted;
      syncMuteIcon(muteBtn, userMuted);
    });
    syncMuteIcon(muteBtn, userMuted);
    muteButtons.push(muteBtn);

    feed.appendChild(node);
  });

  function syncMuteIcon(btn, muted) {
    btn.querySelector(".icon-muted").hidden = !muted;
    btn.querySelector(".icon-sound").hidden = muted;
  }

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  // Play only the short that's actually on screen; pause the rest so
  // we're not burning battery/data on off-screen video.
  const cards = Array.from(feed.querySelectorAll(".short-card"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector(".short-video");
        if (!video) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          video.muted = userMuted;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: [0, 0.6, 1] },
  );

  cards.forEach((card) => observer.observe(card));

  // ---- Ask permission to turn sound on ----
  // Every visit where sound isn't already enabled, ask once up front
  // (rather than leaving people to discover the per-video mute icon).
  if (userMuted && soundPrompt) {
    soundPrompt.hidden = false;

    soundEnableBtn?.addEventListener("click", () => {
      localStorage.setItem(SOUND_KEY, "1");
      userMuted = false;
      muteButtons.forEach((btn) => syncMuteIcon(btn, false));
      soundPrompt.hidden = true;

      // This click is a user gesture, so unmute+play the short
      // currently in view right away instead of waiting for the next
      // intersection change.
      const active = cards.find((c) => {
        const rect = c.getBoundingClientRect();
        return rect.top >= -10 && rect.top < window.innerHeight * 0.5;
      });
      const activeVideo = active?.querySelector(".short-video");
      if (activeVideo) {
        activeVideo.muted = false;
        activeVideo.play().catch(() => {});
      }
    });

    soundSkipBtn?.addEventListener("click", () => {
      soundPrompt.hidden = true;
    });
  }
})();
