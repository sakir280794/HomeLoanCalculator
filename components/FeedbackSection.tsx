'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Star, Send, Lock, Reply, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatMonthYear } from '@/lib/utils';
import type { FeedbackRow } from '@/lib/supabase';

function StarRating({ value, onChange, readonly = false }: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= (hover || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300 dark:text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function AverageStars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300 dark:text-slate-600'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {rating.toFixed(1)}
      </span>
      <span className="text-xs text-gray-400 dark:text-gray-500">
        ({count} {count === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors placeholder-gray-400 dark:placeholder-gray-500';

export default function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', rating: 0, comment: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Admin reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [replyError, setReplyError] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  const fetchFeedback = useCallback(async () => {
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const avgRating = feedbacks.length
    ? feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length
    : 0;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (form.rating === 0) errs.rating = 'Please select a rating';
    if (!form.comment.trim()) errs.comment = 'Comment is required';
    if (form.comment.trim().length < 10) errs.comment = 'Comment must be at least 10 characters';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return; }
      setFeedbacks(prev => [data, ...prev]);
      setSubmitted(true);
      setForm({ name: '', email: '', rating: 0, comment: '' });
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim() || !adminSecret.trim()) {
      setReplyError('Reply text and admin password are required');
      return;
    }
    setReplySubmitting(true);
    setReplyError('');
    try {
      const res = await fetch(`/api/feedback/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText, adminSecret }),
      });
      const data = await res.json();
      if (!res.ok) { setReplyError(data.error ?? 'Failed to post reply'); return; }
      setFeedbacks(prev => prev.map(f => f.id === id ? data : f));
      setReplyingTo(null);
      setReplyText('');
      setAdminSecret('');
    } finally {
      setReplySubmitting(false);
    }
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
            <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Feedback & Ratings
            </h2>
            {feedbacks.length > 0 && (
              <AverageStars rating={avgRating} count={feedbacks.length} />
            )}
          </div>
        </div>
        {!submitted ? (
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
          >
            {showForm ? <ChevronUp className="w-4 h-4" /> : <Star className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'Leave a Review'}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Thanks for your feedback!
          </div>
        )}
      </div>

      {/* Submission form */}
      {showForm && !submitted && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 dark:bg-slate-700/40 rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="John Doe"
                className={inputCls}
              />
              {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="john@example.com"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <StarRating value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
            {formErrors.rating && <p className="text-xs text-red-500 mt-1">{formErrors.rating}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.comment}
              onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
              placeholder="Share your experience with this calculator..."
              rows={4}
              className={`${inputCls} resize-none`}
            />
            {formErrors.comment && <p className="text-xs text-red-500 mt-1">{formErrors.comment}</p>}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting…' : 'Submit Feedback'}
          </button>
        </form>
      )}

      {/* Feedback list */}
      {loading ? (
        <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">
          Loading reviews…
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-10 h-10 text-gray-200 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400 dark:text-gray-500">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map(fb => (
            <div key={fb.id} className="border border-gray-100 dark:border-slate-700 rounded-xl p-4">
              {/* Reviewer info */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{fb.name}</span>
                    <StarRating value={fb.rating} readonly />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(fb.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{fb.comment}</p>

              {/* Admin reply */}
              {fb.reply && (
                <div className="mt-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1">
                    <Reply className="w-3 h-3" /> Reply from Sakirhusain Syed
                  </p>
                  <p className="text-sm text-indigo-800 dark:text-indigo-200">{fb.reply}</p>
                </div>
              )}

              {/* Admin reply form */}
              {!fb.reply && replyingTo !== fb.id && (
                <button
                  onClick={() => { setReplyingTo(fb.id); setReplyError(''); }}
                  className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Lock className="w-3 h-3" /> Admin Reply
                </button>
              )}

              {replyingTo === fb.id && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write your reply…"
                    rows={3}
                    className={`${inputCls} resize-none text-xs`}
                  />
                  <input
                    type="password"
                    value={adminSecret}
                    onChange={e => setAdminSecret(e.target.value)}
                    placeholder="Admin password"
                    className={`${inputCls} text-xs`}
                  />
                  {replyError && <p className="text-xs text-red-500">{replyError}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReply(fb.id)}
                      disabled={replySubmitting}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors disabled:opacity-60"
                    >
                      <Send className="w-3 h-3" />
                      {replySubmitting ? 'Posting…' : 'Post Reply'}
                    </button>
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText(''); setAdminSecret(''); setReplyError(''); }}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
