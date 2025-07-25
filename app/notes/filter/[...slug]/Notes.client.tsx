"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getNotes } from "../../../../lib/api";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import NoteList from "../../../../components/NoteList/NoteList";
import { NoteForm } from "../../../../components/NoteForm/NoteForm";
import Pagination from "../../../../components/Pagination/Pagination";
import Modal from "../../../../components/Modal/Modal";
import type { GetNotes } from "../../../../lib/api";
import css from "./page.module.css";

export default function Notes({ initialData, tag }: { initialData: GetNotes, tag: string }) {
  const [page, setPage] = useState(1); 
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery<GetNotes>({
    queryKey: ['notes', page, debouncedSearchTerm, tag], 
    queryFn: () => getNotes(page, 12, debouncedSearchTerm, tag === "All" ? undefined : tag),
    placeholderData: keepPreviousData,
    initialData: page === 1 && debouncedSearchTerm === '' ? initialData : undefined,
  });

  return (
    <>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onSearch={handleSearchChange} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isModalOpen && (
      <Modal onClose={() => setIsModalOpen(false)}>
        <NoteForm onClose={() => setIsModalOpen(false)}/>
      </Modal>
      )}

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong</p>}

      {data && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} />
          {data.totalPages > 1 && (
            <Pagination
              totalPages={data.totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </>
  );
}