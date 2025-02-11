export default function DiaryListLoading() {
  return (
    <div className="flex flex-col h-full mb-20">
      {/* 헤더 스켈레톤 */}
      <div className="p-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-gray-200 rounded-lg" />
      </div>

      <div className="p-4 md:p-8">
        {/* 필터 영역 스켈레톤 */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 animate-pulse">
          <div className="w-64 h-10 bg-gray-200 rounded-lg mb-4 sm:mb-0" />
          <div className="flex space-x-2">
            <div className="w-24 h-10 bg-gray-200 rounded-lg" />
            <div className="w-24 h-10 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* 카드 스켈레톤 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className="bg-white border rounded-xl p-4 animate-pulse"
            >
              <div className="flex space-x-2 mb-4">
                <div className="w-16 h-6 bg-gray-200 rounded-full" />
                <div className="w-16 h-6 bg-gray-200 rounded-full" />
              </div>
              <div className="h-40 bg-gray-200 rounded-lg mb-4" />
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
