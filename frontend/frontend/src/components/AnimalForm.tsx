import { useState } from "react";
import type { Animal } from "../alltypes/Types";
import { createAnimal, updateAnimal } from "../api/api";
import Modal from "./Modal";

interface Props {
  initial?: Animal;
  onSaved: () => void;
  onClose: () => void;
}

export default function AnimalForm({ initial, onSaved, onClose }: Props) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    name: initial?.name || "",
    species: initial?.species || "DOG",
    breed: initial?.breed || "",
    gender: initial?.gender || "MALE",
    birthDate: "",
    status: initial?.status || "AVAILABLE",
    description: initial?.description || "",
    age: initial?.age?.toString() || "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set =
    (k: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:border-gray-400 focus:bg-white transition-colors outline-none";

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : null,
        birthDate: form.birthDate || null,
        breed: form.breed || null,
      };
      if (isEdit) {
        await updateAnimal(initial!.id, payload, files);
      } else {
        await createAnimal(
          payload,
          files.length > 0 ? files : [new File([], "empty.jpg")],
        );
      }
      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? `Szerkesztés: ${initial!.name}` : "Új állat hozzáadása"}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Név *</label>
          <input
            className={inputCls}
            value={form.name}
            onChange={set("name")}
            placeholder="Pl. Bodri"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Faj *</label>
            <select
              className={inputCls}
              value={form.species}
              onChange={set("species")}
            >
              <option value="DOG">🐕 Kutya</option>
              <option value="CAT">🐈 Macska</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Nem *</label>
            <select
              className={inputCls}
              value={form.gender}
              onChange={set("gender")}
            >
              <option value="MALE">♂ Hím</option>
              <option value="FEMALE">♀ Nőstény</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Fajta</label>
            <input
              className={inputCls}
              value={form.breed}
              onChange={set("breed")}
              placeholder="Pl. Labrador"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">
              Kor (év)
            </label>
            <input
              className={inputCls}
              type="number"
              min="0"
              value={form.age}
              onChange={set("age")}
              placeholder="Pl. 3"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">
              Születési dátum
            </label>
            <input
              className={inputCls}
              type="date"
              value={form.birthDate}
              onChange={set("birthDate")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Státusz</label>
            <select
              className={inputCls}
              value={form.status}
              onChange={set("status")}
            >
              <option value="AVAILABLE">Örökbefogadható</option>
              <option value="ADOPTED">Gazdira talált</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Leírás *</label>
          <textarea
            className={inputCls + " resize-none"}
            rows={3}
            value={form.description}
            onChange={set("description")}
            placeholder="Mesélj az állatról..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Képek</label>
          <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
            <span className="text-2xl">📷</span>
            <span className="text-sm text-gray-400">
              {files.length > 0
                ? `${files.length} fájl kiválasztva`
                : "Kattints a feltöltéshez"}
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => setFiles([...e.target.files!])}
            />
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Mégse
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gray-800 text-white text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {loading ? "Mentés..." : isEdit ? "Frissítés" : "Hozzáadás"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
