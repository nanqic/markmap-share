import React, { useRef, useEffect } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Toolbar } from 'markmap-toolbar';
import { adaptLogseq, hideAll, showLevel, toggleFullScreen, initMarkmapOptions, copyLink, unfoldRecurs, foldRecurs, extraOptions, downloadHtml } from '../utils';
import { useNotification } from './NotificationContext';

const transformer = new Transformer();

function renderToolbar(mm, wrapper) {
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
                if (location.pathname.includes('/repl')) {
                    return mm.setShow(show => !show)
                }
                window.open(`${import.meta.env.VITE_SERVER_URL}/markmap${location.pathname.replace("/@markmap", "")}`)

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
                mm.showNotification("链接已复制")
            },
        });

        toolbar.register({
            id: 'download',
            title: '下载网页',
            content: Toolbar.icon('M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z'),
            onClick: () => {
                const assets = transformer.getAssets();
                const html = transformer.fillTemplate(mm.state.data, assets, extraOptions);
                downloadHtml(html)
            },
        });

        toolbar.setItems([...Toolbar.defaultItems.filter(item => item !== 'recurse'), 'edit', 'full', 'copyLink', 'download']);
        wrapper.append(toolbar.render());
    }
}

const MarkmapHooks = React.memo((props) => {
    // Ref for SVG element
    const refSvg = useRef();
    // Ref for markmap object
    const refMm = useRef();
    // Ref for toolbar wrapper
    const refToolbar = useRef();
    const showNotification = useNotification();

    const handleFullScreenChange = () => {
        props.setShow(value => !value)
    };
    useEffect(() => {
        // Create markmap and save to refMm
        const mm = Markmap.create(refSvg.current);
        mm.showNotification = showNotification
        mm.setShow = props.setShow
        refMm.current = mm;
        renderToolbar(refMm.current, refToolbar.current);
    }, [props]);

    useEffect(() => {
        const mm = refMm.current;
        if (!mm) return;
        const { root } = transformer.transform(adaptLogseq(props.text));
        initMarkmapOptions(mm, root)
        mm.setData(root);
        mm.renderData();
        mm.fit();
        // 组件挂载时添加事件监听器
        if (!props.edit) {
            document.addEventListener('keydown', handleKeyDown);
        }
        document.addEventListener('fullscreenchange', handleFullScreenChange);

        // 组件卸载时移除事件监听器
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            mm.destroy()
        };
    }, [props]);

    const handleKeyDown = ({ key }) => {
        // console.log('key:', key);
        const mm = refMm.current;

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
                hideAll(mm);
                return;
            case "0":
            case "space":
                return mm.fit();
            case "F11":
                handleFullScreenChange()
                return mm.fit();
            default:
                // Handle default case if needed
                break;
        }

        mm.renderData();
        mm.fit();
    }

    return (
        <React.Fragment>
            <svg className="flex-1" ref={refSvg} />
            <div className="absolute bottom-1 left-1" ref={refToolbar}></div>
        </React.Fragment>
    );
})

MarkmapHooks.displayName = 'MarkmapHooks';
export default MarkmapHooks;