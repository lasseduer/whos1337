export function getLocalTimezoneOffset(): string {
  const offsetInMinutes = new Date().getTimezoneOffset();
  const offsetHours = Math.abs(offsetInMinutes / 60);
  const sign = offsetInMinutes > 0 ? "-" : "+";
  const formattedOffset = offsetHours.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return `${sign}${formattedOffset}`;
}
