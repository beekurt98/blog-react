import { useEffect, useRef, useState } from 'react'
import './App.css'
import { editorSvg, homeSvg, denemeSvg, plusSvg } from './Svg'

const url = 'https://bernakurt.pythonanywhere.com/posts'

function App() {
  const [currentPage, setCurrentPage] = useState(<MainPage changePage={changePage} />)
  const [currPage, setCurrPage] = useState("main")

  function changePage(id) {
    if (id == null) {
      setCurrentPage(<MainPage setCurrPage={setCurrPage} changePage={changePage} />)
      return
    } else if (id == 0) {
      setCurrentPage(<Editor setCurrPage={setCurrPage} changePage={changePage} />)
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
          {currPage == "main" ? homeSvg : editorSvg}
        </button>
      </div>
      {/* <h1>Bee / Blog</h1> */}
      <div className="current-page">

        {currentPage}
      </div>
    </>
  )
}

function MainPage({ changePage, setCurrPage }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function getData() {
      const data = await fetch(url).then(r => r.json())
      setPosts(data)
    }

    getData()
  }, [])

  return (
    <>

      <div className="posts-div">
        {
          posts.map((post, index) => {
            return <div onClick={() => changePage(post.id)} key={index * 99} className="post-item">
              <h2>{post.title}</h2>
              {/* <p>{post.created}</p> */}
              <p> {post.summary} </p>
            </div>
          })
        }
      </div>
    </>
  )
}

function Editor({ changePage, setCurrPage }) {
  const [posts, setPosts] = useState([])
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [imgUploaded, setImgUploaded] = useState(false)

  const addNewRef = useRef(null)
  const editRef = useRef(null)

  useEffect(() => {
    async function getData() {
      const data = await fetch(url).then(r => r.json())
      setPosts(data)
    }
    getData()
  }, [])

  useEffect(() => {
    async function getData() {
      const data = await fetch(url + '/' + selectedPostId).then(r => r.json())
      setSelectedPost(data)
    }
    getData()
  }, [selectedPostId])

  function handleEditSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const formObj = Object.fromEntries(formData)

    fetch(url + '/' + selectedPostId,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(formObj)
      }
    )

    posts[posts.findIndex(x => x.id == selectedPostId)] = formObj
    setPosts([...posts])
    e.target.reset()
    editRef.current.close()
  }

  async function handleNewSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const formObj = Object.fromEntries(formData)
    const newPost = await fetch(url,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(formObj)
      })
    setPosts([...posts, newPost])
    addNewRef.current.close()
  }

  async function handleDelete(e, id) {
    e.preventDefault()
    console.log(url + "/" + id)
    fetch(url + "/" + id,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE'
      })
    setPosts(posts.filter(x => x.id != id))
  }

  return (
    <>
      {/* <button className='btn' onClick={(e) => { e.preventDefault(); setCurrPage("editor"); changePage(null) }}>{homeSvg} </button> */}
      <button className='btn new-btn' onClick={() => addNewRef.current.showModal()}>{plusSvg}</button>
      <div className="posts-editable">
        {
          posts.map((post, index) => {
            return <>
              <div className="editable-post-container">

                <div key={index * 34} className="post-editable">
                  <h2>{post.title}</h2>
                  {/* <p>{post.summary}</p> */}
                  <p>Date: {post.created}</p>
                </div>

                <div className="btns edit-btns">
                  <button className='btn' onClick={() => { editRef.current.showModal(); setSelectedPostId(post.id) }}>{editorSvg}</button>
                  <button className='btn' onClick={(e) => { confirm("Are you sure?") && handleDelete(e, post.id) }}>{denemeSvg}</button>
                </div>
              </div>
            </>
          })
        }
      </div>
      <dialog className='dialog-edit' ref={addNewRef}>
        <div className="dialog-header">
          <div className='dialog-h3'><h3>Yeni</h3></div>
          <button onClick={() => addNewRef.current.close()} className="btn">X</button>
        </div>
        <form onSubmit={handleNewSubmit} className='form-dialog' action="dialog">
          <input autoComplete='off' type="text" name="title" placeholder='title' />
          <input autoComplete='off' type="text" name="summary" placeholder='summary' />
          <input onChange={(e) => console.log(e.target.value)} autoComplete='off' type="text" name="imageUrl" placeholder='image url' />
          {/* {imgUploaded && <img className='preview' src={selectedPost?.imageUrl} />} */}
          <textarea autoComplete='off' name="body" placeholder='text'></textarea>
          <input className='btn submit-btn' type="submit" value="Add New +" />
        </form>
      </dialog>
      <dialog className='dialog-edit' ref={editRef}>
        <div className="dialog-header">
          <div className='dialog-h3'><h3>Düzenle</h3></div>
          <button onClick={() => editRef.current.close()} className="btn">X</button>
        </div>
        {/* setImgUploaded(true) */}
        <form onSubmit={handleEditSubmit} className='form-dialog' action="dialog">
          <input autoComplete='off' type="text" name="title" placeholder='title' defaultValue={selectedPost?.title} />
          <input autoComplete='off' type="text" name="summary" placeholder='summary' defaultValue={selectedPost?.summary} />
          <input autoComplete='off' type="text" name="imageUrl" placeholder='image url' defaultValue={selectedPost?.imageUrl} />
          <textarea autoComplete='off' name="body" placeholder='text' defaultValue={selectedPost?.body}></textarea>
          <input className='btn submit-btn' type="submit" value="Update" />
        </form>
      </dialog>
    </>
  )
}

function PostDetail({ id, changePage }) {
  const [post, setPost] = useState(null)

  useEffect(() => {
    async function getData() {
      const data = await fetch(url + "/" + id).then(r => r.json())
      setPost(data)
    }
    getData()
  }, [])

  return (
    <>
      <button onClick={() => changePage(null)} className="back-btn btn">←</button>
      <div className="post-detail">
        <h2>{post?.title}</h2>
        <img src={post?.imageUrl} alt="" />
        <p>{post?.summary}</p>
        <p>{post?.body}</p>
      </div>
    </>
  )
}



export default App
