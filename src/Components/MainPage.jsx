import { useEffect, useRef, useState } from 'react'
import { searchSvg } from '../Svg'
const url = 'https://bernakurt.pythonanywhere.com/posts'


export function MainPage({ changePage, setCurrPage }) {
  const [posts, setPosts] = useState([])
  const [allPosts, setAllPosts] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    async function getData() {
      const data = await fetch(url).then(r => r.json())
      setPosts(data)
      setAllPosts(data)
    }

    getData()
  }, [])

  function handleQuickSearch(term) {
    console.log(term)
    const searchedTerm = term.trim()?.toLowerCase()
    setPosts(allPosts);
    setPosts(prev => [...prev.filter((post) => {
      return post.summary.toLowerCase().includes(searchedTerm) || post.title.toLowerCase().includes(searchedTerm) 
    })])

  }

  return (
    <>
    <div className="editor-btn-cont">
      <div className="editor-btns">
        <button onClick={() => setSearching(!searching)} className="btn search-btn">{searchSvg}</button>
        {
          searching && <input className='search-input' onChange={(e) => handleQuickSearch(e.target.value)} autoComplete='off' type="text" name='search' placeholder='search...' />
        }
      </div>

    </div>
      
      <div className="current-page">
      <div className="posts-div">
        {
          posts.map((post, index) => {
            return <div onClick={() => changePage(post.id)} key={index * 99} className="post-item">
              <img src={post.imageUrl} alt="" />
              <h2>{post.title}</h2>
              {/* <p>{post.created}</p> */}
              <p> {post.summary} </p>
            </div>
          })
        }
      </div></div>
    </>
  )
}