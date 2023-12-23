import React, { useCallback, useEffect } from 'react'
import { filterFile } from '../utils';
import { useParams, useLocation } from 'wouter';

export default React.memo(
  (state) => {
    const [location, setLocation] = useLocation();

    useEffect(() => {

    }, [])
    const handleClickFile = useCallback((file) => {
      
      setLocation(`${import.meta.env.VITE_BASE}/${state.currentuser || state.users.shift()}/${file}.md`)
    }, [state])
    return (
      <div>
        {
          state.dirfiles?.map(dir => {
            return (
              <details key={dir.name}>
                <summary className='pl-2 text-blue-500'>
                  {dir.name}
                </summary>
                {dir.files?.map(file => {
                  { file }
                  return <li key={file} className={`${file}` == state.currentfile ? 'pl-4 text-gray-600' : 'pl-2 text-gray-600'}
                    onClick={() => handleClickFile(`${dir.name}/${file}`)}>
                    {file}
                  </li>
                })}

              </details>
            )
          })
        }
        {
          state.dirs?.map(file => {
            return (
              <li key={file} className={file == state.currentfile ? 'pl-2 text-gray-600' : 'text-gray-600'} onClick={() => handleClickFile(file)}>
                {file}
              </li>
            )
          })
        }
      </div>
    )
  })
