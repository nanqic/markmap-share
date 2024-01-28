import { useState, useEffect } from 'react'
import { useLocation, useSearch } from 'wouter';
import { saveEdit } from '../utils'
import { useNotification } from '../components/NotificationContext';
import "@uiw/react-md-editor/markdown-editor.css";
import
MDEditor,
{
    group,
    bold,
    italic,
    strikethrough,
    title1, title2, title3, title4, title5, title6,
    code,
    unorderedListCommand,
    orderedListCommand,
    help,
    divider,
} from '@uiw/react-md-editor/nohighlight';


export default function TextEdit({ content, setContent, setEditing }) {
    const [value, setValue] = useState(content || localStorage.getItem("raw-content"))
    const [, setLocation] = useLocation()
    const searchString = useSearch()
    useEffect(() => {
        // Use a separate useEffect to handle the debouncedValue change
        const timer = setTimeout(() => {
            if (value == '' || !value) {
                // localStorage.removeItem("raw-content")
                setContent()
            } else {
                localStorage.setItem("raw-content", value)
            }
            setContent(value)
        }, 700);

        return () => clearTimeout(timer);
    }, [value]);

    const showNotification = useNotification();

    const handleSave = async () => {
        let title, res, userInput;
        const re = /(?<=(#|-) )\S{1,32}/
        title = content.match(re).shift()

        if (location.pathname.endsWith('/repl')) {
            userInput = window.prompt("确认保存", `${title}`)
        } else if (location.pathname.endsWith('/new')) {
            title = decodeURI(location.pathname.replace(import.meta.env.VITE_BASE_URL, '').slice(0, -4)) + searchString.slice(5) + title
            userInput = window.prompt("确认保存('/'前为保存路径)", `${title}`)
        } else {
            title = decodeURI(location.pathname.replace(import.meta.env.VITE_BASE_URL, '').slice(0, -3))
            userInput = window.prompt("确认保存('/'前为保存路径)", `${title}`)
        }

        if (userInput === null || userInput.trim() === "") {
            return;
        }

        res = await saveEdit(userInput, content)
        if (res == 'success') {
            return showNotification({ msg: '保存成功！' })
        }
        showNotification({ type: 'err', msg: '保存失败！请重新登录 ' + res })
    }

    const save = {
        name: "save",
        keyCommand: "s",
        buttonProps: { "title": "save" },
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 2H9v3h2z" />
                <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
            </svg>
        ),
        execute: handleSave
    }

    const br = {
        name: "br",
        keyCommand: "e",
        buttonProps: { "title": "new line" },
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h9a2.5 2.5 0 0 1 0 5h-1.293l.647.646a.5.5 0 0 1-.708.708l-1.5-1.5a.5.5 0 0 1 0-.708l1.5-1.5a.5.5 0 0 1 .708.708l-.647.646H11.5a1.5 1.5 0 0 0 0-3h-9a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5H7a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5" />
            </svg>
        ),
        execute: (state, api) => {
            let modifyText = `<br/> ${state.selectedText}<br/>`;
            if (!state.selectedText) {
                modifyText = `<br/> `;
            }
            api.replaceSelection(modifyText);
        },
    }

    const home = {
        name: "home",
        keyCommand: "l",
        buttonProps: { "title": "home" },
        icon: (
            <>🏠</>
        ),
        execute: () => setLocation(import.meta.env.VITE_BASE_URL || '/')
    }

    const sourceFile = {
        name: "sourceFile",
        keyCommand: "l",
        buttonProps: { "title": "source file" },
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
                <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5" />
            </svg>
        ),
        execute: () => window.open(`${import.meta.env.VITE_SERVER_URL}/markmap${location.pathname.replace("/@markmap", "")}`)
    }

    const clear = {
        name: "clear",
        keyCommand: "l",
        buttonProps: { "title": "clear" },
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
            </svg>
        ),
        execute: () => setValue()
    }

    const getCommands = [
        location.pathname.endsWith('/repl') ? home : sourceFile,
        divider,
        bold,
        italic,
        strikethrough,
        group([title1, title2, title3, title4, title5, title6], {
            name: 'title',
            groupName: 'title',
            buttonProps: { 'aria-label': 'Insert title', title: 'Insert title' },
        }),
        unorderedListCommand,
        orderedListCommand,
        code,
        br,
        clear,
        { ...help, execute: () => window.open('https://box.hdcxb.net/markmap', '_blank') },
        divider,
        localStorage.getItem("token") && save,
    ];

    const handleSaveKey = event => {
        if (event.ctrlKey && event.key === 's') { handleSave() }
        else if (event.ctrlKey && event.key === 'l') { setValue() }
    }

    document.addEventListener('keydown', function (event) {
        // 检查是否按下了 Ctrl 键并且同时按下了 S 键
        if (event.ctrlKey && event.key === 's' || event.key === 'l') {
            event.preventDefault(); // 阻止默认的保存行为
        }
    });

    return (
        <div className='text-editor w-2/3 text-sm hidden sm:block sm:visible'>
            <MDEditor
                height="100%"
                className="h-3/4 w-full p-2 border bg-gray-100 text-gray-700 rounded"
                preview="edit"
                onChange={setValue}
                onInput={() => setEditing(true)}
                onBlur={() => setEditing(false)}
                value={value}
                commands={getCommands}
                onKeyDown={handleSaveKey}
            ></MDEditor>
        </div>
    )
}
