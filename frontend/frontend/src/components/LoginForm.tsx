import { useState } from "react";
import { login, register } from "../api/api";
import Modal from "./Modal";

interface Props {
  onLogin: (token: string, username: string) => void;
  onClose: () => void;
}

export default function LoginForm({ onLogin, onClose }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (mode === "login") {
        const data = await login(username, password);
        onLogin(data.token, username);
      } else {
        await register(username, password);
        setSuccess("Sikeres regisztráció! Most már bejelentkezhetsz.");
        setMode("login");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Üdvözlünk! 🐾" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                ${mode === m ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              {m === "login" ? "Bejelentkezés" : "Regisztráció"}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">
            Felhasználónév
          </label>
          <input
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:border-gray-400 focus:bg-white transition-colors outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="felhasználónév"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Jelszó</label>
          <input
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm focus:border-gray-400 focus:bg-white transition-colors outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg">
            ✓ {success}
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
            {loading
              ? "..."
              : mode === "login"
                ? "Bejelentkezés"
                : "Regisztráció"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
