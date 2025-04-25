import { useState } from "react";
import { Loader2, X, AlertTriangle } from "lucide-react";

interface DeletePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  photoTitle: string;
}

export function DeletePhotoModal({
  isOpen,
  onClose,
  onConfirm,
  photoTitle,
}: DeletePhotoModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao excluir a foto."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Confirmar Exclusão
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-red-900/30 p-3 rounded-full">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                Excluir esta foto?
              </h3>
              <p className="text-gray-300 mb-4">
                Você está prestes a excluir a foto{" "}
                <span className="font-semibold">&quot;{photoTitle}&quot;</span>. Esta ação
                não pode ser desfeita.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-700 text-red-300 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Excluir"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
