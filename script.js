// Get the registration form
const donorForm = document.getElementById("donor-form");

// Check whether the registration form exists
if (donorForm) {

    // Run this code when the form is submitted
    donorForm.addEventListener("submit", function(event) {

        // Stop the page from refreshing
        event.preventDefault();

        // Collect donor information
        const donor = {
            name: document.getElementById("donor-name").value.trim(),
            bloodGroup: document.getElementById("donor-blood").value,
            area: document.getElementById("donor-area").value.trim(),
            contact: document.getElementById("donor-contact").value.trim()
        };

        // Get previously saved donors
        let donors = JSON.parse(localStorage.getItem("donors")) || [];

        // Add the new donor
        donors.push(donor);

        // Save the updated donor list
        localStorage.setItem("donors", JSON.stringify(donors));

        // Display success message
        document.getElementById("success-message").textContent =
            "Registration successful! Thank you for becoming a donor.";

        // Clear the form
        donorForm.reset();

    });
}


// Get the donor list from HTML
const donorList = document.getElementById("donor-list");

// Check if donor list exists
if (donorList) {

    // Get saved donor details
    const savedDonors = JSON.parse(localStorage.getItem("donors")) || [];

    // Display each saved donor
    savedDonors.forEach(function(donor) {

        // Create a new list item
        const li = document.createElement("li");

        // Add donor name
        const name = document.createElement("strong");
        name.textContent = donor.name;
        li.appendChild(name);

        // Add blood group
        const blood = document.createElement("p");
        blood.textContent = "Blood Group: " + donor.bloodGroup;
        li.appendChild(blood);

        // Add area
        const area = document.createElement("p");
        area.textContent = "Area: " + donor.area;
        li.appendChild(area);

        // Add contact
        const contact = document.createElement("p");
        contact.textContent = "Contact: " + donor.contact;
        li.appendChild(contact);

        // Add donor to the list
        donorList.appendChild(li);

    });
}


// Get the search form
const searchForm = document.getElementById("search-form");

// Check whether the search form exists
if (searchForm && donorList) {

    // Get the two search fields
    const groupSelect = document.getElementById("blood-group");
    const areaInput = document.getElementById("city-area");

    // Create the "no results" message once and keep it hidden
    const message = document.createElement("p");
    message.id = "no-results";
    message.textContent = "No donors found. Try another blood group or area.";
    message.style.display = "none";
    donorList.insertAdjacentElement("afterend", message);

    // Show only the donors that match the search
    function filterDonors() {

        // Get search values
        const bloodGroup = groupSelect.value.trim().toLowerCase();
        const area = areaInput.value.trim().toLowerCase();

        // Get all donor records
        const donorItems = donorList.querySelectorAll("li");

        let foundDonor = false;

        // Check every donor
        donorItems.forEach(function(item) {

            // Read the donor's blood group and area from the <p> lines
            const details = item.querySelectorAll("p");
            const donorGroup = details[0].textContent.replace("Blood Group:", "").trim().toLowerCase();
            const donorArea = details[1].textContent.replace("Area:", "").trim().toLowerCase();

            // Empty blood group means "any group"; otherwise it must match exactly
            const bloodMatch = bloodGroup === "" || donorGroup === bloodGroup;

            // Empty area means "any area"; otherwise match anywhere in the area name
            const areaMatch = donorArea.includes(area);

            // Display matching donors
            if (bloodMatch && areaMatch) {
                item.style.display = "";
                foundDonor = true;
            } else {
                item.style.display = "none";
            }

        });

        // Show message only if no donor is found
        message.style.display = foundDonor ? "none" : "block";
    }

    // Filter only when the Search button is clicked (or Enter is pressed)
    // preventDefault stops the page from refreshing
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        filterDonors();
    });

    // After the Clear button empties the fields, show all donors again
    searchForm.addEventListener("reset", function() {
        // Wait a moment so the fields are empty before filtering
        setTimeout(filterDonors, 0);
    });
}