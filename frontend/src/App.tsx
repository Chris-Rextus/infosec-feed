import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FeedScreen from './features/feed'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FeedScreen />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App;
