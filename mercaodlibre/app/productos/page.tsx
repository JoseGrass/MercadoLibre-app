"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function ProductsPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const { data, error } = await supabase.from("productos").select("*");
    if (error) {
      setMessage(error.message);
    } else {
      setProductos(data);
    }
  };

  const handleAddProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      setMessage("Debes iniciar sesión.");
      return;
    }
    const usuarioId = sessionData.session.user.id;

    const { error } = await supabase.from("productos").insert([{
      usuario_id: usuarioId,
      titulo,
      descripcion,
      precio: parseFloat(precio),
      imagen_url: imagenUrl
    }]);

    if (error) {
      setMessage(error.message);
    } else {
      setTitulo("");
      setDescripcion("");
      setPrecio("");
      setImagenUrl("");
      setMessage("Producto agregado.");
      fetchProductos();
    }
  };

  const handleDeleteProducto = async (id: string) => {
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Producto eliminado.");
      fetchProductos();
    }
  };

  return (
    <div>
      <h1>Productos</h1>

      <form onSubmit={handleAddProducto}>
        <input
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
        />
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
        />
        <input
          required
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
        />
        <input
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
          placeholder="URL imagen"
        />
        <button type="submit">Agregar Producto</button>
      </form>

      {message && <p>{message}</p>}

      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            <h2>{p.titulo} - ${p.precio}</h2>
            <p>{p.descripcion}</p>
            <img src={p.imagen_url} alt={p.titulo} width={150} />
            <button onClick={() => handleDeleteProducto(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
