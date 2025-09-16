import React, { useMemo, useState } from "react";
import { assets } from "../../assets/assets";
import { Search as SearchIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Input } from "../../components/ui/input";

// conteúdo
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
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqItems;
    return faqItems.filter(
      (it) =>
        it.question.toLowerCase().includes(q) ||
        it.answer.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="bg-white min-h-screen w-full">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Coluna FAQ */}
          <div className="space-y-6">
            <header className="space-y-2">
              <h1 className="font-semibold text-[#37353e] text-3xl md:text-4xl">
                Perguntas Frequentes
              </h1>
              <p className="text-black/70 text-sm md:text-base">
                Encontra respostas rápidas às questões mais comuns sobre a
                plataforma.
              </p>
            </header>

            {/* pesquisa local (opcional, mas útil) */}
            <label
              className="relative block"
              aria-label="Pesquisar perguntas frequentes"
            >
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <SearchIcon className="w-4 h-4 text-slate-500" />
              </span>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar no FAQ…"
                className="pl-10 h-11"
              />
            </label>

            <Accordion type="single" collapsible className="w-full space-y-2">
              {filtered.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-[#213448] border border-[#d3dad9] rounded-md"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-[#d3dad9] text-base hover:no-underline [&[data-state=open]>svg]:rotate-180">
                    {item.question}
                  </AccordionTrigger>
                  {item.answer && (
                    <AccordionContent className="px-4 sm:px-6 pb-4 text-white/90 text-sm">
                      {item.answer}
                    </AccordionContent>
                  )}
                </AccordionItem>
              ))}
              {!filtered.length && (
                <p className="text-sm text-slate-600 px-1">
                  Sem resultados para “{query}”.
                </p>
              )}
            </Accordion>
          </div>

          {/* Coluna imagem */}
          <div className="relative max-w-md mx-auto lg:max-w-none">
            <figure className="bg-white rounded-2xl border border-[#d3dad9] shadow-sm overflow-hidden p-4 sm:p-6">
              <img
                src={assets.faq}
                alt="Perguntas e respostas"
                className="w-full h-64 sm:h-80 md:h-[28rem] object-contain"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Faq;
