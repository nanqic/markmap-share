import { useEffect, useState, useCallback } from 'react'

export const useSyncCallback = callback => {
    const [proxyState, setProxyState] = useState({ current: false })

    const Func = useCallback(() => {
        setProxyState({ current: true })
    }, [proxyState])

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
    const json = await resp.json()
    return json.code != 200 ? null : json
}

export async function textRequest(url) {
    const resp = await fetch(url)
    const text = await resp.text()

    return text.includes('faild') ? null : text
}

export function filterFile(file) {
    return file.name.includes('.md') && !file.name.toLowerCase().includes('readme')
}

export function adaptLogseq(text) {
    // 优化logseq语法
    if (text) {
        text = text.replaceAll('^^', '==')
        text = text.replaceAll('collapsed:: true', '')
        text = text.replaceAll(/id:: [\da-z-]+/g, '')
    }
    return text
}

export function foldAll(filename, text) {
    const regx = /#{1,6} \S+/g

    if (regx.test(text)) {
        text = text.replaceAll(regx, "$& <!-- fold recursively -->")
    } else {
        text = `# ${decodeURI(filename)} <!-- fold recursively -->\n` + text
    }

    return text
}