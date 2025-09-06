import ProductList from "@/components/product-list";
import SearchInput from "@/components/search-input";
import ShoppingCart from "@/components/shopping-cart";

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const searchQuery = params.q || "";

  return (
    <>
      <h1 className="text-2xl font-bold mb-10 text-center">
        E-Commerce Microservices DevOps Project.
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="order-2 lg:order-1 col-span-1 lg:col-span-2 flex flex-col gap-4">
          <SearchInput defaultValue={searchQuery} />
          <ProductList searchQuery={searchQuery} />
        </div>
        <div className="order-1 lg:order-2 col-span-1">
          <ShoppingCart />
        </div>
      </div>
    </>
  );
}
