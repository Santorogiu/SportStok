"use client";

import { api } from "@/lib/api";
import { Product } from "@/types/Product";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "./card";
import { Button } from "./ui/button";

export default function Stook() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = async () => {
    const response = await api.get("/products");
    setProducts(response.data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="container">
      <div className="w-full flex justify-between items-center">
        <p className="text-base text-zinc-400">Estoque</p>
        <div className="flex gap-4">
          <Button
            variant="outline"
            type="submit"
            onClick={() => {
              router.push("/products/new");
            }}
          >
            Novo produto <Plus className="ml-2 size-4" />
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-wrap gap-5 py-3 md:py-6">
        {products.map((product) => {
          return <Card key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}
