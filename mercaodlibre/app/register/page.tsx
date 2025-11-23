"use client";
import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setMessage(authError.message);
      return;
    }

    if (!authData.user) {
      setMessage("No se pudo obtener el ID del usuario.");
      return;
    }

    const userId = authData.user.id;

    const { error: insertError } = await supabase.from("usuarios").insert({
      id: userId,
      nombre,
      correo: email,
      telefono,
    });

    if (insertError) {
      setMessage(insertError.message);
      return;
    }

    setMessage("Usuario registrado correctamente.");
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        required
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo"
      />
      <input
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Teléfono"
      />
      <input
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button type="submit">Registrarse</button>
      {message && <p>{message}</p>}
    </form>
  );
}
