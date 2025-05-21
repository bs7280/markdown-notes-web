"use client";

export function SearchBar({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (val: string) => void;
  //onToggleView?: () => void;
  //onNewNote?: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search notes..."
        className="w-full md:flex-1 px-4 py-3 text-base rounded border border-gray-300 bg-white text-black placeholder-gray-500
          dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-2 md:mt-0 flex gap-2">
        {/* <button
          onClick={onToggleView}
          className="px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          Toggle View
        </button>
        <button
          onClick={onNewNote}
          className="px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          New Note
        </button> */}
      </div>
    </div>
  );
}
