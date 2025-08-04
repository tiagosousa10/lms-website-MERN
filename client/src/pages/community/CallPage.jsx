import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { AppContext } from "../../context/AppContext";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [tokenData, setTokenData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { userData, getStreamToken } = useContext(AppContext);

  const getToken = async () => {
    setIsLoading(true);
    try {
      const token = await getStreamToken();
      setTokenData(token);
      console.log("🚀 ~ getToken ~ token:", token);
      return token;
    } catch (error) {
      console.error("Error in getting stream token:", error);
      toast.error("Error in getting stream token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getToken();
  }, [userData]);

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData || !userData || !callId) return;

      try {
        console.log("Initializing call client...");

        const user = {
          id: userData._id,
          name: userData.fullName,
          image: userData.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.log("Error in initCall", error);
        toast.error("Could not join the call. Please try again");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, userData, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/"); // go back to home page

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
