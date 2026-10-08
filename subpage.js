// Subpage Interactions, Cursor & Theme Sync
document.addEventListener('DOMContentLoaded', () => {
  // 1. Sync theme from localStorage
  const savedTheme = localStorage.getItem('portfolio_theme') || 'lime';
  document.body.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-theme', savedTheme);

  // 2. Dot Cursor Tracking (matches main page glowing dot cursor)
  const cursorDot = document.getElementById('cursor-dot');
  if (cursorDot) {
    let mouseX = -100;
    let mouseY = -100;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(() => {
          cursorDot.classList.remove('hidden');
          cursorDot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
          isMoving = false;
        });
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.classList.add('hidden');
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.classList.remove('hidden');
    });
  }

  // 3. Interactive Accordion for Q&A
  const accordionItems = document.querySelectorAll('.qna-accordion-item');
  if (accordionItems.length > 0) {
    accordionItems.forEach(item => {
      const trigger = item.querySelector('.qna-trigger');
      if (trigger) {
        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');

          // Close other open items for neat accordion behavior
          accordionItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('is-open');
              const otherTrigger = otherItem.querySelector('.qna-trigger');
              if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            }
          });

          // Toggle current
          if (isOpen) {
            item.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
          } else {
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }

  // 4. Smooth scroll for internal anchor links (like privacy policy sidebar)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
