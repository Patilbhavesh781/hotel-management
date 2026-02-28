let listingId = "";

function addToWishlist(id) {
    listingId = id;
}

// Scroll buttons (optional section)
const iconBox = document.getElementById("iconBox");
const leftBtn = document.getElementById("scrollLeft");
const rightBtn = document.getElementById("scrollRight");

if (iconBox && leftBtn && rightBtn) {
    leftBtn.addEventListener("click", () => {
        iconBox.scrollBy({ left: -200, behavior: 'smooth' });
    });

    rightBtn.addEventListener("click", () => {
        iconBox.scrollBy({ left: 200, behavior: 'smooth' });
    });

    function updateScrollButtons() {
        const maxScroll = iconBox.scrollWidth - iconBox.clientWidth;
        const buffer = 5;
        leftBtn.style.display = iconBox.scrollLeft > buffer ? 'block' : 'none';
        rightBtn.style.display = iconBox.scrollLeft < (maxScroll - buffer) ? 'block' : 'none';
    }

    iconBox.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    updateScrollButtons(); // initial
}


    let taxSwitch = document.getElementById("switchCheckDefault");
    taxSwitch.addEventListener("click", () => {
        let taxInfo = document.querySelectorAll(".tax-info");
        for(info of taxInfo) {
            if(info.style.display == "inline"){
                info.style.display = "none";
            }
            else {
                info.style.display = "inline"
            }
        }
})





const searchInputs = document.querySelectorAll(".nav-search");
const listingContainer = document.querySelector(".listing-container");
const noListing = document.querySelector(".hidden");
const listingHeading = document.querySelector(".heading");

let debounceTimer;
searchInputs.forEach(searchInput => {
    searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const query = e.target.value.trim();
            
            const res = await fetch(`/listings/search?query=${query}`);
            const html = await res.text();
            listingContainer.innerHTML = html;
            if(html == "") {
                noListing.classList.remove("hidden");
                listingHeading.style.display = "none";
            } else {
                noListing.classList.add("hidden");
                listingHeading.style.display = "block";
            }
            bindHeartEvents();
        }, 400);
    });
})


// Heart button toggle
document.addEventListener("DOMContentLoaded", () => {
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
            .catch(err => {
                console.log(err)
            })
        };

        button.addEventListener("click", toggleHeart, { passive: false });
        button.addEventListener("touchend", toggleHeart, { passive: false });
    });
});




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
            .catch(err => {
                console.log(err)
            })
        };

        button.addEventListener("click", toggleHeart, { passive: false });
        button.addEventListener("touchend", toggleHeart, { passive: false });
    });
}



