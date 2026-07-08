/* Talon Construction Company — lead form handler
 * Posts to the Cloudflare Pages Function at /api/lead, which forwards
 * to the free Google Apps Script receiver (see setup/ folder).
 */

const FORM_ENDPOINT = "/api/lead";

/* ---- Lead form ---- */

const form = document.getElementById("lead-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  statusEl.className = "form-status";

  // Honeypot: silently drop bot submissions (defensive: never crash if absent)
  const hp = form.elements["tcc_extra"];
  if (hp && hp.value) {
    statusEl.textContent = "Thanks — we'll be in touch.";
    statusEl.classList.add("ok");
    form.reset();
    return;
  }

  // Basic validation
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    statusEl.textContent = "Please enter your name and a valid email address.";
    statusEl.classList.add("err");
    return;
  }

  const payload = {
    name,
    email,
    phone: form.phone.value.trim(),
    project: form.project.value,
    message: form.message.value.trim(),
    page: window.location.href,
    submitted: new Date().toISOString(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Request failed: " + res.status);

    statusEl.textContent =
      "Thanks, " + name.split(" ")[0] + " — your details are on their way. We'll follow up shortly.";
    statusEl.classList.add("ok");
    form.reset();
  } catch (err) {
    statusEl.innerHTML =
      'Something went wrong sending the form. Please call <a href="tel:+15304323633" style="color:#C8A45A">(530) 432‑3633</a> or email <a href="mailto:info@talonconstructioncompany.com" style="color:#C8A45A">info@talonconstructioncompany.com</a>.';
    statusEl.classList.add("err");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Project Details";
  }
});
