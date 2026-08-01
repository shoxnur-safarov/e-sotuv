"use client";

import { useState, useEffect } from "react";
import { Mail } from "lucide-react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  created_at: string;
}

export default function DashboardMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`);
        const data = await res.json();
        setMessages(data || []);
      } catch (err) {
        console.error("Xabarlar yuklanmadi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">Xabarlar</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">{messages.length} ta xabar</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-[var(--surface)] rounded-2xl">
          <Mail size={32} className="text-[var(--text-muted)]" />
          <p className="text-[var(--text-muted)]">Hozircha xabarlar yo&apos;q</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-[var(--surface)] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-[var(--text)]">{msg.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{msg.email}</p>
                </div>
                <span className="text-xs text-[var(--text-muted)]">{formatDate(msg.created_at)}</span>
              </div>
              {msg.company && (
                <p className="text-xs text-[var(--text-muted)] mb-2">Kompaniya: {msg.company}</p>
              )}
              {msg.message && (
                <p className="text-sm text-[var(--text)] mt-2 leading-relaxed">{msg.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}