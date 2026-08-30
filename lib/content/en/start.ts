/**
 * English content for the home page.
 *
 * Mirrors lib/content/golden-calm.ts one to one - same keys, same order, so
 * the components can take either without knowing which language they are
 * rendering.
 *
 * Not a machine translation. Two things had to be handled with care:
 *
 *  - German health-care terms have no clean English equivalent and must not
 *    be invented. "Heilmittelverordnung" becomes "doctor's prescription",
 *    "gesetzliche Krankenkasse" stays "statutory health insurance" with the
 *    German term beside it, because that is what appears on the reader's
 *    insurance card.
 *  - The Heilmittelwerbegesetz applies to the English text as well. No
 *    promises of results, no cures, no testimonials - the same restraint as
 *    in the German version.
 */

export const person = {
  name: "Nora Heidenreich",
  titel: "Physiotherapist (B.Sc. NL) | M.A. (Health Administration)",
} as const;

export const hero = {
  augenbraue: "Private practice · for privately insured patients and self-payers",
  titelZeilen: ["Physiotherapy at home", "in the Ahrweiler district"],
  text: "Treatment in your own four walls – no travelling, no waiting room, undivided attention for every appointment.",
  merkmale: [
    {
      symbol: "zuhause",
      titel: "Treatment at home",
      text: "No travelling, no waiting room",
    },
    {
      symbol: "neurologie",
      titel: "Neurological experience",
      text: "From clinical practice",
    },
    {
      symbol: "person",
      titel: "One therapist",
      text: "No changing between appointments",
    },
  ],
} as const;

export const konzept = {
  kicker: "The idea",
  titel: "Therapy that adapts to your life – not the other way round.",
  text: "You stay at home. I bring everything the treatment needs and work in the surroundings you move through anyway. That makes progress visible in daily life straight away.",
  karten: [
    {
      nummer: "01",
      titel: "Comfort at home",
      text: "No transport service, no stairs in unfamiliar buildings, no waiting. The appointment starts when it is meant to start.",
    },
    {
      nummer: "02",
      titel: "Attentive care",
      text: "One consistent contact, a calm arrival, full confidentiality. Family can be involved if you wish.",
    },
    {
      nummer: "03",
      titel: "Time and expertise",
      text: "Enough time per treatment, documented progress and regular professional development – with a focus on neurology.",
    },
  ],
} as const;

export const leistungen = {
  kicker: "Treatments",
  titel: "One focus, one treatment plan",
  text: "Every course of treatment begins with a thorough assessment. From it comes a plan that fits your condition, your pace and your home.",
  karten: [
    {
      bild: "haende" as const,
      titel: "Neurological treatment",
      text: "After a stroke, with Parkinson's disease, multiple sclerosis or polyneuropathy: walking, balance, fine motor skills and safety in daily life.",
    },
    {
      bild: "behandlung" as const,
      titel: "Orthopaedic treatment",
      text: "Targeted mobilisation of joints and tissue for complaints in the back, shoulder, hip and knee – including post-operative care.",
    },
    {
      bild: "treppe" as const,
      titel: "Fall prevention",
      text: "Strength, balance and steadiness – including a look at trip hazards in your home and exercises for the week.",
    },
    {
      bild: "lymphdrainage" as const,
      titel: "Lymphatic drainage",
      text: "Gentle manual technique to stimulate lymph flow with swelling after surgery and with lymphoedema, with bandaging where needed.",
    },
    {
      bild: "kinesiotaping" as const,
      titel: "Kinesio taping",
      text: "Elastic tape to relieve muscles and joints – supportive for complaints and for stability in daily life.",
    },
  ],
} as const;

export const ueberMich = {
  kicker: "About me",
  titel: "Nora Heidenreich",
  absaetze: [
    "I studied physiotherapy in the Netherlands and worked for many years in university hospitals, mostly in neurology. That is where I saw how much of a treatment is lost to travelling, waiting and time pressure.",
    "So I come to my patients at home – with fixed appointments, enough time and a deliberately small caseload. If you wish, I involve family members so that exercises can continue safely between appointments.",
  ],
  fakten: [
    { label: "Degree", wert: "B.Sc. Physiotherapy, Netherlands" },
    { label: "Postgraduate", wert: "M.A. Health Administration" },
    { label: "Focus", wert: "Neurological rehabilitation" },
    { label: "Area", wert: "Ahrweiler district and surroundings" },
  ],
} as const;

export const kontaktBand = {
  kicker: "Contact",
  titel: "Request a home visit",
  text: "Write to me, or call. I get back to you promptly and we work out calmly whether and how I can help.",
  anrufLabel: "Call directly",
  sprechzeiten: "Times for enquiries: Monday to Friday, 8 am – 6 pm",
  formularTitel: "Prefer to write?",
  formularText: "Three details are enough – I will call you back.",
  formularLink: "Full form with preferred time and message",
} as const;
