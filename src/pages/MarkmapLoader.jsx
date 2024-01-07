import { lazy, useEffect, useReducer, useState } from 'react'
import { useParams } from 'wouter'
import { filterFile, postRequest, textRequest } from '../utils'
import Nav from '../components/Nav'
import TextEdit from '../components/TextEdit'

const MarkmapHooks = lazy(() => import("@/components/MarkmapHooks"))

const MarkmapLoader = () => {
  const params = useParams();
  const [show, setShow] = useState(true)
  const [content, setContent] = useState()
  const [editing, setEditing] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // 定义 reducer
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_USERLIST':
        return { ...state, userlist: action.payload };
      case 'SET_USERNAME':
        localStorage.setItem("username", action.payload)
        return { ...state, username: action.payload };
      case 'SET_DIRS':
        return { ...state, dirs: action.payload };
      case 'SET_DIRFILES':
        return { ...state, dirfiles: action.payload };
      default:
        return state;
    }
  };

  const initialState = {
    userlist: undefined,
    username: localStorage.getItem("username"),
    dirs: null,
    dirfiles: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {

    loadUsers()
  }, [])

  useEffect(() => {
    let username = decodeURI(params.username)
    if (username != ('undefined' || state.username)) {
      dispatch({ type: 'SET_USERNAME', payload: username })
      loadUserFiles(username)
    }

    if (params.dir?.slice(-3) == '.md') {
      loadText(params.dir);
    } else if (params.filename) {
      loadText(`${params.dir}/${params.filename}`);
    }

  }, [params])

  const loadUsers = async () => {
    const dirsUrl = `${import.meta.env.VITE_SERVER_URL}/api/fs/dirs?path=markmap`
    const { data } = await postRequest(dirsUrl)
    const userArr = data.map(item => item.name)
    dispatch({ type: 'SET_USERLIST', payload: userArr });

    let defaultUser = params.username ? decodeURI(params.username) : state.username;
    if (!params.username && !state.username) {
      defaultUser = userArr[0]
    }
    dispatch({ type: 'SET_USERNAME', payload: defaultUser })
    loadUserFiles(defaultUser)
  }

  async function loadUserFiles(user) {
    const listUrl = `${import.meta.env.VITE_SERVER_URL}/api/fs/list?path=markmap`;
    const dirsContent = (await postRequest(`${listUrl}/${user}`))?.data.content;
    dispatch({ type: 'SET_DIRS', payload: dirsContent?.filter(filterFile).map(x => x.name.slice(0, -3)) });
    const dirfiles = await Promise.all(dirsContent?.filter(file => file.is_dir)?.map(async dir => {
      const resp = await postRequest(`${listUrl}/${user}/${dir.name}`);
      const files = resp?.data.content.filter(filterFile).map(item => item.name.slice(0, -3));
      return { name: dir.name, files };
    }));

    dispatch({ type: 'SET_DIRFILES', payload: dirfiles });
  }

  const loadText = async (filename) => {
    const fileUrl = `${import.meta.env.VITE_SERVER_URL}/p/markmap/${params.username}/${filename}`
    let resp = await textRequest(fileUrl)
    setContent(resp)
  }

  return (
    <div className='flex flex-row h-screen p-2'>
      <div className={show && !editing ? "absolute top-1 left-1 opacity-80" : 'hidden'}>
        <Nav state={state} setContent={setContent} />
      </div>
      {showEdit && <TextEdit content={content} setContent={setContent} setEditing={setEditing}/>}
      {content &&
        <MarkmapHooks content={content} setShow={setShow} setShowEdit={setShowEdit} editing={editing} />
      }
    </div>
  )
}

export default MarkmapLoader