"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function CheckoutFormFields({
  form,
  errors,
  availableTimes,
  onFieldChange,
  onTimeChange,
  onTermsChange,
  children,
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <Label
            htmlFor="name"
            className={`text-md gap-0.5 text-(--muted-text) md:text-lg ${
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
            onChange={(event) => onFieldChange("name", event.target.value)}
            aria-invalid={!!errors?.name}
            aria-describedby={errors?.name ? "name-error" : undefined}
          />
          {errors?.name && (
            <p id="name-error" className="text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <Label
            htmlFor="surname"
            className={`text-md gap-0.5 text-(--muted-text) md:text-lg ${
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
            onChange={(event) => onFieldChange("surname", event.target.value)}
            aria-invalid={!!errors?.surname}
            aria-describedby={errors?.surname ? "surname-error" : undefined}
          />
          {errors?.surname && (
            <p id="surname-error" className="text-sm text-red-600">
              {errors.surname}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label
            htmlFor="time"
            className={`text-md gap-0.5 text-(--muted-text) md:text-lg ${
              errors?.time ? "text-red-600" : ""
            }`}
          >
            Orario di ritiro<span className="text-primary">*</span>
          </Label>
          <Select
            value={form.time}
            onValueChange={onTimeChange}
            disabled={availableTimes.length === 0}
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
            <p id="time-error" className="text-sm text-red-600">
              {errors.time}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label
          htmlFor="phone"
          className={`text-md gap-0.5 text-(--muted-text) md:text-lg ${
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
          onChange={(event) => onFieldChange("phone", event.target.value)}
          aria-invalid={!!errors?.phone}
          aria-describedby={errors?.phone ? "phone-error" : undefined}
        />
        {errors?.phone && (
          <p id="phone-error" className="text-sm text-red-600">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <Label
          htmlFor="email"
          className={`text-md gap-0.5 text-(--muted-text) md:text-lg ${
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
          onChange={(event) => onFieldChange("email", event.target.value)}
          aria-invalid={!!errors?.email}
          aria-describedby={errors?.email ? "email-error" : undefined}
        />
        {errors?.email && (
          <p id="email-error" className="text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="notes" className="text-md text-(--muted-text) md:text-lg">
          Informazioni aggiuntive per l&apos;ordine{" "}
          <span className="text-xs text-(--muted-light-text)">(facoltativo)</span>
        </Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          value={form.notes}
          onChange={(event) => onFieldChange("notes", event.target.value)}
        />
      </div>

      {children}

      <div className="mt-4">
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={form.terms}
            onCheckedChange={onTermsChange}
            aria-invalid={!!errors?.terms}
            aria-describedby={errors?.terms ? "terms-error" : undefined}
          />
          <Label htmlFor="terms" className="cursor-pointer gap-0.5 text-(--muted-text)">
            Dichiaro di aver preso visione della privacy policy e di accettare
            i termini e le condizioni del servizio.
            <span className="text-primary">*</span>
          </Label>
        </div>
        {errors?.terms && (
          <p id="terms-error" className="text-sm text-red-600">
            {errors.terms}
          </p>
        )}
      </div>
    </fieldset>
  );
}
