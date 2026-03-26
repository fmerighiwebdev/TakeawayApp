"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function getCurrentMonthLabel() {
  return new Intl.DateTimeFormat("it-IT", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(new Date());
}

function getDownloadFileName() {
  const now = new Date();

  const year = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    year: "numeric",
  }).format(now);

  const month = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    month: "2-digit",
  }).format(now);

  return `ordini-${year}-${month}.csv`;
}

export default function ExportOrdersCsv() {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const monthLabel = useMemo(() => getCurrentMonthLabel(), []);

  async function handleExport() {
    try {
      setIsExporting(true);

      const response = await fetch("/api/admin/orders/export-csv", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Export non riuscito");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const fileName = getDownloadFileName();

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(url);

      setOpen(false);
      toast.success("Esportazione CSV completata.");
    } catch (error) {
      console.error(error);
      toast.error("Si è verificato un errore durante l'esportazione.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn btn-primary">
          <Download size={20} />
          Esporta CSV
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Esportare il riepilogo ordini?</DialogTitle>
          <DialogDescription>
            Verrà scaricato il file CSV con gli ordini del mese di{" "}
            <span className="font-medium capitalize">{monthLabel}</span>.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isExporting}
          >
            Annulla
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? "Esportazione..." : "Conferma download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}