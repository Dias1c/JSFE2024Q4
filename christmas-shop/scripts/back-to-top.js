const createComponentButtonBackToTop = ({ id }) => {
  const btn = document.createElement("button");
  if (id) {
    btn.id = id;
  }
  btn.classList.add("button--back-to-top");

  btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5V19" stroke="#FF4646" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 11L12 5" stroke="#FF4646" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 11L12 5" stroke="#FF4646" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  btn.addEventListener("click", () => {
    window.scrollTo(0, 0);
  });

  return btn;
};

export const initializeBackToTopButton = ({ id }) => {
  const btnBackToTop = createComponentButtonBackToTop({ id });
  const found = document.getElementById(id);
  if (found) {
    found.replaceWith(btnBackToTop);
  } else {
    document.body.appendChild(btnBackToTop);
  }

  const observerMaxWidth = window.matchMedia("(max-width: 768px)");
  const canButtonBeVisible = () => {
    return observerMaxWidth.matches && window.scrollY >= 300;
  };
  const handleButtonVisibility = () => {
    if (canButtonBeVisible()) {
      btnBackToTop.classList.add("active");
      return;
    }
    btnBackToTop.classList.remove("active");
  };

  observerMaxWidth.addEventListener("change", handleButtonVisibility);
  window.addEventListener("scroll", handleButtonVisibility);
};
