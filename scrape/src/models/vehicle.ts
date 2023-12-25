export interface YearRange {
  start: string;
  end: string;
}

export interface Vehicle {
  make: string;
  model: string;
  years: YearRange[];
  bodyStyle: string;
  region: string;
  description: string;
  image: string | null;
}
