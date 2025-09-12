// ! here we need to change start date to date while we starting the simester
function getWeekLetter() {
  const currentDate = new Date();
  const startDate = new Date("09-01-2025");
  let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

  let weekNumber = Math.floor(days / 7);

  if (typeof weekNumber === "number" && weekNumber % 2 === 0) {
    return "s";
  } else if (typeof weekNumber === "number" && weekNumber % 2 === 1) {
    return "m";
  }
}

function getWeekName(weekLetter) {
  if (weekLetter === "m") return "Maýdalawjy";

  return "Sanawjy";
}

function getNextWeekLetter() {
  const currentWeek = getWeekLetter();

  if (currentWeek === "s") return "m";

  return "s";
}

function getArray(name) {
  if (name === "s") {
    return sanawjy;
  } else {
    return maydalawjy;
  }
}

function getToday(date, week) {
  if (date === 0) {
    // ! hot fix, use pair to show it in UI instead of rest day
    return { first_pair: "Dynç güni" };
  }
  if (week === "m") {
    return maydalawjy[date - 1];
  } else if (week === "s") {
    return sanawjy[date - 1];
  }
}

function getTomorrow(date, week) {
  date += 1;

  if (date === 7) {
    // ! hot fix, use pair to show it in UI instead of rest day
    return { first_pair: "Dynç güni" };
  }

  if (date === 0) {
    // ! hot fix, use pair to show it in UI instead of rest day
    return { first_pair: "Dynç güni" };
  }

  // ! checking if today sunday and tomorrow is monday then we need to change the name of the week
  if (date === 1) {
    if (week === "m") {
      return sanawjy[date - 1];
    } else {
      return maydalawjy[date - 1];
    }
  }

  if (week === "m") {
    return maydalawjy[date - 1];
  } else if (week === "s") {
    return sanawjy[date - 1];
  }
}

// ! setting weeks name
function settingWeeksName() {
  // ! important variables that used in html with ID
  const currentWeekEl = document.getElementById("current-week"),
    nextWeekEl = document.getElementById("next-week");

  currentWeekEl.textContent = getWeekName(getWeekLetter());
  nextWeekEl.textContent = getWeekName(getNextWeekLetter());
}
settingWeeksName();

// ! setting today and tomorrow's schedules
function settingTodayAndTomorrow() {
  const weekName = getWeekLetter(),
    todayDate = new Date().getDay();

  const todaySchedule = getToday(todayDate, weekName),
    tomorrowSchedule = getTomorrow(todayDate, weekName);
  // ! important variables that used in html with ID
  const todayEl = document.getElementById("schedule-today"),
    todayArray = todayEl.querySelectorAll("div"),
    tomorrowEl = document.getElementById("schedule-tomorrow"),
    tomorrowArray = tomorrowEl.querySelectorAll("div");

  // ! one pair
  if (isOnePairOnly(todaySchedule)) {
    settingContentWithOnePair(todayArray, todaySchedule);
  }
  // ! full pairs
  else {
    const pairs = Object.keys(todaySchedule).length;
    settingContentFullPairs(
      todayArray,
      todaySchedule,
      todayEl,
      pairs === 2 ? true : false
    );
  }

  // ? tomorrow
  // ! one pair
  if (isOnePairOnly(tomorrowSchedule)) {
    settingContentWithOnePair(tomorrowArray, tomorrowSchedule);
  }
  // ! full pairs
  else {
    const pairs = Object.keys(tomorrowSchedule).length;
    settingContentFullPairs(
      tomorrowArray,
      tomorrowSchedule,
      tomorrowEl,
      pairs === 2 ? true : false
    );
  }
}
settingTodayAndTomorrow();

// ! only for second_pair and third_pair objects key
function isOnePairOnly(obj) {
  if (
    typeof obj.second_pair === "undefined" &&
    typeof obj.third_pair === "undefined"
  )
    return true;

  return false;
}

// ! setting content if one pair
function settingContentWithOnePair(element, schedule) {
  element.forEach((item, i) => {
    if (i !== 0) {
      item.remove();
    } else {
      item.querySelector("p:first-child").textContent = schedule.first_pair;
      item.querySelector("p:last-child").remove();
    }
  });
}

// ! setting content of 3 pairs
function settingContentFullPairs(elementArray, schedule, element, isTwoPairs) {
  const separately = (group1, group2) => {
      const el = document.createElement("div");
      el.className = "flex items-center flex-col gap-2";
      el.innerHTML = `
    <p>
      <span
        class="px-2 font-semibold border-primary border-2 rounded-lg bg-secondary text-accent">1</span>
      ${group1}
    </p>
    <p>
      <span
        class="px-2 font-semibold border-primary border-2 rounded-lg bg-secondary text-accent">2</span>
      ${group2}
    </p>`;

      return el;
    },
    together = (pair) => {
      const el = document.createElement("div");
      el.className = "flex items-center flex-col gap-2";

      el.innerHTML = `<p>${pair}</p>`;

      return el;
    };

  elementArray.forEach((item) => {
    item.remove();
  });

  // ! 3 pairs initilazing
  const pairs = isTwoPairs
    ? ["first_pair", "second_pair"]
    : ["first_pair", "second_pair", "third_pair"];

  pairs.forEach((pair, i) => {
    let pairStr = schedule[pair];

    if (doStudyingTogether(pairStr)) {
      // ! group styding together

      element.append(together(pairStr));
    } else {
      // ! group doesn't styding together

      pairStr = pairStr.split("\n");
      element.append(separately(pairStr[0], pairStr[1]));
    }
  });
}

function doStudyingTogether(pair = "") {
  if (pair.split("\n").length > 1) return false;

  return true;
}
