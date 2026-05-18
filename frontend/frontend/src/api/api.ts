const BASE_URL = "http://localhost:8080/api";

const getToken = () => localStorage.getItem("jwt");

const authHeaders = (): HeadersInit => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAnimals = async () => {
  const res = await fetch(`${BASE_URL}/animals`);
  if (!res.ok) throw new Error("Hiba az állatok lekérésekor");
  return res.json();
};

export const getAnimalById = async (id: number) => {
  const res = await fetch(`${BASE_URL}/animals/${id}`);
  if (!res.ok) throw new Error("Hiba az állat lekérésekor");
  return res.json();
};

export const login = async (username: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Hibás felhasználónév vagy jelszó");
  return res.json();
};

export const register = async (username: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Regisztráció sikertelen");
  return res.text();
};

export const createAnimal = async (animalData: object, files: File[]) => {
  const formData = new FormData();
  formData.append(
    "animal",
    new Blob([JSON.stringify(animalData)], { type: "application/json" }),
  );
  files.forEach((f) => formData.append("files", f));

  const res = await fetch(`${BASE_URL}/animals`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  if (!res.ok) throw new Error("Létrehozás sikertelen");
  return res.json();
};

export const updateAnimal = async (
  id: number,
  animalData: object,
  files?: File[],
) => {
  const formData = new FormData();
  formData.append(
    "animal",
    new Blob([JSON.stringify(animalData)], { type: "application/json" }),
  );
  if (files && files.length > 0)
    files.forEach((f) => formData.append("files", f));

  const res = await fetch(`${BASE_URL}/animals/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  });
  if (!res.ok) throw new Error("Frissítés sikertelen");
  return res.json();
};

export const deleteAnimal = async (id: number) => {
  const res = await fetch(`${BASE_URL}/animals/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Törlés sikertelen");
};
