/* ------------------------------------------------------------------
   ALL invitation details and ALL text live in this file.
   Anything in [ ] is a placeholder: replace it with the real detail.
   Every text has a Khmer (kh) and an English (en) version.
------------------------------------------------------------------- */
window.INVITE = {
  eventISO: '2026-11-18T09:00:00+07:00',   // start of the programme (drives countdown + calendar)
  endISO: '',                              // optional end time, leave '' if unknown

  // Optional files. Leave '' until you have them. (tools/make_images.py can fill the photos for you.)
  coverPhoto: '',   // e.g. 'assets/img/cover-1280.webp'
  wordsPhoto: '',   // photo inside the arch, e.g. 'assets/img/words-1280.webp'
  music: '',        // e.g. 'assets/music.mp3'  (only a file you have the rights to)

  title: { kh: 'ពិធីឡើងគេហដ្ឋានថ្មី និងចម្រើនអាយុវឌ្ឍនមង្គល', en: 'Housewarming and Birthday Celebration' },
  event: {
    kh: 'ពិធីឡើងគេហដ្ឋានថ្មី និងចម្រើនអាយុវឌ្ឍនមង្គល',
    en: 'Housewarming & Birthday Celebration'
  },

  // name logo: top-left name, bottom-right name
  logo: { kh: ['យ៉ូវ សេងគុណ', 'និងភរិយា'], en: ['Youv Sengkun', '& Spouse'] },
  hostEn: 'Mr. Youv Sengkun & Spouse',
  hosts: {
    label: { kh: 'ម្ចាស់កម្មវិធី', en: 'Hosts' },
    lines: { kh: ['លោក យ៉ូវ សេងគុណ', 'និង ភរិយា'], en: ['Mr. Youv Sengkun', '& Spouse'] }
  },

  date: {
    weekday: { kh: 'ពុធ', en: 'Wed' },
    day:     { kh: '១៨', en: '18' },
    month:   { kh: 'វិច្ឆិកា', en: 'Nov' },
    year:    { kh: '២០២៦', en: '2026' },
    full:    { kh: 'ថ្ងៃ ពុធ ទី ១៨ ខែ វិច្ឆិកា ឆ្នាំ ២០២៦', en: 'Wednesday, 18 November 2026' },
    time:    { kh: 'វេលាម៉ោង ៩:០០ នាទីព្រឹក', en: '9:00 AM' },
    lunar:   {
      kh: 'ដែលត្រូវនឹងថ្ងៃ ៩កើត ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក ពុទ្ធសករាជ ២៥៧០',
      en: '9th Waxing Day of Kadeuk, Year of the Horse, B.E. 2570'
    }
  },

  // Venue: fill these in. lat/lng enable the embedded map and the Open Google Maps button.
  venue: {
    name:    { kh: '[ឈ្មោះទីកន្លែង]', en: '[Venue name]' },
    address: { kh: '[អាសយដ្ឋាន]',   en: '[Address]' },
    lat: null, lng: null,
    mapsUrl: ''       // optional: a full Google Maps link (used instead of lat/lng for the button)
  },

  // Draft wording: please read and edit.
  words: {
    kh: 'ដើម្បីប្រសិទ្ធពរជ័យសិរីសួស្តីមង្គល យើងខ្ញុំសូមគោរពអញ្ជើញ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា ចូលរួមជាភ្ញៀវកិត្តិយស ក្នុងពិធីឡើងគេហដ្ឋានថ្មី និងចម្រើនអាយុវឌ្ឍនមង្គល ដែលនឹងប្រព្រឹត្តទៅតាមកម្មវិធីខាងក្រោម។',
    en: 'To receive auspicious blessings, we respectfully invite Excellencies, Lok Chumteav, Ladies and Gentlemen to join us as honoured guests at our Housewarming and Longevity Blessing Ceremony, held according to the programme below.'
  },

  blessing: {
    kh: 'សិរីសួស្តី · ជ័យមង្គល · សុខសន្តិភាព · អាយុ វណ្ណៈ សុខៈ ពលៈ · ',
    en: 'Blessings · Prosperity · Peace · Joy · '
  },

  // Programme (your text, as written). English lines are a draft translation.
  program: {
    start: { kh: 'វេលាម៉ោង ៩:០០ នាទីព្រឹក ចាប់ដំណើរការកម្មវិធី', en: 'The programme begins at 9:00 AM' },
    items: [
      { icon: 'home',  kh: 'បូជាគ្រឿងសក្ការៈចំពោះ ព្រះភូមិ ជំនាងផ្ទះ កុងម៉ា ( លក្ខណៈគ្រួសារ)', en: 'Offerings to the guardian spirits of the land and house (family rite)' },
      { icon: 'lotus', kh: 'បូជាគ្រឿងសក្ការៈចំពោះគុណព្រះរតនត្រ័យ នមស្សការ សមទានសីល', en: 'Offerings to the Triple Gem, paying homage and taking the precepts' },
      { icon: 'gift',  kh: 'ខមាទោស មាតាបិតា និងជូនទេយ្យវត្ថុ', en: 'Asking forgiveness from parents and presenting offerings' },
      { icon: 'water', kh: 'ស្រោចសុគន្ធវារី មាតាបិតា', en: 'Sprinkling scented water on parents' },
      { icon: 'bell',  kh: 'ចម្រើព្រះបរិត្ត', en: 'Monks chant the blessings (Paritta)' },
      { icon: 'bowl',  kh: 'វេរភត្តពេលត្រង់ប្រគេនព្រះសង្ឃ', en: 'Offering the midday meal to the monks' },
      { icon: 'merit', kh: 'ផ្សាយបុណ្យកុសល ជាកិច្ចបញ្ចប់កម្មវិធី។', en: 'Sharing of merit, concluding the programme' }
    ]
  },

  gallery: {
    heading: { kh: 'វិចិត្រសាលរូបភាព', en: 'PHOTO GALLERY' },
    sub:     { kh: 'ទិដ្ឋភាព និងអនុស្សាវរីយ៍', en: 'Moments & Views' }
  },

  thanks: {
    kh: 'យើងខ្ញុំ សូមគោរពថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅចំពោះវត្តមានដ៏ខ្ពង់ខ្ពស់របស់ ឯកឧត្តម លោកជំទាវ លោកអ្នកឧកញ៉ា អ្នកឧកញ៉ា ឧកញ៉ា លោក លោកស្រី អ្នកនាង កញ្ញា ក្នុងពិធីឡើងគេហដ្ឋានថ្មី និងចម្រើនអាយុវឌ្ឍនមង្គល នាពេលខាងមុខនេះ។',
    en: 'We would like to express our deepest and most heartfelt gratitude for the esteemed presence of Excellencies, Lok Chumteav, Neak Oknha, Oknha, Ladies, and Gentlemen at our Housewarming and Longevity Blessing Ceremony.'
  },
  apology: {
    kh: 'យើងខ្ញុំសុំការអធ្យាស្រ័យទុកជាមុនផងដែរ ករណីដែលយើងខ្ញុំពុំបានជូនលិខិតអញ្ជើញនេះដោយផ្ទាល់ ពុំបានសរសេរគោរមងារបានត្រឹមត្រូវតាមឋានៈ។',
    en: 'We sincerely apologize in advance in the event that we could not deliver this invitation card in person, or if official honorific titles were not addressed according to protocol.'
  },
  shareText: {
    kh: 'សូមគោរពអញ្ជើញ ពិធីឡើងគេហដ្ឋានថ្មី និងចម្រើនអាយុវឌ្ឍនមង្គល',
    en: 'You are invited: Housewarming & Longevity Blessing Ceremony'
  }
};

