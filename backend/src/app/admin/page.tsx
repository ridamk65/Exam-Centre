import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen p-8 bg-zinc-50 dark:bg-black text-gray-900 dark:text-zinc-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-zinc-800">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
              Sign out
            </button>

          </form>
        </header>

        <section className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-[#1a1a1a] dark:border-zinc-800">
          <h2 className="mb-4 text-xl font-semibold">Welcome back, {session.user?.name || 'Admin'}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            You are currently logged in as a <strong>{session.user?.role}</strong>.
          </p>
          <div className="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-lg dark:bg-[#2a2a2a] dark:border-zinc-700">
            <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">Session Debug</h3>
            <pre className="text-sm overflow-auto text-gray-800 dark:text-gray-200">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </section>
      </div>
    </div>
  )
}
