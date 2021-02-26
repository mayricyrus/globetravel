import React, { useState } from "react";
import useLocalStorage from "hooks/useLocalStorage";
import Globe from "./Globe";
import Search from "./Search";
import Travel from "./Travel";
import Travels from "./Travels";
import Cities from "./Cities";
import Countries from "./Countries";
import pick from "object.pick";

const CITY_FIELDS = [
  "geonameId",
  "name",
  "countryCode",
  "adminName1",
  "lat",
  "lng",
];

const App = () => {
  const [form, setForm] = useState();
  const [cities, setCities] = useLocalStorage("@globetravel.cities", []);
  const [travels, setTravels] = useLocalStorage("@globetravel.travels", []);
  const [countries, setCountries] = useLocalStorage(
    "@globetravel.countries",
    []
  );

  const removeCity = (id) => {
    setCities(cities.filter((c) => id !== c.geonameId));
  };

  const addCity = (c) => {
    const city = pick(c, CITY_FIELDS);

    setCities([...cities, city]);
    if (!countries.includes(city.countryCode)) {
      setCountries([...countries, city.countryCode]);
    }
  };

  const removeTravel = (id) => {
    setTravels(travels.filter((t) => id !== t.id));
  };

  const addTravel = (type, s, e) => {
    const start = pick(s, CITY_FIELDS);
    const end = pick(e, CITY_FIELDS);
    const id = s.geonameId + "_" + e.geonameId;

    setTravels([...travels, { type, start, end, id }]);

    if (!countries.includes(s.countryCode)) {
      setCountries((c) => [...c, s.countryCode]);
    }

    if (!countries.includes(e.countryCode)) {
      setCountries((c) => [...c, e.countryCode]);
    }
  };

  return (
    <div className="text-gray-300 w-screen h-screen bg-gray-900 flex overflow-hidden flex-no-wrap">
      <div className="h-screen w-2/3 bg-gray-900">
        <Globe cities={cities} travels={travels} />
      </div>
      <div className="flex-1 flex flex-col flex-nowrap px-10 py-16 h-screen overflow-y-auto">
        {countries.length > 0 && <Countries countries={countries} />}
        <div className="flex-1">
          <div className="flex justify-around mb-8">
            <button
              onClick={() => setForm(form === "city" ? null : "city")}
              className="focus:outline-none focus:ring rounded-full bg-gray-800 h-8 px-4 flex items-center text-gray-300 hover:bg-gray-700 font-bolt"
            >
              Add City
            </button>
            <button
              onClick={() => setForm(form === "travel" ? null : "travel")}
              className="focus:outline-none focus:ring rounded-full bg-gray-800 h-8 px-4 flex items-center text-gray-300 hover:bg-gray-700 font-bolt"
            >
              Add Travel
            </button>
          </div>
          {form === "city" && <Search onSelect={addCity} />}
          {form === "travel" && <Travel onFinish={addTravel} />}
        </div>
        {cities.length > 0 && <Cities cities={cities} onRemove={removeCity} />}
        {travels.length > 0 && (
          <Travels travels={travels} onRemove={removeTravel} />
        )}
      </div>
    </div>
  );
};

export default App;
