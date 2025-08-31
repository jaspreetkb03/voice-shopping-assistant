export function parseSearchCommand(command: string) {
  let query: { name: string; priceMax: number | null; brand: string | null } = {
    name: "",
    priceMax: null,
    brand: null,
  };

  const priceMatch = command.match(/under\s*\$?(\d+)/i);
  if (priceMatch) query.priceMax = parseInt(priceMatch[1], 10);

  const brandMatch = command.match(/brand\s+(\w+)/i);
  if (brandMatch) query.brand = brandMatch[1];

  const nameMatch = command.match(/find\s+(.*)/i);
  if (nameMatch) query.name = nameMatch[1];

  return query;
}
