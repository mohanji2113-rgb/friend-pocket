/* ============================================================
   FRIEND POCKET — EMI CALCULATOR
   EMI = P × r × (1+r)^n / ((1+r)^n − 1)
   P = principal, r = monthly interest rate, n = months
   Illustrative estimate only — not an offer or approval of credit.
   ============================================================ */

(function () {
  "use strict";

  function initCalculator() {
    const amountRange = document.getElementById("amountRange");
    const amountInput = document.getElementById("amountInput");
    const rateRange = document.getElementById("rateRange");
    const rateInput = document.getElementById("rateInput");
    const tenureRange = document.getElementById("tenureRange");
    const tenureInput = document.getElementById("tenureInput");
    const feeInput = document.getElementById("feeInput");
    const resultFee = document.getElementById("resultFee");

    if (!amountRange || !rateRange || !tenureRange) return; // not on this page

    const emiOut = document.getElementById("resultEmi");
    const interestOut = document.getElementById("resultInterest");
    const totalOut = document.getElementById("resultTotal");
    const principalOut = document.getElementById("resultPrincipal");
    const ringInterest = document.getElementById("ringInterest");
    const ringLabel = document.getElementById("ringLabel");

    function calcEMI(principal, annualRate, months) {
      const r = annualRate / 12 / 100;
      if (r === 0) return principal / months;
      const factor = Math.pow(1 + r, months);
      return (principal * r * factor) / (factor - 1);
    }

    function sync(rangeEl, inputEl) {
      inputEl.value = rangeEl.value;
    }

    function update() {
      const principal = Number(amountRange.value);
      const rate = Number(rateRange.value);
      const months = Number(tenureRange.value);
      const fee = feeInput ? Math.max(0, Number(feeInput.value) || 0) : (Number(FRIEND_POCKET_CONFIG.applicationFee) || 0);

      const emi = calcEMI(principal, rate, months);
      const total = emi * months;
      const interest = total - principal;

      if (emiOut) emiOut.textContent = fpFormatCurrency(emi);
      if (interestOut) interestOut.textContent = fpFormatCurrency(interest);
      if (totalOut) totalOut.textContent = fpFormatCurrency(total);
      if (resultFee) resultFee.textContent = fpFormatCurrency(fee);
      if (principalOut) principalOut.textContent = fpFormatCurrency(principal);

      if (ringInterest) {
        const circumference = 2 * Math.PI * 52; // matches r=52 in svg markup
        const interestShare = Math.min(interest / total, 1);
        const offset = circumference * (1 - interestShare);
        ringInterest.style.strokeDasharray = circumference;
        ringInterest.style.strokeDashoffset = offset;
      }
      if (ringLabel) ringLabel.textContent = Math.round((interest / total) * 100) + "%";

      amountInput.value = principal;
      rateInput.value = rate;
      tenureInput.value = months;

      const amountLabel = document.getElementById("amountRangeVal");
      const rateLabel = document.getElementById("rateRangeVal");
      const tenureLabel = document.getElementById("tenureRangeVal");
      if (amountLabel) amountLabel.textContent = "\u20B9" + principal.toLocaleString("en-IN");
      if (rateLabel) rateLabel.textContent = rate + "%";
      if (tenureLabel) tenureLabel.textContent = months;
    }

    amountRange.addEventListener("input", update);
    rateRange.addEventListener("input", update);
    tenureRange.addEventListener("input", update);

    amountInput.addEventListener("change", function () {
      let v = Math.min(Math.max(Number(amountInput.value) || 0, Number(amountRange.min)), Number(amountRange.max));
      amountRange.value = v;
      update();
    });
    rateInput.addEventListener("change", function () {
      let v = Math.min(Math.max(Number(rateInput.value) || 0, Number(rateRange.min)), Number(rateRange.max));
      rateRange.value = v;
      update();
    });
    if (feeInput) feeInput.addEventListener("input", update);

    tenureInput.addEventListener("change", function () {
      let v = Math.min(Math.max(Number(tenureInput.value) || 0, Number(tenureRange.min)), Number(tenureRange.max));
      tenureRange.value = v;
      update();
    });

    update();
  }

  document.addEventListener("DOMContentLoaded", initCalculator);
})();
