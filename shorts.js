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
    video: "videos/short-1-jollof.mp4",
    poster: "images/jollof-rice-with-chicken.webp",
    caption: "Jollof rice, sealed in and smoky.",
    cta: "menu",
  },
  {
    video: "videos/short-2-smallchop.mp4",
    poster: "images/small-chop.webp",
    caption: "Small chops, hot out of the fryer.",
    cta: "install",
  },
  {
    video: "videos/short-3-spaghetti.mp4",
    poster: "images/stir-fry-spaghetti.webp",
    caption: "Stir-fry spaghetti, fully loaded.",
    cta: "menu",
  },
  {
    video: "videos/short-4-chicken.mp4",
    poster: "images/chiken-fries.webp",
    caption: "Chicken, extra crispy on the edges.",
    cta: "install",
  },
  {
    video: "videos/short-5-moimoi.mp4",
    poster: "images/moimoi.webp",
    caption: "Moi moi, steamed fresh to order.",
    cta: "menu",
  },
  {
    video: "videos/short-6-dessert.mp4",
    poster: "images/icecream.webp",
    caption: "Something sweet to close it out.",
    cta: "install",
  },
];

(function () {
  const feed = document.getElementById("shortsFeed");
  const template = document.getElementById("shortCardTemplate");
  const toast = document.getElementById("shortsToast");
  const toastText = document.getElementById("shortsToastText");

  if (!feed || !template) return;

  if (!SHORTS.length) {
    feed.innerHTML = `
      <div class="shorts-empty">
        <p>No shorts yet — check back soon.</p>
      </div>`;
    return;
  }

  let userMuted = true;

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

    // Show one primary CTA per short (menu or install), matching the
    // clip's intent, so every short leads somewhere specific.
    if (short.cta === "install") {
      menuBtn.remove();
    } else {
      installBtn.remove();
    }

    if (installBtn.isConnected) {
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
    }

    muteBtn.addEventListener("click", () => {
      userMuted = !userMuted;
      video.muted = userMuted;
      muteBtn.querySelector(".icon-muted").hidden = !userMuted;
      muteBtn.querySelector(".icon-sound").hidden = userMuted;
    });

    feed.appendChild(node);
  });

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
    { threshold: [0, 0.6, 1] }
  );

  cards.forEach((card) => observer.observe(card));
})();
