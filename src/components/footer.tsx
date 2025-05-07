"use client";

import Link from "next/link";
import Image from "next/image";
import { Settings, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Credits } from "@/components/credits";

interface FooterLink {
  text: string;
  href: string;
  icon?: React.ElementType;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const FooterLink = ({ link }: { link: FooterLink }) => {
  const Icon = link.icon;
  
  return (
    <li className="mb-2">
      <Link 
        href={link.href} 
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
      >
        {Icon && <Icon size={16} />}
        <span>{link.text}</span>
      </Link>
    </li>
  );
};

const FooterSection = ({ section }: { section: FooterSection }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 mb-8 md:mb-0">
      <h3 className="text-white font-semibold mb-4 text-lg">{section.title}</h3>
      <ul>
        {section.links.map((link, index) => (
          <FooterLink key={index} link={link} />
        ))}
      </ul>
    </div>
  );
};

export default function Footer() {
  
  const footerSections: FooterSection[] = [
    {
      title: "Navegação",
      links: [
        { text: "Sobre a Cidade", href: "/sobre" },
        { text: "Galeria de Fotos", href: "/galeria" },
        { text: "Eventos", href: "/eventos" },
        { text: "Comércio Local", href: "/comercio" },
      ]
    },
    {
      title: "Contato",
      links: [
        { text: "contato@guiatnn.com.br", href: "mailto:contato@guiatnn.com.br", icon: Mail },
        { text: "(66) 9999-9999", href: "tel:+556699999999", icon: Phone },
        { text: "Terra Nova do Norte, MT", href: "/localizacao", icon: MapPin },
      ]
    },
    {
      title: "Redes Sociais",
      links: [
        { text: "Facebook", href: "https://facebook.com", icon: Facebook },
        { text: "Instagram", href: "https://instagram.com", icon: Instagram },
        { text: "Twitter", href: "https://twitter.com", icon: Twitter },
      ]
    },
  ];

  return (
    <footer className="bg-brand-blue text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row">
          {/* Logo and description */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="./brand/guia-tnn-logo.svg"
                width={180}
                height={56}
                alt="Logo GUIA TNN"
                className="w-36 md:w-40 bg-white px-3 rounded-sm"
              />
            </Link>
            <p className="text-gray-300 text-sm">
              Seu guia completo sobre Terra Nova do Norte, Mato Grosso.
            </p>

            {/* Dashboard link */}
            <Link
              href="/admin"
              className="mt-4 inline-flex items-center text-gray-300 hover:text-white transition-colors"
              aria-label="Painel administrativo"
            >
              <Settings size={16} className="mr-2" />
              <span className="text-sm">Dashboard</span>
            </Link>
          </div>

          {/* Footer sections */}
          {footerSections.map((section, index) => (
            <FooterSection key={index} section={section} />
          ))}
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <Credits variant="dark" />
          <div className="flex space-x-4">
            <Link
              href="/legal/termos"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Termos de Uso
            </Link>
            <Link
              href="/legal/privacidade"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}