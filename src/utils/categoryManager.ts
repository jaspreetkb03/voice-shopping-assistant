export const CATEGORIES = {
  'produce': ['apple', 'banana', 'orange', 'lettuce', 'tomato', 'onion', 'potato', 'carrot', 'broccoli', 'spinach', 'avocado', 'lemon', 'lime', 'garlic', 'ginger'],
  'dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'eggs', 'sour cream', 'cottage cheese'],
  'meat': ['chicken', 'beef', 'pork', 'fish', 'turkey', 'salmon', 'tuna', 'bacon', 'ham', 'ground beef'],
  'pantry': ['rice', 'pasta', 'bread', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'vinegar', 'cereal', 'oats'],
  'beverages': ['water', 'juice', 'soda', 'coffee', 'tea', 'beer', 'wine', 'energy drink'],
  'snacks': ['chips', 'crackers', 'nuts', 'cookies', 'candy', 'chocolate', 'popcorn', 'granola bar'],
  'frozen': ['ice cream', 'frozen vegetables', 'frozen fruit', 'frozen pizza', 'frozen dinner'],
  'household': ['toilet paper', 'paper towels', 'detergent', 'soap', 'shampoo', 'toothpaste', 'cleaning supplies'],
  'health': ['vitamins', 'medicine', 'bandages', 'aspirin', 'supplements']
};

export function detectCategory(item: string): string {
  const food = ["bread", "butter", "eggs", "milk"];
  const grains = ["rice", "dal", "wheat"];
  const drinks = ["juice", "tea", "coffee"];

  if (food.includes(item)) return "food";
  if (grains.includes(item)) return "grains";
  if (drinks.includes(item)) return "drinks";
  return "other";
}


export function categorizeItem(itemName: string): string {
  const normalizedName = itemName.toLowerCase();
  
  for (const [category, items] of Object.entries(CATEGORIES)) {
    for (const item of items) {
      if (normalizedName.includes(item) || item.includes(normalizedName)) {
        return category;
      }
    }
  }
  
  return 'other';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'produce': 'bg-green-100 text-green-800 border-green-200',
    'dairy': 'bg-blue-100 text-blue-800 border-blue-200',
    'meat': 'bg-red-100 text-red-800 border-red-200',
    'pantry': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'beverages': 'bg-purple-100 text-purple-800 border-purple-200',
    'snacks': 'bg-orange-100 text-orange-800 border-orange-200',
    'frozen': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'household': 'bg-gray-100 text-gray-800 border-gray-200',
    'health': 'bg-pink-100 text-pink-800 border-pink-200',
    'other': 'bg-slate-100 text-slate-800 border-slate-200'
  };
  
  return colors[category] || colors.other;
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'produce': '🥬',
    'dairy': '🥛',
    'meat': '🥩',
    'pantry': '🍞',
    'beverages': '🥤',
    'snacks': '🍿',
    'frozen': '🧊',
    'household': '🧽',
    'health': '💊',
    'other': '📦'
  };
  
  return icons[category] || icons.other;
}