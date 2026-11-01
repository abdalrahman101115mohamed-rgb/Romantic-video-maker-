import { AudioTrack } from '../types';

export interface RomanticTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  defaultText: string;
  defaultSecondary: string;
  suggestedFont: 'font-amiri' | 'font-ruqaa' | 'font-cairo' | 'font-tajawal';
  suggestedEffect: 'hearts' | 'rose_petals' | 'sparkles' | 'golden_dust';
  filter: 'warm_vintage' | 'cinematic_mood' | 'golden_hour' | 'dreamy';
}

export const ROMANTIC_TEMPLATES: RomanticTemplate[] = [
  {
    id: 'starlit_beach_walk',
    name: 'شاطئ العشاق وبريق النجوم والأنوار',
    description: 'سير رومانسي على شاطئ البحر تحت سماء الليل المتلألئة بالنجوم والأضواء الخافتة',
    imageUrl: '/src/assets/images/romantic_starlit_beach_walk_1793539056169.jpg',
    defaultText: 'بين النجوم وأمواج البحر، أراك أجمل أقداري ورفيق عمري الأبدي ✨',
    defaultSecondary: 'معك كل خطوة في الحياة لها طعم السعادة والأمان ❤️',
    suggestedFont: 'font-ruqaa',
    suggestedEffect: 'sparkles',
    filter: 'golden_hour',
  },
  {
    id: 'candlelight_dinner_terrace',
    name: 'عشاء الشموع والورد في التراس',
    description: 'طاولة رومانسية بأضواء الشموع وباقات الورد الأحمر وأفق المدينة الساحر',
    imageUrl: '/src/assets/images/romantic_candlelight_dinner_flowers_1793539069327.jpg',
    defaultText: 'ما تيجي نركن الزعل على جنب ونقعد سوا.. ده الحب غالي ومحتاج وفا 🌹',
    defaultSecondary: 'لو كان لي ألف قلب لأحببتك بهم جميعاً في كل مساء 🕯️',
    suggestedFont: 'font-ruqaa',
    suggestedEffect: 'rose_petals',
    filter: 'warm_vintage',
  },
  {
    id: 'holding_hands_rings',
    name: 'تشابك الأيدي ودبلة الزواج',
    description: 'أجواء عاطفية حميمة مع الشموع المضيئة وخواتم العهد الأبدي',
    imageUrl: '/src/assets/images/romantic_holding_hands_rings_1793538794071.jpg',
    defaultText: 'في يدك عهدي، وفي قلبك موطني الذي لا أضل بعده أبداً 💍',
    defaultSecondary: 'أنت اختياري الوحيد وسندي الدائم في هذه الحياة',
    suggestedFont: 'font-ruqaa',
    suggestedEffect: 'golden_dust',
    filter: 'warm_vintage',
  },
  {
    id: 'paris_night_lights',
    name: 'أمسية باريس ونهر العشاق',
    description: 'أضواء نهر السين الذهبية وأمسية هادئة تحت سماء الليل الرومانسية',
    imageUrl: '/src/assets/images/romantic_paris_night_lights_1793538794609.jpg',
    defaultText: 'كل الدروب التي لا تؤدي إليك باطلة، وكل مساء لا يحمل صوتك ناقص ✨',
    defaultSecondary: 'معك أرى العالم أجمل مما تمنيت',
    suggestedFont: 'font-cairo',
    suggestedEffect: 'sparkles',
    filter: 'golden_hour',
  },
  {
    id: 'rain_umbrella_glow',
    name: 'مظلة المطر ودفء اللقاء',
    description: 'لقاء دافئ تحت المطر الهادئ وأنوار الشارع اللامعة والمشاعر الصادقة',
    imageUrl: '/src/assets/images/romantic_rain_umbrella_glow_1793538795221.jpg',
    defaultText: 'ما تيجي نركن الزعل على جنب ونقعد سوا.. ده حبنا غالي ومحتاج دوا ❤️',
    defaultSecondary: 'أنت دفء الروح في كل شتاء ونبض القلب في كل وقت',
    suggestedFont: 'font-ruqaa',
    suggestedEffect: 'hearts',
    filter: 'warm_vintage',
  },
  {
    id: 'sunset_beach',
    name: 'غروب البحر والعشق الأبدي',
    description: 'مشهد ساحلي ساحر مع أشعة الغروب الذهبية والأمواج الهادئة للأحباب',
    imageUrl: '/src/assets/images/romantic_sunset_silhouette_1793536480216.jpg',
    defaultText: 'معك، كل لحظة في العمر تصبح بداية لقصة عشق جديدة',
    defaultSecondary: 'أنت نبض الفؤاد وسر ابتسامتي في كل مساء',
    suggestedFont: 'font-ruqaa',
    suggestedEffect: 'golden_dust',
    filter: 'golden_hour',
  },
  {
    id: 'roses_candles',
    name: 'رسائل الورد ودفء الشموع',
    description: 'بتلات الورد المخملي وأضواء الشموع العاطفية ودفء المشاعر الصادقة',
    imageUrl: '/src/assets/images/romantic_roses_candlelight_1793536353040.jpg',
    defaultText: 'يا كل كلي، لو كان لي ألف قلب لأحببتك بهم جميعاً',
    defaultSecondary: 'حبي لك لا يُقاس بأيام وسنوات، بل بأنفاس تدعو لك سراً وعلناً',
    suggestedFont: 'font-amiri',
    suggestedEffect: 'rose_petals',
    filter: 'warm_vintage',
  },
  {
    id: 'night_stars_love',
    name: 'سماء العشاق وبريق النجوم',
    description: 'أجواء ليلية رومانسية هادئة تحت ضوء القمر والنجوم المتلألئة',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1080&q=80',
    defaultText: 'كالقمر في عتمة الليل، أضأت عتمة روحي حين التقيتك',
    defaultSecondary: 'بين النجوم أراك أجمل لمعة تضيء قلبي للأبد',
    suggestedFont: 'font-tajawal',
    suggestedEffect: 'sparkles',
    filter: 'cinematic_mood',
  },
  {
    id: 'coffee_winter_love',
    name: 'قهوة الصباح ودفء العناق',
    description: 'لحظات الشتاء الهادئة وكوب قهوة دافئ يحمل أصدق مشاعر الشوق',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1080&q=80',
    defaultText: 'صباحي أنت، وما أحلى الصباح حين يبدأ بحديثك',
    defaultSecondary: 'أحبك في كل تفاصيلك، في هدوءك وفي ضحكتك التي تبهج الروح',
    suggestedFont: 'font-cairo',
    suggestedEffect: 'hearts',
    filter: 'dreamy',
  },
];

