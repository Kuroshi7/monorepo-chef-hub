"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Produto {
  id: number;
  name: string;
  price: number;
  category: string;
}

const categorias = [
  { value: "comida", label: "Comida" },
  { value: "bebida", label: "Bebida" },
  { value: "sobremesa", label: "Sobremesa" },
];

const produtoSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Preço deve ser um número positivo",
    }),
  category: z.string(),
});

type NovoProdutoForm = z.infer<typeof produtoSchema>;

export default function ProdutosPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const {
    register: registerNovo,
    handleSubmit: handleSubmitNovo,
    reset: resetNovo,
    formState: { isSubmitting: isSubmittingNovo, errors: errorsNovo },
  } = useForm<NovoProdutoForm>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      name: "",
      price: "",
      category: categorias[0].value,
    },
  });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editProduto, setEditProduto] = useState({
    name: "",
    price: "",
    category: categorias[0].value,
  });

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      router.replace("/login");
      return;
    }
    buscarProdutos();
  }, []);

  const buscarProdutos = async () => {
    setLoading(true);
    const token = localStorage.getItem("jwt");
    let url = "http://localhost:3001/products";
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProdutos(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("jwt");
    await fetch(`http://localhost:3001/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAdd = async (data: { name: string; price: string; category: string }) => {
    const token = localStorage.getItem("jwt");
    const res = await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        price: Number(data.price),
        category: data.category,
      }),
    });
    if (res.ok) {
      resetNovo();
      buscarProdutos();
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditandoId(produto.id);
    setEditProduto({
      name: produto.name,
      price: String(produto.price),
      category: produto.category,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoId) return;
    const token = localStorage.getItem("jwt");
    await fetch(`http://localhost:3001/products/${editandoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editProduto.name,
        price: Number(editProduto.price),
        category: editProduto.category,
      }),
    });
    setEditandoId(null);
    buscarProdutos();
  };

  const produtosFiltrados = produtos.filter((p) =>
    p.name.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Produtos</h1>
      <form
        onSubmit={handleSubmitNovo(handleAdd)}
        className="mb-6 flex gap-4 items-end flex-wrap bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
      >
        <div>
          <label className="block text-sm text-gray-700 mb-1">Nome</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            {...registerNovo("name")}
          />
          {errorsNovo.name && (
            <span className="text-red-600 text-xs">{errorsNovo.name.message}</span>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Preço</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            type="number"
            step="0.01"
            {...registerNovo("price")}
          />
          {errorsNovo.price && (
            <span className="text-red-600 text-xs">{errorsNovo.price.message}</span>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Categoria</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            {...registerNovo("category")}
          >
            {categorias.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errorsNovo.category && (
            <span className="text-red-600 text-xs">{errorsNovo.category.message}</span>
          )}
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow" disabled={isSubmittingNovo}>
          {isSubmittingNovo ? "Adicionando..." : "Adicionar"}
        </Button>
      </form>
      <div className="mb-4 flex items-center gap-2">
        <input
          className="border border-gray-300 rounded px-3 py-2 w-64 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          type="button"
          onClick={buscarProdutos}
        >
          Buscar
        </Button>
      </div>
      {loading ? (
        <div className="text-gray-700">Carregando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold border-b">Nome</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold border-b">Preço</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold border-b">Categoria</th>
                <th className="px-6 py-4 text-left text-gray-700 font-semibold border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((produto) =>
                editandoId === produto.id ? (
                  <tr key={produto.id} className="border-b bg-gray-50">
                    <td className="px-6 py-4 align-middle">
                      <input
                        className="border border-gray-300 rounded px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={editProduto.name}
                        onChange={(e) =>
                          setEditProduto((v) => ({
                            ...v,
                            name: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <input
                        className="border border-gray-300 rounded px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                        type="number"
                        step="0.01"
                        value={editProduto.price}
                        onChange={(e) =>
                          setEditProduto((v) => ({
                            ...v,
                            price: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <select
                        className="border border-gray-300 rounded px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={editProduto.category}
                        onChange={(e) =>
                          setEditProduto((v) => ({
                            ...v,
                            category: e.target.value,
                          }))
                        }
                      >
                        {categorias.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 flex gap-2 align-middle">
                      <Button
                        onClick={handleEditSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                      >
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setEditandoId(null)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
                      >
                        Cancelar
                      </Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={produto.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-800 align-middle">{produto.name}</td>
                    <td className="px-6 py-4 text-gray-800 align-middle font-semibold">
                      R$ {Number(produto.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-800 align-middle">{produto.category}</td>
                    <td className="px-6 py-4 flex gap-2 align-middle">
                      <Button
                        type="button"
                        onClick={() => handleEdit(produto)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                      >
                        Editar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleDelete(produto.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                )
              )}
              {produtosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
