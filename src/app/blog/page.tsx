import { Navbar } from "@/components/landing/Navbar";
import { Blog } from "@/components/landing/Blog";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Blog",
  description: "Read our latest articles on getting paid faster and improving cash flow.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <Blog />
      </div>
      <Footer />
    </main>
  );
}
