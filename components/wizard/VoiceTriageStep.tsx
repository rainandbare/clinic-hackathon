"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useWizard } from "./WizardProvider";
import WizardHeader from "@/components/ui/WizardHeader";
import { getCurrentPosition, isGeolocationSupported } from "@/lib/geolocation";
import { setLocationCookie } from "@/lib/cookies";
import type { TriageMessage, TriageResponse, Coordinates } from "@/types";

const INITIAL_MESSAGE: TriageMessage = {
  role: "assistant",
  content: "Hi! I'm here to help figure out the right care for you. What's going on today?",
};

export default function VoiceTriageStep() {
  const { triageSkip, goTo } = useWizard();
  const [messages, setMessages] = useState<TriageMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isGeolocationSupported()) return;
    setLocationLoading(true);
    getCurrentPosition()
      .then((c) => {
        setLocationCookie(c.lat, c.lng);
        setCoords(c);
      })
      .catch(() => {
        setError("Enable location access so we can find nearby clinics.");
      })
      .finally(() => setLocationLoading(false));
  }, []);

  const messagesRef = useRef<TriageMessage[]>([INITIAL_MESSAGE]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: TriageMessage = { role: "user", content: text.trim() };
      const updated = [...messagesRef.current, userMsg];
      messagesRef.current = updated;
      setMessages(updated);
      setInput("");
      setSending(true);
      setError(null);

      try {
        const res = await fetch("/api/triage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updated.slice(1) }),
        });
        const data: TriageResponse = await res.json();

        const assistantMsg: TriageMessage = { role: "assistant", content: data.reply };
        messagesRef.current = [...messagesRef.current, assistantMsg];
        setMessages(messagesRef.current);

        if (data.done && data.triage) {
          if (!coords) {
            setError("Still waiting for your location. Please allow location access.");
            setSending(false);
            return;
          }
          setTimeout(() => {
            triageSkip(coords, data.triage!);
          }, 1500);
        }
      } catch {
        setError("Couldn't reach the AI. Try again.");
      } finally {
        setSending(false);
      }
    },
    [coords, triageSkip]
  );

  const toggleListening = useCallback(() => {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input isn't supported in this browser. Please type instead.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    let finalTranscript = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInput(finalTranscript + interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") return;
      setListening(false);
      const errorMap: Record<string, string> = {
        "not-allowed": "Microphone access was denied. Please allow mic permissions in your browser.",
        "audio-capture": "No microphone found. Check your mic is connected.",
        "network": "Network error during speech recognition. Check your connection.",
      };
      setError(errorMap[event.error] || `Speech error: ${event.error}`);
    };

    recognition.onend = () => {
      setListening(false);
      if (finalTranscript.trim()) {
        sendMessage(finalTranscript.trim());
      }
    };

    recognition.start();
    setListening(true);
  }, [listening, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col flex-1 h-full">
      <WizardHeader />

      <div className="px-5 pt-4 pb-2 flex items-center gap-2">
        <button onClick={() => goTo(1)} className="text-cl-primary">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="font-semibold text-cl-text-primary">Tell us what&apos;s going on</h2>
      </div>

      {locationLoading && (
        <div className="px-5 pb-2">
          <p className="text-xs text-cl-text-body">Getting your location...</p>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-cl-primary text-white rounded-2xl rounded-br-md"
                  : "bg-cl-primary-light text-cl-text-dark rounded-2xl rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-cl-primary-light text-cl-text-body rounded-2xl rounded-bl-md px-4 py-2.5 text-sm">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cl-primary-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cl-primary-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cl-primary-muted animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 pb-2">
          <p className="text-xs text-red-500 text-center">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 pb-5 pt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          disabled={sending}
          className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-colors ${
            listening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-cl-primary-light text-cl-primary"
          } disabled:opacity-50`}
          aria-label={listening ? "Stop listening" : "Start voice input"}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zM11 19.93V22h2v-2.07A8.001 8.001 0 0020 12h-2a6 6 0 01-12 0H4a8.001 8.001 0 007 7.93z" />
          </svg>
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? "Listening..." : "Type or tap the mic..."}
          disabled={sending}
          className="flex-1 h-11 rounded-full border border-cl-border px-4 text-sm text-cl-text-dark placeholder:text-cl-text-muted focus:outline-none focus:border-cl-primary disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="w-11 h-11 shrink-0 rounded-full bg-cl-primary text-white flex items-center justify-center disabled:opacity-40"
          aria-label="Send"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
