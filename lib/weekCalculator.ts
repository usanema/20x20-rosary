import { weekDates } from "./rosaryData";

export function getCurrentWeek(): number | null {
  const today = new Date();

  for (const weekInfo of weekDates) {
    const startDate = new Date(weekInfo.start);
    const endDate = new Date(weekInfo.end);

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
