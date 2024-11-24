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

let timerInterval;

timerInterval = setInterval(() => {
  const { days, hours, minutes, seconds, isFinished } = getNewYearRemains({
    year: "2025",
  });

  const list = [
    { value: days, elTimer: elTimerDays },
    { value: hours, elTimer: elTimerHours },
    { value: minutes, elTimer: elTimerMinutes },
    { value: seconds, elTimer: elTimerSeconds },
  ];

  for (const el of list) {
    if (el.elTimer) el.elTimer.innerText = el.value;
  }

  if (isFinished) clearInterval(timerInterval);
}, 1000);
