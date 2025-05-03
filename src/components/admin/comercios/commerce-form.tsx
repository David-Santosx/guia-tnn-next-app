"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { z } from "zod";

interface Commerce {
  id: string;
  name: string;
  description: string;
  phone: string;
  rate: number;
  owner: string;
  hours: Record<string, string>;
  imageUrl: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CommerceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommerceAdded: () => void;
  commerce?: Commerce;
}

const commerceSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  rate: z.number().min(0).max(5),
  owner: z.string().min(3, { message: "Nome do proprietário deve ter pelo menos 3 caracteres" }),
  location: z.string().min(5, { message: "Localização deve ter pelo menos 5 caracteres" }),
});

export function CommerceForm({
  isOpen,
  onClose,
  onCommerceAdded,
  commerce,
}: CommerceFormModalProps) {
  const [formData, setFormData] = useState<Partial<Commerce>>({
    name: "",
    description: "",
    phone: "",
    rate: 0,
    owner: "",
    hours: {},
    imageUrl: "",
    location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [daysOfWeek] = useState([
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo",
  ]);
  const [hours, setHours] = useState<Record<string, string>>({});

  useEffect(() => {
    if (commerce) {
      setFormData({
        name: commerce.name || "",
        description: commerce.description || "",
        phone: commerce.phone || "",
        rate: commerce.rate || 0,
        owner: commerce.owner || "",
        location: commerce.location || "",
        imageUrl: commerce.imageUrl || "",
      });
      setImagePreview(commerce.imageUrl || "");
      setHours(commerce.hours || {});
    } else {
      resetForm();
    }
  }, [commerce, isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      phone: "",
      rate: 0,
      owner: "",
      hours: {},
      imageUrl: "",
      location: "",
    });
    setImageFile(null);
    setImagePreview("");
    setHours({});
    setErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFormData((prev) => ({ ...prev, rate: value }));
  };

  const handleHoursChange = (day: string, value: string) => {
    setHours((prev) => ({ ...prev, [day]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    try {
      commerceSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          const field = error.path[0] as string;
          newErrors[field] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Preparar dados do formulário com as horas de funcionamento
      const formDataWithHours = {
        ...formData,
        hours,
      };
      
      let imageUrl = formData.imageUrl;
      
      // Se tiver uma nova imagem, fazer upload primeiro
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", imageFile);
        
        const uploadResponse = await fetch("/api/comercios/upload", {
          method: "POST",
          body: formDataUpload,
        });
        
        if (!uploadResponse.ok) {
          throw new Error("Falha ao fazer upload da imagem");
        }
        
          const uploadResult = await uploadResponse.json();
          console.log(uploadResult);
        imageUrl = uploadResult.imageUrl;
      }
      
      // Determinar se é uma criação ou atualização
      const url = commerce?.id 
        ? `/api/comercios/${commerce.id}` 
        : "/api/comercios";
      
      const method = commerce?.id ? "PUT" : "POST";
      
      // Após obter a URL da imagem do upload
      console.log("URL da imagem após upload:", imageUrl);
      
      // Antes de enviar os dados para a API
      const dataToSend = {
        ...formDataWithHours,
        imageUrl,
      };
      console.log("Dados completos enviados:", dataToSend);
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      console.log(response.bodyUsed)
      
      if (!response.ok) {
        throw new Error("Falha ao salvar comércio");
      }
      
      onCommerceAdded();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar comércio:", error);
      alert(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {commerce ? "Editar Comércio" : "Adicionar Comércio"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome do Comércio*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  required
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Proprietário*
                </label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  required
                />
                {errors.owner && (
                  <p className="text-red-400 text-xs mt-1">{errors.owner}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Telefone*
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  required
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Avaliação (0-5)*
                </label>
                <input
                  type="number"
                  name="rate"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rate}
                  onChange={handleRateChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  required
                />
                {errors.rate && (
                  <p className="text-red-400 text-xs mt-1">{errors.rate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Localização*
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  required
                />
                {errors.location && (
                  <p className="text-red-400 text-xs mt-1">{errors.location}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descrição*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  required
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Imagem
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-700 border-2 border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-500 focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <Upload size={22} className="text-gray-400" />
                        <span className="font-medium text-gray-400">
                          Selecionar imagem
                        </span>
                      </span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="relative w-32 h-32 rounded-md overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Horário de Funcionamento
                </label>
                <div className="space-y-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400 w-32">{day}:</span>
                      <input
                        type="text"
                        value={hours[day] || ""}
                        onChange={(e) => handleHoursChange(day, e.target.value)}
                        placeholder="Ex: 08:00 - 18:00"
                        className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 transition-colors flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}