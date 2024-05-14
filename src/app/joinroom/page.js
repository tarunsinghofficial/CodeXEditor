"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import u5 from "../assets/u3.svg";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";

function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("New room created successfully");
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (!roomId || !username) {
      toast.error("Please enter room id and username");
      return;
    }

    //redirect to room, dont use router and it must be dynamic paramter

    setLoading(true);

    // Delay the redirection by 2 seconds to allow the loading animation to display
    setTimeout(() => {
      router.push(`/CodeEditor/${roomId}?username=${username}`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row lg:flex-row items-center justify-center gap-32 p-10">
        <div className="">
          <div className="flex flex-col gap-10 items-center justify-center h-screen">
            <h2 className="text-5xl md:text-7xl lg:text-5xl text-center font-[800]">
              Collab code with others.
            </h2>
            <Image
              src={u5}
              height={2000}
              width={2000}
              alt="shared-coding"
              className="w-[40rem] rounded-lg"
            />
          </div>
        </div>
        <div className="">
          <div className="w-auto h-screen flex flex-col gap-6 items-center justify-center">
            <h3 className="text-2xl font-semibold text-center">
              Hello, Programmer!
            </h3>
            <p className="text-gray-400 text-xl max-w-lg text-center">
              Enter the room id and a username to get started and collab your
              code with others in real-time.
            </p>
            <div>
              <div className="flex flex-col gap-5">
                <label className="text-white">Enter Room id</label>
                <input
                  className="bg-gray-bg p-4 rounded-lg border-2 border-gray-border w-[30em]"
                  type="text"
                  placeholder="Enter a room id"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <label className="text-white">Enter Username</label>
                <input
                  className="bg-gray-bg p-4 rounded-lg border-2 border-gray-border w-[30em]"
                  type="text"
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <div className="flex flex-col items-center justify-center">
                  <button
                    onClick={joinRoom}
                    className="bg-button-primary rounded-lg p-2 flex items-center justify-center w-[10em] h-[3em]"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg
                          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <p className="text-xl">Joining</p>
                      </div>
                    ) : (
                      <p className="text-xl">Join</p>
                    )}
                  </button>
                  <br />
                  <p className="text-xl">Or</p>
                  <a
                    href=""
                    className="hover:underline hover:text-button-primary text-center text-xl mt-5"
                    onClick={createNewRoom}
                  >
                    Create a new Room
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
