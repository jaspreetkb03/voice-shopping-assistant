import React from "react";
import { ShoppingItem } from "../types/shopping";

interface StatsProps {
  items: ShoppingItem[];
}

export function Stats({ items }: StatsProps) {
  const total = items.length;
  const completed = items.filter((i) => i.completed).length;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>📊 Stats</h3>
      <p>Total Items: {total}</p>
      <p>Completed: {completed}</p>
      <p>Pending: {total - completed}</p>
    </div>
  );
}
