// ======================================================================
// PAPILZ FOODS — CART / CHECKOUT (Cart → Details → Confirm → WhatsApp)
// ======================================================================

const WHATSAPP_NUMBER = "2348138076639";

// Every plate/meal is packed to go, so a small packaging fee is added
// automatically per plate (not per scoop/add-on). Kept as one constant
// so menu.js and cart.js agree even though they're loaded on different
// pages and don't share scope.
const TAKEAWAY_FEE_PER_PLATE = 200;

const naira = (n) => `₦${n.toLocaleString("en-NG")}`;

// ----- SELECTORS -----
const backBtn = document.getElementById("backBtn");
const stepEls = document.querySelectorAll(".step");
const panels = [
  document.getElementById("panelCart"),
  document.getElementById("panelDetails"),
  document.getElementById("panelConfirm"),
];

const cartItemsEl = document.getElementById("cartItems");
const totalAmountEl = document.getElementById("totalAmount");
const ticketEl = document.getElementById("ticket");
const emptyCartEl = document.getElementById("emptyCart");
const clearCartBtn = document.getElementById("clearCartBtn");
const ticketDateEl = document.getElementById("ticketDate");
const subtotalAmountEl = document.getElementById("subtotalAmount");
const takeawayFeeLabelEl = document.getElementById("takeawayFeeLabel");
const takeawayFeeAmountEl = document.getElementById("takeawayFeeAmount");

const custNameEl = document.getElementById("custName");
const custPhoneEl = document.getElementById("custPhone");
const locationBox = document.getElementById("locationBox");
const deliveryLocationEl = document.getElementById("deliveryLocation");
const detailsWarning = document.getElementById("detailsWarning");

const confirmRowsEl = document.getElementById("confirmRows");
const confirmTotalEl = document.getElementById("confirmTotal");
const confirmDateEl = document.getElementById("confirmDate");

const bottomLabel = document.getElementById("bottomLabel");
const bottomTotalEl = document.getElementById("bottomTotal");
const primaryCta = document.getElementById("primaryCta");

// ----- STATE -----
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let step = 0;
let selectedMethod = "";

function persistCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function lineTotal(item) {
  const addonsTotal = (item.addons || []).reduce((s, a) => s + a.price * a.qty, 0);
  return (item.unitBase + addonsTotal) * item.qty;
}

function plateCount() {
  return cart.reduce((sum, it) => sum + it.qty, 0);
}

function itemsSubtotal() {
  return cart.reduce((sum, it) => sum + lineTotal(it), 0);
}

function takeawayFeeTotal() {
  return plateCount() * TAKEAWAY_FEE_PER_PLATE;
}

function cartTotal() {
  return itemsSubtotal() + takeawayFeeTotal();
}

function formattedDate() {
  return new Date().toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}

// ======================================================================
// STEP 0 — CART
// ======================================================================

