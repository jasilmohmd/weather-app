import AqiTile from "./AqiTile";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails from "./WeatherDetails";
import { convertKtoC, convertKtoF } from "@/utils/convertKelvinToCelsius";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { convertSpeed } from "@/utils/convertSpeed";
import { safeFormatUnix } from "@/utils/safeFormat";
import type { City, WeatherEntry } from "@/types/weather";

interface CurrentWeatherHeroProps {
  data?: WeatherEntry;
  city?: City;
  isCelsius: boolean;
}

export default function CurrentWeatherHero({ data, city, isCelsius }: CurrentWeatherHeroProps) {
  return (
    <section className="space-y-4">

      <div className="flex justify-center">
        <div className="flex flex-col">

          {/* Main Weather Card */}
          <div className="relative z-10 px-6 space-y-8 m-4">
            <div className="text-center space-y-6 max-w-sm mx-auto pt-24 px-14">
              <WeatherIcon
                iconname={getDayOrNightIcon(
                  data?.weather[0].icon ?? "",
                  data?.dt_txt ?? ""
                )}
                className="w-24 h-24 absolute left-0 top-0"
              />
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-white text-8xl font-extralight tracking-tighter">
                    {isCelsius
                      ? convertKtoC(data?.main.temp ?? 273.15)
                      : convertKtoF(data?.main.temp ?? 273.15)}
                  </span>
                  <span className="text-white/70 text-3xl font-light mt-4">
                    °{isCelsius ? 'C' : 'F'}
                  </span>
                </div>
                <p className="text-white/80 text-xl font-light capitalize tracking-wide">
                  {data?.weather[0].description}
                </p>
                <p className="text-white/60 text-sm font-light">
                  Feels like {isCelsius
                    ? convertKtoC(data?.main.feels_like ?? 273.15)
                    : convertKtoF(data?.main.feels_like ?? 273.15)}°
                  <br />
                  H: {isCelsius
                    ? convertKtoC(data?.main.temp_max ?? 273.15)
                    : convertKtoF(data?.main.temp_max ?? 273.15)}°
                  L: {isCelsius
                    ? convertKtoC(data?.main.temp_min ?? 273.15)
                    : convertKtoF(data?.main.temp_min ?? 273.15)}°
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AqiTile lat={city?.coord.lat} lon={city?.coord.lon} />

      <div className="grid grid-cols-2 gap-4 pb-safe">

        {/* Weather Details Card */}
        <WeatherDetails
          visibility={metersToKilometers(data?.visibility ?? 1000)}
          airPressure={`${data?.main.pressure}`}
          humidity={`${data?.main.humidity}`}
          windSpeed={convertSpeed(data?.wind.speed ?? 0)}
          sunrise={safeFormatUnix(city?.sunrise, "h:mm a")}
          sunset={safeFormatUnix(city?.sunset, "h:mm a")}
        />

      </div>
    </section>
  );
}
