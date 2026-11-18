const SELLER_PHONE = "60128655181";

// Kategori produk dipecahkan mengikut Rak Kaca Utama (Shelf) dan Rak Pintu (Door)
const fridgeInventory = {
  mainShelves: [
    {
      shelfId: 1,
      label: "RAK KACA ATAS • PREMIUM CAKES",
      items: [
        { id: 1, title: "Burnt Cheesecake", price: 9.00, desc: "Kek keju lembut karamel hangus.", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80" },
        { id: 2, title: "Matcha Crepe Cake", price: 10.00, desc: "Kek lapis crepe teh hijau premium.", img: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=500&q=80" }
      ]
    },
    {
      shelfId: 2,
      label: "RAK KACA TENGAH • BROWNIES & PASTRY",
      items: [
        { id: 3, title: "Nutella Brownies", price: 6.50, desc: "Brownie coklat limpahan Nutella.", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80" },
        { id: 4, title: "Red Velvet Slice", price: 8.50, desc: "Kek red velvet bersalut krim keju.", img: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=500&q=80" }
      ]
    }
  ],
  doorRacks: [
    {
      rackId: 1,
      label: "RAK PINTU ATAS • COLD DRINKS",
      items: [
        { id: 5, title: "Caramel Macchiato", price: 7.50, desc: "Kopi sejuk botol berkaramel.", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80" },
        { id: 6, title: "Matcha Oat Latte", price: 8.00, desc: "Teh hijau susu oat sejuk.", img: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=500&q=80" }
      ]
    },
    {
      rackId: 2,
      label: "RAK PINTU BAWAH • ICE CREAM & DESSERT",
      items: [
        { id: 7, title: "Biscoff Ice Cream", price: 12.50, desc: "Ais krim sejuk biskut Biscoff.", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80" },
        { id: 8, title: "Mango Float Deluxe", price: 8.00, desc: "Pencuci mulut sejuk mangga segar.", img: "https://images.unsplash.com/photo-1517093169722-e42152e33f0a?auto=format&fit=crop&w=500&q=80" }
      ]
    }
  ]
};

let cart = [];

// Logik Buka Pintu Peti Sejuk
function openFridgeDoor() {
  const door = document.getElementById("fridgeDoor");
  door.classList.add("open-anim");

  setTimeout(() => {
    document.getElementById("welcomePopup").classList.remove("hidden");
  }, 600);
}

function closeWelcomePopup() {
  document.getElementById("welcomePopup").classList.add("hidden");
  document.getElementById("fridgeDoorScreen").classList.add("hidden");
  document.getElementById("insideFridgeApp").classList.remove("hidden");
  renderFridgeInterior("all");
}

function closeFridgeDoor() {
  document.getElementById("insideFridgeApp").classList.add("hidden");
  document.getElementById("fridgeDoor").classList.remove("open-anim");
  document.getElementById("fridgeDoorScreen").classList.remove("hidden");
}

// Render Kandungan Dalaman Peti Sejuk
function renderFridgeInterior(filterType) {
  const mainContainer = document.getElementById("mainShelvesContainer");
  const doorContainer = document.getElementById("doorShelvesContainer");

  const showMain = filterType === "all" || filterType === "shelf";
  const showDoor = filterType === "all" || filterType === "door";

  // Papar Rak Kaca Utama
  mainContainer.innerHTML = showMain ? fridgeInventory.mainShelves.map(shelf => `
    <div class="glass-shelf">
      <span class="shelf-label-tag">${shelf.label}</span>
      ${shelf.items.map(createItemHTML).join("")}
    </div>
  `).join("") : "";

  // Papar Rak Pintu Peti Sejuk
  doorContainer.innerHTML = showDoor ? fridgeInventory.doorRacks.map(rack => `
    <div class="door-pocket">
      <span class="pocket-title">${rack.label}</span>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 8px;">
        ${rack.items.map(createItemHTML).join("")}
      </div>
    </div>
  `).join("") : "";

  if (!showMain) mainContainer.innerHTML = `<p style="color:#64748b; font-size:0.85rem; text-align:center; padding:20px;">Rak kaca utama disembunyikan.</p>`;
  if (!showDoor) doorContainer.innerHTML = `<p style="color:#64748b; font-size:0.85rem; text-align:center; padding:20px;">Rak pintu disembunyikan.</p>`;
}

function createItemHTML(item) {
  return `
    <div class="fridge-item" onclick="handleItemClick(this)">
      <img src="${item.img}" alt="${item.title}" class="f-img" />
      <div class="f-title">${item.title}</div>
      <div class="f-price">RM ${item.price.toFixed(2)}</div>

      <!-- Kad detail timbul bila tekan/klik -->
      <div class="hover-detail-card" onclick="event.stopPropagation()">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        <div class="card-bottom">
          <strong>RM ${item.price.toFixed(2)}</strong>
          <button class="add-btn" onclick="addToCart(${item.id})">+ Pilih</button>
        </div>
      </div>
    </div>
  `;
}

// Sokongan ketuk untuk telefon pintar
function handleItemClick(el) {
  document.querySelectorAll(".fridge-item.active-touch").forEach(item => {
    if (item !== el) item.classList.remove("active-touch");
  });
  el.classList.toggle("active-touch");
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".fridge-item")) {
    document.querySelectorAll(".fridge-item.active-touch").forEach(item => {
      item.classList.remove("active-touch");
    });
  }
});

// Tab Penapis Rak
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".tab-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderFridgeInterior(btn.dataset.shelf);
  });
});

