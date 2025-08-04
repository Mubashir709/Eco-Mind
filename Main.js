// === Feedback Page Handling (Local + Backend) ===
const wellnessForm = document.getElementById('wellnessForm');
const formAlert = document.getElementById('formAlert');
const feedbackResults = document.getElementById('feedbackResults');
const feedbackItems = document.getElementById('feedbackItems');

if (wellnessForm && formAlert && feedbackResults && feedbackItems) {
    wellnessForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            mood: document.getElementById('mood').value,
            comments: document.getElementById('comments').value,
            date: new Date().toISOString()
        };

        // ✅ Save to localStorage (optional)
        const feedbackData = JSON.parse(localStorage.getItem('feedbackData')) || [];
        feedbackData.push(formData);
        localStorage.setItem('feedbackData', JSON.stringify(feedbackData));

        // ✅ Show local alert
        formAlert.textContent = 'Thank you for your feedback!';
        formAlert.style.display = 'block';
        wellnessForm.reset();
        displayFeedbackData();

        // ✅ Send to backend
        try {
            const response = await fetch('https://eco-mind-backend-production.up.railway.app/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log("✅ Backend response:", result);
        } catch (err) {
            console.error("❌ Error sending to backend:", err);
        }

        // Hide alert after 5s
        setTimeout(() => {
            formAlert.style.display = 'none';
        }, 5000);
    });

    function displayFeedbackData() {
        const feedbackData = JSON.parse(localStorage.getItem('feedbackData')) || [];
        if (feedbackData.length > 0) {
            feedbackResults.style.display = 'block';
            feedbackItems.innerHTML = '';
            const recent = feedbackData.slice(-3).reverse();
            recent.forEach(item => {
                const date = new Date(item.date).toLocaleDateString();
                feedbackItems.innerHTML += `<div class="mb-3"><strong>${item.name}</strong> (${date}): <br>${item.comments}</div>`;
            });
        }
    }

    displayFeedbackData();
}