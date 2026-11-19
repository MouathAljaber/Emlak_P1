// All page text in German and English. Edit the wording here – the components only render it.

export const LINKS = {
  website: { de: 'https://trainingslager-antalya.de/', en: 'https://trainingslager-antalya.de/en/' },
  contact: { de: 'https://trainingslager-antalya.de/contact/', en: 'https://trainingslager-antalya.de/en/contact/' },
  imprint: { de: 'https://trainingslager-antalya.de/imprint/', en: 'https://trainingslager-antalya.de/en/imprint/' },
  privacy: { de: 'https://trainingslager-antalya.de/privacy-policy/', en: 'https://trainingslager-antalya.de/en/privacy-policy/' },
  emlak: 'https://emlak-ag.de/',
  emlakLogo: 'https://emlak-ag.de/wp-content/uploads/2016/11/logo121.png'
};

export const content = {
  de: {
    meta: {
      title: 'Antalya Camp – Fußball-Trainingslager in Antalya',
      description: 'Fußball-Trainingslager in Antalya für Vereine und Teams – ein Projekt unter dem Management der Emlak AG.'
    },
    nav: { about: 'Über das Projekt', why: 'Warum wir', services: 'Leistungen', process: 'Ablauf', emlak: 'Emlak AG', faq: 'FAQ', language: 'Sprache' },
    hero: {
      badge: 'Ein Projekt der Emlak AG',
      title: ['Euer Fußball-Trainingslager in ', 'Antalya', '.'],
      lead: 'Hotel, Trainingsplätze, Testspiele und Transfers – geplant aus einer Hand. Antalya Camp organisiert Trainingslager für Vereine und Teams, unter dem Management der Emlak AG.',
      primary: 'Warum Antalya Camp?',
      secondary: 'Zur Website',
      facts: [
        { value: '5', label: 'Teamkategorien – von U9 bis Profi' },
        { value: '24 h', label: 'bis zur Antwort auf eine Anfrage' },
        { value: '1', label: 'Ansprechpartner für alles' }
      ]
    },
    about: {
      label: 'Über das Projekt',
      title: 'Was ist Antalya Camp?',
      text: 'Antalya Camp plant und organisiert Fußball-Trainingslager in Antalya, Türkei. Trainer und Vereine sollen sich auf ihr Team konzentrieren können, statt Hotels, Plätze, Transfers und Testspiele bei verschiedenen Anbietern abzustimmen.',
      teamsTitle: 'Für wen?',
      teams: [
        { name: 'Jugendteams', text: 'U9–U19: Trainingsumfang, Betreuung und Unterkunft abgestimmt auf Nachwuchsmannschaften.' },
        { name: 'Amateurvereine', text: 'Vorbereitung und Teambuilding – planbar und fair kalkuliert.' },
        { name: 'Seniorenteams', text: 'Saisonvorbereitung mit vollem Trainingsumfang, Testspielen und Regeneration.' },
        { name: 'Akademien', text: 'Strukturierte Trainingswochen für Nachwuchsleistungszentren, inklusive Sichtungsspielen.' },
        { name: 'Profiteams', text: 'Professionelle Infrastruktur, Diskretion und medizinische Betreuung nach Bedarf.' }
      ]
    },
    why: {
      label: 'Warum wir',
      title: 'Warum Vereine Antalya Camp wählen',
      text: 'Sechs Gründe, warum die Planung mit uns einfacher, sicherer und persönlicher ist.',
      items: [
        { icon: 'shield', title: 'Unter dem Management der Emlak AG', text: 'Hinter Antalya Camp steht mit der Emlak AG ein etabliertes Unternehmen – ihr habt einen verantwortlichen Partner statt einer anonymen Plattform.' },
        { icon: 'user', title: 'Ein Ansprechpartner für alles', text: 'Hotel, Plätze, Testspiele und Transfers laufen über eine Person – vor und während eures Aufenthalts.' },
        { icon: 'clock', title: 'Antwort in 24 Stunden', text: 'Jede Anfrage wird persönlich geprüft. In der Regel bekommt ihr innerhalb eines Tages ein Angebot.' },
        { icon: 'sliders', title: 'Individuell statt Standardpaket', text: 'Wir planen nach eurem Niveau, Budget und Ziel – ihr bezahlt nur, was euer Team wirklich braucht.' },
        { icon: 'file', title: 'Transparente Angebote', text: 'Ihr seht klar, was enthalten ist und was noch bestätigt werden muss – ohne versteckte Positionen.' },
        { icon: 'heart', title: 'Unverbindlich & kostenlos', text: 'Die Anfrage kostet nichts und verpflichtet zu nichts. Ihr entscheidet erst, wenn das Angebot passt.' }
      ]
    },
    services: {
      label: 'Leistungen',
      title: 'Alles, was ein Trainingslager braucht',
      text: 'Ihr wählt nur, was ihr braucht. Wir koordinieren den Rest.',
      items: [
        { icon: 'hotel', title: 'Hotel & Verpflegung', text: 'Teamfreundliche Hotels mit kurzen Wegen zu den Plätzen, Zimmeraufteilung und Voll- oder Halbpension.' },
        { icon: 'pitch', title: 'Trainingsplätze', text: 'Rasen- und Kunstrasenplätze in Trainingsqualität mit festen Zeiten, inklusive Platzbuchung.' },
        { icon: 'trophy', title: 'Testspiele', text: 'Gegner passend zu eurem Niveau – inklusive Platz, Schiedsrichter und Zeitplanung.' },
        { icon: 'bus', title: 'Transfers & Regeneration', text: 'Flughafentransfer, Fahrten vor Ort sowie Gym- und Regenerationsangebote nach Bedarf.' }
      ]
    },
    process: {
      label: 'Ablauf',
      title: 'In drei Schritten zum Trainingslager',
      steps: [
        { title: 'Anfrage', text: 'Ihr nennt uns Teamgröße, Zeitraum und Wunschleistungen.' },
        { title: 'Angebot', text: 'Innerhalb von 24 Stunden erhaltet ihr ein individuelles, unverbindliches Angebot.' },
        { title: 'Trainingslager', text: 'Nach eurer Freigabe organisieren wir alles vor Ort – ihr konzentriert euch aufs Training.' }
      ],
      weekTitle: 'So kann eine Woche aussehen',
      week: [
        { day: 'Tag 1', title: 'Anreise', text: 'Ankommen, Zimmer beziehen, Ablauf abstimmen.' },
        { day: 'Tag 2', title: 'Training', text: 'Erste Einheiten und Teamrhythmus finden.' },
        { day: 'Tag 3', title: 'Training & Recovery', text: 'Zwei Einheiten plus Regeneration.' },
        { day: 'Tag 4', title: 'Testspiel', text: 'Spieltag mit passender Intensität.', highlight: true },
        { day: 'Tag 5', title: 'Abreise', text: 'Letzte Einheit und organisierte Rückreise.' }
      ]
    },
    emlak: {
      label: 'Management',
      title: 'Ein Projekt unter dem Management der Emlak AG',
      text: 'Antalya Camp ist ein Produkt der Emlak AG und wird von ihr verantwortet und geführt. Für euch bedeutet das: ein Unternehmen, das für Planung, Kommunikation und Qualität einsteht – von der ersten Anfrage bis zur Abreise.',
      points: ['Verantwortliches Unternehmen im Hintergrund', 'Klare Zuständigkeiten und feste Ansprechpartner', 'Langfristig angelegtes Projekt statt Einmal-Angebot'],
      link: 'Zur Emlak AG'
    },
    faq: {
      label: 'FAQ',
      title: 'Häufige Fragen',
      items: [
        { q: 'Wer steht hinter Antalya Camp?', a: 'Antalya Camp ist ein Projekt unter dem Management der Emlak AG.' },
        { q: 'Wie schnell bekommen wir ein Angebot?', a: 'In der Regel innerhalb von 24 Stunden. Bei komplexeren Anfragen melden wir uns zuerst mit kurzen Rückfragen.' },
        { q: 'Ist eine Anfrage verbindlich?', a: 'Nein. Die Anfrage ist kostenlos und unverbindlich.' },
        { q: 'Was kostet ein Trainingslager?', a: 'Das hängt von Hotelstandard, Nächten, Gruppengröße, Plätzen und Extras ab. Deshalb gibt es ein individuelles Angebot statt eines Pauschalpreises.' },
        { q: 'Könnt ihr Testspiele organisieren?', a: 'Ja. Wir suchen passende Gegner vor Ort, abgestimmt auf Altersklasse, Niveau und Termin.' }
      ]
    },
    closing: {
      title: 'Mehr erfahren?',
      text: 'Alle Details, Teamseiten und das Anfrageformular findet ihr auf unserer Website.',
      website: 'Zur Website',
      contact: 'Kontakt'
    },
    footer: { rights: 'Ein Projekt unter dem Management der Emlak AG.', imprint: 'Impressum', privacy: 'Datenschutz', website: 'Website' }
  },

  en: {
    meta: {
      title: 'Antalya Camp – Football Training Camps in Antalya',
      description: 'Football training camps in Antalya for clubs and teams – a project managed by Emlak AG.'
    },
    nav: { about: 'About', why: 'Why us', services: 'Services', process: 'How it works', emlak: 'Emlak AG', faq: 'FAQ', language: 'Language' },
    hero: {
      badge: 'A project of Emlak AG',
      title: ['Your football training camp in ', 'Antalya', '.'],
      lead: 'Hotel, training pitches, test matches and transfers – planned by one partner. Antalya Camp organises training camps for clubs and teams, managed by Emlak AG.',
      primary: 'Why Antalya Camp?',
      secondary: 'Visit the website',
      facts: [
        { value: '5', label: 'team categories – from U9 to pro' },
        { value: '24 h', label: 'to reply to a request' },
        { value: '1', label: 'contact for everything' }
      ]
    },
    about: {
      label: 'About the project',
      title: 'What is Antalya Camp?',
      text: 'Antalya Camp plans and organises football training camps in Antalya, Turkey. Coaches and clubs can focus on their team instead of coordinating hotels, pitches, transfers and test matches across different providers.',
      teamsTitle: 'Who is it for?',
      teams: [
        { name: 'Youth teams', text: 'U9–U19: training load, supervision and accommodation matched to youth squads.' },
        { name: 'Amateur clubs', text: 'Preparation and team building – well planned and fairly priced.' },
        { name: 'Senior teams', text: 'Pre-season preparation with full training load, test matches and recovery.' },
        { name: 'Academies', text: 'Structured training weeks for youth academies, including scouting matches.' },
        { name: 'Professional teams', text: 'Professional infrastructure, discretion and medical support as needed.' }
      ]
    },
    why: {
      label: 'Why us',
      title: 'Why clubs choose Antalya Camp',
      text: 'Six reasons why planning with us is simpler, safer and more personal.',
      items: [
        { icon: 'shield', title: 'Managed by Emlak AG', text: 'Antalya Camp is backed by Emlak AG, an established company – you deal with an accountable partner, not an anonymous platform.' },
        { icon: 'user', title: 'One contact for everything', text: 'Hotel, pitches, test matches and transfers go through one person – before and during your stay.' },
        { icon: 'clock', title: 'Reply within 24 hours', text: 'Every request is reviewed personally. You usually receive an offer within a day.' },
        { icon: 'sliders', title: 'Tailored, not a standard package', text: 'We plan around your level, budget and goals – you only pay for what your team actually needs.' },
        { icon: 'file', title: 'Transparent offers', text: 'You can clearly see what is included and what still needs confirming – no hidden items.' },
        { icon: 'heart', title: 'Free & non-binding', text: 'A request costs nothing and commits you to nothing. You decide only once the offer fits.' }
      ]
    },
    services: {
      label: 'Services',
      title: 'Everything a training camp needs',
      text: 'Choose only what you need. We coordinate the rest.',
      items: [
        { icon: 'hotel', title: 'Hotel & meals', text: 'Team-friendly hotels close to the pitches, rooming for your group, and full or half board.' },
        { icon: 'pitch', title: 'Training pitches', text: 'Grass and artificial pitches of training-camp quality with fixed slots, booking included.' },
        { icon: 'trophy', title: 'Test matches', text: 'Opponents matched to your level – including pitch, referee and scheduling.' },
        { icon: 'bus', title: 'Transfers & recovery', text: 'Airport transfers, local transport, and gym and recovery options as needed.' }
      ]
    },
    process: {
      label: 'How it works',
      title: 'Three steps to your training camp',
      steps: [
        { title: 'Request', text: 'You tell us your team size, dates and the services you want.' },
        { title: 'Offer', text: 'Within 24 hours you receive a tailored, non-binding offer.' },
        { title: 'Training camp', text: 'Once you approve, we organise everything on site – you focus on training.' }
      ],
      weekTitle: 'What a week can look like',
      week: [
        { day: 'Day 1', title: 'Arrival', text: 'Arrive, check in and align the schedule.' },
        { day: 'Day 2', title: 'Training', text: 'First sessions and finding the team rhythm.' },
        { day: 'Day 3', title: 'Training & recovery', text: 'Two sessions plus recovery.' },
        { day: 'Day 4', title: 'Test match', text: 'Match day at the right intensity.', highlight: true },
        { day: 'Day 5', title: 'Departure', text: 'Final session and organised return trip.' }
      ]
    },
    emlak: {
      label: 'Management',
      title: 'A project managed by Emlak AG',
      text: 'Antalya Camp is a product of Emlak AG and is run under its responsibility and management. For you, that means one company that stands behind planning, communication and quality – from the first request to departure.',
      points: ['An accountable company behind the project', 'Clear responsibilities and dedicated contacts', 'A long-term project, not a one-off offer'],
      link: 'Visit Emlak AG'
    },
    faq: {
      label: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        { q: 'Who is behind Antalya Camp?', a: 'Antalya Camp is a project managed by Emlak AG.' },
        { q: 'How fast will we get an offer?', a: 'Usually within 24 hours. For more complex requests we may first get back to you with a quick question.' },
        { q: 'Is a request binding?', a: 'No. The request is free and non-binding.' },
        { q: 'What does a training camp cost?', a: 'It depends on hotel standard, nights, group size, pitches and extras. That is why you get a tailored offer instead of a flat price.' },
        { q: 'Can you organise test matches?', a: 'Yes. We find suitable local opponents matched to your age group, level and dates.' }
      ]
    },
    closing: {
      title: 'Want to know more?',
      text: 'You will find all details, team pages and the enquiry form on our website.',
      website: 'Visit the website',
      contact: 'Contact'
    },
    footer: { rights: 'A project managed by Emlak AG.', imprint: 'Imprint', privacy: 'Privacy policy', website: 'Website' }
  }
};
