import Link from "next/link";
import { Button } from "@/components/ui/button";

const menu = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Produtos", href: "/produtos" },
  { name: "Novo Pedido", href: "/novo-pedido" },
  { name: "Pedidos", href: "/pedidos" },
];

export function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
      <nav className="flex-1">
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.href}>
                <Button className="w-full justify-start text-gray-200 hover:bg-gray-800 hover:text-white">
                  <Link href={item.href} className="w-full h-full block text-left">{item.name}</Link>
                </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
