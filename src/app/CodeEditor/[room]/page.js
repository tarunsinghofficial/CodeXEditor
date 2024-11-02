"use client";
import Link from "next/link";
import { FaPlay } from "react-icons/fa6";
import { IoHelp, IoChevronBack } from "react-icons/io5";

import { useEffect, useRef, useState } from "react";
import LanguagesDropdown from "../../components/LanguagesDropdown";
import ThemeDropdown from "../../components/ThemeDropdown";
import { languageOptions } from "../../constants/languageOptions";
import { defineTheme } from "../../lib/defineTheme";
import useKeyPress from "../../hooks/useKeyPress";
import CodeEditorWindow from "../../components/CodeEditorWindow";
import axios from "axios";
import ACTIONS from "../../actions";
import toast from "react-hot-toast";
import { initSocket } from "../../socket";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const javascriptDefault = `// some comment`;

function UserComponent({ username }) {
  return (
    <div className="bg-gray-bg hover:bg-button-primary hover:cursor-pointer py-5 px-2 hover:rounded-lg text-button-primary hover:text-white h-[2rem] flex flex-row gap-2 items-center group">
      <span className="bg-button-primary flex items-center justify-center w-8 h-8 text-lg text-center text-white rounded-full">
        {username[0].toUpperCase()}
      </span>
      {username}
    </div>
  );
}

