/* Long-form guide pages (DE + EN). Each guide is a pair; slugs differ per language. */

export const CLIMATE = {
  de: { months: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'], high: [15, 16, 19, 23, 28, 33, 36, 36, 33, 28, 21, 17], note: 'Ungefähre durchschnittliche Tageshöchstwerte in °C für Antalya. Die tatsächlichen Werte schwanken von Jahr zu Jahr.' },
  en: { months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], high: [15, 16, 19, 23, 28, 33, 36, 36, 33, 28, 21, 17], note: 'Approximate average daily highs in °C for Antalya. Actual values vary from year to year.' }
};

export const GUIDES = [
  {
    id: 'belek',
    art: 'stadium',
    de: {
      slug: 'belek-trainingslager',
      title: 'Trainingslager in Belek: Teamhotels, Plätze und Planung | Antalya Camp',
      desc: 'Trainingslager in Belek planen: Lage, Anreise vom Flughafen Antalya, Hotels mit Fußballplätzen, Testspiele und worauf Vereine bei der Auswahl achten sollten.',
      h1: 'Trainingslager in Belek – kompakt planen',
      lead: 'Belek gilt als eines der bekanntesten Resortgebiete an der türkischen Riviera. Für Fußballvereine zählt vor allem, dass Hotels, Trainingsflächen und Verpflegung auf engem Raum zusammenliegen.',
      sections: [
        ['Lage und Anreise', 'Belek liegt östlich von Antalya, die Fahrt vom Flughafen dauert je nach Verkehr in der Regel rund 35 bis 45 Minuten. Das ist für Mannschaftsreisen ein Vorteil: Nach dem Flug bleibt Zeit für Zimmerbezug, Abendessen und eine lockere erste Einheit. Plant die Transferzeit trotzdem mit Puffer ein und stimmt sie mit eurer Ankunftszeit ab.'],
        ['Warum Vereine Belek wählen', 'Viele Anlagen sind auf Sportgruppen eingestellt: Frühstück und Abendessen zu festen Zeiten, Räume für Teambesprechungen, Pool und Fitnessbereich. Entscheidend ist nicht der Ortsname, sondern was das konkrete Hotel für euren Kader leisten kann.'],
        ['Hotel und Trainingsplatz abstimmen', 'Klärt vor der Buchung, ob der Platz zum Hotel gehört oder extern liegt, welche Zeitfenster verfügbar sind, ob Flutlicht vorhanden ist und wie viele Mannschaften gleichzeitig trainieren. Verbindliche Angaben sollten schriftlich bestätigt werden.'],
        ['Testspiele in der Region', 'Rund um Antalya trainieren in der Saison viele Teams. Das schafft Spielpartner, verlangt aber frühe Abstimmung: Altersklasse, Niveau, Spielmodus, Termin und Anstoßzeit sollten vor Reiseantritt feststehen.'],
        ['Für wen sich Belek eignet', 'Besonders passend ist Belek für Teams, die einen konzentrierten Wochenplan mit kurzen Wegen suchen: Jugendmannschaften, Amateurvereine, Seniorenteams und Akademien. Wer abwechslungsreiche Ausflüge plant, kann zusätzlich Side oder Kemer einbinden.']
      ],
      bullets: ['Transfer vom Flughafen Antalya: ca. 35–45 Minuten', 'Wichtig bei der Hotelwahl: Platznähe, Flutlicht, Verpflegungszeiten', 'Testspiele frühzeitig abstimmen', 'Alle Angaben vor Buchung schriftlich bestätigen lassen'],
      faq: [['Wie weit ist Belek vom Flughafen Antalya entfernt?', 'Mit dem Transfer sind es üblicherweise etwa 35 bis 45 Minuten, abhängig von Verkehr und Hotellage.'], ['Gibt es in Belek Hotels mit eigenen Fußballplätzen?', 'Ja, manche Anlagen bieten Trainingsflächen an. Verfügbarkeit, Rasenart und Zeitfenster hängen vom Hotel ab und werden im Angebot bestätigt.'], ['Wann ist die beste Reisezeit für Belek?', 'Beliebt sind Frühjahr und Herbst sowie die Winterpause. Details findet ihr in unserem Klima-Leitfaden.'], ['Können Testspiele organisiert werden?', 'Wir fragen passende Gegner für euren Termin an. Eine Zusage hängt von Verfügbarkeit und Niveau ab.']]
    },
    en: {
      slug: 'belek-football-camp',
      title: 'Belek Football Training Camp: Hotels, Pitches and Planning | Antalya Camp',
      desc: 'Plan a football training camp in Belek: location, transfer from Antalya airport, hotels with pitches, test matches and what clubs should check when choosing.',
      h1: 'Football training camp in Belek – plan it compactly',
      lead: 'Belek is one of the best-known resort areas on the Turkish Riviera. For football clubs the key point is that hotels, training facilities and catering sit close together.',
      sections: [
        ['Location and arrival', 'Belek lies east of Antalya. The transfer from the airport usually takes about 35 to 45 minutes depending on traffic. After the flight there is time for check-in, dinner and a light first session. Still plan a buffer and align it with your arrival time.'],
        ['Why clubs choose Belek', 'Many properties are used to sports groups: fixed meal times, rooms for team meetings, pool and gym. What matters is not the place name but what the specific hotel can deliver for your squad.'],
        ['Match hotel and pitch', 'Before booking, clarify whether the pitch belongs to the hotel or is external, which time slots are available, whether floodlights exist and how many teams train at once. Get binding details confirmed in writing.'],
        ['Test matches nearby', 'Many teams train around Antalya in season. That creates opponents but needs early coordination: age group, level, match format, date and kick-off should be settled before travel.'],
        ['Who Belek suits', 'Belek suits teams that want a focused weekly plan with short distances: youth teams, amateur clubs, senior teams and academies. If you want variety, Side or Kemer can be added for excursions.']
      ],
      bullets: ['Transfer from Antalya airport: about 35–45 minutes', 'Hotel choice: pitch proximity, floodlights, meal times', 'Coordinate test matches early', 'Have all details confirmed in writing before booking'],
      faq: [['How far is Belek from Antalya airport?', 'By transfer it is usually around 35 to 45 minutes, depending on traffic and hotel location.'], ['Are there hotels with their own pitches in Belek?', 'Yes, some properties offer training pitches. Availability, surface and time slots depend on the hotel and are confirmed in the offer.'], ['When is the best time to travel to Belek?', 'Spring, autumn and the winter break are popular. See our climate guide for details.'], ['Can test matches be arranged?', 'We request suitable opponents for your dates. Confirmation depends on availability and level.']]
    }
  },
  {
    id: 'spain',
    art: 'route',
    de: {
      slug: 'trainingslager-tuerkei-oder-spanien',
      title: 'Trainingslager Türkei oder Spanien? Vergleich für Vereine | Antalya Camp',
      desc: 'Trainingslager Türkei oder Spanien: Vergleich von Anreise, Klima, Kosten-Struktur, Plätzen und Organisation, damit Vereine die passende Destination wählen.',
      h1: 'Trainingslager Türkei oder Spanien – der Vergleich',
      lead: 'Beide Ziele sind bei Vereinen beliebt. Statt eines pauschalen Siegers hilft ein Vergleich nach den Kriterien, die für euren Kader wirklich zählen.',
      sections: [
        ['Anreise und Flugzeit', 'Von Deutschland, Österreich und der Schweiz dauern Flüge nach Antalya meist rund dreieinhalb Stunden, nach Spanien je nach Region etwas weniger oder mehr. Prüft Flugpläne, Gepäckregeln für Ausrüstung und Transferzeiten zusammen.'],
        ['Klima und Trainingsfenster', 'Antalya ist im Frühjahr, Herbst und Winter mild und eignet sich für viele Vorbereitungsphasen. Spanien bietet je nach Küste ebenfalls milde Bedingungen. Entscheidend sind euer Termin und die erwartete Witterung.'],
        ['Anlagen und Organisation', 'In beiden Ländern gibt es auf Teams spezialisierte Hotels. Vergleicht Platzqualität, Zeitfenster, Flutlicht, Umkleiden und Wege statt nur den Zimmerpreis.'],
        ['Kostenstruktur', 'Gesamtpreise hängen von Termin, Hotelkategorie, Verpflegung, Transfers und Zusatzleistungen ab. Vergleicht immer das gleiche Leistungspaket und achtet auf Zusatzkosten wie Platznutzung oder Schiedsrichter.'],
        ['Testspiele und Gegner', 'Beide Regionen haben in der Saison viele Teams. Fragt Testspiele früh an und haltet Wunschniveau und Spielmodus fest.'],
        ['Entscheidungshilfe', 'Legt drei bis fünf Kriterien fest, gewichtet sie und lasst euch für beide Optionen ein vergleichbares Angebot geben. So wird die Entscheidung nachvollziehbar.']
      ],
      bullets: ['Gleiches Leistungspaket vergleichen', 'Reisetermin und Witterung zuerst klären', 'Platzqualität und Wege höher gewichten als den Zimmerpreis', 'Zusatzkosten vorab erfragen'],
      faq: [['Ist die Türkei günstiger als Spanien?', 'Pauschal lässt sich das nicht sagen. Es kommt auf Termin, Hotel, Leistungsumfang und Gruppengröße an. Vergleicht identische Pakete.'], ['Welches Ziel ist für Jugendteams besser?', 'Beide funktionieren. Wichtig sind Betreuung, kurze Wege, Verpflegung und ein realistischer Wochenplan.'], ['Können wir beide Optionen anfragen?', 'Ja. Wir erstellen gern ein Angebot für Antalya, damit ihr es mit anderen Optionen vergleichen könnt.']]
    },
    en: {
      slug: 'turkey-or-spain-training-camp',
      title: 'Training Camp in Turkey or Spain? A Comparison for Clubs | Antalya Camp',
      desc: 'Training camp in Turkey or Spain: compare travel, climate, cost structure, pitches and organisation so clubs can choose the right destination.',
      h1: 'Training camp in Turkey or Spain – the comparison',
      lead: 'Both destinations are popular with clubs. Instead of a blanket winner, compare them on the criteria that really matter for your squad.',
      sections: [
        ['Travel and flight time', 'From Germany, Austria and Switzerland flights to Antalya usually take around three and a half hours; Spain is a little shorter or longer depending on the region. Check flight schedules, equipment baggage rules and transfer times together.'],
        ['Climate and training window', 'Antalya is mild in spring, autumn and winter and suits many preparation phases. Spain can also be mild depending on the coast. Your dates and expected weather decide.'],
        ['Facilities and organisation', 'Both countries have hotels geared to teams. Compare pitch quality, time slots, floodlights, changing rooms and distances rather than room price alone.'],
        ['Cost structure', 'Total prices depend on dates, hotel category, catering, transfers and extras. Always compare the same service package and watch for extras such as pitch use or referees.'],
        ['Test matches and opponents', 'Both regions host many teams in season. Request matches early and note preferred level and format.'],
        ['Decision support', 'Set three to five criteria, weight them, and request a comparable offer for each option. That makes the decision transparent.']
      ],
      bullets: ['Compare the same service package', 'Settle dates and weather first', 'Weight pitch quality and distances above room price', 'Ask about extras up front'],
      faq: [['Is Turkey cheaper than Spain?', 'There is no blanket answer. It depends on dates, hotel, scope and group size. Compare identical packages.'], ['Which destination is better for youth teams?', 'Both work. Supervision, short distances, catering and a realistic weekly plan matter most.'], ['Can we request both options?', 'Yes. We are happy to prepare an Antalya offer so you can compare it with other options.']]
    }
  },
  {
    id: 'climate',
    art: 'stadium',
    climate: true,
    de: {
      slug: 'trainingslager-klima-antalya',
      title: 'Klima und beste Reisezeit für Trainingslager in Antalya | Antalya Camp',
      desc: 'Klima in Antalya nach Monaten: Temperaturen, beste Reisezeit für Trainingslager, Wintertrainingslager, Frühjahr und Sommer-Vorbereitung im Überblick.',
      h1: 'Klima in Antalya – die beste Reisezeit fürs Trainingslager',
      lead: 'Das Wetter beeinflusst Belastungssteuerung, Spielplanung und Regeneration. Die Tabelle zeigt ungefähre Tageshöchstwerte, die Abschnitte erklären, was das für den Wochenplan bedeutet.',
      sections: [
        ['Winter und Winterpause', 'Von Dezember bis Februar ist es deutlich milder als in Mitteleuropa. Das ermöglicht Training im Freien während der Winterpause. Plant trotzdem Regenwahrscheinlichkeit und kühlere Abende ein.'],
        ['Frühjahr: März bis Mai', 'Im Frühjahr steigen die Temperaturen spürbar. Für viele Vereine ist das eine gute Phase vor der Rückrunde oder der Saisonendphase.'],
        ['Sommer: Hitze richtig planen', 'In den Sommermonaten sind sehr hohe Temperaturen üblich. Verlegt Einheiten in die frühen Morgen- und späten Abendstunden, plant Trinkpausen ein und stimmt Belastung mit dem Betreuerstab ab.'],
        ['Herbst: September bis November', 'Im Herbst sind Wasser und Luft oft noch warm, die Hitze lässt nach. Das passt gut für Camps zu Saisonbeginn oder in Länderspielpausen.'],
        ['Regeneration und Meer', 'Pool, Meer und Wellnessangebote können Regeneration unterstützen. Die Verfügbarkeit hängt vom Hotel und von eurem Programm ab.']
      ],
      bullets: ['Winter: mild, ideal für die Winterpause', 'Frühjahr: angenehm für die Vorbereitung', 'Sommer: Einheiten früh oder spät planen', 'Herbst: warm, weniger Hitze'],
      faq: [['Wann ist die beste Reisezeit?', 'Das hängt vom Saisonplan ab. Winterpause, Frühjahr und Herbst sind für viele Vereine besonders passend.'], ['Ist es im Winter warm genug zum Training?', 'Die Tageswerte sind in der Regel deutlich milder als in Mitteleuropa. Abende können kühler sein, nehmt entsprechende Kleidung mit.'], ['Wie plant man Training im Sommer?', 'Mit Einheiten am frühen Morgen oder späten Abend, ausreichend Flüssigkeit und angepasster Belastung.']]
    },
    en: {
      slug: 'antalya-climate-training-camp',
      title: 'Antalya Climate and Best Time for a Training Camp | Antalya Camp',
      desc: 'Antalya climate by month: temperatures, best time for a training camp, winter break camps, spring and summer preparation at a glance.',
      h1: 'Antalya climate – the best time for a training camp',
      lead: 'Weather shapes workload, match planning and recovery. The table shows approximate daily highs; the sections explain what that means for your weekly plan.',
      sections: [
        ['Winter and winter break', 'From December to February it is much milder than in Central Europe, which allows outdoor training during the winter break. Still allow for rain and cooler evenings.'],
        ['Spring: March to May', 'Temperatures rise noticeably in spring. For many clubs this is a good phase before the second half of the season or the run-in.'],
        ['Summer: plan for the heat', 'Very high temperatures are normal in summer. Move sessions to early morning and late evening, schedule drink breaks and align workload with the coaching staff.'],
        ['Autumn: September to November', 'In autumn the sea and air are often still warm while the heat eases. It suits camps at season start or during international breaks.'],
        ['Recovery and the sea', 'Pool, sea and wellness can support recovery. Availability depends on the hotel and your programme.']
      ],
      bullets: ['Winter: mild, ideal for the winter break', 'Spring: pleasant for preparation', 'Summer: schedule early or late sessions', 'Autumn: warm, less heat'],
      faq: [['When is the best time to travel?', 'It depends on your season plan. Winter break, spring and autumn suit many clubs particularly well.'], ['Is it warm enough to train in winter?', 'Daytime values are usually much milder than in Central Europe. Evenings can be cooler, so pack accordingly.'], ['How do you plan training in summer?', 'With sessions in the early morning or late evening, plenty of fluids and adjusted workload.']]
    }
  },
  {
    id: 'nutrition',
    art: 'route',
    de: {
      slug: 'trainingslager-ernaehrung-fussball',
      title: 'Ernährung im Fußball-Trainingslager: Planung für Teams | Antalya Camp',
      desc: 'Ernährung im Trainingslager: Verpflegung, Essenszeiten, Allergien und Regeneration für Fußballteams planen und mit dem Hotel abstimmen.',
      h1: 'Ernährung im Trainingslager – so plant ihr die Verpflegung',
      lead: 'Gute Verpflegung ist Teil der Leistungsvorbereitung. Wichtig sind verlässliche Zeiten, passende Auswahl und eine klare Abstimmung mit dem Hotel.',
      sections: [
        ['Essenszeiten an den Trainingsplan anpassen', 'Legt Frühstück, Mittag- und Abendessen so, dass sie zu euren Einheiten passen. Nach Spielen und intensiven Einheiten sollte eine Mahlzeit oder ein Snack schnell verfügbar sein.'],
        ['Allergien und Ernährungsformen', 'Meldet Allergien, Unverträglichkeiten, vegetarische oder halal-konforme Anforderungen frühzeitig. Das Hotel bestätigt, was machbar ist.'],
        ['Hydration', 'Gerade bei Wärme sind Trinkpausen und Getränkeversorgung am Platz wichtig. Plant das gemeinsam mit dem Betreuerstab.'],
        ['Verpflegungsarten', 'Typische Optionen sind Frühstück, Halbpension oder Vollpension. Welche Variante passt, hängt von Programm, Budget und Hotel ab.'],
        ['Regeneration', 'Eine ausgewogene Auswahl mit Kohlenhydraten, Eiweiß, Obst und Gemüse unterstützt die Erholung. Individuelle Ernährungsempfehlungen bleiben Sache eures Staffs.']
      ],
      bullets: ['Essenszeiten mit Plan abstimmen', 'Allergien früh melden', 'Trinkpausen einplanen', 'Verpflegungsart im Angebot prüfen'],
      faq: [['Können Sonderwünsche berücksichtigt werden?', 'Das Hotel bestätigt, was machbar ist. Meldet Anforderungen möglichst früh.'], ['Welche Verpflegung ist üblich?', 'Häufig Halbpension oder Vollpension, abhängig vom Hotel und Programm.'], ['Wer legt den Ernährungsplan fest?', 'Der Verein bzw. sein Staff. Wir koordinieren die Organisation mit dem Hotel.']]
    },
    en: {
      slug: 'football-camp-nutrition',
      title: 'Nutrition at a Football Training Camp: Planning for Teams | Antalya Camp',
      desc: 'Nutrition at a training camp: plan catering, meal times, allergies and recovery for football teams and agree them with the hotel.',
      h1: 'Nutrition at a training camp – plan your catering',
      lead: 'Good catering is part of performance preparation. Reliable timing, suitable choice and clear agreement with the hotel are what count.',
      sections: [
        ['Fit meal times to the training plan', 'Set breakfast, lunch and dinner around your sessions. After matches and intense sessions a meal or snack should be available quickly.'],
        ['Allergies and dietary needs', 'Report allergies, intolerances, vegetarian or halal requirements early. The hotel confirms what is possible.'],
        ['Hydration', 'Especially in warm weather, drink breaks and drinks at the pitch matter. Plan this with your staff.'],
        ['Board types', 'Typical options are breakfast only, half board or full board. The right choice depends on programme, budget and hotel.'],
        ['Recovery', 'A balanced choice with carbohydrates, protein, fruit and vegetables supports recovery. Individual nutrition advice remains with your staff.']
      ],
      bullets: ['Align meal times with the plan', 'Report allergies early', 'Schedule drink breaks', 'Check board type in the offer'],
      faq: [['Can special requests be accommodated?', 'The hotel confirms what is possible. Report requirements as early as you can.'], ['What board is typical?', 'Often half or full board, depending on hotel and programme.'], ['Who sets the nutrition plan?', 'The club and its staff. We coordinate the organisation with the hotel.']]
    }
  },
  {
    id: 'schedule',
    art: 'stadium',
    de: {
      slug: 'trainingslager-tagesablauf',
      title: 'Tagesablauf im Trainingslager: Beispielwoche für Fußballteams | Antalya Camp',
      desc: 'Beispiel-Tagesablauf und Wochenplan für ein Fußball-Trainingslager: Anreise, Trainingseinheiten, Regeneration, Testspiel und Abreise strukturiert planen.',
      h1: 'Tagesablauf im Trainingslager – Beispielwoche',
      lead: 'Ein guter Wochenplan verbindet Belastung, Erholung und Organisation. Das Beispiel ist eine Orientierung, kein fester Plan – euer Trainerteam bestimmt die Inhalte.',
      sections: [
        ['Anreisetag', 'Flug, Transfer, Zimmerbezug und Abendessen. Optional eine lockere Aktivierungseinheit oder Teambesprechung, abhängig von der Ankunftszeit.'],
        ['Typischer Trainingstag', 'Frühstück, Vormittagseinheit, Mittagessen und Ruhephase, Nachmittagseinheit oder Taktik, Abendessen und Teamzeit. Pausen und Trinkmöglichkeiten gehören fest dazu.'],
        ['Testspieltag', 'Anreise zum Spielort, Aufwärmen, Spiel, Regeneration und Analyse. Plant Transfer und Verpflegung vorher durch.'],
        ['Regenerationstag', 'Leichtes Programm mit Pool, Gym, Spaziergang oder Videoanalyse. Das schützt vor Überlastung.'],
        ['Abreisetag', 'Frühstück, Auschecken, Transfer. Prüft Zimmerlisten und Gepäck vorher.']
      ],
      bullets: ['Belastung und Erholung ausbalancieren', 'Transfers in den Tagesplan einbauen', 'Pufferzeiten vorsehen', 'Plan vorab mit dem Hotel abstimmen'],
      faq: [['Wie viele Einheiten pro Tag sind üblich?', 'Häufig ein bis zwei, abhängig von Alter, Niveau und Ziel. Das entscheidet euer Trainerteam.'], ['Wann sollte das Testspiel stattfinden?', 'Meist in der Wochenmitte oder gegen Ende, damit Belastung und Regeneration passen.'], ['Wie lang sollte ein Camp sein?', 'Viele Vereine planen mehrere Nächte bis etwa eine Woche. Das hängt von Ziel und Budget ab.']]
    },
    en: {
      slug: 'training-camp-daily-schedule',
      title: 'Training Camp Daily Schedule: Sample Week for Football Teams | Antalya Camp',
      desc: 'Sample daily schedule and weekly plan for a football training camp: arrival, sessions, recovery, test match and departure planned in a structured way.',
      h1: 'Training camp daily schedule – a sample week',
      lead: 'A good weekly plan balances workload, recovery and organisation. This example is a guide, not a fixed plan – your coaching team decides the content.',
      sections: [
        ['Arrival day', 'Flight, transfer, check-in and dinner. Optionally a light activation or team meeting, depending on arrival time.'],
        ['A typical training day', 'Breakfast, morning session, lunch and rest, afternoon session or tactics, dinner and team time. Breaks and drinks are built in.'],
        ['Test match day', 'Travel to the venue, warm-up, match, recovery and analysis. Plan transfer and catering beforehand.'],
        ['Recovery day', 'A light programme with pool, gym, a walk or video analysis. It helps prevent overload.'],
        ['Departure day', 'Breakfast, check-out, transfer. Check room lists and luggage in advance.']
      ],
      bullets: ['Balance workload and recovery', 'Build transfers into the day plan', 'Allow buffer time', 'Agree the plan with the hotel beforehand'],
      faq: [['How many sessions per day are typical?', 'Often one to two, depending on age, level and goal. Your coaching team decides.'], ['When should the test match be?', 'Usually mid-week or towards the end so workload and recovery fit.'], ['How long should a camp be?', 'Many clubs plan several nights up to about a week, depending on goal and budget.']]
    }
  },
  {
    id: 'safety',
    art: 'route',
    de: {
      slug: 'trainingslager-reiseunterlagen-checkliste-team',
      title: 'Reiseunterlagen und Organisation für Teams in der Türkei | Antalya Camp',
      desc: 'Reiseunterlagen, Zimmerlisten, Versicherung und Organisation für Vereine bei der Reise nach Antalya: Checkliste zur sauberen Vorbereitung.',
      h1: 'Reiseunterlagen und Organisation für Vereine',
      lead: 'Eine saubere Vorbereitung vermeidet Stress am Flughafen und im Hotel. Diese Übersicht hilft bei der Organisation – verbindliche Einreiseregeln prüft ihr immer bei den offiziellen Stellen.',
      sections: [
        ['Ausweise und Einreise', 'Prüft rechtzeitig, welche Dokumente für alle Mitreisenden nötig sind, auch für Minderjährige und Personen mit anderer Staatsangehörigkeit. Verbindliche Regeln erfahrt ihr bei den zuständigen offiziellen Stellen.'],
        ['Zimmerlisten und Teamlisten', 'Erstellt vorab Listen mit Namen, Rollen, Zimmerwünschen und Sonderanforderungen. Das beschleunigt den Check-in.'],
        ['Versicherung und Einverständnis', 'Klärt Reise- und Unfallversicherung und bei Jugendteams die Einverständniserklärungen der Eltern. Fragt bei eurem Verband oder Versicherer nach.'],
        ['Ausrüstung und Gepäck', 'Haltet Trainingsmaterial, Bälle, Medizinkoffer und Trikots in einer Packliste fest und prüft Gepäckregeln der Airline.'],
        ['Ansprechpartner vor Ort', 'Legt eine verantwortliche Person und eine Vertretung fest und teilt Kontaktdaten mit Hotel und Transferpartner.']
      ],
      bullets: ['Dokumente früh prüfen', 'Listen vorbereiten', 'Versicherung klären', 'Packliste führen'],
      faq: [['Brauchen alle Mitreisenden einen Reisepass?', 'Das hängt von Staatsangehörigkeit und aktuellen Regeln ab. Prüft es bei den offiziellen Stellen.'], ['Was gehört in die Packliste?', 'Trikots, Bälle, Medizinkoffer, Trainingskleidung, Dokumente und Ladegeräte – ergänzt um eure Teamspezifika.'], ['Wer ist vor Ort Ansprechpartner?', 'Bestimmt intern eine Person und eine Vertretung und gebt die Kontakte an Hotel und Transfer weiter.']]
    },
    en: {
      slug: 'team-travel-documents-checklist-turkey',
      title: 'Travel Documents and Organisation for Teams Going to Turkey | Antalya Camp',
      desc: 'Travel documents, room lists, insurance and organisation for clubs travelling to Antalya: a checklist for clean preparation.',
      h1: 'Travel documents and organisation for clubs',
      lead: 'Clean preparation avoids stress at the airport and hotel. This overview helps you organise – always check binding entry rules with the official authorities.',
      sections: [
        ['IDs and entry', 'Check in good time which documents everyone needs, including minors and people of other nationalities. Binding rules come from the competent official authorities.'],
        ['Room and squad lists', 'Prepare lists with names, roles, room wishes and special requirements. It speeds up check-in.'],
        ['Insurance and consent', 'Clarify travel and accident insurance and, for youth teams, parental consent forms. Ask your association or insurer.'],
        ['Equipment and luggage', 'Keep training material, balls, medical bag and kits on a packing list and check the airline luggage rules.'],
        ['On-site contact', 'Name one responsible person and a deputy and share contact details with the hotel and transfer partner.']
      ],
      bullets: ['Check documents early', 'Prepare lists', 'Clarify insurance', 'Keep a packing list'],
      faq: [['Does everyone need a passport?', 'It depends on nationality and current rules. Check with the official authorities.'], ['What belongs on the packing list?', 'Kits, balls, medical bag, training wear, documents and chargers – plus your own team specifics.'], ['Who is the contact on site?', 'Appoint one person and a deputy internally and share their contacts with the hotel and transfer.']]
    }
  }
];

