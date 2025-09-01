import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    { name: '進行中專案', value: '8', change: '+2', changeType: 'increase' },
    { name: '待處理採購', value: '23', change: '+12', changeType: 'increase' },
    { name: '本月支出', value: '¥2.4M', change: '+15%', changeType: 'increase' },
    { name: '延誤項目', value: '3', change: '-1', changeType: 'decrease' },
  ];

  return (
    <div className="space-y-6">
      {/* 歡迎標題 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          歡迎回來，{user?.name}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          這是您的專案管理儀表板
        </p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-sm ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近專案 */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">最近專案</h3>
            <div className="mt-4 space-y-4">
              {[
                { name: '台北101商場改建', status: '進行中', progress: 75 },
                { name: '高雄港區住宅', status: '規劃中', progress: 25 },
                { name: '台中工業園區', status: '完工', progress: 100 },
              ].map((project, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{project.name}</p>
                    <p className="text-xs text-gray-500">{project.status}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 待辦事項 */}
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">待辦事項</h3>
            <div className="mt-4 space-y-3">
              {[
                { task: '審核預算申請', priority: 'high', dueDate: '今天' },
                { task: '回覆廠商詢價', priority: 'medium', dueDate: '明天' },
                { task: '準備進度報告', priority: 'low', dueDate: '本週五' },
                { task: '驗收材料交貨', priority: 'high', dueDate: '下週一' },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.task}</p>
                    <p className="text-xs text-gray-500">到期：{item.dueDate}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.priority === 'high' 
                      ? 'bg-red-100 text-red-800'
                      : item.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="card p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">快捷操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: '新建專案', icon: '➕', href: '/projects' },
            { name: '發送詢價', icon: '📤', href: '/inquiries' },
            { name: '建立採購', icon: '🛒', href: '/purchases' },
            { name: '查看報表', icon: '📊', href: '/reports' },
          ].map((action) => (
            <button
              key={action.name}
              className="p-4 text-center bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm font-medium text-gray-900">{action.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}