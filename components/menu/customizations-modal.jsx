"use client";

import { useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "@/store/cart";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Accordion } from "@/components/ui/accordion";
import { Spinner } from "@/components/ui/spinner";
import CustomizationCheckboxSection from "@/components/menu/customization-checkbox-section";
import CustomizationRadioSection from "@/components/menu/customization-radio-section";
import { useCustomizationSelection } from "@/components/menu/use-customization-selection";
import { useProductCustomizations } from "@/components/menu/use-product-customizations";
import { formatCurrency } from "@/lib/shared/currency";

export default function CustomizationsModal({
  product,
  productId,
  setSuccess,
  trigger,
}) {
  const { addToCart } = useCartStore();
  const [open, setOpen] = useState(false);

  const {
    data: customizations,
    error,
    isLoading,
  } = useProductCustomizations(productId, open);

  const {
    selectedDough,
    selectedExtras,
    selectedRemovals,
    selectedCookingOption,
    selectedSpiceLevel,
    selectedVariationsCount,
    handleDoughChange,
    handleExtrasToggle,
    handleRemovalsToggle,
    handleCookingChange,
    handleSpiceChange,
  } = useCustomizationSelection(customizations);

  const noCustomizationsAvailable =
    customizations &&
    !customizations.doughs?.length &&
    !customizations.extras?.length &&
    !customizations.removals?.length &&
    !customizations.cookings?.length &&
    !customizations.spiceLevels?.length;

  function handleAddToCart() {
    addToCart(
      product,
      selectedDough,
      selectedExtras,
      selectedRemovals,
      selectedCookingOption,
      selectedSpiceLevel,
    );

    toast.success(
      `${product.name}${
        selectedVariationsCount > 0
          ? ` aggiunto al carrello con ${selectedVariationsCount} variazioni`
          : " aggiunto al carrello"
      }`,
    );

    if (typeof setSuccess === "function") {
      setSuccess(true);
    }

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-(--muted-text)">
            Personalizza {product.name}
          </DialogTitle>
          <DialogDescription className="text-lg text-(--muted-light-text)">
            Seleziona le variazioni e aggiungi il prodotto al carrello.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center py-6">
            <Spinner className="size-8 text-(--muted-text)" />
          </div>
        )}

        {error && (
          <p className="errorBanner mt-2" role="alert">
            {error.message ?? "Si è verificato un errore."}
          </p>
        )}

        {noCustomizationsAvailable && !isLoading && (
          <p className="my-4 text-(--muted-text)">
            Non ci sono personalizzazioni disponibili per questo prodotto.
          </p>
        )}

        {customizations && !noCustomizationsAvailable && (
          <Accordion type="multiple" className="w-full space-y-4">
            <CustomizationRadioSection
              value="doughs"
              title="Impasto"
              options={customizations.doughs}
              selectedOption={selectedDough}
              onValueChange={handleDoughChange}
              renderOptionLabel={(option) => (
                <>
                  {option.name} <span className="text-primary">+{formatCurrency(option.price)}</span>
                </>
              )}
            />

            <CustomizationCheckboxSection
              value="extras"
              title="Aggiunte"
              options={customizations.extras}
              selectedItems={selectedExtras}
              onToggle={handleExtrasToggle}
              renderOptionLabel={(option, isSelected) => (
                <>
                  {option.name}{" "}
                  {isSelected && (
                    <span className="text-primary">+{formatCurrency(option.price)}</span>
                  )}
                </>
              )}
            />

            <CustomizationCheckboxSection
              value="removals"
              title="Rimozioni"
              options={customizations.removals}
              selectedItems={selectedRemovals}
              onToggle={handleRemovalsToggle}
              renderOptionLabel={(option) => option.name}
            />

            <CustomizationRadioSection
              value="cookings"
              title="Opzioni di cottura"
              options={customizations.cookings}
              selectedOption={selectedCookingOption}
              onValueChange={handleCookingChange}
              renderOptionLabel={(option) => option.label}
            />

            <CustomizationRadioSection
              value="spice-levels"
              title="Livello di piccantezza"
              options={customizations.spiceLevels}
              selectedOption={selectedSpiceLevel}
              onValueChange={handleSpiceChange}
              renderOptionLabel={(option) => option.label}
            />
          </Accordion>
        )}

        <DialogFooter className="flex flex-row items-center gap-2">
          <DialogClose asChild>
            <button type="button" className="btn btn-link">
              Annulla
            </button>
          </DialogClose>

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn btn-primary gap-0 px-2"
            aria-label="Aggiungi al carrello"
          >
            <Plus />
            <ShoppingBag />
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
