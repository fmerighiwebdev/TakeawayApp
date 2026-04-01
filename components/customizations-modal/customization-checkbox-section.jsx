"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function CustomizationCheckboxSection({
  value,
  title,
  options,
  selectedItems,
  onToggle,
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
        <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
          {options.map((option) => {
            const isSelected = selectedItems.some((item) => item.id === option.id);

            return (
              <li key={option.id}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`${value}-${option.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => onToggle(checked, option)}
                  />
                  <Label
                    htmlFor={`${value}-${option.id}`}
                    className={`cursor-pointer text-lg text-(--muted-text) ${
                      isSelected ? "font-bold" : ""
                    }`}
                  >
                    {renderOptionLabel(option, isSelected)}
                  </Label>
                </div>
              </li>
            );
          })}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
