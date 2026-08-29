import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Klassen zusammenfuehren, spaetere Tailwind-Klassen gewinnen. */
export function cn(...eingaben: ClassValue[]) {
  return twMerge(clsx(eingaben));
}
