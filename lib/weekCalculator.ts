import { weekDates } from "./rosaryData";

export function getCurrentWeek(): number | null {
  const today = new Date();
  // Reset time to start of day for accurate comparison
  today.setHours(0, 0, 0, 0);

  for (const weekInfo of weekDates) {
    // Parse dates with explicit time to avoid timezone issues
    const startDate = new Date(weekInfo.start + "T00:00:00");
    const endDate = new Date(weekInfo.end + "T23:59:59");

    if (today >= startDate && today <= endDate) {
      return weekInfo.week;
    }
  }

  return null;
}

export function getMysteryForPersonAndWeek(
  personName: string,
  weekNumber: number,
  rosaryData: { person: string; weeks: string[] }[]
): string | null {
  const personData = rosaryData.find(
    (data) => data.person.toLowerCase() === personName.toLowerCase()
  );

  if (!personData) {
    return null;
  }

  // Week 0 uses same data as week 1 (index 0)
  // Week 1-20 use their respective indices (0-19)
  const mysteryIndex = weekNumber === 0 ? 0 : weekNumber - 1;

  if (mysteryIndex < 0 || mysteryIndex >= personData.weeks.length) {
    return null;
  }

  return personData.weeks[mysteryIndex];
}
