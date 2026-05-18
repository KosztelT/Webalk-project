import { useState, useEffect, useCallback } from "react";
import type { Animal } from "./alltypes/Types";
import { getAnimals, deleteAnimal } from "./api/api";
import AnimalCard from "./components/AnimalCard";
import AnimalDetail from "./components/AnimalDetail";
import AnimalForm from "./components/AnimalForm";
import LoginForm from "./components/LoginForm";

export default function App() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("jwt") || "");
  const [username, setUsername] = useState(
    () => localStorage.getItem("uname") || "",
  );
  const [isAdmin, setIsAdmin] = useState(false);

  const [filterSpecies, setFilterSpecies] = useState<"ALL" | "DOG" | "CAT">(
    "ALL",
  );
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "AVAILABLE" | "ADOPTED"
  >("ALL");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<Animal | null>(null);
  const [editing, setEditing] = useState<Animal | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchAnimals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAnimals();
      setAnimals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  useEffect(() => {
    if (!token) {
      setIsAdmin(false);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const roles = payload.roles || payload.role || payload.authorities || [];
      const roleStr = Array.isArray(roles) ? roles.join(",") : String(roles);
      setIsAdmin(roleStr.includes("ADMIN"));
    } catch {
      setIsAdmin(false);
    }
  }, [token]);

  const handleLogin = (tok: string, uname: string) => {
    setToken(tok);
    setUsername(uname);
    localStorage.setItem("jwt", tok);
    localStorage.setItem("uname", uname);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setToken("");
    setUsername("");
    setIsAdmin(false);
    localStorage.removeItem("jwt");
    localStorage.removeItem("uname");
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAnimal(id);
      setDeleteConfirm(null);
      fetchAnimals();
    } catch (e: any) {
      alert("Törlés sikertelen: " + e.message);
    }
  };

  const filtered = animals.filter((a) => {
    if (filterSpecies !== "ALL" && a.species !== filterSpecies) return false;
    if (filterStatus !== "ALL" && a.status !== filterStatus) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const available = animals.filter((a) => a.status === "AVAILABLE").length;

  const filterBtnCls = (active: boolean) =>
    `px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors
    ${active ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐾</span>
            <span className="font-bold text-gray-800 text-lg">
              Állat Menhely
            </span>
          </div>

          <div className="flex items-center gap-2">
            {token ? (
              <>
                <span className="text-sm text-gray-400 hidden sm:block">
                  {isAdmin && (
                    <span className="text-xs bg-gray-800 text-white px-2 py-0.5 rounded-full mr-1.5">
                      Admin
                    </span>
                  )}
                  {username}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => setShowNew(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors"
                  >
                    + <span className="hidden sm:block">Új állat</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
                >
                  Kilépés
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Bejelentkezés
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gray-800 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-bold text-3xl sm:text-5xl mb-3">
            Találd meg új legjobb barátod
          </h1>
          <p className="text-gray-300 text-base sm:text-lg mb-6">
            Jelenleg <strong className="text-white">{available} állat</strong>{" "}
            vár szerető gazdira.
          </p>
          <input
            className="w-full max-w-md px-4 py-3 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-gray-300 text-sm focus:bg-white/30 focus:border-white/60 transition-all outline-none"
            placeholder="🔍 Keresés névre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap gap-2">
        <button
          className={filterBtnCls(filterSpecies === "ALL")}
          onClick={() => setFilterSpecies("ALL")}
        >
          Mind
        </button>
        <button
          className={filterBtnCls(filterSpecies === "DOG")}
          onClick={() => setFilterSpecies("DOG")}
        >
          🐕 Kutyák
        </button>
        <button
          className={filterBtnCls(filterSpecies === "CAT")}
          onClick={() => setFilterSpecies("CAT")}
        >
          🐈 Macskák
        </button>
        <div className="w-px bg-gray-200 self-stretch mx-1" />
        <button
          className={filterBtnCls(filterStatus === "ALL")}
          onClick={() => setFilterStatus("ALL")}
        >
          Minden státusz
        </button>
        <button
          className={filterBtnCls(filterStatus === "AVAILABLE")}
          onClick={() => setFilterStatus("AVAILABLE")}
        >
          ● Örökbefogadható
        </button>
        <button
          className={filterBtnCls(filterStatus === "ADOPTED")}
          onClick={() => setFilterStatus("ADOPTED")}
        >
          ✓ Gazdira talált
        </button>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="aspect-[4/3] bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐾</div>
            <p className="text-gray-400 text-lg">
              Nem találtunk állatot ezekkel a szűrőkkel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((a) => (
              <AnimalCard
                key={a.id}
                animal={a}
                onSelect={setSelected}
                onEdit={setEditing}
                onDelete={setDeleteConfirm}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {selected && (
        <AnimalDetail animal={selected} onClose={() => setSelected(null)} />
      )}
      {showAuth && (
        <LoginForm onLogin={handleLogin} onClose={() => setShowAuth(false)} />
      )}
      {showNew && (
        <AnimalForm
          onSaved={() => {
            setShowNew(false);
            fetchAnimals();
          }}
          onClose={() => setShowNew(false)}
        />
      )}
      {editing && (
        <AnimalForm
          initial={editing}
          onSaved={() => {
            setEditing(null);
            fetchAnimals();
          }}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-xl text-gray-800 mb-2">
              Biztosan törlöd?
            </h3>
            <p className="text-gray-400 text-sm mb-5">
              Ez a művelet nem vonható vissza.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Mégse
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Törlés
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
