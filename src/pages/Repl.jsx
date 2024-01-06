import { lazy, useEffect, useState } from 'react'
import TextEdit from '../components/TextEdit';

const MarkmapHooks = lazy(() => import("@/components/MarkmapHooks"))
const WanrMsg = lazy(() => import("@/components/WanrMsg"))

export default function Repl() {
    const [editing, setEditing] = useState(true);
    const [show, setShow] = useState(true)
    const [content, setContent] = useState();
    const [isVertical, setIsVertical] = useState(screen.orientation?.type.includes("portrait"))

    const handleOrientationChange = () => {
        setIsVertical(screen.orientation?.type.includes("portrait"))
    }

    useEffect(() => {

        // 添加事件监听器
        window.addEventListener('orientationchange', handleOrientationChange);

        // 在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, [isVertical]);

    return (
        <div className="flex flex-row h-screen p-2">
            <WanrMsg show={isVertical} msg={'请关闭竖屏锁定，横屏以获得更好的体验'} />
            {show && <TextEdit setContent={setContent} setEditing={setEditing} />}
            <div className="w-full flex">
                {content && <MarkmapHooks content={content} setEditing={setShow} editing={editing} />}
            </div>
        </div>
    );
}
