function bindHeartEvents() {
    const buttons = document.querySelectorAll(".heart-btn");

    buttons.forEach(button => {
        const heartIcon = button.querySelector(".heart");

        const toggleHeart = (e) => {
            e.stopPropagation();
            e.preventDefault();

            // ✅ Get ID here — always fresh from current button
            const listingId = button.getAttribute("data-id");

            const isActive = heartIcon.classList.toggle("active");

            const method = isActive ? "POST" : "DELETE";

            fetch(`/listings/wishlist/${listingId}`, {
                method,
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirectTo;
                }
            });
        };

        button.addEventListener("click", toggleHeart, { passive: false });
        button.addEventListener("touchend", toggleHeart, { passive: false });
    });
}


function activeHart() {
    const buttons = document.querySelectorAll(".heart-btn");
    buttons.forEach(button => {
        const heartIcon = button.querySelector(".heart");
        heartIcon.classList.toggle("active")
    })
};