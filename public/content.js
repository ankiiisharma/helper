// Common form field mappings
const fieldMappings = {
  firstName: ['first[_-]?name', 'fname', 'given[_-]?name'],
  lastName: ['last[_-]?name', 'lname', 'surname', 'family[_-]?name'],
  email: ['email', 'e-mail'],
  phone: ['phone', 'mobile', 'contact[_-]?number', 'tel'],
  location: ['location', 'address', 'city'],
  currentTitle: ['job[_-]?title', 'position', 'role'],
  company: ['company', 'employer', 'organization'],
  experience: ['experience', 'years[_-]?of[_-]?experience'],
  skills: ['skills', 'technologies', 'expertise'],
  linkedin: ['linkedin', 'linked[_-]?in'],
  github: ['github', 'git[_-]?hub'],
  portfolio: ['portfolio', 'website', 'personal[_-]?site'],
  degree: ['degree', 'education', 'qualification'],
  university: ['university', 'school', 'college', 'institution'],
  gradYear: ['graduation[_-]?year', 'grad[_-]?year', 'year[_-]?of[_-]?graduation']
};

// Helper function to find form fields
function findFormField(patterns) {
  for (let pattern of patterns) {
    const regex = new RegExp(pattern, 'i');
    const elements = document.querySelectorAll('input, textarea, select');
    
    for (let element of elements) {
      if (
        element.name?.match(regex) ||
        element.id?.match(regex) ||
        element.placeholder?.match(regex) ||
        element.labels?.[0]?.textContent.match(regex)
      ) {
        return element;
      }
    }
  }
  return null;
}

// Listen for autofill message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'autofill') {
    chrome.storage.local.get('formData', (result) => {
      if (result.formData) {
        Object.entries(fieldMappings).forEach(([key, patterns]) => {
          const field = findFormField(patterns);
          if (field && result.formData[key]) {
            field.value = result.formData[key];
            // Trigger change event to notify any form validators
            field.dispatchEvent(new Event('change', { bubbles: true }));
            field.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
        
        // Show success message
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          z-index: 10000;
          animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = 'Form autofilled successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    });
  }
});