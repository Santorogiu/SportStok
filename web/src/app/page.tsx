import Stook from "@/components/stook";
import { Toaster } from "react-hot-toast";
import Header from "../components/header";
export default function Home() {
  return (
    <main className="flex flex-col min-h-screen gap-8 bg-neutral-100">
      <Header />
      <Stook />
      <Toaster position="top-center" />
    </main>
  );
}
