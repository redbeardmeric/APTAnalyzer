import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GroupDetailPage from './pages/GroupDetailPage';

function App() {
  return (
    <div className="h-full">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/group/:groupId" element={<GroupDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
