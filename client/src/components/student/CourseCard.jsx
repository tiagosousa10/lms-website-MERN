import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);
  const rating = calculateRating(course);
  const discountedPrice = (
    course.coursePrice *
    (1 - course.discount / 100)
  ).toFixed(2);

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => scrollTo(0, 0)}
      className="overflow-hidden rounded-lg border border-gray-200 bg-[#213448] text-white transition-all hover:shadow-md  max-w-md mr-8 "
    >
      {/* thumb em 16:9 */}
      <div className="aspect-video bg-gray-100">
        <img
          src={course.courseThumbnail}
          alt={course.courseTitle}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* conteúdo */}
      <div className="p-4">
        <h3 className="font-semibold text-lg  truncate">
          {course.courseTitle}
        </h3>
        <p className="text-sm truncate">{course.educator?.name}</p>
        <p className="text-xs text-end">{course.category}</p>

        {/* rating */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-medium ">{rating.toFixed(1)}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, idx) => (
              <img
                key={idx}
                src={idx < Math.floor(rating) ? assets.star : assets.star_blank}
                alt="star"
                className="w-4 h-4"
              />
            ))}
          </div>
          <span className="text-xs text-[#565656]">
            ({course.courseRatings.length})
          </span>
        </div>

        {/* preço */}
        <div className="mt-3 flex justify-end">
          <p className="text-base font-semibold ">
            {currency}
            {discountedPrice}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
