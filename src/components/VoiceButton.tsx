import React from "react";
import { VoiceState } from "../types/shopping";

interface VoiceButtonProps {
  startListening: () => Promise<void>;
  state: VoiceState;
}

export function VoiceButton({ startListening, state }: VoiceButtonProps) {
  return (
    <button
      onClick={startListening}
      style={{
        marginTop: "15px",
        padding: "10px 20px",
        background: state.isListening ? "red" : "green",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      {state.isListening ? "Listening..." : "Start Voice Command"}
    </button>
  );
}
