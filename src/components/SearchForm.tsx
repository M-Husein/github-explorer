import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "q-react-ui/Form";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { Loading } from "@/components/Loading";

interface SearchFormProps {
  loading?: boolean
  disabled?: boolean
  value: string
  onSearch: (query: string) => void
}

export const SearchForm = ({ 
  loading,
  disabled,
  value,
  onSearch
}: SearchFormProps) => {
  const [query, setQuery] = useState<string>(value);
  const [listening, setListening] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let trimValue = query.trim();
    if(trimValue){
      onSearch(trimValue);
    }else{
      const input = (e.target as HTMLFormElement).elements[1] as HTMLInputElement;
      input?.focus();

      onSearch("");
    }
  }

  const handleInputChange = (val: string) => {
    setQuery(val);
    if(!val.trim()){
      onSearch("");
    }
  }

  const toggleListening = () => {
    if(!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)){
      toast.error("Not supported", {
        description: "Speech recognition is not available in this browser.",
      });
      return;
    }

    if(listening){
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition: SpeechRecognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true)
      toast.info("Listening...", {
        description: "Speak now to search GitHub users.",
      });
    }
    
    recognition.onerror = () => setListening(false);

    recognition.onend = () => {
      setListening(false)
      toast.info("Stopped listening", {
        description: "Voice search ended.",
      });
    }

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      onSearch(transcript);
    }

    recognitionRef.current = recognition;
    recognition.start();
  }

  const renderMic = () => {
    let FixMic = listening ? MicOff : Mic;
    return <FixMic className="h-4 w-4" />;
  }

  return (
    <Form
      role="search"
      className="bg-white sticky top-0 z-2 p-2"
      disabled={disabled}
      fieldsetProps={{
        className: "border-0 flex gap-1 w-full max-w-md mx-auto" 
      }}
      onSubmit={handleSubmit}
    >
      <Input
        type="search"
        role="searchbox"
        placeholder="Search GitHub users..."
        disabled={disabled}
        value={query}
        onChange={e => handleInputChange(e.target.value)}
      />
      <Button
        type="button"
        disabled={disabled}
        variant={listening ? "destructive" : "outline"}
        className="px-3"
        onClick={toggleListening}
      >
        {renderMic()}
      </Button>
      <Button 
        type="submit" 
        disabled={disabled}
        className={"w-20" + (loading ? " cursor-wait" : "")}
      >
        {loading ? <Loading size={16} strokeWidth={3} stroke="#fff" /> : "Search"}
      </Button>
    </Form>
  )
}
