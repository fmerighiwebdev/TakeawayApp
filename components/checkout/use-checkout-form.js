"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { defaultTimeOptions } from "@/lib/defaultTimeOptions";
import {
  normalizeDiscountCode,
  serializeOrderItemsForRequest,
} from "@/lib/orderRequest";
import { useCartStore } from "@/store/cart";

const PHONE_REGEX = /^\d{10,15}$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function getInitialFormState() {
  return {
    name: "",
    surname: "",
    time: "",
    phone: "",
    email: "",
    notes: "",
    coupon: "",
    terms: false,
  };
}

function getValidationErrors(form) {
  const nextErrors = {};

  if (!form.name.trim()) {
    nextErrors.name = "Il nome è obbligatorio.";
  }

  if (!form.surname.trim()) {
    nextErrors.surname = "Il cognome è obbligatorio.";
  }

  if (!form.phone.trim()) {
    nextErrors.phone = "Il numero di telefono è obbligatorio.";
  } else if (!PHONE_REGEX.test(form.phone.trim())) {
    nextErrors.phone = "Inserisci un numero di telefono valido.";
  }

  if (!form.email.trim()) {
    nextErrors.email = "L'email è obbligatoria.";
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    nextErrors.email = "Inserisci un indirizzo email valido.";
  }

  if (!form.time) {
    nextErrors.time = "Seleziona un orario di ritiro.";
  }

  if (!form.terms) {
    nextErrors.terms = "Devi accettare i termini e le condizioni.";
  }

  return nextErrors;
}

export function useCheckoutForm({
  pickupTimes,
  tenantFeatures,
  appliedDiscount,
  setAppliedDiscount,
}) {
  const router = useRouter();
  const { cart } = useCartStore();

  const [form, setForm] = useState(getInitialFormState);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(true);

  const timeOptions = pickupTimes || defaultTimeOptions;
  const couponVisible = Boolean(tenantFeatures?.discounts);

  useEffect(() => {
    const currentTimeString = getCurrentTime();
    const filteredTimes = timeOptions.filter((option) => {
      const optionStartTime = option.value.split("-")[0];
      return optionStartTime > currentTimeString;
    });

    setAvailableTimes(filteredTimes);
    setIsLoadingTimes(false);
  }, [timeOptions]);

  function clearFieldError(field) {
    setErrors((currentErrors) => {
      if (!currentErrors?.[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];

      return Object.keys(nextErrors).length > 0 ? nextErrors : null;
    });
  }

  function handleFieldChange(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    clearFieldError(field);

    if (field === "email" || field === "phone") {
      setAppliedDiscount(null);
      clearFieldError("coupon");
    }
  }

  function handleTimeChange(value) {
    setForm((currentForm) => ({
      ...currentForm,
      time: value,
    }));
    clearFieldError("time");
  }

  function handleTermsChange(checked) {
    setForm((currentForm) => ({
      ...currentForm,
      terms: !!checked,
    }));
    clearFieldError("terms");
  }

  function handleCouponBlur() {
    setForm((currentForm) => ({
      ...currentForm,
      coupon: normalizeDiscountCode(currentForm.coupon),
    }));
  }

  function validateForm() {
    const nextErrors = getValidationErrors(form);
    setErrors(Object.keys(nextErrors).length > 0 ? nextErrors : null);

    return Object.keys(nextErrors).length === 0;
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
      notes: form.notes,
      discount_code: appliedDiscount?.code || null,
      items: serializeOrderItemsForRequest(cart),
    };

    try {
      const response = await axios.post("/api/orders", order);
      router.replace(`/checkout/success/${response.data.orderPublicId}`);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        "Si è verificato un errore durante l'invio dell'ordine.";

      if (backendMessage === "Hai già utilizzato questo codice sconto.") {
        setAppliedDiscount(null);
        setErrors({
          coupon: backendMessage,
          order: backendMessage,
        });
        return;
      }

      setErrors({
        order: backendMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  async function validateCoupon() {
    const couponCode = normalizeDiscountCode(form.coupon);

    if (!couponCode) {
      setAppliedDiscount(null);
      setErrors((currentErrors) => ({
        ...currentErrors,
        coupon: "Inserisci un codice sconto.",
      }));
      return;
    }

    if (!form.email.trim() || !form.phone.trim()) {
      setAppliedDiscount(null);
      setErrors((currentErrors) => ({
        ...currentErrors,
        coupon: "Inserisci email e telefono per verificare il codice sconto.",
      }));
      return;
    }

    try {
      const response = await axios.post("/api/orders/validate-coupon", {
        email: form.email,
        phone: form.phone,
        code: couponCode,
      });

      if (response.data.valid) {
        setAppliedDiscount({
          code: response.data.code,
          percent_off: response.data.percent_off,
        });
        clearFieldError("coupon");
        clearFieldError("order");
        return;
      }

      setAppliedDiscount(null);
      setErrors((currentErrors) => ({
        ...currentErrors,
        coupon: response.data.message || "Codice sconto non valido.",
      }));
    } catch (error) {
      setAppliedDiscount(null);
      setErrors((currentErrors) => ({
        ...currentErrors,
        coupon:
          error?.response?.data?.message ||
          "Errore durante la verifica del codice sconto.",
      }));
    }
  }

  return {
    form,
    errors,
    loading,
    availableTimes,
    isLoadingTimes,
    couponVisible,
    handleFieldChange,
    handleTimeChange,
    handleTermsChange,
    handleCouponBlur,
    handleSubmit,
    validateCoupon,
  };
}
