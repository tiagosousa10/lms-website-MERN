import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

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
      className="card bg-base-100 w-full sm:w-72 shadow transition-transform hover:-translate-y-1 hover:shadow-lg rounded-lg overflow-hidden "
    >
      <figure className="h-40 overflow-hidden">
        <img
          src={course.courseThumbnail}
          alt={course.courseTitle}
          className="w-full h-full object-cover"
        />
      </figure>

      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-base-content truncate">
          {course.courseTitle}
        </h2>
        <p className="text-sm text-base-content/60 truncate">
          {course.educator?.name}
        </p>

        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-base-content">
            {rating.toFixed(1)}
          </span>
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
          <span className="text-xs text-base-content/50">
            ({course.courseRatings.length})
          </span>
        </div>

        <div className="flex justify-end items-center">
          <p className="text-base font-semibold text-base-content">
            {currency}
            {discountedPrice}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
