"use client";

import { useEffect, useState } from "react";

export default function TodayDate() {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const options = { day: "2-digit", month: "long", year: "numeric" };
    setFormattedDate(today.toLocaleDateString("it-IT", options));
  }, []);

  return <p className="text-xl md:text-2xl text-(--muted-light-text)">{formattedDate}</p>;
}