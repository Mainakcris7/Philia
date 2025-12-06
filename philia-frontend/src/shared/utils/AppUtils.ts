// Returns a human-readable string representing the time elapsed since the given date
// Example outputs: "1m ago", "2h ago", "3d ago", "4w ago", "5mo ago", "6y ago"
export const getTimeElapsed = (date: Date): string => {
  const now = new Date();
  const secondsElapsed = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  for (const interval in intervals) {
    const intervalSeconds = intervals[interval];
    const count = Math.floor(secondsElapsed / intervalSeconds);
    if (count > 0) {
      return `${count}${interval.charAt(0)} ago`;
    }
  }
  return "Just now";
};
