import { CommerceForm } from "./commerce-form";

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

export function CommerceFormModal({
  isOpen,
  onClose,
  onCommerceAdded,
  commerce,
}: CommerceFormModalProps) {
  return (
    <CommerceForm
      isOpen={isOpen}
      onClose={onClose}
      onCommerceAdded={onCommerceAdded}
      commerce={commerce}
    />
  );
}