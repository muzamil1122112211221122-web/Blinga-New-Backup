import { useEffect, useMemo, useState } from "react";
import { FileText, Grid2X2, List, Search } from "lucide-react";

type LibraryItem = { name: string; type: "image" | "file" | "video"; src: string; meta: string };
type Filter = "All" | "Images" | "Files" | "Videos";

const libraryItems: LibraryItem[] = [];

function Preview({ item, small = false }: { item: LibraryItem; small?: boolean }) {
  const size = small ? "h-10 w-10 rounded-lg" : "h-full w-full";
  if (item.type === "image") return <img src={item.src} alt="" className={`${size} object-cover`} />;
  if (item.type === "video") return <video src={item.src} muted className={`${size} object-cover`} />;
  return <div className={`${size} flex items-center justify-center bg-muted`}><FileText className="h-8 w-8 text-muted-foreground" /></div>;
}

export function LibraryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [grid, setGrid] = useState(true);
  const filters: Filter[] = ["All", "Images", "Files", "Videos"];
  const filtered = useMemo(() => libraryItems.filter(item =>
    (filter === "All" || (filter === "Images" && item.type === "image") || (filter === "Files" && item.type === "file") || (filter === "Videos" && item.type === "video")) && item.name.toLowerCase().includes(query.toLowerCase())
  ), [filter, query]);
  const filterIndex = filters.indexOf(filter);

  useEffect(() => {
    document.body.classList.add("library-route-active");
    return () => document.body.classList.remove("library-route-active");
  }, []);

  return <main className="absolute inset-0 overflow-y-auto bg-background text-foreground">
    <div className="mx-auto max-w-[1180px] px-6 py-8 md:px-10 md:py-10">
      <div className="relative flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-medium tracking-tight">Library</h1><label className="absolute left-1/2 top-[72px] z-20 flex h-10 w-[260px] -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card px-4 text-muted-foreground"><Search className="h-4 w-4" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search library..." className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label></div>
      <div className="relative mt-8 flex items-center justify-between gap-4"><div className="relative flex h-10 w-[320px] items-center rounded-full bg-muted p-1"><span className="pointer-events-none absolute inset-y-1 left-1 w-[calc(25%_-_2px)] rounded-full bg-background shadow-sm transition-transform duration-250 ease-out" style={{ transform: `translateX(${filterIndex * 100}%)` }} />{filters.map(tab => <button key={tab} onClick={() => setFilter(tab)} className={`relative z-10 flex-1 rounded-full text-sm transition-colors ${filter === tab ? "text-foreground" : "text-muted-foreground"}`}>{tab}</button>)}</div><div className="relative flex h-10 w-[88px] items-center rounded-full bg-muted p-1"><span className="pointer-events-none absolute inset-y-1 left-1 w-10 rounded-full bg-background shadow-sm transition-[left] duration-250 ease-out" style={{ left: grid ? '4px' : '44px' }} /><button onClick={() => setGrid(true)} aria-label="Grid view" className={`relative z-10 flex-1 rounded-full p-2 ${grid ? "text-foreground" : "text-muted-foreground"}`}><Grid2X2 className="mx-auto h-4 w-4" /></button><button onClick={() => setGrid(false)} aria-label="List view" className={`relative z-10 flex-1 rounded-full p-2 ${!grid ? "text-foreground" : "text-muted-foreground"}`}><List className="mx-auto h-4 w-4" /></button></div></div>
      {filtered.length ? (grid ? <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">{filtered.map(item => <article key={item.name} className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"><div className="aspect-square overflow-hidden bg-muted"><Preview item={item} /></div><div className="p-3"><p className="truncate text-sm font-medium">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{item.meta}</p></div></article>)}</div> : <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">{filtered.map(item => <div key={item.name} className="flex items-center gap-3 border-b border-border p-3 last:border-b-0"><Preview item={item} small /><span className="text-sm font-medium">{item.name}</span><span className="ml-auto text-xs text-muted-foreground">{item.meta}</span></div>)}</div>) : <div className="py-32 text-center text-sm text-muted-foreground">Your library is empty.</div>}
    </div>
  </main>;
}
