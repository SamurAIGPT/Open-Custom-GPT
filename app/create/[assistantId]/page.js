'use client'
import Image from 'next/image'
import { useState,useEffect } from "react"
import OpenAI from 'openai';
import Link from "next/link";
import { useContext } from "react"
import { KeyContext } from "../../../components/MainComponent"
import {useRouter} from "next/navigation";
export default function Create({params:{assistantId}}) {
  const router = useRouter()
  const getKey = useContext(KeyContext);
  const [name,setName] = useState("")
  const [instructions,setInstructions] = useState("")
  const [types,setTypes] = useState([])
  const [functions,setFunctions] = useState([])
  const [update,setUpdate] = useState(false)
  const [files,setFiles] = useState([])
  const [openai,setOpenai] = useState(null)
  const [assistant,setAssistant] = useState(null)
  const [showShare,setShowShare] = useState(false)


  const createAssistant = async() => {
    if(getKey.key!=""){
      if(name!=""&&instructions!=""){
        let fileIds = []
        let fileDetails = []
        if(files.length>0){
          for await (const file of files) {
            if(file.id!=null&&file.id!=undefined){
              fileIds.push(file.id)
              fileDetails.push(file)
            }else{
              let saveFile = await openai.files.create({
              file: file,
              purpose: "assistants",
              })
              fileIds.push(saveFile.id)
              fileDetails.push({id:saveFile.id,name:file.name})
            }
          }
        }
        let tools = []
        types.forEach((tool)=>
          tools.push({"type":tool})
        )
        functions.forEach((fn)=>
          tools.push({"type":"function","function":JSON.parse(fn)})
        )
        let model
        if(types.includes('retrieval')){
          model = "gpt-3.5-turbo-1106"
        }else{
          model = "gpt-3.5-turbo"
        }
        let getAssistant
        if(assistant==null){
          getAssistant = await openai.beta.assistants.create({
            name: name,
            instructions: instructions,
            model:model,
            tools: tools,
            file_ids: fileIds
          })
        }else{
          console.log("updating")
          getAssistant = await openai.beta.assistants.update(assistant,{
            name: name,
            instructions: instructions,
            model:model,
            tools: tools,
            file_ids: fileIds
          })
        }
        setAssistant(getAssistant.id)
        setFiles(fileDetails)
        setShowShare(true)
        const response = await fetch('/api/assistant',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: getAssistant.id,name:name,instructions:instructions,model:model,tools:tools,files:fileDetails })
        })
        if(assistantId=="new"){
          router.push('/create/'+getAssistant.id)
        }
        
        
      }else{
        alert("Add you assistant's name and instructions!")
      }
    }else{
      alert('Add your OpenAI Key!')
    }
  }

  const addType = (type) => {
    if(types.includes(type)){
      var filteredArray = types.filter(e => e !== type)
      setTypes(filteredArray)
    }else{
      setTypes([...types,type])
    }
  }
  const addFunction = (index,input) => {
    functions[index] = input
    setUpdate((prev)=>!prev)
  }
  const removeFunction = (index) => {
    if(index==0){
      setFunctions([])
    }else{
      let newFns = functions.splice(index,1)
      setFunctions(newFns)
    }
  }
  const removeFile = async(file) => {
    var filteredArray = files.filter(e => e.name !== file.name)
    setFiles(filteredArray)
    if(assistant!=null){
      const deletedAssistantFile = await openai.beta.assistants.files.del(
        assistant,
        file.id
      );
    }
  }
  const shareEmbed = (type) => {
    if(type==0){
      navigator.clipboard.writeText('<iframe src="'+window.location.host+'/embed/'+assistant+'" />')
    }else{
      navigator.clipboard.writeText(window.location.host+'/embed/'+assistant)
    }
  }

  const fetchAssistant = async() => {
    const response = await fetch('/api?assistantId='+assistantId)
    const data = await response.json();
    let getOpenai = new OpenAI({apiKey:data.openAIKey, dangerouslyAllowBrowser: true})
    setOpenai(getOpenai)
    getKey.setKey(data.openAIKey)
    // let myAssistant = await getOpenai.beta.assistants.retrieve(
    //   assistantId
    // );
    if(data.assistant!=null){
      setAssistant(data.assistant.id)
      setShowShare((prev)=>true)
      setName(data.assistant.name)
      setInstructions(data.assistant.instructions)
      data.assistant.tools.forEach(tool => {
        if(tool.type=="function"){
          setFunctions([...functions,tool.function])
        }else{
          setTypes([...types,tool.type])
        }
      });
      setFiles(data.assistant.files)
    }
  }

  useEffect(()=>{
      fetchAssistant()
  },[])
  return (
    <main className="flex min-h-screen flex-col  bg-myBg ">
        <div id="header" className="flex items-center justify-between flex-wrap gap-2 bg-slate-900 text-white px-2 md:px-8 py-4  ">
            <div className="flex items-center gap-2">
              <Image src="/assistant.svg" height={50} width={50} alt="logo"/>
              <h6 className="  text-3xl font-semibold">Open Custom GPT</h6>
            </div>
            <Link href="/">
              <Image src="/home.svg" height={20} width={20} alt="home"/>
            </Link>
        </div>
        {showShare==false?<div className=" max-w-3xl px-2 md:px-8 py-6 flex flex-col gap-5 text-gray-800">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium ">Enter assistant name</label>
            <input  id="name" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="UX Designer" required value={name} onChange={(e)=>setName(e.target.value)}/>
          </div>
          <div>
            <label htmlFor="instructions" className="block mb-2 text-sm font-medium ">Enter instructions</label>
            <textarea id="instructions" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required placeholder="Act as a UX Designer to help with my project." value={instructions} onChange={(e)=>setInstructions(e.target.value)}/>
          </div>
          <div>
            <label htmlFor="type" className="block mb-2 text-sm font-medium ">Select type of assistant</label>
            <div className="flex flex-col gap-3 text-sm">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer"  onClick={()=>addType('code_interpreter')}/>
                <div className={`w-9 h-5  rounded-full peer     after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-mySecondary  after:rounded-full after:w-4 after:h-4 after:transition-all ${types.includes('code_interpreter')?'after:translate-x-full rtl:after:-translate-x-full after:border-white bg-myPrimary':'bg-myBg'}`}></div>
                <span className="ms-3 font-medium ">Code Interpreter</span>
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer"  onClick={()=>addType('retrieval')}/>
                <div className={`w-9 h-5  rounded-full peer     after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-mySecondary  after:rounded-full after:w-4 after:h-4 after:transition-all ${types.includes('retrieval')?'after:translate-x-full rtl:after:-translate-x-full after:border-white bg-myPrimary':'bg-myBg'}`}></div>
                <span className="ms-3 font-medium ">Retrieval</span>
              </label>
              <div className="flex items-center gap-5 cursor-pointer">
                <div className=" rounded-full bg-myBg text-mySecondary text-xl font-bold px-2 w-min" onClick={()=>{setFunctions([...functions,''])}}>+</div>
                <span className="font-medium ">Functions</span>

              </div>
            </div>
            {functions.map((fn,index)=><div key={index} className="relative">
              <textarea id="functions" className="bg-gray-50 mt-3 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-60" required placeholder='{"name": "get_weather", "description": "Determine weather in my location"}'  value={fn} onChange={(e)=>addFunction(index,e.target.value)}/>
              <div className="absolute z-10 top-1 right-4 font-bold cursor-pointer" onClick={()=>removeFunction(index)}>x</div>
              </div>)}


          </div>
          <div className="flex flex-col gap-2">
            <label className=" text-sm font-medium " htmlFor="user_avatar">Upload files</label>
            <input className=" text-sm border border-gray-300 rounded-lg p-2 cursor-pointer bg-gray-50 focus:outline-none" aria-describedby="user_avatar_help" id="user_avatar" type="file" onChange={(e)=>setFiles([...files,e.target.files[0]])}/>
            <div className="flex gap-2">
              {files.map((file,index)=><div className="text-xs w-min whitespace-nowrap border border-gray-400 py-1 px-2 rounded-xl flex gap-1">{file.name}  <b className=" cursor-pointer" onClick={()=>removeFile(file)}>x</b></div>)}
            </div>
          </div>

          <button onClick={createAssistant} className=" bg-mySecondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Submit</button>
          {assistant!=null&&<button onClick={()=>setShowShare(true)} className=" bg-mySecondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Share created assistant</button>}
        </div>:<div className="h-full grow px-2 md:px-8 py-6 flex flex-col gap-5 text-gray-800">
          <div className="flex flex-wrap gap-2 justify-between w-full">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 cursor-pointer" onClick={()=>setShowShare(false)}>
                <Image src='/back.svg' width={10} height={10} alt="share"/>
                <small className="">Back</small>
              </div>
              <div className="flex items-center gap-2">
                <Image src='/link.svg' width={20} height={20} alt="share"/>
                <h6 className="font-semibold text-xl">Share your assistant</h6>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>shareEmbed(0)} className=" bg-mySecondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2.5 text-center whitespace-nowrap">
                  Copy Embed
              </button>
              <button onClick={()=>shareEmbed(1)} className=" bg-mySecondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2.5 text-center whitespace-nowrap">
                  Copy Link
              </button>
            </div>
          </div>  
          <iframe src={"/embed/"+assistant} className="h-full grow rounded-xl border"/>
        </div>}
    </main>
  )
}
