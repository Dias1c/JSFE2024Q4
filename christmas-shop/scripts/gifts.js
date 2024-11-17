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
export const createHtmlComponentGift = ({ category, title, pathToRootDir }) => {
  if (!pathToRootDir) throw new Error("pathToRootDir is undefined");
  if (!category) throw new Error("category is undefined");

  const categoryProps = getGiftCategoryProps(category);
  if (!categoryProps) throw new Error("categoryProps is undefined");

  const gift = document.createElement("div");
  gift.classList.add("gift_card");

  const img = document.createElement("img");
  img.classList.add("gift_card__image");
  img.src = `${pathToRootDir}${categoryProps.imageAbsolutPath}`;
  img.alt = category;

  const giftContent = document.createElement("div");
  giftContent.classList.add("gift_card__content");

  const h4 = document.createElement("h4");
  h4.classList.add(categoryProps.tagClass);
  h4.innerText = category;

  const h3 = document.createElement("h3");
  h3.innerText = title;

  // ? Combine components
  gift.appendChild(img);
  gift.appendChild(giftContent);
  giftContent.appendChild(h4);
  giftContent.appendChild(h3);

  return gift;
};

export const createHtmlComponentGifts = ({ gifts, pathToRootDir }) => {
  if (!gifts) throw new Error("gifts is undefined");
  if (!pathToRootDir) throw new Error("pathToRootDir is undefined");

  const giftsEl = document.createElement("div");
  giftsEl.classList.add("gift_cards");

  for (let i = 0; i < gifts.length; i++) {
    const gift = gifts[i];
    const giftEl = createHtmlComponentGift({
      category: gift.category,
      title: gift.name,
      pathToRootDir,
    });

    giftsEl.appendChild(giftEl);
  }

  return giftsEl;
};

export const initialRenderGifts = ({ gifts }) => {
  const replaceEl = document.getElementById("replace-gifts");
  const giftsComponent = createHtmlComponentGifts({
    gifts: gifts,
    pathToRootDir: "../..",
  });

  replaceEl.replaceWith(giftsComponent);
};
