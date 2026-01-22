import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TicTacToe from './Components/TicTacToe'
import GridPageLayout from './Components/GridPageLayout'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginPage from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import DragDrop from './Components/DragDrop'
import StoryBook from './Pages/StoryBook';
import Register from './Pages/Register';
import ResponsiveLayout from './Components/ResponsiveLayout'
import Game from './Pages/Game'
import ImageGallery from './Components/ImageGallery'
import InputTag from './InterviewMocks/Mock1/component/InputTag'
import ProductList from './WebAPIS/SystemDesign/ProductList'
import DebounceSearch from './InterviewMocks/Mock2/browser-coding/components/DebounceSearch'
import MockComponents from './InterviewMocks'
import InfiniteScroll from './InterviewMocks/Mock4/Components/InfiniteScroll'
import DebouncedSearch from './adobe/components/DebouncedSearch'
import ThrottledInfiniteScroll from './adobe/components/ThrottledInfiniteScroll'
import TableSearch from './adobe/components/Table/TableSearch'
import GridLayout from './adobe/layouts/GridLayout'
import TicTacToeGame from './adobe/system-design/TicTacToe/TicTacToe'
import NewsFeed from './adobe/system-design/NewsFeed'
import SystemDesign from './adobe/system-design'
import PairGame from './adobe/system-design/PairsGame'
import ProgressBar from './adobe/system-design/Progressbar'
import Carousel from './adobe/system-design/Carousel'
import { slidesData } from './adobe/system-design/Carousel/utils'
import AnalyticsDashboardPage from './adobe/system-design/AnalyticsDashboard/AnalyticsDashboardPage'
import DragDropPage from "./adobe/system-design/DragDrop";
import FileUplaod from './adobe/system-design/FileUpload/FileUpload'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div className='app-container'>
      {/* <div> */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<GridPageLayout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/drag-drop" element={<DragDrop />} />
          <Route path="/story-book" element={<StoryBook />} />
          <Route path="/register" element={<Register />} />
          <Route path="/responsive" element={<ResponsiveLayout />} />
          <Route path="/game" element={<Game />} />
          <Route path="/image-gallery" element={<ImageGallery />} />
          <Route path="/mock/tag" element={<InputTag /> } />
          <Route path="/products" element={<ProductList /> } />
          <Route path="/mock/2" element={<DebounceSearch /> } />
          <Route path="/mock" element={<MockComponents />} />
          <Route path="/github-users" element={<InfiniteScroll />} />

          <Route path="/adobe/debounce/search" element={<DebouncedSearch />} />
          <Route path="/adobe/throttle/infinite-scroll" element={<ThrottledInfiniteScroll />} />
          <Route path="/adobe/debounce/table/search" element={<TableSearch />} />
          <Route path="/adobe/grid" element={<GridLayout />} />
          <Route path="/adobe/game" element={<TicTacToeGame />} />
          <Route path="/adobe/newsfeed" element={<NewsFeed />} />
          <Route path="/adobe/system-design" element={<SystemDesign />} />
          <Route path="/adobe/progressbar" element={<ProgressBar progress={70} />} />
          <Route path="/adobe/pair-game" element={<PairGame n={5} cards={[1,5,8,4,2,2,3,4,2,3,0,7,9,5,3,2,6,4,8,7,0,6,9,1,3]} />} />
          <Route path="/adobe/carousel" element={<Carousel slides={slidesData} startIndex={0} />} />
          <Route path="/adobe/analytics/dashboard" element={<AnalyticsDashboardPage />} />
          <Route path="/adobe/drapdrop" element={<DragDropPage />} />
          <Route path="/adobe/file-upload" element={<FileUplaod />} />

        </Routes>
      </div>
    </Router>
  )
}

export default App;
