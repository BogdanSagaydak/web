const CATEGORIES_URL = "https://dummyjson.com/products/categories";
const ALL_PRODUCTS_URL = "https://dummyjson.com/products?limit=0&select=title,price,rating,thumbnail";

function applyLayoutStyles() {
    document.body.style.margin = "0";
    document.body.style.padding = "24px";
    document.body.style.backgroundColor = "#fafafa";
    document.body.style.color = "#1f2328";

    const layout = document.getElementById("catalog-layout");
    layout.style.display = "flex";
    layout.style.alignItems = "flex-start";
    layout.style.gap = "24px";
    layout.style.maxWidth = "1200px";
    layout.style.margin = "0 auto";

    const catCol = document.getElementById("categories-column");
    catCol.style.width = "280px";
    catCol.style.flexShrink = "0";
    catCol.style.display = "flex";
    catCol.style.flexDirection = "column";
    catCol.style.gap = "8px";

    const prodCol = document.getElementById("products-column");
    prodCol.style.flex = "1";
    prodCol.style.display = "flex";
    prodCol.style.flexDirection = "column";
    prodCol.style.gap = "12px";
}

function renderProductsList(products, headingText) {
    const prodCol = document.getElementById("products-column");
    prodCol.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = `${headingText} (${products.length})`;
    heading.style.margin = "0 0 4px 0";
    heading.style.fontSize = "20px";
    prodCol.appendChild(heading);

    if (products.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "Товарів не знайдено.";
        prodCol.appendChild(emptyMsg);
        return;
    }

    products.forEach((item) => {
        const card = document.createElement("div");
        card.style.display = "flex";
        card.style.alignItems = "center";
        card.style.gap = "16px";
        card.style.padding = "14px 16px";
        card.style.border = "1px solid transparent";
        card.style.borderRadius = "8px";
        card.style.backgroundColor = "#ffffff";
        card.style.boxSizing = "border-box";

        const img = document.createElement("img");
        const firstImage = item.thumbnail;
        img.src = firstImage;
        img.alt = item.title;
        img.style.width = "96px";
        img.style.height = "96px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "6px";
        img.style.flexShrink = "0";

        const info = document.createElement("div");
        info.style.display = "flex";
        info.style.flexDirection = "column";
        info.style.gap = "6px";

        const title = document.createElement("h3");
        title.textContent = item.title;
        title.style.margin = "0";
        title.style.fontSize = "16px";

        const price = document.createElement("div");
        price.textContent = `Ціна: $${item.price}`;
        price.style.fontWeight = "600";

        const rating = document.createElement("div");
        rating.textContent = `Рейтинг: ★ ${item.rating}`;
        rating.style.color = "#57606a";
        rating.style.fontSize = "14px";

        info.appendChild(title);
        info.appendChild(price);
        info.appendChild(rating);

        card.appendChild(img);
        card.appendChild(info);
        prodCol.appendChild(card);
    });
}

async function renderCategoryProducts(url, labelText) {
    const prodCol = document.getElementById("products-column");
    prodCol.innerHTML = `<p style="margin: 0; color: #57606a;">Завантаження для «${labelText}»...</p>`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const products = Array.isArray(data.products) ? data.products : [];
        renderProductsList(products, labelText);
    } catch (error) {
        prodCol.innerHTML = `<p style="margin: 0; color: #b3261e;">Не вдалося завантажити товари: ${error.message}</p>`;
    }
}

async function renderCategoriesColumn() {
    const catCol = document.getElementById("categories-column");
    catCol.innerHTML = `<p style="margin: 0; color: #57606a;">Завантаження категорій...</p>`;

    try {
        const response = await fetch(CATEGORIES_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const categories = await response.json();
        catCol.innerHTML = "";

        const title = document.createElement("h2");
        title.textContent = "Категорії";
        title.style.margin = "0 0 4px 0";
        title.style.fontSize = "20px";
        catCol.appendChild(title);

        let activeBlock = null;

        const setActiveBlock = (targetBlock) => {
            if (activeBlock) {
                activeBlock.style.backgroundColor = "#ffffff";
                activeBlock.style.borderColor = "#d3d3d3";
            }
            targetBlock.style.backgroundColor = "#eef2f6";
            targetBlock.style.borderColor = "#8c959f";
            activeBlock = targetBlock;
        };

        const seeAllBtn = document.createElement("button");
        seeAllBtn.type = "button";
        seeAllBtn.textContent = "See All";
        seeAllBtn.style.padding = "10px 14px";
        seeAllBtn.style.border = "1px solid #d3d3d3";
        seeAllBtn.style.borderRadius = "6px";
        seeAllBtn.style.backgroundColor = "#ffffff";
        seeAllBtn.style.color = "#1f2328";
        seeAllBtn.style.cursor = "pointer";
        seeAllBtn.style.fontSize = "14px";
        seeAllBtn.style.fontWeight = "600";
        seeAllBtn.style.textAlign = "left";
        seeAllBtn.style.fontFamily = "inherit";

        const selectAll = () => {
            setActiveBlock(seeAllBtn);
            renderCategoryProducts(ALL_PRODUCTS_URL, "See All");
        };

        seeAllBtn.addEventListener("click", selectAll);
        catCol.appendChild(seeAllBtn);

        categories.forEach((cat, index) => {
            const block = document.createElement("div");
            block.textContent = cat.name;
            block.style.padding = "10px 14px";
            block.style.border = "1px solid #d3d3d3";
            block.style.borderRadius = "6px";
            block.style.backgroundColor = "#ffffff";
            block.style.cursor = "pointer";
            block.style.fontSize = "14px";
            block.style.fontWeight = "500";
            block.style.userSelect = "none";

            const targetUrl = cat.url || `https://dummyjson.com/products/category/${cat.slug}`;

            const selectCategory = () => {
                setActiveBlock(block);
                renderCategoryProducts(targetUrl, cat.name);
            };

            block.addEventListener("click", selectCategory);
            catCol.appendChild(block);

            if (index === 0) {
                selectAll();
            }
        });
    } catch (error) {
        catCol.innerHTML = `<p style="margin: 0; color: #b3261e;">Помилка завантаження категорій: ${error.message}</p>`;
    }
}

function initCatalog() {
    applyLayoutStyles();
    renderCategoriesColumn();
}

document.addEventListener("DOMContentLoaded", initCatalog);
