

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
    markAllNotificationsAsRead();
  });

  // Clear all notifications functionality
  document.getElementById('clear-notifications')?.addEventListener('click', function(e) {
    e.preventDefault();
    clearAllNotifications();
  });
});

let cachedNotifications = [];
let locallySeenIds = new Set();
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

  // Mark all notifications as seen by teacher (locally) when bell is clicked
  const notificationBell = document.querySelector('.notification');
  if (notificationBell) {
    notificationBell.addEventListener('click', function () {
      markAllNotificationsAsSeenByTeacher();
    });
  }
});

function loadNotifications() {
  fetch('/api/student/notifications3')
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
  // Sort: seenbyetu === NULL first, then by DateTime descending
  notifications.sort((a, b) => {
    if (a.seenbyetu === null && b.seenbyetu !== null) return -1;
    if (a.seenbyetu !== null && b.seenbyetu === null) return 1;
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
    filteredNotifications = notifications.filter(notif => notif.seenbyetu === null);
  }

  const unseenCount = notifications.filter(notif => notif.seenbyetu !== 1).length;
  notificationCount.textContent = unseenCount > 0 ? unseenCount : '';
  notificationCount.style.display = unseenCount > 0 ? 'flex' : 'none';

  notificationItems.innerHTML = '';

  if (filteredNotifications.length === 0) {
    notificationItems.innerHTML = '<div class="notification-item"><div class="notification-content">No notifications</div></div>';
    return;
  }

  filteredNotifications.forEach(notif => {
    const isUnread = notif.seenbyetu !== 1;
    const notificationItem = document.createElement('div');
    notificationItem.className = `notification-item${isUnread ? ' unread' : ''}`;

    // ...existing notification content code...
    let content = '';
    if (notif.type_demande === 'tempo') {
      content = `A temporary session was added`;
    } else if (notif.type_demande === 'abse') {
      const jour = notif.original_jour || 'a session';
      const horaire = notif.original_horaire || '';
      content = `A teacher is going to be absent for ${jour}'s ${horaire}`;
    } else if (notif.type_demande === 'ajout') {
      content = `A regular session was added`;
    } else if (notif.type_demande === 'modif') {
      content = `A session was modified`;
    } else if (notif.type_demande === 'supp') {
      content = `A session was removed`;
    } else if (notif.type_demande === 'sonda') {
      content = `A poll was created`;
    } else if (notif.type_demande === 'poll_end') {
    content = `A poll has ended`;
    } else if (notif.type_demande === 'intero') {
    content = `An interogation was created`;
    }

    // Determine status indicator
    let statusClass = '';
    let statusText = '';
    if (notif.status === null) {
      statusClass = 'unseen';
      statusText = 'New';
    } else if (notif.status === -1) {
      statusClass = 'pending';
      statusText = 'Pending (seen by admin, not by you)';
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

    notificationItem.addEventListener('click', function(e) {
      fetch(`/api/student/mark-seenbyetu/${notif.id}`, { method: 'POST' })
        .then(() => {
          notif.seenbyetu = 1;
          updateNotificationUI(notifications);
          window.location.href = '/NotificationEtu';
        });
    });

    notificationItems.appendChild(notificationItem);
  });
}

// Mark all notifications as seen by teacher (locally)
function markAllNotificationsAsSeenByTeacher() {
  cachedNotifications.forEach(notif => {
    if (notif.status === -1) {
      locallySeenIds.add(notif.id);
    }
  });
  updateNotificationUI(cachedNotifications);
}

// New: Mark all notifications as read (server-side)
function markAllNotificationsAsRead() {
  fetch('/api/student/mark-seenbyetu/all', { method: 'POST' })
    .then(() => {
      // Update local cache and UI
      cachedNotifications.forEach(notif => {
        notif.seenbyetu = 1;
      });
      updateNotificationUI(cachedNotifications);
    })
    .catch(error => {
      console.error('Error marking all as read:', error);
    });
}

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