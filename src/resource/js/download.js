(() => {
    const downloadButtons = document.querySelectorAll('.downloadButton');
    const downloadSelectButton = document.getElementById('downloadSelectButton');

    function download() {
        const path = this.getAttribute('data-path');
        window.open(path, '_blank');
    }

    for (const downloadButton of downloadButtons) {
        downloadButton.onclick = download;
    }

    function downloadSelect() {
        const checkboxs = document.querySelectorAll('table input[type="checkbox"]');
        for (const checkbox of checkboxs) {
            if (checkbox.checked) {
                const path = checkbox.parentElement.parentElement.querySelector('.downloadButton')
                    .getAttribute('data-path');
                window.open(path, '_blank');
            }
        }
    }

    downloadSelectButton.onclick = downloadSelect;
})();