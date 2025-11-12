export async function discordCache() {
  const key = "discordInfo";
  const cached = sessionStorage.getItem(key);

  if (cached) {
    const { timestamp, data } = JSON.parse(cached);

    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return data;
    }
  }

  const res = await fetch("/api/discord/info");
  const data = await res.json();
  sessionStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  return data;
}
