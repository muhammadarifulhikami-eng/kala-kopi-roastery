const WA_NUMBER = "6287877590663";
const cart = [];

const formatRp = (n) => "Rp " + n.toLocaleString("id-ID");

function renderCart() {
  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);

  countEl.textContent = totalQty;
  totalEl.textContent = formatRp(totalPrice);

  if (!cart.length) {
    itemsEl.innerHTML = `<p style="color:#695549;font-size:13.5px;">Keranjang Anda masih kosong. Silakan pilih kopi favorit Anda.</p>`;
    return;
  }

  itemsEl.innerHTML = cart
    .map(
      (item, idx) => `
      <div class="cart-row">
        <div>
          <strong>${item.name}</strong>
          <small>${formatRp(item.price * item.qty)}</small>
        </div>
        <div class="qty-controls">
          <button type="button" onclick="updateQty(${idx}, -1)">-</button>
          <span>${item.qty}</span>
          <button type="button" onclick="updateQty(${idx}, 1)">+</button>
        </div>
      </div>`
    )
    .join("");
}

window.updateQty = function (idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
};

const cartBackdrop = document.getElementById("cartBackdrop");
function openCart() {
  renderCart();
  cartBackdrop.classList.add("open");
  cartBackdrop.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartBackdrop.classList.remove("open");
  cartBackdrop.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".btn-add-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-id");
    const name = btn.getAttribute("data-name");
    const price = Number(btn.getAttribute("data-price"));
    const existing = cart.find((i) => i.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, name, price, qty: 1 });
    openCart();
  });
});

document.getElementById("openCartBtn")?.addEventListener("click", openCart);
document.getElementById("closeCartBtn")?.addEventListener("click", closeCart);
cartBackdrop?.addEventListener("click", (e) => {
  if (e.target === cartBackdrop) closeCart();
});

document.getElementById("checkoutWaBtn")?.addEventListener("click", () => {
  if (!cart.length) return;
  const lines = cart.map((i) => `- ${i.name} x${i.qty} = ${formatRp(i.price * i.qty)}`).join("%0A");
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const msg = `Halo Kala Kopi Roastery,%0ASaya ingin memesan:%0A${lines}%0A%0ATotal: ${formatRp(total)}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank", "noopener");
});

// Category filter
function filterCoffees(cat) {
  document.querySelectorAll(".shop-tab").forEach((t) => {
    t.classList.toggle("active", t.getAttribute("data-cat") === cat);
  });
  document.querySelectorAll(".prod-card").forEach((card) => {
    const c = card.getAttribute("data-cat") || "";
    card.classList.toggle("hidden", cat !== "all" && !c.includes(cat));
  });
}

document.querySelectorAll(".shop-tab").forEach((tab) => {
  tab.addEventListener("click", () => filterCoffees(tab.getAttribute("data-cat")));
});

document.querySelectorAll(".cat-card").forEach((card) => {
  card.addEventListener("click", () => {
    filterCoffees(card.getAttribute("data-filter"));
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  });
});

// Brew Guide Modal
const infoModal = document.getElementById("infoModal");
function openBrewGuide(e) {
  if (e) e.preventDefault();
  document.getElementById("infoKicker").textContent = "PANDUAN SEDUH";
  document.getElementById("infoTitle").textContent = "Rekomendasi Seduh Kala Kopi";
  document.getElementById("infoBody").innerHTML = `
    <p><strong>1. V60 Pour Over (Single Origin):</strong><br />15g kopi giling medium · 240ml air 92°C · rasio 1:16 · waktu seduh 2:30 menit.</p>
    <p><strong>2. Espresso (House Blend):</strong><br />18g kopi giling halus · hasil 36ml dalam 27–30 detik.</p>
    <p><strong>3. Cold Brew:</strong><br />50g kopi giling kasar · 500ml air dingin · rendam 14 jam di kulkas.</p>
  `;
  infoModal.classList.add("open");
}

["openBrewNav", "openBrewStory", "footerBrewLink"].forEach((id) => {
  document.getElementById(id)?.addEventListener("click", openBrewGuide);
});

document.getElementById("closeInfoBtn")?.addEventListener("click", () => infoModal.classList.remove("open"));
infoModal?.addEventListener("click", (e) => {
  if (e.target === infoModal) infoModal.classList.remove("open");
});

// Newsletter
document.getElementById("nlForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("nlEmail").value.trim();
  alert(`Terima kasih! Email ${email} telah terdaftar untuk info panen & promo Kala Kopi.`);
  e.target.reset();
});

const mobileToggle = document.getElementById("mobileToggle");
const mobileDrawer = document.getElementById("mobileDrawer");
mobileToggle?.addEventListener("click", () => mobileDrawer.classList.toggle("open"));
mobileDrawer?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => mobileDrawer.classList.remove("open"));
});
renderCart();
