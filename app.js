const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const PRODUCTS = [
  { id: 1, name: "Грецкий орех", price: 180, img: "https://images.unsplash.com/photo-1563412955-9d4d6c2b0c6b?w=400" },
  { id: 2, name: "Миндаль",      price: 220, img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400" },
  { id: 3, name: "Курага",       price: 150, img: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=400" },
  { id: 4, name: "Чернослив",    price: 140, img: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400" },
  { id: 5, name: "Яблоки",       price: 60,  img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400" },
  { id: 6, name: "Морковь",      price: 40,  img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400" }
];

const VOLUMES = [100, 250, 500, 1000];
let cart = [];
let sel = {};

function render() {
  const box = document.getElementById("catalog");
  box.innerHTML = "";
  PRODUCTS.forEach(p => {
    const v = sel[p.id] || 100;
    const total = Math.round(p.price * v / 100);
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}">
      <h3>${p.name}</h3>
      <p>${total} ₽ / ${v} г</p>
      <div class="volumes">
        ${VOLUMES.map(x => `<button class="${x===v?'active':''}" data-id="${p.id}" data-v="${x}">${x}г</button>`).join("")}
      </div>
      <button class="add" data-id="${p.id}">В корзину</button>
    `;
    box.appendChild(card);
  });

  document.querySelectorAll(".volumes button").forEach(b => {
    b.onclick = () => {
      sel[b.dataset.id] = +b.dataset.v;
      render();
    };
  });

  document.querySelectorAll(".add").forEach(b => {
    b.onclick = () => {
      const p = PRODUCTS.find(x => x.id === +b.dataset.id);
      const v = sel[p.id] || 100;
      cart.push({ name: p.name, volume: v, price: Math.round(p.price * v / 100) });
      updateMainButton();
    };
  });
}

function updateMainButton() {
  if (cart.length === 0) return;
  const total = cart.reduce((s, i) => s + i.price, 0);
  tg.MainButton.setText(`Оформить • ${total} ₽`);
  tg.MainButton.show();
  tg.MainButton.onClick(() => {
    tg.sendData(JSON.stringify({ items: cart, total }));
    tg.close();
  });
}

render();
