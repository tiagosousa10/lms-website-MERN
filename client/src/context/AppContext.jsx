import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userFriends, setUserFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  console.log("🚀 ~ AppContextProvider ~ friendRequests:", friendRequests);

  //Fetch all courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Fetch user data
  const fetchUserData = async () => {
    if (user.publicMetadata.role === "educator") {
      setIsEducator(true);
    }

    try {
      const token = await getToken();
      console.log("🚀 ~ fetchUserData ~ token:", token);
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to calculate average rating of course
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }

    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating; // means that rating is an object with a rating property
    });
    return Math.floor(totalRating / course.courseRatings.length);
  };

  // Calculate Course Chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  //calculate course duration
  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  //calculate no of lectures in course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });

    return totalLectures;
  };

  //Fetch user enrolled courses
  const fetchUserEnrolledCourses = async () => {
    const token = await getToken();

    const { data } = await axios.get(
      backendUrl + "/api/user/enrolled-courses",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("🚀 ~ fetchUserEnrolledCourses ~ data:", data);

    if (data.success) {
      setEnrolledCourses(data.enrolledCourses.reverse());
    } else toast.error(data.message);
  };

  // --------------------COMMUNITY AND CHATS---------------------
  const getUserFriends = async () => {
    const token = await getToken();

    const response = await axios.get(backendUrl + "/api/community/friends", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response) {
      setUserFriends(response.data);
    }

    return response.data;
  };

  const getRecommendedUsers = async () => {
    const response = await axios.get(backendUrl + "/community");
    return response.data;
  };

  const getOutgoingFriendReqs = async () => {
    const response = await axios.get(
      backendUrl + "/community/outgoing-friend-requests"
    );
    return response.data;
  };

  const sendFriendRequest = async (userId) => {
    const response = await axios.post(
      backendUrl + `/community/friend-request/${userId}`
    );
    return response.data;
  };

  const getFriendRequests = async () => {
    const token = await getToken();
    const response = await axios.get(
      backendUrl + "/api/community/friend-requests",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response) {
      setFriendRequests(response.data);
    }

    return response.data;
  };

  const acceptFriendRequest = async (requestId) => {
    const token = await getToken();

    const response = await axios.put(
      backendUrl + `/community/friend-request/${requestId}/accept`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const getStreamToken = async () => {
    const response = await axios.get(backendUrl + "/chat/token");
    return response.data.token;
  };

  useEffect(() => {
    fetchAllCourses();
    getUserFriends();
    getFriendRequests();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);

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
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
    fetchUserData,
    getUserFriends,
    getRecommendedUsers,
    getOutgoingFriendReqs,
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    getStreamToken,
    userFriends,
    setUserFriends,
    friendRequests,
    setFriendRequests,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
