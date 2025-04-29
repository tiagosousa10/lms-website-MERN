import {createContext, useEffect, useState} from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

   const currency = import.meta.env.VITE_CURRENCY
   const navigate = useNavigate()

   const [allCourses,setAllCourses] = useState([])

   //Fetch all courses
   const fetchAllCourses = async () => {
      setAllCourses(dummyCourses)
   }

   // Function to calculate average rating of course
   const calculateRating = (course) => {
      if(course.courseRating.length === 0) {
         return 0
      } 

      let totalRating = 0
      course.courseRating.forEach((rating) => {
         totalRating += rating.rating // means that rating is an object with a rating property
      })
      return totalRating / course.courseRating.length

   }

   useEffect(() => {
      fetchAllCourses()
   },[])

   const value = {
      currency,
      allCourses, 
      navigate,
      calculateRating
   }

   return (
      <AppContext.Provider value={value}>
         {props.children}
      </AppContext.Provider>
   )


}
