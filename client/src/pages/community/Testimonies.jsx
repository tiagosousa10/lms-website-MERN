import React, { useState } from "react";

const initialTestemunhos = [
  {
    name: "Donald Jackman",
    role: "Eng. de Software Nível 1 @ Amazon",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    rating: 5,
    text: "Tenho utilizado o Imagify há quase dois anos, principalmente para o Instagram, e tem sido extremamente fácil de usar, facilitando muito o meu trabalho.",
  },
  {
    name: "Richard Nelson",
    role: "Eng. de Software Nível 2 @ Samsung",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    rating: 4,
    text: "Tenho utilizado o Imagify há quase dois anos, principalmente para o Instagram, e tem sido extremamente fácil de usar, facilitando muito o meu trabalho.",
  },
  {
    name: "James Washington",
    role: "Eng. de Software Nível 2 @ Google",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    rating: 4,
    text: "Tenho utilizado o Imagify há quase dois anos, principalmente para o Instagram, e tem sido extremamente fácil de usar, facilitando muito o meu trabalho.",
  },
];

export default function TestemunhosPage() {
  const [testemunhos, setTestemunhos] = useState(initialTestemunhos);
  const [form, setForm] = useState({
    name: "",
    role: "",
    image: "",
    rating: 5,
    text: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTestemunhos([...testemunhos, form]);
    setForm({ name: "", role: "", image: "", rating: 5, text: "" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      <section className="text-center">
        <h1 className="text-3xl font-bold mb-2">Testemunhos</h1>
        <p className="text-gray-600">
          Ouve os nossos alunos enquanto partilham as suas jornadas de
          transformação e sucesso.
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testemunhos.map((t, i) => (
          <div
            key={i}
            className="card bg-base-100 shadow hover:shadow-lg transition rounded-md"
          >
            <div className="card-body">
              <div className="flex items-center space-x-4 mb-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={t.image} alt={t.name} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
              <div className="flex text-yellow-500 mb-3">
                {[...Array(5)].map((_, idx) => (
                  <svg
                    key={idx}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 ${
                      idx < t.rating ? "fill-current" : "text-gray-300"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .587l3.668 7.431L24 9.753l-6 5.846 1.415 8.261L12 19.896l-7.415 3.964L6 15.599 0 9.753l8.332-1.735z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-700">{t.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-base-100 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Adicionar Testemunho</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome"
            className="input input-bordered w-full"
            required
          />
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Cargo + Empresa"
            className="input input-bordered w-full"
            required
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="URL da imagem"
            className="input input-bordered w-full"
            required
          />
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            placeholder="Testemunho"
            className="textarea textarea-bordered w-full"
            required
          />
          <input
            name="rating"
            type="number"
            min="1"
            max="5"
            value={form.rating}
            onChange={handleChange}
            placeholder="Avaliação (1-5)"
            className="input input-bordered w-full"
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            Adicionar
          </button>
        </form>
      </section>
    </div>
  );
}
