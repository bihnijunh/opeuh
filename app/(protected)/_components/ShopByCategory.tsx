import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Payment Cards",
    href: "/giftcard/payment-cards",
    image:
      "https://dundle.com/cdn-cgi/image/format=auto,width=238,fit=cover,quality=85/https://cdn.dundle.com/resources/images/home-page/categories/category-payment-cards.png",
  },
  {
    name: "Gift Cards",
    href: "/giftcard",
    image:
      "https://dundle.com/cdn-cgi/image/format=auto,width=238,fit=cover,quality=85/https://cdn.dundle.com/resources/images/home-page/categories/category-gift-cards.png",
  },
  {
    name: "Gaming Credits",
    href: "/gaming-credits",
    image:
      "https://dundle.com/cdn-cgi/image/format=auto,width=238,fit=cover,quality=85/https://cdn.dundle.com/resources/images/home-page/categories/category-gaming-credits.png",
  },
];

export function ShopByCategory() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Buy Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link href={category.href} key={category.name}>
            <Card>
              <CardContent className="flex flex-col items-center p-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-24 h-24 object-contain mb-2"
                />
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
