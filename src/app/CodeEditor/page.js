'use client'
import Link from 'next/link';
import { FaPlay } from "react-icons/fa6";
import { IoHelp, IoChevronBack } from "react-icons/io5";

import { useEffect, useState } from 'react';
import LanguagesDropdown from '../components/LanguagesDropdown';
import ThemeDropdown from '../components/ThemeDropdown';
import { languageOptions } from '../constants/languageOptions';
import { defineTheme } from '../lib/defineTheme';
import useKeyPress from '../hooks/useKeyPress';
import CodeEditorWindow from '../components/CodeEditorWindow';

import axios from 'axios'

const javascriptDefault = `// some comment`;

function CodeEditor({ }) {

    const [code, setCode] = useState(javascriptDefault);
    const [theme, setTheme] = useState("cobalt");
    const [language, setLanguage] = useState(languageOptions[0]);
    const [output, setOutput] = useState("");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const enterPress = useKeyPress("Enter");
    const ctrlPress = useKeyPress("Control");

    const onSelectChange = (sl) => {
        console.log("selected Option...", sl);
        setLanguage(sl);
    };

    useEffect(() => {
        if (enterPress && ctrlPress) {
            console.log("enterPress", enterPress);
            console.log("ctrlPress", ctrlPress);
            handleCompile();
        }
    }, [ctrlPress, enterPress]);

    const onChange = (action, data) => {
        switch (action) {
            case "code": {
                setCode(data);
                break;
            }
            default: {
                console.warn("case not handled!", action, data);
            }
        }
    };

    function handleThemeChange(th) {
        const theme = th;
        console.log("theme...", theme);

        if (["light", "vs-dark"].includes(theme.value)) {
            setTheme(theme);
        } else {
            defineTheme(theme.value).then((_) => setTheme(theme));
        }
    }

    useEffect(() => {
        defineTheme("oceanic-next").then((_) =>
            setTheme({ value: "oceanic-next", label: "Oceanic Next" })
        );
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
                source_code: code,
                language_id: language.id,
                stdin: input
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-rapidapi-key': 'c377fe8abfmsh94ba31b8a0b6956p194f15jsn6edde75aeac5',
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
                }
            });
            const submissionToken = response.data.token;
            const pollResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}`, {
                headers: {
                    'x-rapidapi-key': 'c377fe8abfmsh94ba31b8a0b6956p194f15jsn6edde75aeac5',
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
                }
            });
            setOutput(pollResponse.data.stdout || pollResponse.data.stderr || pollResponse.data.compile_output || "No output");
        } catch (error) {
            console.error("Error:", error);
            setOutput("Error occurred while compiling/executing the code.");
        }
        setLoading(false);
    };

    return (
        <>
            <div className='bg-primary-blue-light border-b-2 border-gray-border w-full py-2 px-4 relative top-0 flex justify-between items-center'>
                <div className='flex flex-row items-center justify-center gap-5' >
                    <div className="flex flex-row gap-1 items-start">
                        <span className="w-3 h-3 rounded-full bg-red-400"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                        <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    </div>
                    <Link href="/" className='hover:cursor-pointer flex items-center justify-center'>
                        <IoChevronBack className='text-gray-400 hover:text-gray-500 text-xl ' />
                        <p className="text-gray-400">Back</p>
                    </Link>
                </div>
                <div>
                    <div>
                        <div onClick={handleSubmit} className='flex flex-row gap-2 items-center bg-button-primary hover:bg-blue-500 rounded-lg w-auto p-2'>
                            <FaPlay className='text-white text-md' />
                            <p className='text-white text-md'>Run</p>
                        </div>
                    </div>
                </div>
                <div>
                    <Link href="/" className='hover:cursor-pointer'>
                        <IoHelp className='text-white text-xl' />
                    </Link>
                </div>
            </div>
            <div className=''>
                <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12">
                    <div className="flex flex-col justify-between h-[93vh] rounded-b-md md:col-span-2 lg:col-span-2 bg-primary-blue-light border-r-2 border-gray-border">
                        <div>
                            <div className='p-4'>
                                <Link href="/" className="text-2xl text-white font-bold">CodeXEditor</Link>
                                <p className="text-gray-400 text-xs italic">Run your code in real-time and share with others.</p>
                            </div>
                            <div>
                                <h2 className="text-lg text-left p-4">Connected</h2>
                            </div>
                            <div className='m-4 bg-gray-bg rounded-lg border-2 border-gray-border flex flex-col gap-2 p-4 h-auto max-h-[55vh]'>
                                <div className='flex flex-col gap-3'>
                                    <div className='bg-gray-bg hover:bg-button-primary hover:cursor-pointer py-5 px-2 hover:rounded-lg text-button-primary hover:text-white  h-[2rem] flex flex-row gap-2 items-center group'>
                                        <span className='w-8 h-8 rounded-full bg-button-primary text-white text-lg text-center flex items-center justify-center'>T</span>
                                        <p className=''>Tarun Singh</p>
                                    </div>
                                    <div className='bg-gray-bg hover:bg-button-primary hover:cursor-pointer py-5 px-2 hover:rounded-lg text-button-primary hover:text-white  h-[2rem] flex flex-row gap-2 items-center group'>
                                        <span className='w-8 h-8 rounded-full bg-button-primary text-white text-lg text-center flex items-center justify-center'>T</span>
                                        <p className=''>Tarun Singh</p>
                                    </div>
                                    <div className='bg-gray-bg hover:bg-button-primary hover:cursor-pointer py-5 px-2 hover:rounded-lg text-button-primary hover:text-white  h-[2rem] flex flex-row gap-2 items-center group'>
                                        <span className='w-8 h-8 rounded-full bg-button-primary text-white text-lg text-center flex items-center justify-center'>T</span>
                                        <p className=''>Tarun Singh</p>
                                    </div>
                                    <div className='bg-gray-bg hover:bg-button-primary hover:cursor-pointer py-5 px-2 hover:rounded-lg text-button-primary hover:text-white  h-[2rem] flex flex-row gap-2 items-center group'>
                                        <span className='w-8 h-8 rounded-full bg-button-primary text-white text-lg text-center flex items-center justify-center'>T</span>
                                        <p className=''>Tarun Singh</p>
                                    </div>
                                    <div className='bg-gray-bg hover:bg-button-primary hover:cursor-pointer py-5 px-2 hover:rounded-lg text-button-primary hover:text-white  h-[2rem] flex flex-row gap-2 items-center group'>
                                        <span className='w-8 h-8 rounded-full bg-button-primary text-white text-lg text-center flex items-center justify-center'>T</span>
                                        <p className=''>Tarun Singh</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className="px-4 py-2">
                                <LanguagesDropdown onSelectChange={onSelectChange} />
                            </div>
                            <div className="px-4 py-2">
                                <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-7 lg:col-span-7 rounded-b-md">
                        <div className='flex flex-col'>
                            <CodeEditorWindow
                                code={code}
                                onChange={onChange}
                                language={language?.value}
                                theme={theme.value}
                            />
                        </div>
                    </div>
                    <div className="md:col-span-3 lg:col-span-3 rounded-b-md">
                        <div className='p-4 flex flex-col justify-between h-[93vh] bg-primary-blue-light border-l-2 border-gray-border'>
                            <div className='flex flex-col justify-start'>
                                <h2 className="text-lg text-left">Output</h2>
                                <pre className='bg-primary-blue p-4 rounded-lg w-full h-[50vh] '>{output}</pre>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className="text-lg text-left">Custom Input</h2>
                                <textarea className=' bg-primary-blue w-full h- rounded-lg p-4 h-[20vh]' value={input} onChange={(e) => setInput(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CodeEditor;