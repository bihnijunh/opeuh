"use client";
import React, { useCallback, useEffect, useState, useMemo } from "react";

const CountryChanger = () => {
  const names = useMemo(() => [
    "CUBA",
    "SPAIN",
    "PARAGUAY",
    "MEXICO",
    "ARGENTINA",
    "COLOMBIA",
    "PERU",
    "VENEZUELA",
    "CHILE",
    "ECUADOR",
    "GUATEMALA",
    "BOLIVIA",
    "EL SALVADOR",
    "HONDURAS",
    "NICARAGUA",
    "PANAMA",
    "PUERTO RICO",
    "URUGUAY",
    "ANDORRA",
    "GIBRALTAR",
    "PHILIPPINES",
    "BRAZIL",
    "PORTUGAL",
  ], []);

  const [newName, setnewName] = useState("");

  const shuffle = useCallback(() => {
    const index = Math.floor(Math.random() * names.length);
    setnewName(names[index]);
  }, [names]);

  useEffect(() => {
    const intervalID = setInterval(shuffle, 3000);
    return () => clearInterval(intervalID);
  }, [shuffle]);

  return <div>{newName}</div>;
};

export default CountryChanger;