function renderCart() {
  const isEmpty = cart.length === 0;
  ticketEl.hidden = isEmpty;
  clearCartBtn.hidden = isEmpty;
  emptyCartEl.hidden = !isEmpty;

  if (isEmpty) {
    totalAmountEl.textContent = "₦0";
    subtotalAmountEl.textContent = "₦0";
    takeawayFeeAmountEl.textContent = "₦0";
    updateBottomBar();
    return;
  }

  ticketDateEl.textContent = formattedDate();

  cartItemsEl.innerHTML = cart
    .map((item, i) => {
      // Add-on lines always describe ONE plate as configured — the ×N plate
      // count is applied once, at the whole-plate level (the qty stepper and
      // the line total below), never re-applied per ingredient. That keeps
      // "2 plates, each with 2 scoops" from ever reading as "4 scoops".
      const addonsHtml = (item.addons || [])
        .map(
          (a) => `
          <div class="addon-line">
            <span>+ ${a.name} x${a.qty}</span>
            <span class="leader"></span>
            <span class="addon-line-price">${naira(a.price * a.qty)}</span>
          </div>`
        )
        .join("");

      const plateNote = item.qty > 1 ? ` · ×${item.qty} plates` : "";

      return `
        <div class="cart-line" data-index="${i}">
          <div class="cart-line-main">
            <span class="cart-line-name">${item.title}</span>
            <span class="leader"></span>
            <span class="cart-line-price">${naira(lineTotal(item))}</span>
          </div>
          <div class="cart-line-qty">${item.unitBase > 0 ? `${naira(item.unitBase)} base${item.addons?.length ? " + add-ons" : ""}` : "Custom-built plate"}${plateNote}</div>
          ${item.addons?.length ? `<div class="cart-line-addons">${addonsHtml}</div>` : ""}
          ${item.qty > 1 ? `<div class="cart-line-multiplier">Each plate above × ${item.qty} = ${naira(lineTotal(item))} total</div>` : ""}
          <div class="line-actions">
            <div class="line-step">
              <button class="stepbtn line-minus" aria-label="Decrease quantity">−</button>
              <span class="quantity">${item.qty}</span>
              <button class="stepbtn line-plus" aria-label="Increase quantity">+</button>
            </div>
            <button class="line-remove" data-index="${i}">Remove</button>
          </div>
        </div>`;
    })
    .join("");

  totalAmountEl.textContent = naira(cartTotal());
  subtotalAmountEl.textContent = naira(itemsSubtotal());
  const plates = plateCount();
  takeawayFeeLabelEl.textContent = `Takeaway packaging (₦${TAKEAWAY_FEE_PER_PLATE} × ${plates} plate${plates === 1 ? "" : "s"})`;
  takeawayFeeAmountEl.textContent = naira(takeawayFeeTotal());
  attachLineEvents();
  updateBottomBar();
}

function attachLineEvents() {
  cartItemsEl.querySelectorAll(".cart-line").forEach((line) => {
    const i = Number(line.dataset.index);

    line.querySelector(".line-plus").addEventListener("click", () => {
      cart[i].qty++;
      persistCart();
      renderCart();
    });

    line.querySelector(".line-minus").addEventListener("click", () => {
      if (cart[i].qty > 1) {
        cart[i].qty--;
        persistCart();
        renderCart();
      }
    });

    line.querySelector(".line-remove").addEventListener("click", () => {
      cart.splice(i, 1);
      persistCart();
      renderCart();
    });
  });
}

clearCartBtn.addEventListener("click", () => {
  cart = [];
  persistCart();
  renderCart();
});

// ======================================================================
// STEP 1 — DETAILS
// ======================================================================

document.querySelectorAll("input[name='method']").forEach((radio) => {
  radio.addEventListener("change", () => {
    selectedMethod = radio.value;
    locationBox.classList.toggle("hidden", selectedMethod !== "delivery");
    detailsWarning.classList.add("hidden");
  });
});

function validateDetails() {
  const name = custNameEl.value.trim();
  const phone = custPhoneEl.value.trim();

  if (!name || !phone) {
    detailsWarning.textContent = "Enter your name and phone number.";
    detailsWarning.classList.remove("hidden");
    return false;
  }
  if (!selectedMethod) {
    detailsWarning.textContent = "Choose pickup or delivery.";
    detailsWarning.classList.remove("hidden");
    return false;
  }
  if (selectedMethod === "delivery" && !deliveryLocationEl.value.trim()) {
    detailsWarning.textContent = "Enter your delivery address.";
    detailsWarning.classList.remove("hidden");
    return false;
  }
  detailsWarning.classList.add("hidden");
  return true;
}

// ======================================================================
// STEP 2 — CONFIRM
// ======================================================================

