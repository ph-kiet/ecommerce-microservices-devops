"use client";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Loader2Icon, ShoppingCartIcon, TrashIcon } from "lucide-react";
import { Input } from "./ui/input";
import useCartStore from "@/lib/cart-store";
import { IProduct } from "@/lib/types";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "./ui/form";
import { toast } from "sonner";

const schema = z.object({
  email: z.email(),
});

export default function ShoppingCart() {
  const { items, removeItem, clearCart } = useCartStore();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        items,
        total: total.toFixed(2),
      }),
    });
    form.reset();
    clearCart();
    toast.success("Checkout successful");
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleRemoveItem = (item: IProduct) => {
    removeItem(item);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCartIcon /> Shopping Cart
        </CardTitle>
      </CardHeader>
      {items.length === 0 ? (
        <CardContent>
          <span>No items in cart</span>
        </CardContent>
      ) : (
        <>
          <CardContent>
            <ul className="space-y-4">
              {items.map((item) => (
                <li className="flex items-center justify-between" key={item.id}>
                  <span>{item.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold">
                      {item.quantity} × ${item.price * item.quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveItem(item)}
                    >
                      <span className="sr-only">Remove</span>
                      <TrashIcon />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 items-start">
            <span className="d-block font-semibold w-full text-right mb-2">
              Total: ${total.toFixed(2)}
            </span>

            <div className="w-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex gap-2 items-start"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      "Checkout"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
