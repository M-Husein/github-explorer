import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Accordion } from "@/components/ui/accordion";
import { SearchForm } from "@/components/SearchForm";
import { UserCard } from "@/components/UserCard";
import { Footer } from "@/components/Footer";
import { searchUsers } from "@/api/github";

export default function Page(){
  const [query, setQuery] = useState<string>("");

  const usersQuery = useQuery({
    queryKey: ["users", query],
    queryFn: () => searchUsers(query, 5),
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="container mx-auto flex flex-col justify-center flex-1 space-y-6">
        <header className="text-center space-y-2 p-4">
          <img
            alt="Logo"
            src="/logo-96x96.png"
            className="inline-block"
            draggable={false}
          />
          <h1 className="text-3xl font-bold" translate="no">
            {import.meta.env.VITE_APP_NAME}
          </h1>
          <p className="text-muted-foreground">
            {import.meta.env.VITE_APP_DESCRIPTION}
          </p>
        </header>

        <SearchForm
          loading={usersQuery.isFetching}
          disabled={usersQuery.isFetching}
          onSearch={setQuery}
        />

        <section>
          <div className="pb-6 space-y-3 max-w-screen-lg mx-auto empty:hidden">
            {usersQuery.isError && (
              <div className="text-center text-red-500">
                {usersQuery.error.message}
              </div>
            )}

            {usersQuery.data && (
              <>
                <h2 className="text-xl font-semibold px-4">
                  Showing users for "{query}"
                </h2>
                <Accordion type="multiple" className="md:px-4">
                  {usersQuery.data.map((user) => 
                    <UserCard 
                      key={user.id} 
                      user={user} 
                    />
                  )}
                </Accordion>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
