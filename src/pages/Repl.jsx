import { lazy, useEffect, useState } from 'react'
import TextEdit from '../components/TextEdit';

const MarkmapHooks = lazy(() => import("@/components/MarkmapHooks"))
const WanrMsg = lazy(() => import("@/components/WanrMsg"))

export default function Repl() {
    let cachedContent = localStorage.getItem("raw-content");

    const [editing, setEditing] = useState(false);
    const [showEdit, setShowEdit] = useState(true);
    const [content, setContent] = useState(cachedContent);
    const [isVertical, setIsVertical] = useState(screen.orientation?.type.includes("portrait"))

    const handleOrientationChange = () => {
        setIsVertical(screen.orientation?.type.includes("portrait"))
    }

    useEffect(() => {
        if (!cachedContent) {
            cachedContent = `# 学习\n\n## 学习方法\n- 主动学习\n- 高效学习\n- 深度学习\n\n## 学习计划\n- 设定目标\n- 制定计划\n- 实施反馈\n\n## 学习态度\n- 主动积极\n- 持续专注\n- 坚持不懈\n`
            localStorage.setItem("raw-content", cachedContent);
            setContent(cachedContent)
        }

        // 添加事件监听器
        window.addEventListener('orientationchange', handleOrientationChange);

        // 在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, [isVertical, content]);

    return (
        <div className="flex flex-row h-screen">
            <WanrMsg show={isVertical} msg={'请关闭竖屏锁定，横屏以获得更好的体验'} />
            {showEdit && <TextEdit content={content} setContent={setContent} setEditing={setEditing} />}
            <div className="w-full flex">
                <MarkmapHooks content={content} setShowEdit={setShowEdit} showEdit={showEdit} editing={editing} />
            </div>
        </div>
    );
}
