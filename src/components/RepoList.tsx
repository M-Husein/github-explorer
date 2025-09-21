import { Link } from 'react-router';
import { Card } from "@/components/ui/card";
import { parseNumber, numShort } from "@/lib/utils";
import type { GitHubRepo } from "@/api/github";

interface RepoListProps {
  repos: GitHubRepo[]
}

export const RepoList = ({ repos }: RepoListProps) => {
  if (repos?.length) {
    return (
      <div className="grid gap-3">
        {repos.map((repo) => (
          <Card
            key={repo.id}
            className="rounded-lg border"
          >
            {!!repo.stargazers_count && (
              <a
                href={`https://github.com/${repo.owner.login}/${repo.name}/stargazers`}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                title={repo.stargazers_count ? parseNumber(repo.stargazers_count) + ' Stars' : void 0}
                className="float-right text-xs text-gray-600 py-1 px-2 rounded-bl border-b border-l shadow"
              >
                ⭐ {numShort(repo.stargazers_count)}
              </a>
            )}

            <Link
              to={`/repo/${repo.owner.login}/${repo.name}`}
              className="hover:bg-orange-50 block p-3 text-base"
            >
              <strong>{repo.name}</strong>
              <div className="text-sm text-muted-foreground mt-1">
                {repo.description ?? "No description provided"}
              </div>
            </Link>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <p className="text-muted-foreground text-center">
      No repositories found.
    </p>
  );
}
