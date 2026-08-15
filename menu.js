// ======================================================================
// PAPILZ FOODS — MENU + ORDER BUILDER
// ======================================================================

// ----- SELECTORS -----
const foodsEl = document.getElementById("foods");
const emptyStateEl = document.getElementById("emptyState");
const filterBar = document.getElementById("filterBar");
const searchInput = document.getElementById("searchInput");
const cartCountEl = document.getElementById("cartCount");
const cartPill = document.querySelector(".cart-pill");
const toastEl = document.getElementById("toast");
const toastTextEl = document.getElementById("toastText");

// Builder sheet
const sheetBackdrop = document.getElementById("sheetBackdrop");
const builderSheet = document.getElementById("builderSheet");
const sheetClose = document.getElementById("sheetClose");
const builderImg = document.getElementById("builderImg");
const builderTitle = document.getElementById("builderTitle");
const builderBasePrice = document.getElementById("builderBasePrice");
const addonGroupsEl = document.getElementById("addonGroups");
const builderQtyEl = document.getElementById("builderQty");
const builderMinus = document.getElementById("builderMinus");
const builderPlus = document.getElementById("builderPlus");
const builderTotalEl = document.getElementById("builderTotal");
const builderAddBtn = document.getElementById("builderAdd");

// ----- CATEGORIES -----
const categories = [
  { key: "all", label: "All" },
  { key: "combos", label: "Meals" },
  { key: "rice", label: "Rice" },
  { key: "spaghetti", label: "Spaghetti" },
  { key: "protein", label: "Protein" },
  { key: "soup", label: "Soup" },
  { key: "sides", label: "Sides" },
  { key: "drinks", label: "Drinks" },
];

filterBar.innerHTML = categories
  .map(
    (cat, i) =>
      `<button data-category="${cat.key}" class="${i === 0 ? "active" : ""}">${cat.label}</button>`
  )
  .join("");

// ----- ADD-ON CATALOG (used inside the order builder) -----
const ADDON_CATALOG = {
  scoops: [
    { name: "Extra Jollof Rice Scoop", price: 700 },
    { name: "Extra Fried Rice Scoop", price: 700 },
    { name: "Extra Spaghetti Scoop", price: 700 },
  ],
  protein: [
    { name: "Beef", price: 1000 },
    { name: "Fish", price: 1500 },
    { name: "Chicken Wings", price: 3000 },
    { name: "Chicken Lap", price: 3000 },
    { name: "Turkey Drumstick", price: 4500 },
  ],
  sides: [
    { name: "Fried Plantain", price: 500 },
    { name: "Vegetable Salad / Coleslaw", price: 700 },
  ],
  drinks: [
    { name: "Big Chilled Exotic", price: 2200 },
    { name: "Hollandia Yoghurt", price: 2500 },
    { name: "Carbonated Drink", price: 500 },
    { name: "Bottled Water", price: 300 },
    { name: "Chivita Active Fruit Juice", price: 2500 },
    { name: "Big Sosa Drink", price: 1500 },
    { name: "Pulpy Orange", price: 1500 },
    { name: "Maltina Drink", price: 800 },
  ],
};

const ADDON_GROUP_LABELS = {
  scoops: "Extra scoops",
  protein: "Extra protein",
  sides: "Add a side",
  drinks: "Add a drink",
};

const DEFAULT_ADDON_GROUPS = ["scoops", "protein", "sides", "drinks"];

