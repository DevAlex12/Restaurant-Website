window.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart-items");
  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

  cartContainer.innerHTML = savedCart
    .map(
      (item) => `
        <div class="cart-item">
          <h3>${item.title}</h3>
          <p>Qty: ${item.qty}</p>
          <p>₦${item.price * item.qty}</p>
        </div>`
    )
    .join("");

  const clearCart = document.querySelector(".clearCart");
  clearCart.addEventListener("click", () => {
    localStorage.removeItem("cart");
    document.querySelector(".cart-items").innerHTML = "";
    window.location.href = "menu.html"; // redirect to menu page
  });

  const orderBtn = document.querySelector(".order");
  orderBtn.addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    let total = 0;
    let message = "Hello, I would like to place an order:\n\n";

    cart.forEach((item) => {
      const itemsTotal = item.price * item.qty;
      total += itemsTotal;
      message += `• ${item.title}\nQty: ${item.qty}\nUnit: ₦${item.price}\nSubtotal: ₦${itemsTotal}\n\n`;
    });

    message += `Total: ₦${total}`;
    const phoneNumber = "2347060577255";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  });
});
