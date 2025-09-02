import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

interface SearchInputProps {
  defaultValue?: string;
}

export default function SearchInput({ defaultValue = "" }: SearchInputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SearchIcon />
          Search Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form method="GET" className="flex items-center gap-2">
          <Input
            className="w-full"
            placeholder="Ex: Laptop"
            defaultValue={defaultValue}
            name="q"
          />
          <Button type="submit">
            <SearchIcon />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
