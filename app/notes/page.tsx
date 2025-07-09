import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getNotes } from "../../lib/api";
import type { GetNotes } from "../../lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  const data: GetNotes = await getNotes(1, 12, '');

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, ""], 
    queryFn: () => Promise.resolve(data),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialData={data} />
    </HydrationBoundary>
  );
}