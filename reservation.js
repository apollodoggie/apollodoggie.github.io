const CALENDAR_ID = "apollo.doggie.tsukuba@gmail.com";
const API_KEY = "AIzaSyD3v3AGZxwZU7LJBnIb9r-U3BScNDn5NU4";
const DAYS_AHEAD = 90;

const listEl = document.getElementById("availabilityList");

function formatDateLabel(date) {
  const weekday = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
  return `${date.getMonth() + 1}/${date.getDate()}(${weekday})`;
}

function formatTimeLabel(dateTimeStr) {
  const d = new Date(dateTimeStr);
  return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function isBooked(title) {
  return (title || "").includes("予約済み");
}

async function loadAvailability() {
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
    listEl.innerHTML = '<p class="availability-loading">空き状況の準備中です。しばらくお待ちください。</p>';
    return;
  }

  const timeMin = new Date();
  const timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + DAYS_AHEAD);

  const url =
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events` +
    `?key=${API_KEY}&singleEvents=true&orderBy=startTime` +
    `&timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("failed to fetch calendar");
    const data = await res.json();
    renderAvailability(data.items || []);
  } catch (err) {
    listEl.innerHTML = '<p class="availability-loading">空き状況を取得できませんでした。公式LINEよりお問い合わせください。</p>';
  }
}

function renderAvailability(events) {
  const byDate = new Map();

  events.forEach((ev) => {
    const start = ev.start && (ev.start.dateTime || ev.start.date);
    if (!start || !ev.start.dateTime) return; // 終日予定(定休日など)は一覧に含めない

    const date = new Date(ev.start.dateTime);
    const key = date.toDateString();
    if (!byDate.has(key)) byDate.set(key, { date, slots: [] });
    byDate.get(key).slots.push({
      time: formatTimeLabel(ev.start.dateTime),
      booked: isBooked(ev.summary),
    });
  });

  if (byDate.size === 0) {
    listEl.innerHTML = '<p class="availability-loading">現在ご案内できる空き枠がありません。公式LINEよりお問い合わせください。</p>';
    return;
  }

  listEl.innerHTML = "";
  Array.from(byDate.values())
    .sort((a, b) => a.date - b.date)
    .forEach((day) => {
      const row = document.createElement("div");
      row.className = "availability-row";

      const label = document.createElement("span");
      label.className = "availability-date";
      label.textContent = formatDateLabel(day.date);
      row.appendChild(label);

      const slots = document.createElement("span");
      slots.className = "availability-slots";
      day.slots.forEach((slot) => {
        const badge = document.createElement("span");
        badge.className = "availability-badge" + (slot.booked ? " booked" : "");
        badge.textContent = slot.time;
        slots.appendChild(badge);
      });
      row.appendChild(slots);

      listEl.appendChild(row);
    });
}

loadAvailability();
