import { lazy, useState, useEffect } from 'react'

const MarkmapHooks = lazy(() => import("@/components/MarkmapHooks"))

export default function Raw() {
    const [text, setText] = useState()
    const [hide, setHide] = useState(false)


    const handleChange = ({ target: { value } }) => {
        setText(value)
        localStorage.setItem("raw-content", value)
    }

    useEffect(() => {
        let content = localStorage.getItem("raw-content")
        if (content) {
            setText(content)
        }
    }, [text])

    return (
        <div className="flex flex-row h-screen p-2 text-sm">
            <button className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => setHide(!hide)}>{hide ? '显示' : '隐藏'}编辑</button>
            <div className={hide ? 'hidden' : 'w-1/3'}>

                <textarea className="pt-7 h-3/4 w-full p-2 border bg-gray-100 text-gray-700 rounded" value={text} onChange={handleChange} ></textarea>
            </div>
            <div className="w-full flex">
                {text && <MarkmapHooks text={text} />}
            </div>
        </div>
    )
}