/* Interface text, Khmer first. */
window.I18N = {
  kh: {
    tap: 'ចុចលើត្រាដើម្បីបើក',
    invite: 'សូមគោរពអញ្ជើញ',
    day: 'ថ្ងៃ', date: 'ទី', month: 'ខែ', year: 'ឆ្នាំ',
    scroll: 'រំកិលចុះក្រោម',
    langBtn: 'EN',
    musicOn: 'បិទតន្ត្រី', musicOff: 'បើកតន្ត្រី',
    cdTitle: 'រាប់ថយក្រោយ',
    cdDays: 'ថ្ងៃ', cdHours: 'ម៉ោង', cdMins: 'នាទី', cdSecs: 'វិនាទី',
    cdDone: 'ថ្ងៃនេះគឺជាថ្ងៃមង្គល',
    pgTitle: 'កម្មវិធី',
    venueTitle: 'ទីកន្លែង',
    openMaps: 'បើកក្នុង Google Maps',
    saveCal: 'រក្សាទុកក្នុងប្រតិទិន',
    mapSoon: 'ផែនទីនឹងបង្ហាញនៅពេលមានទីតាំង',
    thanksTitle: 'សូមអរគុណ',
    shareTitle: 'ចែករំលែកលិខិតអញ្ជើញ',
    shTelegram: 'ផ្ញើតាម Telegram', shMessenger: 'ផ្ញើតាម Messenger',
    shFacebook: 'ចែករំលែកលើ Facebook', shCopy: 'ចម្លងតំណភ្ជាប់',
    copied: 'បានចម្លងតំណភ្ជាប់',
    close: 'បិទ', prev: 'មុន', next: 'បន្ទាប់'
  },
  en: {
    tap: 'Tap the seal to open',
    invite: 'You are warmly invited',
    day: 'Day', date: 'Date', month: 'Month', year: 'Year',
    scroll: 'Scroll',
    langBtn: 'ខ្មែរ',
    musicOn: 'Mute music', musicOff: 'Play music',
    cdTitle: 'Countdown',
    cdDays: 'Days', cdHours: 'Hours', cdMins: 'Minutes', cdSecs: 'Seconds',
    cdDone: 'Today is the day',
    pgTitle: 'Programme',
    venueTitle: 'Venue',
    openMaps: 'Open Google Maps',
    saveCal: 'Save to Calendar',
    mapSoon: 'The map appears once the location is added',
    thanksTitle: 'Thank You',
    shareTitle: 'Share this invitation',
    shTelegram: 'Share via Telegram', shMessenger: 'Share via Messenger',
    shFacebook: 'Share on Facebook', shCopy: 'Copy link',
    copied: 'Link copied',
    close: 'Close', prev: 'Previous', next: 'Next'
  }
};
