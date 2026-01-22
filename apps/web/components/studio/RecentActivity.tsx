import React from 'react';

const activities = [
  {
    id: 'a1',
    title: 'OracleInsights V4 reached 10k calls',
    time: '2 hours ago',
    color: 'bg-indigo-500',
  },
  {
    id: 'a2',
    title: 'Withdrawal of 500 USDT successful',
    time: 'Yesterday',
    color: 'bg-emerald-500',
  },
  {
    id: 'a3',
    title: 'New version of Linguist Pro available',
    time: '3 days ago',
    color: 'bg-slate-400',
  },
];

export function RecentActivity() {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">
        Recent Activity
      </h3>
      <ul className="space-y-4 text-sm">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start gap-3">
            <span className={`mt-1 h-2 w-2 rounded-full ${activity.color}`} />
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {activity.title}
              </p>
              <p className="text-xs text-slate-400">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
