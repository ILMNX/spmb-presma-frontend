document.addEventListener('DOMContentLoaded', () => {
  // Step navigation
  const form = document.getElementById('smaRegistrationForm');
  const steps = Array.from(document.querySelectorAll('.step-content'));
  const indicators = Array.from(document.querySelectorAll('.step-indicator'));
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const submitBtn = document.getElementById('submitBtn');
  const summary = document.getElementById('confirmation-summary');
  const dummyPayBtn = document.getElementById('dummyPayBtn');
  let currentStep = 0;
  let paymentConfirmed = false;

  function showStep(idx) {
    steps.forEach((step, i) => {
      step.classList.toggle('hidden', i !== idx);
      indicators[i].classList.toggle('bg-blue-600', i === idx);
      indicators[i].classList.toggle('text-white', i === idx);
      indicators[i].classList.toggle('bg-gray-300', i !== idx);
      indicators[i].classList.toggle('text-gray-500', i !== idx);
    });
    prevBtn.classList.toggle('hidden', idx === 0);
    nextBtn.classList.toggle('hidden', idx === steps.length - 1 || (idx === 2 && !paymentConfirmed));
    submitBtn.classList.toggle('hidden', idx !== steps.length - 1);
  }

  function validateStep(idx) {
    if (!form) return false;
    if (idx === 0) {
      // Step 1: Data Pribadi
      const requiredFields = ['name', 'nisn', 'nik', 'phone', 'address', 'major'];
      for (const field of requiredFields) {
        const el = form.querySelector(`[name="${field}"]`);
        if (!el || !el.value.trim()) return false;
      }
      return true;
    }
    if (idx === 1) {
      // Step 2: Upload Dokumen
      const ktp = form.querySelector('[name="ktp_kk"]');
      const raport = form.querySelector('[name="raport"]');
      if (!ktp.files || ktp.files.length === 0) return false;
      if (!raport.files || raport.files.length === 0) return false;
      return true;
    }
    if (idx === 2) {
      // Step 3: Pembayaran
      return paymentConfirmed;
    }
    if (idx === 3) {
      // Step 4: Konfirmasi
      const agreement = form.querySelector('#agreement');
      return agreement && agreement.checked;
    }
    return true;
  }

  function fillSummary() {
    if (!summary) return;
    const name = form.querySelector('[name="name"]').value;
    const nisn = form.querySelector('[name="nisn"]').value;
    const nik = form.querySelector('[name="nik"]').value;
    const phone = form.querySelector('[name="phone"]').value;
    const address = form.querySelector('[name="address"]').value;
    const major = form.querySelector('[name="major"]:checked')?.value || '';
    summary.innerHTML = `
      <div><strong>Nama:</strong> ${escapeHtml(name)}</div>
      <div><strong>NISN:</strong> ${escapeHtml(nisn)}</div>
      <div><strong>NIK:</strong> ${escapeHtml(nik)}</div>
      <div><strong>WhatsApp:</strong> ${escapeHtml(phone)}</div>
      <div><strong>Alamat:</strong> ${escapeHtml(address)}</div>
      <div><strong>Jurusan:</strong> ${escapeHtml(major)}</div>
    `;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Dummy payment confirmation
  dummyPayBtn?.addEventListener('click', () => {
    paymentConfirmed = true;
    dummyPayBtn.disabled = true;
    dummyPayBtn.innerText = 'Pembayaran Terkonfirmasi!';
    nextBtn.classList.remove('hidden');
  });

  nextBtn?.addEventListener('click', () => {
    if (!validateStep(currentStep)) {
      alert(
        currentStep === 2
          ? 'Silakan klik tombol "Saya Sudah Bayar" untuk melanjutkan.'
          : 'Mohon lengkapi data pada langkah ini.'
      );
      return;
    }
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
      if (currentStep === steps.length - 1) fillSummary();
    }
  });

  prevBtn?.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      alert('Mohon centang persetujuan sebelum mengirim.');
      return;
    }
    submitBtn.disabled = true;
    submitBtn.innerText = 'Mengirim...';

    const formData = new FormData(form);
    try {
      const apiUrl = import.meta.env.API_URL || '/api';
      const res = await fetch(`${apiUrl}/registration/sma`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Pendaftaran berhasil! Silakan cek WhatsApp Anda untuk info selanjutnya.');
        form.reset();
        window.location.href = '/pendaftaran/sukses';
      } else {
        alert(data.message || 'Gagal mendaftar. Silakan cek data Anda.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Kirim Pendaftaran';
    }
  });

  // File preview (optional, no sensitive data)
  form?.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const label = input.parentElement;
      if (input.files && input.files.length > 0) {
        label.querySelector('p').innerText = `File terpilih: ${input.files[0].name}`;
      } else {
        label.querySelector('p').innerText = 'Klik untuk upload atau drag & drop';
      }
    });
  });

  showStep(currentStep);
});