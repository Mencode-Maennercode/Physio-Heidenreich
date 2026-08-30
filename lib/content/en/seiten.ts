/**
 * English content for the sub-pages: treatments, about, how it works.
 *
 * Mirrors lib/content/behandlung.ts, ueber-mich.ts and ablauf.ts key for
 * key, so the same components render both languages.
 *
 * Three things were handled deliberately rather than translated word for
 * word:
 *
 *  - German insurance terms are kept alongside the English, because that is
 *    what the reader sees on their card and says on the phone: "statutory
 *    health insurance (gesetzliche Krankenkasse)", "Beihilfe".
 *  - "Mobilisation von Gelenken und Muskulatur" stays a description, not
 *    "manual therapy". The German title avoids a protected certificate
 *    term; calling it manual therapy in English would reintroduce exactly
 *    the claim the German text carefully avoids.
 *  - No promises of results anywhere. The Heilmittelwerbegesetz applies to
 *    the English text of a German practice just as much.
 */

/* ---------------------------------------------------------------- Treatments */

export const behandlungKopf = {
  augenbraue: "Treatments",
  titel: "What I do at your home",
  text: "The full range of physiotherapy in a home visit. My focus is neurology — the other treatments belong just as much.",
} as const;

export const leistungsliste = {
  augenbraue: "Treatments",
  titel: "What I treat",
  text: "Complete and without compromise — a home visit is not a reduced programme.",
  liste: [
    {
      titel: "Neurological treatment",
      was: "Walking, balance, fine motor skills and safety in daily life — more on this in the section below.",
      fuerWen: "After a stroke, with Parkinson's disease, multiple sclerosis or polyneuropathy.",
    },
    {
      titel: "Exercise therapy",
      was: "Active and passive exercise treatment for strength, mobility and coordination.",
      fuerWen: "For complaints in joints, spine and muscles.",
    },
    {
      titel: "Mobilisation of joints and muscles",
      was: "Hands-on treatment: making joints move more freely, stretching shortened muscles, loosening tissue.",
      fuerWen: "For restricted movement, stiffness and muscular tension.",
    },
    {
      titel: "Post-operative care",
      was: "Continuing treatment after hospital and rehabilitation, matched to the loading limits you were given.",
      fuerWen: "After joint replacement, spinal and soft tissue surgery.",
    },
    {
      titel: "Fall prevention and gait training",
      was: "Balance, standing up safely, handling walking aids — and a look at your home.",
      fuerWen: "For unsteadiness, dizziness and after falls.",
    },
    {
      titel: "Manual lymphatic drainage",
      was: "Gentle technique to stimulate lymph flow, with bandaging where needed.",
      fuerWen: "For swelling after surgery and with lymphoedema.",
    },
    {
      titel: "Support with long-term conditions",
      was: "Longer-term care with an exercise programme for in between.",
      fuerWen: "For conditions that are not finished after six appointments.",
    },
    {
      titel: "Instructing family members",
      was: "Positioning, transfers, helping someone walk — the handling that makes daily life safer.",
      fuerWen: "For everyone caring at home who wants to protect their own back.",
    },
  ],
} as const;

export const schwerpunkt = {
  augenbraue: "Focus",
  titel: "Neurological treatment in the home",
  text: "After a stroke, with Parkinson's disease, multiple sclerosis or polyneuropathy, after a long hospital stay. Also when rehabilitation was long ago and the aim is to keep the movement you have.",
  indikationen: [
    "After a stroke",
    "Parkinson's disease",
    "Multiple sclerosis",
    "Polyneuropathy",
    "After a long hospital stay",
    "Dizziness and unsteady walking",
  ],
} as const;

