"use client";

import { useState } from "react";

export function useCustomizationSelection(customizations) {
  const [selectedDough, setSelectedDough] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedRemovals, setSelectedRemovals] = useState([]);
  const [selectedCookingOption, setSelectedCookingOption] = useState(null);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState(null);

  function handleExtrasToggle(checked, extraItem) {
    if (checked) {
      setSelectedExtras((currentExtras) => [...currentExtras, extraItem]);
      return;
    }

    setSelectedExtras((currentExtras) =>
      currentExtras.filter((extra) => extra?.id !== extraItem.id),
    );
  }

  function handleRemovalsToggle(checked, removalItem) {
    if (checked) {
      setSelectedRemovals((currentRemovals) => [...currentRemovals, removalItem]);
      return;
    }

    setSelectedRemovals((currentRemovals) =>
      currentRemovals.filter((removal) => removal?.id !== removalItem.id),
    );
  }

  function handleDoughChange(value) {
    const dough = customizations?.doughs?.find((item) => String(item.id) === value);
    setSelectedDough(dough ?? null);
  }

  function handleCookingChange(value) {
    const option = customizations?.cookings?.find((item) => String(item.id) === value);
    setSelectedCookingOption(option ?? null);
  }

  function handleSpiceChange(value) {
    const option = customizations?.spiceLevels?.find((item) => String(item.id) === value);
    setSelectedSpiceLevel(option ?? null);
  }

  return {
    selectedDough,
    selectedExtras,
    selectedRemovals,
    selectedCookingOption,
    selectedSpiceLevel,
    selectedVariationsCount:
      (selectedDough ? 1 : 0) +
      selectedExtras.length +
      selectedRemovals.length +
      (selectedCookingOption ? 1 : 0) +
      (selectedSpiceLevel ? 1 : 0),
    handleDoughChange,
    handleExtrasToggle,
    handleRemovalsToggle,
    handleCookingChange,
    handleSpiceChange,
  };
}
