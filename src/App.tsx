import React, { useState } from "react";
import { Header } from "./components/Header";
import { VoiceButton } from "./components/VoiceButton";
import { ShoppingList } from "./components/ShoppingList";
import { Suggestions } from "./components/Suggestions";
import { Stats } from "./components/Stats";
import { VoiceInstructions } from "./components/VoiceInstructions";
import { useVoiceCommands } from "./hooks/useVoiceCommands";
import { useShoppingList } from "./hooks/useShoppingList";
import { SuggestionEngine } from "./utils/suggestionEngine";

function App() {
  const [language, setLanguage] = useState("en-US");

  const { voiceState, startListening } = useVoiceCommands(language);
  const { items, addItem, removeItem, toggleComplete, executeVoiceCommand } =
    useShoppingList();

  const suggestionEngine = new SuggestionEngine();
  const suggestions = suggestionEngine.getSuggestions(items);

  return (
    <div className="container">
      <Header language={language} setLanguage={setLanguage} />

      <h2>🛒 Voice Shopping Assistant</h2>

      <VoiceInstructions />

      <VoiceButton
        startListening={async () => {
          const command = await startListening();
          executeVoiceCommand(command);
        }}
        state={voiceState}
      />

      {items.length === 0 ? (
        <p>Your shopping list is empty. Try adding something!</p>
      ) : (
        <ShoppingList
          items={items}
          onToggleComplete={toggleComplete}
          onRemoveItem={removeItem}
        />
      )}

      {suggestions.length > 0 && (
        <Suggestions
          suggestions={suggestions}
          onAddSuggestion={(name) => addItem(name)}
        />
      )}

      <Stats items={items} />
    </div>
  );
}

export default App;