export const warumZuHause = {
  augenbraue: "Why this works better at home",
  titel: "Neurological therapy aims at daily life. So daily life is where you practise.",
  gruende: [
    {
      titel: "You practise on your own stairs",
      text: "Not on stairs in an exercise room. What you want back are particular movements in particular places: your own bathroom, your own bed, the way to your front door.",
    },
    {
      titel: "Nothing breaks on the way home",
      text: "“It worked in the practice, but not at home” is the most common problem in neurological therapy. If therapy happens at home, that gap does not exist.",
    },
    {
      titel: "The surroundings can be changed straight away",
      text: "Trip hazards, seat heights, grab rails, walking routes. I see most of it in ten minutes — and we can change it together instead of talking about it.",
    },
    {
      titel: "Family members are there",
      text: "Whoever helps every day learns the handling where it is needed. That takes real weight off and makes a lot possible between appointments.",
    },
    {
      titel: "No energy spent on the journey",
      text: "After a stroke or with multiple sclerosis, half the day's energy otherwise goes on getting there and back. Here that energy goes into the treatment.",
    },
    {
      titel: "Familiar surroundings, the same face",
      text: "With problems of orientation or memory this is often what makes therapy work at all. You always have the same therapist — no changing practitioners.",
    },
  ],
} as const;

export const wohnungswegText = {
  augenbraue: "One day, five places",
  titel: "Where a treatment at home actually happens",
  text: "Not in a treatment room, but along the route you walk every day anyway. Scroll along.",
  stationen: [
    {
      marke: "At the bed",
      titel: "The first transfer of the day",
      text: "Turning over, getting to the edge of the bed, standing up. If that works safely, it carries the whole day. If it does not, little else helps.",
      x: 125,
      y: 135,
    },
    {
      marke: "In the bathroom",
      titel: "The tightest space in the home",
      text: "Moving across a few square metres, finding support without pulling up on the basin. Five minutes here show me which grab rail is missing.",
      x: 270,
      y: 135,
    },
    {
      marke: "In the hallway",
      titel: "Walking, turning, thresholds",
      text: "Turning around in a narrow space, not catching on a door threshold, getting through a normal door with a walker or stick. Whether walking is safe shows here — not on ten metres of open floor.",
      x: 330,
      y: 247,
    },
    {
      marke: "On the stairs",
      titel: "Up and down, in the right order",
      text: "Up with the stronger leg, down with the affected one. Practised on your handrail, at your step height, in your light.",
      x: 440,
      y: 300,
    },
    {
      marke: "At the front door",
      titel: "What most people are aiming for",
      text: "Getting outside alone again. The threshold, the key, the first step out — and the way back, which is often the harder one.",
      x: 505,
      y: 348,
    },
  ],
} as const;

/* ------------------------------------------------------------------- About */

export const aboutKopf = {
  augenbraue: "About me",
  titel: "Nora Heidenreich",
  untertitel: "Physiotherapist",
} as const;

export const aboutEinleitung = {
  absaetze: [
    "I am a physiotherapist and make home visits in the Ahrweiler district. Before that I worked for many years in hospitals and practices — and specialised in people whose condition is chronic. That means: it does not pass after a few weeks, it stays part of daily life.",
    "That work changed how I treat. I do not think in prescription periods. I want to accompany people in their daily lives, at the points where it becomes difficult: what has to work tomorrow morning? What can be managed alone, what needs support? Where in the hallway is the spot that feels unsafe?",
  ],
} as const;

export const aboutWerdegang = {
  augenbraue: "Background",
  titel: "Where I learned this",
  stationen: [
    {
      zeit: "2015",
      titel: "Physiotherapy degree, Enschede (Netherlands)",
      text: "Bachelor of Science. Additional modules on treating people with chronic conditions; bachelor's thesis in that field.",
    },
    {
      zeit: "2015–2016",
      titel: "Franziskus Hospital Münster, orthopaedic ward",
      text: "First clinical post after the degree: treatment after surgery and for orthopaedic complaints.",
    },
    {
      zeit: "2016–2018",
      titel: "Münster University Hospital, neurological intensive care",
      text: "Treating severely affected patients in the early phase — where every movement has to be built up again from the beginning.",
    },
    {
      zeit: "2019",
      titel: "Master of Arts Health Administration, Bielefeld University",
      text: "Master's thesis on care for people with severe multiple disabilities.",
    },
    {
      zeit: "2018–2026",
      titel: "Further clinical posts",
      text: "Various practices and other institutions, including a unit for patients in prolonged disorders of consciousness, palliative and hospice care, and work with people with severe multiple disabilities.",
    },
    {
      zeit: "since 2026",
      titel: "Own mobile practice",
      text: "Home visits in the Ahrweiler district, for privately insured patients and self-payers.",
    },
  ],
} as const;

