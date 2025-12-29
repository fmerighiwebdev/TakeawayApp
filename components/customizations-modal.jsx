"use client";

import { useState } from "react";
import useSWR from "swr";
import axios from "axios";

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
} from "./ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { Button } from "./ui/button";
import { Plus, ShoppingBag } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

function convertToCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

const fetcher = (url) => axios.get(url).then((res) => res.data.customizations);

export default function VariationsModal({
  product,
  productId,
  setSuccess,
  trigger,
}) {
  const { addToCart } = useCartStore();
  const [open, setOpen] = useState(false);

  const [selectedDough, setSelectedDough] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedRemovals, setSelectedRemovals] = useState([]);
  const [selectedCookingOption, setSelectedCookingOption] = useState(null);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState(null);

  const {
    data: customizations,
    error,
    isLoading,
  } = useSWR(
    open ? `/api/products/customizations/${productId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5 * 60 * 1000,
    }
  );

  function handleExtrasToggle(checked, extraItem) {
    if (checked) {
      setSelectedExtras((prev) => [...prev, extraItem]);
    } else {
      setSelectedExtras((prev) =>
        prev.filter((extra) => extra?.id !== extraItem.id)
      );
    }
  }

  function handleRemovalsToggle(checked, removalItem) {
    if (checked) {
      setSelectedRemovals((prev) => [...prev, removalItem]);
    } else {
      setSelectedRemovals((prev) =>
        prev.filter((removal) => removal?.id !== removalItem.id)
      );
    }
  }

  function handleDoughChange(value) {
    const dough = customizations?.doughs?.find((d) => String(d.id) === value);
    setSelectedDough(dough ?? null);
  }

  function handleCookingChange(value) {
    const option = customizations?.cookings?.find(
      (o) => String(o.id) === value
    );
    setSelectedCookingOption(option ?? null);
  }

  function handleSpiceChange(value) {
    const option = customizations?.spiceLevels?.find(
      (o) => String(o.id) === value
    );
    setSelectedSpiceLevel(option ?? null);
  }

  function handleAddToCart() {
    const variationsCount =
      (selectedDough ? 1 : 0) +
      selectedExtras.length +
      selectedRemovals.length +
      (selectedCookingOption ? 1 : 0) +
      (selectedSpiceLevel ? 1 : 0);

    addToCart(
      product,
      selectedDough,
      selectedExtras,
      selectedRemovals,
      selectedCookingOption,
      selectedSpiceLevel
    );

    toast.success(
      `${product.name}${
        variationsCount > 0
          ? ` aggiunto al carrello con ${variationsCount} variazioni`
          : " aggiunto al carrello"
      }`
    );

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-(--muted-text)">
            Personalizza {product.name}
          </DialogTitle>
          <DialogDescription className="text-(--muted-light-text) text-lg">
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

        {!customizations?.doughs.length > 0 &&
          !customizations?.extras.length > 0 &&
          !customizations?.removals.length > 0 &&
          !customizations?.cookings.length > 0 &&
          !customizations?.spiceLevels.length > 0 &&
          !isLoading && (
            <p className="text-(--muted-text) my-4">
              Non ci sono personalizzazioni disponibili per questo prodotto.
            </p>
          )}

        {customizations && (
          <Accordion type="multiple" className="w-full space-y-4">
            {/* Impasti */}
            {customizations.doughs?.some((dough) => dough.id) && (
              <AccordionItem value="doughs">
                <AccordionTrigger className="text-xl text-(--muted-text)">
                  Impasto
                </AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    value={selectedDough ? String(selectedDough.id) : ""}
                    onValueChange={handleDoughChange}
                    className="gap-1"
                  >
                    {customizations.doughs.map((dough) => (
                      <div
                        key={dough.id}
                        className="flex items-center gap-2 text-(--muted-text)"
                      >
                        <RadioGroupItem
                          value={String(dough.id)}
                          id={`dough-${dough.id}`}
                        />
                        <Label
                          htmlFor={`dough-${dough.id}`}
                          className={`cursor-pointer text-lg ${
                            selectedDough?.id === dough.id ? "font-bold" : ""
                          }`}
                        >
                          {dough.name}{" "}
                          <span className="text-primary">
                            +{convertToCurrency(dough.price)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Extra */}
            {customizations.extras?.some((extra) => extra.id) && (
              <AccordionItem value="extras">
                <AccordionTrigger className="text-xl text-(--muted-text)">
                  Aggiunte
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {customizations.extras.map((extra) => {
                      const isSelected = selectedExtras.some(
                        (e) => e.id === extra.id
                      );
                      return (
                        <li key={extra.id}>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`extra-${extra.id}`}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleExtrasToggle(checked, extra)
                              }
                            />
                            <Label
                              htmlFor={`extra-${extra.id}`}
                              className={`cursor-pointer text-lg text-(--muted-text) ${
                                isSelected ? "font-bold" : ""
                              }`}
                            >
                              {extra.name}{" "}
                              {isSelected && (
                                <span className="text-primary">
                                  +{convertToCurrency(extra.price)}
                                </span>
                              )}
                            </Label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Rimozioni */}
            {customizations.removals?.some((removal) => removal.id) && (
              <AccordionItem value="removals">
                <AccordionTrigger className="text-xl text-(--muted-text)">
                  Rimozioni
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {customizations.removals.map((removal) => {
                      const isSelected = selectedRemovals.some(
                        (e) => e.id === removal.id
                      );
                      return (
                        <li key={removal.id}>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={`removal-${removal.id}`}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleRemovalsToggle(checked, removal)
                              }
                            />
                            <Label
                              htmlFor={`removal-${removal.id}`}
                              className={`cursor-pointer text-lg text-(--muted-text) ${
                                isSelected ? "font-bold" : ""
                              }`}
                            >
                              {removal.name}
                            </Label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Opzioni di cottura */}
            {customizations.cookings?.some((option) => option.id) && (
              <AccordionItem value="cookings">
                <AccordionTrigger className="text-xl text-(--muted-text)">
                  Opzioni di cottura
                </AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    value={
                      selectedCookingOption
                        ? String(selectedCookingOption.id)
                        : ""
                    }
                    onValueChange={handleCookingChange}
                    className="gap-1"
                  >
                    {customizations.cookings.map((option) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={String(option.id)}
                          id={`cooking-${option.id}`}
                        />
                        <Label
                          htmlFor={`cooking-${option.id}`}
                          className={`cursor-pointer text-lg text-(--muted-text) ${
                            selectedCookingOption?.id === option.id
                              ? "font-bold"
                              : ""
                          }`}
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Piccantezza */}
            {customizations.spiceLevels?.some((option) => option.id) && (
              <AccordionItem value="spiceLevels">
                <AccordionTrigger className="text-xl text-(--muted-text)">
                  Livello di piccantezza
                </AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    value={
                      selectedSpiceLevel ? String(selectedSpiceLevel.id) : ""
                    }
                    onValueChange={handleSpiceChange}
                    className="gap-1"
                  >
                    {customizations.spiceLevels.map((option) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={String(option.id)}
                          id={`spice-${option.id}`}
                        />
                        <Label
                          htmlFor={`spice-${option.id}`}
                          className={`cursor-pointer text-lg text-(--muted-text) ${
                            selectedSpiceLevel?.id === option.id
                              ? "font-bold"
                              : ""
                          }`}
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            )}
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
