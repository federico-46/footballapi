"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function DateSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedDate, setSelectedDate] = useState(() => {
    return searchParams.get("date") || new Date().toISOString().split("T")[0];
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedDate) {
      params.set("date", selectedDate);
      router.push(`?${params.toString()}`);
    }
  }, [selectedDate]);

  return (
    <div className="text-center text-black">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border px-3 py-1 rounded text-sm shadow-sm cursor-pointer"
      />
    </div>
  );
}
