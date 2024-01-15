import React, { useRef, useEffect, useState } from 'react';
import { Markmap } from 'markmap-view';
import { adaptLogseq, hideAll, showLevel, initMarkmapOptions, unfoldRecurs, foldRecurs, renderToolbar, transformer } from '../utils';
import { useNotification } from './NotificationContext';

const MarkmapHooks = React.memo((props) => {
    // Ref for SVG element
    const refSvg = useRef();
    // Ref for markmap object
    const refMm = useRef();
    // Ref for toolbar wrapper
    const refToolbar = useRef();
    const showNotification = useNotification();
    const mobile = /Mobile/
    const [mobileBar, setMobileBar] = useState(mobile.test(navigator.userAgent))
    const handleFullScreenChange = () => {
        if (props.setShow)
            props.setShow(value => !value)
        mobile.test(navigator.userAgent) && setMobileBar(value => !value)
    };
    useEffect(() => {
        // Create markmap and save to refMm
        const mm = Markmap.create(refSvg.current);
        mm.showNotification = showNotification
        mm.setShow = props.setShow
        mm.setShowEdit = props.setShowEdit
        refMm.current = mm;
        renderToolbar(refMm.current, refToolbar.current);
    }, [props]);

    useEffect(() => {
        const mm = refMm.current;
        if (!mm) return;
        const { root } = transformer.transform(adaptLogseq(props.content));
        props.showEdit ? initMarkmapOptions(mm, root, -1) : initMarkmapOptions(mm, root)
        mm.setData(root);
        mm.renderData();
        mm.fit();
        // 组件挂载时添加事件监听器
        if (!props.editing) {
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

        switch (key) {
            case ",":
                unfoldRecurs(mm.state.data);
                mm.renderData();
                return mm.fit();
            case ".":
                foldRecurs(mm.state.data);
                mm.renderData();
                return mm.fit();
            case "=":
            case "+":
                return mm.rescale(1.25);

            case "-":
                return mm.rescale(0.8);

            case 'm':
                return hideAll(mm);
            case "0":
            case "space":
                return mm.fit();
            case "F11":
                if (props.setShow)
                    props.setShow(value => !value)
                return mm.fit();
            default:
                if (parseInt(key)) {
                    foldRecurs(mm.state.data);
                    showLevel(mm.state.data, parseInt(key));
                    mm.renderData();
                    mm.fit();
                }
        }


    }

    return (
        <React.Fragment>
            <div className={`${props.showEdit && 'relative'} w-full flex flex-col h-screen`}>
                <div className={`absolute  left-1 bottom-1 ${mobileBar && 'bottom-16'}`} ref={refToolbar}></div>
                <svg className="flex-1" ref={refSvg} />
            </div>
        </React.Fragment>
    );
})

MarkmapHooks.displayName = 'MarkmapHooks';
export default MarkmapHooks;