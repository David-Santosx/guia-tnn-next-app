"use client"
import { ImagesIcon, InfoIcon, MegaphoneIcon, MenuIcon, StoreIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navigationItems = [
  {
    icon: InfoIcon,
    text: "Sobre a Cidade",
    href: "/sobre",
  },
  {
    icon: ImagesIcon,
    text: "Galeria de Fotos",
    href: "/galeria",
  },
  {
    icon: MegaphoneIcon,
    text: "Eventos",
    href: "/eventos",
  },
  {
    icon: StoreIcon,
    text: "Comércios Locais",
    href: "/comercios",
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <div className="w-full h-2 bg-brand-orange fixed top-0 left-0 right-0 z-50"></div>
      <header className="w-full py-2.5 px-6 md:px-8 lg:px-16 xl:px-24 flex items-center justify-between h-[5.25rem] fixed top-2 left-0 right-0 z-40 bg-white/30 backdrop-blur-md shadow-sm">
        <Link
          href="/"
          className="transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/brand/guia-tnn-logo.svg"
            width={200}
            height={63}
            alt="Logo GUIA TNN"
            className="w-36 md:w-40 lg:w-48 xl:w-52"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-3 lg:gap-5 xl:gap-8">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li
                  key={index}
                  className="text-sm lg:text-base px-2 md:px-3 lg:px-4 py-2 lg:py-2.5 rounded-md item-hover"
                >
                  <Link
                    href={item.href}
                    className="flex items-center font-medium whitespace-nowrap"
                  >
                    <Icon className="w-4 lg:w-5 mr-1.5 lg:mr-2 text-brand-blue" />
                    <span className="hidden lg:inline">{item.text}</span>
                    <span className="lg:hidden">{item.text.split(" ")[0]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-brand-blue p-2 rounded-full hover:bg-brand-blue/10 transition-colors"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-[5.25rem] left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50 md:hidden">
            <nav className="py-2">
              <ul className="flex flex-col">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={index}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-brand-blue/5 transition-colors"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center font-medium text-base px-6 py-3"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 mr-3 text-brand-blue" />
                        {item.text}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        )}
      </header>
      <div className="h-[calc(5.25rem+0.5rem)] w-full"></div>
    </>
  );
}