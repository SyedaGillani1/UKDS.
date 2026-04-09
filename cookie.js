function acceptCookies() {
  localStorage.setItem("cookieConsent", "accepted");
  document.getElementById("cookie-banner").style.display = "none";

  loadAnalytics();
}

function rejectCookies() {
  localStorage.setItem("cookieConsent", "rejected");
  document.getElementById("cookie-banner").style.display = "none";
}

function loadAnalytics() {
  console.log("Analytics loaded"); // replace later with GA
}

window.onload = function () {
  const consent = localStorage.getItem("cookieConsent");

  if (!consent) {
    document.getElementById("cookie-banner").style.display = "block";
  } else if (consent === "accepted") {
    loadAnalytics();
  }
};