document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const summary = document.getElementById("validation-summary");
  if (!form || !summary) return;

  // Place every validation warning directly beneath its related field/section.
  const fieldIds = [
      "ngo-name",
      "ngo-email",
      "ngo-phone",
      "ngo-password",
      "ngo-confirm",
      "ngo-organization",
      "ngo-role",
      "ngo-area",
      "ngo-campaign",
  ];
  function clearFieldMessages() {
    form.querySelectorAll(".field-error-message").forEach(function (node) { node.remove(); });
    form.querySelectorAll(".field-invalid").forEach(function (node) {
      node.classList.remove("field-invalid");
      node.removeAttribute("aria-invalid");
    });
  }
  function getTargetId(message) {
    const text = message.toLowerCase();
    // Match specific fields before generic labels such as email or name.
    const rules = [
      { id: "ngo-confirm", test: /confirm password|passwords do not match/i },
      { id: "ngo-password", test: /password/i },
      { id: "ngo-email", test: /email/i },
      { id: "ngo-phone", test: /phone/i },
      { id: "ngo-name", test: /name/i },
      { id: "ngo-organization", test: /organization/i },
      { id: "ngo-role", test: /role/i },
      { id: "ngo-area", test: /area/i },
      { id: "ngo-campaign", test: /campaign/i },
    ];
    for (const rule of rules) if (rule.test.test(message)) return rule.id;
    return fieldIds[0];
  }
  function showMessage(message, success) {
    clearFieldMessages();
    if (success) {
      summary.innerHTML = '<p class="validation-message success">' + message + '</p>';
      return;
    }
    summary.innerHTML = "";
    const messages = message.split("<br>").filter(Boolean);
    messages.forEach(function (item) {
      const id = getTargetId(item);
      const field = document.getElementById(id);
      if (!field) return;
      const error = document.createElement("p");
      error.className = "field-error-message";
      error.setAttribute("role", "alert");
      error.textContent = item;
      const wrapper = field.closest(".form-field") || field.closest(".agreement-wrap");
      if (wrapper) wrapper.appendChild(error);
      else field.insertAdjacentElement("afterend", error);
      field.classList.add("field-invalid");
      field.setAttribute("aria-invalid", "true");
    });
    const firstError = form.querySelector(".field-error-message");
    if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function value(id) {
    const field = document.getElementById(id);
    return field ? field.value.trim() : "";
  }
  function validEmail(text) {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(text);
  }
  function validPhone(text) {
    const digits = text.replace(/\D/g, "");
    return /^\+?[0-9 ()-]+$/.test(text) && digits.length >= 10 && digits.length <= 15;
  }
  function nameIsValid(text) {
    return /^[A-Za-z][A-Za-z .'-]{1,59}$/.test(text);
  }
  function passwordIsValid(text) {
    return text.length >= 6 && /[0-9]/.test(text);
  }
  function required(id, label, errors) {
    if (!value(id)) errors.push(label + " cannot be empty.");
  }
  form.addEventListener("submit", function (event) {
    const errors = [];
    const category = "CATEGORY";
    const nameId = "ngo-name";
    const emailId = "ngo-email";
    const phoneId = "ngo-phone";
    const passwordId = "ngo-password";
    const confirmId = "ngo-confirm";
    // Shared rules: required fields, correct email/phone, strong password and matching confirmation.
    required(nameId, "Name", errors);
    if (value(nameId) && !nameIsValid(value(nameId))) errors.push("Name should contain letters only (spaces, apostrophes, dots, and hyphens are allowed).");
    required(emailId, "Email", errors);
    if (value(emailId) && !validEmail(value(emailId))) errors.push("Enter a valid email address.");
    required(phoneId, "Phone number", errors);
    if (value(phoneId) && !validPhone(value(phoneId))) errors.push("Phone must contain 10-15 digits and only numeric characters, spaces, +, parentheses, or hyphens.");
    required(passwordId, "Password", errors);
    if (value(passwordId) && !passwordIsValid(value(passwordId))) errors.push("Password must contain at least 6 characters and at least one number.");
    required(confirmId, "Confirm password", errors);
    if (value(confirmId) && value(confirmId) !== value(passwordId)) errors.push("Passwords do not match.");
    // NGO staff-specific rules: organization, role, operation area, and campaign interest.
    required("ngo-organization", "Organization name", errors);
    required("ngo-role", "Position / role", errors);
    if (value("ngo-area").length < 3) errors.push("Area of operation must contain at least 3 characters.");
    required("ngo-campaign", "Campaign interest", errors);
    if (value("ngo-email") && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(org|ngo|com|net|edu|bd)$/i.test(value("ngo-email"))) errors.push("Enter a valid work email address with a recognized domain.");
    if (errors.length) {
      event.preventDefault();
      showMessage(errors.join("<br>"), false);
      summary.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    event.preventDefault();
    showMessage("Registration Successful! This is a front-end demo; no account or data has been saved.", true);
  });
  form.addEventListener("reset", function () { clearFieldMessages(); summary.innerHTML = ""; });
  form.addEventListener("input", function (event) { const field = event.target; if (field && field.id) { const wrapper = field.closest(".form-field") || field.closest(".agreement-wrap"); if (wrapper) { wrapper.querySelectorAll(".field-error-message").forEach(function (node) { node.remove(); }); field.classList.remove("field-invalid"); field.removeAttribute("aria-invalid"); } } });
  form.addEventListener("change", function (event) { const field = event.target; if (field && field.id) { const wrapper = field.closest(".form-field") || field.closest(".agreement-wrap"); if (wrapper) { wrapper.querySelectorAll(".field-error-message").forEach(function (node) { node.remove(); }); field.classList.remove("field-invalid"); field.removeAttribute("aria-invalid"); } } });
});
