import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const userSession = cookieStore.get('user_session')?.value

  if (userSession) {
    redirect('/profile/view?warn=already_logged_in')
  }

  return (
    <>{children}</>
  )
}
