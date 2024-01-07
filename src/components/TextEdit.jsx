import { useRef, useState } from 'react'
import { Link } from 'wouter';
import { saveEdit, useDebounce } from '../utils'
import { useNotification } from '../components/NotificationContext';

export default function TextEdit({ content, setContent, setEditing }) {
    const textRef = useRef();
    const [] = useState();

    const handleChange = useDebounce(({ target: { value } }) => {
        localStorage.setItem("raw-content", value);
        setContent(value)
    }, 700)

    const showNotification = useNotification();

    const handleSave = async () => {
        let title = decodeURI(location.pathname.slice(0, -3))
        let res;

        if (location.pathname.endsWith('/repl')) {
            const re = /(?<=(#|-) )\S{1,32}/
            title = content.match(re).shift()
        }

        title = window.prompt('确认保存', `${title.split('/').pop()}`)
        if (title?.trim() == '') {
            return;
        }

        res = await saveEdit(title, content)
        if (res == 'success') {
            return showNotification({ msg: '保存成功！' })
        }
        showNotification({ type: 'err', msg: '保存失败！请重新登录 ' + res })
    }

    const boxEdit = () => {
        window.open(`${import.meta.env.VITE_SERVER_URL}/markmap${location.pathname.replace("/@markmap", "")}`)
    }

    return (
        <div className='w-2/3 text-sm hidden md:block md:visible'>
            <textarea ref={textRef} className="h-3/4 w-full p-2 border bg-gray-100 text-gray-700 rounded"
                onChange={handleChange}
                onInput={() => setEditing(true)}
                onBlur={() => setEditing(false)}
                defaultValue={content || localStorage.getItem("raw-content")}
            ></textarea>

            {localStorage.getItem("token") &&
                <button className='float-end bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' onClick={handleSave}>保存</button>
            }
            <Link href={`${import.meta.env.VITE_BASE_URL || '/'}`}
                className={`float-end mr-4 mt-1.5 scale-150 ${location.pathname.endsWith('/repl') ? '' : 'hidden'}`}
            >🏠</Link>
            <button className='float-end bg-red-500 mr-4 hover:bg-red-700 text-white font-bold py-1 px-2 rounded' onClick={() => textRef.current.value = ''}>清空</button>
            <button className={`float-end bg-amber-300 hover:bg-amber-600 mr-4 text-white font-bold py-1 px-2 rounded ${location.pathname.includes('/repl') ? 'hidden' : ''}`} onClick={boxEdit}>原编辑页</button>
        </div>
    )
}
