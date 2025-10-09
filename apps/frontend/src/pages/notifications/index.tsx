import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Eye, EyeOff, Trash2, ExternalLink, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Table, TableColumn } from '@/components/basic/table';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';

import { NotificationService } from '@/services/notificationService';
import { NotificationData } from '@/types/notification';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotifications, setSelectedNotifications] = useState<NotificationData[]>([]);
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const [notificationsData, unreadCountData] = await Promise.all([
        NotificationService.getNotifications(100, 0),
        NotificationService.getUnreadCount()
      ]);
      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle mark as viewed
  const handleMarkAsViewed = async (notification: NotificationData) => {
    if (notification.isViewed) return;

    try {
      await NotificationService.markAsViewed(notification.id);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, isViewed: true, viewedAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as viewed:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  // Handle mark all as viewed
  const handleMarkAllAsViewed = async () => {
    try {
      await NotificationService.markAllAsViewed();
      setNotifications(prev => 
        prev.map(n => ({ ...n, isViewed: true, viewedAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as viewed:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (notification: NotificationData) => {
    try {
      await NotificationService.deleteNotification(notification.id);
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
      if (!notification.isViewed) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Handle delete selected notifications
  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedNotifications.map(notification => 
          NotificationService.deleteNotification(notification.id)
        )
      );
      setNotifications(prev => 
        prev.filter(n => !selectedNotifications.some(selected => selected.id === n.id))
      );
      const deletedUnreadCount = selectedNotifications.filter(n => !n.isViewed).length;
      setUnreadCount(prev => Math.max(0, prev - deletedUnreadCount));
      setSelectedNotifications([]);
      toast.success(`${selectedNotifications.length} notifications deleted`);
    } catch (error) {
      console.error('Error deleting selected notifications:', error);
      toast.error('Failed to delete selected notifications');
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: NotificationData) => {
    // Mark as viewed if not already viewed
    if (!notification.isViewed) {
      handleMarkAsViewed(notification);
    }

    // Navigate to associated link if available
    if (notification.associatedLink) {
      navigate(notification.associatedLink);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Table columns
  const columns: TableColumn<NotificationData>[] = [
    {
      key: 'status',
      header: 'Status',
      accessor: (notification) => (
        <div className="flex items-center space-x-2">
          {notification.isViewed ? (
            <Eye className="h-4 w-4 text-gray-400" />
          ) : (
            <div className="relative">
              <Bell className="h-4 w-4 text-blue-600" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full"></div>
            </div>
          )}
          {!notification.isViewed && (
            <Badge variant="secondary" className="text-xs">
              New
            </Badge>
          )}
        </div>
      ),
      width: '120px',
      searchable: false,
    },
    {
      key: 'content',
      header: 'Message',
      accessor: (notification) => (
        <div className="max-w-md">
          <p className={`text-sm ${notification.isViewed ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
            {notification.content}
          </p>
        </div>
      ),
      searchable: true,
      searchValue: (notification) => notification.content,
    },
    {
      key: 'createdAt',
      header: 'Date',
      accessor: (notification) => (
        <span className="text-sm text-gray-500">
          {formatDate(notification.createdAt)}
        </span>
      ),
      width: '120px',
      sortable: true,
      searchable: false,
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (notification) => (
        <div className="flex items-center space-x-1">
          {notification.associatedLink && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(notification.associatedLink!);
              }}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
      width: '100px',
      searchable: false,
    },
  ];

  // Table actions
  const actions = [
    {
      label: (notification: NotificationData) => 
        notification.isViewed ? 'Mark as unread' : 'Mark as read',
      icon: (notification: NotificationData) => 
        notification.isViewed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />,
      onClick: handleMarkAsViewed,
      variant: 'ghost' as const,
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDeleteNotification,
      variant: 'destructive' as const,
    },
  ];

  // Bulk actions
  const bulkActions = [
    {
      label: 'Mark as read',
      icon: <CheckCheck className="h-4 w-4" />,
      onClick: async (selected: NotificationData[]) => {
        const unreadSelected = selected.filter(n => !n.isViewed);
        if (unreadSelected.length === 0) return;

        try {
          await Promise.all(
            unreadSelected.map(notification => 
              NotificationService.markAsViewed(notification.id)
            )
          );
          setNotifications(prev => 
            prev.map(n => 
              selected.some(s => s.id === n.id) && !n.isViewed
                ? { ...n, isViewed: true, viewedAt: new Date().toISOString() }
                : n
            )
          );
          setUnreadCount(prev => Math.max(0, prev - unreadSelected.length));
          setSelectedNotifications([]);
          toast.success(`${unreadSelected.length} notifications marked as read`);
        } catch (error) {
          console.error('Error marking selected notifications as viewed:', error);
          toast.error('Failed to mark notifications as read');
        }
      },
      disabled: (selected: NotificationData[]) => 
        selected.every(n => n.isViewed),
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDeleteSelected,
      variant: 'destructive' as const,
    },
  ];

  if (loading) {
    return (
      <PageLayout>
        <LoadingSpinner message="Loading notifications..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        icon={Bell}
        title="Notifications"
        description={`You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        badge={
          unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )
        }
        action={
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsViewed}
                className="flex items-center space-x-2"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Mark all as read</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNotifications}
              className="flex items-center space-x-2"
            >
              <Bell className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <Table
          data={notifications}
          columns={columns}
          sortable={true}
          pagination={true}
          searchable={true}
          selectable={true}
          onRowClick={handleNotificationClick}
          onSelectionChange={setSelectedNotifications}
          pageSize={20}
          pageSizeOptions={[10, 20, 50, 100]}
          actions={actions}
          bulkActions={bulkActions}
          emptyMessage={
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! No new notifications to show.</p>
            </div>
          }
          loading={loading}
        />
      </div>
    </PageLayout>
  );
};

export default NotificationsPage;