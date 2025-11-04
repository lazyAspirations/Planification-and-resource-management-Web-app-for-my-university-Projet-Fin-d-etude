document.addEventListener('DOMContentLoaded', function() {
    function getStatusText(status) {
        if (status === null || status === undefined) return "No response yet";
        if (status === 1 || status === 2) return "Granted";
        if (status === 0) return "Refused";
         if (status === -1) return "Pending";
        return status;
    }

// ...existing code...
    async function getDescription(req) {
        let desc = [];
        if (req.horaire) desc.push(req.horaire);
        if (req.Jour) desc.push(req.Jour);
        if (req.id_salle) desc.push("" + req.id_salle);
        if (req.id_module) desc.push("" + req.id_module);

        // Add section name if available
        if (req.id_section) {
            try {
                const res = await fetch(`/api/section-info/${req.id_section}`);
                const section = await res.json();
                if (section && section.Nom) {
                    desc.push("Section: " + section.Nom);
                }
            } catch {}
        }

        // Add group number if available
        if (req.id_groupe) {
            try {
                const res = await fetch(`/api/group-info/${req.id_groupe}`);
                const group = await res.json();
                if (group && group.num_Grp) {
                    desc.push("Group: " + group.num_Grp);
                }
            } catch {}
        }

        if (req.type_Seance) desc.push("" + req.type_Seance);
        return desc.join(", ");
    }

async function loadRequests() {
    const res = await fetch('/api/user/my-requests');
    const requests = await res.json();
    const tbody = document.querySelector('#requestsTable tbody');
    tbody.innerHTML = '';

    // Filter requests to only include the desired types (now include "demIntero" and "intero")
    const filteredRequests = requests.filter(req =>
        ['abse', 'supp', 'modif', 'ajout', 'demIntero', 'intero'].includes(req.type_demande)
    );

    if (!Array.isArray(filteredRequests) || filteredRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No requests found.</td></tr>';
        return;
    }

    // Wait for all descriptions
    const descriptions = await Promise.all(filteredRequests.map(getDescription));

    filteredRequests.forEach((req, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${req.type_demande || ''}</td>
            <td>${descriptions[i]}</td>
            <td>${getStatusText(req.status)}</td>
            <td>
                ${req.status === null ? `<button class="btn btn-danger btn-sm cancel-request-btn" data-id="${req.id}">Cancel</button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Add event listeners for cancel buttons
    document.querySelectorAll('.cancel-request-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reqId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to cancel this request?')) {
                fetch(`/api/user/cancel-request/${reqId}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            loadRequests();
                        } else {
                            alert(data.error || 'Failed to cancel request');
                        }
                    });
            }
        });
    });
}


async function loadRequests() {
    const res = await fetch('/api/user/my-requests');
    const requests = await res.json();
    const tbody = document.querySelector('#requestsTable tbody');
    tbody.innerHTML = '';

    // Filter requests to only include the desired types (now include "demIntero" and "intero")
    const filteredRequests = requests.filter(req =>
        ['abse', 'supp', 'modif', 'ajout', 'demIntero', 'intero'].includes(req.type_demande)
    );

    if (!Array.isArray(filteredRequests) || filteredRequests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No requests found.</td></tr>';
        return;
    }


    const descriptions = await Promise.all(filteredRequests.map(getDescription));

    filteredRequests.forEach((req, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${req.type_demande || ''}</td>
            <td>${descriptions[i]}</td>
            <td>${getStatusText(req.status)}</td>
            <td>
                ${req.status === null ? `<button class="btn btn-danger btn-sm cancel-request-btn" data-id="${req.id}">Cancel</button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Add event listeners for cancel buttons
    document.querySelectorAll('.cancel-request-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reqId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to cancel this request?')) {
                fetch(`/api/user/cancel-request/${reqId}`, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            loadRequests();
                        } else {
                            alert(data.error || 'Failed to cancel request');
                        }
                    });
            }
        });
    });
}

    loadRequests();

});