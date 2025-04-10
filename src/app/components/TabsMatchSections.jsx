"use client";

import { Tab } from "@headlessui/react";
import { Fragment } from "react";

export default function TabsMatchSections({
  details,
  odds,
  lineups,
  stats,
  prediction,
  injuries,
  notStarted,
}) {
  const tabLabels = [
    "Dettagli",
    "Quote",
    ...(notStarted ? [] : ["Formazioni"]),
    ...(notStarted ? [] : ["Statistiche"]),
    "Previsioni",
    "Infortuni",
  ];

  const tabContents = [
    details,
    odds,
    ...(notStarted ? [] : [lineups]),
    ...(notStarted ? [] : [stats]),
    prediction,
    injuries,
  ];

  return (
    <Tab.Group>
      <div className="overflow-x-auto scrollbar-hide">
        <Tab.List className="flex gap-2 bg-white mb-6 border-b border-gray-200 w-max min-w-full">
          {tabLabels.map((label, i) => (
            <Tab key={i} as={Fragment}>
              {({ selected }) => (
                <button
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t border-b-2 transition-all duration-150 focus:outline-none focus:ring-0 ${
                    selected
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent text-gray-500 hover:text-blue-500"
                  }`}
                >
                  {label}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
      </div>

      <Tab.Panels className="bg-gray-200 rounded-t shadow p-4">
        {tabContents.map((content, i) => (
          <Tab.Panel key={i}>{content}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
