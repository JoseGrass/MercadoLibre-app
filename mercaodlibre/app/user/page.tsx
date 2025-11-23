"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setMessage("No autenticado.");
        return;
      }
      const userId = sessionData.session.user.id;
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        setMessage(error.message);
      } else {
        setUser(data);
        setNombre(data.nombre);
        setTelefono(data.telefono);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("usuarios")
      .update({ nombre, telefono })
      .eq("id", user.id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Perfil actualizado.");
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    // Eliminar usuario de supabase auth
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    if (authError) {
      setMessage(authError.message);
      return;
    }

    // Eliminar de tabla usuarios
    const { error } = await supabase.from("usuarios").delete().eq("id", user.id);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Cuenta eliminada.");
    }
  };

  if (!user) return <p>{message || "Cargando..."}</p>;

  return (
    <div>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      />
      <input
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Teléfono"
      />
      <button onClick={handleUpdate}>Actualizar</button>
      <button onClick={handleDelete}>Eliminar cuenta</button>
      {message && <p>{message}</p>}
    </div>
  );
}
