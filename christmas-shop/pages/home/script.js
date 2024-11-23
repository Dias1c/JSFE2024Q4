import { reRenderGifts } from "./../../scripts/gifts.js";
import { getNewYearRemains } from "./../../scripts/new-year-timer.js";

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

// ? Setting timer
const elTimerDays = document.getElementById("new_year_timer_days");
const elTimerHours = document.getElementById("new_year_timer_hours");
const elTimerMinutes = document.getElementById("new_year_timer_minutes");
const elTimerSeconds = document.getElementById("new_year_timer_seconds");

setInterval(() => {
  const { days, hours, minutes, seconds } = getNewYearRemains({ year: "2025" });

  if (elTimerDays) elTimerDays.innerText = days;
  if (elTimerHours) elTimerHours.innerText = hours;
  if (elTimerMinutes) elTimerMinutes.innerText = minutes;
  if (elTimerSeconds) elTimerSeconds.innerText = seconds;
}, 1000);
