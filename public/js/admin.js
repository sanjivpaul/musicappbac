document.addEventListener("DOMContentLoaded", function () {
  // Sidebar toggle
  const sidebarCollapse = document.getElementById("sidebarCollapse");
  const body = document.body;

  if (sidebarCollapse) {
    sidebarCollapse.addEventListener("click", function () {
      body.classList.toggle("sidebar-collapsed");
      // Save state to localStorage
      if (body.classList.contains("sidebar-collapsed")) {
        localStorage.setItem("sidebarCollapsed", "true");
      } else {
        localStorage.removeItem("sidebarCollapsed");
      }
    });
  }

  // Check for saved sidebar state
  if (localStorage.getItem("sidebarCollapsed") === "true") {
    body.classList.add("sidebar-collapsed");
  }

  // Profile dropdown
  const adminProfile = document.querySelector(".admin-profile");
  if (adminProfile) {
    adminProfile.addEventListener("click", function (e) {
      e.stopPropagation();
      this.classList.toggle("show-dropdown");
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", function () {
    const dropdown = document.querySelector(".admin-profile.show-dropdown");
    if (dropdown) {
      dropdown.classList.remove("show-dropdown");
    }
  });
});
