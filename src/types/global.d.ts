export {};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    start(): void;
    stop(): void;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionResultEvent) => any) | null;
  }

  interface SpeechRecognitionResultEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}
