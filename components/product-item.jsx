import { useCartStore } from "@/store/cart";
import { Card } from "./ui/card";
import { ShoppingBag, Star } from "lucide-react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import CustomizationsModal from "./customizations-modal";

export default function ProductItem({ product, isTopProduct }) {
  const { addToCart } = useCartStore();

  console.log("Rendering ProductItem for:", product.name, "isTopProduct:", isTopProduct);

  const formattedPrice = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  function handleAddToCart() {
    addToCart(product);
    toast.success(`${product.name} aggiunto al carrello`);
  }

  return (
    <Card className="p-6 flex flex-col gap-4 md:gap-6 justify-between relative overflow-hidden">
      {isTopProduct && (
        <div className="absolute -right-12 top-4 rotate-45 bg-primary text-primary-foreground px-14 py-1 shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <Star className="size-4" strokeWidth={1.8} />
            <span className="text-xs font-medium">TOP</span>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-3xl font-medium text-(--muted-text)">
          {product.name}
        </h2>
        <p className="text-primary font-semibold text-2xl">{formattedPrice}</p>
      </div>
      <p className="text-(--muted-light-text)">
        <em>{product.description}</em>
      </p>
      <div
        className={`flex items-center ${product.has_customizations ? "justify-between" : "justify-end"}`}
      >
        {product.has_customizations && (
          <CustomizationsModal
            product={product}
            productId={product.id}
            trigger={<button className="btn btn-link p-0">Personalizza</button>}
          />
        )}
        <button
          className="btn btn-primary gap-0 px-2"
          onClick={handleAddToCart}
          aria-label="Aggiungi al carrello"
        >
          <Plus />
          <ShoppingBag />
        </button>
      </div>
    </Card>
  );
}
