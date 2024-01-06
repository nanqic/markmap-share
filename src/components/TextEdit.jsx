import { useEffect, useRef, useState } from 'react'
import { Link } from 'wouter';
import { saveEdit, useDebounce } from '../utils'
import { useNotification } from '../components/NotificationContext';

export default function TextEdit({ content, setContent, setEditing }) {
    const textRef = useRef();
    const [] = useState();

    const handleChange = useDebounce(({ target: { value } }) => {
        localStorage.setItem("raw-content", value);
        setContent(value)
    }, 1000)

    const showNotification = useNotification();

    const handleSave = async () => {
        const re = /(?<=(#|-) )\S{1,32}/
        let title = content.match(re).shift()
        title = window.prompt('确认保存', `${title}`)
        let res;
        if (title && title.trim() != '') {
            res = await saveEdit(title, content)
        } else {
            alert('标题不能为空')
        }

        if (res == 'success') {
            return showNotification('保存成功！')
        }

        showNotification('保存失败！原因:' + res)
    }

    const boxEdit = () => {
        window.open(`${import.meta.env.VITE_SERVER_URL}/markmap${location.pathname.replace("/@markmap", "")}`)
    }
    useEffect(() => {
        if (!content) {
            let cachedContent = localStorage.getItem("raw-content");
            if (!cachedContent) {
                cachedContent = `# 学习\n\n## 学习方法\n- 主动学习\n- 高效学习\n- 深度学习\n\n## 学习计划\n- 设定目标\n- 制定计划\n- 实施反馈\n\n## 学习态度\n- 主动积极\n- 持续专注\n- 坚持不懈\n`
                localStorage.setItem("raw-content", cachedContent);
            }
            setContent(cachedContent)
        }
    }, [])

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
                className={`float-end mr-4 mt-1.5 scale-150 ${location.pathname != ('/repl') ? 'hidden' : ''}`}
            >🏠</Link>
            <button className='float-end bg-red-500 mr-4 hover:bg-red-700 text-white font-bold py-1 px-2 rounded' onClick={() => textRef.current.value = ''}>清空</button>
            <button className={`float-end bg-amber-300 hover:bg-amber-600 mr-4 text-white font-bold py-1 px-2 rounded ${location.pathname.includes('/repl') ? 'hidden' : ''}`} onClick={boxEdit}>原编辑页</button>
        </div>
    )
}
