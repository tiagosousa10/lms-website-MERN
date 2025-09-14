// ContactUs.jsx
import React from "react";
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Github,
  Linkedin,
  Youtube,
} from "lucide-react";
import { assets } from "../../assets/assets";

const ContactUs = () => {
  return (
    <div className=" mx-auto min-h-screen px-8 md:px-20 py-16 flex flex-row -2 ">
      {/* Header */}
      <section className="max-w-7xl mx-auto text-center mb-12 flex flex-row mt-10">
        {/* infomation */}
        <div className="flex flex-col mt-20">
          {/* title */}
          <div className="text-start">
            <h1 className="text-4xl font-bold  mb-4">Fale Connosco</h1>
            <p className="text-black/70">
              Estamos aqui para te ajudar! <br /> Envia-nos uma mensagem ou
              utiliza os nossos contactos diretos abaixo.
            </p>
          </div>
          {/* card */}
          <div className="flex flex-col gap-4 my-8">
            <div className="flex flex-col gap-2 border border-black rounded-md p-4 items-center w-3/4 mx-auto ">
              <span>Entra em Contacto</span>
              <p className="flex items-center gap-2 ">
                <span>
                  <Mail />
                </span>
                tiagosousa.tams@hotmail.com
              </p>
            </div>
          </div>
          {/* icons */}
          <div className="flex gap-4 items-center justify-center ">
            <Github />
            <Linkedin />
            <Instagram />
            <Youtube />
          </div>
        </div>
        {/* contact us image */}
        <div className="ml-8">
          <img src={assets.contact_us} alt="" className="" />
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
