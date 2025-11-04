/*BEGINING DROP DOWN MENU FOR NOTIFICATION*/
document.addEventListener("DOMContentLoaded", function() {
  const notification = document.querySelector('.notification');
  if (!notification) return;

  notification.addEventListener('click', (event) => {
    event.stopPropagation();
    notification.classList.toggle('active');
  });

  document.addEventListener('click', (event) => {
    if (!notification.contains(event.target)) {
      notification.classList.remove('active');
    }
  });
});
/*ENDING DROP DOWN MENU FOR NOTIFICATION*/


document.addEventListener('DOMContentLoaded', function() {
  // Notification actions menu (three dots)
  const notifActionsTrigger = document.querySelector('.notification-menu-trigger');
  const notifActionsMenu = document.querySelector('.notification-actions-menu');

  if (notifActionsTrigger && notifActionsMenu) {
    notifActionsTrigger.addEventListener('click', function(e) {
      e.stopPropagation();
      notifActionsMenu.classList.toggle('show');
    });

    // Hide menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!notifActionsMenu.contains(e.target) && !notifActionsTrigger.contains(e.target)) {
        notifActionsMenu.classList.remove('show');
      }
    });
  }
});



/* BEGINNING OF NOTIFICATION SYSTEM */

// Add this near the top with other event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Mark all as read functionality
  document.getElementById('mark-all-read')?.addEventListener('click', function(e) {
    e.preventDefault();
    markAllNotificationsAsSeen();
  });

  // Clear all notifications functionality
  document.getElementById('clear-notifications')?.addEventListener('click', function(e) {
    e.preventDefault();
    clearAllNotifications();
  });
});

let cachedNotifications = [];
let showOnlyUnseen = false;

document.addEventListener('DOMContentLoaded', function() {
  const filterBtn = document.getElementById('filter-unseen-btn');
  if (!filterBtn) return;

  filterBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    showOnlyUnseen = !showOnlyUnseen;
    filterBtn.style.background = showOnlyUnseen ? '#18426d' : '#e0e0e0';
    filterBtn.style.color = showOnlyUnseen ? '#fff' : '#18426d';
    updateNotificationUI(cachedNotifications);
  });
});

document.addEventListener("DOMContentLoaded", function() {
  // Load notifications
  loadNotifications();

  // Set interval to check for new notifications every 30 seconds
  setInterval(loadNotifications, 30000);

  // DO NOT mark all as seen when bell is clicked!
  // (Removed the code that did this)
});

function loadNotifications() {
  fetch('/api/admin/notifications')
    .then(response => response.json())
    .then(data => {
      cachedNotifications = data;
      updateNotificationUI(data);
    })
    .catch(error => {
      console.error('Error loading notifications:', error);
    });
}

function updateNotificationUI(notifications) {
  // Sort: status NULL first (unseen), then by DateTime descending
  notifications.sort((a, b) => {
    if (a.status === null && b.status !== null) return -1;
    if (a.status !== null && b.status === null) return 1;
    if (a.DateTime && b.DateTime) {
      return new Date(b.DateTime) - new Date(a.DateTime);
    }
    return 0;
  });

  const notificationItems = document.getElementById('notification-items');
  const notificationCount = document.getElementById('notification-count');

  // Filter notifications if unseen filter is active
  let filteredNotifications = notifications;
  if (showOnlyUnseen) {
    filteredNotifications = notifications.filter(notif => notif.status === null);
  }

  const unseenCount = notifications.filter(notif => notif.status === null).length;
  notificationCount.textContent = unseenCount > 0 ? unseenCount : '';
  notificationCount.style.display = unseenCount > 0 ? 'flex' : 'none';

  notificationItems.innerHTML = '';

  if (filteredNotifications.length === 0) {
    notificationItems.innerHTML = '<div class="notification-item"><div class="notification-content">No notifications</div></div>';
    return;
  }

  filteredNotifications.forEach(notif => {
    const isUnread = notif.status === null;
    const notificationItem = document.createElement('div');
    notificationItem.className = `notification-item${isUnread ? ' unread' : ''}`;

    let content = '';
    let teacherName = `${notif.teacher_nom || ''} ${notif.teacher_prenom || ''}`.trim();
    
    if (notif.type_demande === 'ajout') {
      content = `${teacherName} requested to add a session`;
    } else if (notif.type_demande === 'modif') {
      content = `${teacherName} requested to modify a session`;
    } else if (notif.type_demande === 'supp') {
      content = `${teacherName} requested to delete a session`;
    } else if (notif.type_demande === 'demIntero') {
      content = `${teacherName} requested an interrogation session`;
    } else if (notif.type_demande === 'abse') {
      content = `${teacherName} will be absent`;
    } else if (notif.type_demande === 'tempo') {
      content = `${teacherName} added a temporary session`;
    } else if (notif.type_demande === 'intero') {
      content = `${teacherName} created an interrogation session`;
    }

    // Determine status indicator
    let statusClass = '';
    let statusText = '';
    if (notif.status === null) {
      statusClass = 'unseen';
      statusText = 'Unseen';
    } else if (notif.status === -1) {
      statusClass = 'seen';
      statusText = 'Seen';
    } else if (notif.status === 1 || notif.status === 2) {
      statusClass = 'accepted';
      statusText = 'Accepted';
    } else if (notif.status === 0) {
      statusClass = 'rejected';
      statusText = 'Rejected';
    }

    notificationItem.innerHTML = `
      <div class="notification-content">
        <span class="notification-status ${statusClass}" title="${statusText}"></span>
        <span>${content}</span>
      </div>
    `;

    // Only mark as seen when this notification is clicked
    notificationItem.addEventListener('click', function(e) {
      e.stopPropagation();
      if (notif.status === null) {
        fetch(`/api/admin/mark-seen/${notif.id}`, { method: 'POST' })
          .then(() => {
            notif.status = -1;
            updateNotificationUI(notifications);
            window.location.href = '/NotificationAdm';
          });
      } else {
        window.location.href = '/NotificationAdm';
      }
    });

    notificationItems.appendChild(notificationItem);
  });
}

// Mark all notifications as seen (server-side)
function markAllNotificationsAsSeen() {
  fetch('/api/admin/mark-all-seen', { method: 'POST' })
    .then(() => {
      // Update local cache and UI
      cachedNotifications.forEach(notif => {
          notif.status = -1;
      });
      updateNotificationUI(cachedNotifications);
    })
    .catch(error => {
      console.error('Error marking all as seen:', error);
    });
}

// New: Mark all notifications as read (same as seen for admin)
// function markAllNotificationsAsRead() {
//   markAllNotificationsAsSeen();
// }

// New: Clear all notifications (client-side only)
function clearAllNotifications() {
  // This is a client-side only operation - doesn't delete from server
  const notificationItems = document.getElementById('notification-items');
  notificationItems.innerHTML = '<div class="notification-item"><div class="notification-content">No notifications</div></div>';
  
  // Update count
  document.getElementById('notification-count').textContent = '';
  document.getElementById('notification-count').style.display = 'none';
}
/* END OF NOTIFICATION SYSTEM */