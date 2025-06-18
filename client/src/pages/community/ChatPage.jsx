import React, { useState } from "react";
import { useParams } from "react-router-dom";
// import useAuthUser from "../hooks/useAuthUser";
// import { useQuery } from "@tanstack/react-query";
// import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  // const { authUser } = useAuthUser();

  // const { data } = useQuery({
  //   queryKey: ["streamToken"],
  //   queryFn: getStreamToken,
  //   enabled: !!authUser, // only fetch if authUser is available
  // });

  // const tokenData = data;

  // useEffect(() => {
  //   const initChat = async () => {
  //     if (!tokenData || !authUser) return;

  //     try {
  //       console.log("Initializing chat client...");

  //       const client = StreamChat.getInstance(STREAM_API_KEY); // create a client with the API key from STREAM

  //       await client.connectUser(
  //         {
  //           id: authUser._id,
  //           name: authUser.fullName,
  //           image: authUser.profilePic,
  //         },
  //         tokenData
  //       );

  //       const channelId = [authUser._id, targetUserId].sort().join("-"); // create a channel id between the current user and the target user

  //       const currentChannel = client.channel("messaging", channelId, {
  //         members: [authUser._id, targetUserId],
  //       });

  //       await currentChannel.watch(); // watch the channel

  //       setChatClient(client);
  //       setChannel(currentChannel);
  //     } catch (error) {
  //       console.error("Error in initializing chat:", error);
  //       toast.error("Error in initializing chat:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   initChat();
  // }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`; // generate the call url, using the channel id

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
