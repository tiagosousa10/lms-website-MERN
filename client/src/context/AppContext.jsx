import {createContext, useEffect, useState} from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

   const currency = import.meta.env.VITE_CURRENCY
   const navigate = useNavigate()

   const [allCourses,setAllCourses] = useState([])
   const [isEducator,setIsEducator] = useState(true)
   const [enrolledCourses, setEnrolledCourses] = useState([])
   console.log("🚀 ~ AppContextProvider ~ enrolledCourses:", enrolledCourses)

   //Fetch all courses
   const fetchAllCourses = async () => {
      setAllCourses(dummyCourses)
   }

   // Function to calculate average rating of course
   const calculateRating = (course) => {
      if(course.courseRatings.length === 0) {
         return 0
      } 

      let totalRating = 0
      course.courseRatings.forEach((rating) => {
         totalRating += rating.rating // means that rating is an object with a rating property
      })
      return totalRating / course.courseRatings.length
   }

   // Calculate Course Chapter time
   const calculateChapterTime = (chapter) => {
      let time = 0;
      chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
      return humanizeDuration(time * 60 * 1000, {units: ['h','m']})
   }

   //calculate course duration
   const calculateCourseDuration = (course) => {
      let time = 0
      
      course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration ))

      return humanizeDuration(time * 60 * 1000, {units: ['h','m']})

   }

   //calculate no of lectures in course
   const calculateNoOfLectures = (course) => {
      let totalLectures = 0;
      course.courseContent.forEach((chapter) => {
         if(Array.isArray(chapter.chapterContent)) {
            totalLectures += chapter.chapterContent.length
         }
      })

      return totalLectures;
   }

   //Fetch user enrolled courses

   const fetchUserEnrolledCourses = async () => {
      setEnrolledCourses(dummyCourses)
   }


   useEffect(() => {
      fetchAllCourses()
      fetchUserEnrolledCourses()
   },[])

   
   const value = {
      currency,
      allCourses, 
      navigate,
      calculateRating, 
      isEducator,
      setIsEducator,
      calculateChapterTime,
      calculateCourseDuration,
      calculateNoOfLectures,
      enrolledCourses,
      setEnrolledCourses,
      fetchUserEnrolledCourses,
   }

   return (
      <AppContext.Provider value={value}>
         {props.children}
      </AppContext.Provider>
   )


}
