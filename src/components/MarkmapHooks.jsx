import React, { useRef, useEffect } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Toolbar } from 'markmap-toolbar';
import { adaptLogseq, foldSwitch, handleKeyDown, toggleFullScreen, initMarkmapOptions, copyLink } from '../utils';
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
            content: '✍',
            onClick: () => window.open(`${import.meta.env.VITE_SERVER_URL}/markmap${location.pathname.replace("/@markmap", "")}`),
        });

        toolbar.register({
            id: 'full',
            title: '全屏',
            content: '⭕',
            onClick: () => toggleFullScreen(),
        });

        toolbar.register({
            id: 'copyLink',
            title: '复制链接',
            content: '🔗',
            onClick: () => {
                copyLink()
                mm.showNotification("通知","已复制到剪切板")
            },
        });

        toolbar.registry.recurse = {
            ...toolbar.registry.recurse,
            title: '折叠/展开',
            onClick: () => foldSwitch(mm)
        }
        // console.log( Toolbar.defaultItems,mm);
        toolbar.setItems([...Toolbar.defaultItems, 'full', 'edit', 'copyLink']);
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

    useEffect(() => {
        // Create markmap and save to refMm
        const mm = Markmap.create(refSvg.current);
        mm.showNotification = showNotification
        refMm.current = mm;

        renderToolbar(refMm.current, refToolbar.current);

        return () => mm.destroy()
    }, [props],);

    useEffect(() => {
        const mm = refMm.current;
        if (!mm) return;
        const { root } = transformer.transform(adaptLogseq(props.text));
        initMarkmapOptions(mm, root)
        mm.setData(root);
        mm.renderData();
        mm.fit();
        // 组件挂载时添加事件监听器
        window.addEventListener('keydown', e => handleKeyDown(e, mm));

        // 组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [props]);

    return (
        <React.Fragment>
            <svg className="flex-1" ref={refSvg} />
            <div className="absolute bottom-1 left-1 cursor-pointer" ref={refToolbar}></div>
        </React.Fragment>
    );
})

MarkmapHooks.displayName = 'MarkmapHooks';
export default MarkmapHooks;