import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from 'q-react-ui/Avatar';
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { RepoList } from "./RepoList";
import { numShort } from "@/lib/utils";
import { type GitHubUser, fetchUserRepos, getUser } from "@/api/github";

interface UserCardProps {
  user: GitHubUser
}

const renderSkeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ))}
  </div>
);

export const UserCard = ({ user }: UserCardProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState("");
  const [language, setLanguage] = useState<string | null>(null);

  const reposQuery = useQuery({
    queryKey: ["repos", user.login],
    queryFn: () => fetchUserRepos(user.login),
    enabled: open,
    staleTime: 1000 * 60 * 5,
  });

  const userDetail = useQuery({
    queryKey: ["user", user.login],
    queryFn: () => getUser(user.login),
    enabled: open,
    staleTime: 1000 * 60 * 5,
  });

  // Trigger fetch when accordion opens
  const handleOpenChange = () => {
    if (!open && !reposQuery.isFetching && !userDetail.isFetching) {
      reposQuery.refetch();
      userDetail.refetch();
    }
    setOpen(prev => !prev);
  }

  const repos = reposQuery.data || [];

  const filteredRepos = repos.filter(repo => {
    const matchFilter = repo.name.toLowerCase().includes(filter.toLowerCase());
    const matchLanguage = language ? repo.language === language : true;
    return matchFilter && matchLanguage;
  });

  // Collect available languages
  const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))].map(value => ({ value, label: value }));

  return (
    <AccordionItem 
      value={user.login} 
      className="border"
    >
      <AccordionTrigger
        className={"bg-white hover:bg-orange-50 sticky top-[52px] z-1" + (open ? " border-b" : "")}
        onClick={handleOpenChange}
      >
        <div className="flex items-center">
          <Avatar
            alt={user.login}
            src={user.avatar_url}
            size={40}
            className="rounded-full border"
          />
          <span className="text-lg font-medium ml-4">{user.login}</span>
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left column: User profile */}
          <section className="bg-gray-50 p-4 flex flex-col items-center md:items-start">
            <Avatar
              alt={user.login}
              src={user.avatar_url}
              size={96}
              className="rounded-full border mb-4 block mx-auto"
            />

            <h3 className="text-lg font-semibold">
              <a 
                href={user.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                {user.name ?? user.login}
              </a>
            </h3>

            <p>
              <a 
                href={user.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                @{user.login}
              </a>
            </p>

            <div className="mt-4 space-y-2 text-sm">
              {(userDetail.isLoading || userDetail.isFetching) && renderSkeleton()}

              {userDetail.data && (
                <>
                  {!!userDetail.data?.bio && <p>{userDetail.data.bio}</p>}

                  {typeof userDetail.data?.followers === 'number' && (
                    <p>
                      👥 {numShort(userDetail.data.followers)} followers ~ {numShort(userDetail.data.following)} following
                    </p>
                  )}

                  {!!userDetail.data?.location && (
                    <p>
                      📍 {userDetail.data.location}
                    </p>
                  )}

                  {!!userDetail.data?.email && (
                    <p>
                      <a href={"mailto:" + userDetail.data.email}>
                        ✉️ {userDetail.data.email}
                      </a>
                    </p>
                  )}
                  
                  {!!userDetail.data?.blog && (
                    <p>
                      🔗{" "}
                      <a
                        href={userDetail.data.blog.startsWith("http") ? userDetail.data.blog : `https://${userDetail.data.blog}`}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {userDetail.data.blog}
                      </a>
                    </p>
                  )}

                  {!!userDetail.data?.twitter_username && (
                    <p>
                      <a 
                        href={"https://twitter.com/" + userDetail.data.twitter_username} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        @{userDetail.data.twitter_username}
                      </a>
                    </p>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Right column: Repos */}
          <div className="md:col-span-2 p-3">
            <div 
              role="search"
              className="flex max-md:flex-wrap items-center gap-2 mb-4"
            >
              <Input
                type="search"
                role="searchbox"
                placeholder="Search repository"
                disabled={reposQuery.isLoading}
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />

              <Select
                options={languages}
                disabled={reposQuery.isLoading}
                value={language || ""}
                onChange={setLanguage}
                placeholder="Language"
              />
            </div>

            {reposQuery.isLoading && renderSkeleton()}

            {reposQuery.isError && (
              <p className="text-red-500">
                Error: {(reposQuery.error as Error).message}
              </p>
            )}

            {reposQuery.isSuccess && <RepoList repos={filteredRepos} />}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
