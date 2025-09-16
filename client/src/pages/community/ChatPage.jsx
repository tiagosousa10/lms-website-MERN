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
import "stream-chat-react/dist/css/v2/index.css";

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

        //need md5 because the channel id must be have 64 characters
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
      const callUrl = `${window.location.origin}/community/call/${channel.id}`; // generate the call url, using the channel id

      channel.sendMessage({
        text: `📞 Iniciei uma vídeo-chamada! Junta-te aqui: ${callUrl}`,
      });

      toast.success("✅ Link da videochamada enviado com sucesso!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="bg-white min-h-[100svh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <h1 className="text-3xl font-bold mb-6 md:mb-8">Chat</h1>

        <div className="border border-[#547792] rounded-lg p-2 sm:p-4">
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <div className="w-full relative">
                <CallButton handleVideoCall={handleVideoCall} />
                <Window>
                  <ChannelHeader />
                  <MessageList /> {/* mantém hierarquia recomendada */}
                  <MessageInput focus />
                </Window>
              </div>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
