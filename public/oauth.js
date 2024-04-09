window.onload = function () {
  document.querySelector("button").addEventListener("click", function () {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (token) {
        document.getElementById("btn").style.display = "none";
        document.getElementById("success").style.display = "flex";
      } else {
        document.getElementById("btn").style.display = "block";
        document.getElementById("success").style.display = "none";
      }
    });
  });
};
