import type { Animal } from "../alltypes/Types";
import Badge from "./Badge";

interface Props {
  animal: Animal;
  onSelect: (animal: Animal) => void;
  onEdit?: (animal: Animal) => void;
  onDelete?: (id: number) => void;
  isAdmin: boolean;
}

export default function AnimalCard({
  animal,
  onSelect,
  onEdit,
  onDelete,
  isAdmin,
}: Props) {
  const img = animal.imageUrls?.[0];

  return (
    <div
      onClick={() => onSelect(animal)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        {img ? (
          <img
            src={img}
            alt={animal.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {animal.species === "DOG" ? "🐕" : "🐈"}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge status={animal.status} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{animal.name}</h3>
            <p className="text-gray-400 text-sm">
              {animal.breed || (animal.species === "DOG" ? "Kutya" : "Macska")}
              {animal.age != null ? ` · ${animal.age} éves` : ""}
            </p>
          </div>

          {isAdmin && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onEdit?.(animal)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete?.(animal.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
          {animal.description}
        </p>
      </div>
    </div>
  );
}
