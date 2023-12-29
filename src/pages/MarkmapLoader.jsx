import { useEffect, useReducer, useState } from 'react'
import { useParams, useLocation, Link } from 'wouter'
import MarkmapHooks from './MarkmapHooks'
import FileTree from './FileTree'
import { filterFile, postRequest, textRequest } from '../utils'

const MarkmapLoader = () => {
  const params = useParams();
  const [, setLocation] = useLocation();

  // 定义 reducer
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_USERS':
        return { ...state, users: action.payload };
      case 'SET_DIRS':
        return { ...state, dirs: action.payload };
      case 'SET_DIRFILES':
        return { ...state, dirfiles: action.payload };
      case 'SET_CURRENTUSER':
        return { ...state, currentuser: action.payload };
      case 'SET_CURRENTFILE':
      default:
        return state;
    }
  };

  const initialState = {
    users: null,
    currentuser: '',
    currentfile: null,
    dirs: null,
    dirfiles: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [text, setText] = useState()
  useEffect(() => {

    if (localStorage.getItem("theme")) {
      import(`assets/theme-wheat.css`)
    }
    loadUsers()
  }, [])

  useEffect(() => {
    if (params.username) {
      dispatch({ type: 'SET_CURRENTUSER', payload: params.username })
      loadUserFiles(params.username)
    }
  }, [params])

  const loadUsers = async () => {
    // fetch users
    const dirsUrl = `${import.meta.env.VITE_SERVER_URL}/api/fs/dirs?path=markmap`
    const { data } = await postRequest(dirsUrl)
    const userArr = data.map(item => item.name)
    dispatch({ type: 'SET_USERS', payload: userArr });

    let defaultUser = userArr[0]
    if (!params.username) {
      dispatch({ type: 'SET_CURRENTUSER', payload: defaultUser })
      loadUserFiles(defaultUser)
    }
  }

  async function loadUserFiles(user) {
    const listUrl = `${import.meta.env.VITE_SERVER_URL}/api/fs/list?path=markmap`;
    const dirsContent = (await postRequest(`${listUrl}/${user}`))?.data.content;
    dispatch({ type: 'SET_DIRS', payload: dirsContent?.filter(filterFile).map(x => x.name.slice(0, -3)) });

    if (params.dir?.slice(-3) == '.md') {
      dispatch({ type: 'SET_CURRENTFILE', payload: params.dir });
      loadText(params.dir);
    } else if (params.filename) {
      loadText(`${params.dir}/${params.filename}`);
    }

    const dirfiles = await Promise.all(dirsContent?.filter(file => file.is_dir)?.map(async dir => {
      const resp = await postRequest(`${listUrl}/${user}/${dir.name}`);
      const files = resp?.data.content.map(item => item.name.slice(0, -3));
      return { name: dir.name, files };
    }));

    dispatch({ type: 'SET_DIRFILES', payload: dirfiles });
  }

  const loadText = async (filename) => {
    const fileUrl = `${import.meta.env.VITE_SERVER_URL}/p/markmap/${params.username}/${filename}`
    let resp = await textRequest(fileUrl)
    setText(resp)
  }

  const handleChangeUser = ({ target: { value } }) => {
    setText();
    setLocation(`${import.meta.env.VITE_BASE_URL}/${value}`);
  };
  const changeTheme = () => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "wheat")
      import(`assets/theme-wheat.css`)
    } else {
      localStorage.removeItem("theme")
      location.reload()
    }

  };

  return (
    <>
      <div className="absolute top-1 left-1 opacity-80">

        <details open>
          <summary className='text-green-700'>
            <select onChange={handleChangeUser} value={state.currentuser}>
              {
                state.users?.map(user => {
                  return <option key={user} value={user}>{user}</option>
                })
              }
            </select>
            <Link href={`${import.meta.env.VITE_BASE_URL || '/'}`} onClick={() => setText()}> 🏠</Link>
            <button onClick={changeTheme} className='p-2 m-1'></button>
          </summary>
          {state.dirs && <FileTree {...state} />}
        </details>

      </div>
      {text &&
        <div className="flex flex-col h-screen p-2">
          <MarkmapHooks text={text} />
        </div>
      }
    </>
  )
}

export default MarkmapLoader