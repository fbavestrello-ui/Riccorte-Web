document.addEventListener('DOMContentLoaded', () => {
    const showAppointmentsBtn = document.getElementById('show-appointments');
    const showInventoryBtn = document.getElementById('show-inventory');
    const logoutBtn = document.getElementById('logout-btn');

    const appointmentsSection = document.getElementById('appointments-section');
    const inventorySection = document.getElementById('inventory-section');

    const appointmentsTableBody = document.getElementById('appointments-table-body');
    const inventoryTableBody = document.getElementById('inventory-table-body');

    // Function to fetch and display appointments
    async function fetchAppointments() {
        try {
            const response = await fetch('/api/appointments');
            if (!response.ok) {
                throw new Error('Failed to fetch appointments');
            }
            const appointments = await response.json();
            appointmentsTableBody.innerHTML = ''; // Clear existing rows

            if (appointments.length === 0) {
                appointmentsTableBody.innerHTML = '<tr><td colspan="6">No hay citas programadas.</td></tr>';
                return;
            }

            appointments.forEach(appointment => {
                const row = appointmentsTableBody.insertRow();
                row.insertCell().textContent = appointment.id;
                row.insertCell().textContent = appointment.clientName;
                row.insertCell().textContent = appointment.service;
                row.insertCell().textContent = new Date(appointment.appointmentDate).toLocaleString();
                row.insertCell().textContent = appointment.status;
                const actionsCell = row.insertCell();
                actionsCell.innerHTML = `<button onclick="editAppointment(${appointment.id})">Editar</button> <button onclick="deleteAppointment(${appointment.id})">Eliminar</button>`;
            });
        } catch (error) {
            console.error('Error fetching appointments:', error);
            appointmentsTableBody.innerHTML = '<tr><td colspan="6">Error al cargar las citas.</td></tr>';
        }
    }

    // Function to fetch and display inventory
    async function fetchInventory() {
        try {
            const response = await fetch('/api/inventory');
            if (!response.ok) {
                throw new Error('Failed to fetch inventory');
            }
            const inventory = await response.json();
            inventoryTableBody.innerHTML = ''; // Clear existing rows

            if (inventory.length === 0) {
                inventoryTableBody.innerHTML = '<tr><td colspan="5">No hay artículos en el inventario.</td></tr>';
                return;
            }

            inventory.forEach(item => {
                const row = inventoryTableBody.insertRow();
                row.insertCell().textContent = item.id;
                row.insertCell().textContent = item.itemName;
                row.insertCell().textContent = item.quantity;
                row.insertCell().textContent = `$${item.price.toFixed(2)}`;
                const actionsCell = row.insertCell();
                actionsCell.innerHTML = `<button onclick="editInventoryItem(${item.id})">Editar</button> <button onclick="deleteInventoryItem(${item.id})">Eliminar</button>`;
            });
        } catch (error) {
            console.error('Error fetching inventory:', error);
            inventoryTableBody.innerHTML = '<tr><td colspan="5">Error al cargar el inventario.</td></tr>';
        }
    }

    // Initial load: show appointments
    fetchAppointments();

    showAppointmentsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        appointmentsSection.style.display = 'block';
        inventorySection.style.display = 'none';
        fetchAppointments(); // Refresh data when showing section
    });

    showInventoryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        appointmentsSection.style.display = 'none';
        inventorySection.style.display = 'block';
        fetchInventory(); // Refresh data when showing section
    });

    logoutBtn.addEventListener('click', () => {
        // In a real app, this would clear session/token
        alert('Cerrando sesión...');
        window.location.href = '/'; // Redirect to home page
    });

    // Placeholder functions for edit/delete (will be implemented later)
    window.editAppointment = (id) => {
        alert(`Editar cita con ID: ${id}`);
        // Implement actual edit logic
    };

    window.deleteAppointment = (id) => {
        alert(`Eliminar cita con ID: ${id}`);
        // Implement actual delete logic
    };

    window.editInventoryItem = (id) => {
        alert(`Editar artículo de inventario con ID: ${id}`);
        // Implement actual edit logic
    };

    window.deleteInventoryItem = (id) => {
        alert(`Eliminar artículo de inventario con ID: ${id}`);
        // Implement actual delete logic
    };
});