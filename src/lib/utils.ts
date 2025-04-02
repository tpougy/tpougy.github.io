import { defaultLang, type languages, ui } from "@i18n/ui";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function readingTime(html: string, lang: keyof typeof languages) {
  const msg =
    lang == defaultLang
      ? ui.pt["content.reading_time"]
      : ui.en["content.reading_time"];

  const textOnly = html.replace(/<[^>]+>/g, "");

  const wordCount = textOnly.split(/\s+/).length;

  const readingTimeMinutes = (wordCount / 200 + 1).toFixed();

  return `${readingTimeMinutes} ${msg}`;
}

export function dateRange(startDate: Date, endDate?: Date | string): string {
  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const startYear = startDate.getFullYear().toString();
  let endMonth;
  let endYear;

  if (endDate) {
    if (typeof endDate === "string") {
      endMonth = "";
      endYear = endDate;
    } else {
      endMonth = endDate.toLocaleString("default", { month: "short" });
      endYear = endDate.getFullYear().toString();
    }
  }

  return `${startMonth}${startYear} - ${endMonth}${endYear}`;
}
