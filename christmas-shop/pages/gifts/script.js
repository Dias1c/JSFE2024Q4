import { initialRenderGifts } from "./../../scripts/gifts.js";

let gifts = [];

fetch("./../../assets/data/all_gifts.json").then(async (resp) => {
  gifts = JSON.parse(await resp.text());

  initialRenderGifts({ gifts });
});
