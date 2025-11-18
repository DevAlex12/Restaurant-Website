// ===== SELECTORS =====
const card = document.querySelector(".foods");
const cartBtn = document.querySelector(".cart-icon");
const filterBar = document.querySelector(".filter-bar");
const searchContainer = document.querySelector(".search-container");

// ===== CATEGORIES =====
const categories = [
  { key: "all", label: "All" },
  { key: "combo", label: "Combo" },
  { key: "soup", label: "Soup" },
  { key: "rice", label: "Rice" },
  { key: "spaghetti", label: "Spaghetti" }, // 🆕 Added
  { key: "meat", label: "Meat" },
  { key: "snacks", label: "Snacks" },
  { key: "fries", label: "Fries" },
  { key: "drinks", label: "Drinks" },
];

// ===== GENERATE FILTER BUTTONS =====
filterBar.innerHTML = categories
  .map(
    (cat, i) =>
      `<button data-category="${cat.key}" class="${i === 0 ? "active" : ""}">
        ${cat.label}
      </button>`
  )
  .join("");

// ===== ADD SEARCH BAR =====
if (searchContainer) {
  searchContainer.innerHTML = `
    <input type="text" id="searchInput" placeholder="Search for food or drink..." />
  `;
}

// ===== MENU DATA =====
const menuData = [
  //Combo
  {
    id: 10,
    foodimage: "images/JollofRiceWithChicken.jpg",
    title: "Jollof Rice With Chicken",
    price: "4500",
  },
  {
    id: 11,
    foodimage: "images/JollndFriedAndEgg.jpg",
    title: "Jollof and Fried Rice With Egg",
    price: "2000",
  },
  {
    id: 12,
    foodimage: "images/JollofRiceandTFish.jpg",
    title: "Jollof and Fried Rice With Fish",
    price: "2000",
  },
  // Rice
  {
    id: 20,
    foodimage: "images/FriedRice.jpg",
    title: "A Scoop of Fried Rice",
    price: 700,
  },
  {
    id: 21,
    foodimage: "images/JollofRice.jpg",
    title: "A Scoop of Jollof Rice",
    price: 700,
  },
  {
    id: 24,
    foodimage: "images/whiterice.jpg",
    title: "A Scoop White Rice",
    price: 700,
  },
  {
    id: 34,
    foodimage: "images/Stew.jpg",
    title: " Buka stew. 2.5 litres of Stew with Turkey,beef and ponmo",
    price: 25000,
  },
  {
    id: 35,
    foodimage: "images/Stew1.jpg",
    title: " Stew",
    price: 10000,
  },
  {
    id: 36,
    foodimage: "images/ESoup.jpg",
    title: " Efo Riro",
    price: 25000,
  },

  // 🆕 Spaghetti
  {
    id: 90,
    foodimage: "images/SpagChi.jpg",
    title: "Stir Fry Spaghetti with Chicken",
    price: 4500,
  },
  {
    id: 91,
    foodimage: "images/SpagTur.jpg",
    title: "Stir fry spaghetti with Turkey",
    price: 6400,
  },
  {
    id: 92,
    foodimage: "images/Spag2.jpg",
    title: "Stir fry spaghetti with chicken cheaper chow budget",
    price: 3500,
  },

  // Meat
  { id: 42, foodimage: "images/cow meat.jpg", title: "Beef", price: 1000 },
  { id: 43, foodimage: "images/fish.jpg", title: "Fish", price: 300 },
  {
    id: 45,
    foodimage: "images/ChickWing.jpg",
    title: "Chicken Wings",
    price: 3000,
  },
  {
    id: 45,
    foodimage: "images/ChickLap.jpg",
    title: "Chicken Lap",
    price: 3000,
  },
  {
    id: 45,
    foodimage: "images/TurDrumStick.jpg",
    title: "Turkey DrumStick",
    price: 4500,
  },

  // Snacks

  {
    id: 62,
    foodimage: "images/Salad.jpg",
    title: "Vegetable salad/ Coleslaw",
    price: 700,
  },
  {
    id: 62,
    foodimage: "images/SmallChop.jpg",
    title: "Small Chips Tray",
    price: 10000,
  },
  // Fries
  {
    id: 80,
    foodimage: "images/TurNdPota.jpg",
    title: "Turkey & Sweet Potato Chips",
    price: 6600,
  },
  {
    id: 81,
    foodimage: "images/ChikenFries.jpg",
    title: "Chicken & Sweet Potato Chips",
    price: 4600,
  },

  // Drinks
  {
    id: 70,
    foodimage: "images/BigExotic.jpg",
    title: "Big Chilled Exotic",
    price: 2200,
  },
  {
    id: 71,
    foodimage: "images/HollaYo.jpg",
    title: "Hollandia Yoghurt",
    price: 2500,
  },
  {
    id: 72,
    foodimage: "images/CarDrink.jpg",
    title: "Carbonated Drinks",
    price: 500,
  },
  { id: 73, foodimage: "images/Water.jpg", title: "Bottled Water", price: 300 },
  {
    id: 74,
    foodimage: "images/ChiActive.jpg",
    title: "Chivita Active Fruit Juice",
    price: 2500,
  },
  {
    id: 75,
    foodimage: "images/BigSoDrink.jpg",
    title: "Big Sosa Drink",
    price: 1200,
  },
  {
    id: 76,
    foodimage: "images/PulpyOrange.jpg",
    title: "Pulpy Orange",
    price: 1200,
  },
  { id: 77, foodimage: "images/Malt.jpg", title: "Maltina Drink", price: 1200 },
];

// ===== RENDER MENU =====
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

// ===== PLUS/MINUS/ADD LOGIC =====
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

// ===== FILTER FUNCTION =====
function filterByCategory(category) {
  let filtered;
  switch (category) {
    case "combo":
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
    case "snacks":
      filtered = menuData.filter((item) => String(item.id).startsWith("6"));
      break;
    case "drinks":
      filtered = menuData.filter((item) => String(item.id).startsWith("7"));
      break;
    case "fries":
      filtered = menuData.filter((item) => String(item.id).startsWith("8"));
      break;
    case "spaghetti": // 🆕
      filtered = menuData.filter((item) => String(item.id).startsWith("9"));
      break;
    default:
      filtered = menuData;
  }
  renderMenu(filtered);
}

// ===== FILTER BUTTON LOGIC =====
document.querySelectorAll(".filter-bar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-bar button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;
    filterByCategory(category);
    document.getElementById("searchInput").value = ""; // clear search
  });
});

// ===== SEARCH FUNCTION =====
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    const currentCategory = document.querySelector(".filter-bar .active")
      .dataset.category;

    let filtered = menuData;

    // apply category filter first
    if (currentCategory !== "all") {
      filtered = menuData.filter((item) =>
        String(item.id).startsWith(
          {
            swallow: "1",
            rice: "2",
            soup: "3",
            meat: "4",
            beans: "5",
            snacks: "6",
            drinks: "7",
            fries: "8",
            spaghetti: "9", // 🆕
          }[currentCategory]
        )
      );
    }

    // apply search filter
    filtered = filtered.filter((item) =>
      item.title.toLowerCase().includes(term)
    );

    renderMenu(filtered);
  });
}

// ===== CART BUTTON =====
if (cartBtn) {
  cartBtn.addEventListener("click", (e) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      e.preventDefault();
      alert("Add a food to cart first!");
    } else {
      window.location.href = "cart.html";
    }
  });
}

// ===== INITIAL LOAD =====
renderMenu(menuData);
