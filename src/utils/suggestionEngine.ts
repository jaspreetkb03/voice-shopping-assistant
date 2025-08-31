import { ShoppingItem, ProductSuggestion } from "../types/shopping";

export class SuggestionEngine {
  private commonItems: ProductSuggestion[] = [
    { name: "Milk", category: "Dairy", reason: "Common daily item" },
    { name: "Bread", category: "Bakery", reason: "Frequently purchased" },
    { name: "Eggs", category: "Dairy", reason: "Protein staple" },
    { name: "Rice", category: "Grains", reason: "Household essential" },
  ];

  // ✅ Suggest items not already in list
  getSuggestions(items: ShoppingItem[]): ProductSuggestion[] {
    const existingNames = items.map((i) => i.name.toLowerCase());

    return this.commonItems.filter(
      (s) => !existingNames.includes(s.name.toLowerCase())
    );
  }
}
