document.addEventListener('DOMContentLoaded', function() {
    function getStatusText(status) {
        if (status === null || status === undefined) return "No response yet";
        if (status === 1) return "Granted";
        if (status === 0) return "Refused";
        return status;
    }
    function getDescription(req) {
        let desc = [];
        if (req.horaire) desc.push(req.horaire);
        if (req.Jour) desc.push(req.Jour);
        if (req.id_salle) desc.push("Salle: " + req.id_salle);
        if (req.id_module) desc.push("Module: " + req.id_module);
        if (req.id_section) desc.push("Section: " + req.id_section);
        if (req.id_groupe) desc.push("Group: " + req.id_groupe);
        if (req.type_Seance) desc.push("Type: " + req.type_Seance);
        return desc.join(", ");
    }
    function loadRequests() {
        fetch('/api/user/my-requests')
            .then(res => res.json())
            .then(requests => {
                const tbody = document.querySelector('#requestsTable tbody');
                tbody.innerHTML = '';
                if (!Array.isArray(requests) || requests.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" class="text-center">No requests found.</td></tr>';
                    return;
                }
                requests.forEach(req => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${req.type_demande || ''}</td>
                        <td>${getDescription(req)}</td>
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
            });
    }
    loadRequests();
});