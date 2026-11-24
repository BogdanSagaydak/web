class Product {
    constructor(name, category, amount = 0, image = "") {
        this.name = name;
        this.category = category;
        this.amount = Number(amount) || 0;
        this.image = image;
    }

    addToBasket() {
        console.log(`Product with name ${this.name} has been added to the basket`);
    }
}

class Shoe extends Product {
    constructor(name, category, amount, image, size = null) {
        super(name, category, amount, image);
        this.size = size;
    }
}

class Grocerie extends Product {
    constructor(name, category, amount, image, expiresInDays = null) {
        super(name, category, amount, image);
        this.expiresInDays = expiresInDays;
    }
}

function productFactory(data) {
    if (!data || typeof data !== "object") {
        throw new Error("Некоректні дані товару для productFactory");
    }

    const { name, category, amount, image } = data;

    if (category === "Shoe") {
        return new Shoe(name, category, amount, image, data.size ?? null);
    }

    if (category === "Grocerie") {
        return new Grocerie(name, category, amount, image, data.expiresInDays ?? null);
    }
    throw new Error(`Невідома категорія товару: ${category}`);
}

class Basket {
    constructor() {
        this.products = [];
    }

    findItemIndex(product) {
        return this.products.findIndex((entry) => entry.product === product);
    }

    add(product, quantity = 1) {
        if (!product || quantity <= 0) return null;

        const now = new Date();
        const formattedTime = now.toLocaleString("uk-UA");
        const existingIndex = this.findItemIndex(product);

        if (existingIndex !== -1) {
            this.products[existingIndex].quantity += quantity;
            this.products[existingIndex].addedAt = formattedTime;
            product.addToBasket();
            return this.products[existingIndex];
        }

        const record = {
            product,
            quantity,
            addedAt: formattedTime
        };

        this.products.push(record);
        product.addToBasket();
        return record;
    }

    removeOne(product) {
        const idx = this.findItemIndex(product);
        if (idx === -1) return false;

        this.products[idx].quantity -= 1;
        product.amount += 1;

        if (this.products[idx].quantity <= 0) {
            this.products.splice(idx, 1);
        }
        return true;
    }

    cancelOrderItem(product) {
        const idx = this.findItemIndex(product);
        if (idx === -1) return false;

        product.amount += this.products[idx].quantity;
        this.products.splice(idx, 1);
        return true;
    }

    getItem(product) {
        return this.products.find((entry) => entry.product === product) || null;
    }
}

class Store {
    constructor() {
        this.products = [];
        this.basket = new Basket();
    }

    fillStoreWithProducts(jsonData) {
        if (!Array.isArray(jsonData)) {
            throw new Error("jsonData має бути масивом");
        }
        this.products = jsonData.map((item) => productFactory(item));
    }

    addProductToBasket(productName, quantity = 1) {
        const product = this.products.find((p) => p.name === productName);
        if (!product) {
            console.warn(`Товар "${productName}" не знайдено в магазині`);
            return false;
        }

        if (quantity <= 0 || product.amount < quantity) {
            console.warn(`Недостатньо товару "${productName}" на складі`);
            return false;
        }

        product.amount -= quantity;
        this.basket.add(product, quantity);
        return true;
    }

    decreaseInBasket(productName) {
        const product = this.products.find((p) => p.name === productName);
        if (!product) return false;
        return this.basket.removeOne(product);
    }

    cancelProductOrder(productName) {
        const product = this.products.find((p) => p.name === productName);
        if (!product) return false;
        return this.basket.cancelOrderItem(product);
    }
}


