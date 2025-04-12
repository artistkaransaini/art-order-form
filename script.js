const popupOverlay = document.getElementById("popupOverlay");
const popupContent = document.getElementById("popupContent");
const popupClose = document.getElementById("popupClose");
var addressLater = false;
document
  .getElementById("addShippingLater")
  .addEventListener("change", function () {
    const shippingSection = document.getElementById("shippingAddressSection");
    shippingSection.style.display = this.checked ? "none" : "block";
    addressLater = this.checked;
  });
function showPopup() {
  gsap
    .timeline()
    .to(popupOverlay, {
      opacity: 1,
      duration: 0.3,
      pointerEvents: "auto",
    })
    .to(popupContent, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
    })
    .fromTo(
      ".popup-icon",
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      }
    )
    .fromTo(
      ".popup-title, .popup-message",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 0.5 }
    );
}

function hidePopup() {
  gsap
    .timeline()
    .to(popupContent, {
      scale: 0.7,
      opacity: 0,
      duration: 0.3,
    })
    .to(popupOverlay, {
      opacity: 0,
      duration: 0.3,
      pointerEvents: "none",
    });
}

// Canvas size selection
var canvasSize = "";
document.querySelectorAll(".canvas-size-option").forEach((option) => {
  option.addEventListener("click", function () {
    // Remove selected from all options
    document
      .querySelectorAll(".canvas-size-option")
      .forEach((opt) => opt.classList.remove("selected"));

    // Add selected to clicked option
    this.classList.add("selected");
    canvasSize = this.dataset.size;
    // Handle custom size input visibility
    const customSizeInputs = document.getElementById("customSizeInputs");
    customSizeInputs.style.display =
      this.dataset.size === "custom" ? "block" : "none";
  });
});
// File Upload Functionality
const uploadContainer = document.getElementById("file-upload-container");
const fileInput = document.getElementById("file-input");
const uploadText = document.getElementById("upload-text");
const previewContainer = document.getElementById("preview-container");
var imageLink = "";

// Prevent default drag behaviors
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  uploadContainer.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over
["dragenter", "dragover"].forEach((eventName) => {
  uploadContainer.addEventListener(eventName, highlight, false);
});
["dragleave", "drop"].forEach((eventName) => {
  uploadContainer.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
uploadContainer.addEventListener("drop", handleDrop, false);

// Handle click to upload
uploadContainer.addEventListener("click", () => {
  fileInput.click();
});

// Handle file selection
fileInput.addEventListener("change", handleFiles, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight() {
  uploadContainer.classList.add("dragover");
}

function unhighlight() {
  uploadContainer.classList.remove("dragover");
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

function handleFiles(files) {
  files = files.target ? files.target.files : files;

  // Clear previous previews
  previewContainer.innerHTML = "";

  Array.from(files).forEach((file) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("preview-image");
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB and generate a link
    uploadToImgBB(file);
  });

  uploadText.style.display = previewContainer.children.length
    ? "none"
    : "block";
}

async function uploadToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      "https://api.imgbb.com/1/upload?key=2462e15221403c0a1b6b98c466bbf01b",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (result.success) {
      const imageUrl = result.data.url;
      imageLink = imageUrl;
      console.log("Image Uploaded Successfully!");
    } else {
      console.log("Upload Failed!");
    }
  } catch (error) {
    console.log("Error: " + error.message);
  }
}

// Hide/show upload text based on previews
uploadText.style.display = previewContainer.children.length ? "none" : "block";

// Form submission

const SERVICE_ID = "service_zsj2g6t";
const TEMPLATE_ID = "template_rhdxebb";
const PUBLIC_KEY = "Vmwm_j4K_JIZgoKom";

// Initialize EmailJS
(function () {
  emailjs.init(PUBLIC_KEY);
})();

document
  .getElementById("paintingOrderForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const selectedSize = document.querySelector(".canvas-size-option.selected")
      ?.dataset.size;

    data.canvasSize =
      selectedSize === "custom"
        ? `${data.customWidth || "N/A"} × ${data.customHeight || "N/A"} mm`
        : selectedSize || "Not selected";

    const message = `
                Name: ${data.name}
                Email: ${data.email}
                Phone: ${data.phogfne}
                Address: ${data.apartment || ""}, ${data.landmark || ""}, ${data.street || ""}, ${data.state || ""}, ${data.pincode || "N/A"}
                Will disclose address later: ${addressLater}
                Painting Type: ${data.paintingType}
                Canvas Size: ${data.canvasSize}
                Description: ${data.description || "N/A"}
                Image Link: ${imageLink || "N/A"}
            `;

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        title: data.name,
        from_name: data.name,
        from_email: data.email,
        message: message,
      });
      showPopup();

      popupClose.addEventListener("click", hidePopup);
      console.log("Order received! We'll contact you soon.");
      form.reset();
      previewContainer.innerHTML = "";
      let canvasOptions = document.querySelectorAll(".canvas-size-option");
      canvasOptions.forEach((opt) => opt.classList.remove("selected"));
      customSizeInputs.style.display = "none";
    } catch (error) {
      console.log("Email error:", error);
      console.log("Failed to send order. Please try again.");
    }
  });
