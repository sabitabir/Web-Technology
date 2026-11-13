document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const summary = document.getElementById("validation-summary");
  if (!form || !summary) return;

  // Place every validation warning directly beneath its related field/section.
  const fieldIds = [
      "beneficiary-name",
      "beneficiary-email",
      "beneficiary-phone",
      "beneficiary-password",
      "beneficiary-confirm",
      "beneficiary-address",
      "support-type",
      "household-size",
      "request-details",
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
      { id: "beneficiary-confirm", test: /confirm password|passwords do not match/i },
      { id: "beneficiary-password", test: /password/i },
      { id: "beneficiary-email", test: /email/i },
      { id: "beneficiary-phone", test: /phone/i },
      { id: "beneficiary-name", test: /name/i },
      { id: "beneficiary-address", test: /address/i },
      { id: "support-type", test: /support type|type of support/i },
      { id: "household-size", test: /household/i },
      { id: "request-details", test: /describe your support request|request details/i },
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
    const nameId = "beneficiary-name";
    const emailId = "beneficiary-email";
    const phoneId = "beneficiary-phone";
    const passwordId = "beneficiary-password";
    const confirmId = "beneficiary-confirm";
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
    // Beneficiary-specific rules: address, support type, household count, and request details.
    required("beneficiary-address", "Address / area", errors);
    required("support-type", "Type of support", errors);
    const household = Number(value("household-size"));
    if (!value("household-size") || !Number.isInteger(household) || household < 1 || household > 30) errors.push("Household size must be a whole number from 1 to 30.");
    if (value("request-details").length < 20) errors.push("Please describe your support request in at least 20 characters.");
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
