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
    <div className="bg-gray-bg hover:bg-button-primary hover:cursor-pointer py-5 px-2 hover:rounded-lg text-button-primary hover:text-white  h-[2rem] flex flex-row gap-2 items-center group">
      <span className="w-8 h-8 rounded-full bg-button-primary text-white text-lg text-center flex items-center justify-center">
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

  const { room } = useParams();
  const connectedUsers = params.get("username");

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (error) => handleErrors(error));
      socketRef.current.on("connect_failed", (error) => handleErrors(error));

      function handleErrors(error) {
        console.error("Socket connection error", error);
        toast.error("Socket connection failed. Please try again later.");
        //redirect to homepage
        router.push("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        //get the roomId
        roomId: room,
        username: connectedUsers,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== connectedUsers) {
            toast.success(`${connectedUsers} joined the room`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      //listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.error(`${username} left the room`);
        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      });
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
      }
    };
  }, []);

  async function handleCopyRoomId() {
    try {
      await navigator.clipboard.writeText(room);
      toast.success("Room id copied to clipboard");
    } catch (error) {
      toast.error("Error copying room id");
    }
  }

  async function handleLeaveRoom() {
    router.push("/");
  }

  //localStorage.getItem('code') ||
  const [code, setCode] = useState(javascriptDefault);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    setLanguage(sl);
  };

  useEffect(() => {
    localStorage.setItem("code", code);
  }, [code]);

  useEffect(() => {
    if (enterPress && ctrlPress) {
      /* console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress); */
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
            "x-rapidapi-key":
              "c377fe8abfmsh94ba31b8a0b6956p194f15jsn6edde75aeac5",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
        }
      );
      const submissionToken = response.data.token;
      const pollResponse = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}`,
        {
          headers: {
            "x-rapidapi-key":
              "c377fe8abfmsh94ba31b8a0b6956p194f15jsn6edde75aeac5",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
        }
      );
      setOutput(
        pollResponse.data.stdout ||
          pollResponse.data.stderr ||
          pollResponse.data.compile_output ||
          "No output"
      );
    } catch (error) {
      console.error("Error:", error);
      setOutput("Error occurred while compiling/executing the code.");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="bg-primary-blue-light border-b-2 border-gray-border w-full py-2 px-4 relative top-0 flex justify-between items-center">
        <div className="flex flex-row items-center justify-center gap-5">
          <div className="flex flex-row gap-1 items-start">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
          </div>
          <Link
            href="/"
            className="hover:cursor-pointer flex items-center justify-center"
          >
            <IoChevronBack className="text-gray-400 hover:text-gray-500 text-xl " />
            <p className="text-gray-400">Back</p>
          </Link>
        </div>
        <div>
          <div>
            <div
              onClick={handleSubmit}
              className="flex flex-row gap-2 items-center hover:cursor-pointer bg-button-primary hover:bg-blue-500 rounded-lg w-auto p-2"
            >
              {loading ? (
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ) : (
                <FaPlay className="text-white text-xl" />
              )}
              <p className="text-white text-md">
                {loading ? "Compiling..." : "Run Code"}
              </p>
            </div>
          </div>
        </div>
        <div>
          <Link href="/" className="hover:cursor-pointer">
            <IoHelp className="text-white text-xl" />
          </Link>
        </div>
      </div>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12">
          <div className="flex flex-col justify-between h-[93vh] rounded-b-md md:col-span-2 lg:col-span-2 bg-primary-blue-light border-r-2 border-gray-border">
            <div>
              <div className="p-4">
                <Link href="/" className="text-2xl text-white font-bold">
                  CodeXEditor
                </Link>
                <p className="text-gray-400 text-xs italic">
                  Run your code in real-time and share with others.
                </p>
              </div>
              <div>
                <h2 className="text-lg text-left p-4">Connected</h2>
              </div>
              <div className="m-4 bg-gray-bg rounded-lg border-2 border-gray-border flex flex-col gap-2 p-4 h-auto max-h-[55vh]">
                <div className="flex flex-col gap-3">
                  {clients.map((client) => {
                    return (
                      <UserComponent
                        key={client.socketId}
                        username={client.username}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-start">
              <div className="ml-4 mb-2">
                <p
                  className="w-auto max-w-[10em] text-center hover:cursor-pointer bg-button-primary hover:bg-blue-500 rounded-lg p-2"
                  onClick={handleCopyRoomId}
                >
                  Copy Room ID
                </p>
              </div>
              <div className="ml-4 mb-2">
                <p
                  className="w-auto max-w-[10em] text-center hover:cursor-pointer bg-button-primary hover:bg-blue-500 rounded-lg p-2"
                  onClick={handleLeaveRoom}
                >
                  Leave Room
                </p>
              </div>
              <div className="px-4 py-2">
                <LanguagesDropdown onSelectChange={onSelectChange} />
              </div>
              <div className="px-4 py-2">
                <ThemeDropdown
                  handleThemeChange={handleThemeChange}
                  theme={theme}
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-7 lg:col-span-7 rounded-b-md">
            <div className="flex flex-col">
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
          </div>
          <div className="md:col-span-3 lg:col-span-3 rounded-b-md">
            <div className="p-4 flex flex-col justify-between h-[93vh] bg-primary-blue-light border-l-2 border-gray-border">
              <div className="flex flex-col justify-start">
                <h2 className="text-lg text-left">Output</h2>
                <pre className="bg-primary-blue p-4 rounded-lg w-full h-[50vh] overflow-scroll scroll-hide">
                  {output}
                </pre>
              </div>
              {/* <div className="flex flex-col">
                <h2 className="text-lg text-left">Custom Input</h2>
                <textarea
                  className=" bg-primary-blue w-full h- rounded-lg p-4 h-[20vh]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
