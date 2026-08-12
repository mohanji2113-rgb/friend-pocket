/* ============================================================
   FRIEND POCKET — ADMIN PORTAL (DEMO)
   Demo-only authentication and data storage. Do NOT treat this
   as secure production authentication. Replace with a real
   backend + auth system before any production use.
   ============================================================ */

(function () {
  "use strict";

  const DEMO_USER = "admin@friendpocket.test";
  const DEMO_PASS = "CHANGE-BEFORE-PRODUCTION";

  const SEED_APPLICATIONS = [
    { id: "FP-DEMO-1001", name: "Rahul Sharma (DEMO)", mobile: "9800000001", email: "rahul.demo@example.com", city: "Pune", employment: "Salaried", income: 32000, amount: 25000, tenure: 12, purpose: "Home repair", existingEmi: 2000, address: "Demo address, Pune", status: "Pending", date: "2026-07-02T10:00:00.000Z", demo: true },
    { id: "FP-DEMO-1002", name: "Aman Verma (DEMO)", mobile: "9800000002", email: "aman.demo@example.com", city: "Jaipur", employment: "Self-employed", income: 45000, amount: 50000, tenure: 18, purpose: "Business expansion", existingEmi: 5000, address: "Demo address, Jaipur", status: "Under Review", date: "2026-07-05T10:00:00.000Z", demo: true },
    { id: "FP-DEMO-1003", name: "Priya Singh (DEMO)", mobile: "9800000003", email: "priya.demo@example.com", city: "Lucknow", employment: "Salaried", income: 38000, amount: 40000, tenure: 15, purpose: "Medical expense", existingEmi: 0, address: "Demo address, Lucknow", status: "Completed", date: "2026-06-20T10:00:00.000Z", demo: true },
  ];

  function seedIfNeeded() {
    const existing = localStorage.getItem("fp_applications");
    if (!existing) {
      localStorage.setItem("fp_applications", JSON.stringify(SEED_APPLICATIONS));
    }
  }

  function getApplications() {
    seedIfNeeded();
    return JSON.parse(localStorage.getItem("fp_applications") || "[]");
  }

  function saveApplications(list) {
    localStorage.setItem("fp_applications", JSON.stringify(list));
  }

  /* ---------------- LOGIN PAGE ---------------- */
  function initLogin() {
    const form = document.getElementById("adminLoginForm");
    if (!form) return;

    document.getElementById("fillDemoBtn")?.addEventListener("click", () => {
      form.email.value = DEMO_USER;
      form.password.value = DEMO_PASS;
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = form.email.value.trim();
      const pass = form.password.value;
      const errBox = document.getElementById("loginError");

      if (email === DEMO_USER && pass === DEMO_PASS) {
        sessionStorage.setItem("fp_admin_auth", "true");
        window.location.href = "admin-dashboard.html";
      } else {
        errBox.style.display = "block";
        errBox.textContent = "Invalid demo credentials. Use the demo login shown below.";
      }
    });
  }

  /* ---------------- DASHBOARD PAGE ---------------- */
  function initDashboard() {
    const table = document.getElementById("appTableBody");
    if (!table) return;

    if (sessionStorage.getItem("fp_admin_auth") !== "true") {
      window.location.href = "admin-login.html";
      return;
    }

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      sessionStorage.removeItem("fp_admin_auth");
      window.location.href = "admin-login.html";
    });

    const searchInput = document.getElementById("adminSearch");
    const statusFilter = document.getElementById("statusFilter");
    const modal = document.getElementById("appModal");
    const modalBody = document.getElementById("appModalBody");

    function renderStats(apps) {
      const counts = { total: apps.length, Pending: 0, "Under Review": 0, Approved: 0, Completed: 0 };
      apps.forEach((a) => { if (counts[a.status] !== undefined) counts[a.status]++; });
      document.getElementById("statTotal").textContent = counts.total;
      document.getElementById("statPending").textContent = counts["Pending"];
      document.getElementById("statReview").textContent = counts["Under Review"];
      document.getElementById("statApproved").textContent = counts["Approved"];
      document.getElementById("statCompleted").textContent = counts["Completed"];
    }

    function statusBadge(status) {
      const map = {
        "Pending": "background:#FFF3E0;color:#B26A00;",
        "Under Review": "background:#E8EDF3;color:#12395B;",
        "Approved": "background:#E4F5EC;color:#167A50;",
        "Rejected": "background:#FBE9E7;color:#C8483A;",
        "Disbursed": "background:#E4F5EC;color:#1E9E67;",
        "Completed": "background:#E8EDF3;color:#3B4453;",
      };
      const style = map[status] || "background:#E8EDF3;color:#3B4453;";
      return `<span style="display:inline-block;padding:4px 10px;border-radius:20px;font-size:.76rem;font-weight:700;${style}">${status}</span>`;
    }

    function render() {
      let apps = getApplications();
      const q = (searchInput.value || "").toLowerCase().trim();
      const statusVal = statusFilter.value;

      if (q) {
        apps = apps.filter((a) =>
          a.name.toLowerCase().includes(q) || a.mobile.includes(q) || a.id.toLowerCase().includes(q)
        );
      }
      if (statusVal) {
        apps = apps.filter((a) => a.status === statusVal);
      }

      renderStats(getApplications());

      if (!apps.length) {
        table.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--gray-500);">No applications match your filters.</td></tr>`;
        return;
      }

      table.innerHTML = apps
        .map((a) => `
          <tr>
            <td data-label="Application ID"><strong>${a.id}</strong></td>
            <td data-label="Applicant">${a.name}</td>
            <td data-label="Amount">${fpFormatCurrency(a.amount)}</td>
            <td data-label="Tenure">${a.tenure} mo</td>
            <td data-label="Status">${statusBadge(a.status)}</td>
            <td data-label="Date">${new Date(a.date).toLocaleDateString("en-IN")}</td>
            <td data-label="Action"><button class="btn btn-outline-dark btn-sm" data-view="${a.id}">View</button></td>
          </tr>
        `)
        .join("");

      table.querySelectorAll("[data-view]").forEach((btn) => {
        btn.addEventListener("click", () => openModal(btn.getAttribute("data-view")));
      });
    }

    function openModal(id) {
      const apps = getApplications();
      const a = apps.find((x) => x.id === id);
      if (!a) return;

      modalBody.innerHTML = `
        <button class="modal-close" id="modalCloseBtn" aria-label="Close">&times;</button>
        <h3 style="margin-bottom:4px;">${a.id} ${a.demo ? '<span class="badge-demo">DEMO</span>' : ""}</h3>
        <p style="color:var(--gray-500);margin-bottom:20px;">Submitted ${new Date(a.date).toLocaleString("en-IN")}</p>
        <div class="review-block">
          <div class="row"><span class="k">Applicant</span><span class="v">${a.name}</span></div>
          <div class="row"><span class="k">Mobile</span><span class="v">${a.mobile}</span></div>
          <div class="row"><span class="k">Email</span><span class="v">${a.email}</span></div>
          <div class="row"><span class="k">City</span><span class="v">${a.city}</span></div>
          <div class="row"><span class="k">Employment</span><span class="v">${a.employment}</span></div>
          <div class="row"><span class="k">Monthly income</span><span class="v">${fpFormatCurrency(a.income)}</span></div>
          <div class="row"><span class="k">Requested amount</span><span class="v">${fpFormatCurrency(a.amount)}</span></div>
          <div class="row"><span class="k">Tenure</span><span class="v">${a.tenure} months</span></div>
          <div class="row"><span class="k">Purpose</span><span class="v">${a.purpose}</span></div>
          <div class="row"><span class="k">Existing EMI</span><span class="v">${fpFormatCurrency(a.existingEmi)}</span></div>
          <div class="row"><span class="k">Address</span><span class="v">${a.address || "—"}</span></div>
        </div>
        <div class="field" style="margin-top:18px;">
          <label for="modalStatusSelect">Change status</label>
          <select id="modalStatusSelect">
            ${["Pending", "Under Review", "Approved", "Rejected", "Disbursed", "Completed"]
              .map((s) => `<option value="${s}" ${s === a.status ? "selected" : ""}>${s}</option>`)
              .join("")}
          </select>
        </div>
        <div style="display:flex;gap:10px;margin-top:20px;">
          <button class="btn btn-primary btn-block" id="saveStatusBtn">Save Status</button>
          <button class="btn btn-outline-dark" onclick="window.print()">Print</button>
        </div>
      `;

      modal.classList.add("open");
      document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
      document.getElementById("saveStatusBtn").addEventListener("click", () => {
        const newStatus = document.getElementById("modalStatusSelect").value;
        const list = getApplications().map((x) => (x.id === id ? { ...x, status: newStatus } : x));
        saveApplications(list);
        closeModal();
        render();
        fpToast(`${id} updated to "${newStatus}"`);
      });
    }

    function closeModal() {
      modal.classList.remove("open");
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    searchInput.addEventListener("input", render);
    statusFilter.addEventListener("change", render);

    document.getElementById("resetDemoBtn")?.addEventListener("click", () => {
      localStorage.setItem("fp_applications", JSON.stringify(SEED_APPLICATIONS));
      render();
      fpToast("Demo data has been reset.");
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLogin();
    initDashboard();
  });
})();
