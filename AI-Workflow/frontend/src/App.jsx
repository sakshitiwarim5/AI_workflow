import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WorkSpace from './pages/WorkSpace';

export default function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace" element={<WorkSpace />} />
      </Routes>
    </div>
  );
}
