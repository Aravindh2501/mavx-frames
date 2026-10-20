export async function api<T>(
  url: string,
  opts: { method?: string; body?: unknown } = {}
): Promise<T> {
  const run = () =>
    fetch(url, {
      method: opts.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': sessionStorage.getItem('admin-key') ?? ''
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    })

  let res = await run()
  if (res.status === 401) {
    const key = window.prompt('Enter the admin key to continue')
    if (key) {
      sessionStorage.setItem('admin-key', key)
      res = await run()
    }
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? 'Request failed')
  }
  return res.json() as Promise<T>
}
