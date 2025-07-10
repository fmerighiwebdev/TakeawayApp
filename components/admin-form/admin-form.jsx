"use client";

import styles from "./admin-form.module.css";

import { useRef, useState, useEffect } from "react";
import axios from "axios";

import Input from "../input/input";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
import Loader from "../loader/loader";

export default function AdminForm() {
  const userRef = useRef();
  const passwordRef = useRef();

  const router = useRouter();

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    if (!token) return;

    async function validateToken() {
      try {
        const res = await axios.post("/api/validate-token", { token });
        router.push("/admin/dashboard");
      } catch {
        setErrors({
          credentials: "Effettua nuovamente l'accesso.",
        });
        localStorage.removeItem("auth-token");
      }
    }

    validateToken();
  }, []);

  function validateForm() {
    const newErrors = {};

    if (!userRef.current.value.trim()) {
      newErrors.user = "L'utente è obbligatorio.";
    }

    if (!passwordRef.current.value.trim()) {
      newErrors.password = "La password è obbligatoria.";
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

    const user = userRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await axios.post("/api/admin/login", { user, password });
      const authToken = response.data.authToken;
      localStorage.setItem("auth-token", authToken);
      router.push("/admin/dashboard");
      setLoading(false);
    } catch (error) {
      const newErrors = {};
      newErrors.credentials = error.response.data.message;
      setErrors(newErrors);
      setLoading(false);
    }
  }

  return (
    <form className={styles.adminForm} onSubmit={handleSubmit}>
      {errors?.credentials && (
        <p className={styles.errorBanner}>{errors.credentials}</p>
      )}
      <div className={styles.inputField}>
        <Input
          label="Utente"
          id="user"
          type="text"
          name="user"
          ref={userRef}
          onFocus={() =>
            setErrors({ ...errors, user: null, credentials: null })
          }
          error={errors?.user}
        />
        {errors?.user && <p className={styles.error}>{errors.user}</p>}
      </div>
      <div className={styles.inputField}>
        <Input
          label="Password"
          id="password"
          type="password"
          name="password"
          ref={passwordRef}
          onFocus={() =>
            setErrors({ ...errors, password: null, credentials: null })
          }
          error={errors?.password}
        />
        {errors?.password && <p className={styles.error}>{errors.password}</p>}
      </div>
      <button type="submit" disabled={loading}>{loading ? <Loader button buttonLabel="ACCESSO..." /> : "Accedi"}</button>
    </form>
  );
}
