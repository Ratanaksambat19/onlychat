import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Button, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { createGroupChatAPI } from '../axios/createGroupChat';

type Group = {
  id: string;
  name: string;
  hostId: string;
  // Add other properties if necessary
};

function HomePage() {
  const [isGenerate, setIsGenerate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [givenTime, setGivenTime] = useState(0);

  const handleGenerateLink = async () => {
    const groupName = inputRef.current?.value ?? '';
    if (groupName === '') {
      setErrorMessage('Please enter a group name');
      return false;
    }
    try {
      console.log(groupName);
      console.log(givenTime);
      const createGroupChatAPIresponse = await createGroupChatAPI(groupName, givenTime);
      if (createGroupChatAPIresponse) {
        console.log(createGroupChatAPIresponse.data);
        setIsGenerate(true);
        setGroup(createGroupChatAPIresponse.data as Group);
        const last_index = createGroupChatAPIresponse.data.groupChats.length - 1;
        document.cookie = `UserId=${createGroupChatAPIresponse.data.groupChats[last_index].id}; path=/; SameSite=None; Secure;`;
      } else {
        console.log('Error fetching data');
      }
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const [errorMessage, setErrorMessage] = useState('');

  const handleCopy = () => {
    const textToCopy = document.getElementById('text-copy');
    const text = textToCopy?.textContent;
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setErrorMessage('Text copied to clipboard');
        })
        .catch(error => {
          setErrorMessage('Failed to copy text');
          console.log('Error fetching data', error);
        });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Box textAlign='center'>
        <img alt='logo' style={{ width: '90%', maxWidth: '600px' }} src={String(logo)} />
        <Box>
          {!isGenerate ? (
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              sx={{ '& > :not(style)': { m: 1 } }}
            >
              <TextField
                inputRef={inputRef}
                type='text'
                variant='outlined'
                placeholder='Group Name'
              />

              <TextField
                value={givenTime}
                onChange={event => setGivenTime(Number(event.target.value))}
                type='number' // Change input type to "number"
                variant='outlined'
                placeholder='Chat Duration'
                inputProps={{ min: '0' }}
              />
              <Button
                variant='contained'
                style={{
                  height: '56px',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  WebkitTextFillColor: 'white',
                  color: '#5BA5DB',
                }}
                onClick={handleGenerateLink}
              >
                Generate the Link
              </Button>
            </Box>
          ) : (
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              bgcolor='#cbeaff'
              padding='8px'
              borderRadius='10px'
              marginTop='1rem'
            >
              <h3 style={{ fontWeight: 'bold' }}>Link:</h3>
              <Link id='text-copy' to={`/groups/${group?.id}`}>
                http://localhost:3000/groups/{group?.id.toString()}
              </Link>
              <Button onClick={handleCopy}>
                <ContentCopyIcon />
              </Button>
            </Box>
          )}
        </Box>
        <Box display='flex' justifyContent='center' marginTop='1rem'>
          {errorMessage.length > 0 && <p style={{ color: 'green' }}>{errorMessage}</p>}
        </Box>
      </Box>
    </div>
  );
}

export default HomePage;
