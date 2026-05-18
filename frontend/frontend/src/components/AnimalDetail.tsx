import { useState } from "react";
import type { Animal } from "../alltypes/Types";
import Badge from "./Badge";
import Modal from "./Modal";

interface Props {
  animal: Animal;
  onClose: () => void;
}

export default function AnimalDetail({ animal, onClose }: Props) {
  const [imgIndex, setImgIndex] = useState(0);
  const imgs = animal.imageUrls || [];

  return (
    <Modal title={animal.name} onClose={onClose}>
      {imgs.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 mb-5">
          <img
            src={`http://localhost:8080${imgs[imgIndex]}`}
            alt={animal.name}
            className="w-full h-full object-cover"
          />
          {imgs.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {imgs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge status={animal.status} />
          <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500">
            {animal.species === "DOG" ? "🐕 Kutya" : "🐈 Macska"}
          </span>
          <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500">
            {animal.gender === "MALE" ? "♂ Hím" : "♀ Nőstény"}
          </span>
          {animal.age != null && (
            <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500">
              {animal.age} éves
            </span>
          )}
          {animal.breed && (
            <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-500">
              {animal.breed}
            </span>
          )}
        </div>

        <p className="text-gray-500 leading-relaxed text-sm">
          {animal.description}
        </p>

        {animal.status === "AVAILABLE" && (
          <div className="mt-4 p-4 rounded-2xl bg-green-50 border border-green-100">
            <p className="text-green-700 font-semibold text-sm">
              ❤️ Szeretnéd örökbe fogadni {animal.name}-t?
            </p>
            <p className="text-green-600 text-xs mt-1">
              Lépj kapcsolatba a menhellyel!
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
