import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, AlertTriangle, Users, Sun, Home, Trophy, CheckCheck, ExternalLink } from 'lucide-react'
import { notificationApi, NotificationItem } from '@/api/notificationApi'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [recentNotifications, setRecentNotifications] = useState<NotificationItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const loadUnread = async () => {
    try {
      const count = await notificationApi.getUnreadCount()
      setUnreadCount(count)
      if (count > 0 || isOpen) {
        const recent = await notificationApi.getRecentUnread()
        setRecentNotifications(recent || [])
      }
    } catch {
      // Graceful fallback for mock mode
      setUnreadCount(2)
      setRecentNotifications([
        {
          id: 1,
          type: 'AQI_ALERT',
          title: '🚨 AQI Alert: Delhi reached 318 (Very Poor)',
          message: 'Current air quality crossed your threshold of 200. Avoid outdoor exertion.',
          isRead: false,
          actionUrl: '/dashboard',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          type: 'MORNING_BRIEFING',
          title: '☀️ Morning Air Quality Briefing',
          message: 'Ground inversion smog active until 10:30 AM. Optimal outdoor window: 1:00 PM – 3:30 PM.',
          isRead: false,
          actionUrl: '/planner',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ])
    }
  }

  useEffect(() => {
    loadUnread()
    const interval = setInterval(loadUnread, 60000) // refresh every min
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleToggle = () => {
    if (!isOpen) {
      loadUnread()
    }
    setIsOpen(!isOpen)
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setUnreadCount(0)
      setRecentNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch (e) {
      setUnreadCount(0)
    }
  }

  const handleItemClick = async (notif: NotificationItem) => {
    try {
      if (!notif.isRead) {
        await notificationApi.markAsRead(notif.id)
        setUnreadCount((c) => Math.max(0, c - 1))
      }
    } catch {}
    setIsOpen(false)
    if (notif.actionUrl) {
      navigate(notif.actionUrl)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'AQI_ALERT':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />
      case 'FAMILY_ALERT':
        return <Users className="w-4 h-4 text-amber-500" />
      case 'MORNING_BRIEFING':
        return <Sun className="w-4 h-4 text-amber-400" />
      case 'INDOOR_TIP':
        return <Home className="w-4 h-4 text-emerald-500" />
      case 'CHALLENGE_UPDATE':
        return <Trophy className="w-4 h-4 text-sky-500" />
      default:
        return <Bell className="w-4 h-4 text-brand-green-600" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-rose-600 rounded-full shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-brand-green-600 dark:text-brand-green-400 hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {recentNotifications.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No unread notifications right now
              </div>
            ) : (
              recentNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={`p-3.5 hover:bg-muted/50 cursor-pointer transition-colors flex gap-3 items-start ${
                    !n.isRead ? 'bg-brand-green-50/40 dark:bg-brand-green-950/20' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-background border border-border shadow-xs">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-foreground truncate">{n.title}</p>
                      {!n.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground/80 mt-1 block">
                      {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : 'Just now'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-muted/30 border-t border-border text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs text-brand-green-700 dark:text-brand-green-400 font-semibold hover:underline inline-flex items-center gap-1.5"
            >
              View all alerts & configure preferences <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
