"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OrderActionsPanel({
  orderId,
  publicDetails,
  status,
  onPickupTimeChange,
}) {
  const router = useRouter();

  const [completeOpen, setCompleteOpen] = useState(false);
  const [postponeOpen, setPostponeOpen] = useState(false);
  const [readyOpen, setReadyOpen] = useState(false);
  const [postponementTime, setPostponementTime] = useState("");

  const isWaiting = status === "In Attesa";
  const isReady = status === "Pronto";
  const canShowActions = !publicDetails && (isWaiting || isReady);
  const canShowExtraActions = !publicDetails && isWaiting;

  async function handleCompleteOrder() {
    try {
      await axios.patch(`/api/admin/orders/${orderId}`, {
        newStatus: "Completato",
      });

      toast.success("Ordine completato con successo!");
      router.replace("/admin/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePostponeTime() {
    try {
      await axios.patch(`/api/admin/orders/${orderId}`, {
        postponementTime,
      });

      toast.success("Orario di ritiro aggiornato con successo!");
      onPickupTimeChange(postponementTime);
      setPostponeOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleReadyOrder() {
    try {
      await axios.patch(`/api/admin/orders/${orderId}`, {
        newStatus: "Pronto",
      });

      toast.success("Notifica inviata al cliente!");
      setReadyOpen(false);
      router.replace("/admin/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  if (!canShowActions) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogTrigger asChild>
          <button className="btn btn-primary btn-sm">Completa ordine</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">
              Completa ordine n.{orderId}
            </DialogTitle>
            <div className="separator-horizontal"></div>
            <DialogDescription className="text-md">
              L&apos;azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <button type="button" className="btn btn-link">
                Annulla
              </button>
            </DialogClose>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCompleteOrder}
            >
              Conferma
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {canShowExtraActions ? (
        <>
          <Dialog open={readyOpen} onOpenChange={setReadyOpen}>
            <DialogTrigger asChild>
              <button className="btn btn-link btn-sm">
                Ordine pronto per il ritiro
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl text-primary">
                  Ordine n.{orderId} pronto per il ritiro
                </DialogTitle>
                <div className="separator-horizontal"></div>
                <DialogDescription className="text-md">
                  Premendo &quot;Conferma&quot; verrà inviato un messaggio al
                  cliente per informarlo che l&apos;ordine è pronto per il
                  ritiro.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <button type="button" className="btn btn-link">
                    Annulla
                  </button>
                </DialogClose>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleReadyOrder}
                >
                  Conferma
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={postponeOpen} onOpenChange={setPostponeOpen}>
            <DialogTrigger asChild>
              <button className="btn btn-link btn-sm">Posticipa orario ritiro</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl text-primary">
                  Nuovo orario ritiro ordine
                </DialogTitle>
                <div className="separator-horizontal"></div>
                <DialogDescription className="text-md">
                  Seleziona il nuovo orario di ritiro dell&apos;ordine:
                </DialogDescription>
              </DialogHeader>
              <div>
                <Input
                  type="time"
                  value={postponementTime}
                  onChange={(event) => setPostponementTime(event.target.value)}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <button type="button" className="btn btn-link">
                    Annulla
                  </button>
                </DialogClose>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePostponeTime}
                >
                  Conferma
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="flex items-center justify-center gap-1">
          <Bell className="size-4.5 text-(--muted-light-text)" strokeWidth={1.5} />
          <p className="text-sm text-(--muted-light-text)">Notificato</p>
        </div>
      )}
    </div>
  );
}
