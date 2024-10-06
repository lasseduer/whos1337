import { DateTime } from "luxon";
import { TimezoneOffset } from "@/app/models";

export const MILLISECONDS_IN_MINUTE = 60000;

function getTimeZones(): TimezoneOffset[] {
  return [
    { offset: -11, label: "UTC-11" },
    { offset: -10, label: "UTC-10" },
    { offset: -9, label: "UTC-9" },
    { offset: -8, label: "UTC-8" },
    { offset: -7, label: "UTC-7" },
    { offset: -6, label: "UTC-6" },
    { offset: -5, label: "UTC-5" },
    { offset: -4, label: "UTC-4" },
    { offset: -3, label: "UTC-3" },
    { offset: -2, label: "UTC-2" },
    { offset: -1, label: "UTC-1" },
    { offset: 0, label: "UTC+0" },
    { offset: 1, label: "UTC+1" },
    { offset: 2, label: "UTC+2" },
    { offset: 3, label: "UTC+3" },
    { offset: 4, label: "UTC+4" },
    { offset: 5, label: "UTC+5" },
    { offset: 6, label: "UTC+6" },
    { offset: 7, label: "UTC+7" },
    { offset: 8, label: "UTC+8" },
    { offset: 9, label: "UTC+9" },
    { offset: 10, label: "UTC+10" },
    { offset: 11, label: "UTC+11" },
    { offset: 12, label: "UTC+12" },
    { offset: 13, label: "UTC+13" },
  ];
}

export function getLocalOffsetTimeZone(): TimezoneOffset {
  const timeZones = getTimeZones();
  const offsetInMinutes = new Date().getTimezoneOffset() * -1;
  const offsetHours = offsetInMinutes / 60;
  const result = timeZones.find((tz) => tz.offset === offsetHours);

  if (!result) {
    throw new Error("Local timezone not found");
  }

  return result;
}

export function getLocalTimezoneOffset(): string {
  const localTimeZone = getLocalOffsetTimeZone();

  const sign = localTimeZone.offset < 0 ? "-" : "+";
  const formattedOffset = localTimeZone.offset.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return `${sign}${formattedOffset}`;
}

export function getNextTimeZoneFor1337(): string {
  const now = new Date();
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();

  const timeZones = getTimeZones();
  const localTimeZone = getLocalOffsetTimeZone();
  const deltaMinutes = 37 - nowMinutes;
  const deltaHours = 13 - nowHours + (deltaMinutes > 0 ? 0 : -1);

  const nextTimeZone = timeZones.find(
    (tz) => tz.offset === localTimeZone.offset + deltaHours
  );

  if (!nextTimeZone) {
    throw new Error("Next timezone not found");
  }

  return nextTimeZone.label;
}

export function getMillisecondsAfter1337(
  timestamp: string
): number | undefined {
  const format = "yyyy-MM-dd HH:mm:ss.SSSZZ";
  const date = DateTime.fromFormat(timestamp, format, { setZone: true });

  if (date.hour !== 13 || date.minute !== 37) {
    return undefined;
  }

  const msDelta = date.second * 1000 + date.millisecond;

  return msDelta;
}
