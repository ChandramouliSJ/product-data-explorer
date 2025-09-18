import { useState } from "react";
import axios from "axios";
export default function ScraperPage() {
  const [url, setUrl] = useState("https://www.worldofbooks.com/");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  async function runScrape() {
    setLoading(true);
    try {
      const res = await axios.get((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/api/v1/scrape/category", { params: { url }});
      setResult(res.data);
    } catch (e:any) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Scrape Category</h1>
      <div className="flex gap-2 mt-4">
        <input className="flex-1 border p-2 rounded" value={url} onChange={e => setUrl(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={runScrape}>{loading ? "Scraping..." : "Scrape"}</button>
      </div>
      <pre className="mt-4 bg-white p-4 rounded shadow">{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
