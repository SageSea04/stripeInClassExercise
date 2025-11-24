// Initialize Stripe
const stripe = Stripe("pk_test_51SWmwLFuz7Ox4fG2xcLcnAPpQ386Xx0qH3ZgyJ8Ud71JzP2L9WgTpQXlBhHfMsfX35eqYhh0VtPQv0J1S9aDEeX100Wob0Zeus");
const elements = stripe.elements();
const card = elements.create("card");
card.mount("#card-element");

// Sidebar navigation
const sidebarItems = document.querySelectorAll(".sidebar li");
const sections = document.querySelectorAll(".content");
const sidebarWelcome = document.getElementById("sidebar-welcome");

sidebarItems.forEach(item => {
  item.addEventListener("click", () => {
    sidebarItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    const sectionToShow = item.dataset.section;
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(sectionToShow).classList.add("active");

    if(sectionToShow === "welcome") sidebarWelcome.textContent = "Welcome! Choose a section to get started.";
    if(sectionToShow === "plans") sidebarWelcome.textContent = "Select a plan that fits your test payment.";
    if(sectionToShow === "payment") sidebarWelcome.textContent = "Proceed with the selected plan to make a payment.";
  });
});

// Plan selection
let selectedAmount = 5;
const selectedPlanSpan = document.getElementById("selected-plan");

// Added custom amount input handling
const customAmountInput = document.getElementById("custom-amount"); 
customAmountInput.addEventListener("input", () => {
  selectedAmount = parseInt(customAmountInput.value) || 0;
  selectedPlanSpan.textContent = `$${selectedAmount}`;
  document.querySelectorAll(".plan").forEach(btn => btn.classList.remove("active"));
});

document.querySelectorAll(".plan").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".plan").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    selectedAmount = parseInt(button.dataset.amount);
    selectedPlanSpan.textContent = `$${selectedAmount}`;
    customAmountInput.value = ""; // reset custom input
  });
});

customAmountInput.addEventListener("input", () => {
  selectedAmount = parseInt(customAmountInput.value) || 0;
  selectedPlanSpan.textContent = `$${selectedAmount}`;
  document.querySelectorAll(".plan").forEach(btn => btn.classList.remove("active"));
});

// Sounds & GIF
const confettiSound = document.getElementById("confetti-sound");
const failSound = document.getElementById("fail-sound");
const confettiGif = document.getElementById("confetti-gif");

// Payment
const payButton = document.getElementById("pay-button");
const paymentMessage = document.getElementById("payment-message");

payButton.addEventListener("click", async () => {
  paymentMessage.textContent = "Processing payment...";
  payButton.disabled = true;

  try {
    const response = await fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: selectedAmount })
    });

    const data = await response.json();

    if (data.error) {
      paymentMessage.textContent = "Payment failed: " + data.error;
      failSound.play();
      payButton.disabled = false;
      return;
    }

    const result = await stripe.confirmCardPayment(data.clientSecret, { payment_method: { card } });

    if (result.error) {
      paymentMessage.textContent = "Payment failed: " + result.error.message;
      failSound.play();
      // Update backend with fail
      fetch("/update-payment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedAmount, status: "failed" })
      });
    } else if (result.paymentIntent.status === "succeeded") {
      paymentMessage.textContent = `Payment successful! Amount: $${selectedAmount}`;
      fireConfetti();
      
      // Update backend with success
      fetch("/update-payment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedAmount, status: "succeeded" })
      });
    }

  } catch (err) {
    paymentMessage.textContent = "Payment failed: " + err.message;
    failSound.play();
  }

  payButton.disabled = false;
});

// Confetti animation + GIF + sound
function fireConfetti() {
  confettiSound.currentTime = 0;
  confettiSound.play();
  confettiGif.style.display = "block";

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  setTimeout(() => {
    confettiGif.style.display = "none";
  }, 2500);
}
