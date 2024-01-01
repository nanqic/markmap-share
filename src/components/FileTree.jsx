import React, { useCallback } from 'react'
import { useLocation } from 'wouter';
import { sortByFirstNum } from '../utils';

const FileTree = React.memo(
  (state) => {

    const [, setLocation] = useLocation();
    const handleClickFile = useCallback((file) => {
      setLocation(`${import.meta.env.VITE_BASE_URL}/${state.username || state.userlist.shift()}/${file}.md`)
    }, [state])
    return (
      <div className='text-gray-600 group inline-block'>
        {
          state.dirfiles?.sort((a, b) => a.name.split('-')[0] - b.name.split('-')[0]).map(dir => {
            return (
              <details className='pl-3' key={dir.name} open={decodeURI(location.pathname).includes(dir.name)}>
                <summary className='text-blue-500'>
                  {dir.name}
                </summary>
                {dir.files?.sort(sortByFirstNum).map(file => {
                  { file }
                  return <li key={file} className={decodeURI(location.pathname).includes(file) ? 'bg-red-50 px-2 inline-block' : ''}
                    onClick={() => handleClickFile(`${dir.name}/${file}`)}>
                    {file}
                  </li>
                })}

              </details>
            )
          })
        }
        {
          state.dirs?.sort(sortByFirstNum).map(file => {
            return (
              <li key={file} className={decodeURI(location.pathname).includes(file) ? 'bg-red-50 px-2' : ''} onClick={() => handleClickFile(file)}>
                {file}
              </li>
            )
          })
        }
      </div>
    )
  })

FileTree.displayName = 'FileTree';
export default FileTree;