'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/scroll-reveal';
import { 
  Users, 
  Target, 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ArrowRight,
  Calendar,
  Award
} from 'lucide-react';

export default function SobreNosPage() {
  const [activeTab, setActiveTab] = useState<'missao' | 'visao' | 'valores'>('missao');

  const teamMembers = [
    {
      name: 'David Santos',
      role: 'Fundador e CEO - Desenvolvimento e Design',
      bio: 'Fundador e CEO do Guia TNN, responsável pelo desenvolvimento e design da plataforma.',
      avatar: 'https://avatars.githubusercontent.com/u/193115016?v=4',
      },
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Fundação do Guia TNN',
      description: 'Inicío das ideias e protótipos de um site incial.',
      icon: Calendar,
    },
    {
      year: 'Jan, 2025',
      title: 'Desenvolvimento do Site',
      description: 'Desenvolvimento completo da versão inicial do site, com integração de eventos e informações.',
      icon: Award,
    },
    {
      year: 'Fev, 2025',
      title: 'Expansão de Informações',
      description: 'Inclusão de galeria de fotos e diretório completo de comércios.',
      icon: Target,
    },
    {
      year: 'Mar, 2025',
      title: 'Lançamento do Site',
      description: 'O Guia TNN está pronto para ser lançado e oferecer uma experiência completa aos visitantes.',
      icon: Heart,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Seção Hero */}
        <section className="mb-16">
          <ScrollReveal preset="fade">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-blue mb-4 text-center">
              Sobre o Guia TNN
            </h1>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
              Conheça nossa história, missão e o time por trás do maior portal de informações sobre Terra Nova do Norte
            </p>
          </ScrollReveal>

          <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden shadow-xl mt-8">
            <Image
              src="/brand/about-image-1.jpg"
              alt="Equipe do Guia TNN"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
              <div className="p-6 md:p-8 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Conectando Terra Nova do Norte</h2>
                <p className="text-white/90 max-w-2xl">
                  Desde nossa fundação, trabalhamos para criar pontes entre os moradores, 
                  visitantes e empreendedores de nossa cidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Quem Somos */}
        <section className="mb-16">
          <ScrollReveal preset="fade" className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-brand-blue/10 rounded-lg">
                <Users className="w-6 h-6 text-brand-blue" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-brand-blue ml-3">
                Quem Somos
              </h2>
            </div>

            <div className="space-y-4 text-gray-600">
              <p>
                O Guia TNN é o principal portal de informações sobre Terra Nova do Norte, 
                criado com o objetivo de promover a cidade, seus eventos, comércios e atrações.
              </p>
              <p>
                Nascemos da paixão por nossa cidade e da vontade de contribuir para seu 
                desenvolvimento, criando um espaço digital onde moradores e visitantes 
                possam encontrar tudo o que precisam saber sobre Terra Nova do Norte.
              </p>
              <p>
                Nossa equipe é formada por profissionais dedicados e apaixonados pela 
                cidade, trabalhando constantemente para trazer o melhor conteúdo e as 
                informações mais relevantes para nossa comunidade.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Seção Missão, Visão e Valores */}
        <section className="mb-16">
          <ScrollReveal preset="slide" direction="up" className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-brand-orange/10 rounded-lg">
                <Target className="w-6 h-6 text-brand-orange" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-brand-blue ml-3">
                Missão, Visão e Valores
              </h2>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('missao')}
                className={`px-4 py-2 font-medium text-sm md:text-base transition-colors ${
                  activeTab === 'missao'
                    ? 'text-brand-blue border-b-2 border-brand-blue'
                    : 'text-gray-500 hover:text-brand-blue'
                }`}
              >
                Missão
              </button>
              <button
                onClick={() => setActiveTab('visao')}
                className={`px-4 py-2 font-medium text-sm md:text-base transition-colors ${
                  activeTab === 'visao'
                    ? 'text-brand-blue border-b-2 border-brand-blue'
                    : 'text-gray-500 hover:text-brand-blue'
                }`}
              >
                Visão
              </button>
              <button
                onClick={() => setActiveTab('valores')}
                className={`px-4 py-2 font-medium text-sm md:text-base transition-colors ${
                  activeTab === 'valores'
                    ? 'text-brand-blue border-b-2 border-brand-blue'
                    : 'text-gray-500 hover:text-brand-blue'
                }`}
              >
                Valores
              </button>
            </div>

            <div className="text-gray-600">
              {activeTab === 'missao' && (
                <div className="space-y-4">
                  <p>
                    Nossa missão é conectar pessoas, negócios e oportunidades em Terra Nova do Norte, 
                    promovendo o desenvolvimento local através da divulgação de informações 
                    relevantes e de qualidade sobre a cidade.
                  </p>
                  <p>
                    Buscamos ser a principal fonte de informação para moradores e visitantes, 
                    contribuindo para o fortalecimento da economia local e para a valorização 
                    da cultura e história de nossa cidade.
                  </p>
                </div>
              )}

              {activeTab === 'visao' && (
                <div className="space-y-4">
                  <p>
                    Ser reconhecido como o principal canal de comunicação e informação de 
                    Terra Nova do Norte, tornando-se referência em qualidade de conteúdo 
                    e serviços para a comunidade.
                  </p>
                  <p>
                    Expandir nossa atuação para contribuir significativamente com o 
                    desenvolvimento econômico, social e cultural da cidade, conectando 
                    pessoas e oportunidades.
                  </p>
                </div>
              )}

              {activeTab === 'valores' && (
                <div className="space-y-4">
                  <ul className="space-y-2 list-disc pl-5">
                    <li><strong>Compromisso com a comunidade:</strong> Priorizamos o bem-estar e desenvolvimento de Terra Nova do Norte.</li>
                    <li><strong>Transparência:</strong> Atuamos com clareza e honestidade em todas as nossas ações.</li>
                    <li><strong>Qualidade:</strong> Buscamos excelência em todo conteúdo e serviço que oferecemos.</li>
                    <li><strong>Inovação:</strong> Estamos sempre em busca de novas formas de melhorar nossa plataforma.</li>
                    <li><strong>Respeito:</strong> Valorizamos a diversidade e respeitamos todas as pessoas.</li>
                  </ul>
                </div>
              )}
            </div>
          </ScrollReveal>
        </section>

        {/* Seção Nossa História */}
        <section className="mb-16">
          <ScrollReveal preset="fade" className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-brand-blue ml-3">
                Nossa História
              </h2>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-24 text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="mt-1 font-bold text-brand-blue">{milestone.year}</div>
                    </div>
                    <div className="ml-4 flex-grow pb-8 border-l-2 border-gray-200 pl-6 relative">
                      {index !== milestones.length - 1 && (
                        <div className="absolute bottom-0 left-0 w-6 border-b-2 border-gray-200"></div>
                      )}
                      <h3 className="text-xl font-semibold text-brand-blue mb-1">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </section>

        {/* Seção Quem está por trás do GUIA TNN */}
        <section className="mb-16">
          <ScrollReveal preset="slide" direction="up" className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-brand-orange/10 rounded-lg">
                <Users className="w-6 h-6 text-brand-orange" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-brand-blue ml-3">
                Quem está por trás do GUIA TNN
              </h2>
            </div>

            <p className="text-gray-600 mb-8">
              Conheça o profissional dedicado que trabalha para fazer do Guia TNN 
              a melhor fonte de informações sobre Terra Nova do Norte.
            </p>

            <div className="max-w-2xl mx-auto">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={128}
                          height={128}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-2xl font-semibold text-brand-blue mb-2">{member.name}</h3>
                      <p className="text-brand-orange font-medium mb-4">{member.role}</p>
                      <p className="text-gray-600">{member.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Seção Contato */}
        <section className="mb-16">
          <ScrollReveal preset="fade" className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-brand-blue/10 rounded-lg">
                <Mail className="w-6 h-6 text-brand-blue" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-brand-blue ml-3">
                Entre em Contato
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <p className="text-gray-600">
                  Tem alguma dúvida, sugestão ou gostaria de anunciar no Guia TNN? 
                  Entre em contato conosco pelos canais abaixo:
                </p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-brand-orange mr-3" />
                    <a href="mailto:guiatnn@hotmail.com" className="text-gray-600 hover:text-brand-blue transition-colors">
                      guiatnn@hotmail.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-brand-orange mr-3" />
                    <a href="tel:+5566999118905" className="text-gray-600 hover:text-brand-blue transition-colors">
                      (66) 99911-8905
                    </a>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-brand-orange mr-3" />
                    <span className="text-gray-600">Terra Nova do Norte, MT</span>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-brand-orange mr-3" />
                    <span className="text-gray-600">CNPJ: 60.742.446/0001-13</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link 
                    href="/legal/privacidade" 
                    className="inline-flex items-center text-brand-blue hover:text-brand-orange transition-colors"
                  >
                    <span>Política de Privacidade</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-brand-blue mb-4">Envie uma mensagem</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="seu.email@exemplo.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      placeholder="Sua mensagem"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-brand-orange text-white font-medium py-2 px-4 rounded-md hover:bg-brand-orange/90 transition-colors"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </main>
  );
}