// PrivacyPolicy.jsx
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-base-200 min-h-screen px-6 md:px-20 py-12 space-y-8 bg-gradient-to-b from-[#f4f7fc] via-[#e8f0fb] to-[#dce9f8] ">
      {/* 📝 Título & Introdução */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold text-base-content">
          Política de Privacidade
        </h1>
        <p className="text-base-content/70">
          Atualizado pela última vez em 5 de Agosto de 2024. A tua privacidade é
          importante para nós. Esta política descreve como recolhemos, usamos,
          protegemos e partilhamos as tuas informações
        </p>
      </section>

      {/* 🔐 Seção: Que dados recolhemos */}
      <section className="bg-base-100 rounded-lg shadow p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-base-content">
          Que dados recolhemos
        </h2>
        <ul className="list-disc list-inside text-base-content/70 space-y-2">
          <li>
            <strong>Informações fornecidas por ti:</strong> nome, email,
            detalhes da conta, comunicações, e compras online
          </li>
          <li>
            <strong>Informações automáticas:</strong> endereços IP, browser,
            dispositivo, dados de utilização recolhidos enquanto navegas
          </li>
        </ul>
      </section>

      {/* ↩️ Seção: Como utilizamos */}
      <section className="bg-base-100 rounded-lg shadow p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-base-content">
          Como utilizamos os dados
        </h2>
        <ul className="list-disc list-inside text-base-content/70 space-y-2">
          <li>Para fornecer e melhorar os nossos serviços.</li>
          <li>Para efetuar comunicações (email, notificações).</li>
          <li>Para garantir segurança, prevenir fraudes e uso indevido</li>
          <li>Para análise de utilização e performance.</li>
        </ul>
      </section>

      {/* 🤝 Seção: Partilha de dados */}
      <section className="bg-base-100 rounded-lg shadow p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-base-content">
          Com quem partilhamos
        </h2>
        <ul className="list-disc list-inside text-base-content/70 space-y-2">
          <li>
            Com empresas parceiras e prestadores de serviços (ex: processadores
            de pagamento).
          </li>
          <li>
            Se exigido por disposição legal ou proteção de direitos e segurança
          </li>
        </ul>
      </section>

      {/* 🗄️ Seção: Retenção de dados */}
      <section className="bg-base-100 rounded-lg shadow p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-base-content">
          Retenção de dados
        </h2>
        <p className="text-base-content/70">
          Recebemos os dados apenas durante o tempo necessário para os fins
          descritos, conforme as obrigações legais ou legítimos interesses da
          tsAcademy
        </p>
      </section>

      {/* 💼 Seção: Direitos dos utilizadores */}
      <section className="bg-base-100 rounded-lg shadow p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-base-content">
          Os teus direitos
        </h2>
        <p className="text-base-content/70">
          Tens o direito de aceder, retificar, eliminar, limitar o
          processamento, ou retirar consentimento sobre os teus dados pessoais.
          Conforme o RGPD, também podes solicitar portabilidade ou apresentar
          reclamação .
        </p>
      </section>

      {/* 📬 Seção: Contactos */}
      <section className="bg-base-100 rounded-lg shadow p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-base-content">
          Contactar-nos
        </h2>
        <p className="text-base-content/70">
          Se tiveres dúvidas ou quiseres exercer os teus direitos, entra em
          contacto através do email:{" "}
          <a href="mailto:privacy@tsacademy.pt" className="link">
            privacy@tsacademy.pt
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
