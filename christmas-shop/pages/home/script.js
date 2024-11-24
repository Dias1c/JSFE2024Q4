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

// ? SLIDER
let maxClicksCount = 3;
let step = 0;

const elSlider = document.getElementById("slider");
const elSliderBtnLeft = document.getElementById("slider-button-left");
const elSliderBtnRight = document.getElementById("slider-button-right");

function slideSlider({ stepValue }) {
  if (step >= maxClicksCount) step = maxClicksCount;
  step += stepValue;
  const stepWidth =
    (elSlider.scrollWidth - elSlider.clientWidth) / maxClicksCount;
  elSlider.style.transform = `translateX(-${stepWidth * step}px)`;

  if (maxClicksCount <= step) {
    elSliderBtnRight.disabled = true;
  } else {
    elSliderBtnRight.disabled = false;
  }

  if (step <= 0) {
    elSliderBtnLeft.disabled = true;
  } else {
    elSliderBtnLeft.disabled = false;
  }
}

const observerMaxWidth = window.matchMedia("(max-width: 768px)");

observerMaxWidth.addEventListener("change", () => {
  if (observerMaxWidth.matches) {
    maxClicksCount = 6;
  } else {
    maxClicksCount = 3;
  }
  slideSlider({ stepValue: 0 });
});

elSliderBtnRight.addEventListener("click", () =>
  slideSlider({ maxClicksCount: 3, stepValue: 1 })
);

elSliderBtnLeft.addEventListener("click", () =>
  slideSlider({ maxClicksCount: 3, stepValue: -1 })
);
