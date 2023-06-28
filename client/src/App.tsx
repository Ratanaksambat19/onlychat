import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import NotFoundPage from './pages/404';
import ChatPage from './pages/Chat';
import HomePage from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/groups/:groupId' element={<ChatPage />} />
        <Route path='/groups/:groupId/404' element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
