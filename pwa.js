/* Papilz Foods — PWA bootstrap
   Registers the service worker and shows a branded, glassy "add to home
   screen" banner instead of the bare browser prompt. */

(function () {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    });
  }

  let deferredPrompt = null;
  const DISMISS_KEY = "papilz_install_dismissed";

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (localStorage.getItem(DISMISS_KEY)) return;
    // Give people a beat to actually see the page before asking.
    setTimeout(showInstallBanner, 4000);
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    hideInstallBanner();
  });

  function showInstallBanner() {
    if (!deferredPrompt || document.getElementById("papilzInstallBanner")) return;

    const banner = document.createElement("div");
    banner.id = "papilzInstallBanner";
    banner.className = "glass-panel papilz-install-banner";
    banner.innerHTML = `
      <img src="icons/icon-192.png" alt="" class="install-icon" />
      <div class="install-copy">
        <strong>Add Papilz to your home screen</strong>
        <span>One tap next time — no browser, no wahala.</span>
      </div>
      <div class="install-actions">
        <button type="button" class="install-btn" id="papilzInstallBtn">Add</button>
        <button type="button" class="install-dismiss" id="papilzInstallDismiss" aria-label="Dismiss">✕</button>
      </div>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add("show"));

    document.getElementById("papilzInstallBtn").addEventListener("click", async () => {
      hideInstallBanner();
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    });

    document.getElementById("papilzInstallDismiss").addEventListener("click", () => {
      localStorage.setItem(DISMISS_KEY, "1");
      hideInstallBanner();
    });
  }

  function hideInstallBanner() {
    const el = document.getElementById("papilzInstallBanner");
    if (!el) return;
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }
})();
