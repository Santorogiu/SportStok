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
import toast from "react-hot-toast";

export default function EditProductForm({ id }: { id: string }) {
  const [product, setProduct] = useState<Product>();
  const [categorys, setCategorys] = useState<Category[]>([]);
  const { register, handleSubmit, setValue } = useForm<Product>();
  const [isLoading, setIsLoading] = useState(false);

  const [category, setCategory] = useState("");

  const router = useRouter();
  const token = Cookie.get("token");

  const onSubmit = async (data: Product) => {
    if (!data.name || !category || !data.size || !data.quantity) {
      return toast.error("Preencha todos os dados!", {
        style: {
          background: "#4F46E5",
          color: "#E5E5E5",
        },
        iconTheme: {
          primary: "#E5E5E5",
          secondary: "#4F46E5",
        },
      });
    }

    setIsLoading(!isLoading);

      try {
        await api.put(
        `/product/${product?.id}`,
          {
            name: data.name,
            quantity: data.quantity.toString(),
            size: data.size.toString(),
            color: data.color,
            categoryId: category,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Produto editado", {
          style: {
            background: "#4F46E5",
            color: "#E5E5E5",
          },
          iconTheme: {
            primary: "#E5E5E5",
            secondary: "#4F46E5",
          },
        });

        return router.push('/')
      } catch (e) {
        return toast.error("Erro ao editar produto", {
          style: {
            background: "#4F46E5",
            color: "#E5E5E5",
          },
          iconTheme: {
            primary: "#E5E5E5",
            secondary: "#4F46E5",
          },
        });
      }finally{
        setIsLoading(!!isLoading)
      }
  };

  const getProduct = async () => {
    const response = await api.get(`/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setProduct(response.data);

    setValue("name", response.data.name);
    setValue("quantity", response.data.quantity);
    setValue("size", response.data.size);
    setValue("color", response.data.color);

    setCategory(response.data.categoryId)
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
    getCategorys();
    getProduct();
  }, []);

  return (
    <div className="relative container h-full flex flex-col flex-1 justify-center items-center p-3 gap-2">
      <div className="inline-flex justify-start w-full">
        <Button
          onClick={() => {
            router.push("/");
          }}
          variant="ghost"
          size="icon"
        >
          <ArrowLeft className="size-4" />
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl flex flex-col items-center justify-center gap-3"
      >
        <img
          src={product?.imageUrl}
          alt="preview"
          className="aspect-square flex w-full h-72 rounded-xl object-cover shadow-sm"
        />
        <Input
          type="text"
          placeholder="Nome"
          {...register("name")}
        />

        <div className="w-full flex gap-2">
          <Input
            type="number"
            placeholder="Quantidade"
            {...register("quantity")}
          />

          <Select
            onValueChange={setCategory}
            value={category} 
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder='Categoria'/>
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
            placeholder="Tamanho"
            {...register("size")}
          />
          <Input
            type="text"
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