export const ROMANTIC_LOVE_QUOTES = [
  'ما تيجي نركن الزعل على جنب ونقعد سوا.. ده الحب غالي ❤️',
  'معك، كل لحظة في العمر تصبح بداية لقصة عشق جديدة 🌹',
  'أنت لست مجرد شخص في حياتي، أنت الحياة بأكملها ✨',
  'يا كل كلي، لو كان لي ألف قلب لأحببتك بهم جميعاً 💕',
  'في يدك عهدي، وفي قلبك موطني الذي لا أضل بعده أبداً 💍',
  'في عينيك رأيت وطناً لا أرغب بالرحيل عنه أبداً 🤍',
  'أنت دعائي الذي استجابه الله لي بعد طول انتظار 💫',
  'حبي لك كالبحر، لا يحده شاطئ ولا ينتهي فيه العطاء 🌊',
  'ذكرى زواجنا السعيد.. دمت لي حباً لا ينضب وسنداً لا يميل 💍',
  'كل عام وأنت حبيبي ورفيق دربي ونور أيامي كلها 🎂',
];

export const ROMANTIC_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'ma_teeji_nerken_al_zaal',
    title: 'ما تيجي نركن الزعل (التريند الرومانسي)',
    artist: 'ليل المحمدي',
    type: 'arabic_song',
    audioUrl: '/audio/ma_teeji_nerken_al_zaal.mp3',
    lyricsSnippet: 'ما تيجي نركن الزعل على جنب ونقعد سوا.. ده الحب اللي بيننا غالي ومحتاج دوا ❤️',
    coverEmoji: '🔥',
  },
  {
    id: 'hobboh_ganna',
    title: 'حبه جنة أنا عشت فيها',
    artist: 'شيرين عبد الوهاب',
    type: 'arabic_song',
    audioUrl: '/audio/sherine_hobbo_ganna.mp3',
    lyricsSnippet: 'حبه جنة أنا عشت فيها.. قربه فرحة مقدرش أوصف معانيها 💖',
    coverEmoji: '🌺',
  },
  {
    id: 'fadi_shwaya',
    title: 'فاضي شوية ونحكي سوا',
    artist: 'حمزة نمرة',
    type: 'arabic_song',
    audioUrl: '/audio/hamza_namira.mp3',
    lyricsSnippet: 'فاضي شوية نشرب قهوة في حتة بعيدة وننسى تعب الأيام ☕',
    coverEmoji: '☕',
  },
  {
    id: 'tamer_ashour_senin',
    title: 'سنين عشناها وذكريات حبنا',
    artist: 'تامر عاشور',
    type: 'arabic_song',
    audioUrl: '/audio/tamer_ashour.mp3',
    lyricsSnippet: 'سنين عشناها في حب وشوق وأجمل ليالي العمر معاك 🌹',
    coverEmoji: '✨',
  },
  {
    id: 'amr_diab_rasmaha',
    title: 'رسمها في خيالي (عمرو دياب)',
    artist: 'عمرو دياب',
    type: 'arabic_song',
    audioUrl: '/audio/amr_diab_rasmaha.mp3',
    lyricsSnippet: 'رسمها في خيالي ولقيتها قدامي.. أجمل حب عشته في حياتي 💍',
    coverEmoji: '🎶',
  },
];
