import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { StoreApi, UseBoundStore } from 'zustand'

//Zustand Selector
type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never
export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ; (store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }
  return store
}


// generated by shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// created by chatgpt
export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// created by chatgpt
export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

// created by chatgpt
export function formatThreadCount(count: number): string {
  if (count === 0) {
    return "No Threads";
  } else {
    const threadCount = count.toString().padStart(2, "0");
    const threadWord = count === 1 ? "Thread" : "Threads";
    return `${threadCount} ${threadWord}`;
  }
}

export const parseFloatSafe = (input: any) => {
  const out = Number.parseFloat(input);
  if (Number.isNaN(out)) {
    console.error('parseFloatSafe failed');
    return -1.1;
  }
  return out;
}
export const parseIntSafe = (input: any) => {
  const out = Number.parseInt(input);
  if (Number.isNaN(out)) {
    console.error('parseIntSafe failed');
    return -1;
  }
  return out;
}

export const delayFunc = async (delay: number): Promise<boolean> => new Promise((resolve, reject) => setTimeout(() => {
  console.log("delay:", delay);
  resolve(true)
}, delay))

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const makeShortAddr = (str: string) => {
  return str.slice(0, 6) + "...." + str.slice(str.length - 4)
}
export const isEmpty = (value: any) =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'string' && value === 'undefined');

export const isEqualStr = (str1: any, str2: any): boolean => (str1 + '').trim().toLowerCase() === (str2 + '').trim().toLowerCase();

export const isObjEqualStr = (obj1: object, obj2: object): boolean => JSON.stringify(obj1) === JSON.stringify(obj2)

export const arrayRange = (start: number, stop: number, step: number) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

//Sequentially execute an asynchronous callback function in the order of given array of boxes
export const asyncFor = async<T>(array: Array<T>, callback: <U>(box: T) => Promise<U>) => {
  const output = [];
  for (let idx = 0; idx < array.length; idx++) {
    const out = await callback(array[idx]).catch((err: any) => {
      console.log("asyncFor callback failed@ %s, box= %s, err: %s", idx, array[idx], err)
    });
    output.push(out);
  }
  return output;
}
