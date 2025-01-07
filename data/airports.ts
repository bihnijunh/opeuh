export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const airports: Airport[] = [
  { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "USA" },
  { code: "SFO", name: "San Francisco International Airport", city: "San Francisco", country: "USA" },
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
  { code: "ORD", name: "O'Hare International Airport", city: "Chicago", country: "USA" },
  { code: "DFW", name: "Dallas/Fort Worth International Airport", city: "Dallas", country: "USA" },
  { code: "MIA", name: "Miami International Airport", city: "Miami", country: "USA" },
  { code: "SEA", name: "Seattle-Tacoma International Airport", city: "Seattle", country: "USA" },
  { code: "LAS", name: "Harry Reid International Airport", city: "Las Vegas", country: "USA" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta International Airport", city: "Atlanta", country: "USA" },
  { code: "DEN", name: "Denver International Airport", city: "Denver", country: "USA" },
];
