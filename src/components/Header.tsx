import React from "react";

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export function Header({ language, setLanguage }: HeaderProps) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#4f46e5",
        color: "white",
        padding: "10px 20px",
      }}
    >
      <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>🛒 Voice Shopping Assistant</h1>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ padding: "5px" }}
      >
        <option value="en-US">English</option>
        <option value="hi-IN">Hindi</option>
        <option value="fr-FR">French</option>
      </select>
    </header>
  );
}
