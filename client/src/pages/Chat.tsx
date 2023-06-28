import { AppBar, Box, Button, Typography } from '@mui/material';
import { createBrowserHistory } from 'history';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SockJS from 'sockjs-client/dist/sockjs';
import { deleteGroupChatByIdAPI } from 'src/axios/deleteGroupChatById';
import { getAndUpdateGroupMemberAPI } from 'src/axios/getAndUpdateGroup';
import Stomp from 'stompjs';
import logo from '../assets/images/logo.png';
import SendIcon from '../assets/images/send.png';
import { createChatAPI } from '../axios/createChat';
import { getGroupChatByIdAPI } from '../axios/getGroupChatById';

const history = createBrowserHistory();
type Chat = {
  id: string;
  message: string;
  sender: {
    id: string;
    username: string;
    profileImage: string;
  };
  timestamp: [number, number, number, number, number, number, number];
};

interface GroupChat {
  username: string;
  anonymous: boolean;
  timestamp: number[];
  profileImage: string;
  id: string;
}

function ChatPage() {
  // Get UserId from Cookie
  function getCookieValue(cookieName: string) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${cookieName}=`)) {
        return cookie.substring(cookieName.length + 1);
      }
    }
    return null;
  }

  // Fetch GroupChat Data
  const [userId, setUserId] = useState(getCookieValue('UserId')); // user = groupchat.hostid
  const { groupId } = useParams();
  const [userCount, setUserCount] = useState(0);
  const [Group, setGroup] = useState<{
    // userCount: number;
    name: string;
    hostId: string;
    chats: Chat[];
    groupChats: GroupChat[];
  } | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      if (userId === null) {
        setUserId('Not Found');
      }
      try {
        console.log('called1');
        if (groupId && userId) {
          const getGroupChatAPIResponse = await getGroupChatByIdAPI(groupId);
          if (getGroupChatAPIResponse) {
            console.log('called2');
            const isUserInGroup = getGroupChatAPIResponse.data.groupChats.some(
              (user: GroupChat) => user.id === userId,
            );
            console.log(userId);
            console.log('isUserInGroup', isUserInGroup);
            if (isUserInGroup) {
              console.log('called3');
              const sortedChats = getGroupChatAPIResponse.data.chats.sort((a: Chat, b: Chat) => {
                const [yearA, monthA, dayA, hourA, minuteA, secondA] = a.timestamp;
                const [yearB, monthB, dayB, hourB, minuteB, secondB] = b.timestamp;
                if (yearA !== yearB) {
                  return yearA - yearB;
                }
                if (monthA !== monthB) {
                  return monthA - monthB;
                }
                if (dayA !== dayB) {
                  return dayA - dayB;
                }
                if (hourA !== hourB) {
                  return hourA - hourB;
                }
                if (minuteA !== minuteB) {
                  return minuteA - minuteB;
                }
                return secondA - secondB;
              });
              const sortedGroupChats = getGroupChatAPIResponse.data.groupChats.sort(
                (a: GroupChat, b: GroupChat) => {
                  const [yearA, monthA, dayA, hourA, minuteA, secondA] = a.timestamp;
                  const [yearB, monthB, dayB, hourB, minuteB, secondB] = b.timestamp;
                  if (yearA !== yearB) {
                    return yearA - yearB;
                  }
                  if (monthA !== monthB) {
                    return monthA - monthB;
                  }
                  if (dayA !== dayB) {
                    return dayA - dayB;
                  }
                  if (hourA !== hourB) {
                    return hourA - hourB;
                  }
                  if (minuteA !== minuteB) {
                    return minuteA - minuteB;
                  }
                  return secondA - secondB;
                },
              );
              const updatedGroup = {
                ...getGroupChatAPIResponse.data,
                chats: sortedChats,
                groupChats: sortedGroupChats,
              };
              setGroup(updatedGroup);
              setUserCount(updatedGroup.userCount);
              console.log('updatedGroup', updatedGroup);
            } else {
              try {
                console.log('called4');
                const UpdateGroupMemberAPIResponse = await getAndUpdateGroupMemberAPI(
                  groupId,
                  userId,
                );
                if (UpdateGroupMemberAPIResponse && UpdateGroupMemberAPIResponse.data.user) {
                  console.log('UpdateGroupMemberAPIResponse', UpdateGroupMemberAPIResponse.data);
                  setUserId(UpdateGroupMemberAPIResponse.data.user.id);
                  document.cookie = `UserId=${UpdateGroupMemberAPIResponse.data.user.id}; path=/; SameSite=None; Secure;`;
                  console.log('success');
                }
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [userId]);

  // const showChatMessage = (id: string, message: string, username: string, profileImage: string) => {
  //   setMessages(prevMessages =>
  //     prevMessages.concat({
  //       id,
  //       message,
  //       sender: { id, username, profileImage },
  //       timestamp: [0, 0, 0, 0, 0, 0, 0],
  //     }),
  //   );
  // };

  const showChatMessage = (id: string, message: string, username: string, profileImage: string) => {
    setMessages(prevMessages => {
      // Check if the message already exists in the array
      const messageExists = prevMessages.some(msg => msg.id === id && msg.message === message);
      if (messageExists) {
        return prevMessages; // Return the current array without adding the duplicate message
      }
      // Add the new message to the array
      return [
        ...prevMessages,
        {
          id,
          message,
          sender: { id, username, profileImage },
          timestamp: [0, 0, 0, 0, 0, 0, 0],
        },
      ];
    });
  };

  // Socket
  const [messages, setMessages] = useState<Chat[]>([]);
  let stompClient: Stomp.Client | null = null;
  const connect = () => {
    const socket: any = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame: Stomp.Frame | undefined) => {
      console.log('Connected: ' + frame);
      stompClient?.subscribe('/topic/group/' + groupId, (message: Stomp.Message) => {
        const chatMessage: Chat = JSON.parse(message.body || '');
        showChatMessage(
          chatMessage.sender.id,
          chatMessage.message,
          chatMessage.sender.username,
          chatMessage.sender.profileImage,
        );
      });
    });
  };

  const disconnect = () => {
    if (stompClient !== null && stompClient.connected) {
      stompClient.disconnect(() => {
        console.log('Disconnected');
      });
    }
  };
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  const messageInput = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message_Input = messageInput.current?.value ?? '';
    if (message_Input.trim() !== '' && userId && groupId) {
      try {
        const createChatResponse = await createChatAPI(groupId, userId, message_Input);
        if (createChatResponse) {
          console.log('createChatResponse', createChatResponse.data);
          messageInput.current!.value = '';
        } else {
          console.log('Error fetching data');
        }
      } catch (error) {
        console.log('Error fetching data', error);
      }
    }
  };

  // Scroll to bottom
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [messages]);

  // Handle Enter key press submit
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleEndChat = async () => {
    try {
      if (groupId) {
        const endGroupChatAPIResponse = await deleteGroupChatByIdAPI(groupId);
        if (endGroupChatAPIResponse) {
          console.log('endGroupChatAPIResponse', endGroupChatAPIResponse.data);
          history.push('/');
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Renderreturn (
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#F9F9F9',
      }}
    >
      {/* ChatBar */}
      <div>
        <AppBar
          sx={{
            height: 100,
            bgcolor: '#F9F9F9',
            fontSize: '0.875rem',
            fontWeight: '700',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: 80,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: '10px',
            }}
          >
            <Box component={Link} to='/' sx={{ position: 'absolute', left: '16px' }}>
              <img src={logo} alt='Logo' height={100} />
            </Box>

            <Box
              sx={{
                textAlign: 'center',
              }}
            >
              <Typography
                variant='h6'
                sx={{
                  color: '#673ab7',
                }}
              >
                {Group?.name}
              </Typography>
              {/* Display number of people - 1 */}
              <Typography variant='subtitle2' sx={{ color: '#5F5F5F' }}>
                {userCount} People
              </Typography>
            </Box>

            {userId === Group?.hostId && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '16px',
                  transform: 'translateY(-50%)',
                }}
              >
                <Button
                  onClick={handleEndChat}
                  variant='contained'
                  sx={{ cursor: 'pointer', bgcolor: '#b2102f', '&:hover': { bgcolor: '#ab003c' } }}
                >
                  End Chat
                </Button>
              </Box>
            )}
          </Box>
        </AppBar>
      </div>

      {/* End ChatBar */}

      {/* Start Message popup */}
      <div
        ref={chatContainerRef}
        style={{
          overflowY: 'auto',
          marginBottom: '120px',
        }}
      >
        <Box
          style={{
            display: 'block',
            scrollBehavior: 'auto',
            flex: 1,
            overflowY: 'auto',
            marginLeft: '20px',
            marginTop: '100px',
            marginBottom: '110px',
          }}
        >
          {([...(Group?.chats || []), ...(messages || [])] as Chat[]).map((item, index) => (
            <Box
              style={{
                display: 'flex',
                justifyContent: item.sender.id === userId ? 'flex-end' : 'flex-start',
                minHeight: 50,
                marginInline: 2,
              }}
              key={index}
            >
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: 30,
                }}
              >
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: item.sender.id === userId ? 'flex-end' : 'flex-start',
                  }}
                >
                  {item.sender.id !== userId && (
                    <img
                      src={item.sender.profileImage}
                      style={{
                        width: 30,
                        marginRight: 20,
                        marginTop: 20,
                      }}
                      alt='profile'
                    />
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: item.sender.id === userId ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Typography
                        variant='caption'
                        sx={{
                          color: 'gray',
                          marginInline: 0,
                          minWidth: 'auto',
                          width: 'auto',
                          display: 'inline-block',
                          maxWidth: '100%',
                          marginRight: 0,
                        }}
                      >
                        {item.sender.id === userId ? 'You' : item.sender.username}
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: item.sender.id === userId ? '#0091ea' : '#CCE0EE',
                          minHeight: 50,
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px 15px',
                          borderRadius: 5,
                          minWidth: 'auto',
                          maxWidth: '100%',
                          marginTop: 0,
                        }}
                      >
                        <Typography
                          variant='body1'
                          sx={{
                            width: 'auto',
                            display: 'inline-block',
                            overflowWrap: 'break-word',
                            color: item.sender.id === userId ? '#f5f5f5' : '#212121',
                          }}
                        >
                          {item.message}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {item.sender.id === userId && (
                    <img
                      src={item.sender.profileImage}
                      style={{
                        width: 30,
                        marginLeft: 20,
                        marginTop: 20,
                        marginRight: 20,
                      }}
                      alt='profile'
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </div>
      {/* End Message pop up */}

      {/* Start bar and Send Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          justifyContent: 'space-between',
          alignContent: 'center',
          padding: '20px',
          borderTop: '1px solid #ccc',
          background: '#F9F9F9',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            width: '100%',
            margin: '4px 0',
            display: 'flex',
            padding: '2px 10%',
            boxSizing: 'border-box',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              marginRight: 20,
            }}
          >
            <input
              ref={messageInput}
              onKeyPress={handleKeyPress}
              type='text'
              placeholder='Write a message...'
              style={{
                width: '100%',
                backgroundColor: '#eeeeee',
                borderRadius: '10px',
                padding: '5px 10px',
                outline: 'none',
                border: '2px solid #38B6FF',
                fontFamily: 'Arial, sans-serif',
                fontSize: 14,
                lineHeight: 2.5,
                minWidth: 'auto',
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            style={{
              // width: 50,
              display: 'flex',
              justifyContent: 'flex-end',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <img
              src={SendIcon}
              style={{ width: 'auto', height: 40, verticalAlign: 'middle', fontSize: 60 }}
              alt='send'
            />
          </button>
        </div>
      </div>
      {/* End Of Bar and Send Button */}
    </div>
  );
}
export default ChatPage;
