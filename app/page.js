'use client'
import { useState,useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react"
import { KeyContext } from "../components/MainComponent"

function Home() {
    const getKey = useContext(KeyContext);
    const [keyAdded,setKeyAdded] = useState(false)
    const [assistants,setAssistants] = useState([])
    let addID = async () => {
        const response = await fetch('/api/storeID',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: getKey.key })
          }).then(()=>setKeyAdded(true))
    }
    const fetchData = async () => {
        const response = await fetch('/api')
        const data = await response.json();
        if(data.openAIKey!=undefined && data.openAIKey !=""){
            getKey.setKey(data.openAIKey)
            setKeyAdded(true)
        }
        if(data.assistants!=undefined && Object.keys(data.assistants).length>0){
            let getAssistants = []
            Object.keys(data.assistants).forEach((key)=>getAssistants.push(data.assistants[key]))
            setAssistants(getAssistants)
        }
      }
    useEffect(()=>{
        fetchData()
    },[])
    console.log(assistants)
    return (
        <main className="flex min-h-screen flex-col  bg-myBg ">
            <div id="header" className="flex items-center justify-between flex-wrap gap-2 bg-slate-900 text-white px-2 md:px-8 py-4  ">
                <div className="flex items-center gap-2">
                <Image src="assistant.svg" height={50} width={50} alt="logo"/>
                <h6 className="  text-3xl font-semibold">myAssistant</h6>
                </div>
            </div>
            <div className=" max-w-3xl px-2 md:px-8 py-6 flex flex-col gap-5 text-gray-800">
                {keyAdded==false?
                <div className="flex flex-col pt-4 md:pt-0 gap-2 mt-12 text-sm text-black">
                    <div className=" text-2xl font-semibold mb-4">
                        Welcome to myAssistant, let's get started with your custom assistant
                    </div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium ">Enter your <a className="underline italic" href="https://platform.openai.com/api-keys" target="_blank">OpenAI key</a> to continue</label>
                    <input  id="name" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="sk---------------" required value={getKey.key} onChange={(e)=>getKey.setKey(e.target.value)}/>
                <button onClick={addID} className="bg-mySecondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Add OpenAI Key</button>
                </div>:
                <div className=" flex flex-wrap gap-4">
                    {assistants.map((assistant)=>
                    <Link href={"/create/"+assistant.id}>
                        <div className=" border-2 px-4 py-2 flex gap-4 items-center rounded-xl h-16 min-w-[20rem] max-w-xl cursor-pointer">
                            <div className=" rounded-full bg-slate-500 h-2 w-2"/>
                            <div className=" flex flex-col">
                                <div className=" text-base font-medium">{assistant.name}</div>
                            </div>
                        </div>
                    </Link>
                    )}
                    
                    <Link href="/create/new">    
                        <div className=" border-2 px-4 py-2 flex gap-4 items-center rounded-xl h-16 min-w-[20rem] max-w-xl cursor-pointer" >
                            <div className=" text-lg">+</div>
                            <div className=" flex flex-col">
                                <div className=" text-base font-medium">Create a new assistant</div>
                            </div>
                        </div>
                    </Link>
                </div>}
            </div>
        </main>
    );
}

export default Home;