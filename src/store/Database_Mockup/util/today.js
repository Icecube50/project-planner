const rawToday = new Date();
const today =
  Date.UTC(
    rawToday.getFullYear(),
    rawToday.getMonth(),
    rawToday.getDate(),
  ) +
  new Date().getTimezoneOffset() * 60000;

export const TicksPerDay = 86400000

export const daysSince = (dx) => new Date(today + dx * TicksPerDay);

export function toDateString(date) {
    return `${pad(date.getDate(), 2)}.${pad(date.getMonth() + 1, 2)}.${date.getFullYear()}`
}

function pad(num, size) {
    var s = "00" + num;
    return s.slice(s.length-size);
}