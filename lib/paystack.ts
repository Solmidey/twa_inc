const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  console.warn(
    'PAYSTACK_SECRET_KEY is not set. Paystack routes will not function until configured.'
  );
}

export async function paystackFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`https://api.paystack.co${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY ?? ''}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const data = await res.json().catch(() => ({} as any));

  if (!res.ok || (data as any)?.status === false) {
    throw new Error((data as any)?.message ?? `Paystack error (${res.status})`);
  }

  return data as T;
}
