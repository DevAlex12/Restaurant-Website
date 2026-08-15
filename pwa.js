/* Papilz Foods — PWA bootstrap
   Registers the service worker and shows a branded, glassy "install"
   banner instead of the bare browser prompt. Also exposes
   window.PapilzPWA so other pages (e.g. Food Shorts) can trigger the
   same install flow from their own buttons. */

(function () {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    });
  }

  let deferredPrompt = null;
  const DISMISS_KEY = "papilz_install_dismissed";

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  function isIOS() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  }

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
        <strong>Install Papilz</strong>
        <span>One tap next time — no browser, no wahala.</span>
      </div>
      <div class="install-actions">
        <button type="button" class="install-btn" id="papilzInstallBtn">Install</button>
        <button type="button" class="install-dismiss" id="papilzInstallDismiss" aria-label="Dismiss">✕</button>
      </div>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add("show"));

    document.getElementById("papilzInstallBtn").addEventListener("click", () => {
      hideInstallBanner();
      triggerInstall();
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

  /* Fires the real, native install prompt. Returns a promise resolving
     to "accepted" | "dismissed" | "unavailable" | "ios" | "installed"
     so callers (e.g. the Food Shorts CTAs) can react appropriately. */
  async function triggerInstall() {
    if (isStandalone()) return "installed";
    if (!deferredPrompt) {
      return isIOS() ? "ios" : "unavailable";
    }
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return choice.outcome === "accepted" ? "accepted" : "dismissed";
  }

  window.PapilzPWA = {
    triggerInstall,
    isInstallable: () => !!deferredPrompt,
    isInstalled: isStandalone,
    isIOS,
  };
})();
