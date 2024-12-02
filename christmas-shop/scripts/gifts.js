const categories = {
  "For Work": {
    tagClass: "color-tag--purple",
    imageAbsolutPath: "/assets/images/gift-for-work.png",
  },
  "For Health": {
    tagClass: "color-tag--green",
    imageAbsolutPath: "/assets/images/gift-for-health.png",
  },
  "For Harmony": {
    tagClass: "color-tag--pink",
    imageAbsolutPath: "/assets/images/gift-for-harmony.png",
  },
};

const getGiftCategoryProps = (category) => {
  return (
    categories[category] ?? {
      tagClass: "",
      imageAbsolutPath: "",
    }
  );
};

const createHtmlComponentGiftModal = ({ gift, pathToRootDir }) => {
  const createInnerHTMLGiftStat = ({ name, value }) => {
    const snows = parseInt(value);

    let snowflakes = ``;
    for (let i = 100; i <= 500; i += 100) {
      if (i <= snows) {
        snowflakes += `<img src="${pathToRootDir}/assets/icons/icon-snowflake-red.svg" alt="snowflake-red">`;
        continue;
      }
      snowflakes += `<img src="${pathToRootDir}/assets/icons/icon-snowflake-red.svg" alt="snowflake-red" style="opacity: 0.1">`;
    }

    return `<div class="dialog_gift__details__secondary__property">
        <p class="dialog_gift__details__secondary__property__name">${name}</p>
        <p class="dialog_gift__details__secondary__property__score">${value}</p>
        <div class="dialog_gift__details__secondary__property__snowflakes">
          ${snowflakes}
        </div>
      </div>`;
  };

  const { tagClass, imageAbsolutPath } = getGiftCategoryProps(gift.category);

  const dialog = document.createElement("dialog");
  dialog.classList.add("dialog_gift");

  dialog.addEventListener("click", (e) => {
    const closeDialog = () => {
      dialog.close();
      dialog.remove();
      document.body.style.overflowY = "auto";
    };

    if (e.target && e.target.classList.contains("dialog_gift")) {
      var rect = dialog.getBoundingClientRect();
      if (
        rect.top > e.clientY ||
        e.clientY > rect.top + rect.height ||
        rect.left > e.clientX ||
        e.clientX > rect.left + rect.width
      ) {
        closeDialog();
      }
    }

    if (e.target && e.target.classList.contains("dialog_gift__close")) {
      closeDialog();
    }
  });

  dialog.innerHTML = `
<div class="dialog_gift__img_block">
  <img class="dialog_gift__img" alt="gift" src="${pathToRootDir}${imageAbsolutPath}" />
</div>
<button class="dialog_gift__close"></button>
<div class="dialog_gift__details">
  <div class="dialog_gift__details__main">
    <h4 class="${tagClass}">${gift.category}</h4>
    <h3>${gift.name}</h3>
    <p>${gift.description}</p>
  </div>
  <div class="dialog_gift__details__secondary">
    <h4>Adds superpowers to:</h4>
    <div>
      ${createInnerHTMLGiftStat({ name: "Live", value: gift.superpowers.live })}
      ${createInnerHTMLGiftStat({
        name: "Create",
        value: gift.superpowers.create,
      })}
      ${createInnerHTMLGiftStat({ name: "Love", value: gift.superpowers.love })}
      ${createInnerHTMLGiftStat({
        name: "Dream",
        value: gift.superpowers.dream,
      })}
    </div>
  </div>
</div>`;

  return dialog;
};

/**
 * @param {*} param0
 *
 * @returns html div element with childs
 * ```html
 * <div class="gift_card">
 *   <img alt="gift for work" src="../../assets/images/gift-for-work.png" class="gift_card__image">
 *   <div class="gift_card__content">
 *     <h4 class="color-tag--purple">For work</h4>
 *     <h3>Console.log Guru</h3>
 *   </div>
 * </div>
 * ```
 */
export const createHtmlComponentGift = ({ gift, pathToRootDir }) => {
  if (!pathToRootDir) throw new Error("pathToRootDir is undefined");

  const { category, name } = gift;
  if (!category) throw new Error("category is undefined");

  const categoryProps = getGiftCategoryProps(category);
  if (!categoryProps) throw new Error("categoryProps is undefined");

  const elGift = document.createElement("div");
  elGift.classList.add("gift_card");

  const elImg = document.createElement("img");
  elImg.classList.add("gift_card__image");
  elImg.src = `${pathToRootDir}${categoryProps.imageAbsolutPath}`;
  elImg.alt = category;

  const elGiftContent = document.createElement("div");
  elGiftContent.classList.add("gift_card__content");

  const elH4 = document.createElement("h4");
  elH4.classList.add(categoryProps.tagClass);
  elH4.innerText = category;

  const elH3 = document.createElement("h3");
  elH3.innerText = name;

  // ? Combine components
  elGift.appendChild(elImg);
  elGift.appendChild(elGiftContent);
  elGiftContent.appendChild(elH4);
  elGiftContent.appendChild(elH3);

  // ? Events
  elGift.addEventListener("click", () => {
    const elModal = createHtmlComponentGiftModal({ gift, pathToRootDir });
    document.body.appendChild(elModal);
    elModal.showModal();
    document.body.style.overflowY = "hidden";
  });

  return elGift;
};

export const createHtmlComponentGifts = ({ gifts, pathToRootDir }) => {
  if (!gifts) throw new Error("gifts is undefined");
  if (!pathToRootDir) throw new Error("pathToRootDir is undefined");

  const giftsEl = document.createElement("div");
  giftsEl.classList.add("gift_cards");

  for (let i = 0; i < gifts.length; i++) {
    const giftEl = createHtmlComponentGift({
      gift: gifts[i],
      pathToRootDir,
    });

    giftsEl.appendChild(giftEl);
  }

  return giftsEl;
};

export const reRenderGifts = ({ gifts, elementId }) => {
  const replaceEl = document.getElementById(elementId);

  const giftsComponent = createHtmlComponentGifts({
    gifts: gifts,
    pathToRootDir: "../..",
  });
  giftsComponent.id = elementId;

  replaceEl.replaceWith(giftsComponent);
};
