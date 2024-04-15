import Header from "@/components/header";
import NewProductForm from "@/components/new-product";
import { Toaster } from "react-hot-toast";

export default function New() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      <NewProductForm />
      <Toaster position="top-center" />
    </main>
  );
}
