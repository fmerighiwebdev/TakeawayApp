"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CustomizationRadioSection({
  value,
  title,
  options,
  selectedOption,
  onValueChange,
  renderOptionLabel,
}) {
  if (!options?.some((option) => option?.id)) {
    return null;
  }

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="text-xl text-(--muted-text)">
        {title}
      </AccordionTrigger>
      <AccordionContent>
        <RadioGroup
          value={selectedOption ? String(selectedOption.id) : ""}
          onValueChange={onValueChange}
          className="gap-1"
        >
          {options.map((option) => (
            <div key={option.id} className="flex items-center gap-2 text-(--muted-text)">
              <RadioGroupItem value={String(option.id)} id={`${value}-${option.id}`} />
              <Label
                htmlFor={`${value}-${option.id}`}
                className={`cursor-pointer text-lg ${
                  selectedOption?.id === option.id ? "font-bold" : ""
                }`}
              >
                {renderOptionLabel(option, selectedOption?.id === option.id)}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </AccordionContent>
    </AccordionItem>
  );
}
