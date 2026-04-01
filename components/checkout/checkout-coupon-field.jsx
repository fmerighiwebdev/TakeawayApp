"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutCouponField({
  visible,
  form,
  errors,
  appliedDiscount,
  onFieldChange,
  onCouponBlur,
  onApplyCoupon,
}) {
  if (!visible) {
    return null;
  }

  return (
    <div>
      <Label
        htmlFor="coupon"
        className={`text-md gap-0.5 text-(--muted-text) md:text-lg ${
          errors?.coupon ? "text-red-600" : ""
        }`}
      >
        Hai un codice sconto?
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id="coupon"
          name="coupon"
          type="text"
          value={form.coupon}
          onChange={(event) => onFieldChange("coupon", event.target.value)}
          onBlur={onCouponBlur}
          aria-invalid={!!errors?.coupon}
          aria-describedby={errors?.coupon ? "coupon-error" : undefined}
        />
        <button className="btn btn-primary btn-sm" onClick={onApplyCoupon} type="button">
          Applica
        </button>
      </div>
      {errors?.coupon && (
        <p id="coupon-error" className="text-sm text-red-600">
          {errors.coupon}
        </p>
      )}
      {appliedDiscount && (
        <p className="mt-1 text-sm text-green-600">
          Codice sconto applicato: <strong>-{appliedDiscount.percent_off}%</strong> sul
          totale
        </p>
      )}
    </div>
  );
}
