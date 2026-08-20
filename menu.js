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
const builderStartNew = document.getElementById("builderStartNew");

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
    { name: "Extra Jollof Rice Scoop", price: 600 },
    { name: "Extra Fried Rice Scoop", price: 600 },
    { name: "Extra Spaghetti Scoop", price: 600 },
  ],
  protein: [
    { name: "Beef", price: 1000 },
    { name: "Fish", price: 1500 },
    { name: "Egg", price: 400 },
    { name: "Ponmo", price: 500 },
    { name: "Small Chicken", price: 1500 },
    { name: "Big Chicken", price: 3000 },
    { name: "Turkey", price: 5000 },
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

// ----- TAKEAWAY PACKAGING FEE -----
// Every plate/meal is packed to go, so a small packaging fee is added
// automatically per plate — not per scoop or per add-on. Kept as one
// shared constant so the menu page, builder, and cart all agree.
const TAKEAWAY_FEE_PER_PLATE = 200;

// ----- BUILD YOUR OWN PLATE -----
// A blank plate with no fixed price — the customer picks whatever
// scoops/protein/sides/drinks they want (e.g. one scoop of jollof +
// one scoop of fried rice) and it all goes into the cart as a single
// combined order line, same as walking up and pointing at a plate.
const buildYourOwnPlate = {
  id: "build-your-own",
  image: "images/jollnd-fried-and-egg.webp",
  title: "Build Your Own Plate",
  price: 0,
  category: "combos",
  type: "build",
  addonGroups: DEFAULT_ADDON_GROUPS,
};

// Build Your Own Plate reuses the same add-on catalog as the meal
// customizer, but the wording there ("Extra Jollof Rice Scoop") only
// makes sense when it's stacked on top of a paid base meal. On a
// blank plate it should just read as what it is: a scoop of jollof.
const BUILD_SCOOP_LABELS = {
  "Extra Jollof Rice Scoop": "A Scoop of Jollof Rice",
  "Extra Fried Rice Scoop": "A Scoop of Fried Rice",
  "Extra Spaghetti Scoop": "A Scoop of Stir Fry Spaghetti",
};

const BUILD_GROUP_LABELS = {
  scoops: "Scoops",
  protein: "Protein",
  sides: "Sides",
  drinks: "Drinks",
};

function addonDisplayName(groupKey, opt, meal) {
  if (meal.type === "build" && groupKey === "scoops" && BUILD_SCOOP_LABELS[opt.name]) {
    return BUILD_SCOOP_LABELS[opt.name];
  }
  return opt.name;
}

function addonGroupLabel(groupKey, meal) {
  return meal.type === "build" ? BUILD_GROUP_LABELS[groupKey] : ADDON_GROUP_LABELS[groupKey];
}

// ----- PLATE DRAFT (lets a build-your-own plate carry over between
// categories, e.g. add a scoop of jollof on the Rice tab, then add
// chicken on the Protein tab, without losing what was already picked) -----
const PLATE_DRAFT_KEY = "papilz_plate_draft";

function getPlateDraft() {
  try {
    const raw = JSON.parse(localStorage.getItem(PLATE_DRAFT_KEY));
    return raw && raw.addons ? raw : null;
  } catch {
    return null;
  }
}

function savePlateDraft(addons, qty) {
  if (!addons || Object.keys(addons).length === 0) {
    localStorage.removeItem(PLATE_DRAFT_KEY);
    return;
  }
  localStorage.setItem(PLATE_DRAFT_KEY, JSON.stringify({ addons, qty }));
}

function clearPlateDraft() {
  localStorage.removeItem(PLATE_DRAFT_KEY);
}

function plateDraftCount(draft) {
  if (!draft) return 0;
  return Object.values(draft.addons || {}).reduce((sum, a) => sum + a.qty, 0);
}

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
  { id: "s21", image: "images/fried-rice.webp", title: "A Scoop of Fried Rice", price: 600, category: "rice" },
  { id: "s22", image: "images/jollof-rice.webp", title: "A Scoop of Jollof Rice", price: 600, category: "rice" },
  { id: "s94", image: "images/stir-fry-spaghetti.webp", title: "A Scoop of Stir Fry Spaghetti", price: 600, category: "spaghetti" },
  { id: "s41", image: "images/cow-meat.webp", title: "Beef", price: 1000, category: "protein" },
  { id: "s42", image: "images/fish.webp", title: "Fish", price: 1500, category: "protein" },
  { id: "s46", image: "images/egg.webp", title: "Egg", price: 400, category: "protein" },
  { id: "s47", image: "images/ponmo.webp", title: "Ponmo", price: 500, category: "protein" },
  { id: "s43", image: "images/chick-lap.webp", title: "Small Chicken", price: 1500, category: "protein" },
  { id: "s44", image: "images/chick-wing.webp", title: "Big Chicken", price: 3000, category: "protein" },
  { id: "s45", image: "images/tur-drum-stick.webp", title: "Turkey", price: 5000, category: "protein" },
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

function computeSignature(title, addons) {
  return JSON.stringify({
    title,
    addons: (addons || []).map((a) => `${a.name}:${a.qty}`).sort(),
  });
}

// Adds a line to the cart. Simple items merge by title; meal bundles merge
// only when title AND chosen add-ons match exactly, since two differently
// customized versions of the same meal are meaningfully different orders.
function addToCart(entry) {
  const cart = getCart();
  const signature = computeSignature(entry.title, entry.addons);

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

// Finds the single cart line that matches this meal, so reopening
// Customize/Build on something already in the cart picks up right where
// it was left (scoops, protein, etc.) instead of starting blank. Only
// returns a match when there's exactly one — if the customer already has
// two differently-built plates of the same meal in their cart, we can't
// guess which one they mean, so we leave it ambiguous and start fresh.
function findCartEntryIndex(meal) {
  const cart = getCart();
  const matches = [];
  cart.forEach((it, i) => {
    if (it.title === meal.title) matches.push(i);
  });
  return matches.length === 1 ? matches[0] : -1;
}

// Reverses addonDisplayName() so a saved cart line's add-on display names
// (e.g. "A Scoop of Jollof Rice") can be matched back to their catalog
// entry (e.g. "Extra Jollof Rice Scoop") when prefilling the builder.
function findCatalogOptByDisplayName(meal, displayName) {
  for (const groupKey of meal.addonGroups) {
    for (const opt of ADDON_CATALOG[groupKey]) {
      if (addonDisplayName(groupKey, opt, meal) === displayName) return opt;
    }
  }
  return null;
}

function buildButtonLabel() {
  const count = plateDraftCount(getPlateDraft());
  return count > 0 ? `Continue my plate · ${count} item${count > 1 ? "s" : ""}` : "Build my plate";
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
      ${item.type === "build" ? '<span class="combo-badge combo-badge-build">Build your own</span>' : ""}
    </div>`;

  const actions =
    item.type === "meal"
      ? `<button class="customize-btn" data-id="${item.id}">Customize · ${naira(item.price)}</button>`
      : item.type === "build"
      ? `<button class="customize-btn" data-id="${item.id}">${buildButtonLabel()}</button>`
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

    if (item.type === "meal" || item.type === "build") {
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
    if (buildYourOwnPlate.title.toLowerCase().includes(term)) {
      filtered = [buildYourOwnPlate, ...filtered];
    }
  } else {
    // Pinned on every tab — Rice, Protein, wherever — not just Meals,
    // since building a plate usually means picking across categories.
    filtered = [buildYourOwnPlate, ...filtered];
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
  let initialAddons = {};
  let initialQty = 1;
  let editIndex = -1;

  if (meal.type === "build") {
    const draft = getPlateDraft();
    if (draft) {
      // An unfinished plate takes priority — it hasn't been added yet.
      initialAddons = draft.addons;
      initialQty = draft.qty || 1;
    } else {
      editIndex = findCartEntryIndex(meal);
    }
  } else {
    editIndex = findCartEntryIndex(meal);
  }

  if (editIndex !== -1) {
    const existing = getCart()[editIndex];
    initialQty = existing.qty;
    initialAddons = {};
    (existing.addons || []).forEach((a) => {
      const opt = findCatalogOptByDisplayName(meal, a.name);
      const key = opt ? opt.name : a.name;
      initialAddons[key] = { price: a.price, qty: a.qty, label: a.name };
    });
  }

  builderState = { meal, qty: initialQty, addons: initialAddons, editIndex };

  builderImg.src = meal.image;
  builderImg.alt = meal.title;
  builderTitle.textContent = meal.title;
  builderBasePrice.textContent =
    meal.type === "build"
      ? "No base charge — pick your own scoops, protein, sides and drinks"
      : `Base price ${naira(meal.price)}`;
  builderQtyEl.textContent = String(initialQty);
  builderStartNew.hidden = meal.type !== "build";

  addonGroupsEl.innerHTML = meal.addonGroups
    .map((groupKey) => {
      const items = ADDON_CATALOG[groupKey];
      const rows = items
        .map((opt, i) => {
          const displayName = addonDisplayName(groupKey, opt, meal);
          const startQty = builderState.addons[opt.name]?.qty || 0;
          return `
          <div class="addon-row" data-group="${groupKey}" data-index="${i}">
            <div class="addon-info">
              <span class="addon-name">${displayName}</span>
              <span class="addon-price">+${naira(opt.price)} each</span>
            </div>
            <div class="addon-stepper">
              <button class="stepbtn addon-minus" aria-label="Remove one ${displayName}">−</button>
              <span class="quantity">${startQty}</span>
              <button class="stepbtn addon-plus" aria-label="Add one ${displayName}">+</button>
            </div>
          </div>`;
        })
        .join("");

      return `
        <div class="addon-group">
          <h3>${addonGroupLabel(groupKey, meal)}</h3>
          ${rows}
        </div>`;
    })
    .join("");

  addonGroupsEl.querySelectorAll(".addon-row").forEach((row) => {
    const groupKey = row.dataset.group;
    const idx = Number(row.dataset.index);
    const opt = ADDON_CATALOG[groupKey][idx];
    const displayName = addonDisplayName(groupKey, opt, meal);
    const qtyEl = row.querySelector(".quantity");
    const minus = row.querySelector(".addon-minus");
    const plus = row.querySelector(".addon-plus");

    minus.addEventListener("click", () => {
      const current = builderState.addons[opt.name]?.qty || 0;
      if (current <= 0) return;
      setAddonQty(opt, current - 1, qtyEl, displayName);
    });

    plus.addEventListener("click", () => {
      const current = builderState.addons[opt.name]?.qty || 0;
      setAddonQty(opt, current + 1, qtyEl, displayName);
    });
  });

  updateBuilderTotal();
  document.body.classList.add("sheet-open");
  sheetBackdrop.classList.add("show");
  requestAnimationFrame(() => builderSheet.classList.add("show"));
}

function setAddonQty(opt, qty, qtyEl, displayName) {
  if (qty <= 0) {
    delete builderState.addons[opt.name];
    qtyEl.textContent = "0";
  } else {
    builderState.addons[opt.name] = { price: opt.price, qty, label: displayName };
    qtyEl.textContent = qty;
  }
  updateBuilderTotal();
  saveDraftIfBuild();
}

function saveDraftIfBuild() {
  if (!builderState || builderState.meal.type !== "build") return;
  savePlateDraft(builderState.addons, builderState.qty);
}

function resetBuilderAddons() {
  if (!builderState) return;
  builderState.addons = {};
  builderState.qty = 1;
  builderState.editIndex = -1;
  builderQtyEl.textContent = "1";
  addonGroupsEl.querySelectorAll(".addon-row .quantity").forEach((el) => (el.textContent = "0"));
  updateBuilderTotal();
  clearPlateDraft();
  showToast("Started a fresh plate");
}

function updateBuilderTotal() {
  const addonsTotal = Object.values(builderState.addons).reduce(
    (sum, a) => sum + a.price * a.qty,
    0
  );
  const unit = builderState.meal.price + addonsTotal;
  builderTotalEl.textContent = naira(unit * builderState.qty);

  const label = builderState.editIndex !== -1 ? "Update cart" : "Add to cart";
  builderAddBtn.childNodes[0].textContent = `${label} · `;
}

builderMinus.addEventListener("click", () => {
  if (builderState.qty > 1) {
    builderState.qty--;
    builderQtyEl.textContent = builderState.qty;
    updateBuilderTotal();
    saveDraftIfBuild();
  }
});

builderPlus.addEventListener("click", () => {
  builderState.qty++;
  builderQtyEl.textContent = builderState.qty;
  updateBuilderTotal();
  saveDraftIfBuild();
});

builderStartNew.addEventListener("click", resetBuilderAddons);

builderAddBtn.addEventListener("click", () => {
  const { meal, qty, addons, editIndex } = builderState;
  const addonList = Object.entries(addons).map(([name, v]) => ({
    name: v.label || name,
    price: v.price,
    qty: v.qty,
  }));

  if (meal.type === "build" && addonList.length === 0) {
    showToast("Pick at least one scoop, protein, side or drink first");
    return;
  }

  if (editIndex !== -1) {
    // Editing a line that's already in the cart (e.g. just bumped the qty
    // to double it) — update it in place instead of adding a second,
    // possibly mismatched line.
    const cart = getCart();
    if (cart[editIndex]) {
      cart[editIndex] = {
        ...cart[editIndex],
        title: meal.title,
        image: meal.image,
        unitBase: meal.price,
        qty,
        addons: addonList,
        _sig: computeSignature(meal.title, addonList),
      };
      setCart(cart);
      bumpCartIcon();
      showToast(`Updated ${meal.title} in cart`);
    } else {
      addToCart({ title: meal.title, image: meal.image, unitBase: meal.price, qty, addons: addonList });
    }
  } else {
    addToCart({
      title: meal.title,
      image: meal.image,
      unitBase: meal.price,
      qty,
      addons: addonList,
    });
  }

  if (meal.type === "build") clearPlateDraft();

  closeBuilder();
});

function closeBuilder() {
  const wasBuild = builderState && builderState.meal.type === "build";
  builderSheet.classList.remove("show");
  sheetBackdrop.classList.remove("show");
  document.body.classList.remove("sheet-open");
  if (wasBuild) applyFilters();
}

sheetClose.addEventListener("click", closeBuilder);
sheetBackdrop.addEventListener("click", closeBuilder);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeBuilder();
});

// ----- INITIAL LOAD -----
applyFilters();
updateCartCount();
