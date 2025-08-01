export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-ted-red">
        Next.js + Tailwind CSS
      </h1>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-ted-dark">
            環境構築完了！
          </h2>
          <p className="text-gray-600 mb-4">
            Next.js + Tailwind CSSの開発環境が正常にセットアップされました。
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Next.js 14.2.5</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Tailwind CSS</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>TypeScript</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}