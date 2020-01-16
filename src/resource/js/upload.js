(() => {
    const uploadButton = document.getElementById('uploadButton');
    const filesToUpload = document.getElementById('filesToUpload');
    const currentPath = document.getElementById('currentPath').value;

    uploadButton.onclick = async () => {
        const files = filesToUpload.files;
        if (!files || !files.length) {
            alert('No file to upload');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            const file = files[i];
            console.log(file);
            formData.append(`file${i}`, file);

            const options = {
                method: 'POST',
                body: formData,
            };

            let result = await fetch(`/upload?path=${currentPath}`, options);
            result = await result.json();
            if (!result.success) {
               
                alert(`Unable to upload file [${file.name}] due to error ${result.err}`);
                return;
            }
        }

        alert('All files are uploaded');
    }
})();