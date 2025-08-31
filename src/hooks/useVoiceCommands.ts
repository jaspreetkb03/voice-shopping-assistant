console.log("✅ Loaded useVoiceCommands with param support");

import { useState, useCallback, useRef, useEffect } from "react";
import { VoiceProcessor, processTranscript } from "../utils/voiceProcessor";
import { VoiceState, VoiceCommand } from "../types/shopping";

export function useVoiceCommands(language: string) {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    lastCommand: "",
    error: null,
  });

  const voiceProcessor = useRef<VoiceProcessor | null>(null);

  // ✅ Reinitialize when language changes
  useEffect(() => {
    voiceProcessor.current = new VoiceProcessor(language);
  }, [language]);

  const startListening = useCallback(async (): Promise<VoiceCommand | null> => {
    if (!voiceProcessor.current || !voiceProcessor.current.isVoiceSupported()) {
      setVoiceState((prev) => ({
        ...prev,
        error: "Voice recognition not supported in this browser",
      }));
      return null;
    }

    return new Promise((resolve) => {
      const recognition = voiceProcessor.current?.getRecognition();
      if (!recognition) return;

      setVoiceState((prev) => ({ ...prev, isListening: true, error: null }));
      recognition.start();

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setVoiceState((prev) => ({
          ...prev,
          lastCommand: transcript,
          isListening: false,
          isProcessing: true,
        }));

        const command = processTranscript(transcript, language);
        setVoiceState((prev) => ({ ...prev, isProcessing: false }));
        resolve(command);
      };

      recognition.onerror = (event: any) => {
        setVoiceState((prev) => ({
          ...prev,
          error: event.error,
          isListening: false,
        }));
        resolve(null);
      };
    });
  }, [language]);

  return { voiceState, startListening };
}
