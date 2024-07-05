//Delete function for the Table
function deleteFood(foodId) {
    if (confirm('Are you sure you want to delete this food item?')) {
        fetch(`/delete-food/${foodId}`, {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                // Remove the table row
                document.querySelector(`tr:has(#food-${foodId}-dropdown-button)`).remove();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while deleting the food item.');
        });
    }
    return false; // Prevent default link behavior
}


// Add Food modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('foodModal');
    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('modalOverlay');
    const openModalBtn = document.getElementById('addFoodButton');
    const closeModalBtn = modal.querySelector('[data-modal-hide]');

    function openModal() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modalOverlay.classList.add('opacity-50');
            modalContent.classList.remove('translate-y-[-100vh]');
            modalContent.classList.add('translate-y-0');
        }, 10);
    }

    function closeModal() {
        modalOverlay.classList.remove('opacity-50');
        modalContent.classList.remove('translate-y-0');
        modalContent.classList.add('translate-y-[-100vh]');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    }

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});