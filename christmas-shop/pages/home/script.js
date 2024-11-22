import { reRenderGifts } from "./../../scripts/gifts.js";

const BEST_GIFTS_COUNT = 4;

let gifts = [];

fetch("./../../assets/data/all_gifts.json").then(async (resp) => {
  let all = JSON.parse(await resp.text());

  // ? Gentting random gifts
  for (let i = 0; i < BEST_GIFTS_COUNT && i < all.length; i++) {
    const randIdx = Math.round(Math.random() * (all.length - 1));
    const gift = all[randIdx];
    all.splice(randIdx, 1);
    gifts.push(gift);
  }

  reRenderGifts({ gifts, elementId: "replace-gifts" });
});
