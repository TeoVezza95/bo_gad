import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formattedDate = (isoDate: string) => {
  const date = new Date(isoDate);

// Estrai i componenti della data in orario locale
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // I mesi partono da 0, quindi aggiungi 1
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

// Combina i valori nel formato desiderato
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
