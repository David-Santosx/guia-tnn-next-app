"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, UploadCloud, X, Calendar } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface AdFormProps {
  onSubmit: (data: {
    title: string;
    imageUrl: string;
    position: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
  }) => Promise<void>;
  initialData?: {
    id?: string;
    title: string;
    imageUrl: string;
    position: number;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
  };
  isSubmitting?: boolean;
  onClose: () => void;
}

export default function AdForm({ onSubmit, initialData, isSubmitting = false, onClose }: AdFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [position, setPosition] = useState(initialData?.position || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error('Por favor, faça upload de uma imagem');
      return;
    }
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error('A data de início não pode ser posterior à data de término');
      return;
    }
    
    try {
      await onSubmit({ 
        title, 
        imageUrl, 
        position, 
        isActive,
        startDate,
        endDate
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/anuncios/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Adicionar/Editar Anúncio
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Posição
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
            >
              <option value={0}>Topo</option>
              <option value={1}>Lateral Esquerda</option>
              <option value={2}>Lateral Direita</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={isActive ? "true" : "false"}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-gray-300 mb-1 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-1.5 text-brand-orange" />
              Data de Início
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-gray-300 mb-1 flex items-center"
            >
              <Calendar className="w-4 h-4 mr-1.5 text-brand-orange" />
              Data de Término
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Imagem
            </label>
            {!imageUrl ? (
              <div
                {...getRootProps()}
                className={`flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10 ${
                  isDragActive
                    ? "border-brand-orange bg-brand-orange/5"
                    : "hover:border-gray-500 hover:bg-gray-700/30"
                } transition-colors duration-200`}
              >
                <div className="text-center self-center">
                  <input {...getInputProps()} />
                  {isUploading ? (
                    <Loader2 className="mx-auto h-12 w-12 text-brand-orange animate-spin" />
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="mt-4 flex text-sm leading-6 text-gray-400">
                    <span className="relative cursor-pointer font-semibold text-brand-orange hover:text-brand-orange/80 transition-colors duration-200">
                      {isDragActive
                        ? "Solte a imagem aqui"
                        : "Faça upload de uma imagem"}
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-gray-500 mt-2">
                    PNG, JPG, JPEG ou GIF
                  </p>
                  <ul className="text-xs leading-5 text-gray-500 mt-1 list-disc list-inside">
                    <li>Topo: 728 x 90 px</li>
                    <li>Lateral: 250 x 600 px</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="relative mt-2 rounded-lg overflow-hidden border border-gray-600 flex flex-col">
                <div className="relative flex-grow min-h-[200px]">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-3 bg-gray-700 border-t border-gray-600">
                  <p className="text-xs text-gray-400 truncate mb-2">
                    {imageUrl.split("/").pop()}
                  </p>
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="w-full flex items-center justify-center py-1.5 px-3 bg-red-900/30 text-red-300 rounded hover:bg-red-900/50 transition-colors"
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Remover imagem
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isUploading}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors text-sm font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
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