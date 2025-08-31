import { useState, useCallback, useEffect } from "react";
import { ShoppingItem, VoiceCommand } from "../types/shopping";
import { categorizeItem } from "../utils/categoryManager";

const STORAGE_KEY = "voice-shopping-list";

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed);
      } catch (error) {
        console.error("Failed to load shopping list:", error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((name: string, quantity: number = 1) => {
    const category = categorizeItem(name);
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name,
      quantity,
      completed: false,
      category,
      addedAt: new Date(),
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  const executeVoiceCommand = useCallback(
    (command: VoiceCommand | null) => {
      if (!command) return;
      if (command.action === "add" && command.item) {
        addItem(command.item, command.quantity || 1); // ✅ use quantity not qty
      }
      if (command.action === "remove" && command.item) {
        const item = items.find((i) =>
          i.name.toLowerCase().includes(command.item!.toLowerCase())
        );
        if (item) removeItem(item.id);
      }
    },
    [items, addItem, removeItem]
  );

  return { items, addItem, removeItem, toggleComplete, executeVoiceCommand };
}
