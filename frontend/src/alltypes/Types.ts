export type Species = "DOG" | "CAT";
export type Gender = "MALE" | "FEMALE";
export type Status = "AVAILABLE" | "ADOPTED";

export type Animal = {
  id: number;
  name: string;
  species: Species;
  breed?: string;
  imageUrls?: string[];
  gender: Gender;
  status: Status;
  age?: number;
  description: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
};
