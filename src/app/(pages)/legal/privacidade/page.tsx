import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade | Guia TNN",
  description: "Política de privacidade e proteção de dados do Guia Terra Nova do Norte",
};

export default function PrivacidadePage() {
  return (
    <main className="py-16 px-6 md:px-12 lg:px-16 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Botão voltar */}
        <Link
          href="/"
          className="inline-flex items-center text-brand-blue hover:text-brand-orange transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para a página inicial
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-6">
            Política de Privacidade
          </h1>

          <div className="prose prose-blue max-w-none text-black space-y-6">
            <p className="text-gray-600 mb-6">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">1. Introdução</h2>
              <p>
                O Guia Terra Nova do Norte (&quot;Guia TNN&quot;) está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você utiliza nosso site.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">2. Informações que Coletamos</h2>
              <p>
                Podemos coletar os seguintes tipos de informações:
              </p>
              <ul className="space-y-2 list-disc pl-6">
                <li><strong>Informações de identificação pessoal:</strong> Nome, endereço de e-mail, número de telefone, quando você se registra ou entra em contato conosco.</li>
                <li><strong>Informações não pessoais:</strong> Dados de uso, endereço IP, tipo de navegador, tempo gasto no site, páginas visitadas.</li>
                <li><strong>Cookies e tecnologias semelhantes:</strong> Utilizamos cookies para melhorar sua experiência de navegação e entender como você interage com nosso site.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">3. Como Utilizamos Suas Informações</h2>
              <p>
                Utilizamos suas informações para:
              </p>
              <ul className="space-y-2 list-disc pl-6">
                <li>Fornecer, manter e melhorar nossos serviços;</li>
                <li>Processar e responder às suas solicitações;</li>
                <li>Enviar comunicações administrativas;</li>
                <li>Personalizar sua experiência no site;</li>
                <li>Analisar tendências de uso e otimizar nosso site;</li>
                <li>Detectar, prevenir e resolver problemas técnicos ou de segurança.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">4. Compartilhamento de Informações</h2>
              <p>
                Não vendemos, comercializamos ou transferimos suas informações pessoais para terceiros, exceto nas seguintes circunstâncias:
              </p>
              <ul className="space-y-2 list-disc pl-6">
                <li>Com prestadores de serviços que nos auxiliam na operação do site;</li>
                <li>Para cumprir obrigações legais;</li>
                <li>Para proteger nossos direitos, propriedade ou segurança;</li>
                <li>Em conexão com uma fusão, venda de ativos ou outra transação comercial.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">5. Segurança de Dados</h2>
              <p>
                Implementamos medidas de segurança adequadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">6. Seus Direitos de Privacidade</h2>
              <p>
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direitos relacionados às suas informações pessoais, incluindo:
              </p>
              <ul className="space-y-2 list-disc pl-6">
                <li>Direito de acesso às suas informações;</li>
                <li>Direito de correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>Direito de eliminação dos dados;</li>
                <li>Direito de portabilidade;</li>
                <li>Direito de revogar o consentimento.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">7. Retenção de Dados</h2>
              <p>
                Mantemos suas informações pessoais apenas pelo tempo necessário para os fins estabelecidos nesta Política de Privacidade, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">8. Crianças</h2>
              <p>
                Nosso site não é direcionado a menores de 13 anos e não coletamos intencionalmente informações pessoais de crianças. Se você acredita que coletamos informações de uma criança, entre em contato conosco imediatamente.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos sobre quaisquer alterações publicando a nova política em nosso site e, quando apropriado, notificando você por e-mail.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">10. Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo e-mail: contato@guiatnn.com.br
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}