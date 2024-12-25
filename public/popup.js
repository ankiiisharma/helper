// DOM Elements
const form = document.getElementById('autofillForm');
const autofillButton = document.getElementById('autofillButton');

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Load saved data
document.addEventListener('DOMContentLoaded', () => {
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get('formData', (result) => {
      if (result.formData) {
        Object.entries(result.formData).forEach(([key, value]) => {
          const element = document.getElementById(key);
          if (element) {
            element.value = value;
          }
        });
      }
    });
  }
});

// Save form data
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {};
    const formElements = form.elements;
    
    for (let element of formElements) {
      if (element.name && element.value) {
        formData[element.name] = element.value;
      }
    }

    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ formData }, () => {
        showToast('Information saved successfully!');
      });
    } else {
      showToast('Error: Unable to save data.', 'error');
    }
  });
}

// Autofill active page
autofillButton.addEventListener('click', () => {
  if (chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'autofill' });
    });
  } else {
    showToast('Error: Unable to autofill.', 'error');
  }
});