/* Extra FAQ pool used to enrich every inner page (varied per page). */
export const EXTRA_FAQ = {
  de: [
    ['Wo liegt Antalya und wie reisen Teams an?', 'Antalya liegt an der türkischen Mittelmeerküste. Der Flughafen Antalya wird aus vielen deutschsprachigen Städten angeflogen; Flugzeit ab Deutschland meist rund dreieinhalb Stunden.'],
    ['Wann ist die beste Zeit für ein Trainingslager in Antalya?', 'Beliebt sind Winterpause, Frühjahr und Herbst. Im Hochsommer ist es sehr heiß, Einheiten legt man dann in die kühleren Tageszeiten.'],
    ['Wie läuft eine Anfrage bei Antalya Camp ab?', 'Ihr sendet das Formular mit Eckdaten, wir melden uns in der Regel innerhalb von 24 Stunden mit einer ersten Einschätzung und einem Angebot.'],
    ['Ist die Anfrage verbindlich und kostenlos?', 'Die erste Anfrage ist unverbindlich. Verbindliche Leistungen, Preise und Bedingungen stehen erst im schriftlichen Angebot.'],
    ['Welche Teams betreut ihr?', 'Jugendteams, Amateurvereine, Seniorenteams, Akademien und Profimannschaften.'],
    ['Können Testspiele organisiert werden?', 'Wir fragen passende Gegner für euren Termin an. Die Zusage hängt von Verfügbarkeit und Niveau ab.'],
    ['Wie groß darf eine Gruppe sein?', 'Das hängt vom Hotel und Zeitraum ab. Nennt Spieler- und Staffzahl in der Anfrage, wir prüfen die Kapazität.'],
    ['Welche Leistungen sind möglich?', 'Hotel, Verpflegung, Trainingsplätze, Regeneration, Testspiele, Flughafentransfer und lokaler Transport – nach euren Wünschen kombinierbar.']
  ],
  en: [
    ['Where is Antalya and how do teams travel there?', 'Antalya is on Turkey’s Mediterranean coast. Antalya airport is served from many German-speaking cities; flight time from Germany is usually around three and a half hours.'],
    ['When is the best time for a training camp in Antalya?', 'Winter break, spring and autumn are popular. High summer is very hot, so sessions move to cooler hours.'],
    ['How does an enquiry with Antalya Camp work?', 'You send the form with key details; we usually reply within 24 hours with a first assessment and an offer.'],
    ['Is the enquiry binding or chargeable?', 'The first enquiry is non-binding. Binding services, prices and terms only appear in the written offer.'],
    ['Which teams do you support?', 'Youth teams, amateur clubs, senior teams, academies and professional squads.'],
    ['Can test matches be organised?', 'We request suitable opponents for your dates. Confirmation depends on availability and level.'],
    ['How large can a group be?', 'It depends on the hotel and period. State player and staff numbers in your enquiry and we will check capacity.'],
    ['Which services are possible?', 'Hotel, catering, pitches, recovery, test matches, airport transfer and local transport – combined to your wishes.']
  ]
};
