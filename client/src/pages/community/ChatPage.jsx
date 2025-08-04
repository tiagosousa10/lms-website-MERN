import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
import { toast } from "react-toastify";
import ChatLoader from "../../components/community/ChatLoader";
import CallButton from "../../components/community/CallButton";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import MD5 from "crypto-js/md5";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  console.log("🚀 ~ ChatPage ~ targetUserId:", targetUserId);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userData, getStreamToken } = useContext(AppContext);

  const getToken = async () => {
    try {
      const token = await getStreamToken();
      console.log("🚀 ~ getToken ~ token:", token);
      return token;
    } catch (error) {
      console.error("Error in getting stream token:", error);
      toast.error("Error in getting stream token:", error);
    }
  };

  useEffect(() => {
    const initChat = async () => {
      if (!userData) return;

      try {
        console.log("Initializing chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY); // create a client with the API key from STREAM

        await client.connectUser(
          {
            id: userData._id,
            name: userData.fullName,
            image: userData.profilePic,
          },
          await getToken()
        );

        const channelId = MD5(
          [userData._id, targetUserId].sort().join("-")
        ).toString();

        const currentChannel = client.channel("messaging", channelId, {
          members: [userData._id, targetUserId],
        });

        await currentChannel.watch(); // watch the channel

        setChatClient(client);
        setChannel(currentChannel);
      } catch (error) {
        console.error("Error in initializing chat:", error.message);
        toast.error("Error in initializing chat:", error.message);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [getToken, userData, targetUserId]);

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
