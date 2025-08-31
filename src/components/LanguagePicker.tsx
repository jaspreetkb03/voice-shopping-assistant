interface LanguagePickerProps {
  value: "en-US" | "hi-IN";
  onChange: (v: "en-US" | "hi-IN") => void;
}

export default function LanguagePicker({ value, onChange }: LanguagePickerProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as "en-US" | "hi-IN")}
      className="border p-2 rounded mb-4"
    >
      <option value="en-US">English</option>
      <option value="hi-IN">हिन्दी</option>
    </select>
  );
}
