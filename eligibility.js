/* ============================================================
   FRIEND POCKET — ELIGIBILITY CHECKER
   This is a demo eligibility flow only. It does NOT represent
   an actual credit decision or guarantee of loan approval.
   ============================================================ */

(function () {
  "use strict";

  function initEligibility() {
    const form = document.getElementById("eligibilityForm");
    if (!form) return;

    const resultBox = document.getElementById("eligibilityResult");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.fullName.value.trim();
      const age = Number(form.age.value);
      const mobile = form.mobile.value.trim();
      const employment = form.employmentType.value;
      const income = Number(form.monthlyIncome.value);
      const amount = Number(form.requestedAmount.value);
      const existingEmi = Number(form.existingEmi.value || 0);
      const city = form.city.value.trim();

      let valid = true;
      valid = fpValidateField(form.fullName, name.length >= 2, "Please enter your full name.") && valid;
      valid = fpValidateField(form.age, age >= 21 && age <= 65, "Age must be between 21 and 65.") && valid;
      valid = fpValidateField(form.mobile, fpMobileValid(mobile), "Please enter a valid mobile number.") && valid;
      valid = fpValidateField(form.employmentType, !!employment, "Please select employment type.") && valid;
      valid = fpValidateField(form.monthlyIncome, income > 0, "Please enter your monthly income.") && valid;
      valid = fpValidateField(form.requestedAmount, amount >= FRIEND_POCKET_CONFIG.minLoan && amount <= FRIEND_POCKET_CONFIG.maxLoan,
        `Amount should be between ${fpFormatCurrency(FRIEND_POCKET_CONFIG.minLoan)} and ${fpFormatCurrency(FRIEND_POCKET_CONFIG.maxLoan)}.`) && valid;
      valid = fpValidateField(form.city, city.length >= 2, "Please enter your city.") && valid;

      if (!valid) {
        fpToast("Please fix the highlighted fields.");
        return;
      }

      // Demo-only heuristic — not a real underwriting model.
      const availableIncome = Math.max(income - existingEmi, 0);
      const indicativeCapacity = availableIncome * 10; // illustrative multiplier
      const withinCapacity = amount <= indicativeCapacity;
      const healthyEmiRatio = existingEmi <= income * 0.5;

      const data = { name, age, mobile, employment, income, amount, existingEmi, city, purpose: form.purpose.value.trim() };
      localStorage.setItem("fp_eligibility_data", JSON.stringify(data));

      resultBox.style.display = "block";
      if (withinCapacity && healthyEmiRatio) {
        resultBox.innerHTML = `
          <h4>Preliminary eligibility indication: Likely to proceed</h4>
          <p>Based on the details you entered, your information can be submitted for further review. This is not a credit decision — final eligibility depends on document verification and internal review.</p>
          <a href="apply.html" class="btn btn-primary" style="margin-top:16px;">Continue Application</a>
        `;
      } else {
        resultBox.innerHTML = `
          <h4>Preliminary eligibility indication: Needs further review</h4>
          <p>Based on the details you entered, this request may need a closer look — for example a lower requested amount or additional information. You're welcome to continue and our team can review the details manually.</p>
          <a href="apply.html" class="btn btn-primary" style="margin-top:16px;">Continue Application</a>
        `;
      }
      resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    // live-clear error state on input
    form.querySelectorAll("input, select").forEach((el) => {
      el.addEventListener("input", () => {
        const field = el.closest(".field");
        if (field) field.classList.remove("has-error");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initEligibility);
})();
