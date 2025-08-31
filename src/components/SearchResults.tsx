import React from "react";

interface SearchQuery {
  name: string;
  priceMax: number | null;
  brand: string | null;
}

export function SearchResults({ query }: { query: SearchQuery }) {
  if (!query.name) return null;

  return (
    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mt-4">
      <h3 className="font-bold">🔍 Search Results</h3>
      <p>Item: {query.name}</p>
      {query.priceMax && <p>Max Price: ${query.priceMax}</p>}
      {query.brand && <p>Brand: {query.brand}</p>}
    </div>
  );
}