export const aboutQualifikation = {
  augenbraue: "Qualifications",
  titel: "Degrees and further training",
  abschluesse: [
    {
      titel: "Bachelor of Science Physiotherapy",
      detail: "Studied in the Netherlands – focus on people with chronic conditions",
    },
    {
      titel: "Master of Arts Health Administration",
      detail: "Master's thesis on people with severe multiple disabilities",
    },
  ],
  fortbildungenTitel: "Further training",
  fortbildungen: [
    "Manual lymphatic drainage",
    "Proprioceptive Neuromuscular Facilitation (PNF) – neurological focus",
    "Trigger point treatment",
  ],
  fortbildungenHinweis:
    "I continue to train regularly — with a focus on neurology and beyond it.",
  hinweis:
    "A university degree in physiotherapy is still the exception in Germany — the usual route is vocational training. I mention it not to set myself apart, but because it explains why I approach assessment differently.",
} as const;

export const aboutHaltung = {
  augenbraue: "How I work",
  titel: "How I work",
  absaetze: [
    "I plan my appointments with time to spare and I am reliably there — if something does shift, I let you know in good time. During the treatment itself I take the agreed time calmly: no clock-watching, no parallel appointments in the next room.",
    "I explain what I am doing and why. To family members too, and more than once. Someone who understands what an exercise is for is more likely to keep doing it after I have left.",
    "And I say so when I am not the right person. Sometimes it needs a different discipline, an aid, or simply the doctor again. Then I refer you on instead of filling appointments.",
  ],
} as const;

export const aboutWarumHausbesuche = {
  augenbraue: "Why home visits",
  titel: "Because the people I worked with cannot get to a practice",
  absaetze: [
    "In hospital I discharged many patients — home, with a prescription in their hand and the advice to find a practice. Some of them never found one that comes to them.",
    "That is the gap I am closing. Not as a fallback, but because for many conditions treatment at home is simply the better option.",
  ],
} as const;

/* ------------------------------------------------------------ How it works */

export const ablaufKopf = {
  augenbraue: "How it works & fees",
  titel: "Everything worth knowing beforehand",
  text: "How to get in touch, how an appointment comes about, who receives which invoice and what your insurer reimburses.",
} as const;

export const ablaufStationen = [
  {
    nummer: "01",
    titel: "You get in touch",
    text: "By phone if possible — most things are settled in five minutes. Text message and the form work just as well.",
    details: [
      "Who is it about and what has happened?",
      "Which town do you live in?",
      "Is there a doctor's prescription?",
    ],
    hinweis:
      "Where you live is not a detail: I drive fixed routes, and that decides whether I can fit an appointment in.",
  },
  {
    nummer: "02",
    titel: "A phone consultation",
    text: "About fifteen minutes, free and without obligation. Afterwards we both know whether it fits.",
    details: [
      "What you need and what I can offer",
      "Whether a prescription is required and who issues it",
      "How your insurer handles it",
      "What the treatment will cost",
    ],
    hinweis:
      "You receive everything we discussed in writing afterwards — before any appointment takes place.",
  },
  {
    nummer: "03",
    titel: "The first appointment at your home",
    text: "Assessment, shared goals, first treatment. And a look at your home.",
    details: [
      "Where does daily life become difficult?",
      "What should be possible again in eight weeks?",
      "Which places in the home feel unsafe?",
    ],
    hinweis:
      "Family members are welcome to be there. Usually it is better if someone listens in.",
  },
  {
    nummer: "04",
    titel: "Invoice and reimbursement",
    text: "After the prescribed series of treatments is complete, by post or e-mail — with everything your insurer needs. For longer-term care we agree the interval in advance.",
    details: [
      "You pay the invoice to me",
      "You submit it to your insurer",
      "The reimbursement goes directly to you",
    ],
    hinweis:
      "Nothing appears on the invoice that you did not already know about.",
  },
] as const;

