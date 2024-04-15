"use client";

import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { Category } from "@/types/Category";
import { Product } from "@/types/Product";
import Cookie from "js-cookie";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

export default function EditProductForm({ id }: { id: string }) {
  const [product, setProduct] = useState<Product>();
  const [categorys, setCategorys] = useState<Category[]>([]);
  const { register, handleSubmit } = useForm<Product>();
  const [isLoading, setIsLoading] = useState(false);

  const [category, setCategory] = useState("");

  const router = useRouter();
  const token = Cookie.get("token");

  const onSubmit = async (data: Product) => {};

  const getProduct = async () => {
    const response = await api.get(`/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setProduct(response.data);
  };

  const getCategorys = async () => {
    const response = await api.get("/category", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setCategorys(response.data);
  };

  useEffect(() => {
    getProduct();
    getCategorys();
  }, []);

  return (
    <div className="relative container h-full flex flex-1 justify-center items-center">
      <Button
        onClick={() => {
          router.push("/");
        }}
        className="absolute left-0 top-8"
        variant="outline"
        size="icon"
      >
        <ArrowLeft className="size-4" />
      </Button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl flex flex-col items-center justify-center gap-3"
      >
        <img
          src={product?.imageUrl}
          alt="preview"
          className="aspect-video w-full rounded-lg object-cover shadow-lg"
        />

        <Input
          type="text"
          value={product?.name}
          placeholder="Nome"
          {...register("name")}
        />

        <div className="w-full flex gap-2">
          <Input
            type="number"
            value={product?.quantity}
            placeholder="Quantidade"
            {...register("quantity")}
          />
          <Select
            onValueChange={setCategory}
            value={category}
            defaultValue={product?.categoryId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categorias</SelectLabel>

                {categorys.map((category) => {
                  return (
                    <SelectItem value={category.id} key={category.id}>
                      {category.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex gap-2">
          <Input
            type="number"
            value={product?.size}
            placeholder="Tamanho"
            {...register("size")}
          />
          <Input
            type="text"
            value={product?.color}
            placeholder="Cor"
            {...register("color")}
          />
        </div>

        <Button variant="default" className="mt-2 w-full" type="submit">
          {isLoading ? (
            <Loader2 className="size-5 text-neutral-200 animate-spin" />
          ) : (
            <>Salvar</>
          )}
        </Button>
      </form>
    </div>
  );
}
