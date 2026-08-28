const CALENDAR_ID = "apollo.doggie.tsukuba@gmail.com";
const API_KEY = "AIzaSyD3v3AGZxwZU7LJBnIb9r-U3BScNDn5NU4";
const MONTHS_AHEAD = 2; // 今月 + 2ヶ月先(常に3ヶ月分)まで表示

const FORM_BASE_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeoOmXaGI_yRP--rkMlFutUp7rRpmCwBZM63XPt3KnzHOlEKw/viewform";
const FORM_ENTRY_DATE = "entry.621922491";
const FORM_ENTRY_TIME = "entry.786198375";

const listEl = document.getElementById("availabilityList");
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function formatTimeLabel(dateTimeStr) {
  const d = new Date(dateTimeStr);
  return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function isBooked(title) {
  return (title || "").includes("予約済み");
}

function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatDateForForm(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function buildFormUrl(date, time) {
  const params = new URLSearchParams({
    usp: "pp_url",
    [FORM_ENTRY_DATE]: formatDateForForm(date),
    [FORM_ENTRY_TIME]: time,
  });
  return `${FORM_BASE_URL}?${params.toString()}`;
}

async function loadAvailability() {
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
    listEl.innerHTML = '<p class="availability-loading">空き状況の準備中です。しばらくお待ちください。</p>';
    return;
  }

  const today = new Date();
  const firstMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthsToShow = [];
  for (let i = 0; i <= MONTHS_AHEAD; i++) {
    monthsToShow.push(new Date(firstMonth.getFullYear(), firstMonth.getMonth() + i, 1));
  }

  const timeMin = today;
  const timeMax = new Date(monthsToShow[monthsToShow.length - 1].getFullYear(), monthsToShow[monthsToShow.length - 1].getMonth() + 1, 1);

  const url =
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events` +
    `?key=${API_KEY}&singleEvents=true&orderBy=startTime` +
    `&timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&maxResults=2500`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("failed to fetch calendar");
    const data = await res.json();
    renderCalendar(monthsToShow, data.items || []);
  } catch (err) {
    listEl.innerHTML = '<p class="availability-loading">空き状況を取得できませんでした。公式LINEよりお問い合わせください。</p>';
  }
}

function renderCalendar(monthsToShow, events) {
  const byDate = new Map();

  events.forEach((ev) => {
    if (!ev.start || !ev.start.dateTime) return; // 終日予定(定休日など)は一覧に含めない
    const date = new Date(ev.start.dateTime);
    const key = dateKey(date);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key).push({
      date,
      time: formatTimeLabel(ev.start.dateTime),
      booked: isBooked(ev.summary),
    });
  });

  listEl.innerHTML = "";

  monthsToShow.forEach((monthStart) => {
    listEl.appendChild(buildMonthCard(monthStart, byDate));
  });
}

function buildMonthCard(monthStart, byDate) {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = monthStart.getDay();

  const card = document.createElement("div");
  card.className = "avail-month";

  const title = document.createElement("h3");
  title.className = "avail-month-title";
  title.textContent = `${year}年${month + 1}月`;
  card.appendChild(title);

  const wrap = document.createElement("div");
  wrap.className = "avail-grid-wrap";

  const grid = document.createElement("div");
  grid.className = "avail-grid";

  WEEKDAYS.forEach((w) => {
    const cell = document.createElement("div");
    cell.className = "avail-weekday";
    cell.textContent = w;
    grid.appendChild(cell);
  });

  for (let i = 0; i < firstWeekday; i++) {
    const cell = document.createElement("div");
    cell.className = "avail-day empty";
    grid.appendChild(cell);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const cell = document.createElement("div");
    cell.className = "avail-day";

    const num = document.createElement("span");
    num.className = "avail-daynum";
    num.textContent = d;
    cell.appendChild(num);

    const slots = byDate.get(dateKey(date));
    if (slots && slots.length) {
      const slotsWrap = document.createElement("div");
      slotsWrap.className = "avail-day-slots";
      slots.forEach((slot) => {
        const label = `${slot.time} ${slot.booked ? "×" : "◯"}`;
        if (slot.booked) {
          const badge = document.createElement("span");
          badge.className = "availability-badge booked";
          badge.textContent = label;
          slotsWrap.appendChild(badge);
        } else {
          const badge = document.createElement("a");
          badge.className = "availability-badge";
          badge.href = buildFormUrl(slot.date, slot.time);
          badge.target = "_blank";
          badge.rel = "noopener noreferrer";
          badge.textContent = label;
          slotsWrap.appendChild(badge);
        }
      });
      cell.appendChild(slotsWrap);
    }

    grid.appendChild(cell);
  }

  wrap.appendChild(grid);
  card.appendChild(wrap);
  return card;
}

loadAvailability();