// Toast & Cart Logik
function showToast(title) {
  const container = document.getElementById("toastContainer");
  if (container.children.length >= 2) container.firstChild.remove();
  const t = document.createElement("div");
  t.className = "toast-item";
  t.textContent = `🍦 ${title} dimasukkan ke bakul!`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function getAllItems() {
  const main = fridgeInventory.mainShelves.flatMap(s => s.items);
  const door = fridgeInventory.doorRacks.flatMap(r => r.items);
  return [...main, ...door];
}

function addToCart(id) {
  const item = getAllItems().find(i => i.id === id);
  if (!item) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  showToast(item.title);
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cartCount").textContent = totalQty;

  const container = document.getElementById("cartItems");
  const totalElem = document.getElementById("cartTotal");

  if (cart.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#64748b; margin-top:40px;">Bakul kosong. Jom pilih dessert dalam peti sejuk!</p>`;
    totalElem.textContent = "RM 0.00";
    return;
  }

  container.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <h4>${item.title}</h4>
        <p style="font-size:0.78rem; color:#64748b;">RM ${item.price.toFixed(2)} x ${item.qty}</p>
      </div>
      <div class="qty-box">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    container.appendChild(row);
  });

  const fee = document.getElementById("deliveryType").value.includes("COD") ? 1.00 : 0.00;
  totalElem.textContent = `RM ${(subtotal + fee).toFixed(2)}`;
}

document.getElementById("deliveryType").addEventListener("change", updateCartUI);

// Drawer Kawalan
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCart() { cartDrawer.classList.add("open"); cartOverlay.classList.add("open"); }
function closeCart() { cartDrawer.classList.remove("open"); cartOverlay.classList.remove("open"); }

document.getElementById("openCartBtn").addEventListener("click", openCart);
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Checkout WhatsApp
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Sila pilih sekurang-kurangnya satu dessert.");
    return;
  }
  const name = document.getElementById("custName").value.trim();
  if (!name) {
    alert("Sila masukkan nama anda.");
    document.getElementById("custName").focus();
    return;
  }

  let msg = `*ORDER DARI SWEETFRIDGE DESSERT*\n\n`;
  msg += `*Nama:* ${name}\n`;
  msg += `*Kaedah:* ${document.getElementById("deliveryType").value}\n\n`;
  msg += `*Senarai Dessert (Dari Peti Sejuk):*\n`;

  cart.forEach((item, i) => {
    msg += `${i + 1}. ${item.title} (x${item.qty}) - RM ${(item.price * item.qty).toFixed(2)}\n`;
  });

  msg += `\n*Jumlah Keseluruhan:* ${document.getElementById("cartTotal").textContent}`;

  const url = `https://wa.me/${SELLER_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
});

updateCartUI();
