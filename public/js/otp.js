const inputs = document.querySelectorAll('.otp-inputs input');

inputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    const value = input.value;
    if (value && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !input.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
});

document.getElementById('otpForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const role = document.querySelector('.role').value;
  const email = document.querySelector('.email').value;

  let otp = '';
  inputs.forEach((input) => (otp += input.value));

  const endpoint = role === 'host' ? '/host/verify-otp' : '/user/verify-otp';
  const signupRoute = role === 'host' ? '/host/signup' : '/user/signup';

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp, email }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'OTP Verified',
          text: 'You will now be redirected.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = data.redirect;
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message || 'Invalid OTP, please try again',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = signupRoute;
          }
        });
      }
    })
    .catch((err) => {
      console.error('Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Server Error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = signupRoute;
        }
      });
    });
});
