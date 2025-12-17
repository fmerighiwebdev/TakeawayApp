import { useCartStore } from "@/store/cart";
import { Card } from "./ui/card";
import { ShoppingBag } from "lucide-react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import CustomizationsModal from "./customizations-modal";

export default function ProductItem({ product }) {
  const { addToCart } = useCartStore();

  const formattedPrice = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  function handleAddToCart() {
    addToCart(product);
    toast.success(`${product.name} aggiunto al carrello`);
  }

  return (
    <Card className="p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-medium text-(--muted-text)">
          {product.name}
        </h2>
        <p className="text-primary font-semibold text-2xl">{formattedPrice}</p>
      </div>
      <p className="text-(--muted-light-text)">
        <em>{product.description}</em>
      </p>
      <div className="flex items-center justify-between">
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
