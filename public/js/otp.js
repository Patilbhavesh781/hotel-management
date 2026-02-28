const inputs = document.querySelectorAll('.otp-inputs input');

      // Auto focus to next/previous input
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

      // Handle OTP form submit
      document.getElementById('otpForm').addEventListener('submit', function (e) {
         e.preventDefault();

         const role = document.querySelector(".role").value;
         const email = document.querySelector(".email").value;

         // Collect OTP
         let otp = '';
         inputs.forEach(input => otp += input.value);

         // Send OTP only for 'host' role
         if (role === "host") {
            fetch('/host/verify-otp', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({ otp, email })
            })
               .then(res => res.json())
               .then(data => {
                  if (data.success) {
                     Swal.fire({
                        icon: 'success',
                        title: '✅ OTP Verified!',
                        text: 'You will now be redirected.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                     }).then((result) => {
                        if (result.isConfirmed) {
                           window.location.href = data.redirect;  // Redirect URL from server
                        }
                     })
                  } else {
                     Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "❌ Invalid OTP please try again",
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                     }).then((result) => {
                        if (result.isConfirmed) {
                           window.location.href = "/host/signup";
                        }
                     })
                  }
               })
               .catch(err => {
                  console.error("Error:", err);
                  Swal.fire({
                     icon: "error",
                     title: "Oops...",
                     text: "❌ Server Error",
                     confirmButtonText: 'OK',
                     confirmButtonColor: '#3085d6',
                  }).then((result) => {
                     if (result.isConfirmed) {
                        window.location.href = "/host/signup";
                     }
                  })
               });
         }
         else {
            fetch('/user/verify-otp', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json'
               },
               body: JSON.stringify({ otp, email })
            })
               .then(res => res.json())
               .then(data => {
                  if (data.success) {
                     Swal.fire({
                        icon: 'success',
                        title: '✅ OTP Verified!',
                        text: 'You will now be redirected.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                     }).then((result) => {
                        if (result.isConfirmed) {
                           window.location.href = data.redirect;  // Redirect URL from server
                        }
                     })
                     
                  } else {
                     Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "❌ Invalid OTP please try again",
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                     }).then((result) => {
                        if (result.isConfirmed) {
                           window.location.href = "/user/signup";
                        }
                     })
                  }
               })
               .catch(err => {
                  Swal.fire({
                     icon: "error",
                     title: "Oops...",
                     text: "❌ Server Error",
                     confirmButtonText: 'OK',
                     confirmButtonColor: '#3085d6',
                  }).then((result) => {
                     if (result.isConfirmed) {
                        window.location.href = "/host/signup";
                     }
                  })
               });
         }
      });