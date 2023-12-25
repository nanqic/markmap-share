
import { useEffect, useReducer, useState } from 'react'
import { useParams, useLocation } from 'wouter'
import MarkmapHooks from './MarkmapHooks'
import FileTree from './FileTree'
import { filterFile, postRequest, textRequest } from '../utils'
import { addTitle } from '../utils'

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
    currentuser: null,
    currentfile: null,
    dirs: null,
    dirfiles: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [text, setText] = useState()
  useEffect(() => {

    fetchData()
  }, [params])

  const fetchData = async () => {
    const dirsUrl = `/api/fs/dirs?path=markmap`
    const { data } = await postRequest(dirsUrl)
    const userArr = data.map(item => item.name)
    dispatch({ type: 'SET_USERS', payload: userArr });

    let defaultUser = userArr[0]
    if (params.username) {
      dispatch({ type: 'SET_CURRENTUSER', payload: params.username })
      loadUserFiles(params.username)
    } else {
      dispatch({ type: 'SET_CURRENTUSER', payload: defaultUser })
      loadUserFiles(defaultUser)
    }
  }

  async function loadUserFiles(user) {
    const listUrl = `/api/fs/list?path=markmap`
    const dirsContent = (await postRequest(`${listUrl}/${user}`))?.data.content
    dispatch({ type: 'SET_DIRS', payload: dirsContent?.filter(filterFile).map(x => x.name.slice(0, -3)) })

    // 加载dir同级md文件
    if (params.dir?.slice(-3) == '.md') {
      dispatch({ type: 'SET_CURRENTFILE', payload: params.dir })
      loadText(params.dir)

      // 加载dir内的md文件
    } else if (params.filename) {
      loadText(`${params.dir}/${params.filename}`)
    }

    const dirfiles = dirsContent?.filter(file => file.is_dir)?.map(async dir => {
      const resp = await postRequest(`${listUrl}/${user}/${dir.name}`)
      const files = resp?.data.content.map(item => item.name.slice(0, -3))

      return new Object({ name: dir.name, files });
    });

    dirfiles && Promise.all(dirfiles).then(values => {
      dispatch({ type: 'SET_DIRFILES', payload: values });
    });
  }

  const loadText = async (filename) => {
    const fileUrl = `/p/markmap/${params.username}/${filename}`
    let resp = await textRequest(fileUrl)
    setText(addTitle(filename, resp))
  }

  const handleChangeUser = (e) => {
    const { value } = e.target;
    setText()
    setLocation(`/${value}`);
  }

  return (
    <>
      <div className="absolute top-1 left-1">

        <details open>
          <summary className='text-green-700'>
            <select onChange={handleChangeUser} value={params.username}>
              {
                state.users?.map(user => {
                  return <option key={user} value={user}>{user}</option>
                })
              }
            </select>
            <a href="/" target='_self'> 主页</a>
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