import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function TestimonialsSection() {
  const { randomTestimonials, fetchRandomTestimonials } =
    useContext(AppContext);

  return (
    <section className="p-6 bg-base-100 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Testemunhos</h2>
        <button onClick={fetchRandomTestimonials} className="btn btn-sm">
          Mostrar outros
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {randomTestimonials?.map((testimonial) => (
          <article
            key={testimonial._id}
            className="card bg-base-100 border shadow-sm"
          >
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">
                    {testimonial?.user?.name ?? "Utilizador"}
                  </p>
                  <p className="text-xs opacity-70">
                    {testimonial?.user?.email}
                  </p>
                </div>
                <div className="badge badge-primary">{testimonial.rating}★</div>
              </div>
              <p className="text-sm opacity-90">{testimonial.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
