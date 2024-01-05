import { lazy, useRef, useEffect, useState } from 'react'
import { useDebounce } from '../utils'
import WanrMsg from '../components/WanrMsg';

const MarkmapHooks = lazy(() => import("@/components/MarkmapHooks"))

export default function Repl() {
    const textRef = useRef();
    const [show, setShow] = useState(screen.orientation?.type.includes("landscape"));
    const [content, setContent] = useState();
    const handleChange = useDebounce(({ target: { value } }) => {
        localStorage.setItem("raw-content", value);
        setContent(value)
    }, 1000)

    const handleOrientationChange = () => {
        setShow(show => !show)
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
    }, [show]);

    return (
        <div className="flex flex-row h-screen p-2 text-sm">
            <WanrMsg show={!show} msg={'请关闭竖屏锁定，横屏以获得更好的体验'} />
            <div className={`w-2/3 hidden ${show ? 'sm:block' : ''} `}>
                <textarea ref={textRef} className="h-3/4 w-full p-2 border bg-gray-100 text-gray-700 rounded"
                    onChange={handleChange
                    }
                    defaultValue={localStorage.getItem("raw-content")}
                ></textarea>
            </div>
            <div className="w-full flex">
                {content && <MarkmapHooks text={content} setShow={setShow} edit={true} />}
            </div>
        </div>
    );
}
