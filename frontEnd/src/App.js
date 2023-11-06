
import './App.css';
import { Routes,Route } from 'react-router-dom';
import Home from './components/Home';
import Chats from './components/Chats';

function App() {
  return (
    <div className="App">
    <Routes>
        <Route path='/' element={<Home/>} exact></Route>
        <Route path="/chats" element={<Chats/>}exact></Route>
    </Routes>
    </div>
    
  );
}

export default App;
