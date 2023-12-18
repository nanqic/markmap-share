import React, { useRef, useEffect } from 'react';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
import { Toolbar } from 'markmap-toolbar';

const transformer = new Transformer();

function renderToolbar(mm, wrapper, editUrl) {
    while (wrapper?.firstChild) wrapper.firstChild.remove();
    if (mm && wrapper) {
        const toolbar = new Toolbar();
        toolbar.showBrand = false
        toolbar.attach(mm);
        // Register custom buttons
        toolbar.register({
            id: 'edit',
            title: '编辑',
            content: '✍',
            onClick: () => window.open(editUrl),
        });
        // console.log( Toolbar.defaultItems);
        toolbar.setItems(['zoomIn', 'zoomOut', 'fit', 'edit']);
        wrapper.append(toolbar.render());
    }
}

export default function MarkmapHooks(props) {
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
        renderToolbar(refMm.current, refToolbar.current, props.editUrl);

        return () => mm.destroy()
    }, [refSvg.current, props],);

    useEffect(() => {
        const mm = refMm.current;
        if (!mm) return;
        const { root } = transformer.transform(props.text);
        mm.setData(root);
        mm.fit();
    }, [refMm.current, props]);


    return (
        <React.Fragment>
            <svg className="flex-1" ref={refSvg} />
            <div className="absolute bottom-1 left-1" ref={refToolbar}></div>
        </React.Fragment>
    );
}
