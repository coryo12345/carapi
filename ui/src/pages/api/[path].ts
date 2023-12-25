import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url, redirect }) => {
  const host = "https://carapi.fly.dev";
  const path = url.pathname;

  return redirect(host + path);
};
