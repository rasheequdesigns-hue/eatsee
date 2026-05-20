/**
 * Eatsee Food Products - Core Application Scripts
 * Manages premium interactions, dynamic catalog rendering, animations, and modal popups.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Supabase Client Initialization ---
  const supabaseUrl = 'https://cyovtwebgecrvrxxvfjw.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Z0d2ViZ2VjcnZyeHh2Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODAxMDksImV4cCI6MjA5NDM1NjEwOX0.Ea-RqeWzAayArsyhGa9Cnrm1bHE68Rq4_D6iLSp2rJc';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // --- Initialize App State ---
  let productsData = [];

  // --- DOM Elements ---
  const header = document.querySelector('.header');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const productsGrid = document.getElementById('productsGrid');
  const categoryFilterContainer = document.getElementById('categoryFilterContainer');
  
  // Modal Elements
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalTagline = document.getElementById('modalTagline');
  const modalDesc = document.getElementById('modalDesc');
  const modalIngredients = document.getElementById('modalIngredients');
  
  // Contact Form Elements
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // --- 1. Header Scroll Effects ---
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on load in case page is refreshed halfway

  // --- 2. Responsive Mobile Navigation ---
  const toggleMobileMenu = () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  const closeMobileMenu = () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
  };

  menuToggle.addEventListener('click', toggleMobileMenu);
  
  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --- 3. Scroll Reveal Animations (Intersection Observer) ---
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Active Nav Item Highlighting ---
  const sectionObserverCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const sectionObserver = new IntersectionObserver(sectionObserverCallback, {
    root: null,
    threshold: 0.5,
    rootMargin: '-80px 0px -40% 0px'
  });

  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec => sectionObserver.observe(sec));

  // --- 5. Catalog Dynamic Management ---
  // --- Helper to check if image path is a valid custom admin-supplied web URL ---
  const hasValidImage = (imageUrl) => {
    if (!imageUrl) return false;
    // Exclude mock files, generated images or default placeholder references
    if (imageUrl.startsWith('assets/products') || imageUrl.includes('Artboard') || imageUrl.includes('satheeshan') || imageUrl === 'assets/logo.svg') {
      return false;
    }
    // Allow external URL structures (http/https) or base64 data URLs
    return imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:');
  };

  // --- 5. Catalog Dynamic Management ---
  const updateHeroVisual = () => {
    const heroImage = document.querySelector('.hero-main-img');
    if (!heroImage) return;
    
    const featuredProduct = productsData.find(p => p.featured) || productsData[0];
    if (featuredProduct && hasValidImage(featuredProduct.image)) {
      heroImage.src = featuredProduct.image;
      heroImage.alt = featuredProduct.name;
      heroImage.style.maxHeight = '';
      heroImage.style.objectFit = '';
      heroImage.style.padding = '';
    } else {
      heroImage.src = 'assets/logo.svg';
      heroImage.alt = 'Eatsee Food Products';
      heroImage.style.maxHeight = '280px';
      heroImage.style.objectFit = 'contain';
      heroImage.style.padding = '30px';
    }
  };

  const fetchProducts = async () => {
    try {
      // Query Supabase directly
      const { data, error } = await supabase
        .from('products')
        .select('*');
        
      if (error) throw error;
      
      productsData = (data || []).sort((a, b) => a.name.localeCompare(b.name));
      
      updateHeroVisual();
      renderCatalog('all');
    } catch (error) {
      console.warn('Supabase fetch failed:', error);
      productsGrid.innerHTML = `
        <div class="form-message error" style="grid-column: 1/-1; text-align: center;">
          Failed to load product catalog. Please refresh the page.
        </div>`;
    }
  };

  const renderCatalog = (categoryFilter = 'all') => {
    if (!productsGrid) return;
    
    // First, dynamically render the category filter tabs
    renderCategoryTabs(categoryFilter);

    // Start fade out animation
    productsGrid.style.opacity = '0';
    productsGrid.style.transform = 'translateY(15px)';

    setTimeout(() => {
      productsGrid.innerHTML = '';
      
      const filtered = productsData.filter(item => 
        categoryFilter === 'all' || item.category === categoryFilter
      );

      if (filtered.length === 0) {
        productsGrid.innerHTML = '<div class="form-message info" style="grid-column: 1/-1; text-align: center;">No products found in this category.</div>';
      } else {
        filtered.forEach(product => {
          const card = createProductCard(product);
          productsGrid.appendChild(card);
        });
      }

      // Fade back in smoothly
      productsGrid.style.opacity = '1';
      productsGrid.style.transform = 'translateY(0)';
    }, 300);
  };

  const renderCategoryTabs = (activeCategory) => {
    if (!categoryFilterContainer) return;
    
    const uniqueCategories = [];
    const categoryMap = { 'all': 'All Items' };
    
    productsData.forEach(p => {
      if (!categoryMap[p.category]) {
        categoryMap[p.category] = p.category_name;
        uniqueCategories.push(p.category);
      }
    });

    // Sort categories alphabetically
    uniqueCategories.sort((a, b) => categoryMap[a].localeCompare(categoryMap[b]));
    
    const categoriesToShow = ['all', ...uniqueCategories];
    
    categoryFilterContainer.innerHTML = categoriesToShow.map(cat => {
      const label = categoryMap[cat];
      const isActive = cat === activeCategory ? 'active' : '';
      return `<button class="tab-btn ${isActive}" data-category="${cat}">${label}</button>`;
    }).join('');

    // Re-bind click events
    const btns = categoryFilterContainer.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        renderCatalog(category);
      });
    });
  };

  const createProductCard = (product) => {
    const card = document.createElement('div');
    const validImg = hasValidImage(product.image);
    card.className = `product-card reveal active ${validImg ? 'has-image' : 'no-image'}`;
    card.setAttribute('data-id', product.id);
    
    let imgHTML = '';
    let categoryHTML = '';
    
    if (validImg) {
      imgHTML = `
        <div class="product-img-frame">
          <img class="product-img" src="${product.image}" alt="${product.name}" loading="lazy">
          <span class="product-category-tag">${product.category_name}</span>
        </div>
      `;
    } else {
      categoryHTML = `<span class="product-category-tag-inline">${product.category_name}</span>`;
    }
    
    card.innerHTML = `
      ${imgHTML}
      <div class="product-info">
        ${categoryHTML}
        <h3 class="product-name">${product.name}</h3>
        <p class="product-tagline">${product.tagline}</p>
        <p class="product-intro">${product.description}</p>
        <div class="product-card-footer">
          <span class="product-view-btn">
            Explore <i class="fas fa-arrow-right"></i>
          </span>
        </div>
      </div>
    `;

    // Click handler to open product details modal
    card.addEventListener('click', () => openProductModal(product));

    return card;
  };

  // --- 6. Category Tab Filters Management ---
  // Note: Category tabs are now dynamically generated inside renderCategoryTabs() via renderCatalog()

  // --- 7. Interactive Product Details Modal ---
  const openProductModal = (product) => {
    const modalLeft = document.querySelector('.modal-left');
    const modalLayout = document.querySelector('.modal-layout');
    
    if (hasValidImage(product.image)) {
      modalImage.src = product.image;
      modalImage.alt = product.name;
      if (modalLeft) modalLeft.style.display = 'flex';
      if (modalLayout) modalLayout.style.gridTemplateColumns = '1fr 1.2fr';
    } else {
      if (modalLeft) modalLeft.style.display = 'none';
      if (modalLayout) modalLayout.style.gridTemplateColumns = '1fr';
    }

    // Populate Modal Content (with elegant fallbacks for optional specifications)
    modalTitle.textContent = product.name;
    modalTagline.textContent = product.tagline;
    modalDesc.textContent = product.description;
    modalIngredients.textContent = product.ingredients;

    // Open Modal with lock scroll
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  modalClose.addEventListener('click', closeProductModal);
  
  // Close modal when clicking on the outside overlay
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeProductModal();
    }
  });

  // Close modal when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeProductModal();
    }
  });

  // --- 8. Contact Form Handling & Supabase Preparation ---
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const subject = document.getElementById('formSubject').value;
      const message = document.getElementById('formMessage').value.trim();

      // Simple Validation
      if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      const inquiryData = {
        name,
        email,
        phone,
        subject,
        message,
        timestamp: new Date().toISOString()
      };

      // Disable button during submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

      try {
        // Run Simulated Supabase Upload
        await saveInquiry(inquiryData);
        
        // Success
        showFormMessage('Thank you! Your inquiry has been saved successfully. We will get back to you soon.', 'success');
        contactForm.reset();
      } catch (error) {
        showFormMessage('An error occurred. Please try again later.', 'error');
        console.error(error);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  const showFormMessage = (msg, type) => {
    formStatus.textContent = msg;
    formStatus.className = `form-message ${type}`;
    
    // Clear message after 8 seconds
    setTimeout(() => {
      formStatus.style.opacity = '0';
      setTimeout(() => {
        formStatus.style.display = 'none';
        formStatus.style.opacity = '1';
      }, 400);
    }, 8000);
  };

  /**
   * Saves the contact inquiries.
   * Currently saves to local storage (acts as database) in preparation for Supabase integration.
   * 
   * Transitioning to Supabase is simple:
   * 1. Initialize Supabase: const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
   * 2. Replace the body of this function with:
   *    const { data, error } = await supabase.from('inquiries').insert([inquiryData]);
   *    if (error) throw error;
   *    return data;
   */
  const saveInquiry = async (inquiryData) => {
    // We let Supabase handle the timestamp via its DEFAULT value if not provided,
    // or we send it explicitly. To be safe, we'll send it but ensure it's a format PG likes.
    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: inquiryData.name,
          email: inquiryData.email,
          phone: inquiryData.phone,
          subject: inquiryData.subject,
          message: inquiryData.message,
          timestamp: new Date().toISOString()
        }
      ]);
      
    if (error) {
      console.error('CRITICAL: Supabase Inquiry Insert Failed:', error);
      throw error;
    }
    return data;
  };

  // --- Site Settings Fetching & Mapping ---
  const fetchSiteSettings = async () => {
    try {
      // Query with limit(1) instead of single() to prevent HTTP 406 errors in console when no data is seeded
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'site_content')
        .limit(1);
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0 && data[0].value) {
        applySiteSettings(data[0].value);
      } else {
        console.log('No custom site settings found. Applying blank state.');
        applySiteSettings({});
      }
    } catch (e) {
      console.warn('Error fetching site settings from Supabase, applying blank state:', e);
      applySiteSettings({});
    }
  };

  const getDefaultSiteSettings = () => {
    return {
      heroTitle: 'Bringing Authentic Traditional Taste To Your Home',
      heroDesc: 'We produce premium, pre-cooked, and vacuum-packed food items like Malabar Porotta, soft Chappathi, snow-white Pathiri, and delicate Noolputtu. Pure ingredients, pristine hygiene, ready to serve in seconds.',
      logoUrl: 'assets/logo.svg',
      brandVision: 'To be the most trusted global ambassador of traditional Indian flatbreads and delicacies, integrating convenience with natural organic goodness and authentic legacy flavors.',
      brandMission: 'To craft premium-quality, pre-cooked food products using traditional recipes and pristine hygiene standards, ensuring families can relish authentic culinary heritage within minutes.',
      purityStandards: 'We pledge zero artificial preservatives, zero food coloring, and zero MSG. Every single packet is sealed using food-grade vacuum systems that locks in natural flavor, nutrition, and moisture.',
      journeyTag: 'Brand Chronicle',
      journeyTitle: 'The Eatsee Brand Journey',
      journeyDesc: 'Experience the passion, pure standards, and culinary heritage behind every Eatsee recipe through our interactive chronicle.',
      storyMusicUrl: '',
      founderName: 'Mr. Satheeshan',
      founderTitle: 'Founder, Eatsee Food Products',
      founderQuote: 'We wanted to preserve the delicate art of making traditional flatbreads so that no family ever has to compromise on authentic taste and purity for the sake of convenience.',
      founderPhoto: '',
      founderStoryP1: 'Founded with a passionate drive to make premium, healthy, home-style traditional breads accessible, Eatsee Food Products has grown from a humble home recipe testing setup into a state-of-the-art packaging kitchen under the steering direction of Mr. Satheeshan.',
      founderStoryP2: 'Recognizing the hectic nature of modern life, our team perfected the art of pre-cooking delicate breads like flaky Porottas, paper-thin Pathiris, and steamed Noolputtus without using chemicals or artificial additives. We select only locally sourced premium flour and rice grains to produce meals that feel like they were made by your mother.',
      contactPhone: '+91 98765 43210',
      contactEmail: 'inquiry@eatseefoods.com',
      contactAddress: 'Eatsee Food Products Industrial Area, Calicut, Kerala, India',
      officeHoursWeekday: 'Monday - Saturday: 08:00 AM - 06:00 PM',
      officeHoursSunday: 'Sunday: Closed',
      salesDeskStatus: 'online',
      socialFacebook: '#',
      socialInstagram: '#',
      socialWhatsapp: '#'
    };
  };

  const applySiteSettings = (settings) => {
    if (!settings) return;
    
    // Brand & Hero
    const heroTitleEl = document.getElementById('heroTitle');
    const heroDescEl = document.getElementById('heroDesc');
    const heroMainImage = document.getElementById('heroMainImage');
    const visionDescEl = document.getElementById('visionDesc');
    const missionDescEl = document.getElementById('missionDesc');
    const standardsDescEl = document.getElementById('standardsDesc');
    
    if (heroTitleEl) {
      const formattedTitle = settings.heroTitle.replace('Traditional Taste', '<span>Traditional Taste</span>');
      heroTitleEl.innerHTML = formattedTitle;
    }
    if (heroDescEl) heroDescEl.textContent = settings.heroDesc;
    if (heroMainImage && settings.heroImageUrl) {
      heroMainImage.src = settings.heroImageUrl;
    }
    if (visionDescEl) visionDescEl.textContent = settings.brandVision;
    if (missionDescEl) missionDescEl.textContent = settings.brandMission;
    if (standardsDescEl) standardsDescEl.textContent = settings.purityStandards;

    // Brand Journey Section Header
    const journeyTagEl = document.getElementById('journeyTag');
    const journeyTitleEl = document.getElementById('journeyTitle');
    const journeyDescEl = document.getElementById('journeyDesc');

    if (journeyTagEl) journeyTagEl.textContent = settings.journeyTag || 'Brand Chronicle';
    if (journeyTitleEl) journeyTitleEl.textContent = settings.journeyTitle || 'The Eatsee Brand Journey';
    if (journeyDescEl) journeyDescEl.textContent = settings.journeyDesc || 'Experience the passion, pure standards, and culinary heritage behind every Eatsee recipe through our interactive chronicle.';

    // Story Audio setup
    const storyAudio = document.getElementById('storyAudio');
    if (storyAudio && settings.storyMusicUrl) {
      storyAudio.src = settings.storyMusicUrl;
      storyAudio.load(); // Force immediate load of the Base64/URL data
    }
    
    // Update logo URLs if present
    const logoImgs = document.querySelectorAll('.logo-img, .footer-brand-logo, .login-logo, .sidebar-logo');
    logoImgs.forEach(img => {
      img.src = settings.logoUrl || 'assets/logo.svg';
    });
    
    // Founder Details
    const founderNameEl = document.getElementById('founderName');
    const founderTitleEl = document.getElementById('founderTitle');
    const founderQuoteEl = document.getElementById('founderQuote');
    const founderStoryP1El = document.getElementById('founderStoryP1');
    const founderStoryP2El = document.getElementById('founderStoryP2');
    const storyVisualSlot = document.getElementById('storyVisualSlot');
    const founderQuoteMobile = document.getElementById('founderQuoteMobile');
    const founderQuoteMobileContainer = document.getElementById('founderQuoteMobileContainer');
    
    if (founderNameEl) founderNameEl.textContent = settings.founderName;
    if (founderTitleEl) founderTitleEl.textContent = settings.founderTitle;
    
    const cleanQuote = settings.founderQuote ? `"${settings.founderQuote.replace(/^"+|"+$/g, '')}"` : '';
    if (founderQuoteEl) founderQuoteEl.textContent = cleanQuote;
    if (founderQuoteMobile) founderQuoteMobile.textContent = cleanQuote;
    
    if (founderStoryP1El) {
      let p1 = settings.founderStoryP1 || '';
      p1 = p1.replace(/\*\*Eatsee Food Products\*\*/g, '<strong>Eatsee Food Products</strong>');
      p1 = p1.replace(/\*\*Mr\. Satheeshan\*\*/g, '<strong>Mr. Satheeshan</strong>');
      founderStoryP1El.innerHTML = p1;
    }
    if (founderStoryP2El) founderStoryP2El.textContent = settings.founderStoryP2 || '';
    
    if (storyVisualSlot) {
      if (settings.founderPhoto) {
        storyVisualSlot.innerHTML = `
          <div class="founder-photo-wrapper">
            <img src="${settings.founderPhoto}" alt="${settings.founderName}" class="founder-img">
            <div class="founder-badge"><i class="fas fa-award"></i> ${settings.founderName}</div>
          </div>
        `;
        storyVisualSlot.classList.add('story-visual', 'has-photo');
        if (founderQuoteMobileContainer) founderQuoteMobileContainer.classList.add('active');
      } else {
        storyVisualSlot.innerHTML = `
          <div class="story-quote-box">
            <div class="quote-header">
              <span class="quote-mark">“</span>
              <div class="gold-badge"><i class="fas fa-award"></i> Pioneer's Standard</div>
            </div>
            <p class="quote-body" id="founderQuote">${cleanQuote}</p>
            <div class="quote-signature">
              <div class="sig-line"></div>
              <h4 id="founderName">${settings.founderName}</h4>
              <p class="sig-title" id="founderTitle">${settings.founderTitle}</p>
            </div>
          </div>
        `;
        storyVisualSlot.classList.remove('has-photo');
        storyVisualSlot.classList.add('story-visual');
        if (founderQuoteMobileContainer) founderQuoteMobileContainer.classList.remove('active');
      }
    }
    
    // Contacts & Sales Desk
    const contactPhoneEl = document.getElementById('contactPhone');
    const contactEmailEl = document.getElementById('contactEmail');
    const contactAddressEl = document.getElementById('contactAddress');
    const footerHoursWeekdayEl = document.getElementById('footerHoursWeekday');
    const footerHoursSundayEl = document.getElementById('footerHoursSunday');
    const footerSalesStatusEl = document.getElementById('footerSalesStatus');
    
    if (contactPhoneEl) contactPhoneEl.textContent = settings.contactPhone;
    if (contactEmailEl) contactEmailEl.textContent = settings.contactEmail;
    if (contactAddressEl) contactAddressEl.textContent = settings.contactAddress;
    
    if (footerHoursWeekdayEl) {
      footerHoursWeekdayEl.innerHTML = `Monday - Saturday: <span>${settings.officeHoursWeekday.replace(/Monday\s*-\s*Saturday:\s*/gi, '')}</span>`;
    }
    if (footerHoursSundayEl) {
      footerHoursSundayEl.innerHTML = `Sunday: <span>${settings.officeHoursSunday.replace(/Sunday:\s*/gi, '')}</span>`;
    }
    
    if (footerSalesStatusEl) {
      let statusColor = '#66BB6A';
      let statusText = 'Online';
      
      if (settings.salesDeskStatus === 'offline') {
        statusColor = '#EF5350';
        statusText = 'Offline';
      } else if (settings.salesDeskStatus === 'busy') {
        statusColor = '#FFA726';
        statusText = 'Busy / Heavy Traffic';
      }
      
      footerSalesStatusEl.style.color = statusColor;
      footerSalesStatusEl.innerHTML = `<i class="fas fa-circle" style="font-size: 10px; margin-right: 4px;"></i> ${statusText}`;
    }
    
    // Social Links
    const socialFacebookEl = document.getElementById('socialFacebook');
    const socialInstagramEl = document.getElementById('socialInstagram');
    const socialWhatsappEl = document.getElementById('socialWhatsapp');
    
    if (socialFacebookEl) socialFacebookEl.href = settings.socialFacebook || '#';
    if (socialInstagramEl) socialInstagramEl.href = settings.socialInstagram || '#';
    if (socialWhatsappEl) socialWhatsappEl.href = settings.socialWhatsapp || '#';
  };

  // --- 9. Brand Journey Scrollytelling Controller ---
  const initBrandJourneyScrollytelling = () => {
    const brandJourneySection = document.getElementById('brand-journey');
    const visualCards = document.querySelectorAll('.story-visual-card');
    const contentSlides = document.querySelectorAll('.story-content-slide');
    const dots = document.querySelectorAll('.story-dot');
    const btnPrev = document.getElementById('storyBtnPrev');
    const btnNext = document.getElementById('storyBtnNext');
    const chapterTag = document.getElementById('storyChapterTag');
    const progressFill = document.getElementById('storyProgressBarFill');

    if (!brandJourneySection || !visualCards.length || !contentSlides.length) return;

    const totalSlides = visualCards.length;
    let currentSlide = -1; // Force initial update

    // Scroll handler
    const onScroll = () => {
      // If mobile view, disable scrollytelling logic as it uses natural flow
      if (window.innerWidth <= 1024) return;

      const rect = brandJourneySection.getBoundingClientRect();
      const sectionHeight = brandJourneySection.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress (0 to 1) within the #brand-journey section
      // rect.top is 0 when the top of the section hits the top of viewport
      let progress = -rect.top / (sectionHeight - windowHeight);
      
      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress));
      
      // Determine active slide index based on progress
      let activeIndex = Math.floor(progress * totalSlides);
      // Ensure the last index is chosen when progress is exactly 1
      if (activeIndex >= totalSlides) activeIndex = totalSlides - 1;

      // Update UI if slide changed
      if (activeIndex !== currentSlide) {
        currentSlide = activeIndex;

        // Update Active Slide Classes
        visualCards.forEach((card, i) => {
          if (i === activeIndex) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });

        contentSlides.forEach((slide, i) => {
          if (i === activeIndex) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        });

        // Update Dots
        dots.forEach((dot, i) => {
          if (i === activeIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });

        // Update Chapter Pagination Tag & Timeline fill
        if (chapterTag) {
          chapterTag.textContent = `CHAPTER 0${activeIndex + 1} / 0${totalSlides}`;
        }
      }
      
      // Update progress bar smoothly with scroll progress
      if (progressFill) {
        // Map progress to fill width (we want progress up to current slide plus fraction)
        progressFill.style.width = `${progress * 100}%`;
      }
    };

    // Throttle scroll event using requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Handle viewport resize transitions
    window.addEventListener('resize', onScroll);

    // Initial check
    onScroll();

    // Helper to scroll window to a specific chapter
    const scrollToChapter = (index) => {
      if (window.innerWidth <= 1024) return;
      const rect = brandJourneySection.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = brandJourneySection.offsetHeight;
      const windowHeight = window.innerHeight;
      const trackHeight = sectionHeight - windowHeight;
      
      // Target progress is the start of that chapter (e.g., 0, 0.25, 0.5, 0.75)
      // Actually, middle of the chapter feels better: (index + 0.5) / totalSlides
      const targetProgress = (index + 0.1) / totalSlides;
      const targetY = sectionTop + (trackHeight * targetProgress);
      
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    };

    // Event Listener for Dots
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        scrollToChapter(i);
      });
    });

    // Arrow Navigations
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentSlide > 0) scrollToChapter(currentSlide - 1);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) scrollToChapter(currentSlide + 1);
      });
    }
  };

  // --- Helper: Story Paragraph Tooltips ---
  const initStoryTooltips = () => {
    let tooltip = document.querySelector('.story-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'story-tooltip';
      document.body.appendChild(tooltip);
    }

    const paragraphs = document.querySelectorAll('.story-p');
    
    paragraphs.forEach(p => {
      p.addEventListener('mouseenter', (e) => {
        // Only show if text is actually truncated
        if (p.scrollHeight > p.offsetHeight || p.scrollWidth > p.offsetWidth) {
          tooltip.textContent = p.textContent;
          tooltip.classList.add('active');
        }
      });

      p.addEventListener('mousemove', (e) => {
        if (tooltip.classList.contains('active')) {
          const x = e.clientX + 20;
          const y = e.clientY + 20;
          
          // Keep tooltip within viewport
          const tooltipRect = tooltip.getBoundingClientRect();
          const winW = window.innerWidth;
          const winH = window.innerHeight;
          
          let finalX = x;
          let finalY = y;
          
          if (x + tooltipRect.width > winW) finalX = e.clientX - tooltipRect.width - 20;
          if (y + tooltipRect.height > winH) finalY = e.clientY - tooltipRect.height - 20;
          
          tooltip.style.left = `${finalX}px`;
          tooltip.style.top = `${finalY}px`;
        }
      });

      p.addEventListener('mouseleave', () => {
        tooltip.classList.remove('active');
      });
    });
  };

  // --- Helper: Story Background Music Controller ---
  const initStoryMusic = () => {
    const audio = document.getElementById('storyAudio');
    const section = document.getElementById('brand-journey');
    if (!audio || !section) return;

    audio.volume = 0;
    let fadeInterval = null;
    let isUserInteracted = false;

    // Browser policy: unlock audio on first interaction
    const unlockAudio = () => {
      if (isUserInteracted) return;
      isUserInteracted = true;
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('scroll', unlockAudio);

    const fadeVolume = (targetVolume) => {
      if (fadeInterval) clearInterval(fadeInterval);
      
      const step = 0.02; // Smaller steps for smoother transition
      const interval = 30; // Faster updates

      fadeInterval = setInterval(() => {
        let currentVol = parseFloat(audio.volume.toFixed(3));
        
        if (currentVol < targetVolume) {
          audio.volume = Math.min(targetVolume, currentVol + step);
        } else if (currentVol > targetVolume) {
          audio.volume = Math.max(targetVolume, currentVol - step);
        }

        if (parseFloat(audio.volume.toFixed(3)) === targetVolume) {
          clearInterval(fadeInterval);
          if (targetVolume === 0) {
            audio.pause();
          }
        }
      }, interval);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (audio.src) {
            audio.play().then(() => {
              fadeVolume(0.4); 
            }).catch(() => {
              // If play() fails due to policy, we'll try again when they scroll/click
              console.log('Audio playback waiting for interaction...');
            });
          }
        } else {
          fadeVolume(0);
        }
      });
    }, { 
      threshold: 0, 
      rootMargin: "100px 0px 100px 0px" // Start loading/playing slightly before it hits the viewport
    });

    observer.observe(section);
  };

  // --- 10. Fetch & Render Dynamic Brand Stories ---
  const fetchBrandStories = async () => {
    try {
      const { data: stories, error } = await supabase
        .from('brand_stories')
        .select('*')
        .order('chapter_number', { ascending: true });
        
      if (error) throw error;
      
      const visualStage = document.getElementById('storyVisualStage');
      const contentSlides = document.getElementById('storyContentSlides');
      const carouselDots = document.getElementById('storyCarouselDots');
      
      if (!visualStage || !contentSlides || !carouselDots) return;
      
      if (!stories || stories.length === 0) {
        // If no stories, hide the section entirely
        const section = document.getElementById('brand-journey');
        if (section) section.style.display = 'none';
        return;
      }
      
      let visualHTML = '';
      let contentHTML = '';
      let dotsHTML = '';
      
      stories.forEach((story, index) => {
        const isActive = index === 0 ? 'active' : '';
        const chapterNumStr = String(story.chapter_number).padStart(2, '0');
        
        // Build Visual Card
        visualHTML += `
          <div class="story-visual-card ${isActive}" data-slide="${index}">
            <div class="story-dynamic-img" style="background-image: url('${story.image_url}');"></div>
          </div>
        `;
        
        // Build Content Slide
        contentHTML += `
          <div class="story-content-slide ${isActive}" data-slide="${index}">
            <span class="story-watermark">${chapterNumStr}</span>
            <span class="story-slide-subtitle">${story.chapter_subtitle}</span>
            <h3>${story.main_heading}</h3>
            <p class="story-p">${story.paragraph_1}</p>
            ${story.paragraph_2 ? `<p class="story-p">${story.paragraph_2}</p>` : ''}
          </div>
        `;
        
        // Build Carousel Dot
        dotsHTML += `<button class="story-dot ${isActive}" data-slide="${index}">${chapterNumStr}</button>`;
      });
      
      visualStage.innerHTML = visualHTML;
      contentSlides.innerHTML = contentHTML;
      carouselDots.innerHTML = dotsHTML;
      
      // Initialize Story Tooltips for long paragraphs
      initStoryTooltips();
      
      // Re-initialize Scrollytelling Engine with the new dynamic DOM nodes
      initBrandJourneyScrollytelling();
      
    } catch (err) {
      console.error('Error fetching brand stories:', err);
    }
  };

  // --- Start Up App ---
  fetchSiteSettings();
  fetchProducts();
  fetchBrandStories();
  initStoryMusic();
});
