export enum Availability {
  "unknown" = "UNKNOWN",
  "analyzing" = "ANALYZIGN",
  "available" = "AVAILABLE",
  "unavailable" = "UNAVAILABLE",
}

export interface Hotel {
  name: string;
  url: string;
  address: string;
  position: { lat: number; lon: number };
  image: string[];
  availability: Availability;
  capacity: {
    totalRooms: number;
    singleRooms: number;
    apartment2: number;
    apartment3: number;
    apartment4: number;
  };
  amenities: {
    breakfast: boolean;
    parking: boolean;
    wifi: boolean;
    shittle: boolean;
  };
  googlePlaceId: string;
  distanceToGF: number;
  timeToGF: number;
  timeToGFTraffic: number;
  routeToGF: JSON;
}
