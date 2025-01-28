import { useEffect, useRef, useState } from 'react'
import { editorSvg, homeSvg, denemeSvg, plusSvg, italicSvg, boldSvg, underlineSvg } from './../Svg'

const url = 'https://bernakurt.pythonanywhere.com/posts'
//             <div className='comment-content' dangerouslySetInnerHTML={{ __html: marked.parse(post.comment) }} />

export function Editor() {
  const [posts, setPosts] = useState([])
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [imgUploaded, setImgUploaded] = useState(false)
  const [currentBody, setCurrentBody] = useState(null)
  const [username, setUsername] = useState(localStorage.username ?? "")
  const [password, setPassword] = useState(localStorage.password ?? "")

  const editTextareaRef = useRef(null)
  const addTextareaRef = useRef(null)

  const addNewRef = useRef(null)
  const editRef = useRef(null)

  function promptLogin() {
    const inputUsername = prompt('username');
    const inputPassword = prompt('password')
    setUsername(inputUsername)
    setPassword(inputPassword)
    localStorage.username = inputUsername
    localStorage.password = inputPassword
  }

  useEffect(() => {
    async function getData() {
      const data = await fetch(url).then(r => r.json())
      setPosts(data)
    }
    getData()

    if (username === '') {
      promptLogin();
    }

  }, [])

  useEffect(() => {
    async function getData() {
      const data = await fetch(url + '/' + selectedPostId).then(r => r.json())
      setSelectedPost(data)
      setCurrentBody(data.body)
    }
    getData()
  }, [selectedPostId])

  async function handleEditSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const formObj = Object.fromEntries(formData)

    await fetch(url + '/' + selectedPostId,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
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
    console.log(localStorage.getItem("username"))

    const formData = new FormData(e.target)
    const formObj = Object.fromEntries(formData)
    const request = await fetch(url,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
        method: 'POST',
        body: JSON.stringify(formObj)
      }
    )

    if (!request.ok) {
      alert('ekleme yapılamadı.');
      return;
    }
    const newPost = await request.json();
    setPosts([...posts, newPost])
    addNewRef.current.close()
  }

  async function handleDelete(e, id) {
    e.preventDefault()
    console.log(url + "/" + id)
    fetch(url + "/" + id,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${username}:${password}`)}`
        },
        method: 'DELETE'
      })
    setPosts(posts.filter(x => x.id != id))
  }

  function handleSelection(styling, textareaRef) {
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start === end) return;


    const beforeSelection = textarea.value.substring(0, start);
    const selectedText = textarea.value.substring(start, end)
    const afterSelection = textarea.value.substring(end);

    const textSyling = {
      "bold": `**${selectedText}**`,
      "italic": `*${selectedText}*`,
      "underline": `<u>${selectedText}</u>`,
      "code": "<pre>" + selectedText + "</pre>"
    }
    // const boldedText = `**${selectedText}**`

    setCurrentBody(beforeSelection + textSyling[styling] + afterSelection)
  }

  function handleEditChange(e) {
    setCurrentBody(e.target.value)
  }

  return (
    <>
      <div className="editor-btn-cont">
        <div className="editor-btns">
          <button className='btn new-btn' onClick={() => { setCurrentBody(""); addNewRef.current.showModal() }}>{plusSvg}</button>

        </div>
      </div>
      <div className="posts-editable">
        {
          posts.map((post, index) => {
            return <>
              <div className="editable-post-container">

                <div key={index * 34} className="post-editable">
                  <h2>{post.title}</h2>
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
          <button onClick={() => { addNewRef.current.close(); setCurrentBody("") }} className="btn">X</button>
        </div>
        <form onSubmit={handleNewSubmit} className='form-dialog' action="dialog">
          <input autoComplete='off' type="text" name="title" placeholder='title' />
          <input autoComplete='off' type="text" name="summary" placeholder='summary' />
          <input onChange={(e) => console.log(e.target.value)} autoComplete='off' type="text" name="imageUrl" placeholder='image url' />
          <div className="style-btns">
            <button className="icon-button" type='button' onClick={() => handleSelection("bold", addTextareaRef)}>{boldSvg}</button>
            <button className="icon-button" type='button' onClick={() => handleSelection("italic", addTextareaRef)}>{italicSvg}</button>
            <button className="icon-button" type='button' onClick={() => handleSelection("underline", addTextareaRef)}>{underlineSvg}</button>
            <button className="icon-button" type='button' onClick={() => handleSelection("code", addTextareaRef)}>c</button>
          </div>
          <textarea className="edit-txt" ref={addTextareaRef} onChange={handleEditChange} autoComplete='off' name="body" placeholder='text' value={currentBody}></textarea>
          <input className='btn submit-btn' type="submit" value="Add New +" />
        </form>
      </dialog>
      {/* <EditDialog editRef={editRef} handleEditSubmit={handleEditSubmit} selectedPost={selectedPost} /> */}
      <dialog className='dialog-edit' ref={editRef}>
        <div className="dialog-header">
          <div className='dialog-h3'><h3>Düzenle</h3></div>
          <button onClick={() => editRef.current.close()} className="btn">X</button>
        </div>
        <form onSubmit={handleEditSubmit} className='form-dialog' action="dialog">
          <label htmlFor="title">Title</label>
          <input autoComplete='off' type="text" name="title" placeholder='title' defaultValue={selectedPost?.title} />
          <label htmlFor="summary">Summary</label>
          <input autoComplete='off' type="text" name="summary" placeholder='summary' defaultValue={selectedPost?.summary} />
          <label htmlFor="imageUrl">Image URL</label>
          <input autoComplete='off' type="text" name="imageUrl" placeholder='image url' defaultValue={selectedPost?.imageUrl} />
          <label htmlFor="body">Body</label>

          <div className="style-btns">
            <button className="icon-button" type='button' onClick={() => handleSelection("bold", editTextareaRef)}>{boldSvg}</button>
            <button className="icon-button" type='button' onClick={() => handleSelection("italic", editTextareaRef)}>{italicSvg}</button>
            <button className="icon-button" type='button' onClick={() => handleSelection("underline", editTextareaRef)}>{underlineSvg}</button>
            <button className="icon-button" type='button' onClick={() => handleSelection("code", editTextareaRef)}>c</button>
          </div>
          <textarea className="edit-txt" ref={editTextareaRef} onChange={handleEditChange} autoComplete='off' name="body" placeholder='text' value={currentBody}></textarea>
          <input className='btn submit-btn' type="submit" value="Update" />
        </form>
      </dialog>
    </>
  )
}