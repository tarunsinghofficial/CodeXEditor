'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import vscode from "../assets/vscode.png"
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';

function JoinRoom() {

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter()

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('New room created successfully');
  }

  const joinRoom = (e) => {
    e.preventDefault();
    if (!roomId || !username) {
      toast.error('Please enter room id and username');
      return;
    }

    //redirect to room, dont use router and it must be dynamic paramter

    router.push(`/CodeEditor/${roomId}?username=${username}`)
  }

  return (
    <div className='container mx-auto'>
      <div className="grid grid-row-8 md:grid-cols-8 lg:grid-cols-8">
        <div className="row-span-3 md:col-span-3 lg:col-span-3 ">
          <div className='flex flex-col gap-10 items-center justify-center h-screen'>
            <h2 className="text-5xl md:text-7xl lg:text-5xl text-center font-[800]">
              Collab code with others.
            </h2>
            <Image src={vscode} height={2000} width={2000} alt='shared-coding' className='w-full rounded-lg' />
          </div>
        </div>
        <div className="row-span-5 md:col-span-5 lg:col-span-5">
          <div className='container mx-auto h-screen flex flex-col gap-6 items-center justify-center'>
            <h3 className="text-2xl font-semibold text-center">Hello, Programmer!</h3>
            <p className="text-gray-400 text-xl max-w-lg text-center">Enter the room id and a username to get started and collab  your code with others in real-time.</p>
            <div>
              <div className='flex flex-col gap-5'>
                <label className='text-white'>Enter Room id</label>
                <input className='bg-gray-bg p-4 rounded-lg border-2 border-gray-border w-[30em]' type="text" placeholder='Enter a room id' value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                <label className='text-white'>Enter Username</label>
                <input className='bg-gray-bg p-4 rounded-lg border-2 border-gray-border w-[30em]' type="text" placeholder='Enter a username' value={username} onChange={(e) => setUsername(e.target.value)} />
                
                <div className="flex flex-col items-center justify-center">
                  <button onClick={joinRoom} className="bg-button-primary rounded-lg p-2 flex items-center justify-center w-[10em] h-[3em]">
                    <p className="text-xl">Join</p>
                  </button>
                  <br />
                  <p className='text-xl'>Or</p>
                <a href="" className="hover:underline hover:text-button-primary text-center text-xl mt-5" onClick={createNewRoom}>Create new Room</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinRoom