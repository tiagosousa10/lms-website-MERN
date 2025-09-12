// pages/CommunityTestimonials.jsx
import TestimonialsSection from "../../components/community/TestimonialSection";
import TestimonialForm from "../../components/community/TestimonialForm";
import MyTestimonialsTable from "../../components/community/TestimonialsTable";

export default function CommunityTestimonials() {
  return (
    <div className=" w-[90%]   ">
      <TestimonialsSection />
      <TestimonialForm />
      <MyTestimonialsTable />
    </div>
  );
}
