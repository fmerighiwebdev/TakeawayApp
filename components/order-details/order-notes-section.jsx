"use client";

export default function OrderNotesSection({ notes }) {
  if (!notes) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl text-(--muted-text) md:text-4xl">
          Note aggiuntive
        </h2>
        <div className="separator-horizontal"></div>
      </div>
      <p className="text-md text-(--muted-light-text) md:text-lg">{notes}</p>
    </div>
  );
}
