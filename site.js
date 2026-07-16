document.addEventListener("DOMContentLoaded", function () {
    // Ausklapp mechanism (SiteCake editing workaround)
    if (!window.sitecakeGlobals) {
        var ausklappAnfang = document.querySelectorAll("p.ausklapp-anfang");
        ausklappAnfang.forEach(function (anfang) {
            var details = document.createElement("details");
            var summary = document.createElement("summary");
            summary.innerHTML = anfang.innerHTML;
            details.appendChild(summary);
            var sibling = anfang.nextSibling;
            while (sibling) {
                var nextSibling = sibling.nextSibling;
                details.appendChild(sibling);
                sibling = nextSibling;
                if (sibling && sibling.classList && sibling.classList.contains("ausklapp-ende")) {
                    sibling.remove();
                    sibling = null;
                }
            }
            anfang.parentNode.replaceChild(details, anfang);
        });
    }

    // Toggle mobile menu
    var navToggle = document.getElementById("nav-toggle");
    var nav = document.querySelector("nav");
    if (navToggle && nav) {
        function updateNavIcon() {
            var isOpen = nav.classList.contains("nav-open");
            navToggle.textContent = isOpen ? "close" : "menu";
            navToggle.setAttribute("aria-expanded", isOpen);
            navToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
        }
        navToggle.addEventListener("click", function () {
            nav.classList.toggle("nav-open");
            updateNavIcon();
        });
        // Close menu when a nav link is clicked
        document.querySelectorAll("nav .sc-nav a").forEach(function (link) {
            link.addEventListener("click", function () {
                nav.classList.remove("nav-open");
                updateNavIcon();
            });
        });
    }

    // Contact form mailto generator
    var form = document.getElementById("kontakt-form");
    if (form) {
        var subjectField = document.getElementById("form-subject");
        var messageField = document.getElementById("form-message");
        // Prefill from data attributes on links
        document.querySelectorAll("a[data-subject]").forEach(function (link) {
            link.addEventListener("click", function () {
                if (subjectField) subjectField.value = link.dataset.subject;
                if (messageField) messageField.value = link.dataset.message || "";
            });
        });
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var name = document.getElementById("form-name").value.trim();
            var message = messageField.value.trim();
            var subject = subjectField.value.trim() || "Kontaktanfrage";
            var body = message;
            if (name) body += "\n\nAbsender: " + name;
            if (body) body += "\n";
            window.location.href = "mailto:gfk@open-mind.life?subject=" +
                encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        });
    }

    // Customize edit links for SiteCake to edit each subpage directly
    var editLinks = document.querySelectorAll(".admin-link");
    editLinks.forEach(function (link) {
        var page = window.location.pathname.split("/").pop();
        if (page === "" || page === "index.html") {
            link.href = "/admin.php";
        } else {
            link.href = "/admin.php?scpage=" + page;
        }
    });

    // Add a hidden sub-menu to "Angebote" in the main navigation, shown on hover or focus
    if (!window.sitecakeGlobals) {
        var angeboteLink = document.querySelector('nav .sc-nav a[href="angebote.html"]');
        angeboteLink.style.anchorName = "angebote-link";
        angeboteLink.style.position = "relative"; // Ensure the link is positioned for the sub-menu
        if (angeboteLink) {
            var subMenu = document.createElement("ul");
            subMenu.className = "sub-menu";
            subMenu.innerHTML = `
            <li><a href="uebungsgruppen.html">Übungsgruppen</a></li>
            <li><a href="inhouse.html">Inhouse-Seminare</a></li>
            <li><a href="seminare.html">Seminare &amp; Einführungen</a></li>
            <li><a href="coaching.html">Coaching / Paarcoaching</a></li>
        `;
            angeboteLink.appendChild(subMenu);
        }
    }
});
