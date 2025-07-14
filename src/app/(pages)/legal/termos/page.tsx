import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Uso | MT 9",
  description: "Termos e condições de uso do Guia Terra Nova do Norte",
};

export default function TermosPage() {
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
            Termos de Uso
          </h1>

          <div className="prose prose-blue max-w-none text-black space-y-6">
            <p className="text-gray-600 mb-6">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar e utilizar o Guia Terra Nova do Norte (&quot;Guia
                TNN&quot;), você concorda em cumprir e estar vinculado aos
                seguintes termos e condições de uso. Se você não concordar com
                qualquer parte destes termos, solicitamos que não utilize nosso
                site.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">
                2. Uso do Conteúdo
              </h2>
              <p>
                Todo o conteúdo disponibilizado no MT 9, incluindo textos,
                gráficos, logotipos, ícones, imagens, clipes de áudio, downloads
                digitais e compilações de dados, é propriedade do MT 9 ou de
                seus fornecedores de conteúdo e está protegido pelas leis
                brasileiras e internacionais de direitos autorais.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">
                3. Contas de Usuário
              </h2>
              <p>
                Algumas funcionalidades do MT 9 podem exigir registro de
                conta. Você é responsável por manter a confidencialidade de suas
                informações de conta, incluindo senha, e por todas as atividades
                que ocorrerem sob sua conta.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">
                4. Conduta do Usuário
              </h2>
              <p>Ao utilizar o MT 9, você concorda em não:</p>
              <ul className="space-y-2 list-disc pl-6">
                <li>Violar quaisquer leis aplicáveis;</li>
                <li>Publicar conteúdo difamatório, obsceno ou ofensivo;</li>
                <li>Interferir na segurança do site;</li>
                <li>Distribuir vírus ou qualquer outro código malicioso;</li>
                <li>Coletar informações de outros usuários sem autorização.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">
                5. Precisão das Informações
              </h2>
              <p>
                Embora nos esforcemos para fornecer informações precisas e
                atualizadas sobre Terra Nova do Norte, não garantimos a
                exatidão, integridade ou atualidade dessas informações. O
                conteúdo é fornecido &quot;como está&quot; e pode ser alterado
                sem aviso prévio.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">
                6. Links para Sites de Terceiros
              </h2>
              <p>
                O MT 9 pode conter links para sites de terceiros. Esses
                links são fornecidos apenas para conveniência e não significam
                endosso ou associação com o conteúdo desses sites. Não temos
                controle sobre o conteúdo de sites de terceiros e não assumimos
                responsabilidade por eles.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">
                7. Modificações dos Termos
              </h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer
                momento. As alterações entrarão em vigor imediatamente após a
                publicação dos termos atualizados. O uso contínuo do MT 9
                após tais alterações constitui sua aceitação dos novos termos.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">
                8. Limitação de Responsabilidade
              </h2>
              <p>
                O MT 9 e seus colaboradores não serão responsáveis por
                quaisquer danos diretos, indiretos, incidentais, consequenciais
                ou punitivos decorrentes do acesso ou uso (ou incapacidade de
                uso) do site.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">
                9. Lei Aplicável
              </h2>
              <p>
                Estes termos são regidos e interpretados de acordo com as leis
                do Brasil. Qualquer disputa relacionada a estes termos será
                submetida à jurisdição exclusiva dos tribunais brasileiros.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-brand-blue mt-8">
                10. Contato
              </h2>
              <p>
                Se você tiver dúvidas sobre estes Termos de Uso, entre em
                contato conosco pelo e-mail: guiatnn@hotmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}