import { lazy, useEffect, useReducer, useState } from 'react'
import { useParams, useLocation, Link } from 'wouter'
import { filterFile, postRequest, textRequest } from '../utils'

const FileTree = lazy(() => import("@/components/FileTree"))
const MarkmapHooks = lazy(() => import("@/components/MarkmapHooks"))

const MarkmapLoader = () => {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [show, setShow] = useState(true)
  const [text, setText] = useState()
  const [theme, setTheme] = useState()


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

    if (localStorage.getItem("theme")) {
      import(`assets/theme-wheat.css`)
      setTheme('wheat')
    }
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
      setTheme('wheat')
      location.reload()
    } else {
      localStorage.removeItem("theme")
      setTheme()
      location.reload()
    }
  };

  return (
    <>
      <div className={show ? "absolute top-1 left-1 opacity-80" : 'hidden'}>

        <details open>

          <summary className='text-green-700'>
            <Link href={`${import.meta.env.VITE_BASE_URL || '/'}`} onClick={() => setText()}> 🏠</Link>
            {state.username && <select onChange={handleChangeUser} value={state.username}>
              {
                state.userlist?.map(user => {
                  return <option key={user} value={user}>{user}</option>
                })
              }
            </select>}
            <button onClick={changeTheme} className='pl-2 inline-block h-max'>
              {!theme ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                className='pt-1' fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
              </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  className='pt-1' viewBox="0 0 16 16">
                  <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278M4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                </svg>
              }
            </button>
          </summary>
          {state.dirs && <FileTree {...state} />}
        </details>

      </div>
      {text &&
        <MarkmapHooks text={text} setShow={setShow} />
      }
    </>
  )
}

export default MarkmapLoader