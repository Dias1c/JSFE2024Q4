import { initializeBurgerMenuHandlers } from "./../../scripts/burger-menu.js";
import { reRenderGifts } from "./../../scripts/gifts.js";

let gifts = [];

// ? Rendering Gifts
fetch("./../../assets/data/all_gifts.json").then(async (resp) => {
  gifts = JSON.parse(await resp.text());

  reRenderGifts({ gifts, elementId: "replace-gifts" });
});

function reRenderGiftsByCategory({ category }) {
  let categoryLowerCase = String(category).toLowerCase();

  if (categoryLowerCase == "all" || !category) {
    reRenderGifts({ gifts, elementId: "replace-gifts" });
    return;
  }

  let filtered = gifts.filter((el) => {
    const elCategoryLowerCase = String(el.category).toLowerCase();
    return elCategoryLowerCase == categoryLowerCase;
  });

  reRenderGifts({ gifts: filtered, elementId: "replace-gifts" });
}

// ? Gifts Tabs Buttons
const giftTabBtns = document.querySelectorAll(
  ".section_gifts__container__tabs__item"
);

giftTabBtns.forEach((btnTab) => {
  const onClick = () => {
    if (btnTab.classList.contains("active")) return;

    const category = btnTab.getAttribute("data-category");
    if (!category) {
      console.error(
        'button attribute "data-category" is empty',
        btnTab,
        category
      );
      return;
    }

    giftTabBtns.forEach((tab) => tab.classList.remove("active"));
    btnTab.classList.add("active");

    reRenderGiftsByCategory({ category });
  };

  btnTab.addEventListener("click", onClick);
});

// ? BurgerMenu
initializeBurgerMenuHandlers({
  elementButtonBurger: document.getElementById("burger-button"),
  elementSectionMenu: document.getElementById("burger-menu"),
  elementsMenuItem: document.querySelectorAll(".block_burger_menu__button"),
});
