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
    })
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

export const initMarkmapOptions = (mm, root) => {
    mm.options.maxWidth = 600
    // mm.options.autoFit = true
    mm.options.initialExpandLevel = 2
    if (!root.content) {
        root.content = decodeURI(location.pathname.split('/').pop().slice(0, -3));
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

export const sortByFirstNum = (a, b) => {
    return parseInt(a.split('-')[0]) - parseInt(b.split('-')[0])
}