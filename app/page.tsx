"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Plus, RotateCw, SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { marked } from "marked";

interface Chat {
  id: string;
  text: string;
  role: "user" | "ai";
}

const getId = () => Math.random().toString(36).substring(2);

export default function Home() {
  const [form, setForm] = useState({ drive_url: "", name: "" });
  const [showController, setShowController] = useState(false);
  const [indexed, setIndexed] = useState(false);

  const [indexing, setIndexing] = useState(false);

  const { toast } = useToast();

  const [checkingIndex, setCheckingIndex] = useState(true);

  const [query, setQuery] = useState("");

  const [chats, setChats] = useState<Array<Chat>>([]);

  const [loadingResponse, setLoadingResponse] = useState(false);

  const [streaming, setStreaming] = useState<string>("");

  async function isIndexed() {
    const res = await fetch("http://localhost:5000/indexed", {
      headers: {
        Authorization: `${localStorage.getItem("gdrive-chat")}`,
      },
    });

    if (!res.ok) {
      const data = await res.text();
      console.log(data);
      return;
    }

    const data = await res.json();

    if (data && data.indexed) {
      setIndexed(true);
      setForm({ drive_url: data.indexLink, name: data.indexName });
    } else if (data && !data.indexed) {
      setShowController(true);
    }

    setCheckingIndex(false);
  }

  async function getResponse() {
    setLoadingResponse(true);
    let responseString = "";

    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("gdrive-chat")}`,
      },
      body: JSON.stringify({
        query,
      }),
    });

    if (!res.ok) {
      const data = await res.text();
      console.log(data);
      setLoadingResponse(false);
      setChats((prev) => [
        ...prev,
        { text: "Oops! An error occured", role: "ai", id: getId() },
      ]);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) return;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setChats((prev) => [
          ...prev,
          {
            id: getId(),
            role: "ai",
            text: responseString,
          },
        ]);
        setStreaming("");
        break;
      }
      const chunk = new TextDecoder("utf-8").decode(value);

      responseString += chunk;
      streamer(chunk);
    }

    function streamer(token: string) {
      setStreaming((prev) => prev + token);
    }

    setLoadingResponse(false);
  }

  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("gdrive-chat")) {
      router.push("/login");
    } else {
      isIndexed();
    }
  }, []);

  async function startIndexing() {
    setIndexing(true);
    const res = await fetch("http://localhost:5000/index-gdrive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("gdrive-chat")}`,
      },
      body: JSON.stringify({
        drive_url: form.drive_url,
        name: form.name,
      }),
    });

    if (!res.ok) {
      const data = await res.text();
      console.log(data);
      return;
    }

    const data = await res.json();

    if (data && data.status === "success") {
      setIndexed(true);
      setShowController(false);
      setIndexing(false);
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSend(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!query) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending",
      });
      return;
    }

    const userChat: Chat = {
      id: getId(),
      role: "user",
      text: query,
    };
    setChats((prev) => [...prev, userChat]);
    await getResponse();
    setQuery("");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.drive_url) return;
    await startIndexing();
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-9/12 h-full flex justify-center items-center">
        {showController ? (
          <div>
            {indexing ? (
              <div className="p-4 rounded-md w-[500px] bg-primary/5 flex flex-col items-center justify-center">
                <p>Refreshing Index</p>
                <p className="text-center mt-3">
                  It might take a while to index your documents based on their
                  size.
                </p>
                <img
                  className="mt-3"
                  src="/bars-rotate-fade.svg"
                  alt="spinner"
                />
              </div>
            ) : (
              <div className="p-4 rounded-md w-[500px] bg-primary/5">
                <div className="mb-1 text-center flex items-center justify-between">
                  <>
                    <Button
                      className="p-0 m-0"
                      variant={"secondary"}
                      onClick={() => {
                        setShowController(false);
                      }}
                    >
                      <ArrowLeft size={20} />
                    </Button>
                    <p>Start new chat</p>
                    <p></p>
                  </>
                </div>

                <p className="text-muted-foreground mb-4 text-center">
                  Supported files: PDF, TXT, Google Doc
                </p>
                <form onSubmit={onSubmit}>
                  <Input
                    disabled={checkingIndex}
                    placeholder="Chat Title (Optional)"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                  />
                  <Input
                    disabled={checkingIndex}
                    className="mt-2"
                    placeholder="Folder/File Link"
                    name="drive_url"
                    value={form.drive_url}
                    onChange={onChange}
                  />
                  <div className="flex items-center gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          disabled={checkingIndex}
                          className="mt-4 w-full"
                          type="submit"
                        >
                          Start Chatting
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Start Chatting with you files</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div
            className="relative w-full h-full flex justify-center items-center flex-col"
            style={{ minHeight: "min-content" }}
          >
            <div className="text-sm py-1 underline border border-t-0 w-full max-w-[700px] text-center">
              <div className="flex items-center justify-center gap-3">
                <a href={form.drive_url}>{form.name}</a>
                <AlertDialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant={"outline"}
                          size="icon"
                          className="p-1 w-8 h-8"
                          onClick={startIndexing}
                        >
                          <RotateCw size={18} />
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Re-Index your drive documents</p>
                    </TooltipContent>
                  </Tooltip>
                  <AlertDialogContent
                    security="on"
                    className="sm:max-w-[425px] flex justify-center items-center flex-col"
                  >
                    {indexing ? (
                      <>
                        <p>Refreshing Index</p>
                        <p className="text-center">
                          It might take a while to index your documents based on
                          their size.
                        </p>
                        <img src="/bars-rotate-fade.svg" alt="spinner" />
                      </>
                    ) : (
                      <>
                        <p>Indexing Complete</p>
                        <AlertDialogCancel>Updated! Continue</AlertDialogCancel>
                      </>
                    )}
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className="border border-b-0 border-t-0 flex-1 w-full max-w-[700px] overflow-auto">
              {chats.map((chat) => (
                <div className="border-b p-3 flex items-start gap-3">
                  <div>
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
                      {chat.role === "ai" ? "AI" : "U"}
                    </div>
                  </div>
                  {/* <div className="mt-1">{chat.text}</div> */}
                  <div
                    className="mt-1 marked"
                    dangerouslySetInnerHTML={{ __html: marked(chat.text) }}
                  ></div>
                </div>
              ))}
              {streaming && (
                <div className="border-b p-3 flex items-start gap-3">
                  <div>
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
                      AI
                    </div>
                  </div>
                  <div className="mt-1">{streaming}</div>
                </div>
              )}
            </div>
            <div className="w-full p-4 border border-b-0 max-w-[700px]">
              <form
                className="w-full flex items-center gap-4 max-w-[700px]"
                onSubmit={handleSend}
              >
                <Input
                  name="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your message"
                  disabled={loadingResponse}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button disabled={loadingResponse} type="submit">
                      <SendHorizonal />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send your message</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        setShowController(true);
                      }}
                      disabled={loadingResponse}
                      type="button"
                    >
                      <Plus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start chatting on new folder</p>
                  </TooltipContent>
                </Tooltip>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
