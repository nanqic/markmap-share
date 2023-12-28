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

export const foldSwitch = (mm) => {
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

export const handleKeyDown = (e, mm) => {
    const { key } = e
    // console.log('key:', key);
    let mmDataRoot = mm.state.data;

    switch (key) {
        case ",":
            unfoldRecurs(mmDataRoot);
            break;
        case "1":
        case ".":
            foldRecurs(mmDataRoot);
            break;
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
            foldRecurs(mmDataRoot);
            showLevel(mmDataRoot, parseInt(key));
            break;
        case "=":
        case "+":
            mm.rescale(1.25);
            return;
        case "-":
            mm.rescale(0.8);

            return;
        case '9':
            foldSwitch(mm);
            return;
        case "0":
        case "space":
            mm.fit();
            break;
        default:
            // Handle default case if needed
            break;
    }

    mm.renderData();
    mm.fit();
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
