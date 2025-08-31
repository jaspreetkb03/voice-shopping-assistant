export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  category: string;
  completed: boolean;
  addedAt?: Date;
  modifiedAt?: Date;
  priority?: number;
}

export interface VoiceCommand {
  action: "add" | "remove" | "search";
  item?: string;
  quantity?: number;
  filter?: string;
}
export interface ProductSuggestion {
  name: string;
  category: string;
  reason: string;
}


export interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  lastCommand: string;
  error: string | null;
}

// ✅ FIX: define ProductSuggestion type
export interface ProductSuggestion {
  name: string;
  category: string;
  reason: string; // e.g. "based on history" or "seasonal"
}
