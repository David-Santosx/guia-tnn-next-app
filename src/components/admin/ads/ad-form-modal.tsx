"use client";

import { useState } from "react";
import AdForm from "./ad-form";

interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  position: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

interface AdFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdSubmitted: () => void;
  ad?: Advertisement;
}

export function AdFormModal({ isOpen, onClose, onAdSubmitted, ad }: AdFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    title: string;
    imageUrl: string;
    position: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
  }) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const url = ad ? `/api/anuncios/${ad.id}` : '/api/anuncios';
      const method = ad ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar anúncio');
      }

      onAdSubmitted();
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AdForm
      onSubmit={handleSubmit}
      initialData={ad}
      isSubmitting={isSubmitting}
      onClose={onClose}
    />
  );
}