// Getting references to various elements on the webpage
const loginModal = document.getElementById('login'); // Reference to the login modal element
const loginLink = document.getElementById('loginLink'); // Reference to the login link element
const closeBtn = document.getElementsByClassName('close')[0]; // Reference to the close button element inside the modal
const loginBtn = document.getElementById('loginBtn'); // Reference to the login button element
const logoutBtn = document.getElementById('logoutBtn'); // Reference to the logout button element
const subsTable = document.getElementById('subscription-details'); // Reference to the subscription details table element
const subsSubmitBtn = document.getElementById('submit-btn'); // Reference to the submit button element for subscription details

// Users object with predefined users' information
const users = [
    {
        "username": "admin",
        "password": "admin",
        "role": "admin",
        "email": "admin@admin.com"
    },
    {
        "username": "user",
        "password": "user",
        "role": "site_user",
        "email": "user@user.com"
    }
];

// Variable to keep track of the current user
let currentUser = null;

// Function to open the login modal when the login link is clicked
loginLink.onclick = function() {
    loginModal.style.display = 'block';
};

// Function to close the login modal when the close button is clicked
closeBtn.onclick = function() {
    loginModal.style.display = 'none';
};

// Function to close the login modal when clicked outside of it
window.onclick = function(event) {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
};

// Function to handle login when the login button is clicked
loginBtn.onclick = function() {
    // Get the entered username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Authenticate the user
    currentUser = authenticateUser(username, password);
    // If authentication is successful, hide the login modal, show the subscription table, and display subscription details
    if (currentUser) {
        alert('Login successful!');
        loginModal.style.display = 'none';
        sessionStorage.setItem('isLoggedIn', 'true');
        subsTable.style.display = 'flex';
        showLogoutButton();
        displaySubscriptionDetails();
    } else {
        alert('Invalid username or password. Please try again.');
    }
};

// Add event listener for the submit button to save subscription details
subsSubmitBtn.addEventListener('click', saveSubs);

// Function to authenticate the user
function authenticateUser(username, password) {
    return users.find(user => user.username === username && user.password === password);
}

// Function to show the login link and hide the logout button
function showLoginButton() {
    loginLink.style.display = 'block';
    logoutBtn.style.display = 'none';
}

// Function to hide the login link and show the logout button
function showLogoutButton() {
    loginLink.style.display = 'none';
    logoutBtn.style.display = 'block';
}

// Function to handle logout
logoutBtn.onclick = function() {
    currentUser = null;
    alert('Logged out successfully');
    showLoginButton();
    sessionStorage.removeItem('isLoggedIn');
    subsTable.style.display = 'none';
};

// Function to check if the user is logged in and update the interface accordingly
function userLoggedinStatus() {
    let loggedInStatus = sessionStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
        loginLink.style.display = 'none';
        logoutBtn.style.display = 'block';
        subsTable.style.display = 'flex';
        displaySubscriptionDetails();
    } else {
        loginLink.style.display = 'block';
        logoutBtn.style.display = 'none';
        subsTable.style.display = 'none';
    }
}

// Load the website content and check user login status when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    LoadWebsite();
    userLoggedinStatus();
});

// Fetch JSON content and store it in local storage
fetchAndStoreJSON('About.json', 'About');

// Function to fetch JSON content and store it in local storage
function fetchAndStoreJSON(jsonFile, storageKey) {
    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem(storageKey, JSON.stringify(data));
            console.log(`JSON data fetched from ${jsonFile} and stored in local storage with key ${storageKey}`);
        })
        .catch(error => console.error('There was a problem fetching the JSON:', error));
}

// Function to load website content from local storage
function LoadWebsite() {
    const websiteData = JSON.parse(localStorage.getItem('About'));
    const pageCurrent = findCurrentPage();

    if (websiteData && websiteData[pageCurrent]) {
        const pageData = websiteData[pageCurrent];

        for (const elementKey in pageData) {
            const elementContent = pageData[elementKey];
            const element = document.getElementById(elementKey);

            if (element && elementContent) {
                if (element.tagName === 'UL' && Array.isArray(elementContent)) {
                    element.innerHTML = '';
                    elementContent.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        element.appendChild(li);
                    });
                } else {
                    element.innerHTML = elementContent;
                }
            }
        }
    } else {
        console.log('Page data not found in local storage.');
    }
}

// Function to find the current page
function findCurrentPage() {
    const url = window.location.href;
    let currentPage = url.substring(url.lastIndexOf('/') + 1).replace('.html', '');
    currentPage = currentPage.replace('.html', '');
    return currentPage;
}

// Function to save subscription details
function saveSubs() {
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;

    const subscriptionDetails = JSON.parse(localStorage.getItem('subscriptionDetails')) || [];
    subscriptionDetails.push({ fullName, email });
    localStorage.setItem('subscriptionDetails', JSON.stringify(subscriptionDetails));

    document.getElementById('subscription-form').reset();
    displaySubscriptionDetails();
    alert('Subscription Successful!');
}

// Function to display subscription details in the table
function displaySubscriptionDetails() {
    const subscriptionDetails = JSON.parse(localStorage.getItem('subscriptionDetails'));
    const tableBody = document.getElementById('subscription-table-body');
    tableBody.innerHTML = '';

    if (subscriptionDetails && subscriptionDetails.length > 0) {
        subscriptionDetails.forEach(subscription => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${subscription.fullName}</td>
                <td>${subscription.email}</td>
            `;
            tableBody.appendChild(row);
        });
        subsTable.style.display = 'block';
    } else {
        subsTable.style.display = 'none';
    }
}



