import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, X, UploadCloud } from 'lucide-react';
import { PhotoCategory } from '@/types/photo';

// Updated schema reflecting Prisma model (and API schema)
const photoSchema = z.object({
  title: z.string().min(3, { message: 'Título deve ter pelo menos 3 caracteres.' }),
  description: z.string().optional(),
  category: z.enum(['NATUREZA', 'LOCAIS', 'EVENTOS', 'GERAL'] as const),
  photographer: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
  imageFile: z
    .any()
    .refine((files) => files?.length === 1, 'É necessário enviar uma imagem.')
    .refine((files) => files?.[0]?.type?.startsWith('image/'), 'Arquivo deve ser uma imagem.')
    .refine((files) => files?.[0]?.size <= 15 * 1024 * 1024, 'Imagem deve ter no máximo 15MB.'),
});

type PhotoFormData = z.infer<typeof photoSchema>;

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoAdded: () => void;
}

export function AddPhotoModal({ isOpen, onClose, onPhotoAdded }: AddPhotoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PhotoFormData>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
        title: "",
        description: "",
        category: undefined,
        photographer: "",
        location: "",
        date: "",
        imageFile: undefined,
    }
  });

  // Atualiza o valor do formulário quando a categoria é selecionada
  useEffect(() => {
    if (selectedCategory) {
      setValue('category', selectedCategory);
    }
  }, [selectedCategory, setValue]);

  const imageFile = watch('imageFile');
  useEffect(() => {
    let objectUrl: string | null = null;
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageFile]);

  const onSubmit = async (data: PhotoFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const file = data.imageFile[0];

      // --- CHANGE: Upload via API route ---
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/galeria/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Falha ao fazer upload da imagem.');
      }

      const { imageUrl } = await uploadResponse.json();


      const dateISO = data.date ? new Date(data.date).toISOString() : '';

      const response = await fetch('/api/galeria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          photographer: data.photographer,
          location: data.location,
          date: dateISO,
          imageUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar dados da foto no banco.');
      }

      onPhotoAdded();
      handleClose();

    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelect = (category: PhotoCategory) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleClose = () => {
    reset();
    setSelectedCategory(null);
    setSubmitError(null);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* ... Modal Header ... */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Adicionar Nova Foto</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* ... Submit Error Display ... */}
          {submitError && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-3 py-2 rounded-md text-sm">
              {submitError}
            </div>
          )}

          {/* --- Form Fields --- */}
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Título *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
            />
            {/* No error display needed for optional field unless specific validation added */}
          </div>

          {/* Categoria - Seletor de Botões */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {(['NATUREZA', 'LOCAIS', 'EVENTOS', 'GERAL'] as const).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category === 'NATUREZA' ? 'Natureza' :
                   category === 'LOCAIS' ? 'Locais' : 
                   category === 'EVENTOS' ? 'Eventos' : 'Geral'}
                </button>
              ))}
            </div>
            <input type="hidden" {...register('category')} />
            {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>}
          </div>

          {/* Photographer (New) */}
          <div>
            <label htmlFor="photographer" className="block text-sm font-medium text-gray-300 mb-1">
              Fotógrafo(a)
            </label>
            <input
              id="photographer"
              type="text"
              {...register('photographer')}
              placeholder="Nome do fotógrafo(a)"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
            />
          </div>

          {/* Location (New) */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
              Localização
            </label>
            <input
              id="location"
              type="text"
              {...register('location')}
              placeholder="Onde a foto foi tirada"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
            />
          </div>

          {/* Date (New) */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
              Data da Foto
            </label>
            <input
              id="date"
              type="datetime-local"
              {...register('date')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-brand-orange focus:border-brand-orange"
              style={{ colorScheme: 'dark' }}
            />
             {/* Add error display if specific date validation is needed */}
          </div>


          {/* Image File Input */}
          <div>
             <label htmlFor="imageFile" className="block text-sm font-medium text-gray-300 mb-1">
              Arquivo da Imagem *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Preview" className="mx-auto h-24 max-h-24 w-auto rounded object-contain" />
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
                )}
                <div className="flex text-sm text-gray-400 justify-center">
                  <label
                    htmlFor="imageFile"
                    className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-brand-orange hover:text-brand-orange/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-brand-orange px-1"
                  >
                    <span>Carregar um arquivo</span>
                    <input id="imageFile" type="file" className="sr-only" {...register('imageFile')} accept="image/*" />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP até 15MB</p>
              </div>
            </div>
            {errors.imageFile && <p className="mt-1 text-xs text-red-400">{String(errors.imageFile.message)}</p>}
          </div>
          {/* --- End Form Fields --- */}

          {/* ... Modal Footer Buttons ... */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors text-sm font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-orange text-white rounded-md hover:bg-brand-orange/90 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Adicionar Foto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}