// ----- MEALS (combo plates — open the order builder) -----
const meals = [
  { id: "m11", image: "images/jollof-rice-with-chicken.webp", title: "Jollof Rice With Chicken", price: 4500, category: "combos" },
  { id: "m12", image: "images/j-r-t.webp", title: "Jollof Rice With Turkey", price: 6500, category: "combos" },
  { id: "m13", image: "images/j-f-t.webp", title: "Jollof and Fried Rice With Turkey", price: 6500, category: "combos" },
  { id: "m14", image: "images/jollnd-fried-and-egg.webp", title: "Jollof and Fried Rice With Egg", price: 2000, category: "combos" },
  { id: "m15", image: "images/jollof-riceand-t-fish.webp", title: "Jollof Rice With Fish", price: 3000, category: "combos" },
  { id: "m23a", image: "images/feedme.webp", title: "Welcome Back Package 1", price: 5000, category: "combos" },
  { id: "m23b", image: "images/feedme.webp", title: "Welcome Back Package 2", price: 4000, category: "combos" },
  { id: "m91", image: "images/spag-chi.webp", title: "Stir Fry Spaghetti With Chicken", price: 4500, category: "combos" },
  { id: "m92", image: "images/spag-tur.webp", title: "Stir Fry Spaghetti With Turkey", price: 6500, category: "combos" },
  { id: "m93", image: "images/spag2.webp", title: "Stir Fry Spaghetti With Chicken (Budget)", price: 3500, category: "combos" },
  { id: "m81", image: "images/tur-nd-pota.webp", title: "Turkey and Sweet Potato Chips", price: 6600, category: "combos" },
  { id: "m82", image: "images/chiken-fries.webp", title: "Chicken and Sweet Potato Chips", price: 4600, category: "combos" },
].map((m) => ({ ...m, type: "meal", addonGroups: DEFAULT_ADDON_GROUPS }));

// ----- SIMPLE ITEMS (a la carte — quick add, no builder) -----
const simpleItems = [
  { id: "s21", image: "images/fried-rice.webp", title: "A Scoop of Fried Rice", price: 700, category: "rice" },
  { id: "s22", image: "images/jollof-rice.webp", title: "A Scoop of Jollof Rice", price: 700, category: "rice" },
  { id: "s94", image: "images/stir-fry-spaghetti.webp", title: "A Scoop of Stir Fry Spaghetti", price: 700, category: "spaghetti" },
  { id: "s41", image: "images/cow-meat.webp", title: "Beef", price: 1000, category: "protein" },
  { id: "s42", image: "images/fish.webp", title: "Fish", price: 1500, category: "protein" },
  { id: "s43", image: "images/chick-wing.webp", title: "Chicken Wings", price: 3000, category: "protein" },
  { id: "s44", image: "images/chick-lap.webp", title: "Chicken Lap", price: 3000, category: "protein" },
  { id: "s45", image: "images/tur-drum-stick.webp", title: "Turkey Drumstick", price: 4500, category: "protein" },
  { id: "s33", image: "images/e-soup.webp", title: "Efo Riro", price: 5500, category: "soup" },
  { id: "s83", image: "images/dodo1.webp", title: "Fried Plantain", price: 500, category: "sides" },
  { id: "s61", image: "images/salad.webp", title: "Vegetable Salad / Coleslaw", price: 700, category: "sides" },
  { id: "s71", image: "images/big-exotic.webp", title: "Big Chilled Exotic", price: 2200, category: "drinks" },
  { id: "s72", image: "images/holla-yo.webp", title: "Hollandia Yoghurt", price: 2500, category: "drinks" },
  { id: "s73", image: "images/car-drink.webp", title: "Carbonated Drink", price: 500, category: "drinks" },
  { id: "s74", image: "images/water.webp", title: "Bottled Water", price: 300, category: "drinks" },
  { id: "s75", image: "images/chi-active.webp", title: "Chivita Active Fruit Juice", price: 2500, category: "drinks" },
  { id: "s76", image: "images/big-so-drink.webp", title: "Big Sosa Drink", price: 1500, category: "drinks" },
  { id: "s77", image: "images/pulpy-orange.webp", title: "Pulpy Orange", price: 1500, category: "drinks" },
  { id: "s78", image: "images/malt.webp", title: "Maltina Drink", price: 800, category: "drinks" },
].map((s) => ({ ...s, type: "simple" }));

const menuData = [...meals, ...simpleItems];

// ----- HELPERS -----
const naira = (n) => `₦${n.toLocaleString("en-NG")}`;

function showToast(text) {
  toastTextEl.textContent = text;
  toastEl.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove("show"), 1600);
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, it) => sum + it.qty, 0);
  if (total > 0) {
    cartCountEl.hidden = false;
    cartCountEl.textContent = total > 99 ? "99+" : total;
  } else {
    cartCountEl.hidden = true;
  }
}

