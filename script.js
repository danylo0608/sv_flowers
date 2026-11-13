document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // БУРГЕР-МЕНЮ
  // ==========================================

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("active");

      menuButton.setAttribute("aria-expanded", isOpen);

      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Закрити меню" : "Відкрити меню"
      );

      menuButton.textContent = isOpen ? "✕" : "☰";
    });

    // Закриваємо меню після натискання
    // на пункт навігації
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Відкрити меню");
        menuButton.textContent = "☰";
      });
    });
  }


  // ==========================================
  // ПЕРЕХІД ДО КАТЕГОРІЇ
  // ==========================================

  const categoryButtons = document.querySelectorAll(
    "#categoryNav button"
  );

  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {

      const targetId = button.dataset.target;
      const targetSection = document.getElementById(targetId);

      if (!targetSection) return;

      // Закриваємо всі категорії
      document.querySelectorAll(".catalog-section").forEach(section => {
        const grid = section.querySelector(".product-grid");
        const toggle = section.querySelector(".catalog-title-toggle");
        const icon = section.querySelector(".catalog-title-icon");

        if (grid) {
          grid.classList.remove("collapsed");
          grid.setAttribute("aria-hidden", "false");
        }

        if (toggle) {
          toggle.setAttribute("aria-expanded", "true");
        }

        if (icon) {
          icon.textContent = "−";
        }
      });

      // Плавно прокручуємо до потрібної категорії
      setTimeout(() => {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 50);

    });
  });


  // ==========================================
  // РОЗКРИТТЯ / ЗАКРИТТЯ КАТЕГОРІЙ
  // ==========================================

  const categoryToggles = document.querySelectorAll(
    ".catalog-title-toggle"
  );

  categoryToggles.forEach(toggle => {

    toggle.addEventListener("click", () => {

      const section = toggle.closest(".catalog-section");
      const grid = section.querySelector(".product-grid");
      const icon = toggle.querySelector(".catalog-title-icon");

      if (!grid) return;

      const isOpen = !grid.classList.contains("collapsed");

      if (isOpen) {
        grid.classList.add("collapsed");
        grid.setAttribute("aria-hidden", "true");

        toggle.setAttribute("aria-expanded", "false");

        if (icon) {
          icon.textContent = "+";
        }

      } else {

        grid.classList.remove("collapsed");
        grid.setAttribute("aria-hidden", "false");

        toggle.setAttribute("aria-expanded", "true");

        if (icon) {
          icon.textContent = "−";
        }
      }

    });

  });


  // ==========================================
  // КОПІЮВАННЯ НОМЕРА ТЕЛЕФОНУ
  // ==========================================

  const copyButtons = document.querySelectorAll(".copy-phone");

  copyButtons.forEach(button => {

    button.addEventListener("click", async () => {

      const phone = button.dataset.phone;

      if (!phone) return;

      try {

        await navigator.clipboard.writeText(phone);

        const oldText = button.textContent;

        button.textContent = "Скопійовано ✓";
        button.classList.add("copied");

        setTimeout(() => {
          button.textContent = oldText;
          button.classList.remove("copied");
        }, 2000);

      } catch (error) {

        // Резервний спосіб копіювання
        const input = document.createElement("input");

        input.value = phone;
        document.body.appendChild(input);

        input.select();
        document.execCommand("copy");

        input.remove();

        button.textContent = "Скопійовано ✓";

        setTimeout(() => {
          button.textContent = "Скопіювати";
        }, 2000);
      }

    });

  });


  // ==========================================
  // ПЕРЕГЛЯД ТОВАРУ ТА ЗАМОВЛЕННЯ
  // ==========================================

  const productModal = document.querySelector("#productModal");
  const modalImage = document.querySelector("#modalProductImage");
  const modalName = document.querySelector("#modalProductName");
  const modalPrice = document.querySelector("#modalProductPrice");
  const orderButton = document.querySelector("#productOrderButton");
  const orderContacts = document.querySelector("#productOrderContacts");
  const telegramLink = document.querySelector("#telegramOrderLink");

  // Вкажіть тут справжнє посилання на Telegram магазину.
  // Наприклад: https://t.me/назва_акаунта
  const TELEGRAM_URL = "";

  if (TELEGRAM_URL && telegramLink) {
    telegramLink.href = TELEGRAM_URL;
    telegramLink.target = "_blank";
    telegramLink.rel = "noopener";
    telegramLink.textContent = "Telegram: написати нам";
    telegramLink.classList.remove("is-unavailable");
  } else if (telegramLink) {
    telegramLink.removeAttribute("href");
    telegramLink.classList.add("is-unavailable");
  }

  function closeProductModal() {
    if (!productModal) return;

    productModal.classList.remove("is-open");
    productModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    orderContacts.hidden = true;
    orderButton.textContent = "Замовити";
  }

  document.querySelectorAll(".product-card img").forEach(image => {
    image.addEventListener("click", () => {
      const card = image.closest(".product-card");
      if (!card || !productModal) return;

      const name = card.querySelector(".product-name");
      const price = card.querySelector(".product-price");

      modalImage.src = image.src;
      modalImage.alt = image.alt;
      modalName.textContent = name ? name.textContent.trim() : image.alt;
      modalPrice.textContent = price ? price.textContent.trim() : "";

      orderContacts.hidden = true;
      orderButton.textContent = "Замовити";
      productModal.classList.add("is-open");
      productModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    });
  });

  if (orderButton) {
    orderButton.addEventListener("click", () => {
      orderContacts.hidden = !orderContacts.hidden;
      orderButton.textContent = orderContacts.hidden ? "Замовити" : "Приховати контакти";
    });
  }

  if (productModal) {
    productModal.querySelectorAll("[data-close-modal]").forEach(element => {
      element.addEventListener("click", closeProductModal);
    });
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && productModal && productModal.classList.contains("is-open")) {
      closeProductModal();
    }
  });

});