export const ablaufSituationen = [
  {
    id: "privat",
    knopf: "Privately insured",
    titel: "You have private health insurance",
    ablauf: [
      {
        marke: "You need",
        text: "A doctor's prescription — the private prescription from your doctor.",
      },
      {
        marke: "I treat",
        text: "And then invoice you. Not your insurer.",
      },
      {
        marke: "You pay",
        text: "The invoice to me, and submit it to your insurer.",
      },
      {
        marke: "You get back",
        text: "Whatever your policy provides for remedial treatment. It is listed in your terms under “Heilmittel” or “Physiotherapie”.",
      },
    ],
    achtung:
      "Home visits and travel costs are included in most policies — but not all. If in doubt, call your insurer first. I will tell you exactly what the invoice will say so that you can ask precisely.",
  },
  {
    id: "beihilfe",
    knopf: "Beihilfe",
    titel: "You are entitled to Beihilfe",
    ablauf: [
      { marke: "You need", text: "A doctor's prescription as well." },
      {
        marke: "You submit twice",
        text: "Once to your Beihilfe office, once to your private supplementary insurer.",
      },
      {
        marke: "What applies",
        text: "The Beihilfe regulations of your federal state or the federal government. They contain their own rules for home visits.",
      },
    ],
    achtung:
      "Beihilfe reimburses remedial treatment only up to set maximum amounts. Anything above stays with you. In the phone consultation I tell you what to expect — so you do not discover it on the invoice.",
  },
  {
    id: "selbstzahler",
    knopf: "Self-payer",
    titel: "You pay yourself",
    ablauf: [
      {
        marke: "Possible without a prescription",
        text: "Prevention, training, advice and instructing family members — fall prevention, for example, or an exercise programme for home.",
      },
      {
        marke: "Prescription required",
        text: "As soon as the treatment addresses a medical condition. German law requires this, and I keep to it.",
      },
      {
        marke: "You pay",
        text: "The invoice directly and in full. As a rule there is no reimbursement.",
      },
    ],
    achtung:
      "This line is often ignored. I do not ignore it — in the end it protects you. We clarify openly on the phone which side your situation falls on.",
  },
  {
    id: "gesetzlich",
    knopf: "Statutory insurance",
    titel: "You have statutory health insurance",
    ablauf: [
      {
        marke: "Openly said",
        text: "I do not bill statutory health insurance funds (gesetzliche Krankenkassen). I cannot accept a statutory prescription.",
      },
      {
        marke: "Still possible",
        text: "Treatment as a self-payer. Then what is written under “Self-payer” applies to you.",
      },
      {
        marke: "If you need a statutory service",
        text: "Practices with statutory approval that make home visits are rare here — but they exist. Call me and I will name some.",
      },
    ],
    achtung:
      "Some funds reimburse invoices from private practices under certain conditions (Kostenerstattung under § 13 SGB V). This has to be agreed with your fund beforehand and is the exception. Do not rely on it without asking.",
  },
] as const;

export const ablaufAngehoerige = {
  augenbraue: "If you are asking on someone else's behalf",
  titel: "That applies to most people reading this",
  bloecke: [
    {
      titel: "Who decides",
      text: "As long as your relative can decide for themselves, they decide. Otherwise a healthcare power of attorney (Vorsorgevollmacht) or legal guardianship covering health care is needed. Please bring the document to the first appointment.",
    },
    {
      titel: "Working with others",
      text: "I am glad to speak directly with the GP, the nursing service and anyone else involved — it saves you telling everything twice. For that I need to be released from confidentiality. One sentence on paper is enough; I bring the form.",
    },
    {
      titel: "You may be present",
      text: "And often it is better that way. Whoever helps every day learns the handling best where it is needed — getting up out of this particular chair.",
    },
    {
      titel: "Almost nothing to prepare",
      text: "A chair without armrests, about two metres of clear floor, and if possible a bed I can reach from both sides. I bring equipment and a mat.",
    },
  ],
} as const;

