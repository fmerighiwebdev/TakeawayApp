"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { defaultTimeOptions } from "@/lib/defaultTimeOptions";
import { useCartStore } from "@/store/cart";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "./ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function CheckoutForm({ pickupTimes }) {
  const router = useRouter();
  const { cart } = useCartStore();

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(true);

  const [form, setForm] = useState({
    name: "",
    surname: "",
    time: "",
    phone: "",
    email: "",
    notes: "",
    terms: false,
  });

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const timeOptions = pickupTimes || defaultTimeOptions;

  useEffect(() => {
    const currentTimeString = getCurrentTime();

    const filteredTimes = timeOptions.filter((option) => {
      const optionStartTime = option.value.split("-")[0]; // "12:00"
      return optionStartTime > currentTimeString;
    });

    setAvailableTimes(filteredTimes);
    setIsLoadingTimes(false);
  }, [timeOptions]);

  function clearFieldError(field) {
    if (!errors) return;
    if (!errors[field]) return;
    const newErrors = { ...errors };
    delete newErrors[field];
    setErrors(newErrors);
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Il nome è obbligatorio.";
    }

    if (!form.surname.trim()) {
      newErrors.surname = "Il cognome è obbligatorio.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Il numero di telefono è obbligatorio.";
    } else if (!/^\d{10,15}$/.test(form.phone.trim())) {
      newErrors.phone = "Inserisci un numero di telefono valido.";
    }

    if (!form.email.trim()) {
      newErrors.email = "L'email è obbligatoria.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      newErrors.email = "Inserisci un indirizzo email valido.";
    }

    if (!form.time) {
      newErrors.time = "Seleziona un orario di ritiro.";
    }

    if (!form.terms) {
      newErrors.terms = "Devi accettare i termini e le condizioni.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const order = {
      name: form.name,
      surname: form.surname,
      time: form.time,
      phone: form.phone,
      email: form.email,
      notes: form.notes, // nuova textarea opzionale
      items: cart,
    };

    try {
      const response = await axios.post("/api/orders", order);
      const orderPublicId = response.data.orderPublicId;
      router.replace(`/checkout/success/${orderPublicId}`);
    } catch (error) {
      const newErrors = {};
      newErrors.order =
        error?.response?.data?.message ||
        "Si è verificato un errore durante l'invio dell'ordine.";
      setErrors(newErrors);
    }

    setLoading(false);
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      {errors?.order && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Errore durante l'invio dell'ordine.</AlertTitle>
          <AlertDescription>
            <p>
              Si è verificato un errore durante l'invio dell'ordine. Per favore,
              riprova più tardi.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {availableTimes.length === 0 && !isLoadingTimes && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>
            Al momento non ci sono orari di ritiro disponibili.
          </AlertTitle>
          <AlertDescription>
            <p>Purtroppo non è più possibile effettuare ordini per oggi.</p>
          </AlertDescription>
        </Alert>
      )}

      <fieldset className="flex flex-col gap-2">
        {/* Nome + Cognome */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label
              htmlFor="name"
              className={`text-lg text-(--muted-text) gap-0.5 ${
                errors?.name ? "text-red-600" : ""
              }`}
            >
              Nome<span className="text-primary">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                clearFieldError("name");
              }}
              aria-invalid={!!errors?.name}
              aria-describedby={errors?.name ? "name-error" : undefined}
            />
            {errors?.name && (
              <p id="name-error" className="text-red-600 text-sm">
                {errors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <Label
              htmlFor="surname"
              className={`text-lg text-(--muted-text) gap-0.5 ${
                errors?.surname ? "text-red-600" : ""
              }`}
            >
              Cognome<span className="text-primary">*</span>
            </Label>
            <Input
              id="surname"
              name="surname"
              type="text"
              value={form.surname}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, surname: e.target.value }));
                clearFieldError("surname");
              }}
              aria-invalid={!!errors?.surname}
              aria-describedby={errors?.surname ? "surname-error" : undefined}
            />
            {errors?.surname && (
              <p id="surname-error" className="text-red-600 text-sm">
                {errors.surname}
              </p>
            )}
          </div>
        </div>

        {/* Orario di ritiro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="time"
              className={`text-lg text-(--muted-text) gap-0.5 ${
                errors?.time ? "text-red-600" : ""
              }`}
            >
              Orario di ritiro<span className="text-primary">*</span>
            </Label>
            <Select
              value={form.time}
              onValueChange={(value) => {
                setForm((prev) => ({ ...prev, time: value }));
                clearFieldError("time");
              }}
              disabled={availableTimes.length === 0}
              className="w-full"
            >
              <SelectTrigger
                id="time"
                name="time"
                className="w-full"
                aria-invalid={!!errors?.time}
                aria-describedby={errors?.time ? "time-error" : undefined}
              >
                <SelectValue placeholder="Seleziona un orario" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.time && (
              <p id="time-error" className="text-red-600 text-sm">
                {errors.time}
              </p>
            )}
          </div>
        </div>

        {/* Telefono */}
        <div>
          <Label
            htmlFor="phone"
            className={`text-lg text-(--muted-text) gap-0.5 ${
              errors?.phone ? "text-red-600" : ""
            }`}
          >
            Telefono<span className="text-primary">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, phone: e.target.value }));
              clearFieldError("phone");
            }}
            aria-invalid={!!errors?.phone}
            aria-describedby={errors?.phone ? "phone-error" : undefined}
          />
          {errors?.phone && (
            <p id="phone-error" className="text-red-600 text-sm">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label
            htmlFor="email"
            className={`text-lg text-(--muted-text) gap-0.5 ${
              errors?.email ? "text-red-600" : ""
            }`}
          >
            Email<span className="text-primary">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, email: e.target.value }));
              clearFieldError("email");
            }}
            aria-invalid={!!errors?.email}
            aria-describedby={errors?.email ? "email-error" : undefined}
          />
          {errors?.email && (
            <p id="email-error" className="text-red-600 text-sm">
              {errors.email}
            </p>
          )}
        </div>

        {/* Note aggiuntive (facoltative) */}
        <div>
          <Label htmlFor="notes" className="text-lg text-(--muted-text)">
            Informazioni aggiuntive per l&apos;ordine{" "}
            <span className="text-(--muted-light-text) text-xs">
              (facoltativo)
            </span>
          </Label>
          <Textarea
            id="notes"
            name="notes"
            rows={4}
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, notes: e.target.value }))
            }
          />
        </div>

        {/* Termini e condizioni */}
        <div className="mt-4">
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={form.terms}
              onCheckedChange={(checked) => {
                setForm((prev) => ({ ...prev, terms: !!checked }));
                clearFieldError("terms");
              }}
              aria-invalid={!!errors?.terms}
              aria-describedby={errors?.terms ? "terms-error" : undefined}
            />
            <Label
              htmlFor="terms"
              className="cursor-pointer gap-0.5 text-(--muted-text)"
            >
              Ho letto e accettato i termini e le condizioni
              <span className="text-primary">*</span>
            </Label>
          </div>
          {errors?.terms && (
            <p id="terms-error" className="text-red-600 text-sm">
              {errors.terms}
            </p>
          )}
        </div>
      </fieldset>

      <div className="flex justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {!loading ? (
            <motion.button
              key="submit-button"
              type="submit"
              className="btn btn-primary w-fit text-lg"
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              Conferma ordine
            </motion.button>
          ) : (
            <motion.div
              key="submit-spinner"
              initial={{ opacity: 0, scale: 0.8, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <Spinner className="size-8 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
