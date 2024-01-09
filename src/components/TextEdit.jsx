import { useState, useEffect } from 'react'
import { Link } from 'wouter';
import { saveEdit } from '../utils'
import { useNotification } from '../components/NotificationContext';
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";

export default function TextEdit({ content, setContent, setEditing }) {
    const [value, setValue] = useState(content || localStorage.getItem("raw-content"))

    useEffect(() => {
        // Use a separate useEffect to handle the debouncedValue change
        const timer = setTimeout(() => {
            if (value == '' || !value) {
                localStorage.removeItem("raw-content")
                setContent('value')
            } else {
                localStorage.setItem("raw-content", value)
            }
            setContent(value)
        }, 700);

        return () => clearTimeout(timer);
    }, [value]);

    const showNotification = useNotification();

    const handleSave = async () => {
        let title = decodeURI(location.pathname.slice(0, -3))
        let res;

        if (location.pathname.endsWith('/repl')) {
            const re = /(?<=(#|-) )\S{1,32}/
            title = content.match(re).shift()
        }

        let comfirm = window.prompt('确认保存', `${title.split('/').pop()}`)
        if (comfirm?.trim() == '') {
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
        <div className='w-2/3 text-sm hidden sm:block sm:visible'>

            <MDEditor
                height={500}
                className="h-3/4 w-full p-2 border bg-gray-100 text-gray-700 rounded"
                preview="edit"
                onChange={setValue}
                onInput={() => setEditing(true)}
                onBlur={() => setEditing(false)}
                value={value}
            ></MDEditor>

            {localStorage.getItem("token") &&
                <button className='float-end bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' onClick={handleSave}>保存</button>
            }
            <Link href={`${import.meta.env.VITE_BASE_URL || '/'}`}
                className={`float-end mr-4 mt-1.5 scale-150 ${location.pathname.endsWith('/repl') ? '' : 'hidden'}`}
            >🏠</Link>
            <button className='float-end bg-red-500 mr-4 hover:bg-red-700 text-white font-bold py-1 px-2 rounded' onClick={() => setValue()}>清空</button>
            <button className={`float-end bg-amber-300 hover:bg-amber-600 mr-4 text-white font-bold py-1 px-2 rounded ${location.pathname.includes('/repl') ? 'hidden' : ''}`} onClick={boxEdit}>原编辑页</button>
        </div>
    )
}
