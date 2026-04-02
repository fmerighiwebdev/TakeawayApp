"use client";

import { AlertCircle } from "lucide-react";

import CheckoutCouponField from "@/components/checkout/checkout-coupon-field";
import CheckoutFormFields from "@/components/checkout/checkout-form-fields";
import CheckoutSubmitState from "@/components/checkout/checkout-submit-state";
import { useCheckoutForm } from "@/components/checkout/use-checkout-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CheckoutForm({
  pickupTimes,
  tenantFeatures,
  appliedDiscount,
  setAppliedDiscount,
}) {
  const {
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
  } = useCheckoutForm({
    pickupTimes,
    tenantFeatures,
    appliedDiscount,
    setAppliedDiscount,
  });

  return (
    <form className="flex flex-col gap-6 lg:gap-8" onSubmit={handleSubmit}>
      {errors?.order && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Errore durante l&apos;invio dell&apos;ordine.</AlertTitle>
          <AlertDescription>
            <p>{errors.order}</p>
          </AlertDescription>
        </Alert>
      )}

      {availableTimes.length === 0 && !isLoadingTimes && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Al momento non ci sono orari di ritiro disponibili.</AlertTitle>
          <AlertDescription>
            <p>Purtroppo non è più possibile effettuare ordini per oggi.</p>
          </AlertDescription>
        </Alert>
      )}

      <CheckoutFormFields
        form={form}
        errors={errors}
        availableTimes={availableTimes}
        onFieldChange={handleFieldChange}
        onTimeChange={handleTimeChange}
        onTermsChange={handleTermsChange}
      >
        <CheckoutCouponField
          visible={couponVisible}
          form={form}
          errors={errors}
          appliedDiscount={appliedDiscount}
          onFieldChange={handleFieldChange}
          onCouponBlur={handleCouponBlur}
          onApplyCoupon={validateCoupon}
        />
      </CheckoutFormFields>

      <CheckoutSubmitState loading={loading} />
    </form>
  );
}
