"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

import Input from "../input/input";

import styles from "./checkout-form.module.css";

import { defaultTimeOptions } from "@/lib/defaultTimeOptions";
import { useCartStore } from "@/store/cart";
import Loader from "../loader/loader";
import { useRouter } from "next/navigation";
import Checkbox from "../checkbox/checkbox";
import Select from "../select/select";

export default function CheckoutForm({ pickupTimes }) {
  const nameRef = useRef();
  const surnameRef = useRef();
  const timeRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const termsRef = useRef();

  const router = useRouter();

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(true);

  const { cart } = useCartStore();

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const timeOptions = pickupTimes || defaultTimeOptions;

  useEffect(() => {
    const currentTimeString = getCurrentTime(); // e.g., "19:41"
    console.log(currentTimeString);

    const filteredTimes = timeOptions.filter(option => {
      const optionStartTime = option.value.split('-')[0]; // "12:00"

      return optionStartTime > currentTimeString;
    });

    setAvailableTimes(filteredTimes);
    setIsLoadingTimes(false);
  }, []);

  function validateForm() {
    const newErrors = {};

    if (!nameRef.current.value.trim()) {
      newErrors.name = "Il nome è obbligatorio.";
    }

    if (!surnameRef.current.value.trim()) {
      newErrors.surname = "Il cognome è obbligatorio.";
    }

    if (!phoneRef.current.value.trim()) {
      newErrors.phone = "Il numero di telefono è obbligatorio.";
    } else if (!/^\d{10,15}$/.test(phoneRef.current.value.trim())) {
      newErrors.phone = "Inserisci un numero di telefono valido.";
    }

    if (!emailRef.current.value.trim()) {
      newErrors.email = "L'email è obbligatoria.";
    } else if (!/^\S+@\S+\.\S+$/.test(emailRef.current.value.trim())) {
      newErrors.email = "Inserisci un indirizzo email valido.";
    }

    if (!timeRef.current.value) {
      newErrors.time = "Seleziona un orario di ritiro.";
    }

    if (!termsRef.current.checked) {
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

    const name = nameRef.current.value;
    const surname = surnameRef.current.value;
    const time = timeRef.current.value;
    const phone = phoneRef.current.value;
    const email = emailRef.current.value;
    const terms = termsRef.current.checked;

    const order = {
      name,
      surname,
      time,
      phone,
      email,
      items: cart,
    };

    console.log(order);

    try {
      const response = await axios.post("/api/orders", order);
      const orderPublicId = response.data.orderPublicId;
      router.replace(`/checkout/success/${orderPublicId}`);
    } catch (error) {
      const newErrors = {};
      newErrors.order = error.response.data.message;
      setErrors(newErrors);
    }

    setLoading(false);
  }

  return (
    <form className={styles.checkoutForm} onSubmit={handleSubmit}>
      {errors?.order && <p className="errorBanner">{errors.order}</p>}
      {availableTimes.length === 0 && !isLoadingTimes && <p className="errorBanner">Al momento non ci sono orari di ritiro disponibili.</p>}
      <fieldset>
        <div className={styles.doubleGroup}>
          <div>
            <Input
              label="Nome"
              id="name"
              type="text"
              name="name"
              error={!!errors?.name}
              onFocus={() => setErrors({ ...errors, name: null })}
              ref={nameRef}
              required
            />
            {errors?.name && <p className={styles.error}>{errors.name}</p>}
          </div>
          <div>
            <Input
              label="Cognome"
              id="surname"
              type="text"
              name="surname"
              error={!!errors?.surname}
              onFocus={() => setErrors({ ...errors, surname: null })}
              ref={surnameRef}
              required
            />
            {errors?.surname && (
              <p className={styles.error}>{errors.surname}</p>
            )}
          </div>
        </div>
        <div>
          <Select
            label="Orario di ritiro"
            id="time"
            name="time"
            options={availableTimes}
            ref={timeRef}
            error={!!errors?.time}
            required
            onFocus={() => setErrors({ ...errors, time: null })}
            disabled={availableTimes.length === 0}
          />
          {errors?.time && <p className={styles.error}>{errors.time}</p>}
        </div>
        <div>
          <Input
            label="Telefono"
            id="phone"
            type="tel"
            name="phone"
            onFocus={() => setErrors({ ...errors, phone: null })}
            error={!!errors?.phone}
            ref={phoneRef}
            required
          />
          {errors?.phone && <p className={styles.error}>{errors.phone}</p>}
        </div>
        <div>
          <Input
            label="Email"
            id="email"
            type="email"
            name="email"
            onFocus={() => setErrors({ ...errors, email: null })}
            error={!!errors?.email}
            ref={emailRef}
            required
          />
          {errors?.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div>
          <Checkbox
            label="Ho letto e accettato i termini e le condizioni"
            id="terms"
            name="terms"
            onClick={() => setErrors({ ...errors, terms: null })}
            ref={termsRef}
            required
          />
          {errors?.terms && <p className={styles.error}>{errors.terms}</p>}
        </div>
      </fieldset>
      <button type="submit" disabled={loading}>
        {loading ? <Loader button buttonLabel="INVIO..." /> : "Conferma ordine"}
      </button>
    </form>
  );
}
