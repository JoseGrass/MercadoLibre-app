"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [ventas, setVentas] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: usersData, error: usersError } = await supabase
      .from("usuarios")
      .select("*");
    if (usersError) setMessage(usersError.message);
    else setUsuarios(usersData || []);

    const { data: productsData, error: productsError } = await supabase
      .from("productos")
      .select("*");
    if (productsError) setMessage(productsError.message);
    else setProductos(productsData || []);

    const { data: ventasData, error: ventasError } = await supabase
      .from("ventas")
      .select("*");
    if (ventasError) setMessage(ventasError.message);
    else setVentas(ventasData || []);
  };

  return (
    <div>
      <h1>Panel Administrativo</h1>

      {message && <p>{message}</p>}

      <section>
        <h2>Usuarios</h2>
        <ul>
          {usuarios.map((u) => (
            <li key={u.id}>
              {u.nombre} - {u.correo} - {u.telefono}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Productos</h2>
        <ul>
          {productos.map((p) => (
            <li key={p.id}>
              {p.titulo} - ${p.precio}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Ventas</h2>
        <ul>
          {ventas.map((v) => (
            <li key={v.id}>
              Producto: {v.producto_id}, Usuario: {v.usuario_id}, Cantidad:{" "}
              {v.cantidad}, Total: {v.total}, Estado: {v.estado}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
