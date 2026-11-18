const SELLER_PHONE = "60128655181";

const dessertMenu = [
  { id: 1, title: "Burnt Cheesecake Slice", shelf: "cake", price: 9.00, desc: "Kek keju lembut dengan permukaan karamel hangus yang berlemak.", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=80" },
  { id: 2, title: "Nutella Brownie Bites", shelf: "cake", price: 6.50, desc: "Brownie coklat pekat disira dengan limpahan Nutella cair.", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80" },
  { id: 3, title: "Matcha Crepe Cake", shelf: "cake", price: 10.00, desc: "Lapisan crepe tipis dengan krim teh hijau Uji Matcha premium.", img: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=500&q=80" },
  { id: 4, title: "Biscoff Ice Cream Pint", shelf: "icecream", price: 12.50, desc: "Ais krim vanila sejuk bersama serbuk biskut Lotus Biscoff.", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80" },
  { id: 5, title: "Mango Float Deluxe", shelf: "icecream", price: 8.00, desc: "Pencuci mulut sejuk mangga segar bersama biskut dan krim.", img: "https://images.unsplash.com/photo-1517093169722-e42152e33f0a?auto=format&fit=crop&w=500&q=80" }
];

let cart = [];

// Logik Buka Pintu Peti Sejuk
function openFridgeDoor() {
  const door = document.getElementById("fridgeDoor");
  door.classList.add("open-anim");

  // Selepas pintu terbuka, keluar pop-up mesej selepas 0.6 saat
  setTimeout(() => {
    document.getElementById("welcomePopup").classList.remove("hidden");
  }, 600);
}

// Tutup Pop-up dan Masuk ke Menu Peti Sejuk
function closeWelcomePopup() {
  document.getElementById("welcomePopup").classList.add("hidden");
  document.getElementById("fridgeDoorScreen").classList.add("hidden");
  document.getElementById("insideFridgeApp").classList.remove("hidden");
  renderShelves("all");
}

// Butang untuk tutup semula peti sejuk dari dalam
function closeFridgeDoor() {
  document.getElementById("insideFridgeApp").classList.add("hidden");
  document.getElementById("fridgeDoor").classList.remove("open-anim");
  document.getElementById("fridgeDoorScreen").classList.remove("hidden");
}

// Render Menu Mengikut Rak
function renderShelves(filterShelf) {
  const container = document.getElementById("fridgeShelvesContainer");
  const filtered = filterShelf === "all" ? dessertMenu : dessertMenu.filter(d => d.shelf === filterShelf);

  container.innerHTML = filtered.map(item => `
    <div class="dessert-card">
      <div class="card-img-box">
        <span class="shelf-tag">${item.shelf === 'cake' ? '🍰 Kek' : '🍨 Sejuk'}</span>
        <img src="${item.img}" alt="${item.title}" />
      </div>
      <div class="card-body">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="card-footer">
          <span class="price">RM ${item.price.toFixed(2)}</span>
          <button class="add-btn" onclick="addToCart(${item.id})">+ Pilih</button>
        </div>
      </div>
    </div>
  `).join("");
}

// Tab Filter Rak
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".tab-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderShelves(btn.dataset.shelf);
  });
});

// Toast Notification
function showToast(title) {
  const container = document.getElementById("toastContainer");
  if (container.children.length >= 2) container.firstChild.remove();
  const t = document.createElement("div");
  t.className = "toast-item";
  t.textContent = `🍦 ${title} dimasukkan ke bakul!`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

// Logik Troli
function addToCart(id) {
  const item = dessertMenu.find(d => d.id === id);
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
  msg += `*Senarai Dessert:*\n`;

  cart.forEach((item, i) => {
    msg += `${i + 1}. ${item.title} (x${item.qty}) - RM ${(item.price * item.qty).toFixed(2)}\n`;
  });

  msg += `\n*Jumlah Keseluruhan:* ${document.getElementById("cartTotal").textContent}`;

  const url = `https://wa.me/${SELLER_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
});

updateCartUI();