"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Event } from "@/types/event";
import { uploadGalleryImage } from "@/lib/supabase/storage";

const eventSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Título deve ter pelo menos 3 caracteres." }),
  description: z
    .string()
    .min(10, { message: "Descrição deve ter pelo menos 10 caracteres." }),
  date: z.string().min(1, { message: "Data é obrigatória" }),
  time: z.string().min(1, { message: "Horário é obrigatório" }),
  location: z
    .string()
    .min(3, { message: "Local deve ter pelo menos 3 caracteres." }),
  imageFile: z
    .any()
    .refine((files) => files?.length === 1, "Enviar apenas uma imagem.")
    .refine(
      (files) => files?.[0]?.type?.startsWith("image/"),
      "Arquivo deve ser uma imagem."
    )
    .refine(
      (files) => files?.[0]?.size <= 15 * 1024 * 1024,
      "Imagem deve ter no máximo 15MB."
    ),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: () => void;
  event?: Event;
}

export function EventFormModal({
  isOpen,
  onClose,
  onEventAdded,
  event,
}: EventFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      date: event?.date ? new Date(event.date).toISOString().split("T")[0] : "",
      time: event?.date ? new Date(event.date).toTimeString().slice(0, 5) : "",
      location: event?.location || "",
      imageFile: event?.image || "",
    },
  });

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let imageUrl = '';
      if (data.imageFile && data.imageFile.length > 0) {
        imageUrl = await uploadGalleryImage(data.imageFile[0]);
      }

      const dateTime = new Date(`${data.date}T${data.time}:00`);

      const eventData = {
        title: data.title,
        description: data.description,
        date: dateTime.toISOString(),
        location: data.location,
        imageUrl,
      };

      const response = await fetch("/api/eventos", {
        method: event ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          event ? { ...eventData, id: event.id } : eventData
        ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao salvar evento.");
      }

      onEventAdded();
      handleClose();
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Ocorreu um erro desconhecido."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSubmitError(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleImageSelect = (file: File | null) => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // No campo de imagem, atualizar o previewUrl ao selecionar um arquivo
  <input
    id="imageFile"
    type="file"
    {...register("imageFile")}
    accept="image/*"
    className="sr-only"
    onChange={(e) => handleImageSelect(e.target.files?.[0] as File)}
  />;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            {event ? "Editar Evento" : "Adicionar Novo Evento"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {submitError && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-3 py-2 rounded-md text-sm">
              {submitError}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Título *
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Descrição *
            </label>
            <textarea
              id="description"
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Data *
              </label>
              <input
                id="date"
                type="date"
                {...register("date")}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Horário *
              </label>
              <input
                id="time"
                type="time"
                {...register("time")}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
              />
              {errors.time && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Local *
            </label>
            <input
              id="location"
              type="text"
              {...register("location")}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-400">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="imageFile"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Arquivo da Imagem *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto h-24 w-auto rounded object-contain"
                  />
                ) : (
                  <>
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
                  </>
                )}

                <div className="flex text-sm text-gray-400 justify-center">
                  <label
                    htmlFor="imageFile"
                    className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-brand-orange hover:text-brand-orange/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-brand-orange px-1"
                  >
                    <span>Carregar um arquivo</span>
                    <input
                      id="imageFile"
                      type="file"
                      {...register('imageFile')}
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleImageSelect(e.target.files?.[0] as File)}
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WEBP até 15MB
                </p>
              </div>
            </div>
            {errors.imageFile && (
              <p className="mt-1 text-xs text-red-400">
                {String(errors.imageFile.message)}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white mr-2"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center px-4 py-2 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-md min-w-[100px]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : event ? (
                "Salvar"
              ) : (
                "Adicionar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
