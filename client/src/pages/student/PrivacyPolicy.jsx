// PrivacyPolicy.jsx
import React from "react";

const Section = ({ id, title, children }) => (
  <section
    id={id}
    className="bg-[#213448] rounded-lg shadow p-6 sm:p-8 space-y-4"
  >
    <h2 className="text-xl sm:text-2xl font-semibold text-white">{title}</h2>
    {children}
  </section>
);

const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 space-y-8">
        {/* Título & intro */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Política de Privacidade
          </h1>
          <p className="text-black/70 text-sm sm:text-base">
            <span className="font-medium">Última atualização:</span> 5 de agosto
            de 2024. A tua privacidade é importante para nós. Esta política
            descreve como recolhemos, utilizamos, protegemos e partilhamos os
            teus dados pessoais, e como podes exercer os teus direitos.
          </p>
        </header>

        {/* Índice (âncoras) */}
        <nav aria-label="Índice" className="max-w-3xl mx-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              ["controlador", "Quem é o responsável pelo tratamento"],
              ["dados", "Que dados recolhemos"],
              ["bases-legais", "Bases legais do tratamento"],
              ["utilizacao", "Como utilizamos os dados"],
              ["partilha", "Com quem partilhamos"],
              ["conservacao", "Prazos de conservação"],
              ["direitos", "Os teus direitos"],
              ["transferencias", "Transferências internacionais"],
              ["cookies", "Cookies e tecnologias semelhantes"],
              ["seguranca", "Segurança"],
              ["criancas", "Dados de crianças"],
              ["alteracoes", "Alterações a esta política"],
              ["contactos", "Contactos & Reclamações"],
            ].map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="underline text-[#213448] hover:opacity-80"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Seções */}
        <Section id="controlador" title="Quem é o responsável pelo tratamento">
          <p className="text-white/80">
            A <strong>tsAcademy</strong> é a entidade responsável pelo
            tratamento dos teus dados pessoais (“
            <em>responsável pelo tratamento</em>”). Quando indicado, poderemos
            atuar em conjunto com outras entidades (corresponsáveis) ou como
            subcontratante para prestadores de serviços.
          </p>
          <ul className="list-disc list-inside text-white/70 space-y-1">
            <li>
              <strong>Identidade e contactos:</strong> tsAcademy, Porto,
              Portugal. Email:{" "}
              <a
                className="underline"
                href="mailto:tiagosousa.tams@hotmail.com"
              >
                tiagosousa.tams@hotmail.com
              </a>
            </li>
            <li>
              <strong>Encarregado de Proteção de Dados (DPO):</strong>{" "}
              <span className="opacity-90">tiagosousa.tams@hotmail.com</span>{" "}
              (se aplicável).
            </li>
          </ul>
        </Section>

        <Section id="dados" title="Que dados recolhemos">
          <ul className="list-disc list-inside text-white/80 space-y-2">
            <li>
              <strong>Fornecidos por ti:</strong> nome, email, dados de conta,
              conteúdos de comunicações, compras/inscrições e preferências.
            </li>
            <li>
              <strong>Gerados automaticamente:</strong> IP, identificadores do
              dispositivo/ navegador, registos de atividade (logs), dados de
              utilização e desempenho.
            </li>
            <li>
              <strong>Proveniência:</strong> diretamente de ti (Art. 13.º) ou de
              terceiros quando necessário (Art. 14.º), sempre com transparência.
            </li>
          </ul>
        </Section>

        <Section id="bases-legais" title="Bases legais do tratamento">
          <ul className="list-disc list-inside text-white/80 space-y-1">
            <li>
              <strong>Execução de contrato</strong> (ex.: gestão de contas,
              inscrições, acesso aos cursos).
            </li>
            <li>
              <strong>Interesse legítimo</strong> (ex.: segurança, prevenção de
              fraude, melhoria do serviço). Fazemos testes de ponderação quando
              necessário.
            </li>
            <li>
              <strong>Consentimento</strong> (ex.: comunicações de marketing;
              cookies não essenciais). Podes retirar o consentimento a qualquer
              momento.
            </li>
            <li>
              <strong>Obrigação legal</strong> (ex.: fiscalidade, contabilidade,
              cumprimento de pedidos de autoridades).
            </li>
          </ul>
        </Section>

        <Section id="utilizacao" title="Como utilizamos os dados">
          <ul className="list-disc list-inside text-white/80 space-y-1">
            <li>
              Prestar, manter e melhorar os serviços e conteúdos formativos.
            </li>
            <li>
              Comunicar contigo (emails transacionais e, com consentimento,
              marketing).
            </li>
            <li>
              Garantir segurança, prevenir fraudes e abusos; monitorizar
              desempenho.
            </li>
            <li>
              Analytics agregados para melhorar a experiência e funcionalidades.
            </li>
            <li>
              Tomada de decisão automatizada apenas quando necessário e com
              informação adicional, se aplicável.
            </li>
          </ul>
        </Section>

        <Section id="partilha" title="Com quem partilhamos">
          <ul className="list-disc list-inside text-white/80 space-y-1">
            <li>
              Prestadores de serviços (alojamento, pagamentos, analytics,
              suporte), vinculados por contrato e obrigações de
              confidencialidade.
            </li>
            <li>Autoridades públicas quando exigido por lei.</li>
            <li>
              Transferências societárias (fusão/aquisição), com aviso prévio
              quando aplicável.
            </li>
          </ul>
        </Section>

        <Section id="conservacao" title="Prazos de conservação">
          <p className="text-white/80">
            Mantemos os dados apenas pelo período necessário para as finalidades
            indicadas ou pelo prazo exigido por lei (princípio da limitação da
            conservação). Estabelecemos prazos/ critérios para eliminação ou
            revisão periódica.
          </p>
        </Section>

        <Section id="direitos" title="Os teus direitos">
          <p className="text-white/80">
            Tens direito de <strong>acesso</strong>,{" "}
            <strong>retificação</strong>, <strong>eliminação</strong>,{" "}
            <strong>limitação</strong>, <strong>oposição</strong> e{" "}
            <strong>portabilidade</strong>, bem como a{" "}
            <strong>retirar o consentimento</strong> quando seja a base legal
            aplicável.
          </p>
          <p className="text-white/80">
            Para exercer, contacta-nos através de{" "}
            <a className="underline" href="mailto:tiagosousa.tams@hotmail.com">
              tiagosousa.tams@hotmail.com
            </a>
            . Forneceremos informação clara e num prazo razoável, salvo exceções
            previstas em lei.
          </p>
        </Section>

        <Section id="transferencias" title="Transferências internacionais">
          <p className="text-white/80">
            Se transferirmos dados para fora do EEE, aplicaremos as condições do
            Capítulo V do RGPD (ex.: decisão de adequação,{" "}
            <em>Standard Contractual Clauses</em> e medidas suplementares),
            garantindo um nível de proteção equivalente.
          </p>
        </Section>

        <Section id="cookies" title="Cookies e tecnologias semelhantes">
          <p className="text-white/80">
            Utilizamos cookies e tecnologias similares para funcionalidades
            essenciais, estatísticas e, com o teu consentimento, marketing.
            Podes gerir preferências no nosso banner/centro de preferências de
            cookies.
          </p>
        </Section>

        <Section id="seguranca" title="Segurança">
          <p className="text-white/80">
            Implementamos medidas técnicas e organizativas adequadas (controlo
            de acessos, cifragem em trânsito/repouso quando aplicável,{" "}
            <em>backups</em>, registos de auditoria) para proteger os dados.
          </p>
        </Section>

        <Section id="criancas" title="Dados de crianças">
          <p className="text-white/80">
            Os nossos serviços não se destinam a menores de 13 anos. Se
            soubermos que recolhemos dados de menores sem consentimento válido,
            eliminaremos essas informações.
          </p>
        </Section>

        <Section id="alteracoes" title="Alterações a esta política">
          <p className="text-white/80">
            Podemos atualizar esta política para refletir alterações legais ou
            operacionais. Publicaremos a versão mais recente com data de
            atualização e, quando apropriado, notificaremos via email/aplicação.
          </p>
        </Section>

        <Section id="contactos" title="Contactos & Reclamações">
          <p className="text-white/80">
            Dúvidas ou pedidos sobre privacidade? Contacta:{" "}
            <a href="mailto:tiagosousa.tams@hotmail.com" className="underline">
              tiagosousa.tams@hotmail.com
            </a>
            .
          </p>
          <p className="text-white/80">
            Tens também o direito de apresentar reclamação junto da{" "}
            <a
              href="https://www.cnpd.pt/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              CNPD
            </a>
            .
          </p>
        </Section>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