function bumpCartIcon() {
  cartPill.classList.remove("bump");
  // force reflow so the animation can restart
  void cartPill.offsetWidth;
  cartPill.classList.add("bump");
}

// Adds a line to the cart. Simple items merge by title; meal bundles merge
// only when title AND chosen add-ons match exactly, since two differently
// customized versions of the same meal are meaningfully different orders.
function addToCart(entry) {
  const cart = getCart();
  const signature = JSON.stringify({
    title: entry.title,
    addons: (entry.addons || []).map((a) => `${a.name}:${a.qty}`).sort(),
  });

  const existing = cart.find((it) => it._sig === signature);
  if (existing) {
    existing.qty += entry.qty;
  } else {
    cart.push({ ...entry, _sig: signature });
  }

  setCart(cart);
  bumpCartIcon();
  showToast(`Added ${entry.title} to cart`);
}

// ----- RENDER MENU GRID -----
function cardTemplate(item) {
  const media = `
    <div class="afood-media">
      <div class="skel"></div>
      <img
        src="${item.image}"
        alt="${item.title}"
        loading="lazy"
        decoding="async"
        onload="this.previousElementSibling.remove()"
      />
      ${item.type === "meal" ? '<span class="combo-badge">Customizable</span>' : ""}
    </div>`;

  const actions =
    item.type === "meal"
      ? `<button class="customize-btn" data-id="${item.id}">Customize · ${naira(item.price)}</button>`
      : `
        <div class="qtybtn">
          <button class="stepbtn minus" aria-label="Decrease quantity">−</button>
          <div class="quantity">0</div>
          <button class="stepbtn plus" aria-label="Increase quantity">+</button>
        </div>
        <button class="crtbtn" data-id="${item.id}">Add · ${naira(item.price)}</button>
      `;

  return `
    <div class="afood" data-id="${item.id}">
      ${media}
      <div class="afood-body">
        <span class="afood-title">${item.title}</span>
        <div class="afood-actions">${actions}</div>
      </div>
    </div>`;
}

function renderMenu(data) {
  emptyStateEl.hidden = data.length > 0;
  foodsEl.innerHTML = data.map(cardTemplate).join("");
  attachCardEvents(data);
}

function attachCardEvents(data) {
  document.querySelectorAll(".afood").forEach((card) => {
    const id = card.dataset.id;
    const item = data.find((d) => d.id === id);
    if (!item) return;

    if (item.type === "meal") {
      card.querySelector(".customize-btn").addEventListener("click", () => openBuilder(item));
      return;
    }

    // Simple item: local qty stepper, then add
    const qtyDiv = card.querySelector(".quantity");
    const plusBtn = card.querySelector(".plus");
    const minusBtn = card.querySelector(".minus");
    const addBtn = card.querySelector(".crtbtn");
    let qty = 0;

    plusBtn.addEventListener("click", () => {
      qty++;
      qtyDiv.textContent = qty;
    });

    minusBtn.addEventListener("click", () => {
      if (qty > 0) {
        qty--;
        qtyDiv.textContent = qty;
      }
    });

    addBtn.addEventListener("click", () => {
      if (qty <= 0) {
        showToast("Choose a quantity first");
        return;
      }
      addToCart({ title: item.title, image: item.image, unitBase: item.price, qty, addons: [] });
      qty = 0;
      qtyDiv.textContent = "0";
    });
  });
}

// ----- FILTER + SEARCH -----
function applyFilters() {
  const activeBtn = filterBar.querySelector("button.active");
  const category = activeBtn ? activeBtn.dataset.category : "all";
  const term = searchInput.value.trim().toLowerCase();

  let filtered = category === "all" ? menuData : menuData.filter((it) => it.category === category);
  if (term) {
    filtered = filtered.filter((it) => it.title.toLowerCase().includes(term));
  }
  renderMenu(filtered);
}

filterBar.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBar.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
  });
});

let searchDebounce;
searchInput.addEventListener("input", () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(applyFilters, 120);
});

