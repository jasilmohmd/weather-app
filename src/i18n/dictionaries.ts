import type { Locale } from './config';

/**
 * English is the source of truth: `Dict` is inferred from it, and a test
 * asserts every other locale has exactly the same key structure.
 *
 * Parameterised strings are functions; everything else is a plain string.
 */
const en = {
  nav: {
    currentLocationTitle: 'Your Current Location',
    currentLocationAria: 'Use my current location',
    switchToCelsius: 'Switch to degrees Celsius',
    switchToFahrenheit: 'Switch to degrees Fahrenheit',
    pinCity: 'Pin current city',
    unpinCity: 'Unpin current city',
    citySuggestions: 'City suggestions',
    locationNotFound: 'Location not found',
    languageAria: (next: string) => `Switch language to ${next}`,
  },
  details: {
    visibility: 'Visibility',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    windSpeedShort: 'WindSpeed',
    pressure: 'Pressure',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    airQuality: 'Air Quality',
    dominant: 'Dominant',
    aqiOutOf: 'AQI',
  },
  aqiLevels: {
    good: 'Good',
    fair: 'Fair',
    moderate: 'Moderate',
    poor: 'Poor',
    veryPoor: 'Very Poor',
  },
  hourly: {
    heading: 'Hourly · next 24',
  },
  charts: {
    heading: 'Trends',
    temperature: 'Temperature',
    precipitation: 'Precipitation chance',
  },
  daily: {
    heading: 'Next 5 Days',
  },
  radar: {
    heading: 'Radar',
    title: (coords: string) => `Precipitation radar for ${coords}`,
  },
  places: {
    switchTo: (city: string) => `Switch to ${city}`,
    removeFromFavorites: (city: string) => `Remove ${city} from favorites`,
    removeFromRecents: (city: string) => `Remove ${city} from recents`,
  },
  errors: {
    genericTitle: 'Something went wrong',
    tryAgain: 'Try again',
    noData: 'No data available.',
    errorHint: 'Check the city name or try again shortly.',
    notFoundCode: '404',
    notFoundTitle: 'This page drifted off the map',
    backHome: 'Back to the forecast',
  },
  footer: {
    appName: 'WeatherApp',
    poweredBy: 'Powered by OpenWeatherMap API',
    madeWith: 'Made with 🤍 for weather enthusiasts',
  },
};

export type Dict = typeof en;

const ar: Dict = {
  nav: {
    currentLocationTitle: 'موقعك الحالي',
    currentLocationAria: 'استخدم موقعي الحالي',
    switchToCelsius: 'التبديل إلى درجات مئوية',
    switchToFahrenheit: 'التبديل إلى فهرنهايت',
    pinCity: 'تثبيت المدينة الحالية',
    unpinCity: 'إلغاء تثبيت المدينة الحالية',
    citySuggestions: 'اقتراحات المدن',
    locationNotFound: 'لم يتم العثور على الموقع',
    languageAria: (next: string) => `تغيير اللغة إلى ${next}`,
  },
  details: {
    visibility: 'مدى الرؤية',
    humidity: 'الرطوبة',
    windSpeed: 'سرعة الريح',
    windSpeedShort: 'سرعة الريح',
    pressure: 'الضغط الجوي',
    sunrise: 'شروق الشمس',
    sunset: 'غروب الشمس',
    airQuality: 'جودة الهواء',
    dominant: 'المهيمن',
    aqiOutOf: 'مؤشر الجودة',
  },
  aqiLevels: {
    good: 'جيد',
    fair: 'مقبول',
    moderate: 'متوسط',
    poor: 'سيء',
    veryPoor: 'سيء جدًا',
  },
  hourly: {
    heading: 'بالساعة · الـ24 القادمة',
  },
  charts: {
    heading: 'الاتجاهات',
    temperature: 'درجة الحرارة',
    precipitation: 'احتمال هطول الأمطار',
  },
  daily: {
    heading: 'الأيام الخمسة القادمة',
  },
  radar: {
    heading: 'الرادار',
    title: (coords: string) => `رادار هطول الأمطار لـ ${coords}`,
  },
  places: {
    switchTo: (city: string) => `التبديل إلى ${city}`,
    removeFromFavorites: (city: string) => `إزالة ${city} من المفضلة`,
    removeFromRecents: (city: string) => `إزالة ${city} من السجل`,
  },
  errors: {
    genericTitle: 'حدث خطأ ما',
    tryAgain: 'حاول مجددًا',
    noData: 'لا تتوفر بيانات.',
    errorHint: 'تحقق من اسم المدينة أو حاول بعد قليل.',
    notFoundCode: '٤٠٤',
    notFoundTitle: 'انحرفت هذه الصفحة عن الخريطة',
    backHome: 'العودة إلى التوقعات',
  },
  footer: {
    appName: 'تطبيق الطقس',
    poweredBy: 'مدعوم بواجهة OpenWeatherMap',
    madeWith: 'صُنع بـ 🤍 لعشّاق الطقس',
  },
};

const dictionaries: Record<Locale, Dict> = { en, ar };

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries.en;
}

export { en as englishDictionary };
