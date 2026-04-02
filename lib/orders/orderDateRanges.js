export function getTodayDateRange(now = new Date()) {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  return {
    startAt: startOfToday.toISOString(),
    endAt: endOfToday.toISOString(),
  };
}

export function getCurrentMonthDateRange(now = new Date()) {
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0,
  );

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
    0,
    0,
    0,
    0,
  );

  return {
    startAt: startOfMonth.toISOString(),
    endAt: startOfNextMonth.toISOString(),
  };
}
