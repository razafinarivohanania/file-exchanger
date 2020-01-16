(() => {
    const selectAllButton = document.getElementById('selectAllButton');

    selectAllButton.onclick = () => {
        const checkboxes = document.querySelectorAll('table input[type="checkbox"]');
        const isToSelect = selectAllButton.textContent === 'Select all';

        for (const checkbox of checkboxes) {
            checkbox.checked = isToSelect;
        }

        if (isToSelect) {
            selectAllButton.textContent = 'Unselect all';
        } else {
            selectAllButton.textContent = 'Select all';
        }
    };
})();