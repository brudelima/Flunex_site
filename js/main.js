document.addEventListener('DOMContentLoaded', () => {
      
      // 1. Lenis Smooth Scroll Setup
      const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true
      });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // 2. Preloader Animation
      const loaderBar = document.getElementById('loader-bar-fill');
      const loader = document.getElementById('loader');
      let progress = 0;
      
      // Fake loading progress
      const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if(progress >= 100) {
          progress = 100;
          clearInterval(loadingInterval);
          finishLoading();
        }
        loaderBar.style.width = progress + '%';
      }, 100);

      function finishLoading() {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            playHeroAnimations();
          }
        });
      }

      // 3. Hero Entrance Animations
      function playHeroAnimations() {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.to('#main-nav', { opacity: 1, duration: 1 }, 0.2);

        tl.to('#hero-eyebrow', { opacity: 1, y: 0, duration: 0.8 }, 0.4);

        // Splitted text slide up
        tl.to('#hero-h1 .line .inner', {
          y: '0%',
          duration: 1.2,
          stagger: 0.12
        }, 0.5);

        tl.to('#hero-h2', { opacity: 1, y: -10, duration: 1 }, 1.0);
        tl.to('#hero-ctas', { opacity: 1, y: -10, duration: 1 }, 1.2);

        // Right side Visual elements
        tl.fromTo('#hero-visuals', 
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out' },
          0.8
        );

        // Stagger list items
        tl.fromTo('.step-item', 
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.8, stagger: 0.15 },
          1.2
        );
      }

      // 4. Subtle Parallax using GSAP (Bind to mouse/scroll)
      gsap.registerPlugin(ScrollTrigger);

      // Mouse effect on the steps list
      const stepsList = document.querySelector('.steps-list');
      document.addEventListener('mousemove', (e) => {
        if(window.innerWidth < 1024) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        gsap.to(stepsList, {
          rotateY: x,
          rotateX: -y,
          transformPerspective: 900,
          ease: 'power2.out',
          duration: 1
        });
      });

      // 5. Intro Section Animation
      gsap.fromTo(['#intro-title', '#intro-desc', '#intro-meta'], {
        y: 50, opacity: 0
      }, {
        y: 0, opacity: 1, duration: 1.2,
        stagger: 0.15, ease: 'power3.out',
        scrollTrigger: {
          trigger: '#intro-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      // 6. Pain Points Section Animation
      gsap.fromTo(['.pain-header', '.pain-card'], {
        y: 40, opacity: 0
      }, {
        y: 0, opacity: 1, duration: 1,
        stagger: 0.1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '#pain-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      // 7. Interactive Stacked Cards rotation
      const stackWrapper = document.querySelector('.card-stack-wrapper');
      if (stackWrapper) {
        // Rotate cards when clicking anywhere on the stack
        stackWrapper.addEventListener('click', () => {
          const cards = Array.from(stackWrapper.querySelectorAll('.card-stack-item'));
          if(cards.length > 0) stackWrapper.appendChild(cards[0]);
        });

        // Interactive Steps List visually
        const steps = document.querySelectorAll('.step-item');
        steps.forEach((step) => {
          step.addEventListener('click', () => {
             steps.forEach(s => s.classList.remove('active'));
             step.classList.add('active');
             
             // Shuffle cards instantly when clicking an index item
             const cards = Array.from(stackWrapper.querySelectorAll('.card-stack-item'));
             if(cards.length > 0) stackWrapper.appendChild(cards[0]);
          });
        });
      }
      // 8. Modal Pop-up Logic & Mask
      const modal = document.getElementById('lead-modal');
      const closeBtn = document.getElementById('modal-close-btn');

      // Add functionality to ANY link mapped to #contact (or specifically section 9 CTA)
      const openModalBtns = document.querySelectorAll('a[href="#contact"]');
      openModalBtns.forEach(btn => {
         btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
         });
      });

      // Close modal events
      if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      }
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });

      // Simple WhatsApp DDD Masking: (00) 00000-0000
      const phoneInput = document.getElementById('form-whatsapp');
      if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
      }
      // 9. Google Forms Transparent Integration
      const leadForm = document.getElementById('lead-form');
      if (leadForm) {
         leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = leadForm.querySelector('button[type="submit"] span');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'ENVIANDO...';

            const formData = new URLSearchParams();
            // Mapeamento exato fornecido pelo usuário
            formData.append('entry.434663847', document.getElementById('form-name').value);
            formData.append('entry.322011966', document.getElementById('form-whatsapp').value);
            formData.append('entry.1181661335', document.getElementById('form-email').value);
            formData.append('entry.967209447', document.getElementById('form-company').value);
            
            // Extraindo o texto extenso da opção selecionada para enviar ao Google Sheets certinho
            const needSelect = document.getElementById('form-need');
            formData.append('entry.183704777', needSelect.options[needSelect.selectedIndex].text);
            
            const roleSelect = document.getElementById('form-role');
            formData.append('entry.1629352538', roleSelect.options[roleSelect.selectedIndex].text);

            fetch('https://docs.google.com/forms/d/e/1FAIpQLScLd9VsWXRURceFM7f3FDklhtWk5Smgc0BiolFRKAXqUVM1SA/formResponse', {
               method: 'POST',
               mode: 'no-cors',
               headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
               body: formData.toString()
            }).then(() => {
               submitBtn.innerText = originalText;
               alert('Formulário enviado com sucesso! Entraremos em contato em breve.');
               modal.classList.remove('active');
               leadForm.reset();
            }).catch((err) => {
               submitBtn.innerText = originalText;
               alert('Ocorreu um erro ao enviar. Tente novamente.');
               console.error('Submission error:', err);
            });
         });
      }

    });