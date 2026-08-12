/* ============================================================
   FRIEND POCKET — APPLICATION FLOW (DEMO ONLY)
   Data is stored in the browser's localStorage for prototype
   purposes only. Replace with a secure backend before production.
   ============================================================ */

(function () {
  "use strict";

  const TOTAL_STEPS = 4;

  function initApplication() {
    const wizard = document.getElementById("appWizard");
    if (!wizard) return;

    let currentStep = 1;
    const form = document.getElementById("applicationForm");
    const premiumMembership = document.getElementById('premiumMembership');
    const premiumReviewValue = document.getElementById('premiumReviewValue');
    const dots = document.querySelectorAll(".stepper-track .dot-wrap");
    const lines = document.querySelectorAll(".stepper-track .line");
    const steps = document.querySelectorAll(".form-step");
    const resultPanel = document.getElementById("appResultPanel");

    prefillFromEligibility();

    function prefillFromEligibility() {
      try {
        const raw = localStorage.getItem("fp_eligibility_data");
        if (!raw) return;
        const d = JSON.parse(raw);
        if (form.fullName && d.name) form.fullName.value = d.name;
        if (form.mobile && d.mobile) form.mobile.value = d.mobile;
        if (form.city && d.city) form.city.value = d.city;
        if (form.employmentType && d.employment) form.employmentType.value = d.employment;
        if (form.monthlyIncome && d.income) form.monthlyIncome.value = d.income;
        if (form.requestedAmount && d.amount) form.requestedAmount.value = d.amount;
        if (form.loanPurpose && d.purpose) form.loanPurpose.value = d.purpose;
        if (form.existingEmi && d.existingEmi) form.existingEmi.value = d.existingEmi;
      } catch (e) { /* ignore */ }
    }

    function updateStepper() {
      dots.forEach((dot) => {
        const step = Number(dot.getAttribute("data-step"));
        dot.classList.remove("active", "done");
        if (step < currentStep) dot.classList.add("done");
        else if (step === currentStep) dot.classList.add("active");
      });
      lines.forEach((line, idx) => {
        line.classList.toggle("done", idx + 1 < currentStep);
      });
      steps.forEach((stepEl) => {
        stepEl.classList.toggle("active", Number(stepEl.getAttribute("data-step")) === currentStep);
      });
      window.scrollTo({ top: wizard.offsetTop - 110, behavior: "smooth" });
    }

    function validateStep(step) {
      let valid = true;
      if (step === 1) {
        valid = fpValidateField(form.fullName, form.fullName.value.trim().length >= 2, "Please enter your full name.") && valid;
        valid = fpValidateField(form.mobile, fpMobileValid(form.mobile.value), "Please enter a valid mobile number.") && valid;
        valid = fpValidateField(form.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value), "Please enter a valid email address.") && valid;
        valid = fpValidateField(form.dob, !!form.dob.value, "This field is required.") && valid;
        valid = fpValidateField(form.city, form.city.value.trim().length >= 2, "This field is required.") && valid;
      } else if (step === 2) {
        valid = fpValidateField(form.employmentType, !!form.employmentType.value, "Please select an option.") && valid;
        valid = fpValidateField(form.monthlyIncome, Number(form.monthlyIncome.value) > 0, "Please enter your monthly income.") && valid;
        valid = fpValidateField(form.requestedAmount,
          Number(form.requestedAmount.value) >= FRIEND_POCKET_CONFIG.minLoan && Number(form.requestedAmount.value) <= FRIEND_POCKET_CONFIG.maxLoan,
          `Amount should be between ${fpFormatCurrency(FRIEND_POCKET_CONFIG.minLoan)} and ${fpFormatCurrency(FRIEND_POCKET_CONFIG.maxLoan)}.`) && valid;
        valid = fpValidateField(form.tenure, !!form.tenure.value, "Please select a tenure.") && valid;
        valid = fpValidateField(form.loanPurpose, form.loanPurpose.value.trim().length >= 2, "Please tell us the purpose.") && valid;
      } else if (step === 3) {
        valid = fpValidateField(form.address, form.address.value.trim().length >= 6, "Please enter your address.") && valid;
      } else if (step === 4) {
        valid = form.confirmAccurate.checked && form.confirmTerms.checked;
        if (!valid) fpToast("Please confirm both checkboxes to continue.");
      }
      return valid;
    }

    function buildReview() {
      const rows = [
        ["Full name", form.fullName.value],
        ["Mobile", form.mobile.value],
        ["Email", form.email.value],
        ["City", form.city.value],
        ["Employment type", form.employmentType.value],
        ["Monthly income", fpFormatCurrency(Number(form.monthlyIncome.value || 0))],
        ["Requested amount", fpFormatCurrency(Number(form.requestedAmount.value || 0))],
        ["Preferred tenure", form.tenure.value + " months"],
        ["Loan purpose", form.loanPurpose.value],
        ["Existing EMI", fpFormatCurrency(Number(form.existingEmi.value || 0))],
        ["Registration / Application Fee", fpFormatCurrency(Number(window.FRIEND_POCKET_DEMO_FEE ?? FRIEND_POCKET_CONFIG.applicationFee ?? 0))],
        ["Premium Membership", (premiumMembership && premiumMembership.checked) ? `₹${Number(FRIEND_POCKET_CONFIG.premiumMembershipFee || 149)}/month` : "Not selected"],
        ["Address", form.address.value],
      ];
      const reviewEl = document.getElementById("reviewSummary");
      reviewEl.innerHTML = rows
        .map((r) => `<div class="row"><span class="k">${r[0]}</span><span class="v">${r[1] || "—"}</span></div>`)
        .join("");
    }

    wizard.querySelectorAll("[data-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!validateStep(currentStep)) {
          fpToast("Please complete the required fields.");
          return;
        }
        if (currentStep === 3) buildReview();
        currentStep = Math.min(currentStep + 1, TOTAL_STEPS);
        updateStepper();
      });
    });

    wizard.querySelectorAll("[data-prev]").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentStep = Math.max(currentStep - 1, 1);
        updateStepper();
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateStep(4)) return;

      const appId = generateApplicationId();
      const record = {
        id: appId,
        name: form.fullName.value.trim(),
        mobile: form.mobile.value.trim(),
        email: form.email.value.trim(),
        city: form.city.value.trim(),
        employment: form.employmentType.value,
        income: Number(form.monthlyIncome.value || 0),
        amount: Number(form.requestedAmount.value || 0),
        tenure: Number(form.tenure.value || 0),
        purpose: form.loanPurpose.value.trim(),
        existingEmi: Number(form.existingEmi.value || 0),
        applicationFee: Number(window.FRIEND_POCKET_DEMO_FEE ?? FRIEND_POCKET_CONFIG.applicationFee ?? 0),
        premiumMembership: !!(premiumMembership && premiumMembership.checked),
        premiumMembershipFee: (premiumMembership && premiumMembership.checked) ? 149 : 0,
        address: form.address.value.trim(),
        status: "Pending",
        date: new Date().toISOString(),
        demo: true,
      };

      saveApplication(record);

      // Placeholder for future backend integration:
      // submitApplication(record) -> POST to Google Apps Script endpoint -> Google Sheets -> email notification
      submitApplication(record);

      form.style.display = "none";
      document.querySelector(".stepper-track").style.display = "none";
      resultPanel.style.display = "block";
      document.getElementById("resultAppId").textContent = appId;
      resultPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    form.querySelectorAll("input, select, textarea").forEach((el) => {
      el.addEventListener("input", () => {
        const field = el.closest(".field");
        if (field) field.classList.remove("has-error");
      });
    });

    updateStepper();
  }

  function generateApplicationId() {
    const year = new Date().getFullYear();
    const existing = JSON.parse(localStorage.getItem("fp_applications") || "[]");
    const submittedCount = existing.filter((a) => a.demo && a.id && a.id.includes(String(year))).length;
    const seq = String(submittedCount + 1).padStart(4, "0");
    return `FP-DEMO-${year}-${seq}`;
  }

  function saveApplication(record) {
    const existing = JSON.parse(localStorage.getItem("fp_applications") || "[]");
    existing.unshift(record);
    localStorage.setItem("fp_applications", JSON.stringify(existing));
  }

  // ------------------------------------------------------------
  // Future backend hook. Currently a no-op beyond localStorage.
  // When a Google Apps Script Web App endpoint is available,
  // replace the body of this function with a fetch() POST call,
  // e.g.:
  //
  // function submitApplication(data) {
  //   return fetch(FRIEND_POCKET_CONFIG.appsScriptUrl, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(data),
  //   });
  // }
  //
  // The Apps Script endpoint can then append the row to Google
  // Sheets and trigger an email notification with the applicant's
  // details (see js/application.js header comment for the payload
  // shape already produced above).
  // ------------------------------------------------------------
  function submitApplication(data) {
    console.log("[Friend Pocket demo] Application captured locally:", data.id);
    return Promise.resolve({ ok: true, demo: true });
  }

  document.addEventListener("DOMContentLoaded", initApplication);
})();

document.addEventListener('DOMContentLoaded', () => {
  const premiumMembership = document.getElementById('premiumMembership');
  const premiumReviewValue = document.getElementById('premiumReviewValue');
  if (premiumMembership && premiumReviewValue) {
    const syncPremium = () => {
      const fee = Number(FRIEND_POCKET_CONFIG.premiumMembershipFee || 149);
      premiumReviewValue.textContent = premiumMembership.checked ? `₹${fee}/month` : 'Not selected';
    };
    premiumMembership.addEventListener('change', syncPremium);
    syncPremium();
  }
});
