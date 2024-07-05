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

// Function to perform the search
function performSearch(query, page = 1) {
    fetch(`/search-food?query=${encodeURIComponent(query)}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            updateTable(data.foods);
            updatePagination(data.page, data.total_pages, data.total_count, query);
        })
        .catch(error => console.error('Error:', error));
}

// Function to update the table with search results
function updateTable(foods) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
    foods.forEach(food => {
        const row = `
            <tr class="border-b dark:border-gray-700">
                <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">${food.name}</th>
                <td class="px-4 py-3">₱${parseFloat(food.price).toFixed(2)}</td>
                <td class="px-4 py-3 flex items-center justify-end">
                    <button id="food-${food._id}-dropdown-button" data-dropdown-toggle="food-${food._id}-dropdown" class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </button>
                    <div id="food-${food._id}-dropdown" class="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                        <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="food-${food._id}-dropdown-button">
                            <li>
                                <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                            </li>
                        </ul>
                        <div class="py-1">
                            <a onclick="return deleteFood('${food._id}')" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer">Delete</a>
                        </div>
                    </div>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Reinitialize Flowbite dropdowns
    initFlowbiteDropdowns();
}

// Function to update pagination
function updatePagination(currentPage, totalPages, totalCount, query) {
    // ... (keep the existing updatePagination function)
}

// Event listener for search input
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('food-search');
    let debounceTimer;

    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });

    // Initial initialization of Flowbite dropdowns
    initFlowbiteDropdowns();
});

// Function to initialize Flowbite dropdowns
function initFlowbiteDropdowns() {
    const dropdownButtons = document.querySelectorAll('[data-dropdown-toggle]');
    dropdownButtons.forEach(button => {
        const targetId = button.getAttribute('data-dropdown-toggle');
        const target = document.getElementById(targetId);
        
        if (button && target) {
            new Dropdown(target, button);
        }
    });
}