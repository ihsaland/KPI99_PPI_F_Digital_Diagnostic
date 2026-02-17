'use client'

import React, { useState, useEffect } from 'react'
import { notificationsApi, Notification } from '@/lib/api'
import toast from 'react-hot-toast'

interface NotificationBellProps {
  organizationId: number
}

export default function NotificationBell({ organizationId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount()
    }, 30000)
    return () => clearInterval(interval)
  }, [organizationId])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await notificationsApi.list(organizationId, true)
      setNotifications(response.data || [])
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsApi.getUnreadCount(organizationId)
      setUnreadCount(response.data?.unread_count || 0)
    } catch (error: any) {
      console.error('Failed to fetch unread count:', error)
      // Don't show toast for background polling errors
    }
  }

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationsApi.markAsRead(notificationId)
      // Update local state
      setNotifications(notifications.filter(n => n.id !== notificationId))
      setUnreadCount(Math.max(0, unreadCount - 1))
      // Refresh to ensure consistency
      fetchUnreadCount()
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error)
      toast.error('Failed to mark notification as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead(organizationId)
      setNotifications([])
      setUnreadCount(0)
      toast.success('All notifications marked as read')
      // Refresh to ensure consistency
      fetchUnreadCount()
    } catch (error: any) {
      console.error('Failed to mark all as read:', error)
      toast.error('Failed to mark all as read')
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) {
            fetchNotifications()
          }
        }}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="divide-y divide-slate-200">
              {loading ? (
                <div className="p-4 text-center text-slate-500">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-slate-600">{notification.message}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}



