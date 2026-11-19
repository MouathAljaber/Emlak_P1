import { useEffect, useState } from 'react';
import { content } from './content.js';
import { Header, Hero, About, WhyUs, Services, Process, Faq, Closing, Footer } from './components/Sections.jsx';

const STORAGE_KEY = 'antalya-camp-lang';

function initialLanguage() {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'de' || fromUrl === 'en') return fromUrl;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'de' || saved === 'en') return saved;
  } catch { /* storage blocked */ }
  return navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en';
}

export default function App() {
  const [lang, setLang] = useState(initialLanguage);
  const t = content[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch { /* storage blocked */ }
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState(null, '', url);
  }, [lang, t]);

  return (
    <>
      <Header t={t} lang={lang} setLang={setLang} />
      <main>
        <Hero t={t} lang={lang} />
        <About t={t} />
        <WhyUs t={t} />
        <Services t={t} />
        <Process t={t} />
        <Faq t={t} />
        <Closing t={t} lang={lang} />
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
