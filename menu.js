const card = document.querySelector(".foods");
const cartBtn = document.querySelector(".cart-icon");

const menuData = [
  {
    id: 10,
    foodimage: "images/PoundedYam.jpg",
    title: "Pounded Yam",
    price: 2000,
  },
  {
    id: 20,
    foodimage: "images/FriedRice.jpg",
    title: "Fried Rice",
    price: 1500,
  },
  {
    id: 21,
    foodimage: "images/JollofRice.jpg",
    title: "Jollof Rice",
    price: 1800,
  },
  {
    id: 24,
    foodimage: "images/whiterice.jpg",
    title: "White Rice",
    price: 1000,
  },
  { id: 11, foodimage: "images/Amala.jpg", title: "Amala", price: 1800 },
  { id: 12, foodimage: "images/Semo.jpg", title: "Semo", price: 1800 },
  { id: 13, foodimage: "images/eba.jpg", title: "Eba", price: 1000 },
  {
    id: 23,
    foodimage: "images/bashmati rice.jpg",
    title: "Bashmati Rice",
    price: 1500,
  },
  { id: 31, foodimage: "images/ogbono.jpg", title: "Ogbono Soup", price: 500 },
  {
    id: 32,
    foodimage: "images/EweduSoup.jpg",
    title: "Ewedu Soup",
    price: 600,
  },
  {
    id: 33,
    foodimage: "images/ilaalasepo.jpg",
    title: "Ila Alasepo",
    price: 500,
  },
  {
    id: 41,
    foodimage: "images/Goat meat.jpg",
    title: "Goat Meat",
    price: 1000,
  },
  { id: 42, foodimage: "images/cow meat.jpg", title: "Cow Meat", price: 1000 },
  { id: 43, foodimage: "images/fish.jpg", title: "Fish", price: 300 },
  { id: 50, foodimage: "images/beans.jpg", title: "Beans", price: 300 },
  { id: 51, foodimage: "images/Akara.jpg", title: "Akara", price: 100 },
  { id: 52, foodimage: "images/moimois.jpg", title: "moimoi", price: "500" },
];

// Render items
function renderMenu(data) {
  card.innerHTML = data
    .map(
      (item) => `
      <div class="afood">
        <img src="${item.foodimage}" alt="${item.title}" />
        <div class="info">
          <span class="titlename">${item.title}</span><br />
          <div class="priceRow">
            <span class="price">₦${item.price}</span>
            <div class="qtybtn">
              <button class="minus">-</button>
              <div class="quantity">0</div>
              <button class="plus">+</button>
            </div>
          </div>
          <div><button class="crtbtn">Add To Cart</button></div>
        </div>
      </div>
    `
    )
    .join("");

  attachEvents();
}

// Handle plus/minus/add
function attachEvents() {
  document.querySelectorAll(".afood").forEach((food) => {
    const qtyDiv = food.querySelector(".quantity");
    const plusBtn = food.querySelector(".plus");
    const minusBtn = food.querySelector(".minus");
    const price = food.querySelector(".price");
    const usedprice = Number(price.textContent.replace("₦", ""));
    const crtbtn = food.querySelector(".crtbtn");
    let qty = 0;

    plusBtn.addEventListener("click", () => {
      qty++;
      qtyDiv.textContent = qty;
      price.textContent = `₦${usedprice * qty}`;
    });

    minusBtn.addEventListener("click", () => {
      if (qty > 0) {
        qty--;
        qtyDiv.textContent = qty;
        price.textContent = qty ? `₦${usedprice * qty}` : `₦${usedprice}`;
      }
    });

    crtbtn.addEventListener("click", () => {
      if (qty <= 0) {
        const warn = document.createElement("span");
        warn.textContent = "Add a food first!";
        warn.classList.add("addedmsg");
        warn.style.color = "red";
        crtbtn.parentElement.appendChild(warn);
        setTimeout(() => warn.remove(), 1500);
        return;
      }

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const title = food.querySelector(".titlename").textContent.trim();
      const existing = cart.find((item) => item.title === title);

      if (existing) existing.qty += qty;
      else cart.push({ title, price: usedprice, qty });

      localStorage.setItem("cart", JSON.stringify(cart));

      const addedmsg = document.createElement("span");
      addedmsg.textContent = "Added To Cart";
      addedmsg.classList.add("addedmsg");
      crtbtn.parentElement.appendChild(addedmsg);
      setTimeout(() => addedmsg.remove(), 1300);
    });
  });
}

// Filter by category
function filterByCategory(category) {
  let filtered;
  switch (category) {
    case "swallow":
      filtered = menuData.filter((item) => String(item.id).startsWith("1"));
      break;
    case "rice":
      filtered = menuData.filter((item) => String(item.id).startsWith("2"));
      break;
    case "soup":
      filtered = menuData.filter((item) => String(item.id).startsWith("3"));
      break;
    case "meat":
      filtered = menuData.filter((item) => String(item.id).startsWith("4"));
      break;
    case "beans":
      filtered = menuData.filter((item) => String(item.id).startsWith("5"));
      break;
    default:
      filtered = menuData;
  }
  renderMenu(filtered);
}

// Filter button logic
document.querySelectorAll(".filter-bar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-bar button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;
    filterByCategory(category);
  });
});

// Cart button logic
if (cartBtn) {
  cartBtn.addEventListener("click", (e) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      e.preventDefault();
      alert("Add a food to cart first!");
    } else {
      window.location.href = "cart.html"; // change to your cart page
    }
  });
}

// Default load
renderMenu(menuData);
