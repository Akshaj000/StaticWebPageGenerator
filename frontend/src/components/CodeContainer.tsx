import React, { useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import {useCookies} from "react-cookie";
import {toast} from "react-toastify";

const CodeContainer = ({ session, setState }: any) => {
    const [cookies] = useCookies(["access"]);

    const [editableHtml, setEditableHtml] = useState(session?.webpage?.html || '');
    const [editableCss, setEditableCss] = useState(session?.webpage?.css || '');
    const [editableJs, setEditableJs] = useState(session?.webpage?.js || '');

    const [previewCode, setPreviewCode] = useState('');
    const [shouldPublish, setShouldPublish] = useState(false);

    const htmlTextareaRef = useRef(null);
    const cssTextareaRef = useRef(null);
    const jsTextareaRef = useRef(null);
    const [iframeHeight, setIframeHeight] = useState(700); // Initial height of the iframe
    const [iframeWidth, setIframeWidth] = useState(1560); // Initial height of the iframe


    const getInitialHeightAndWidth = () => {
        const height = window.innerHeight - 200;
        const width = window.innerWidth - 360;
        setIframeHeight(height);
        setIframeWidth(width);
    }

    useEffect(() => {
        getInitialHeightAndWidth();
    }, []);

    //check if window is resized
    useEffect(() => {
        window.addEventListener('resize', getInitialHeightAndWidth);
        return () => window.removeEventListener('resize', getInitialHeightAndWidth);
    }, []);

    useEffect(() => {
        setEditableHtml(session?.webpage?.html || '');
        setEditableCss(session?.webpage?.css || '');
        setEditableJs(session?.webpage?.js || '');
    }, [session?.id]);

    const downloadFile = ({ content, fileName }: any) => {
        const element = document.createElement('a');
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
    };

    // Apply syntax highlighting to code
    const highlightCode = (code: string, language: string) => {
        return Prism.highlight(code, Prism.languages[language], language);
    };

    // Combine code and update preview
    useEffect(() => {
        setPreviewCode(`
            <html>
                <head>
                    <style>${editableCss}</style>
                </head>
                <body>
                    ${editableHtml}
                    <script>${editableJs}</script>
                </body>
            </html>
        `);
    }, [editableHtml, editableCss, editableJs]);

    // Apply syntax highlighting to editable code
    const applySyntaxHighlighting = () => {
        if (htmlTextareaRef.current) {
            // @ts-ignore
            htmlTextareaRef.current.innerHTML = highlightCode(editableHtml, 'html');
        }
        if (cssTextareaRef.current) {
            // @ts-ignore
            cssTextareaRef.current.innerHTML = highlightCode(editableCss, 'css');
        }
        if (jsTextareaRef.current) {
            // @ts-ignore
            jsTextareaRef.current.innerHTML = highlightCode(editableJs, 'javascript');
        }
    };

    useEffect(() => {
        applySyntaxHighlighting();
    }, []);

    const handleUpdateContent = () => {
        const token = cookies?.access;
        fetch(`http://localhost/api/webpage/update-content/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                htmlContent: editableHtml,
                cssContent: editableCss,
                jsContent: editableJs,
                sessionID: session?.id,
                publish: shouldPublish
            }),
        }).then((response) => {
            if (response.status === 200) {
                setState("PUBLISHING")
                toast.success("Successfully updated content!");
            } else {
                toast.error("Failed to update content!");
            }
        }).catch((error) => {
            console.error(error);
            toast.error("Failed to update content!");
        })
    }

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg mb-6">
            <div className="mb-6">
                <h3 className="text-blue-500 text-xl font-bold mb-3">Preview</h3>
                <div className="mb-4 overflow-auto">
                    <label className="text-white">Height x width :</label>
                    <input
                        type="number"
                        value={iframeHeight}
                        onChange={(event => {
                            // @ts-ignore
                            setIframeHeight(event.target.value);
                        })}
                        className="w-24 px-2 py-1 rounded-lg bg-gray-800 text-white m-1"
                    />
                    x
                    <input
                        type="number"
                        value={iframeWidth}
                        onChange={() => {
                            // @ts-ignore
                            setIframeWidth(event.target.value);
                        }}
                        className="w-24 px-2 py-1 rounded-lg bg-gray-800 text-white m-1"
                    />
                </div>
                <iframe
                    srcDoc={previewCode}
                    className="w-full border border-gray-800 rounded-lg"
                    style={{ height: `${iframeHeight}px`, width: `${iframeWidth}px` }}
                />
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <div className="flex justify-between items-center">
                        <h3 className="text-blue-500 text-xl font-bold mb-3">HTML</h3>
                        <button
                            onClick={() =>
                                downloadFile({
                                    content: editableHtml,
                                    fileName: 'index.html',
                                })
                            }
                            className="text-white px-3 py-2 rounded-lg mb-2"
                        >
                            Download HTML
                        </button>
                    </div>
                    <pre
                        ref={htmlTextareaRef}
                        className="p-3 rounded-lg bg-gray-800 w-full text-white overflow-auto scroll h-[700px]"
                        contentEditable
                        onInput={(e) => setEditableHtml(e.currentTarget.textContent || '')}
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center">
                        <h3 className="text-blue-500 text-xl font-bold mb-3">CSS</h3>
                        <button
                            onClick={() =>
                                downloadFile({
                                    content: editableCss,
                                    fileName: 'styles.css',
                                })
                            }
                            className="text-white px-3 py-2 rounded-lg mb-2"
                        >
                            Download CSS
                        </button>
                    </div>
                    <pre
                        ref={cssTextareaRef}
                        className="p-3 rounded-lg bg-gray-800 w-full text-white overflow-auto scroll h-[700px]"
                        contentEditable
                        onInput={(e) => setEditableCss(e.currentTarget.textContent || '')}
                    />
                </div>
            </div>
            <div className="mt-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-blue-500 text-xl font-bold mb-3">JavaScript</h3>
                    <button
                        onClick={() =>
                            downloadFile({
                                content: editableJs,
                                fileName: 'scripts.js',
                            })
                        }
                        className="text-white px-3 py-2 rounded-lg mb-2"
                    >
                        Download JavaScript
                    </button>
                </div>
                <pre
                    ref={jsTextareaRef}
                    className="p-3 rounded-lg bg-gray-800 w-full text-white overflow-auto scroll h-[500px]"
                    contentEditable
                    onInput={(e) => setEditableJs(e.currentTarget.textContent || '')}
                />
            </div>
            <div className="flex justify-end mt-6 gap-5 items-center">
                <div className="flex items-center">
                    <label htmlFor="hostOnGithub" className="text-lg font-semibold">
                        Publish:
                    </label>
                    <input
                        type="checkbox"
                        checked={shouldPublish}
                        onChange={() => setShouldPublish(!shouldPublish)}
                        id="hostOnGithub"
                        className="h-6 w-6 ml-2"
                    />
                </div>
                &
                <button
                    onClick={handleUpdateContent}
                    className="text-white px-3 py-2 rounded-lg mb-2 bg-blue-600 w-32 font-bold"
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default CodeContainer;