export const ablaufCheckliste = {
  augenbraue: "For the first appointment",
  titel: "What should be ready",
  text: "None of this is compulsory. But the more of it is there, the less of the first appointment goes on paperwork.",
  punkte: [
    "Doctor's prescription, if you have one",
    "Name of the health insurer, and for Beihilfe the Beihilfe office as well",
    "Recent doctors' letters or the hospital discharge letter",
    "A list of medication",
    "Aids you already have — walker, walking stick, bed rail, splints",
    "With legal guardianship: the guardian's ID or the power of attorney",
    "Name and phone number of the person I can reach with questions",
  ],
} as const;

export const ablaufZusagen = {
  augenbraue: "What you get from me",
  titel: "Binding, and in writing",
  punkte: [
    {
      titel: "A written quote before the first appointment",
      text: "With duration, price and travel. Before you have to decide.",
    },
    {
      titel: "Fixed appointments",
      text: "Where possible the same weekday at the same time. That makes planning easier on both sides.",
    },
    {
      titel: "An invoice with everything needed",
      text: "Set out so that insurers and Beihilfe accept it without queries.",
    },
    {
      titel: "Cancellation up to 24 hours before",
      text: "Free of charge. If the condition suddenly worsens, at shorter notice too, of course.",
    },
  ],
} as const;

export const ablaufKeinePreisliste = {
  titel: "Why there is no price list here",
  absaetze: [
    "Because a figure without context says nothing. How long a treatment takes, how often it is needed and how far I drive differs for everyone.",
    "I tell you the price in the free phone consultation and confirm it in writing afterwards — binding, complete, and before any appointment takes place. Nothing appears on the invoice later that you did not already know.",
  ],
} as const;

export const ablaufGrenzen = {
  titel: "What I do not offer",
  text: "So that you do not call and then hear that it will not work.",
  punkte: [
    "No billing through statutory health insurance",
    "No emergencies and no weekend appointments",
    "No short-notice visits — I plan in fixed routes",
    "No treatment without a prior phone call",
    "No medical diagnosis — that stays with your doctor",
  ],
} as const;

export const ablaufFragen = {
  augenbraue: "Frequent questions",
  titel: "What I am asked most often",
  liste: [
    {
      frage: "Do I need a doctor's prescription?",
      antwort:
        "For treatment addressing a medical condition: yes. For prevention, training and instructing family members: no. We clarify which applies to you on the phone.",
    },
    {
      frage: "What does a treatment cost?",
      antwort:
        "I tell you in the free phone consultation and confirm it in writing before the first appointment. A single figure would be dishonest, because duration, frequency and travel differ so much.",
    },
    {
      frage: "How quickly can I get an appointment?",
      antwort:
        "I work with a deliberately small number of patients and drive fixed routes. If it fits your town and your time, it can be quick — otherwise it may take a while. I will tell you honestly rather than keep you waiting.",
    },
    {
      frage: "How long does an appointment take?",
      antwort:
        "Usually between 30 and 60 minutes, depending on the treatment and how much you can manage. The first appointment takes longer because assessment and goal-setting come on top.",
    },
    {
      frage: "Do you come to care homes or assisted living?",
      antwort:
        "Yes, provided the facility agrees. I am happy to arrange it with the nursing management.",
    },
    {
      frage: "What if my father is unwell on the day?",
      antwort:
        "Then cancel. Up to 24 hours beforehand that is free anyway, and if the condition suddenly worsens at shorter notice too. Nobody should be treated because an appointment is in the diary.",
    },
    {
      frage: "Do I need equipment or a mat?",
      antwort:
        "No. What I need, I bring. Everything else we set up with what you already have — that is half the point of the whole thing.",
    },
    {
      frage: "Will you speak to my GP?",
      antwort:
        "Gladly, if you release me from confidentiality. Reporting back to the prescribing practice is part of the treatment for me.",
    },
    {
      frage: "Do you treat children?",
      antwort:
        "My focus is adults. For children I refer to colleagues with the relevant further training.",
    },
  ],
} as const;
