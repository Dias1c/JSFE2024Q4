const openBurgerMenu = ({ elementButtonBurger, elementSectionMenu }) => {
  elementButtonBurger.classList.add("active");
  elementSectionMenu.classList.add("active");
  document.body.style.overflowY = "hidden";
};

const closeBurgerMenu = ({ elementButtonBurger, elementSectionMenu }) => {
  elementButtonBurger.classList.remove("active");
  elementSectionMenu.classList.remove("active");
  document.body.style.overflowY = "auto";
};

const handleClickBurgerButton = ({
  elementButtonBurger,
  elementSectionMenu,
}) => {
  const isActive = elementButtonBurger.classList.contains("active");
  if (isActive) {
    closeBurgerMenu({
      elementButtonBurger,
      elementSectionMenu,
    });
    return;
  }
  openBurgerMenu({
    elementButtonBurger,
    elementSectionMenu,
  });
};

export const initializeBurgerMenuHandlers = ({
  elementButtonBurger,
  elementSectionMenu,
  elementsMenuItem,
}) => {
  if (!elementButtonBurger)
    throw new Error(`There is no elementButtonBurger: ${elementButtonBurger}`);
  if (!elementSectionMenu)
    throw new Error(`There is no elementSectionMenu: ${elementSectionMenu}`);
  if (!elementsMenuItem)
    throw new Error(`There is no elementsMenuItem: ${elementsMenuItem}`);

  Array.from(elementsMenuItem).forEach((elementMenuItem) => {
    elementMenuItem.addEventListener("click", () => {
      closeBurgerMenu({
        elementButtonBurger,
        elementSectionMenu,
      });
    });
  });

  elementButtonBurger.addEventListener("click", () => {
    handleClickBurgerButton({
      elementButtonBurger,
      elementSectionMenu,
    });
  });

  const observerMaxWidth = window.matchMedia("(max-width: 768px)");

  observerMaxWidth.addEventListener("change", () => {
    closeBurgerMenu({
      elementButtonBurger,
      elementSectionMenu,
    });
  });
};
