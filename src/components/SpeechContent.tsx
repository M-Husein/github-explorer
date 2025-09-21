import { useState, useEffect, useRef, useCallback } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Gauge, Music, VolumeX, Volume2, Pause, Megaphone, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type SpeechContentProps = {
  className?: string
  text?: string | any
  content?: React.ReactElement
}

const speechSyn: any = typeof window !== 'undefined' && window.speechSynthesis;
const SpeechUtterance: any = typeof window !== 'undefined' && window.SpeechSynthesisUtterance;

export const SpeechContent = ({
  className,
  text,
  content,
}: SpeechContentProps) => {
  const utteranceRef: any = useRef(null);
  const divRef: any = useRef(null);
  const [voice, setVoice] = useState<string>('0');
  const [rateValue, setRateValue] = useState<number>(1);
  const [pitchValue, setPitchValue] = useState<number>(1);
  const [volumeValue, setVolumeValue] = useState<number>(1);
  const [isSpeak, setIsSpeak] = useState<boolean>(false);
  const [isPause, setIsPause] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[] | undefined | null>(null);

  const populateVoiceList = useCallback(() => {
    if(!!speechSyn && !!SpeechUtterance){
      const optionVoices = speechSyn.getVoices().map((item: any, i: number) => Object.assign(item, { value: '' + i }) );
      setVoices(optionVoices);
    }
  }, []);
  
  useEffect(() => {
    populateVoiceList();

    if(speechSyn && speechSyn.onvoiceschanged !== undefined){
      speechSyn.onvoiceschanged = populateVoiceList;
    }
  }, [populateVoiceList]);

  useEffect(() => {
    const endSpeak = () => {
      setIsSpeak(false);
      setIsPause(false);
    }

    const errorSpeak = (e: any) => {
      if(e.error !== 'interrupted'){
        setIsSpeak(false);
        setIsPause(false);
      }
    }

    // Stop speech when reload page or close tab
    const beforeUnload = () => {
      speechSyn.cancel(); // Stop
    }

    if(utteranceRef.current){
      utteranceRef.current.addEventListener("error", errorSpeak);
      utteranceRef.current.addEventListener("end", endSpeak);
      window.addEventListener("beforeunload", beforeUnload, { capture: true });
    }
    
    return () => {
      utteranceRef.current?.removeEventListener?.("error", errorSpeak);
      utteranceRef.current?.removeEventListener?.("end", endSpeak);
      window.removeEventListener("beforeunload", beforeUnload, { capture: true });
    }
  }, [utteranceRef.current, speechSyn]);

  // Stop speech when unmounted
  useEffect(() => {
    return () => {
      if(utteranceRef.current){
        stopSpeak();
      }
    }
  }, []);

  const voiceOptions = () => Object.entries(
    (voices || []).reduce((acc: any, obj: any) => {
      const key = obj.lang;
      const curGroup = acc[key] ?? [];
      return { ...acc, [key]: [...curGroup, obj] };
    }, {})
  )
  .toSorted((a: any, b: any) => {
    const aname = a[0].toUpperCase();
    const bname = b[0].toUpperCase();
    if (aname < bname) return -1;
    else if (aname == bname) return 0;
    else return +1;
  });

  const toggleSpeak = (value?: any) => {
    if(text && window.SpeechSynthesisUtterance){
      if(speechSyn.speaking && !speechSyn.paused){
        speechSyn.pause(); // pause narration
        setIsSpeak(false);
        setIsPause(true);
        return;
      }

      setIsSpeak(true);

      if(speechSyn.paused){
        speechSyn.resume(); // unpause/resume narration
        setIsPause(false);
        return;
      }

      utteranceRef.current = new SpeechUtterance(text);

      utteranceRef.current.rate = rateValue;
      utteranceRef.current.pitch = pitchValue;
      utteranceRef.current.volume = volumeValue;
      utteranceRef.current.voice = (voices || [])[+(value || voice)];

      speechSynthesis.speak(utteranceRef.current);
    }
  }

  const stopSpeak = () => {
    if(speechSyn.speaking){
      speechSyn.cancel(); // stop narration
      setIsSpeak(false);
      setIsPause(false);
    }
  }

  const changeVoice = (e: any) => {
    let val = e.target.value;
    setVoice(val);

    if(isSpeak){
      stopSpeak(); // Stop
      toggleSpeak(val);
    }
  }

  if(!voices){
    return null;
  }

  return (
    <div 
      ref={divRef} 
      className={cn("flex flex-wrap gap-1", className)}
    >
      <select
        className="rounded-lg p-1 cursor-pointer grow max-md:w-full"
        value={voice}
        onChange={changeVoice}
      >
        {voiceOptions().map(([key, options]: [string, any]) =>
          <optgroup key={key} label={key}>
            {options.map((item: any) =>
              <option key={item.value} value={item.value}>
                {item.name}
                {item.default ? ' -- DEFAULT' : ''}
              </option>
            )}
          </optgroup>
        )}
      </select>

      <Popover>
        <PopoverTrigger asChild>
          <Button title="Speech rate">
            <Gauge />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-10">
          <Slider
            className="h-32"
            orientation="vertical"
            min={0.5}
            max={2}
            step={0.1}
            value={[rateValue]}
            onValueChange={(val) => setRateValue(val[0])}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button title="Speech pitch">
            <Music />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-10">
          <Slider
            className="h-32"
            orientation="vertical"
            min={0.5}
            max={2}
            step={0.1}
            value={[pitchValue]}
            onValueChange={(val) => setPitchValue(val[0])}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button 
            title="Speech volume" 
            disabled={isSpeak || isPause}
            className={isSpeak || isPause ? "pointer-events-none" : ""}
          >
            {volumeValue <= 0 ? <VolumeX /> : <Volume2 />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-10">
          <Slider
            className="h-32"
            orientation="vertical"
            min={0}
            max={1}
            step={0.05}
            value={[volumeValue]}
            onValueChange={(val) => setVolumeValue(val[0])}
          />
        </PopoverContent>
      </Popover>

      <Button
        title={isSpeak ? 'Pause' : 'Speak'}
        onClick={() => toggleSpeak()}
      >
        {isSpeak ? <Pause /> : <Megaphone />}
      </Button>
      
      <Button
        title="Stop speak"
        disabled={!isSpeak}
        onClick={stopSpeak}
      >
        <Square />
      </Button>

      {content}
    </div>
  )
}
