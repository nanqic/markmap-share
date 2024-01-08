import React, { useRef, useEffect } from 'react';
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

    const handleFullScreenChange = () => {
        props.setShow(value => !value)
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
        if (props.setShow) {
            document.addEventListener('fullscreenchange', handleFullScreenChange);
        }

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
                break;
            case ".":
                foldRecurs(mm.state.data);
                break;
            case "=":
            case "+":
                return mm.rescale(1.25);

            case "-":
                return mm.rescale(0.8);

            case 'm':
                hideAll(mm);
                break;
            case "0":
            case "space":
                return mm.fit();
            case "F11":
                handleFullScreenChange()
                return mm.fit();
            default:
                if (parseInt(key)) {
                    foldRecurs(mm.state.data);
                    showLevel(mm.state.data, parseInt(key));
                }
        }

        mm.renderData();
        mm.fit();
    }

    return (
        <React.Fragment>
            <div className={`w-full flex flex-col h-screen ${props.open && props.show ? 'pl-40' : ''}`}>
                <svg className="flex-1" ref={refSvg} />
            </div>
            <div className="absolute bottom-1 left-1" ref={refToolbar}></div>
        </React.Fragment>
    );
})

MarkmapHooks.displayName = 'MarkmapHooks';
export default MarkmapHooks;