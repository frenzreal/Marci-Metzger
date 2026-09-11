const schedule = [
  { day: "Monday", dow: 1, open: "08:00", close: "19:00" },
  { day: "Tuesday", dow: 2, open: "08:00", close: "19:00" },
  { day: "Wednesday", dow: 3, open: "08:00", close: "19:00" },
  { day: "Thursday", dow: 4, open: "08:00", close: "19:00" },
  { day: "Friday", dow: 5, open: "08:00", close: "19:00" },
  { day: "Saturday", dow: 6, open: "08:00", close: "19:00" },
  { day: "Sunday", dow: 0, open: "08:00", close: "19:00" },
];

function fmt(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return (
    h12.toString().padStart(2, "0") +
    ":" +
    m.toString().padStart(2, "0") +
    " " +
    period
  );
}

const now = new Date();
const currentDow = now.getDay();
const currentMinutes = now.getHours() * 60 + now.getMinutes();

const todayEntry = schedule.find((s) => s.dow === currentDow);
const [oh, om] = todayEntry.open.split(":").map(Number);
const [ch, cm] = todayEntry.close.split(":").map(Number);
const openMinutes = oh * 60 + om;
const closeMinutes = ch * 60 + cm;
const isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;

const badge = document.getElementById("status-badge");
if (isOpen) {
  badge.textContent = "Open";
  badge.classList.add("badge-open");
} else {
  badge.textContent = "Closed";
  badge.classList.add("badge-closed");
}

const rowsEl = document.getElementById("rowsOH");
schedule.forEach((s) => {
  const isToday = s.dow === currentDow && isOpen;
  const row = document.createElement("div");
  row.className = "rowOH" + (isToday ? " today" : "");
  row.innerHTML =
    '<span class="day">' +
    s.day +
    "</span>" +
    "<span>" +
    fmt(s.open) +
    " &ndash; " +
    fmt(s.close) +
    "</span>";
  rowsEl.appendChild(row);
});
