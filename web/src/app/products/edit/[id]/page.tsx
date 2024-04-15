import EditProductForm from "@/components/edit-product";
import Header from "@/components/header";
import { Toaster } from "react-hot-toast";

export default function Edit({ params }: { params: { id: string } }) {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      <EditProductForm id={params.id} />
      <Toaster position="top-center" />
    </main>
  );
}
