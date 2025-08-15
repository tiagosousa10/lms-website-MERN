// pages/CommunityTestimonials.jsx
import TestimonialsSection from "../../components/community/TestimonialSection";
import TestimonialForm from "../../components/community/TestimonialForm";
import MyTestimonialsTable from "../../components/community/TestimonialsTable";

export default function CommunityTestimonials() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 ">
      <h1 className="text-2xl font-bold">Comunidade — Testemunhos</h1>
      <TestimonialsSection />
      <TestimonialForm />
      <MyTestimonialsTable />
    </div>
  );
}
