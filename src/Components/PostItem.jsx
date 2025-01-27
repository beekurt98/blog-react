import { useEffect, useRef, useState } from 'react'
const url = 'https://bernakurt.pythonanywhere.com/posts'
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";


export function PostDetail({ id, changePage }) {
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
      <div className="editor-btn-cont">
        <div className="editor-btns"><button onClick={() => changePage(null)} className="back-btn btn">←</button></div>
      </div>
      <div className="post-detail">
        <h2>{post?.title}</h2>
        <img src={post?.imageUrl} alt="" />
        <p>{post?.summary}</p>
        {post?.body && <div className='comment-content' dangerouslySetInnerHTML={{ __html: marked.parse(post?.body) }} />}
        <p>This post was created at: {post?.created}</p>
      </div>

    </>
  )
}