function renderProductsList(store, containerId = "products-container") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.gap = "16px";

    store.products.forEach((product) => {
        const basketEntry = store.basket.getItem(product);
        const inBasketQty = basketEntry ? basketEntry.quantity : 0;
        const isInBasket = inBasketQty > 0;

        const card = document.createElement("div");
        card.className = "product-card";
        card.style.width = "70%";
        card.style.height = "300px";
        card.style.border = "1px solid #d3d3d3";
        card.style.borderRadius = "8px";
        card.style.padding = "16px";
        card.style.boxSizing = "border-box";
        card.style.display = "flex";
        card.style.alignItems = "center";
        card.style.gap = "20px";
        card.style.backgroundColor = "#fff";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        img.style.width = "220px";
        img.style.height = "220px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "6px";

        const info = document.createElement("div");
        info.style.flex = "1";
        info.style.display = "flex";
        info.style.flexDirection = "column";
        info.style.gap = "8px";

        const title = document.createElement("h3");
        title.textContent = product.name;
        title.style.margin = "0";

        const meta = document.createElement("div");
        meta.textContent = `Категорія: ${product.category} | Залишок на складі: ${product.amount}`;

        const availability = document.createElement("div");
        const isAvailable = product.amount > 0;
        availability.textContent = isAvailable ? "є в наявності" : "немає в наявності";
        availability.style.fontWeight = "600";
        availability.style.color = isAvailable ? "#1b7a3d" : "#b3261e";

        const controls = document.createElement("div");
        controls.style.display = "flex";
        controls.style.flexWrap = "wrap";
        controls.style.alignItems = "center";
        controls.style.gap = "8px";
        controls.style.marginTop = "8px";

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.textContent = isInBasket ? "Додати ще одиницю" : "Додати у кошик";
        addBtn.disabled = product.amount <= 0;
        addBtn.addEventListener("click", () => {
            if (store.addProductToBasket(product.name, 1)) {
                renderProductsList(store, containerId);
            }
        });
        controls.appendChild(addBtn);

        if (isInBasket) {
            const removeOneBtn = document.createElement("button");
            removeOneBtn.type = "button";
            removeOneBtn.textContent = "Викласти одиницю";
            removeOneBtn.addEventListener("click", () => {
                if (store.decreaseInBasket(product.name)) {
                    renderProductsList(store, containerId);
                }
            });

            const cancelBtn = document.createElement("button");
            cancelBtn.type = "button";
            cancelBtn.textContent = "Скасувати замовлення";
            cancelBtn.addEventListener("click", () => {
                if (store.cancelProductOrder(product.name)) {
                    renderProductsList(store, containerId);
                }
            });

            controls.appendChild(removeOneBtn);
            controls.appendChild(cancelBtn);
        }

        info.appendChild(title);
        info.appendChild(meta);
        info.appendChild(availability);
        info.appendChild(controls);

        if (isInBasket) {
            const basketStatus = document.createElement("div");
            basketStatus.style.marginTop = "8px";
            basketStatus.style.padding = "8px 12px";
            basketStatus.style.backgroundColor = "#f4f6f8";
            basketStatus.style.borderRadius = "6px";
            basketStatus.style.fontSize = "14px";
            basketStatus.textContent =
                `у кошику | Кількість: ${basketEntry.quantity} | Час додавання: ${basketEntry.addedAt}`;
            info.appendChild(basketStatus);
        }

        card.appendChild(img);
        card.appendChild(info);
        container.appendChild(card);
    });
}



const originalFetch = window.fetch.bind(window);
window.fetch = async (url, options) => {
    if (url === "lab9.json") {
        const mockData = [
  {
    "name": "Кросівки Classic Runner",
    "category": "Shoe",
    "amount": 5,
    "image": "img/lab9-1.jpg",
    "size": 42
  },
  {
    "name": "Кеди Trekking Pro",
    "category": "Shoe",
    "amount": 3,
    "image": "img/lab9-2.jpg",
    "size": 43
  },
  {
    "name": "Кросівки Urban Canvas",
    "category": "Shoe",
    "amount": 8,
    "image": "img/lab9-3.jpg",
    "size": 40
  },
  {
    "name": "Кросівки City Style",
    "category": "Shoe",
    "amount": 0,
    "image": "img/lab9-4.jpg",
    "size": 41
  },
  {
    "name": "Кросівки Summer Breeze",
    "category": "Shoe",
    "amount": 6,
    "image": "img/lab9-5.jpg",
    "size": 39
  },
  {
    "name": "Кросівки Easy Walk",
    "category": "Shoe",
    "amount": 4,
    "image": "img/lab9-6.jpg",
    "size": 42
  },
  {
    "name": "Сир",
    "category": "Grocerie",
    "amount": 12,
    "image": "img/lab9-7.jpg",
    "expiresInDays": 21
  },
  {
    "name": "Молоко",
    "category": "Grocerie",
    "amount": 7,
    "image": "img/lab9-8.jpg",
    "expiresInDays": 14
  },
  {
    "name": "Плитка шоколаду",
    "category": "Grocerie",
    "amount": 2,
    "image": "img/lab9-9.jpg",
    "expiresInDays": 360
  },
  {
    "name": "Яблука",
    "category": "Grocerie",
    "amount": 0,
    "image": "img/lab9-10.jpg",
    "expiresInDays": 14
  }
];
        return new Response(JSON.stringify(mockData), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
    return originalFetch(url, options);
};

async function initStore() {
    const response = await fetch("lab9.json");
    const data = await response.json();

    const store = new Store();
    store.fillStoreWithProducts(data);
    renderProductsList(store, "products-container");
}

document.addEventListener("DOMContentLoaded", initStore);