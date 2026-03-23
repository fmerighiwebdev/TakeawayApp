import { useCartStore } from "@/store/cart";
import { Card } from "./ui/card";
import { ShoppingBag, Star, Plus } from "lucide-react";
import { toast } from "sonner";
import CustomizationsModal from "./customizations-modal";
import ProductDescription from "./product-description";

export default function ProductItem({ product, isTopProduct }) {
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
    <Card className="relative self-start overflow-visible p-6 h-full flex flex-col gap-4">
      {isTopProduct && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute -right-12 top-4 rotate-45 bg-primary px-14 py-1 text-primary-foreground shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <Star className="size-4" strokeWidth={1.8} />
              <span className="text-xs font-medium">TOP</span>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-medium text-(--muted-text)">
          {product.name}{" "}
          {product.spice_level > 0 && (
            <span className="inline-flex items-center">
              {Array.from({ length: product.spice_level }).map((_, i) => (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 100 100"
                  fill="none"
                  key={i}
                >
                  <path
                    d="M98.6215 19.9952C97.1205 16.751 94.4774 14.581 90.7657 13.5481C90.6051 13.4773 90.3057 13.3553 89.9468 13.2176C91.9534 10.5263 92.8258 7.66964 92.2706 5.28716C91.8899 3.65227 90.6764 1.42718 87.0697 0.118885C86.0407 -0.25098 84.9006 0.270372 84.5258 1.29144C84.1511 2.31447 84.6785 3.44373 85.7076 3.81557C87.266 4.3802 88.1742 5.17305 88.4081 6.17444C88.7571 7.67357 87.7479 9.93211 85.8364 11.9939C84.3057 11.6634 82.5351 11.4135 80.6594 11.4135C75.6707 11.4135 67.4282 13.3435 64.1309 25.1005L65.5922 25.0336C72.5458 24.5083 75.8313 23.1981 76.5689 22.1495L77.9231 20.2214L79.5966 21.8839C79.7651 22.0511 83.0427 25.3759 82.7512 30.4124C84.5318 29.6648 86.4333 28.2168 86.1359 25.4527L85.6005 20.5087L89.3995 23.7509C89.6117 23.9339 93.8707 27.6463 94.2534 33.7825C94.7729 33.4441 95.3241 33.0349 95.8733 32.5489L96.0637 32.4014L99.8706 29.7809C100.194 26.3478 99.9599 22.8892 98.6215 19.9952Z"
                    fill="#008000"
                  />
                  <path
                    d="M92.6452 38.9273L89.5262 39.8657L90.1231 36.6845C90.6445 33.9184 90.018 31.6205 89.1733 29.9285C87.2837 33.3183 83.0465 34.7643 80.4015 35.0634L77.223 35.4254L78.3096 32.4409C79.2871 29.7574 78.5951 27.5461 77.8555 26.1748C76.0472 27.2529 72.6111 28.4471 65.8319 28.9586L63.2721 29.0767C63.2384 29.2891 63.1928 29.476 63.1631 29.6925C62.8954 30.6073 62.6317 31.5772 62.3799 32.673C55.6642 62.0202 31.1113 77.5998 2.10904 93.5355C0.562465 94.3873 -0.317893 96.3311 0.106423 97.9581C0.429618 99.1995 1.45274 100 2.71379 100L3.1619 99.9668C5.62254 99.5969 8.6463 99.3648 12.1479 99.0933C33.9011 97.4092 74.3956 94.2732 95.2704 45.7285C95.4409 45.3783 97.6002 40.8179 98.9445 35.205L98.421 35.565C95.6094 38.0203 92.7681 38.8899 92.6452 38.9273ZM31.3929 90.3975C31.1906 90.4605 30.9864 90.4919 30.7841 90.4919C29.9454 90.4919 29.1682 89.9608 28.8965 89.1286C28.5614 88.0957 29.1325 86.9861 30.1754 86.6516C73.1147 72.9234 77.8516 43.7768 77.8952 43.4857C78.0518 42.4095 79.0591 41.6422 80.1417 41.8213C81.2263 41.9767 81.9758 42.9741 81.8191 44.0503C81.6328 45.3429 76.6619 75.9216 31.3929 90.3975Z"
                    fill="#8B0000"
                  />
                </svg>
              ))}
            </span>
          )}
        </h2>

        <p className="text-primary font-semibold text-2xl">{formattedPrice}</p>
      </div>

      <ProductDescription description={product.description} />

      <div
        className={`mt-auto flex items-center ${
          product.has_customizations ? "justify-between" : "justify-end"
        }`}
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