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
function updateTable(foods, noResults) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
    
    if (noResults) {
        const noResultsRow = `
            <tr class="border-b dark:border-gray-700">
                <td colspan="3" class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">No Results Found</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', noResultsRow);
    } else {
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
                                    <a href="#" class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white edit-food-btn">Edit</a>
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
    }

    // Reinitialize Flowbite dropdowns
    initFlowbiteDropdowns();
}

// Update the performSearch function to pass the noResults flag
function performSearch(query, page = 1) {
    fetch(`/search-food?query=${encodeURIComponent(query)}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            updateTable(data.foods, data.no_results);
            updatePagination(data.page, data.total_pages, data.total_count, query);
        })
        .catch(error => console.error('Error:', error));
}

// Function to update pagination
function updatePagination(currentPage, totalPages, totalCount, query) {
    const paginationContainer = document.querySelector('nav[aria-label="Table navigation"]');
    let paginationHTML = `
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span class="font-semibold text-gray-900 dark:text-white">${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, totalCount)}</span>
            of
            <span class="font-semibold text-gray-900 dark:text-white">${totalCount}</span>
        </span>
        <ul class="inline-flex items-stretch -space-x-px">
    `;

    if (currentPage > 1) {
        paginationHTML += `
            <li>
                <a href="#" onclick="performSearch('${query}', ${currentPage - 1})" class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span class="sr-only">Previous</span>
                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </a>
            </li>
        `;
    }

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li>
                <a href="#" onclick="performSearch('${query}', ${i})" class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${i === currentPage ? 'z-10 bg-primary-50 border-primary-300 text-primary-600 dark:border-gray-700 dark:bg-sky-400 dark:text-white' : ''}">${i}</a>
            </li>
        `;
    }

    if (currentPage < totalPages) {
        paginationHTML += `
            <li>
                <a href="#" onclick="performSearch('${query}', ${currentPage + 1})" class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span class="sr-only">Next</span>
                    <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                </a>
            </li>
        `;
    }

    paginationHTML += `</ul>`;
    paginationContainer.innerHTML = paginationHTML;
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

// Function to open the modal and populate it with food data
function openUpdateModal(foodId, foodName, foodPrice) {
    const modal = document.getElementById('updateFoodModal');
    const modalContent = modal.querySelector('.transform');
    const overlay = document.getElementById('modal-overlay');
    const foodNameInput = document.getElementById('foodName');
    const foodPriceInput = document.getElementById('foodPrice');
    const foodIdInput = document.getElementById('foodId');

    foodNameInput.value = foodName;
    foodPriceInput.value = foodPrice;
    foodIdInput.value = foodId;

    document.body.classList.add('modal-open');
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
    
    // Trigger reflow to ensure the initial state is applied before transitioning
    void modalContent.offsetWidth;
    
    modalContent.classList.remove('translate-y-full', 'opacity-0');
}

// Function to close the modal
function closeUpdateModal() {
    const modal = document.getElementById('updateFoodModal');
    const modalContent = modal.querySelector('.transform');
    const overlay = document.getElementById('modal-overlay');

    modalContent.classList.add('translate-y-full', 'opacity-0');
    
    setTimeout(() => {
        document.body.classList.remove('modal-open');
        overlay.classList.add('hidden');
        modal.classList.add('hidden');
    }, 300); // Match this delay with the CSS transition duration
}

// Event listener for the close button
document.querySelector('[data-modal-toggle="updateFoodModal"]').addEventListener('click', closeUpdateModal);

// Event listener for clicking outside the modal to close it
document.getElementById('updateFoodModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeUpdateModal();
    }
});

// Event listener for the update form submission
document.getElementById('updateFoodForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const foodId = document.getElementById('foodId').value;
    const foodName = document.getElementById('foodName').value;
    const foodPrice = document.getElementById('foodPrice').value;

    fetch(`/update-food/${foodId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `foodName=${encodeURIComponent(foodName)}&foodPrice=${encodeURIComponent(foodPrice)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the table row with the new data
            const row = document.querySelector(`#food-${foodId}-dropdown-button`).closest('tr');
            row.querySelector('th').textContent = foodName;
            row.querySelector('td').textContent = `₱${parseFloat(foodPrice).toFixed(2)}`;
            closeUpdateModal();
            // Optionally, show a success message
            alert('Food item updated successfully');
        } else {
            alert('Failed to update food item: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the food item');
    });
});

// Add click event listeners to all edit buttons within dropdowns
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('edit-food-btn')) {
        e.preventDefault();
        const row = e.target.closest('tr');
        const foodId = row.querySelector('[id$="-dropdown-button"]').id.split('-')[1];
        const foodName = row.querySelector('th').textContent.trim();
        const foodPrice = row.querySelector('td').textContent.replace('₱', '').trim();
        openUpdateModal(foodId, foodName, foodPrice);
    }
});