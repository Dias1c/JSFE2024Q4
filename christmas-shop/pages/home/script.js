import { createHtmlComponentGifts } from "./../../scripts/gifts.js";

let gifts = [];

const initialRenderGifts = ({ gifts }) => {
  const replaceEl = document.getElementById("replace-gifts");
  const giftsComponent = createHtmlComponentGifts({
    gifts: gifts,
    pathToRootDir: "../..",
  });

  replaceEl.replaceWith(giftsComponent);
};

fetch("./gifts.json").then(async (resp) => {
  gifts = JSON.parse(await resp.text());

  initialRenderGifts({ gifts });
});
