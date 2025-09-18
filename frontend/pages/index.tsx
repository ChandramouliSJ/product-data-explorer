import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Product Data Explorer</h1>
      <p className="mt-4">Full-stack scraping + browsing app for World of Books</p>
      <div className="mt-6">
        <Link href="/scraper"><a className="px-4 py-2 bg-green-500 text-white rounded">Open Scraper</a></Link>
      </div>
    </main>
  );
}
