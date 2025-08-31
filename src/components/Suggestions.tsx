interface ProductSuggestion {
  name: string;
  category?: string;
}

interface SuggestionsProps {
  suggestions: ProductSuggestion[];
  onAddSuggestion: (name: string) => void;
}

export function Suggestions({ suggestions, onAddSuggestion }: SuggestionsProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>💡 Suggestions</h3>
      <ul>
        {suggestions.map((s, index) => (
          <li key={index}>
            {s.name}{" "}
            <button onClick={() => onAddSuggestion(s.name)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
