import { Transformer } from 'markmap-lib'
import { Toolbar } from 'markmap-toolbar'
import { useEffect, useState, useCallback } from 'react'

export const useSyncCallback = callback => {
    const [proxyState, setProxyState] = useState({ current: false })

    const Func = useCallback(() => {
        setProxyState({ current: true })
    }, [])

    useEffect(() => {
        if (proxyState.current === true) setProxyState({ current: false })
    }, [proxyState])

    useEffect(() => {
        proxyState.current && callback()
    })

    return Func
}

export async function postRequest(url) {
    const resp = await fetch(url, {
        method: 'POST',
    }).catch(err => console.error(err, '服务端网络出错，请等待修复或稍后再试'))
    const json = await resp?.json()
    return json?.code != 200 ? null : json
}

export async function textRequest(url) {
    const resp = await fetch(url)
    const text = await resp?.text()

    return text?.includes('faild') ? null : text
}

export function filterFile(file) {
    return file.name.includes('.md') && !file.name.toLowerCase().includes('readme')
}

export function adaptLogseq(text) {
    // 优化logseq语法
    if (text) {
        text = text.replaceAll('^^', '==')
        text = text.replaceAll('-->', '➔')
        text = text.replaceAll('collapsed:: true', '')
        text = text.replaceAll(/id:: [\da-z-]+/g, '')
    }
    return text
}

export const hideAll = (mm) => {
    let mmDataPayload = mm?.state.data.payload;
    mmDataPayload.fold = !mmDataPayload.fold;
    mm.renderData();
    mm.fit();
}

export const foldRecurs = (target) => {
    target.payload = {
        ...target.payload,
        fold: true,
    }

    target.children?.forEach((t) => {
        foldRecurs(t)
    })
}

export const unfoldRecurs = (target) => {
    target.payload = {
        ...target.payload,
        fold: false,
    }

    target.children?.forEach((t) => {
        unfoldRecurs(t)
    })
}

export const showLevel = (target, level) => {
    if (target.state.path?.split(".").length >= level) return;
    target.payload = {
        ...target.payload,
        fold: false,
    }

    target.children?.forEach((t) => {
        showLevel(t, level)
    })
}

export const extraOptions = {
    maxWidth: 600,
    duration: 100,
    initialExpandLevel: 2
}

export const initMarkmapOptions = (mm, root, level) => {
    mm.options = { ...mm.options, ...extraOptions }

    if (level != undefined) {
        mm.options.initialExpandLevel = level
    }

    if (!root.content) {
        root.content = `<strong>${decodeURI(location.pathname.split('/').pop().replace(/(.md|repl)$/, ''))}</strong>`;
    } else {
        root.content = `<strong>${root.content}</strong>`;

    }
}

export function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

export async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
    } else {
        return document.execCommand('copy', true, text);
    }
}

export const copyLink = () => {
    let rawUrl = location.href
    fetch(`${import.meta.env.VITE_YOURLS_API}${rawUrl}`)
        .then((resp) => resp.json())
        .then((json) => {
            if (json.statusCode == 200 || json.statusCode == 400) {
                rawUrl = json.shorturl
            }
        })
        .catch((err) => {
            console.error('YOURLS_API err', err)
        })
        .finally(() => {
            copyTextToClipboard(rawUrl)
        })
}

export const downloadHtml = (htmlContent) => {
    // 创建Blob对象
    const blob = new Blob([htmlContent], { type: 'text/html' });

    // 创建URL对象
    const url = URL.createObjectURL(blob);

    // 创建一个虚拟的a元素
    const a = document.createElement('a');
    a.href = url;
    a.download = decodeURI(location.pathname.slice(1)).replace('/', '-').replace('md', 'html');

    // 模拟点击a元素
    document.body.appendChild(a);
    a.click();

    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const sortByFirstNum = (a, b) => {
    return parseInt(a.split('-')[0]) - parseInt(b.split('-')[0])
}

export const transformer = new Transformer();

export function renderToolbar(mm, wrapper) {
    while (wrapper?.firstChild) wrapper.firstChild.remove();
    if (mm && wrapper) {
        const toolbar = new Toolbar();
        toolbar.showBrand = false
        toolbar.attach(mm);
        toolbar.registry.fit.title = '适应窗口'
        // Register custom buttons
        toolbar.register({
            id: 'edit',
            title: '编辑',
            content: Toolbar.icon('M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'),
            onClick: () => {
                return mm.setShowEdit(show => !show)
            }
        });

        toolbar.register({
            id: 'full',
            title: '全屏',
            content: Toolbar.icon('M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707m-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707'),
            onClick: () => {
                toggleFullScreen()
                mm.fit()
            },
        });

        toolbar.register({
            id: 'copyLink',
            title: '复制链接',
            content: Toolbar.icon('M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3'),
            onClick: () => {
                copyLink()
                mm.showNotification({ msg: "链接已复制" })
            },
        });

        toolbar.register({
            id: 'download',
            title: '下载网页',
            content: Toolbar.icon('M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z'),
            onClick: () => {
                const assets = transformer.getAssets();
                const html = transformer.fillTemplate(mm.state.data, assets, { jsonOptions: extraOptions });
                downloadHtml(html)
            },
        });

        const edit = window.innerWidth > 640 ? 'edit' : undefined
        toolbar.setItems([...Toolbar.defaultItems.filter(item => item !== 'recurse'), edit, 'full', 'copyLink', 'download']);
        wrapper.append(toolbar.render());
    }
}

export const getToken = () => {
    if (!localStorage.getItem("token")){
        console.error('请先登录box网盘, 再回到本页操作');
        return null
    }
    return localStorage.getItem("token")
}

export async function getUserPath() {
    if (localStorage.getItem("user_path") != null) {
        return localStorage.getItem("user_path")
    }

    const token = getToken()
    if (!token) return
    const res = await fetch("/api/me", {
        headers: {
            Authorization: token
        }
    }).catch(err => console.error(err))
    const json = await res.json()
    if (json.message != 'success') {
        localStorage.removeItem("token")
        return 'err'
    }

    let path = json.data.base_path

    if (path == '/') {
        path = '/nan'
    }
    localStorage.setItem("user_path", path)
    return path
}

export async function saveEdit(title, content) {
    const token = getToken()
    let userPath = '';
    if (title.indexOf('/') == -1) {
        userPath = await getUserPath() + '/'
    }
    const filPath = `${import.meta.env.VITE_SERVER_PATH}${userPath}${title}.md`

    const myheaders = {
        Authorization: token,
        'File-Path': encodeURI(filPath),
        'Content-Type': 'text/plain',
        'Content-Length': content.length
    }

    const res = await fetch('/api/fs/put', {
        method: "PUT",
        headers: myheaders,
        body: content
    })
        .catch(err => console.error(err))

    const json = await res.json()
    return json.message


}