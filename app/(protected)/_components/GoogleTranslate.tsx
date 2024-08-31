'use client';

import Script from "next/script";
import React from "react";
import { getCookie, setCookie } from 'cookies-next';
import Image from 'next/image';

const languages = [
  { label: "English", value: "en", src: "https://flagcdn.com/h20/us.png" },
  { label: "Español", value: "es", src: "https://flagcdn.com/h20/es.png" },
  { label: "Français", value: "fr", src: "https://flagcdn.com/h20/fr.png" },
];

const includedLanguages = languages.map(lang => lang.value).join(",");

function googleTranslateElementInit() {
  new window.google.translate.TranslateElement({
    pageLanguage: "auto",
    includedLanguages
  }, "google_translate_element");
}

export function GoogleTranslate() {
  const [langCookie, setLangCookie] = React.useState("/auto/en");

  React.useEffect(() => {
    const prefLangCookie = getCookie('googtrans') || "/auto/en";
    setLangCookie(decodeURIComponent(prefLangCookie.toString()));
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  const onChange = (value: string) => {
    const lang = "/auto/" + value;
    setLangCookie(lang);
    setCookie('googtrans', lang);
    const element = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div>
      <div id="google_translate_element" style={{ visibility: "hidden", width: "1px", height: "1px" }}></div>
      <LanguageSelector onChange={onChange} value={langCookie} />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
}

function LanguageSelector({ onChange, value }: { onChange: (value: string) => void, value: string }) {
  const langCookie = value.split("/")[2];
  return (
    <div className="relative inline-block">
      <select 
        onChange={(e) => onChange(e.target.value)} 
        value={langCookie} 
        className="bg-transparent text-foreground appearance-none pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((it) => (
          <option value={it.value} key={it.value}>
            {it.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
        <Image
          src={languages.find(lang => lang.value === langCookie)?.src || languages[0].src}
          alt={`Flag for ${langCookie}`}
          width={20}
          height={20}
        />
      </div>
    </div>
  );
}