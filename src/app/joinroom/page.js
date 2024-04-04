import Image from 'next/image'
import React from 'react'
import vscode from "../assets/vscode.png"
import Link from 'next/link'

function JoinRoom() {
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
            <div className='flex flex-col gap-5'>
              <label className='text-white'>Enter Room id</label>
              <input className='bg-gray-bg p-4 rounded-lg border-2 border-gray-border w-[30em]' type="text" placeholder='Enter a room id' />
              <label className='text-white'>Enter Username</label>
              <input className='bg-gray-bg p-4 rounded-lg border-2 border-gray-border w-[30em]' type="text" placeholder='Enter a username' />
              <div className="flex items-center justify-center">
              <Link href="/CodeEditor" className="bg-button-primary rounded-lg p-2 flex items-center justify-center w-[10em] h-[3em]">
                <p className="text-xl">Join</p>
              </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JoinRoom