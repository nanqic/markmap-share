import React, { useCallback, useState, useEffect } from 'react'
import { useLocation } from 'wouter';
import { sortByFirstNum } from '../utils';

const FileTree = React.memo(
  (state) => {

    const [, setLocation] = useLocation();
    const [open, setOpen] = useState()

    useEffect(() => {
      let dir_opened = JSON.parse(localStorage.getItem("dir_open"))
      if (dir_opened) {
        setOpen(dir_opened)
      }
    }, [])


    const handleClickFile = useCallback((file) => {
      setLocation(`${import.meta.env.VITE_BASE_URL}/${state.username || state.userlist.shift()}/${file}.md`)
    }, [state])

    const handleToglle = ({ target: { open } }, name) => {
      let dir_opened = JSON.parse(localStorage.getItem("dir_open"))
      localStorage.setItem("dir_open", JSON.stringify({ ...dir_opened, [`${state.username}-${name}`]: open }))
    }
    return (
      <div className='text-gray-600 px-1.5 group inline-block bg-white'>
        {
          state.dirs?.sort(sortByFirstNum).map(file => {
            return (
              <p key={file} className={`pr-6 ${decodeURI(location.pathname).includes(file) && ' bg-slate-100 pl-3'}`} onClick={() => handleClickFile(file)}>
                {file}
              </p>
            )
          })
        }
        {
          state.dirfiles?.sort((a, b) => a.name.split('-')[0] - b.name.split('-')[0]).map(dir => {
            return (
              <details key={dir.name} open={decodeURI(location.pathname).includes(dir.name) || open && open[`${state.username}-${dir.name}`]} onToggle={e => handleToglle(e, dir.name)}>
                <summary className='text-blue-500 folder'>
                  {dir.name}
                </summary>
                {dir.files?.sort(sortByFirstNum).map(file => {
                  { file }
                  return <p key={file} className={decodeURI(location.pathname).includes(file) ? 'bg-slate-100 pl-3 inline-block' : ''}
                    onClick={() => handleClickFile(`${dir.name}/${file}`)}>
                    {file}
                  </p>
                })}
              </details>
            )
          })
        }
      </div>
    )
  })

FileTree.displayName = 'FileTree';
export default FileTree;