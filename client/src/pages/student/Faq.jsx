import React from "react";
import { assets } from "../../assets/assets";

const Faq = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-10 ">
      <div className="grid gap-8 md:gap-10 md:grid-cols-[1.4fr_auto_1.2fr] items-start">
        {/* COLUNA FAQ */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Perguntas Frequentes
          </h1>
          <p className="text-base-content/70 mb-4">
            Encontra respostas rápidas às questões mais comuns sobre a
            plataforma.
          </p>

          {/* Grupo de items: usa radios com o MESMO name para comportar-se como accordion */}
          <div className="space-y-3 text-white">
            {/* 1 */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl hover:bg-base-200/30 transition">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title font-semibold text-base md:text-lg">
                Como crio uma conta?
              </div>
              <div className="collapse-content text-sm md:text-[15px] leading-relaxed">
                Clica em «Criar conta» no canto superior direito e segue o
                processo de registo.
              </div>
            </div>

            {/* 2 */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl hover:bg-base-200/30 transition">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title font-semibold text-base md:text-lg">
                Esqueci-me da palavra-passe. O que devo fazer?
              </div>
              <div className="collapse-content text-sm md:text-[15px] leading-relaxed">
                Na página de início de sessão, clica em «Esqueci-me da
                palavra-passe» e segue as instruções enviadas por e-mail.
              </div>
            </div>

            {/* 3 */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl hover:bg-base-200/30 transition">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title font-semibold text-base md:text-lg">
                Como atualizo as informações do meu perfil?
              </div>
              <div className="collapse-content text-sm md:text-[15px] leading-relaxed">
                Acede a «A minha conta» &rarr; «Editar perfil» para alterar
                nome, foto e outros dados.
              </div>
            </div>

            {/* 4 */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl hover:bg-base-200/30 transition">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title font-semibold text-base md:text-lg">
                Como encontro cursos relevantes para mim?
              </div>
              <div className="collapse-content text-sm md:text-[15px] leading-relaxed">
                Usa a barra de pesquisa ou a página «Explorar Cursos» e filtra
                por tema, nível, duração e classificação.
              </div>
            </div>

            {/* 5 */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl hover:bg-base-200/30 transition">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title font-semibold text-base md:text-lg">
                Posso pedir reembolso?
              </div>
              <div className="collapse-content text-sm md:text-[15px] leading-relaxed">
                Sim, de acordo com a nossa política de reembolsos. Consulta os
                prazos e condições na página de Ajuda.
              </div>
            </div>

            {/* 6 */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl hover:bg-base-200/30 transition">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title font-semibold text-base md:text-lg">
                Recebo certificado ao concluir um curso?
              </div>
              <div className="collapse-content text-sm md:text-[15px] leading-relaxed">
                Sim. Após terminares todos os conteúdos obrigatórios, o
                certificado fica disponível para download.
              </div>
            </div>

            {/* 7 */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl hover:bg-base-200/30 transition">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title font-semibold text-base md:text-lg">
                Como contacto o suporte?
              </div>
              <div className="collapse-content text-sm md:text-[15px] leading-relaxed">
                Abre um pedido em «Contactos» ou envia-nos mensagem pelo chat de
                suporte dentro da plataforma.
              </div>
            </div>

            {/* 8 */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl hover:bg-base-200/30 transition">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title font-semibold text-base md:text-lg">
                Posso alterar idioma e moeda?
              </div>
              <div className="collapse-content text-sm md:text-[15px] leading-relaxed">
                Vai a «A minha conta» &rarr; «Preferências» para definir idioma
                da interface e moeda de pagamento.
              </div>
            </div>

            {/* 9 */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl hover:bg-base-200/30 transition">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title font-semibold text-base md:text-lg">
                Consigo aceder às aulas offline?
              </div>
              <div className="collapse-content text-sm md:text-[15px] leading-relaxed">
                Em breve. Estamos a trabalhar numa funcionalidade de download
                seguro para visionamento offline.
              </div>
            </div>

            {/* 10 */}
            <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl hover:bg-base-200/30 transition">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title font-semibold text-base md:text-lg">
                Como elimino a minha conta?
              </div>
              <div className="collapse-content text-sm md:text-[15px] leading-relaxed">
                Em «A minha conta» &rarr; «Segurança» encontras a opção para
                eliminar a conta. Atenção: é irreversível.
              </div>
            </div>
          </div>
        </div>

        {/* SEPARADOR (vertical em md+, horizontal em mobile) */}
        <div className="hidden md:block w-px bg-base-300 rounded-full h-full mx-auto" />
        <div className="md:hidden h-px bg-base-300 rounded-full" />

        {/* COLUNA IMAGEM */}
        <figure className="self-center   card bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden ">
          <div className="p-4 md:p-6 ">
            <img
              src={assets.faq}
              alt="FAQ"
              className="w-full max-h-[460px] object-contain"
              loading="lazy"
            />
          </div>
        </figure>
      </div>
    </section>
  );
};

export default Faq;
