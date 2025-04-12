"use client";

import { useEffect, useState } from "react";
import { useFrameSDK } from "~/hooks/useFrameSDK";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

export default function Frame() {
  const { isSDKLoaded } = useFrameSDK();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy Result");
  const [copyButtonDisabled, setCopyButtonDisabled] = useState(true);

  // Logika penerjemahan Blepblopia
  const blepblopiaCode: { [key: string]: string } = {
    a: "blep",
    b: "blub",
    c: "blop",
    d: "dlep",
    e: "blib",
    f: "flub",
    g: "glop",
    h: "hlep",
    i: "blip",
    j: "jlub",
    k: "klop",
    l: "lblep",
    m: "mlub",
    n: "nlop",
    o: "blopz",
    p: "pleb",
    q: "qlub",
    r: "rblub",
    s: "slep",
    t: "tlop",
    u: "blubz",
    v: "vlep",
    w: "wblop",
    x: "xlub",
    y: "yblep",
    z: "zlop",
    " ": "bblb",
  };

  const textToBlepblopia = (text: string) => {
    return text
      .toLowerCase()
      .split("")
      .map((char) => blepblopiaCode[char] || char)
      .join(" ");
  };

  const blepblopiaToText = (blepblopia: string) => {
    let cleanedInput = blepblopia.replace(/( blip| blub| blep)$/i, "");
    const words = cleanedInput.split(" ");
    return words
      .map((word) => {
        return (
          Object.keys(blepblopiaCode).find(
            (key) =>
              blepblopiaCode[key].toLowerCase() === word.toLowerCase()
          ) || word
        );
      })
      .join("");
  };

  const translateToBlepblopia = () => {
    const result = textToBlepblopia(input) + " blub";
    setOutput(result);
    setCopyButtonDisabled(false);
  };

  const translateToText = () => {
    const result = blepblopiaToText(input);
    setOutput(result);
    setCopyButtonDisabled(false);
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopyButtonText("Copied!");
      setTimeout(() => {
        setCopyButtonText("Copy Result");
      }, 2000);
    } catch (err) {
      // Fallback jika clipboard API gagal
      const tempTextarea = document.createElement("textarea");
      tempTextarea.value = output;
      document.body.appendChild(tempTextarea);
      tempTextarea.select();
      try {
        document.execCommand("copy");
        setCopyButtonText("Copied!");
        setTimeout(() => {
          setCopyButtonText("Copy Result");
        }, 2000);
      } catch (err) {
        alert("Failed to copy: " + (err as Error).message);
        setCopyButtonText("Copy Failed");
        setTimeout(() => {
          setCopyButtonText("Copy Result");
        }, 2000);
      }
      document.body.removeChild(tempTextarea);
    }
  };

  if (!isSDKLoaded) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-2 px-2 min-h-screen bg-gray-100 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Blepblopia Translator</h2>
      <Textarea
        id="input"
        placeholder="Enter text or Blepblopia code"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-32 p-2 text-base border border-gray-300 rounded-md resize-y mb-4"
      />
      <div className="flex gap-2 justify-center mb-4 w-full">
        <Button
          onClick={translateToBlepblopia}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
        >
          Text to Blepblopia
        </Button>
        <Button
          onClick={translateToText}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
        >
          Blepblopia to Text
        </Button>
      </div>
      <div
        id="output"
        className="w-full p-2 bg-white border border-gray-300 rounded-md min-h-[100px] whitespace-pre-wrap break-words mb-4"
      >
        {output || "Translation will appear here..."}
      </div>
      <Button
        id="copyButton"
        onClick={copyResult}
        disabled={copyButtonDisabled}
        className={`w-full ${
          copyButtonDisabled ? "opacity-50" : ""
        } bg-blue-500 hover:bg-blue-600 text-white`}
      >
        {copyButtonText}
      </Button>
    </div>
  );
}
