// ContactUs.jsx
import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="bg-base-200 min-h-screen px-6 md:px-20 py-16 bg-gradient-to-b from-[#f4f7fc] via-[#e8f0fb] to-[#dce9f8]">
      {/* Header */}
      <section className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-base-content mb-4">
          Fale Connosco
        </h1>
        <p className="text-base-content/70">
          Estamos aqui para te ajudar! Envia-nos uma mensagem ou utiliza os
          nossos contactos diretos abaixo.
        </p>
      </section>

      {/* Contact Info + Form */}
      <section className="flex flex-col lg:flex-row gap-10">
        {/* Dados de contacto */}
        <div className="flex-1 bg-base-100 rounded-lg shadow p-8 space-y-6">
          <div className="flex items-start gap-4">
            <MapPin className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Endereço</h3>
              <p className="text-base-content/70">
                Rua Principal 123, Porto, Portugal
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="text-base-content/70">support@tsacademy.pt</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Telefone</h3>
              <p className="text-base-content/70">+351 123 456 789</p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-4 mt-6">
            <button className="btn btn-outline btn-primary flex-1">
              Enviar Email
            </button>
            <button className="btn btn-outline btn-primary flex-1">
              Ligue Já
            </button>
          </div>
        </div>

        {/* Formulário de contacto */}
        <div className="flex-1 bg-base-100 rounded-lg shadow p-8">
          <form className="space-y-6">
            <div>
              <label className="label">O teu Nome</label>
              <input
                type="text"
                placeholder="Nome completo"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                placeholder="teu@email.com"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">Assunto</label>
              <input
                type="text"
                placeholder="Ex.: Suporte, Parceria..."
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">Mensagem</label>
              <textarea
                placeholder="Escreve a tua mensagem..."
                className="textarea textarea-bordered w-full h-32"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Enviar Mensagem
            </button>
          </form>
        </div>
      </section>

      {/* Mapa ou footer */}
      {/* <section className="mt-12">
        Insere aqui um Google Maps embed se desejado
      </section> */}
    </div>
  );
};

export default ContactUs;
