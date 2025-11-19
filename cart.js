window.addEventListener("load", () => {
  const body = document.body;

  const main = document.createElement("div");
  main.innerHTML = `
    <div class="cart-items"></div>

    <div class="total-section">
      <span>Total:</span>
      <span class="total-amount">₦0</span>
    </div>

    <button class="order-main">Order Now</button>

    <button class="clearCart">Clear Cart</button>

    <button class="order-floating">🛒</button>

    <div class="order-popup hidden">
      <h3>Select Order Method</h3>

      <div class="method-option">
        <input type="radio" name="method" id="pickup" value="pickup" checked>
        <label for="pickup">Pickup</label>
      </div>

      <div class="method-option">
        <input type="radio" name="method" id="delivery" value="delivery">
        <label for="delivery">Delivery</label>
      </div>

      <div class="location-box hidden">
        <label>Enter Delivery Location:</label>
        <input type="text" id="deliveryLocation" placeholder="Your address...">
      </div>

      <button class="order">Proceed</button>

      <p class="warning hidden">⚠ Pick an order method first</p>
    </div>
  `;
  body.appendChild(main);

  const cartContainer = document.querySelector(".cart-items");
  const totalAmount = document.querySelector(".total-amount");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
      totalAmount.textContent = "₦0";
      return;
    }

    cartContainer.innerHTML = cart
      .map(
        (item, i) => `
      <div class="cart-item">
        <div>
          <h3>${item.title}</h3>
          <p>Qty: ${item.qty}</p>
          <p>₦${item.price * item.qty}</p>
        </div>
        <button class="delete-btn" data-index="${i}">🗑️</button>
      </div>
    `
      )
      .join("");

    computeTotal();
    attachDeleteEvents();
  }

  function computeTotal() {
    let total = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
    totalAmount.textContent = `₦${total}`;
  }

  function attachDeleteEvents() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  }

  // ORDER POPUP
  const orderFloatingBtn = document.querySelector(".order-floating");
  const orderPopup = document.querySelector(".order-popup");
  const warningText = document.querySelector(".warning");

  orderFloatingBtn.addEventListener("click", () => {
    if (cart.length === 0) return (window.location.href = "menu.html");
    orderPopup.classList.toggle("hidden");
  });

  const pickupRadio = document.getElementById("pickup");
  const deliveryRadio = document.getElementById("delivery");
  const locationBox = document.querySelector(".location-box");

  pickupRadio.addEventListener("change", () => {
    locationBox.classList.add("hidden");
  });

  deliveryRadio.addEventListener("change", () => {
    locationBox.classList.remove("hidden");
  });

  // PROCEED BUTTON
  let chosenMethod = null;
  let chosenLocation = "";

  document.querySelector(".order").addEventListener("click", () => {
    chosenMethod = pickupRadio.checked ? "Pickup" : "Delivery";
    chosenLocation = document.getElementById("deliveryLocation").value.trim();

    if (chosenMethod === "Delivery" && chosenLocation === "") {
      showWarning("Enter delivery location");
      return;
    }

    warningText.classList.add("hidden");
    orderPopup.classList.add("hidden");
  });

  // MAIN ORDER BUTTON
  document.querySelector(".order-main").addEventListener("click", () => {
    if (cart.length === 0) {
      window.location.href = "menu.html";
      return;
    }

    // ⭐ FIX: Reset delivery input visibility based on saved choice
    if (pickupRadio.checked) {
      locationBox.classList.add("hidden");
    } else {
      locationBox.classList.remove("hidden");
    }

    if (!chosenMethod) {
      showWarning("Pick order method first!");
      orderPopup.classList.remove("hidden");
      return;
    }

    let total = 0;
    let message = "Hello, I would like to place an order:\n\n";

    cart.forEach((item) => {
      const sub = item.qty * item.price;
      total += sub;
      message += `• ${item.title}\nQty: ${item.qty}\nSubtotal: ₦${sub}\n\n`;
    });

    message += `TOTAL: ₦${total}\n`;
    message += `Method: ${chosenMethod}\n`;

    if (chosenMethod === "Delivery") {
      message += `Location: ${chosenLocation}\n`;
    }

    const phone = "+2349138699736";
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(link, "_blank");
  });

  function showWarning(text) {
    warningText.textContent = "⚠ " + text;
    warningText.classList.remove("hidden");

    warningText.classList.add("shake");
    setTimeout(() => warningText.classList.remove("shake"), 600);
  }

  // CLEAR CART
  document.querySelector(".clearCart").addEventListener("click", () => {
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
    window.location.href = "menu.html";
  });

  renderCart();
});