function Page() {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const params = useSearchParams();
  const router = useRouter();

  const [clients, setClients] = useState([]);
  const [socketError, setSocketError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  const { room } = useParams();
  const connectedUsers = params.get("username");

  const [code, setCode] = useState(javascriptDefault);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [executionError, setExecutionError] = useState(null);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  useEffect(() => {
    const init = async () => {
      try {
        setIsConnecting(true);
        socketRef.current = await initSocket();
        
        const handleErrors = (error) => {
          console.error("Socket connection error", error);
          setSocketError(error.message);
          
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;
            setTimeout(init, 2000 * reconnectAttempts.current); // Exponential backoff
          } else {
            toast.error("Unable to connect after multiple attempts. Please try again later.");
            router.push("/");
          }
        };

        socketRef.current.on("connect_error", handleErrors);
        socketRef.current.on("connect_failed", handleErrors);

        socketRef.current.on("connect", () => {
          setSocketError(null);
          setIsConnecting(false);
          reconnectAttempts.current = 0;
          
          socketRef.current.emit(ACTIONS.JOIN, {
            roomId: room,
            username: connectedUsers,
          });
        });

        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients, username, socketId }) => {
            if (username !== connectedUsers) {
              toast.success(`${username} joined the room`);
            }
            setClients(clients);
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
          }
        );

        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
          toast.error(`${username} left the room`);
          setClients((prev) =>
            prev.filter((client) => client.socketId !== socketId)
          );
        });
      } catch (err) {
        console.error("Socket initialization error:", err);
        handleErrors(err);
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.off("connect_error");
        socketRef.current.off("connect_failed");
        socketRef.current.off("connect");
      }
    };
  }, [room, connectedUsers, router]);

  useEffect(() => {
    localStorage.setItem("code", code);
  }, [code]);

  useEffect(() => {
    if (enterPress && ctrlPress) {
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  useEffect(() => {
    defineTheme("oceanic-next").then(() =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const handleCompile = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: language.id,
          stdin: input,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            // Make sure to replace this with your actual RapidAPI key
            "x-rapidapi-key": process.env.NEXT_APP_RAPID_API_KEY,
          },
        }
      );
  
      // Add a small delay before polling for results
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      const submissionToken = response.data.token;
      const pollResponse = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}`,
        {
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": process.env.NEXT_APP_RAPID_API_KEY,
          },
        }
      );
  
      // Handle the output based on status
      const { stdout, stderr, compile_output, status } = pollResponse.data;
  
      if (status.id === 3) { // Status 3 means successful execution
        setOutput(stdout || "Code executed successfully with no output");
      } else if (compile_output) {
        setOutput(`Compilation Error:\n${compile_output}`);
      } else if (stderr) {
        setOutput(`Runtime Error:\n${stderr}`);
      } else {
        setOutput(stdout || "No output");
      }
  
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 429) {
        setOutput("Too many requests. Please wait a moment before trying again.");
      } else if (error.response?.status === 401) {
        setOutput("API key is invalid or missing. Please check your configuration.");
      } else {
        setOutput("Error occurred while compiling/executing the code.");
      }
    }
    setLoading(false);
  };
  
  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(room);
      toast.success("Room ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy Room ID");
    }
  };

  const handleLeaveRoom = () => {
    router.push("/");
  };

  const onSelectChange = (sl) => {
    setLanguage(sl);
  };

  const onChange = (action, data) => {
    if (action === "code") {
      setCode(data);
    }
  };

  const handleThemeChange = (th) => {
    if (["light", "vs-dark"].includes(th.value)) {
      setTheme(th);
    } else {
      defineTheme(th.value).then(() => setTheme(th));
    }
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 mx-auto border-b-2 border-gray-900 rounded-full"></div>
          <p className="mt-4">Connecting to room...</p>
          {socketError && (
            <p className="mt-2 text-red-500">Error: {socketError}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-primary-blue-light border-gray-border relative top-0 flex items-center justify-between w-full px-4 py-2 border-b-2">
        <div className="flex flex-row items-center justify-center gap-5">
          <div className="flex flex-row items-start gap-1">
            <span className="w-3 h-3 bg-red-400 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="w-3 h-3 bg-green-400 rounded-full"></span>
          </div>
          <Link
            href="/"
            className="hover:cursor-pointer flex items-center justify-center"
          >
            <IoChevronBack className="hover:text-gray-500 text-xl text-gray-400" />
            <p className="text-gray-400">Back</p>
          </Link>
        </div>
        <div>
          <button
            onClick={handleCompile}
            disabled={loading}
            className={`hover:cursor-pointer bg-button-primary hover:bg-blue-500 flex flex-row items-center w-auto gap-2 p-2 rounded-lg ${
              loading ? 'opacity-75' : ''
            }`}
          >
            {loading ? (
              <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <FaPlay className="text-xl text-white" />
            )}
            <span className="text-md text-white">
              {loading ? "Compiling..." : "Run Code"}
            </span>
          </button>
        </div>
        <div>
          <Link href="/" className="hover:cursor-pointer">
            <IoHelp className="text-xl text-white" />
          </Link>
        </div>
      </div>
      <div className="md:grid-cols-12 lg:grid-cols-12 grid grid-cols-1">
        <div className="flex flex-col justify-between h-[93vh] rounded-b-md md:col-span-2 lg:col-span-2 bg-primary-blue-light border-r-2 border-gray-border">
          <div>
            <div className="p-4">
              <Link href="/" className="text-2xl font-bold text-white">
                CodeXEditor
              </Link>
              <p className="text-xs italic text-gray-400">
                Run your code in real-time and share with others.
              </p>
            </div>
            <div>
              <h2 className="p-4 text-lg text-left">Connected</h2>
            </div>
            <div className="m-4 bg-gray-bg rounded-lg border-2 border-gray-border flex flex-col gap-2 p-4 h-auto max-h-[55vh] overflow-y-auto">
              <div className="flex flex-col gap-3">
                {clients.map((client) => (
                  <UserComponent
                    key={client.socketId}
                    username={client.username}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start">
            <div className="mb-2 ml-4">
              <button
                className="w-auto max-w-[10em] text-center hover:cursor-pointer bg-button-primary hover:bg-blue-500 rounded-lg p-2"
                onClick={handleCopyRoomId}
              >
                Copy Room ID
              </button>
            </div>
            <div className="mb-2 ml-4">
              <button
                className="w-auto max-w-[10em] text-center hover:cursor-pointer bg-button-primary hover:bg-blue-500 rounded-lg p-2"
                onClick={handleLeaveRoom}
              >
                Leave Room
              </button>
            </div>
            <div className="px-4 py-2">
              <LanguagesDropdown onSelectChange={onSelectChange} />
            </div>
            <div className="px-4 py-2">
              <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
            </div>
          </div>
        </div>
        <div className="md:col-span-7 lg:col-span-7 rounded-b-md">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
            socketRef={socketRef}
            roomId={room}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
        <div className="md:col-span-3 lg:col-span-3 rounded-b-md">
          <div className="p-4 flex flex-col justify-between h-[93vh] bg-primary-blue-light border-l-2 border-gray-border">
            <div className="flex flex-col justify-start">
              <h2 className="text-lg text-left">Output</h2>
              <pre className="bg-primary-blue p-4 rounded-lg w-full h-[50vh] overflow-y-auto whitespace-pre-wrap">
                {executionError ? (
                  <span className="text-red-500">{executionError}</span>
                ) : (
                  output
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;