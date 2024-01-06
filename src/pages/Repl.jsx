import { lazy, useRef, useEffect, useState } from 'react'
import { saveEdit, useDebounce } from '../utils'
import { useNotification } from '../components/NotificationContext';

const MarkmapHooks = lazy(() => import("@/components/MarkmapHooks"))
const WanrMsg = lazy(() => import("@/components/WanrMsg"))

export default function Repl() {
    const textRef = useRef();
    const [show, setShow] = useState(true);
    const [content, setContent] = useState();
    const [isVertical, setIsVertical] = useState(screen.orientation?.type.includes("portrait"))
    const handleChange = useDebounce(({ target: { value } }) => {
        localStorage.setItem("raw-content", value);
        setContent(value)
    }, 1000)

    const handleOrientationChange = () => {
        setIsVertical(screen.orientation?.type.includes("portrait"))
    }

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
    useEffect(() => {
        let cachedContent = localStorage.getItem("raw-content");
        if (!cachedContent) {
            cachedContent = `# 学习\n\n## 学习方法\n- 主动学习\n- 高效学习\n- 深度学习\n\n## 学习计划\n- 设定目标\n- 制定计划\n- 实施反馈\n\n## 学习态度\n- 主动积极\n- 持续专注\n- 坚持不懈\n`
            localStorage.setItem("raw-content", cachedContent);
        }
        setContent(cachedContent)
        // 添加事件监听器
        window.addEventListener('orientationchange', handleOrientationChange);

        // 在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, [isVertical]);

    return (
        <div className="flex flex-row h-screen p-2 text-sm">
            <WanrMsg show={isVertical} msg={'请关闭竖屏锁定，横屏以获得更好的体验'} />
            <div className={`w-2/3 hidden ${show ? 'sm:block' : ''} `}>
                <textarea ref={textRef} className="h-3/4 w-full p-2 border bg-gray-100 text-gray-700 rounded"
                    onChange={handleChange
                    }
                    defaultValue={localStorage.getItem("raw-content")}
                ></textarea>

                {localStorage.getItem("token") &&
                    <button className='float-end bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded' onClick={handleSave}>保存</button>
                }
                <button className='float-end bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 mx-4 rounded' onClick={() => textRef.current.value = ''}>清空</button>

            </div>
            <div className="w-full flex">
                {content && <MarkmapHooks text={content} setShow={setShow} edit={true} />}
            </div>
        </div>
    );
}
