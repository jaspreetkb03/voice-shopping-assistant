import React from "react";
import { ShoppingItem } from "../types/shopping";

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggleComplete: (id: string) => void;
  onRemoveItem: (id: string) => void;
}

export function ShoppingList({ items, onToggleComplete, onRemoveItem }: ShoppingListProps) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Shopping List</h2>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "5px 0",
            }}
          >
            <span
              style={{
                textDecoration: item.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => onToggleComplete(item.id)}
            >
              {item.name}
            </span>
            <button onClick={() => onRemoveItem(item.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
