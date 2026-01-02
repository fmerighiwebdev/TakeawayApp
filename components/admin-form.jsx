"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Spinner } from "./ui/spinner";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

export default function AdminForm({ tenantId }) {
  const router = useRouter();

  const [form, setForm] = useState({
    user: "",
    password: "",
  });

  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  function clearFieldError(field) {
    if (!errors) return;
    if (!errors[field] && !errors.credentials) return;

    const newErrors = { ...errors };
    delete newErrors[field];
    delete newErrors.credentials;
    setErrors(newErrors);
  }

  function validateForm() {
    const newErrors = {};

    if (!form.user.trim()) {
      newErrors.user = "L'utente è obbligatorio.";
    }

    if (!form.password.trim()) {
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

    try {
      await axios.post("/api/admin/login", {
        user: form.user,
        password: form.password,
        tenantId,
      });

      router.push("/dashboard");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Credenziali non valide. Riprova.";
      setErrors({ credentials: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errors?.credentials && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>{errors.credentials}</AlertTitle>
              <AlertDescription>
                Controlla il nome utente e la password e riprova.
              </AlertDescription>
            </Alert>
          )}

          {/* Utente */}
          <div>
            <Label
              htmlFor="user"
              className={`text-md md:text-lg text-(--muted-text) gap-0.5 ${
                errors?.user ? "text-red-600" : ""
              }`}
            >
              Utente
            </Label>
            <Input
              id="user"
              name="user"
              type="text"
              value={form.user}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, user: e.target.value }));
                clearFieldError("user");
              }}
              aria-invalid={!!errors?.user}
              aria-describedby={errors?.user ? "user-error" : undefined}
            />
            {errors?.user && (
              <p id="user-error" className="text-sm text-red-500">
                {errors.user}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label
              htmlFor="password"
              className={`text-md md:text-lg text-(--muted-text) gap-0.5 ${
                errors?.password ? "text-red-600" : ""
              }`}
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }));
                clearFieldError("password");
              }}
              aria-invalid={!!errors?.password}
              aria-describedby={errors?.password ? "password-error" : undefined}
            />
            {errors?.password && (
              <p id="password-error" className="text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <button
            type="submit"
            className="text-lg btn btn-primary w-full mt-6"
            disabled={loading}
          >
            {loading ? <Spinner className="mr-2 h-4 w-4" /> : "Accedi"}
          </button>
        </CardFooter>
      </form>
    </Card>
  );
}
