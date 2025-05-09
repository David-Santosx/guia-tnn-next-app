import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface Event {
  imageUrl: string | StaticImport;
  id: string;
  title: string;
  description: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  image: string;
  createdAt: string;
  createdBy: string;
}