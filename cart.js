window.addEventListener("load", () => {
  const body = document.body;

  body.innerHTML += `
  <nav class="cart-nav">
    <button class="back-btn">←</button>
    <h2>YOUR CART</h2>
  </nav>

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

    <label>Full Name:</label>
    <input type="text" id="custName" placeholder="Enter your name">

    <label>Phone Number:</label>
    <input type="number" id="custPhone" placeholder="Enter phone number">

    <div class="method-option">
      <input type="radio" name="method" value="pickup" id="pickup">
      <label for="pickup">Pickup</label>
    </div>

    <div class="method-option">
      <input type="radio" name="method" value="delivery" id="delivery">
      <label for="delivery">Delivery</label>
    </div>

    <div class="location-box hidden">
      <label>Delivery Address:</label>
      <input type="text" id="deliveryLocation" placeholder="Your address...">
    </div>

    <button class="order">Proceed</button>
    <p class="warning hidden">⚠ Fill all details</p>
  </div>
`;

  // REFS
  const cartContainer = document.querySelector(".cart-items");
  const totalAmount = document.querySelector(".total-amount");
  const floatBtn = document.querySelector(".order-floating");
  const popup = document.querySelector(".order-popup");
  const proceedBtn = document.querySelector(".order");
  const warningText = document.querySelector(".warning");
  const locationBox = document.querySelector(".location-box");
  const orderBtn = document.querySelector(".order-main");
  const backBtn = document.querySelector(".back-btn");

  backBtn.onclick = () => (window.location.href = "menu.html");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let selectedMethod = "";

  // ----- RENDER CART -----
  function renderCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
      totalAmount.textContent = "₦0";
      setTimeout(() => (window.location.href = "menu.html"), 300);
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
    attachDelete();
  }

  function computeTotal() {
    let total = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
    totalAmount.textContent = `₦${total}`;
  }

  function attachDelete() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = () => {
        const i = btn.dataset.index;
        cart.splice(i, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      };
    });
  }

  // ----- FLOAT BUTTON -----
  floatBtn.addEventListener("click", () => {
    if (cart.length === 0) return (window.location.href = "menu.html");
    popup.classList.toggle("hidden");
  });

  // ----- CHOOSE METHOD -----
  document.querySelectorAll("input[name='method']").forEach((radio) => {
    radio.addEventListener("change", () => {
      selectedMethod = radio.value;

      if (selectedMethod === "delivery") {
        locationBox.classList.remove("hidden");
      } else {
        locationBox.classList.add("hidden");
      }
    });
  });

  // ----- PROCEED BUTTON -----
  proceedBtn.addEventListener("click", () => {
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();

    if (!name || !phone) {
      warningText.textContent = "Enter Name and Phone Number";
      warningText.classList.remove("hidden");
      return;
    }

    if (!selectedMethod) {
      warningText.textContent = "Choose pickup or delivery";
      warningText.classList.remove("hidden");
      return;
    }

    if (selectedMethod === "delivery") {
      const loc = document.getElementById("deliveryLocation").value.trim();
      if (!loc) {
        warningText.textContent = "Enter delivery address";
        warningText.classList.remove("hidden");
        return;
      }
    }

    warningText.classList.add("hidden");
    popup.classList.add("hidden");
  });

  // ----- SEND ORDER TO WHATSAPP -----
  orderBtn.addEventListener("click", () => {
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();

    if (!selectedMethod || !name || !phone) {
      popup.classList.remove("hidden");
      return;
    }

    let message = "🛒 *New Order*%0A%0A";

    cart.forEach((item) => {
      message += `• ${item.title} x${item.qty} — ₦${item.price * item.qty}%0A`;
    });

    message += `%0A*Total:* ${totalAmount.textContent}%0A`;
    message += `*Name:* ${name}%0A`;
    message += `*Phone:* ${phone}%0A`;
    message += `*Method:* ${selectedMethod}%0A`;

    if (selectedMethod === "delivery") {
      const loc = document.getElementById("deliveryLocation").value;
      message += `*Address:* ${loc}%0A`;
    }

    const phoneNumber = "2348138076639";
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, "_blank");
  });

  // ----- CLEAR CART -----
  document.querySelector(".clearCart").addEventListener("click", () => {
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
    window.location.href = "menu.html";
  });

  renderCart();
});
