"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface Chat {
  id: string;
  text: string;
  role: "user" | "ai";
}

const getId = () => Math.random().toString(36).substring(2);

export default function Home() {
  const [form, setForm] = useState({ drive_url: "" });
  const [indexed, setIndexed] = useState(false);

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
    } else if (data && !data.indexed) {
      setCheckingIndex(false);
    }
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
    const res = await fetch("http://localhost:5000/index-gdrive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("gdrive-chat")}`,
      },
      body: JSON.stringify({
        drive_url: form.drive_url,
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
        {!indexed ? (
          <div>
            <div className="p-4 rounded-md w-[500px] bg-primary/5">
              <p className="mb-1 text-center">Start new chat</p>
              <p className="text-muted-foreground mb-4 text-center">
                Supported files: PDF, TXT, Google Doc
              </p>
              <form onSubmit={onSubmit}>
                <Input
                  disabled={checkingIndex}
                  placeholder="Chat Title (Optional)"
                />
                <Input
                  disabled={checkingIndex}
                  className="mt-2"
                  placeholder="Folder/File Link"
                  name="drive_url"
                  value={form.drive_url}
                  onChange={onChange}
                />
                <Button
                  disabled={checkingIndex}
                  className="mt-4 w-full"
                  type="submit"
                >
                  Start Chatting
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex justify-center items-center flex-col">
            <div className="border border-b-0 border-t-0 flex-1 w-full max-w-[700px]">
              {chats.map((chat) => (
                <div className="border-b p-3 flex items-start gap-3">
                  <div>
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
                      {chat.role === "ai" ? "AI" : "U"}
                    </div>
                  </div>
                  <div className="mt-1">{chat.text}</div>
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
                  placeholder="Enter your query..."
                  disabled={loadingResponse}
                />
                <Button disabled={loadingResponse} type="submit">
                  <SendHorizonal />
                </Button>
                <Button
                  onClick={() => {
                    setIndexed(false);
                    setCheckingIndex(false);
                  }}
                  disabled={loadingResponse}
                  type="button"
                >
                  <Plus />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
