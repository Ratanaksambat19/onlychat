import { AppBar, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from './../assets/images/logo.png';

const ChatBar = () => {
  // const handleClick = () => {
  //   // Handle button click logic here
  //   console.log('Button clicked!');
  // };

  return (
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
            display: 'flex',
            justifyContent: 'space-between',
            p: 1,
            m: 1,
            alignItems: 'center',
          }}
          height={80}
        >
          <Box component={Link} to='/'>
            <img src={logo} alt='Logo' height={100} />
          </Box>

          {/* <Box flexGrow={1} textAlign='center'>
            <Typography style={{ color: '#E8006F' }}>Chat App</Typography>
          </Box> */}

          {/* <Box>
            <div style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
              {Group?.name}
            </div>
            <p style={{ fontSize: 10, fontWeight: 500, color: '#5F5F5F', textAlign: 'center' }}>
              {Group?.userCount} People
            </p>
          </Box> */}

          <Box>
            <Button
              component={Link}
              to='/'
              style={{ backgroundColor: '#E8006F', color: '#ffffff', cursor: 'pointer' }}
            >
              End Chat
            </Button>
          </Box>
        </Box>
      </AppBar>
    </div>
  );
};

export default ChatBar;
