import React, { useRef, useEffect, useState } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Toolbar } from 'markmap-toolbar';
import { adaptLogseq, foldSwitch, handleKeyDown, toggleFullScreen, initMarkmapOptions, copyLink } from '../utils';

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
            },
        });
        toolbar.registry.recurse = {
            ...toolbar.registry.recurse,
            title: '折叠/展开',
            onClick: () => foldSwitch(mm)
        }
        // console.log( Toolbar.defaultItems);
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
    useEffect(() => {
        // Create markmap and save to refMm
        const mm = Markmap.create(refSvg.current);
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
            <div className="absolute bottom-1 left-1" ref={refToolbar}>
            </div>
            <dialog open={false}>
                <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-3 py-2 shadow-md" role="alert">
                    <div className="py-1 flex"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" /></svg> 已复制</div>
                </div>
            </dialog>
        </React.Fragment>
    );
})

MarkmapHooks.displayName = 'MarkmapHooks';
export default MarkmapHooks;