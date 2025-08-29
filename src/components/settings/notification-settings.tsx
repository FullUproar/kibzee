"use client"

import { useState } from "react"

interface NotificationSettingsProps {
  user: any // TODO: Add proper types
}

export default function NotificationSettings({ user }: NotificationSettingsProps) {
  const [notifications, setNotifications] = useState({
    // Email notifications
    emailBookingRequests: true,
    emailBookingConfirmations: true,
    emailBookingReminders: true,
    emailMessages: true,
    emailReviews: true,
    emailPayments: true,
    emailPromotions: false,
    emailNewsletter: false,
    
    // Push notifications
    pushBookingRequests: true,
    pushBookingConfirmations: true,
    pushBookingReminders: true,
    pushMessages: true,
    pushReviews: true,
    
    // SMS notifications
    smsBookingReminders: false,
    smsCancellations: true,
  })

  const handleToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  const handleSave = async () => {
    // TODO: Implement save API
    console.log("Saving notification preferences:", notifications)
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="card p-6">
        <h2 className="text-xl font-serif mb-6">Email Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Booking Requests</p>
              <p className="text-sm text-gray-600">Get notified when someone requests a lesson</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailBookingRequests}
                onChange={() => handleToggle("emailBookingRequests")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Booking Confirmations</p>
              <p className="text-sm text-gray-600">Confirmations and cancellations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailBookingConfirmations}
                onChange={() => handleToggle("emailBookingConfirmations")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Lesson Reminders</p>
              <p className="text-sm text-gray-600">Reminders 24 hours before lessons</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailBookingReminders}
                onChange={() => handleToggle("emailBookingReminders")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Messages</p>
              <p className="text-sm text-gray-600">New messages from students or teachers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailMessages}
                onChange={() => handleToggle("emailMessages")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Reviews</p>
              <p className="text-sm text-gray-600">When someone leaves you a review</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailReviews}
                onChange={() => handleToggle("emailReviews")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Payments</p>
              <p className="text-sm text-gray-600">Payment confirmations and issues</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailPayments}
                onChange={() => handleToggle("emailPayments")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
          </div>

          <hr className="my-4" />

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Promotions & Tips</p>
              <p className="text-sm text-gray-600">Special offers and platform tips</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailPromotions}
                onChange={() => handleToggle("emailPromotions")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Newsletter</p>
              <p className="text-sm text-gray-600">Monthly updates and community news</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailNewsletter}
                onChange={() => handleToggle("emailNewsletter")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
            </label>
          </div>
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="card p-6">
        <h2 className="text-xl font-serif mb-6">SMS Notifications</h2>
        
        {user.phoneNumber ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Notifications will be sent to: {user.phoneNumber}
            </p>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Lesson Reminders</p>
                <p className="text-sm text-gray-600">Get SMS reminders 2 hours before lessons</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.smsBookingReminders}
                  onChange={() => handleToggle("smsBookingReminders")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Cancellations</p>
                <p className="text-sm text-gray-600">Immediate alerts for lesson cancellations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.smsCancellations}
                  onChange={() => handleToggle("smsCancellations")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
              </label>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 p-4 rounded-subtle">
            <p className="text-amber-800">
              Add a phone number in General Settings to enable SMS notifications
            </p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button onClick={handleSave} className="btn btn-primary">
          Save Preferences
        </button>
      </div>
    </div>
  )
}