// ======================================================================
// ORDER BUILDER (bottom sheet)
// ======================================================================

let builderState = null; // { meal, qty, addons: { groupKey: { name: qty } } }

function openBuilder(meal) {
  builderState = { meal, qty: 1, addons: {} };

  builderImg.src = meal.image;
  builderImg.alt = meal.title;
  builderTitle.textContent = meal.title;
  builderBasePrice.textContent = `Base price ${naira(meal.price)}`;
  builderQtyEl.textContent = "1";

  addonGroupsEl.innerHTML = meal.addonGroups
    .map((groupKey) => {
      const items = ADDON_CATALOG[groupKey];
      const rows = items
        .map(
          (opt, i) => `
          <div class="addon-row" data-group="${groupKey}" data-index="${i}">
            <div class="addon-info">
              <span class="addon-name">${opt.name}</span>
              <span class="addon-price">+${naira(opt.price)} each</span>
            </div>
            <div class="addon-stepper">
              <button class="stepbtn addon-minus" aria-label="Remove one ${opt.name}">−</button>
              <span class="quantity">0</span>
              <button class="stepbtn addon-plus" aria-label="Add one ${opt.name}">+</button>
            </div>
          </div>`
        )
        .join("");

      return `
        <div class="addon-group">
          <h3>${ADDON_GROUP_LABELS[groupKey]}</h3>
          ${rows}
        </div>`;
    })
    .join("");

  addonGroupsEl.querySelectorAll(".addon-row").forEach((row) => {
    const groupKey = row.dataset.group;
    const idx = Number(row.dataset.index);
    const opt = ADDON_CATALOG[groupKey][idx];
    const qtyEl = row.querySelector(".quantity");
    const minus = row.querySelector(".addon-minus");
    const plus = row.querySelector(".addon-plus");

    minus.addEventListener("click", () => {
      const current = builderState.addons[opt.name]?.qty || 0;
      if (current <= 0) return;
      setAddonQty(opt, current - 1, qtyEl);
    });

    plus.addEventListener("click", () => {
      const current = builderState.addons[opt.name]?.qty || 0;
      setAddonQty(opt, current + 1, qtyEl);
    });
  });

  updateBuilderTotal();
  document.body.classList.add("sheet-open");
  sheetBackdrop.classList.add("show");
  requestAnimationFrame(() => builderSheet.classList.add("show"));
}

function setAddonQty(opt, qty, qtyEl) {
  if (qty <= 0) {
    delete builderState.addons[opt.name];
    qtyEl.textContent = "0";
  } else {
    builderState.addons[opt.name] = { price: opt.price, qty };
    qtyEl.textContent = qty;
  }
  updateBuilderTotal();
}

function updateBuilderTotal() {
  const addonsTotal = Object.values(builderState.addons).reduce(
    (sum, a) => sum + a.price * a.qty,
    0
  );
  const unit = builderState.meal.price + addonsTotal;
  builderTotalEl.textContent = naira(unit * builderState.qty);
}

builderMinus.addEventListener("click", () => {
  if (builderState.qty > 1) {
    builderState.qty--;
    builderQtyEl.textContent = builderState.qty;
    updateBuilderTotal();
  }
});

builderPlus.addEventListener("click", () => {
  builderState.qty++;
  builderQtyEl.textContent = builderState.qty;
  updateBuilderTotal();
});

builderAddBtn.addEventListener("click", () => {
  const { meal, qty, addons } = builderState;
  const addonList = Object.entries(addons).map(([name, v]) => ({
    name,
    price: v.price,
    qty: v.qty,
  }));

  addToCart({
    title: meal.title,
    image: meal.image,
    unitBase: meal.price,
    qty,
    addons: addonList,
  });

  closeBuilder();
});

function closeBuilder() {
  builderSheet.classList.remove("show");
  sheetBackdrop.classList.remove("show");
  document.body.classList.remove("sheet-open");
}

sheetClose.addEventListener("click", closeBuilder);
sheetBackdrop.addEventListener("click", closeBuilder);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeBuilder();
});

// ----- INITIAL LOAD -----
renderMenu(menuData);
updateCartCount();
