import LoginClient from '@/components/LoginClient'

const isSafeInternalPath = (value) => typeof value === 'string' && value.startsWith('/')

export const metadata = {
  title: 'Login',
}

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = await searchParams
  const candidate = resolvedSearchParams?.redirectTo ?? resolvedSearchParams?.next ?? '/'
  const redirectTarget = isSafeInternalPath(candidate) ? candidate : '/'

  return <LoginClient redirectTarget={redirectTarget} />
}
