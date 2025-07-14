"use client";

import Link from "next/link";
import Image from "next/image";
import { Settings, Mail, Phone, MapPin, Building2 } from "lucide-react";
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
      title: "Institucional",
      links: [
        { text: "Sobre Nós", href: "/sobre-nos" },
        { text: "Anuncie Conosco", href: "/anuncie-aqui" },
        { text: "Termos de Uso", href: "/legal/termos" },
        { text: "Política de Privacidade", href: "/legal/privacidade" },
      ],
    },
    {
      title: "Navegação",
      links: [
        { text: "Sobre a Cidade", href: "/sobre" },
        { text: "Galeria de Fotos", href: "/galeria" },
        { text: "Eventos", href: "/eventos" },
        { text: "Comércio Local", href: "/comercio" },
      ],
    },
    {
      title: "Contato",
      links: [
        {
          text: "guiatnn@hotmail.com",
          href: "mailto:guiatnn@hotmail.com",
          icon: Mail,
        },
        { text: "(66) 99911-8905", href: "tel:+5566999118905", icon: Phone },
        { text: "Terra Nova do Norte, MT", href: "", icon: MapPin },
        {
          text: "CNPJ: 60.742.446/0001-13",
          href: "",
          icon: Building2,
        },
      ],
    },
  ];

  return (
    <footer className="bg-brand-blue text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Logo and description */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="./brand/mt9-logo.svg"
                width={280}
                height={76}
                alt="Logo MT 9"
                className="w-36 md:w-40 bg-white px-3 rounded-sm"
              />
            </Link>
            <p className="text-gray-300 text-xs max-w-xs">
              Notícias, eventos, comércio local e muito mais.
            </p>
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
          <div className="flex flex-col md:flex-row items-center gap-2">
            <Credits variant="dark" />
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Dashboard link */}
            <Link
              href="/admin"
              className="flex items-center border-1 rounded-full p-1 text-gray-300 hover:text-white transition-colors"
              aria-label="Painel administrativo"
            >
              <Settings size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}