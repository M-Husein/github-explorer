import { useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from "@tanstack/react-query";
import { Avatar } from 'q-react-ui/Avatar';
import { Search } from "lucide-react";
import { Link } from 'react-router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loading } from "@/components/Loading";
import { MarkdownView } from '@/components/MarkdownView';
import { SpeechContent } from '@/components/SpeechContent';
import { numShort, parseDate, parseNumber } from '@/lib/utils';
import { getUserRepo, getReadme } from "@/api/github";

const githubUrl = "https://github.com/";

export default function Page(){
  const { username, repo } = useParams();
  const contentRef: any = useRef(null);
  const [mountMarkdown, setMountMarkdown] = useState<boolean>(false);

  const isEnabled = !!username && !!repo;

  const copyToClipboard = (id: any) => {
    let input = document.getElementById(id) as HTMLInputElement;
    if(input){
      input.focus();
      input.select();
      input.setSelectionRange(0, 99999); // For mobile devices

      navigator?.clipboard?.writeText?.(input.value);
    }
  }

  const renderTag = (label: string, date: string) => (
    <span className="bg-gray-200 inline-block py-1 px-2 rounded">
      {label}: <time dateTime={date}>{parseDate(date)}</time>
    </span>
  );

  const renderButtonSearch = (className?: string) => (
    <Button asChild>
      <Link
        to="/"
        title="🔍 Search user"
        aria-label="Search user"
        className={className}
      >
        <Search />
      </Link>
    </Button>
  );

  const userRepo = useQuery({
    queryKey: ["repo", username + '-' + repo],
    queryFn: () => getUserRepo(username || "", repo || ""),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 2,
  });

  const detail = userRepo?.data;

  const readme = useQuery({
    queryKey: ["readme", username + '-' + repo],
    queryFn: () => getReadme(username || "", repo || ""),
    enabled: isEnabled,
    staleTime: 1000 * 60 * 2,
  });

  if (userRepo.isLoading || userRepo.error) {
    return (
      <div className="min-h-dvh grid place-content-center">
        {userRepo.error
          ? (
            <div>
              <p>Error: {userRepo.error?.message}</p>
              {renderButtonSearch()}
              {" "}
              <Button onClick={() => userRepo.refetch()}>
                Reload
              </Button>
            </div>
          )
          : <Loading />
        }
      </div>
    );
  }

  const markdown = (() => {
    if(readme?.data){
      return atob(readme?.data.content || '');
    }
    return '';
  })();

  return (
    <div className="max-w-screen-lg mx-auto">
      {!!detail && (
        <article className="p-4">
          <h1 className="text-3xl font-normal! break-all">
            <a
              href={detail.owner?.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Avatar
                draggable={false}
                alt={username}
                src={detail.owner?.avatar_url}
                className="rounded mr-4"
                size={32}
              />
              {username}
            </a>
            <span className="mx-1">/</span>
            <a
              href={detail.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {repo}
            </a>
            <sup className="ml-2 py-1 px-2 rounded-xl text-xs border border-gray-300 font-medium shadow">
              {detail.private ? 'Private' : 'Public'}
            </sup>
          </h1>

          <div className="text-xs mt-2 space-x-1 space-y-1">
            {renderTag('Created at', detail.created_at)}
            {renderTag('Updated at', detail.updated_at)}
            {renderTag('Pushed at', detail.pushed_at)}
          </div>

          <div className="my-5 flex flex-col lg:flex-row flex-wrap gap-2">
            <Button asChild>
              <a
                href={`${githubUrl}${username}/${repo}/watchers`}
                target="_blank"
                rel="noopener noreferrer"
                title={detail.watchers_count ? parseNumber(detail.watchers_count) + ' watchers' : ''}
                className="flex items-center gap-x-2"
              >
                👁️ Watch
                <b className="border border-solid border-gray-400 px-2 rounded-lg ml-auto">
                  {detail.watchers_count ? numShort(detail.watchers_count) : 0}
                </b>
              </a>
            </Button>
            
            <Button asChild>
              <a
                href={`${githubUrl}${username}/${repo}/forks`}
                target="_blank"
                rel="noopener noreferrer"
                title={detail.forks_count ? parseNumber(detail.forks_count) + ' forks' : ''}
                className="flex items-center gap-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
                </svg>
                Fork
                <b className="border border-gray-400 px-2 rounded-lg ml-auto">
                  {detail.forks_count ? numShort(detail.forks_count) : 0}
                </b>
              </a>
            </Button>

            <Button asChild>
              <a
                href={`${githubUrl}${username}/${repo}/stargazers`}
                target="_blank"
                rel="noopener noreferrer"
                title={detail.stargazers_count ? parseNumber(detail.stargazers_count) + ' Stars' : ''}
                className="flex items-center gap-x-2"
              >
                ⭐ Starred
                <b className="border border-solid border-gray-400 px-2 rounded-lg ml-auto">
                  {detail.stargazers_count ? numShort(detail.stargazers_count) : 0}
                </b>
              </a>
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button>
                  Code
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <>
                  <h6>Clone</h6>
                  {
                    [
                      { label: "HTTPS", value: detail.clone_url },
                      { label: "SSH", value: detail.ssh_url },
                      { label: "GitHub CLI", value: 'gh repo clone ' + detail.full_name },
                    ].map((item: any, idx: number) =>
                      <div key={item.label} className="py-1.5">
                        <label htmlFor={"cloneInput" + idx}>{item.label}</label>
                        <div className="flex mt-px w-full">
                          <Input
                            readOnly
                            value={item.value}
                            className="truncate mr-1"
                            id={"cloneInput" + idx}
                          />
                          <Button 
                            onClick={() => copyToClipboard("cloneInput" + idx)}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    )
                  }
                  
                  <Button asChild>
                    <a
                      href={`${githubUrl}${username}/${repo}/archive/refs/heads/${detail.default_branch}.zip`}
                      download
                      className="mt-3 w-full"
                    >
                      Download ZIP
                    </a>
                  </Button>
                </>
              </PopoverContent>
            </Popover>
          </div>

          <hr className="my-4" />

          {!!detail.description && <p className="text-lg">{detail.description}</p>}

          {!!detail.homepage && (
            <a 
              href={detail.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold break-all"
            >
              🔗{detail.homepage}
            </a>
          )}

          {!!detail?.topics?.length && (
            <p className="flex flex-row flex-wrap gap-2 mt-5 font-semibold text-xs">
              {detail.topics.map((item: string) =>
                <a
                  key={item}
                  href={`${githubUrl}topics/${item}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 px-2 rounded-xl bg-blue-200"
                >
                  {item}
                </a>
              )}
            </p>
          )}

          <section 
            ref={contentRef} 
            className="md-view my-5"
          >
            {!userRepo.isLoading && !readme.isLoading && !!markdown && (
              <MarkdownView 
                className="my-5"
                onMounted={() => setMountMarkdown(true)}
              >
                {markdown}
              </MarkdownView>
            )}
          </section>
        </article>
      )}

      {!!markdown && mountMarkdown ? (
          <SpeechContent
            text={contentRef.current?.innerText || markdown || ''}
            className="justify-center bg-gray-200 border-gray-200 border rounded-t-lg shadow sticky bottom-0 left-0 right-0 z-30 p-1"
            content={renderButtonSearch()}
          />
        )
        :
        renderButtonSearch("fixed bottom-2 right-2 z-10")
      }
    </div>
  );
}
