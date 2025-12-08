import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

export type RevealResponse = {
  inviteUrl?: string;
  token?: string;
  status: 'pending' | 'authorized' | 'revealed' | 'error' | 'unpaid';
  message?: string;
};

type Props = {
  sessionId?: string;
};

const ProtectedReveal: React.FC<Props> = ({ sessionId }) => {
  const [state, setState] = useState<RevealResponse>({ status: 'pending' });
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    if (!sessionId) return;
    const requestToken = async () => {
      try {
        const res = await fetch(`/api/reveal?session_id=${sessionId}`);
        const data = await res.json();
        if (!res.ok) {
          setState({ status: data.status ?? 'error', message: data.message });
          return;
        }
        if (data.token) {
          setToken(data.token);
          setState({ status: 'authorized', message: 'Payment verified. Revealing secure invite…' });
        }
      } catch (error) {
        console.error(error);
        setState({ status: 'error', message: 'Unable to verify payment right now.' });
      }
    };
    requestToken();
  }, [sessionId]);

  useEffect(() => {
    if (!token) return;
    const fetchInvite = async () => {
      try {
        const res = await fetch('/api/reveal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (!res.ok) {
          setState({ status: data.status ?? 'error', message: data.message });
          return;
        }
        setState({ status: 'revealed', inviteUrl: data.inviteUrl, message: 'Invite unlocked. Welcome inside!' });
      } catch (error) {
        console.error(error);
        setState({ status: 'error', message: 'Could not fetch your invite. Please reach support.' });
      }
    };
    fetchInvite();
  }, [token]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/80 p-6 shadow-lg dark:bg-white/5">
      <div className="flex items-center gap-3">
        <span className={clsx('h-3 w-3 rounded-full', state.status === 'revealed' ? 'bg-emerald-500' : 'bg-amber-400')} aria-hidden />
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Secure Discord access</p>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        We verify your Paystack payment automatically. Once confirmed, your invite link is generated server-side and shown here for a short time.
      </p>
      <div className="mt-4 rounded-2xl bg-slate-100/70 p-4 text-sm text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
        {state.status === 'pending' && <p>Waiting for payment confirmation…</p>}
        {state.status === 'authorized' && <p>{state.message}</p>}
        {state.status === 'unpaid' && <p>We have not marked this session as paid yet. Please refresh once your payment finalizes.</p>}
        {state.status === 'error' && <p>{state.message ?? 'Something went wrong.'}</p>}
        {state.status === 'revealed' && (
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Invite link</p>
            <a href={state.inviteUrl} className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-white focus-ring" target="_blank" rel="noreferrer">
              Open Discord
            </a>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Keep this private—expires in 15 minutes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtectedReveal;
