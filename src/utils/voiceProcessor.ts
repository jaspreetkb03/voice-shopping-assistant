import { VoiceCommand } from "../types/shopping";

const commands: Record<
  string,
  { add: string[]; remove: string[]; search: string[] }
> = {
  "en-US": {
    add: ["add", "i need", "i want", "buy"],
    remove: ["remove", "delete"],
    search: ["find", "search for", "look for"],
  },
  "hi-IN": {
    add: ["जोड़ो", "मुझे चाहिए", "खरीदो"],
    remove: ["हटाओ", "निकाल दो"],
    search: ["ढूँढो", "खोजो"],
  },
  "fr-FR": {
    add: ["ajoute", "je veux", "j’ai besoin", "acheter"],
    remove: ["supprime", "enlève"],
    search: ["trouve", "cherche"],
  },
};

export class VoiceProcessor {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isSupported: boolean;

  constructor(private lang: string = "en-US") {
    this.synthesis = window.speechSynthesis;
    this.isSupported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

    if (this.isSupported) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition(lang);
    }
  }

  private setupRecognition(lang: string) {
    if (!this.recognition) return;
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = lang;
  }

  isVoiceSupported(): boolean {
    return this.isSupported;
  }

  getRecognition() {
    return this.recognition;
  }

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.lang;
    this.synthesis.speak(utterance);
  }
}

export function processTranscript(
  transcript: string,
  lang: string = "en-US"
): VoiceCommand | null {
  const normalized = transcript.toLowerCase().trim();
  const set = commands[lang] || commands["en-US"];

  if (set.add.some((phrase) => normalized.includes(phrase))) {
    return { action: "add", item: normalized, quantity: 1 }; // ✅ fixed property
  }
  if (set.remove.some((phrase) => normalized.includes(phrase))) {
    return { action: "remove", item: normalized };
  }
  if (set.search.some((phrase) => normalized.includes(phrase))) {
    return { action: "search", item: normalized };
  }
  return null;
}
