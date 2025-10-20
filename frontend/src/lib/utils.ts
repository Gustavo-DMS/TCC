import { clsx, type ClassValue } from "clsx";
import { futimes } from "fs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchAPIs(
  url: string,
  {
    method = "GET",
    headers = {},
    body,
    ...options
  }: RequestInit & {
    headers?: Record<string, string>;
  } = {},
  external = false,
): Promise<Response> {
  const fetchLocation = external ? fetchURLExternal : fetchURL;

  return fetch(`${fetchLocation}${url}`, {
    method,
    cache: "no-cache",
    headers,
    body,
    ...options,
  });
}

export function dataBRL(dateString: string, onlyDate = false): string {
  const date = new Date(dateString);
  return date.toLocaleString("pt-BR", {
    dateStyle: "long",
    timeStyle: onlyDate ? undefined : "short",
    timeZone: "GMT",
  });
}
const dev = process.env.NODE_ENV !== "production";
const server = typeof window === "undefined";

export const fetchURL = dev
  ? "http://localhost:3000"
  : `https://tcc-site.gustavodms.com.br`;

export const fetchURLExternal = dev
  ? server
    ? "http://backend:4000"
    : "http://localhost:4000"
  : "https://tcc-back.gustavodms.com.br";
