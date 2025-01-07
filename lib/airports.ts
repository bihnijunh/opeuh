export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export const airports: Airport[] = [
  // Major US Airports
  {
    code: "ATL",
    city: "Atlanta",
    name: "Hartsfield-Jackson Atlanta International Airport",
    country: "United States"
  },
  {
    code: "LAX",
    city: "Los Angeles",
    name: "Los Angeles International Airport",
    country: "United States"
  },
  {
    code: "ORD",
    city: "Chicago",
    name: "O'Hare International Airport",
    country: "United States"
  },
  {
    code: "DFW",
    city: "Dallas",
    name: "Dallas/Fort Worth International Airport",
    country: "United States"
  },
  {
    code: "DEN",
    city: "Denver",
    name: "Denver International Airport",
    country: "United States"
  },
  {
    code: "JFK",
    city: "New York",
    name: "John F. Kennedy International Airport",
    country: "United States"
  },
  {
    code: "SFO",
    city: "San Francisco",
    name: "San Francisco International Airport",
    country: "United States"
  },
  {
    code: "SEA",
    city: "Seattle",
    name: "Seattle-Tacoma International Airport",
    country: "United States"
  },
  {
    code: "LAS",
    city: "Las Vegas",
    name: "Harry Reid International Airport",
    country: "United States"
  },
  {
    code: "MCO",
    city: "Orlando",
    name: "Orlando International Airport",
    country: "United States"
  },
  {
    code: "EWR",
    city: "Newark",
    name: "Newark Liberty International Airport",
    country: "United States"
  },
  {
    code: "MIA",
    city: "Miami",
    name: "Miami International Airport",
    country: "United States"
  },
  {
    code: "PHX",
    city: "Phoenix",
    name: "Phoenix Sky Harbor International Airport",
    country: "United States"
  },
  {
    code: "IAH",
    city: "Houston",
    name: "George Bush Intercontinental Airport",
    country: "United States"
  },
  {
    code: "BOS",
    city: "Boston",
    name: "Boston Logan International Airport",
    country: "United States"
  },
  {
    code: "DTW",
    city: "Detroit",
    name: "Detroit Metropolitan Wayne County Airport",
    country: "United States"
  },
  {
    code: "MSP",
    city: "Minneapolis",
    name: "Minneapolis-Saint Paul International Airport",
    country: "United States"
  },
  {
    code: "FLL",
    city: "Fort Lauderdale",
    name: "Fort Lauderdale-Hollywood International Airport",
    country: "United States"
  },
  {
    code: "PHL",
    city: "Philadelphia",
    name: "Philadelphia International Airport",
    country: "United States"
  },
  {
    code: "CLT",
    city: "Charlotte",
    name: "Charlotte Douglas International Airport",
    country: "United States"
  },
  {
    code: "LGA",
    city: "New York",
    name: "LaGuardia Airport",
    country: "United States"
  },
  {
    code: "BWI",
    city: "Baltimore",
    name: "Baltimore/Washington International Thurgood Marshall Airport",
    country: "United States"
  },
  {
    code: "IAD",
    city: "Washington",
    name: "Washington Dulles International Airport",
    country: "United States"
  },
  {
    code: "MDW",
    city: "Chicago",
    name: "Chicago Midway International Airport",
    country: "United States"
  },
  {
    code: "SLC",
    city: "Salt Lake City",
    name: "Salt Lake City International Airport",
    country: "United States"
  },
  {
    code: "DCA",
    city: "Washington",
    name: "Ronald Reagan Washington National Airport",
    country: "United States"
  },
  {
    code: "HNL",
    city: "Honolulu",
    name: "Daniel K. Inouye International Airport",
    country: "United States"
  },
  {
    code: "PDX",
    city: "Portland",
    name: "Portland International Airport",
    country: "United States"
  },
  {
    code: "AUS",
    city: "Austin",
    name: "Austin-Bergstrom International Airport",
    country: "United States"
  },
  {
    code: "MSY",
    city: "New Orleans",
    name: "Louis Armstrong New Orleans International Airport",
    country: "United States"
  },
  {
    code: "MCI",
    city: "Kansas City",
    name: "Kansas City International Airport",
    country: "United States"
  },
  {
    code: "RDU",
    city: "Raleigh",
    name: "Raleigh-Durham International Airport",
    country: "United States"
  },
  {
    code: "SMF",
    city: "Sacramento",
    name: "Sacramento International Airport",
    country: "United States"
  },
  {
    code: "SAN",
    city: "San Diego",
    name: "San Diego International Airport",
    country: "United States"
  },
  {
    code: "RSW",
    city: "Fort Myers",
    name: "Southwest Florida International Airport",
    country: "United States"
  },
  {
    code: "BNA",
    city: "Nashville",
    name: "Nashville International Airport",
    country: "United States"
  },
  {
    code: "SAT",
    city: "San Antonio",
    name: "San Antonio International Airport",
    country: "United States"
  },
  {
    code: "MKE",
    city: "Milwaukee",
    name: "Milwaukee Mitchell International Airport",
    country: "United States"
  },
  {
    code: "PIT",
    city: "Pittsburgh",
    name: "Pittsburgh International Airport",
    country: "United States"
  },
  {
    code: "CVG",
    city: "Cincinnati",
    name: "Cincinnati/Northern Kentucky International Airport",
    country: "United States"
  },
  {
    code: "CLE",
    city: "Cleveland",
    name: "Cleveland Hopkins International Airport",
    country: "United States"
  },
  {
    code: "OMA",
    city: "Omaha",
    name: "Eppley Airfield",
    country: "United States"
  },
  {
    code: "OAK",
    city: "Oakland",
    name: "Oakland International Airport",
    country: "United States"
  },
  {
    code: "TUS",
    city: "Tucson",
    name: "Tucson International Airport",
    country: "United States"
  },
  {
    code: "PBI",
    city: "West Palm Beach",
    name: "Palm Beach International Airport",
    country: "United States"
  },
  {
    code: "JAX",
    city: "Jacksonville",
    name: "Jacksonville International Airport",
    country: "United States"
  },
  {
    code: "BUF",
    city: "Buffalo",
    name: "Buffalo Niagara International Airport",
    country: "United States"
  },
  {
    code: "ROC",
    city: "Rochester",
    name: "Frederick Douglass Greater Rochester International Airport",
    country: "United States"
  },
  {
    code: "SYR",
    city: "Syracuse",
    name: "Syracuse Hancock International Airport",
    country: "United States"
  },
  {
    code: "ALB",
    city: "Albany",
    name: "Albany International Airport",
    country: "United States"
  },
  // International Airports
  {
    code: "LHR",
    city: "London",
    name: "London Heathrow Airport",
    country: "United Kingdom"
  },
  {
    code: "CDG",
    city: "Paris",
    name: "Charles de Gaulle Airport",
    country: "France"
  },
  {
    code: "FRA",
    city: "Frankfurt",
    name: "Frankfurt Airport",
    country: "Germany"
  },
  {
    code: "AMS",
    city: "Amsterdam",
    name: "Amsterdam Airport Schiphol",
    country: "Netherlands"
  },
  {
    code: "MAD",
    city: "Madrid",
    name: "Adolfo Suárez Madrid–Barajas Airport",
    country: "Spain"
  },
  {
    code: "FCO",
    city: "Rome",
    name: "Leonardo da Vinci International Airport",
    country: "Italy"
  },
  {
    code: "DXB",
    city: "Dubai",
    name: "Dubai International Airport",
    country: "United Arab Emirates"
  },
  {
    code: "SIN",
    city: "Singapore",
    name: "Singapore Changi Airport",
    country: "Singapore"
  },
  {
    code: "HKG",
    city: "Hong Kong",
    name: "Hong Kong International Airport",
    country: "China"
  },
  {
    code: "NRT",
    city: "Tokyo",
    name: "Narita International Airport",
    country: "Japan"
  },
  {
    code: "SYD",
    city: "Sydney",
    name: "Sydney Airport",
    country: "Australia"
  }
];
