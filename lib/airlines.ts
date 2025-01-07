export interface Airline {
  code: string;
  name: string;
  flightNumberPrefix: string;
}

export const airlines: Airline[] = [
  {
    code: "AA",
    name: "American Airlines",
    flightNumberPrefix: "AA"
  },
  {
    code: "UA",
    name: "United Airlines",
    flightNumberPrefix: "UA"
  },
  {
    code: "DL",
    name: "Delta Air Lines",
    flightNumberPrefix: "DL"
  },
  {
    code: "WN",
    name: "Southwest Airlines",
    flightNumberPrefix: "WN"
  },
  {
    code: "AS",
    name: "Alaska Airlines",
    flightNumberPrefix: "AS"
  },
  {
    code: "B6",
    name: "JetBlue Airways",
    flightNumberPrefix: "B6"
  },
  {
    code: "F9",
    name: "Frontier Airlines",
    flightNumberPrefix: "F9"
  },
  {
    code: "NK",
    name: "Spirit Airlines",
    flightNumberPrefix: "NK"
  },
  {
    code: "HA",
    name: "Hawaiian Airlines",
    flightNumberPrefix: "HA"
  },
  {
    code: "G4",
    name: "Allegiant Air",
    flightNumberPrefix: "G4"
  }
];
