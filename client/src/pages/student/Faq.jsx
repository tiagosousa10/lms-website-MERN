import React from "react";
import { assets } from "../../assets/assets";
import { SearchIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

// Recolha do conteúdo original (mantém perguntas/respostas da tua página)
const faqItems = [
  {
    id: "item-1",
    question: "Como crio uma conta?",
    answer:
      "Clica em «Criar conta» no canto superior direito e segue o processo de registo.",
  },
  {
    id: "item-2",
    question: "Esqueci-me da palavra-passe. O que devo fazer?",
    answer:
      "Na página de início de sessão, clica em «Esqueci-me da palavra-passe» e segue as instruções enviadas por e-mail.",
  },
  {
    id: "item-3",
    question: "Como atualizo as informações do meu perfil?",
    answer:
      "Acede a «A minha conta» → «Editar perfil» para alterar nome, foto e outros dados.",
  },
  {
    id: "item-4",
    question: "Como encontro cursos relevantes para mim?",
    answer:
      "Usa a barra de pesquisa ou a página «Explorar Cursos» e filtra por tema, nível, duração e classificação.",
  },
  {
    id: "item-5",
    question: "Posso pedir reembolso?",
    answer:
      "Sim, de acordo com a nossa política de reembolsos. Consulta os prazos e condições na página de Ajuda.",
  },
  {
    id: "item-6",
    question: "Recebo certificado ao concluir um curso?",
    answer:
      "Sim. Após terminares todos os conteúdos obrigatórios, o certificado fica disponível para download.",
  },
  {
    id: "item-7",
    question: "Como contacto o suporte?",
    answer:
      "Abre um pedido em «Contactos» ou envia-nos mensagem pelo chat de suporte dentro da plataforma.",
  },
  {
    id: "item-8",
    question: "Posso alterar idioma e moeda?",
    answer:
      "Vai a «A minha conta» → «Preferências» para definir idioma da interface e moeda de pagamento.",
  },
  {
    id: "item-9",
    question: "Consigo aceder às aulas offline?",
    answer:
      "Em breve. Estamos a trabalhar numa funcionalidade de download seguro para visionamento offline.",
  },
  {
    id: "item-10",
    question: "Como elimino a minha conta?",
    answer:
      "Em «A minha conta» → «Segurança» encontras a opção para eliminar a conta. Atenção: é irreversível.",
  },
];

const Faq = () => {
  return (
    <div className="bg-white min-h-screen w-full">
      {/* Main */}
      <main className="max-w-[1440px] mx-auto px-[135px] py-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[200px] items-start">
          {/* Coluna FAQ (accordion shadcn/ui) */}
          <div className="space-y-[33px]">
            <div className="space-y-[26px]">
              <h1 className="font-semibold text-[#37353e] text-4xl">
                Perguntas Frequentes
              </h1>
              <p className="font-normal text-black text-sm">
                Encontra respostas rápidas às questões mais comuns sobre a
                plataforma.
              </p>
            </div>

            <Accordion
              type="single"
              collapsible
              className="w-full space-y-[10px]"
            >
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-[#213448] border border-solid border-[#d3dad9] rounded-none"
                >
                  <AccordionTrigger className="h-[50px] px-12 font-medium text-[#d3dad9] text-base hover:no-underline [&[data-state=open]>svg]:rotate-180">
                    {item.question}
                  </AccordionTrigger>
                  {item.answer && (
                    <AccordionContent className="px-[33px] pb-4 font-light text-white text-sm">
                      {item.answer}
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Coluna imagem (usa o teu assets.faq) */}
          <div className="relative w-[500px] h-[500px] mx-auto mt-20">
            <figure className="absolute inset-0 bg-white rounded-2xl border border-[#d3dad9] shadow-sm overflow-hidden flex items-center justify-center p-6">
              <img
                src={assets.faq}
                alt="FAQ"
                className="w-full h-full max-h-[430px] object-contain"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Faq;
