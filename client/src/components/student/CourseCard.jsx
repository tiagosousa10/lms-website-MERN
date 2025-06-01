import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      to={"/course/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="card bg-base-100 w-full sm:w-80 shadow-sm hover:shadow-md transition"
    >
      <figure>
        <img
          src={course.courseThumbnail}
          alt={course.courseTitle}
          className="h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body p-4 border">
        <h2 className="card-title text-base">{course.courseTitle}</h2>
        <p className="text-sm text-gray-500">{course.educator?.name}</p>

        <div className="flex items-center gap-2">
          <p className="text-sm">{calculateRating(course)}</p>
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <img
                className="w-4 h-4"
                key={index}
                src={
                  index < Math.floor(calculateRating(course))
                    ? assets.star
                    : assets.star_blank
                }
                alt="rating"
              />
            ))}
          </div>
          <p className="text-xs text-gray-400">
            ({course.courseRatings.length})
          </p>
        </div>

        <div className="card-actions justify-end mt-2">
          <p className="text-base font-semibold text-gray-800">
            {currency}
            {(
              course.coursePrice -
              (course.discount * course.coursePrice) / 100
            ).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
