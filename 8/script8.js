const tab1 = document.getElementById("tab1");
const tab2 = document.getElementById("tab2");
const tab3 = document.getElementById("tab3");
const tab4 = document.getElementById("tab4");
const tab5 = document.getElementById("tab5");
const box = document.getElementById("contentBox");
const boxText = document.getElementById("contentBoxText");

const BASE_FONT_SIZE = "32px";
const BASE_COLOR = "#ffffff";
const BASE_FONT_FAMILY = "sans-serif";

function resetTextToBase() {
  boxText.style.fontSize = BASE_FONT_SIZE;
  boxText.style.color = BASE_COLOR;
  boxText.style.fontFamily = BASE_FONT_FAMILY;
}

tab1.addEventListener("click", () => {
  resetTextToBase();
  boxText.textContent = "Tab 1";
  boxText.style.fontSize = "52px";
  boxText.style.fontFamily = "Georgia, serif";
  box.style.backgroundImage = `url("tab1.jpg")`;
});

tab2.addEventListener("click", () => {
  resetTextToBase();
  boxText.textContent = "Tab 2";

  boxText.style.fontFamily = "'Courier New', monospace";
  box.style.backgroundImage = `url("tab2.jpg")`;
});

tab3.addEventListener("click", () => {
  resetTextToBase();
  boxText.textContent = "Tab 3";
  boxText.style.fontSize = "72px";
  boxText.style.color = "darkgreen";
  boxText.style.fontFamily = "Trebuchet MS, sans-serif";
  box.style.backgroundImage = `url("tab3.jpg")`;
});

tab4.addEventListener("click", () => {
  resetTextToBase();
  boxText.textContent = "Tab 4";
  boxText.style.color = "#000000";
  boxText.style.fontFamily = "Times New Roman, serif";
  box.style.backgroundImage = `url("tab4.jpg")`;
});

tab5.addEventListener("click", () => {
  resetTextToBase();
  boxText.textContent = "Tab 5";

  boxText.style.fontFamily = "Verdana, sans-serif";
  box.style.backgroundImage = `url("tab5.jpg")`;
});







var slideIndex = 1;

showSlides(slideIndex);

function plusSlide() {
    showSlides(slideIndex += 1);
}

function minusSlide() {
    showSlides(slideIndex -= 1); 
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("item");
    let dots = document.getElementsByClassName("slider-dots_item");
    if (n > slides.length) {
      slideIndex = 1
    }

    if (n < 1) {
        slideIndex = slides.length
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}







const budgetInput = document.getElementById("budget");
const budgetValue = document.getElementById("budgetValue");

function updateBudgetLabel() {
    budgetValue.textContent = `${budgetInput.value} грн`;
}
updateBudgetLabel();
budgetInput.addEventListener("input", updateBudgetLabel);



const form = document.getElementById("furnitureForm");
const statusEl = document.getElementById("formStatus");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const lastName = document.getElementById("lastName").value.trim();
    const firstName = document.getElementById("firstName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim().replace(/[\s()-]/g, "");
    const address = document.getElementById("address").value.trim();
    const category = form.querySelector('input[name="category"]:checked');

    const errors = [];

    if (lastName.length < 2) {
      errors.push("Прізвище має містити щонайменше 2 символи.");
    }

    if (firstName.length < 2) {
      errors.push("Ім'я має містити щонайменше 2 символи.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      errors.push("Вкажіть коректний Email (наприклад, yourmail@gmail.com).");
    }

    if (!/^(?:\+380|0)\d{9}$/.test(phone)) {
      errors.push("Вкажіть номер телефону у форматі +380501234567 або 0501234567.");
    }

    if (address.length < 5) {
      errors.push("Вкажіть адресу доставки (мінімум 5 символів).");
    }

    if (!category) {
      errors.push("Оберіть категорію меблів.");
    }

    if (errors.length > 0) {
      statusEl.style.color = "#c62828";
      statusEl.textContent =
        "Виявлено помилки:\n" + errors.map((err, i) => `${i + 1}. ${err}`).join("\n");
      return;
    }

    statusEl.style.color = "#2e7d32";
    statusEl.textContent = "Дані коректні! Заявку на підбір меблів успішно сформовано.";
  });


form.addEventListener("reset", () => {
  budgetValue.textContent = `${budgetInput.value} грн`;
    statusEl.textContent = "";
});
