import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * @param value number
 * @param options Intl options
 * @returns 
 * @DOCS : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 */
export const parseNumber = (value: number, options?: any) => 
  new Intl.NumberFormat(document.documentElement.lang || 'en', options).format(value);

/**
 * @param val number
 * @returns string number short
 */
export const numShort = (value: number) => {
  if (value < 1E3) {
    return value;
  }
  
  const num = +value.toString().replace(/[^0-9.]/g, '');

  const si = [
    {v: 1E3, s: "K"},
    {v: 1E6, s: "M"},
    {v: 1E9, s: "B"},
    {v: 1E12, s: "T"},
    {v: 1E15, s: "P"},
    {v: 1E18, s: "E"}
  ];

  let index: number;

  for (index = si.length - 1; index > 0; index--) {
    if (num >= si[index].v) {
      break;
    }
  }

  return (num / si[index].v)
    .toFixed(2)
    .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
}

export const parseDate = (
  date: any, 
  options: any = { dateStyle: 'long' }
) => {
  let res = "";
  if(window.Intl && date){
    res = new Intl.DateTimeFormat(
      options?.locale || document.documentElement.lang, options
    )
    .format(typeof date === 'object' ? date : new Date(date));
  }
  return res;
}
