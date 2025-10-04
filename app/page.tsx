"use client";

import { useState, useEffect } from "react";
import { rosarySchedule } from "@/lib/rosaryData";
import { getCurrentWeek, getMysteryForPersonAndWeek } from "@/lib/weekCalculator";

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState("");
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [mystery, setMystery] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const week = getCurrentWeek();
    setCurrentWeek(week);
  }, []);

  useEffect(() => {
    if (selectedPerson && currentWeek !== null) {
      const mysteryText = getMysteryForPersonAndWeek(
        selectedPerson,
        currentWeek,
        rosarySchedule
      );
      setMystery(mysteryText);
    } else {
      setMystery(null);
    }
  }, [selectedPerson, currentWeek]);

  const handlePersonSelect = (person: string) => {
    setSelectedPerson(person);
    setSearchTerm(person);
  };

  const filteredPeople = rosarySchedule.filter((person) =>
    person.person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCalendar = () => {
    if (!mystery || !selectedPerson) return;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const event = {
      title: `Różaniec za Antosię - ${mystery}`,
      description: `Modlitwa różańcowa za Antosię. Tajemnica: ${mystery}`,
      start: startDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      end: endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Różaniec za Antosię//PL
BEGIN:VEVENT
UID:${Date.now()}@rozaniec-za-antosie
DTSTAMP:${event.start}
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rozaniec-za-antosie.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Różaniec za Antosię
          </h1>
        </header>

        {/* Main Content */}
        <main className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
          {/* Description */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <p className="text-gray-700 leading-relaxed">
              W tej inicjatywie różańcowej modlimy się za Antosię - 9-letnią dziewczynkę chorą na
              białaczkę. Modlimy się o cud uzdrowienia jej z tej choroby, a także za całą jej
              rodzinę - rodziców i rodzeństwo - o opiekę Maryi. Modlimy się też za wszystkich
              specjalistów, którzy będą leczyć Antosię, o światło Ducha Świętego w podejmowaniu
              decyzji.
            </p>
          </div>

          {/* Current Week Display */}
          {currentWeek !== null ? (
            <div className="mb-8 text-center">
              <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg">
                <p className="text-lg font-semibold">
                  Aktualnie trwa: <span className="text-2xl font-bold">{currentWeek}. Tydzień</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-8 text-center">
              <div className="inline-block bg-gray-200 text-gray-700 px-8 py-4 rounded-full">
                <p className="text-lg font-semibold">Inicjatywa różańcowa nie jest aktywna</p>
              </div>
            </div>
          )}

          {/* Person Selector */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Wybierz swoje imię:
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedPerson("");
                }}
                placeholder="Wpisz lub wybierz imię..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              />
              {searchTerm && filteredPeople.length > 0 && !selectedPerson && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredPeople.map((person) => (
                    <button
                      key={person.person}
                      onClick={() => handlePersonSelect(person.person)}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {person.person}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mystery Display */}
          {mystery && selectedPerson && (
            <div className="mb-8 p-8 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-xl border-2 border-purple-200 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Twoja tajemnica różańca:
              </h2>
              <p className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {mystery}
              </p>
            </div>
          )}

          {/* Calendar Button */}
          {mystery && selectedPerson && (
            <div className="text-center">
              <button
                onClick={addToCalendar}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Dodaj przypomnienie do kalendarza
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Wspólnie w modlitwie za Antosię i jej rodzinę
          </p>
        </footer>
      </div>
    </div>
  );
}
