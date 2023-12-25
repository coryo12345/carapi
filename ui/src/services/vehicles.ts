export async function getRandomVehicles(options?: {
  count?: number;
  signal?: AbortSignal;
}) {
  let count = options?.count ?? 5;
  const resp = await fetch(`https://carapi.fly.dev/api/random?count=${count}`, {
    signal: options?.signal ?? null,
  });
  const vehicles = await resp.json();

  return vehicles;
}
