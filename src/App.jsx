import { useEffect, useRef, useState } from 'react'
import './App.css'
import { editorSvg, homeSvg, denemeSvg, plusSvg } from './Svg'
import { MainPage } from './Components/MainPage'
import { Editor } from './Components/Editor'
import { PostDetail } from './Components/PostItem'

function App() {
  const [currentPage, setCurrentPage] = useState(<MainPage changePage={changePage} />)
  const [currPage, setCurrPage] = useState("main")

  function changePage(id) {
    if (id == null) {
      setCurrentPage(<MainPage setCurrPage={setCurrPage} changePage={changePage} />)
      return
    } else if (id == 0) {
      setCurrentPage(<Editor />)
      return
    }
    setCurrentPage(<PostDetail changePage={changePage} id={id} />)
  }

  function handlePages(direction) {
    if (direction == "editor") {
      changePage(0)
      setCurrPage("editor")
    } else if (direction == "main") {
      changePage(null)
      setCurrPage("main")
    }
  }

  return (
    <>
      <div className="header">
        <div className="header-content">
        <h1>Bee <span style={{ fontSize: "1.5rem" }}> / </span> <span onClick={() => {
          changePage(null); setCurrPage("main")
        }} className='blog-h1'>Blog</span> {
            currPage == "editor" && <><span style={{ fontSize: "1.2rem" }}> / </span><span className='editor-h1'>Editor</span></>
          }</h1>
        <button
          className='btn main-btn'
          onClick={() => {
            handlePages(currPage == "main" ? "editor" : "main");
          }}>
          {currPage == "main" ? editorSvg : homeSvg}
        </button>
        </div>
        
      </div>

        {currentPage}
      <footer>
        Made with ❤ by Bee
      </footer>
    </>
  )
}







export default App