function renderConfirm() {
  confirmDateEl.textContent = formattedDate();

  const rows = [
    { k: "Name", v: custNameEl.value.trim() },
    { k: "Phone", v: custPhoneEl.value.trim() },
    { k: "Method", v: selectedMethod === "delivery" ? "Delivery" : "Pickup" },
  ];
  if (selectedMethod === "delivery") {
    rows.push({ k: "Address", v: deliveryLocationEl.value.trim() });
  }
  rows.push({ k: "Items", v: `${cart.reduce((s, i) => s + i.qty, 0)}` });
  rows.push({ k: "Subtotal", v: naira(itemsSubtotal()) });
  rows.push({ k: `Takeaway (${plateCount()} plate${plateCount() === 1 ? "" : "s"})`, v: naira(takeawayFeeTotal()) });

  confirmRowsEl.innerHTML = rows
    .map((r) => `<div class="confirm-row"><span class="k">${r.k}</span><span class="v">${r.v}</span></div>`)
    .join("");

  confirmTotalEl.textContent = naira(cartTotal());
}

function buildWhatsAppMessage() {
  let message = "🧾 *New Order — Papilz Foods*\n\n";

  cart.forEach((item) => {
    message += `• ${item.title} x${item.qty} — ${naira(item.unitBase * item.qty)}\n`;
    (item.addons || []).forEach((a) => {
      message += `   + ${a.name} x${a.qty * item.qty} — ${naira(a.price * a.qty * item.qty)}\n`;
    });
  });

  message += `\n*Subtotal:* ${naira(itemsSubtotal())}\n`;
  message += `*Takeaway packaging (${plateCount()} plate${plateCount() === 1 ? "" : "s"}):* ${naira(takeawayFeeTotal())}\n`;
  message += `*Total:* ${naira(cartTotal())}\n`;
  message += `*Name:* ${custNameEl.value.trim()}\n`;
  message += `*Phone:* ${custPhoneEl.value.trim()}\n`;
  message += `*Method:* ${selectedMethod === "delivery" ? "Delivery" : "Pickup"}\n`;
  if (selectedMethod === "delivery") {
    message += `*Address:* ${deliveryLocationEl.value.trim()}\n`;
  }

  return message;
}

// ======================================================================
// STEP NAVIGATION
// ======================================================================

function goToStep(next) {
  step = next;
  panels.forEach((p, i) => (p.hidden = i !== step));

  stepEls.forEach((el, i) => {
    el.classList.toggle("active", i === step);
    el.classList.toggle("done", i < step);
  });

  if (step === 2) renderConfirm();
  updateBottomBar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateBottomBar() {
  bottomTotalEl.textContent = naira(cartTotal());
  bottomTotalEl.classList.remove("pulse");
  void bottomTotalEl.offsetWidth;
  bottomTotalEl.classList.add("pulse");

  if (cart.length === 0) {
    bottomLabel.textContent = "Total";
    primaryCta.textContent = "Browse menu";
    primaryCta.disabled = false;
    return;
  }

  if (step === 0) {
    bottomLabel.textContent = "Total";
    primaryCta.textContent = "Continue to details";
  } else if (step === 1) {
    bottomLabel.textContent = "Total";
    primaryCta.textContent = "Review order";
  } else {
    bottomLabel.textContent = "Total";
    primaryCta.textContent = "Send order on WhatsApp";
  }
  primaryCta.disabled = false;
}

primaryCta.addEventListener("click", () => {
  if (cart.length === 0) {
    window.location.href = "menu.html";
    return;
  }

  if (step === 0) {
    goToStep(1);
  } else if (step === 1) {
    if (!validateDetails()) return;
    goToStep(2);
  } else {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
    window.open(url, "_blank");
  }
});

backBtn.addEventListener("click", () => {
  if (step === 0) {
    window.location.href = "menu.html";
  } else {
    goToStep(step - 1);
  }
});

stepEls.forEach((el) => {
  el.addEventListener("click", () => {
    const target = Number(el.dataset.step);
    if (target < step) goToStep(target);
  });
});

// ----- INITIAL LOAD -----
renderCart();
goToStep(0);
