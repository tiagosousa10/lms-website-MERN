import TestimonialsSection from "../../components/community/TestimonialSection";
import TestimonialForm from "../../components/community/TestimonialForm";
import MyTestimonialsTable from "../../components/community/TestimonialsTable";

export default function CommunityTestimonials() {
  return (
    <main className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TestimonialsSection />
        <div className="mt-10">
          <TestimonialForm />
        </div>
        <div className="mt-10">
          <MyTestimonialsTable />
        </div>
      </div>
    </main>
  );
}
