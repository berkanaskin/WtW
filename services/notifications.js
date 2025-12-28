// ============================================
// WtW NOTIFICATION SERVICE
// Platform availability notifications + general notifications
// ============================================

class NotificationService {
    constructor() {
        this.notificationsKey = 'wtw_notifications';
        this.watchlistKey = 'wtw_platform_watchlist';
        this.maxNotifications = 50;
    }

    // ============================================
    // NOTIFICATIONS
    // ============================================

    getAll() {
        try {
            return JSON.parse(localStorage.getItem(this.notificationsKey) || '[]');
        } catch {
            return [];
        }
    }

    getUnreadCount() {
        return this.getAll().filter(n => !n.read).length;
    }

    add(notification) {
        const notifications = this.getAll();
        const newNotification = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            read: false,
            ...notification
        };

        notifications.unshift(newNotification);

        if (notifications.length > this.maxNotifications) {
            notifications.splice(this.maxNotifications);
        }

        localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
        this.updateBadge();
        return newNotification;
    }

    markAsRead(id) {
        const notifications = this.getAll();
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
            this.updateBadge();
        }
    }

    markAllAsRead() {
        const notifications = this.getAll();
        notifications.forEach(n => n.read = true);
        localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
        this.updateBadge();
    }

    delete(id) {
        let notifications = this.getAll();
        notifications = notifications.filter(n => n.id !== id);
        localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
        this.updateBadge();
    }

    clearAll() {
        localStorage.setItem(this.notificationsKey, '[]');
        this.updateBadge();
    }

    updateBadge() {
        const count = this.getUnreadCount();
        const badge = document.getElementById('notification-badge');
        if (badge) {
            badge.textContent = count > 9 ? '9+' : count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // ============================================
    // PLATFORM WATCHLIST - "Haber Ver" Feature
    // ============================================

    getWatchlist() {
        try {
            return JSON.parse(localStorage.getItem(this.watchlistKey) || '[]');
        } catch {
            return [];
        }
    }

    addToWatchlist(item) {
        const watchlist = this.getWatchlist();

        if (watchlist.some(w => w.id === item.id && w.type === item.type)) {
            return false;
        }

        watchlist.push({
            id: item.id,
            type: item.type,
            title: item.title,
            poster: item.poster,
            addedAt: new Date().toISOString()
        });

        localStorage.setItem(this.watchlistKey, JSON.stringify(watchlist));

        this.add({
            type: 'watchlist',
            title: 'Takibe Alındı',
            message: `${item.title} bir platforma geldiğinde haber vereceğiz.`,
            icon: '👁️',
            itemId: item.id,
            itemType: item.type
        });

        return true;
    }

    removeFromWatchlist(id, type) {
        let watchlist = this.getWatchlist();
        watchlist = watchlist.filter(w => !(w.id == id && w.type === type));
        localStorage.setItem(this.watchlistKey, JSON.stringify(watchlist));
    }

    isInWatchlist(id, type) {
        return this.getWatchlist().some(w => w.id == id && w.type === type);
    }

    // Check watchlist for new providers (call on app load)
    async checkWatchlistForProviders() {
        const watchlist = this.getWatchlist();
        if (watchlist.length === 0) return;

        const region = localStorage.getItem('detectedRegion') || 'TR';

        for (const item of watchlist) {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/${item.type}/${item.id}/watch/providers?api_key=${CONFIG.TMDB_API_KEY}`
                );

                if (!response.ok) continue;

                const data = await response.json();
                const providers = data.results?.[region];

                if (providers?.flatrate && providers.flatrate.length > 0) {
                    const platformNames = providers.flatrate.map(p => p.provider_name).join(', ');

                    this.add({
                        type: 'platform_available',
                        title: '🎉 Artık İzlenebilir!',
                        message: `${item.title} şimdi ${platformNames} platformunda mevcut!`,
                        icon: '🎬',
                        itemId: item.id,
                        itemType: item.type
                    });

                    this.removeFromWatchlist(item.id, item.type);
                }
            } catch (error) {
                console.warn('Watchlist check failed:', item.title);
            }
        }
    }
}

// Create global instance
window.NotificationService = new NotificationService();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.NotificationService.updateBadge();

    // Check watchlist for new providers after 3 seconds
    setTimeout(() => {
        window.NotificationService.checkWatchlistForProviders();
    }, 3000);
});
