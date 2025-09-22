import { useEffect, useState } from 'react';
import { PrismAsync } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CodeView = ({
  language,
  children,
  prefixClass = "relative",
  ...etc
}: any) => {
  const [noRender, setNoRender] = useState<boolean>(true);
  const [copyMessage, setCopyMessage] = useState<boolean>(false);

  useEffect(() => {
    setNoRender(false);
  }, []);

  const copyToClipboard = async () => {
    if(!copyMessage){
      try {
        await navigator.clipboard?.writeText?.(Array.isArray(children) ? children.join('') : children);
        setCopyMessage(true);
        setTimeout(() => {
          setCopyMessage(false);
        }, 3e3);
      } catch {
        //
      }
    }
  }

  if(noRender){
    return null;
  }

  return (
    <div className={cn(prefixClass, etc.className)}>
      <Button
        className="absolute top-1 right-1 z-1"
        tabIndex={-1}
        aria-label="Copy to clipboard"
        disabled={copyMessage}
        onClick={copyToClipboard}
      >
        {copyMessage ? '✅' : '📋'}
      </Button>

      <PrismAsync
        language={language}
        PreTag="div"
        style={oneDark}
        showLineNumbers={language !== 'bash'}
        {...etc}
      >
        {('' + children).replace(/\n$/, '')}
      </PrismAsync>
    </div>
  );
}
