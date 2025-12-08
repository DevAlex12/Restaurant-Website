// ===================== SELECTORS =====================
const card = document.querySelector(".foods");
const cartBtn = document.querySelector(".cart-icon");
const filterBar = document.querySelector(".filter-bar");
const searchContainer = document.querySelector(".search-container");

// ===================== CATEGORIES =====================
const categories = [
  { key: "all", label: "All" },
  { key: "rice", label: "Rice" },
  { key: "spaghetti", label: "Spaghetti" },
  { key: "fries", label: "Fries" },
  { key: "protein", label: "Protein" },
  { key: "soup", label: "Soup" },
  { key: "drinks", label: "Drinks" },
  { key: "etc", label: "E.t.c" },
];

// ===================== GENERATE FILTER BUTTONS =====================
filterBar.innerHTML = categories
  .map(
    (cat, i) =>
      `<button data-category="${cat.key}" class="${i === 0 ? "active" : ""}">
        ${cat.label}
      </button>`
  )
  .join("");

// ===================== ADD SEARCH BAR =====================
if (searchContainer) {
  searchContainer.innerHTML = `
    <input type="text" id="searchInput" placeholder="Search for food or drink..." />
  `;
}

// ===================== MENU DATA (FIXED UNIQUE IDs) =====================
const menuData = [
  // Rice Combo
  {
    id: 11,
    foodimage: "images/JollofRiceWithChicken.jpg",
    title: "Jollof Rice With Chicken",
    price: 4500,
  },
  {
    id: 12,
    foodimage: "images/JRT.jpg",
    title: "Jollof Rice With Turkey",
    price: 6500,
  },
  {
    id: 13,
    foodimage: "images/JFT.jpg",
    title: "Jollof and Fried Rice With Turkey",
    price: 6500,
  },
  {
    id: 14,
    foodimage: "images/JollndFriedAndEgg.jpg",
    title: "Jollof and Fried Rice With Egg",
    price: 2000,
  },
  {
    id: 15,
    foodimage: "images/JollofRiceandTFish.jpg",
    title: "Jollof Rice With Fish",
    price: 3000,
  },

  // Rice
  {
    id: 21,
    foodimage: "images/FriedRice.jpg",
    title: "A Scoop of Fried Rice",
    price: 700,
  },
  {
    id: 22,
    foodimage: "images/JollofRice.jpg",
    title: "A Scoop of Jollof Rice",
    price: 700,
  },

  // Spaghetti
  {
    id: 94,
    foodimage: "images/Spag2.jpg",
    title: "A scoop of Stir Fry Spaghetti",
    price: 700,
  },
  {
    id: 91,
    foodimage: "images/SpagChi.jpg",
    title: "Stir Fry Spaghetti with Chicken",
    price: 4500,
  },
  {
    id: 92,
    foodimage: "images/SpagTur.jpg",
    title: "Stir fry spaghetti with Turkey",
    price: 6500,
  },
  {
    id: 93,
    foodimage: "images/Spag2.jpg",
    title: "Stir fry spaghetti (Budget)",
    price: 3500,
  },

  // Fries
  {
    id: 81,
    foodimage: "images/TurNdPota.jpg",
    title: "Turkey and Sweet Potato Chips",
    price: 6600,
  },
  {
    id: 82,
    foodimage: "images/ChikenFries.jpg",
    title: "Chicken and Sweet Potato Chips",
    price: 4600,
  },

  // Protein
  { id: 41, foodimage: "images/cow meat.jpg", title: "Beef", price: 1000 },
  { id: 42, foodimage: "images/fish.jpg", title: "Fish", price: 1500 },
  {
    id: 43,
    foodimage: "images/ChickWing.jpg",
    title: "Chicken Wings",
    price: 3000,
  },
  {
    id: 44,
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

  // Soup
  {
    id: 31,
    foodimage: "images/Stew.jpg",
    title: "Buka stew (2.5 litres)",
    price: 25000,
  },
  { id: 32, foodimage: "images/Stew1.jpg", title: "Stew", price: 10000 },
  { id: 33, foodimage: "images/ESoup.jpg", title: "Efo Riro", price: 5500 },

  // Drinks
  {
    id: 71,
    foodimage: "images/BigExotic.jpg",
    title: "Big Chilled Exotic",
    price: 2200,
  },
  {
    id: 72,
    foodimage: "images/HollaYo.jpg",
    title: "Hollandia Yoghurt",
    price: 2500,
  },
  {
    id: 73,
    foodimage: "images/CarDrink.jpg",
    title: "Carbonated Drinks",
    price: 500,
  },
  { id: 74, foodimage: "images/Water.jpg", title: "Bottled Water", price: 300 },
  {
    id: 75,
    foodimage: "images/ChiActive.jpg",
    title: "Chivita Active Fruit Juice",
    price: 2500,
  },
  {
    id: 76,
    foodimage: "images/BigSoDrink.jpg",
    title: "Big Sosa Drink",
    price: 1200,
  },
  {
    id: 77,
    foodimage: "images/PulpyOrange.jpg",
    title: "Pulpy Orange",
    price: 1200,
  },
  { id: 78, foodimage: "images/Malt.jpg", title: "Maltina Drink", price: 1200 },

  // Etc
  {
    id: 61,
    foodimage: "images/Salad.jpg",
    title: "Vegetable Salad / Coleslaw",
    price: 700,
  },
  {
    id: 62,
    foodimage: "images/SmallChop.jpg",
    title: "Small Chops Tray",
    price: 10000,
  },
];

// ===================== RENDER MENU =====================
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

// ===================== PLUS / MINUS / ADD LOGIC =====================
function attachEvents() {
  document.querySelectorAll(".afood").forEach((food) => {
    const qtyDiv = food.querySelector(".quantity");
    const plusBtn = food.querySelector(".plus");
    const minusBtn = food.querySelector(".minus");
    const usedprice = Number(
      food.querySelector(".price").textContent.replace("₦", "")
    );
    const crtbtn = food.querySelector(".crtbtn");

    let qty = 0;

    plusBtn.addEventListener("click", () => {
      qty++;
      qtyDiv.textContent = qty;
      food.querySelector(".price").textContent = `₦${usedprice * qty}`;
    });

    minusBtn.addEventListener("click", () => {
      if (qty > 0) {
        qty--;
        qtyDiv.textContent = qty;
        food.querySelector(".price").textContent = qty
          ? `₦${usedprice * qty}`
          : `₦${usedprice}`;
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

// ===================== FILTER FUNCTION =====================
function filterByCategory(category) {
  let filtered;

  switch (category) {
    case "rice":
      filtered = menuData.filter((item) =>
        ["1", "2"].includes(String(item.id)[0])
      );
      break;

    case "soup":
      filtered = menuData.filter((item) => String(item.id).startsWith("3"));
      break;

    case "protein":
      filtered = menuData.filter((item) => String(item.id).startsWith("4"));
      break;

    case "drinks":
      filtered = menuData.filter((item) => String(item.id).startsWith("7"));
      break;

    case "fries":
      filtered = menuData.filter((item) => String(item.id).startsWith("8"));
      break;

    case "spaghetti":
      filtered = menuData.filter((item) => String(item.id).startsWith("9"));
      break;

    case "etc":
      filtered = menuData.filter(
        (item) =>
          !["1", "2", "3", "4", "7", "8", "9"].includes(String(item.id)[0])
      );
      break;

    default:
      filtered = menuData;
  }

  renderMenu(filtered);
}

// ===================== FILTER BUTTON LOGIC =====================
document.querySelectorAll(".filter-bar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-bar button")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");
    filterByCategory(btn.dataset.category);
    document.getElementById("searchInput").value = "";
  });
});

// ===================== SEARCH FUNCTION =====================
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    const currentCategory = document.querySelector(".filter-bar .active")
      .dataset.category;

    let filtered = menuData;

    if (currentCategory !== "all") {
      filtered = menuData.filter((item) =>
        filterByCategory(currentCategory)
          .map((f) => f.id)
          .includes(item.id)
      );
    }

    filtered = filtered.filter((item) =>
      item.title.toLowerCase().includes(term)
    );

    renderMenu(filtered);
  });
}

// ===================== CART BUTTON =====================
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

// ===================== INITIAL LOAD =====================
renderMenu(menuData);
