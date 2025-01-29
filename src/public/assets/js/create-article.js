var quill = new Quill("#editor-container", {
    theme: "snow",
    modules: {
        toolbar: "#toolbar",
    },
    placeholder: "Write something here...",
});

const imagePreview = document.getElementById("image-preview");
const imagePreviewText = document.getElementById("image-placeholder");
const fileInput = document.getElementById("fileInput");

imagePreview.addEventListener("click", () => {
    fileInput.click();
});

// Handle file selection
fileInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.style.backgroundImage = `url(${e.target.result})`;
            console.log(imagePreviewText);
            imagePreviewText.style.setProperty("display", "none", "important");
        };
        reader.readAsDataURL(file);
    }
});
