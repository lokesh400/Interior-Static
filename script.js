
    // Detect when elements are in the viewport and add 'visible' class
    const sections = document.querySelectorAll('.section');

    function checkVisibility() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        // Check if the section is within the viewport
        if (scrollY + windowHeight > sectionTop + 0 && scrollY < sectionTop + sectionHeight) {
          section.classList.add('visible'); // Add 'visible' class when in the viewport
        } else {
          section.classList.remove('visible'); // Remove 'visible' class when out of viewport
        }
      });
    }

    // Run the checkVisibility function on scroll
    window.addEventListener('scroll', checkVisibility);

    // Also call it once on load to animate elements that might already be in view
    window.onload = checkVisibility;