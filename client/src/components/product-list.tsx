"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { BoxIcon } from "lucide-react";
import { IProduct } from "@/lib/types";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import useCartStore from "@/lib/cart-store";

interface ProductListProps {
  searchQuery?: string;
}

export default function ProductList({ searchQuery }: ProductListProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/products?search=${searchQuery || ""}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  }, [searchQuery]);

  const handleAddToCart = (product: IProduct) => {
    addItem(product);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BoxIcon /> Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center">No products found</div>
        ) : (
          <ul className="space-y-4">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between"
              >
                <span>{product.name}</span>
                <span className="flex items-center gap-2">
                  <span className="font-semibold">{`$${product.price}`}</span>
                  <Button size="sm" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
