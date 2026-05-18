interface Props {
  status: "AVAILABLE" | "ADOPTED";
}

export default function Badge({ status }: Props) {
  const isAvailable = status === "AVAILABLE";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
      ${isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
    >
      {isAvailable ? "● Örökbefogadható" : "✓ Gazdira talált"}
    </span>
  );
}
