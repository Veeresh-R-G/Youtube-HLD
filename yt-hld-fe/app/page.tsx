'use client'
import Image from "next/image";
import { useState } from "react";
import ReactPlayer from "react-player/lazy";
import axios from 'axios'


export default function Home() {

  const [file, setFile] = useState<any>(null)
  const [url, setUrl] = useState<string | any>('https://www.youtube.com/watch?v=LXb3EKWsInQ')


  const handleSubmit = async (event: any) => {
    event.preventDefault()


    try {

      const initFormData = new FormData()
      initFormData.append("filename", file.name)

      //initialise the multipart upload on the backend
      const initRes = await axios.post("http://localhost:3000/api/v1/initialize", initFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      const { uploadID } = initRes.data;
      alert(`Upload ID = ${uploadID}`)
      console.log(`Upload ID = ${uploadID}`);



      //100 MB chunks
      const chunkSize = 1024 * 1024 * 100
      //860 * 1024
      // const chunkSize = 1024 * 100
      const totalChunks = Math.ceil(file.size / chunkSize)
      console.log(`totalChunks = ${totalChunks} fileSize = ${file.size}`);


      let start = 0
      let uploadPromises = [];

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const chunk = file.slice(start, start + chunkSize)
        start += chunkSize

        const formdata = new FormData()
        formdata.append('filename', file.name)
        formdata.append('chunk', chunk)
        formdata.append('uploadId', uploadID)
        formdata.append("chunkindex", chunkIndex.toString())

        console.log(`Uploading Chunk = ${chunkIndex + 1} of ${totalChunks}`);


        const uploadPromise = await axios.post("http://localhost:3000/api/v1/upload", formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        console.log(uploadPromise);

        uploadPromises.push(uploadPromise.data)
      }

      // console.log(uploadPromises)
      const uploadResults = await Promise.all(uploadPromises)
      // console.log(uploadResults);


      const completedRes = await axios.post("http://localhost:3000/api/v1/complete", {
        filename: file.name,
        totalChunks: totalChunks,
        uploadId: uploadID,
        uploadResults
      })

      console.log(completedRes.data);

    }
    catch (err) {
      console.log("Error while doing multipart upload");
    }
  }



  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative z-[-1] mt-36 flex flex-col place-items-center before:absolute before:h-[200px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <p className="text-white text-2xl uppercase block">
          YOUTUBE SYSTEM DESIGN CLONE 🚀
        </p>


        <ul>
          <li> - Uploading Service ❌</li>
          <li> - Watch Service ❌</li>
          <li> - Transcoding Service ❌</li>
        </ul>
      </div>

      <button className="uppercase text-white border border-white px-4 py-2 rounded-2xl" onClick={async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        })

        setUrl(stream)
      }}>
        Stream Here
      </button>


      <div className="video-rendering mb-20">
        <ReactPlayer url={url} playing={true} loop={true} controls={true} pip={true} />
      </div>


      <div>
        <h1>---- Upload Video ----</h1>

        <form onSubmit={handleSubmit}>

          <input onChange={(event) => {
            if (event.target.files) {
              setFile(event.target.files[0]);
            }
          }} type="file" placeholder="upload video here" />
          <button className="bg-white px-3 py-1 block mt-2 text-black rounded-2xl" onClick={handleSubmit}>
            Upload File
          </button>
        </form>
      </div>





    </main>
  );
}
