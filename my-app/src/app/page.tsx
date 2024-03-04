"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";

import { useQuery } from "react-query";

import axios from "axios";
import { parseISO } from "date-fns";
import Container from "@/components/Container";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import WeatherIcon from "@/components/WeatherIcon";

//https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56


interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}


export default function Home() {

  const { isLoading, error, data } = useQuery<WeatherData>('repoData', async () =>

  {
    const {data} = await axios.get('https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56')
    return data
  }
  
  /*
  fetch(
    'https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56').then(res =>
    res.json()
  )*/
)

const firstData = data?.list[0];


if (isLoading) return (
<div className="flex items-center min-h-screen justify-center">
  <p className="animate-bounce">Loading...</p>
</div>
)
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/*data today*/}
        <section className="space-y-4">
          <div className="space-y-2">
          <h2 className="flex gap-1 text 2xl items-end">
          <p>{format(parseISO(firstData?.dt_txt ?? ""), 'EEEE')}</p>
          <p className="text-lg">({format(parseISO(firstData?.dt_txt ?? ""), 'dd.MM.yyyy')})</p>
          </h2>
          <Container className="gap-10 px-6 items-center">
            {/*temp*/}
            <div className="flex flex-col px-4">
            </div>
              {/* time and weather */}
              <span className="text-5xl">

              {convertKelvinToCelsius (firstData?.main.temp ?? 296.77)}

              </span>
              <p className="text-xs space-x-1 whitespace-nowrap">
                </p>
                <p className="text-xs space-x-2">
                  <span>
                {convertKelvinToCelsius (firstData?.main.temp_min ?? 0)}
                {" "}
                  </span>
                <span>
                {""}
                {convertKelvinToCelsius (firstData?.main.temp_max ?? 0)}

                </span>
                
              </p>
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d,i) => ( 
                <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                  <p className="whitespace-nowrap">{format(parseISO(d.dt_txt), "h:mm a")}</p>

                    <WeatherIcon iconName={d.weather[0].icon} />

                  <p>{convertKelvinToCelsius( d?.main.temp ?? 0)}</p>
                </div>
                ))}
              </div>
          </Container>
          </div>
        </section>
        
        {/*forcast*/}
        <section></section>
      </main>
    </div>
  );
}
