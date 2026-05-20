/**
 * Eatsee Food Products - Administrative Control Panel Script
 * Manages secure login sessions, sidebar navigation tabs, and full CRUD operations on products and client inquiries.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Supabase Client Initialization ---
  const supabaseUrl = 'https://cyovtwebgecrvrxxvfjw.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b3Z0d2ViZ2VjcnZyeHh2Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODAxMDksImV4cCI6MjA5NDM1NjEwOX0.Ea-RqeWzAayArsyhGa9Cnrm1bHE68Rq4_D6iLSp2rJc';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  // --- Core State Variables ---
  let products = [];
  let inquiries = [];
  let stories = []; // Brand stories state
  let activeInquiryId = null;
  const sessionAuthKey = 'eatsee_admin_logged';

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

  // --- Auth & Shield DOM ---
  const loginOverlay = document.getElementById('loginOverlay');
  const loginForm = document.getElementById('loginForm');
  const loginStatus = document.getElementById('loginStatus');
  const dashboardWrapper = document.getElementById('dashboardWrapper');
  const btnLogout = document.getElementById('btnLogout');

  // --- Sidebar Navigation DOM ---
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('pageTitle');
  const inquiryBadge = document.getElementById('inquiryBadge');

  // --- Overview Dashboard DOM ---
  const statTotalProducts = document.getElementById('statTotalProducts');
  const statTotalInquiries = document.getElementById('statTotalInquiries');
  const statFeaturedProducts = document.getElementById('statFeaturedProducts');

  // Recent Inquiries List DOM
  const recentInquiriesList = document.getElementById('recentInquiriesList');
  const btnViewAllInquiries = document.getElementById('btnViewAllInquiries');

  // --- Product Catalog DOM ---
  const adminProductsList = document.getElementById('adminProductsList');
  const btnAddNewProduct = document.getElementById('btnAddNewProduct');
  const prodSearch = document.getElementById('prodSearch'); // new!

  // --- Product Editor Modal DOM ---
  const editorModal = document.getElementById('editorModal');
  const editorModalTitle = document.getElementById('editorModalTitle');
  const productForm = document.getElementById('productForm');
  const editProductId = document.getElementById('editProductId');
  
  // Product Editor Tab Elements
  const formTabBtns = document.querySelectorAll('.form-tab-btn');
  const formTabPanels = document.querySelectorAll('.form-tab-panel');
  
  // Product Form Fields
  const prodName = document.getElementById('prodName');
  const prodCategory = document.getElementById('prodCategory');
  const prodTagline = document.getElementById('prodTagline');
  const prodDesc = document.getElementById('prodDesc');
  const prodImage = document.getElementById('prodImage');
  const prodIngredients = document.getElementById('prodIngredients');
  const categoryList = document.getElementById('categoryList');

  const btnCancelEditor = document.getElementById('btnCancelEditor');
  const btnCancelEditor2 = document.getElementById('btnCancelEditor2');

  // --- Client Inquiries Inbox DOM ---
  const fullInquiriesList = document.getElementById('fullInquiriesList');
  const btnRefreshInquiries = document.getElementById('btnRefreshInquiries');
  const btnClearAllInquiries = document.getElementById('btnClearAllInquiries');
  const inqSearch = document.getElementById('inqSearch'); // new!

  // --- Inquiry Reader Modal DOM ---
  const inquiryReaderModal = document.getElementById('inquiryReaderModal');
  const readName = document.getElementById('readName');
  const readEmail = document.getElementById('readEmail');
  const readPhone = document.getElementById('readPhone');
  const readSubject = document.getElementById('readSubject');
  const readDate = document.getElementById('readDate');
  const readMessage = document.getElementById('readMessage');
  const btnCloseReader = document.getElementById('btnCloseReader');
  const btnCloseReader2 = document.getElementById('btnCloseReader2');
  const btnDeleteInquiry = document.getElementById('btnDeleteInquiry');

  // --- Site Settings DOM ---
  const settingsForm = document.getElementById('settingsForm');
  const set_heroTitle = document.getElementById('set_heroTitle');
  const set_heroDesc = document.getElementById('set_heroDesc');
  const set_heroImageFile = document.getElementById('set_heroImageFile');
  const set_heroImageUrl = document.getElementById('set_heroImageUrl');
  const heroImageStatus = document.getElementById('heroImageStatus');
  const set_visionDesc = document.getElementById('set_visionDesc');
  const set_missionDesc = document.getElementById('set_missionDesc');
  const set_standardsDesc = document.getElementById('set_standardsDesc');
  const set_journeyTag = document.getElementById('set_journeyTag');
  const set_journeyTitle = document.getElementById('set_journeyTitle');
  const set_journeyDesc = document.getElementById('set_journeyDesc');
  const set_storyMusicFile = document.getElementById('set_storyMusicFile');
  const set_storyMusicUrl = document.getElementById('set_storyMusicUrl');
  const musicStatus = document.getElementById('musicStatus');
  
  const set_founderName = document.getElementById('set_founderName');
  const set_founderTitle = document.getElementById('set_founderTitle');
  const set_founderQuote = document.getElementById('set_founderQuote');
  const set_founderPhoto = document.getElementById('set_founderPhoto');
  const set_founderStoryP1 = document.getElementById('set_founderStoryP1');
  const set_founderStoryP2 = document.getElementById('set_founderStoryP2');
  
  const set_salesStatus = document.getElementById('set_salesStatus');
  const set_contactPhone = document.getElementById('set_contactPhone');
  const set_contactEmail = document.getElementById('set_contactEmail');
  const set_contactAddress = document.getElementById('set_contactAddress');
  const set_hoursWeekdays = document.getElementById('set_hoursWeekdays');
  const set_hoursWeekends = document.getElementById('set_hoursWeekends');
  const set_socialFacebook = document.getElementById('set_socialFacebook');
  const set_socialInstagram = document.getElementById('set_socialInstagram');
  const set_socialWhatsapp = document.getElementById('set_socialWhatsapp');
  
  // Chapter Modal Form Fields
  const storyTableBody = document.getElementById('storyTableBody');
  const btnAddNewStory = document.getElementById('btnAddNewStory');
  const storyEditorModal = document.getElementById('storyEditorModal');
  const storyEditorTitle = document.getElementById('storyEditorTitle');
  const storyForm = document.getElementById('storyForm');
  const storyId = document.getElementById('storyId');
  const storySort = document.getElementById('storySort');
  const storySubtitle = document.getElementById('storySubtitle');
  const storyHeading = document.getElementById('storyHeading');
  const storyImage = document.getElementById('storyImage');
  const storyPara1 = document.getElementById('storyPara1');
  const storyPara2 = document.getElementById('storyPara2');
  const btnCancelStory = document.getElementById('btnCancelStory');
  const btnCancelStoryHeader = document.getElementById('btnCancelStoryHeader');




  // --- 1. Authentication Security Layer ---
  const checkAuthSession = () => {
    const session = sessionStorage.getItem(sessionAuthKey);
    if (session === 'true') {
      // Authenticated
      loginOverlay.classList.remove('active');
      dashboardWrapper.classList.add('active');
      initDashboard();
    } else {
      // Shield active
      loginOverlay.classList.add('active');
      dashboardWrapper.classList.remove('active');
    }
  };

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const user = document.getElementById('loginUser').value.trim();
      const pass = document.getElementById('loginPass').value.trim();

      // Simple secure match (e.g. admin / password123)
      // In Supabase mode, this will map to:
      // const { data, error } = await supabase.auth.signInWithPassword({ email: user, password: pass })
      if (user === 'admin' && pass === 'password123') {
        sessionStorage.setItem(sessionAuthKey, 'true');
        loginStatus.style.display = 'none';
        
        // Success animation transition
        loginOverlay.style.opacity = '0';
        setTimeout(() => {
          loginOverlay.classList.remove('active');
          loginOverlay.style.opacity = '1';
          dashboardWrapper.classList.add('active');
          initDashboard();
        }, 400);
      } else {
        loginStatus.textContent = 'Invalid credentials. Access Denied.';
        loginStatus.className = 'login-status error';
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('Are you sure you want to securely log out of the administration console?')) {
        sessionStorage.removeItem(sessionAuthKey);
        window.location.reload();
      }
    });
  }

  // --- 2. Sidebar Navigation Tabs ---
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      const tabTarget = link.getAttribute('data-tab');
      tabContents.forEach(tab => {
        if (tab.id === tabTarget) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      // Update Page title banner
      pageTitle.textContent = link.textContent.trim();
    });
  });

  // Redirect inbox click on overview
  if (btnViewAllInquiries) {
    btnViewAllInquiries.addEventListener('click', () => {
      const btnInq = document.getElementById('btnTabInquiries');
      if (btnInq) btnInq.click();
    });
  }

  // --- 3. Synchronization Database Management ---
  const initDashboard = async () => {
    try {
      // 1. Fetch Products from Supabase
      const { data: prods, error: prodError } = await supabase
        .from('products')
        .select('*');
        
      if (prodError) throw prodError;
      
      products = (prods || []).sort((a, b) => a.name.localeCompare(b.name));
      
      // Populate Category Datalist Suggestions
      if (categoryList) {
        const uniqueCategories = [...new Set(products.map(p => p.category_name))].sort();
        categoryList.innerHTML = uniqueCategories.map(cat => `<option value="${cat}">`).join('');
      }
    } catch (e) {
      console.warn('Error fetching products from Supabase:', e);
      products = [];
    }

    try {
      // 2. Fetch Inquiries from Supabase
      const { data: inqs, error: inqError } = await supabase
        .from('inquiries')
        .select('*');
        
      if (inqError) throw inqError;
      inquiries = inqs || [];
    } catch (e) {
      console.warn('Error fetching inquiries from Supabase:', e);
      inquiries = [];
    }

    try {
      // 3. Fetch Site Settings from Supabase
      // Using limit(1) instead of single() to avoid HTTP 406 console errors when the table is not seeded
      const { data: settingsList, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'site_content')
        .limit(1);
        
      if (settingsError) {
        throw settingsError;
      }
      
      if (settingsList && settingsList.length > 0 && settingsList[0].value) {
        populateSettingsInputs(settingsList[0].value);
      } else {
        console.log('No custom site settings found. Form will remain empty.');
        populateSettingsInputs({});
      }
    } catch (e) {
      console.warn('Error fetching settings from Supabase:', e);
      populateSettingsInputs({});
    }

    // 4. Fetch Brand Stories from Supabase
    await fetchStories();

    // 5. Render Dashboard Tables & Statistics
    refreshData();
  };

  const refreshData = () => {
    // Update Badges & Stats Widgets
    statTotalInquiries.textContent = inquiries.length;
    inquiryBadge.textContent = inquiries.length;
    
    // Update featured and category stats
    updateFeaturedAndCategoryStats();

    // Render tables (using current search values if any)
    const prodQuery = prodSearch ? prodSearch.value.trim() : '';
    const inqQuery = inqSearch ? inqSearch.value.trim() : '';

    renderOverviewRecentInquiries();
    renderProductsCatalogTable(prodQuery);
    renderFullInquiriesInboxTable(inqQuery);
  };

  const updateFeaturedAndCategoryStats = () => {
    statTotalProducts.textContent = products.length;
    
    const featuredCount = products.filter(p => p.featured).length;
    if (statFeaturedProducts) statFeaturedProducts.textContent = featuredCount;
    
    // Dynamic Category Metrics
    const categoryMetricsList = document.getElementById('categoryMetricsList');
    if (categoryMetricsList) {
      const counts = {};
      products.forEach(p => {
        counts[p.category_name] = (counts[p.category_name] || 0) + 1;
      });

      const total = products.length || 1;
      const sortedCategories = Object.keys(counts).sort();
      
      const colors = ['green', 'gold', 'sage', 'accent']; // reusable classes

      categoryMetricsList.innerHTML = sortedCategories.map((cat, index) => {
        const count = counts[cat];
        const colorClass = colors[index % colors.length];
        const percent = (count / total) * 100;
        
        return `
          <div class="metric-bar-item">
            <div class="metric-bar-info">
              <span>${cat}</span>
              <strong>${count}</strong>
            </div>
            <div class="metric-bar-track">
              <div class="metric-bar-fill ${colorClass}" style="width: ${percent}%"></div>
            </div>
          </div>
        `;
      }).join('');

      if (sortedCategories.length === 0) {
        categoryMetricsList.innerHTML = '<p style="text-align: center; color: var(--color-text-muted); padding: 20px;">No categories found yet.</p>';
      }
    }
  };

  // --- 4. Render Table Renderers ---

  // Overview Recent Inquiries
  const renderOverviewRecentInquiries = () => {
    recentInquiriesList.innerHTML = '';
    
    // Slice latest 5 items
    const sorted = [...inquiries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

    if (sorted.length === 0) {
      recentInquiriesList.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--color-text-muted);">
            No client inquiries logged yet.
          </td>
        </tr>`;
      return;
    }

    sorted.forEach(inq => {
      const row = document.createElement('tr');
      
      const subjectMap = {
        'distribution': 'Distribution',
        'wholesale': 'Wholesale',
        'feedback': 'Feedback',
        'other': 'Other'
      };
      const displaySubject = subjectMap[inq.subject] || inq.subject;

      row.innerHTML = `
        <td class="cell-bold">${inq.name}</td>
        <td><span class="tag-cat">${displaySubject}</span></td>
        <td>${formatDate(inq.timestamp).split(' ')[0]}</td>
        <td style="text-align: right;">
          <button class="btn-icon view" title="Read Inquiry" data-id="${inq.id}">
            <i class="fas fa-envelope-open"></i>
          </button>
        </td>
      `;
      
      row.querySelector('.btn-icon.view').addEventListener('click', () => {
        openInquiryReader(inq);
      });
      
      recentInquiriesList.appendChild(row);
    });
  };

  // Full Product List with live search filtering
  const renderProductsCatalogTable = (query = '') => {
    adminProductsList.innerHTML = '';
    
    let filtered = products;
    if (query) {
      const q = query.toLowerCase();
      filtered = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category_name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.packing.toLowerCase().includes(q) ||
        p.ingredients.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      adminProductsList.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--color-text-muted);">
            ${query ? 'No matching products found.' : 'No products found. Add a new product to begin.'}
          </td>
        </tr>`;
      return;
    }

    filtered.forEach(prod => {
      const row = document.createElement('tr');
      const imageUrl = hasValidImage(prod.image) ? prod.image : 'assets/logo.svg';
      row.innerHTML = `
        <td>
          <div class="thumb-frame">
            <img src="${imageUrl}" alt="${prod.name}">
          </div>
        </td>
        <td class="cell-bold">${prod.name}</td>
        <td><span class="tag-cat">${prod.category_name}</span></td>
        <td style="text-align: center;">
          <label class="switch-ios">
            <input type="checkbox" class="featured-toggle" ${prod.featured ? 'checked' : ''}>
            <span class="switch-slider"></span>
          </label>
        </td>
        <td style="text-align: right;">
          <div class="btn-action-group">
            <button class="btn-icon edit" title="Edit Specifications" data-id="${prod.id}">
              <i class="fas fa-pencil"></i>
            </button>
            <button class="btn-icon delete" title="Delete Product" data-id="${prod.id}">
              <i class="fas fa-trash-can"></i>
            </button>
          </div>
        </td>
      `;

      // Bind in-place featured toggle switch
      const toggle = row.querySelector('.featured-toggle');
      toggle.addEventListener('change', async (e) => {
        const isChecked = e.target.checked;
        try {
          const { error } = await supabase
            .from('products')
            .update({ featured: isChecked })
            .eq('id', prod.id);
            
          if (error) throw error;
          
          // Update local state
          const pIdx = products.findIndex(p => p.id === prod.id);
          if (pIdx !== -1) {
            products[pIdx].featured = isChecked;
          }
          
          showToast(`"${prod.name}" featured state updated!`, 'success');
          updateFeaturedAndCategoryStats();
        } catch (err) {
          e.target.checked = !isChecked; // revert
          showToast('Failed to update featured state: ' + err.message, 'error');
        }
      });

      // Bind standard actions
      row.querySelector('.btn-icon.edit').addEventListener('click', () => openEditorModal(prod));
      row.querySelector('.btn-icon.delete').addEventListener('click', () => deleteProduct(prod.id));

      adminProductsList.appendChild(row);
    });
  };

  // Full Client Inquiries with live search filtering
  const renderFullInquiriesInboxTable = (query = '') => {
    fullInquiriesList.innerHTML = '';
    
    let filtered = inquiries;
    if (query) {
      const q = query.toLowerCase();
      filtered = inquiries.filter(inq => 
        inq.name.toLowerCase().includes(q) || 
        inq.email.toLowerCase().includes(q) ||
        inq.phone.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      fullInquiriesList.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--color-text-muted);">
            ${query ? 'No matching inquiries found.' : 'No inquiries logged in your inbox.'}
          </td>
        </tr>`;
      return;
    }

    const sorted = [...filtered].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sorted.forEach(inq => {
      const row = document.createElement('tr');
      
      const subjectMap = {
        'distribution': 'Distribution Partnership',
        'wholesale': 'Bulk Wholesale',
        'feedback': 'Product Feedback',
        'other': 'Other Inquiry'
      };
      const displaySubject = subjectMap[inq.subject] || inq.subject;

      row.innerHTML = `
        <td>
          <div class="cell-bold">${inq.name}</div>
          <div style="font-size: 12px; color: var(--color-text-muted);">${inq.phone || 'No phone'}</div>
        </td>
        <td><span class="tag-cat">${displaySubject}</span></td>
        <td style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${inq.message}
        </td>
        <td>${formatDate(inq.timestamp)}</td>
        <td style="text-align: right;">
          <div class="btn-action-group">
            <button class="btn-icon view" title="Open Message" data-id="${inq.id}">
              <i class="fas fa-envelope-open"></i>
            </button>
            <button class="btn-icon delete" title="Delete Message" data-id="${inq.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;

      // Bind actions
      row.querySelector('.btn-icon.view').addEventListener('click', () => openInquiryReader(inq));
      row.querySelector('.btn-icon.delete').addEventListener('click', () => deleteInquiry(inq.id));

      fullInquiriesList.appendChild(row);
    });
  };

  // --- 5. Product Create / Update Management (Modal Editor) ---
  const openEditorModal = (prod = null) => {
    // Reset Form
    productForm.reset();
    
    // Select the first tab on open
    if (formTabBtns.length > 0) {
      formTabBtns[0].click();
    }
    
    if (prod) {
      // Edit Mode
      editorModalTitle.textContent = 'Edit Product Specifications';
      editProductId.value = prod.id;
      
      prodName.value = prod.name;
      prodCategory.value = prod.category_name;
      prodTagline.value = prod.tagline;
      prodDesc.value = prod.description;
      prodImage.value = prod.image;
      prodIngredients.value = prod.ingredients;
    } else {
      // Add Mode
      editorModalTitle.textContent = 'Add New Product';
      editProductId.value = '';
      prodImage.value = '';
    }

    editorModal.classList.add('active');
  };

  const closeEditorModal = () => {
    editorModal.classList.remove('active');
  };

  if (btnAddNewProduct) {
    btnAddNewProduct.addEventListener('click', () => openEditorModal());
  }

  [btnCancelEditor, btnCancelEditor2].forEach(btn => {
    if (btn) btn.addEventListener('click', closeEditorModal);
  });

  // Modal tab buttons event listeners
  formTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      formTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tabTarget = btn.getAttribute('data-form-tab');
      formTabPanels.forEach(panel => {
        if (panel.id === tabTarget) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Programmatic Validation for Multi-Tab Product Editor Form
      // Tab 1: Basic Specifications Validation (ONLY the 6 required fields requested by the user)
      const basicFields = [
        { elem: prodName, name: 'Product Name', tabId: 'btnFormTabBasic' },
        { elem: prodCategory, name: 'Category', tabId: 'btnFormTabBasic' },
        { elem: prodTagline, name: 'Short Tagline', tabId: 'btnFormTabBasic' },
        { elem: prodDesc, name: 'Detailed Description', tabId: 'btnFormTabBasic' },
        { elem: prodImage, name: 'Product Image URL / Path', tabId: 'btnFormTabBasic' },
        { elem: prodIngredients, name: 'Core Ingredients', tabId: 'btnFormTabBasic' }
      ];

      for (const field of basicFields) {
        if (!field.elem.value.trim()) {
          showToast(`"${field.name}" is a required field.`, 'error');
          // Switch to Basic Specs tab dynamically
          const tabBtn = document.getElementById(field.tabId);
          if (tabBtn) tabBtn.click();
          // Focus the missing field
          setTimeout(() => field.elem.focus(), 150);
          return;
        }
      }

      const idVal = editProductId.value;
      const categoryName = prodCategory.value.trim();

      const updatedProduct = {
        id: idVal || generateProductSlug(prodName.value),
        name: prodName.value.trim(),
        category: categoryName.toLowerCase().replace(/\s+/g, '-'), // Generate a slug for category
        category_name: categoryName,
        tagline: prodTagline.value.trim(),
        description: prodDesc.value.trim(),
        image: prodImage.value.trim(),
        ingredients: prodIngredients.value.trim(),
        featured: false, // default false
        // Database required fields with defaults
        packing: 'Standard Pack',
        storage: 'Keep refrigerated / frozen',
        nutrition: {}
      };

      // Disable submit button during save
      const submitBtn = productForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

      (async () => {
        try {
          if (idVal) {
            // UPDATE MODE
            const idx = products.findIndex(p => p.id === idVal);
            if (idx !== -1) {
              updatedProduct.featured = products[idx].featured;
              // Preserve existing values for non-editable fields if they exist
              if (products[idx].packing) updatedProduct.packing = products[idx].packing;
              if (products[idx].storage) updatedProduct.storage = products[idx].storage;
              if (products[idx].nutrition) updatedProduct.nutrition = products[idx].nutrition;
            }
            const { error } = await supabase
              .from('products')
              .update(updatedProduct)
              .eq('id', idVal);
            if (error) throw error;
            showToast(`Product "${updatedProduct.name}" updated successfully!`, 'success');
          } else {
            // CREATE MODE
            const { error } = await supabase
              .from('products')
              .insert([updatedProduct]);
            if (error) throw error;
            showToast(`Product "${updatedProduct.name}" created successfully!`, 'success');
          }

          closeEditorModal();
          await initDashboard(); // Reload live data
        } catch (err) {
          showToast('Error saving product: ' + err.message, 'error');
          console.error(err);
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      })();
    });
  }

  // --- 6. Product Delete Management ---
  const deleteProduct = async (id) => {
    const prod = products.find(p => p.id === id);
    const prodNameDisplay = prod ? prod.name : 'this product';
    
    if (confirm(`Are you absolutely sure you want to delete "${prodNameDisplay}" from your food catalog? This action cannot be undone.`)) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        showToast(`"${prodNameDisplay}" deleted successfully.`, 'success');
        await initDashboard(); // Reload live data
      } catch (err) {
        showToast('Error deleting product: ' + err.message, 'error');
        console.error(err);
      }
    }
  };

  // --- 7. Inquiries Reader Modal Desk ---
  const openInquiryReader = (inq) => {
    readName.textContent = inq.name;
    readEmail.textContent = inq.email;
    readPhone.textContent = inq.phone || 'Not Provided';
    
    const subjectMap = {
      'distribution': 'Retail Distribution Partnership',
      'wholesale': 'Wholesale Bulk Order',
      'feedback': 'Product Feedback',
      'other': 'Other Inquiry'
    };
    readSubject.textContent = subjectMap[inq.subject] || inq.subject;
    readDate.textContent = formatDate(inq.timestamp);
    readMessage.textContent = inq.message;
    
    activeInquiryId = inq.id;
    inquiryReaderModal.classList.add('active');
  };

  const closeInquiryReader = () => {
    inquiryReaderModal.classList.remove('active');
    activeInquiryId = null;
  };

  if (btnCloseReader) btnCloseReader.addEventListener('click', closeInquiryReader);
  if (btnCloseReader2) btnCloseReader2.addEventListener('click', closeInquiryReader);
  
  if (btnDeleteInquiry) {
    btnDeleteInquiry.addEventListener('click', () => {
      if (activeInquiryId) {
        deleteInquiry(activeInquiryId);
        closeInquiryReader();
      }
    });
  }

  // --- 8. Inquiry Delete Inbox Actions ---
  const deleteInquiry = async (id) => {
    if (confirm('Are you sure you want to delete this inquiry message from the desk?')) {
      try {
        const { error } = await supabase
          .from('inquiries')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        showToast('Inquiry message deleted.', 'success');
        await initDashboard(); // Reload live data
      } catch (err) {
        showToast('Error deleting inquiry: ' + err.message, 'error');
        console.error(err);
      }
    }
  };

  if (btnRefreshInquiries) {
    btnRefreshInquiries.addEventListener('click', async () => {
      const icon = btnRefreshInquiries.querySelector('i');
      icon.classList.add('fa-spin');
      await initDashboard();
      setTimeout(() => icon.classList.remove('fa-spin'), 600);
      showToast('Inquiry inbox refreshed.', 'info');
    });
  }

  if (btnClearAllInquiries) {
    btnClearAllInquiries.addEventListener('click', async () => {
      if (confirm('⚠️ WARNING: You are about to wipe out all message records from your inbox permanently. Do you wish to proceed?')) {
        try {
          const { error } = await supabase
            .from('inquiries')
            .delete()
            .neq('name', ''); // Deletes all rows where name is not empty
            
          if (error) throw error;
          showToast('Inbox cleared successfully.', 'success');
          await initDashboard(); // Reload live data
        } catch (err) {
          showToast('Error clearing inquiries: ' + err.message, 'error');
          console.error(err);
        }
      }
    });
  }

  // --- 9. Real-time Live Filters event listeners ---
  if (prodSearch) {
    prodSearch.addEventListener('input', () => {
      renderProductsCatalogTable(prodSearch.value.trim());
    });
  }

  if (inqSearch) {
    inqSearch.addEventListener('input', () => {
      renderFullInquiriesInboxTable(inqSearch.value.trim());
    });
  }

  // --- Toast Notification System ---
  const toastContainer = document.getElementById('toastContainer');
  const showToast = (message, type = 'success') => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '<i class="fas fa-check-circle"></i>';
    if (type === 'error') {
      icon = '<i class="fas fa-exclamation-circle"></i>';
    } else if (type === 'info') {
      icon = '<i class="fas fa-info-circle"></i>';
    }
    
    toast.innerHTML = `
      ${icon}
      <span class="toast-message">${message}</span>
      <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Bind close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    });
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 400);
      }
    }, 4000);
  };

  // --- Helper Formatting Functions ---
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'N/A';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour represents 12 AM
    
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const generateProductSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.floor(Math.random() * 10000);
  };

  // Close Modals on clicking outside overlays
  [editorModal, inquiryReaderModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          activeInquiryId = null;
        }
      });
    }
  });

  // --- Site Settings Sub-tabs switching ---
  const subtabBtns = document.querySelectorAll('.subtab-btn');
  const settingsPanels = document.querySelectorAll('.settings-panel');

  subtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subtabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tabTarget = btn.getAttribute('data-settings-tab');
      settingsPanels.forEach(panel => {
        if (panel.id === tabTarget) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // --- Get Default Site Settings ---
  const getDefaultSettings = () => {
    return {
      heroTitle: 'Bringing Authentic Traditional Taste To Your Home',
      heroDesc: 'We produce premium, pre-cooked, and vacuum-packed food items like Malabar Porotta, soft Chappathi, snow-white Pathiri, and delicate Noolputtu. Pure ingredients, pristine hygiene, ready to serve in seconds.',
      heroImageUrl: '',
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

  // --- Populate Settings Inputs ---
  const populateSettingsInputs = (data) => {
    if (!data) return;
    if (set_heroTitle) set_heroTitle.value = data.heroTitle || '';
    if (set_heroDesc) set_heroDesc.value = data.heroDesc || '';
    if (set_heroImageUrl) {
      set_heroImageUrl.value = data.heroImageUrl || '';
      if (heroImageStatus) {
        heroImageStatus.textContent = data.heroImageUrl ? 'Current: Custom image saved.' : 'Current: Using default system image.';
        heroImageStatus.style.color = data.heroImageUrl ? 'var(--color-success)' : 'var(--color-text-muted)';
      }
    }
    if (set_visionDesc) set_visionDesc.value = data.brandVision || '';
    if (set_missionDesc) set_missionDesc.value = data.brandMission || '';
    if (set_standardsDesc) set_standardsDesc.value = data.purityStandards || '';
    if (set_journeyTag) set_journeyTag.value = data.journeyTag || '';
    if (set_journeyTitle) set_journeyTitle.value = data.journeyTitle || '';
    if (set_journeyDesc) set_journeyDesc.value = data.journeyDesc || '';
    if (set_storyMusicUrl) {
      set_storyMusicUrl.value = data.storyMusicUrl || '';
      if (musicStatus) {
        musicStatus.textContent = data.storyMusicUrl ? 'Current: File uploaded and saved.' : 'Current: No file uploaded.';
        musicStatus.style.color = data.storyMusicUrl ? 'var(--color-success)' : 'var(--color-text-muted)';
      }
    }
    
    if (set_founderName) set_founderName.value = data.founderName || '';
    if (set_founderTitle) set_founderTitle.value = data.founderTitle || '';
    if (set_founderQuote) set_founderQuote.value = data.founderQuote || '';
    if (set_founderPhoto) set_founderPhoto.value = data.founderPhoto || '';
    if (set_founderStoryP1) set_founderStoryP1.value = data.founderStoryP1 || '';
    if (set_founderStoryP2) set_founderStoryP2.value = data.founderStoryP2 || '';
    
    if (set_contactPhone) set_contactPhone.value = data.contactPhone || '';
    if (set_contactEmail) set_contactEmail.value = data.contactEmail || '';
    if (set_contactAddress) set_contactAddress.value = data.contactAddress || '';
    if (set_hoursWeekdays) set_hoursWeekdays.value = data.officeHoursWeekday || '';
    if (set_hoursWeekends) set_hoursWeekends.value = data.officeHoursSunday || '';
    if (set_salesStatus) set_salesStatus.value = data.salesDeskStatus || 'online';
    if (set_socialFacebook) set_socialFacebook.value = data.socialFacebook || '#';
    if (set_socialInstagram) set_socialInstagram.value = data.socialInstagram || '#';
    if (set_socialWhatsapp) set_socialWhatsapp.value = data.socialWhatsapp || '#';
  };

  // --- Handle Hero Image File Upload ---
  if (set_heroImageFile) {
    set_heroImageFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        set_heroImageUrl.value = event.target.result; // Store Base64
        if (heroImageStatus) {
          heroImageStatus.textContent = `New hero image ready: ${file.name}`;
          heroImageStatus.style.color = 'var(--color-success)';
        }
        showToast('Hero image processed!', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  // --- Handle Story Music File Upload ---
  if (set_storyMusicFile) {
    set_storyMusicFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Max 5MB check
      if (file.size > 5 * 1024 * 1024) {
        showToast('Music file is too large (max 5MB). Please select a smaller file.', 'error');
        set_storyMusicFile.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        set_storyMusicUrl.value = event.target.result; // Store Base64 string
        if (musicStatus) {
          musicStatus.textContent = `New file ready: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
          musicStatus.style.color = 'var(--color-success)';
        }
        showToast('Music file processed successfully!', 'success');
      };
      reader.onerror = () => {
        showToast('Error reading music file.', 'error');
      };
      reader.readAsDataURL(file);
    });
  }

  // --- Settings Form Submit handler ---
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('btnSaveSettings');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PUSHING LIVE...';
      
      const updatedSettings = {
        heroTitle: set_heroTitle.value.trim(),
        heroDesc: set_heroDesc.value.trim(),
        heroImageUrl: set_heroImageUrl.value.trim(),
        logoUrl: 'assets/logo.svg', // logo URL field removed from UI
        brandVision: set_visionDesc.value.trim(),
        brandMission: set_missionDesc.value.trim(),
        purityStandards: set_standardsDesc.value.trim(),
        journeyTag: set_journeyTag.value.trim(),
        journeyTitle: set_journeyTitle.value.trim(),
        journeyDesc: set_journeyDesc.value.trim(),
        storyMusicUrl: set_storyMusicUrl.value.trim(),
        founderName: set_founderName.value.trim(),
        founderTitle: set_founderTitle.value.trim(),
        founderQuote: set_founderQuote.value.trim(),
        founderPhoto: set_founderPhoto.value.trim(),
        founderStoryP1: set_founderStoryP1.value.trim(),
        founderStoryP2: set_founderStoryP2.value.trim(),
        contactPhone: set_contactPhone.value.trim(),
        contactEmail: set_contactEmail.value.trim(),
        contactAddress: set_contactAddress.value.trim(),
        officeHoursWeekday: set_hoursWeekdays.value.trim(),
        officeHoursSunday: set_hoursWeekends.value.trim(),
        salesDeskStatus: set_salesStatus.value,
        socialFacebook: set_socialFacebook.value.trim(),
        socialInstagram: set_socialInstagram.value.trim(),
        socialWhatsapp: set_socialWhatsapp.value.trim()
      };
      
      try {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key: 'site_content', value: updatedSettings });
          
        if (error) throw error;
        showToast('Global website customizations pushed live!', 'success');
      } catch (err) {
        showToast('Error pushing settings live: ' + err.message, 'error');
        console.error(err);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // --- Brand Stories Controller ---
  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_stories')
        .select('*')
        .order('chapter_number', { ascending: true });
        
      if (error) throw error;
      stories = data || [];
      renderStories();
    } catch (err) {
      console.error('Error fetching stories:', err);
      showToast('Error loading brand stories', 'error');
    }
  };

  const renderStories = () => {
    if (!storyTableBody) return;
    storyTableBody.innerHTML = '';
    
    if (stories.length === 0) {
      storyTableBody.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--color-text-muted); background: var(--color-bg-warm); border-radius: var(--radius-md); border: 2px dashed var(--color-border);">
          <i class="fas fa-book-open" style="font-size: 40px; margin-bottom: 16px; opacity: 0.3;"></i>
          <p style="font-size: 15px; font-weight: 500;">No chapters found in your Brand Chronicle.</p>
          <p style="font-size: 13px; margin-top: 4px;">Click the "Add New Chapter" button to start your brand journey.</p>
        </div>`;
      return;
    }
    
    stories.forEach(story => {
      const card = document.createElement('div');
      card.className = 'chapter-card';
      
      const hasImg = hasValidImage(story.image_url);
      const bgStyle = hasImg ? `style="background-image: url('${story.image_url}');"` : '';
      
      card.innerHTML = `
        <div class="chapter-card-img" ${bgStyle}>
          <div class="chapter-number-badge">CHAPTER ${story.chapter_number}</div>
          ${!hasImg ? '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-text-muted); opacity: 0.4;"><i class="fas fa-image fa-2x"></i></div>' : ''}
        </div>
        <div class="chapter-card-content">
          <span class="chapter-card-subtitle">${story.chapter_subtitle}</span>
          <h4 class="chapter-card-title">${story.main_heading}</h4>
          <p class="chapter-card-desc">${story.paragraph_1}</p>
          
          <div class="chapter-card-actions">
            <button class="chapter-btn-icon edit" data-id="${story.id}" title="Edit Chapter">
              <i class="fas fa-pen"></i>
            </button>
            <button class="chapter-btn-icon delete" data-id="${story.id}" title="Delete Chapter">
              <i class="fas fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
      storyTableBody.appendChild(card);
    });

    document.querySelectorAll('#storyTableBody .edit').forEach(btn => {
      btn.addEventListener('click', (e) => openStoryEditor(e.currentTarget.getAttribute('data-id')));
    });

    document.querySelectorAll('#storyTableBody .delete').forEach(btn => {
      btn.addEventListener('click', (e) => deleteStory(e.currentTarget.getAttribute('data-id')));
    });
  };

  const openStoryEditor = (id = null) => {
    storyForm.reset();
    storyId.value = '';
    
    if (id) {
      const story = stories.find(s => s.id === id);
      if (story) {
        storyEditorTitle.textContent = 'Edit Chapter';
        storyId.value = story.id;
        storySort.value = story.chapter_number;
        storySubtitle.value = story.chapter_subtitle;
        storyHeading.value = story.main_heading;
        storyImage.value = story.image_url || '';
        storyPara1.value = story.paragraph_1;
        storyPara2.value = story.paragraph_2 || '';
      }
    } else {
      storyEditorTitle.textContent = 'Add New Chapter';
      storySort.value = stories.length + 1; // Default next sort number
    }
    
    storyEditorModal.classList.add('active');
  };

  const closeStoryEditor = () => {
    storyEditorModal.classList.remove('active');
  };

  if (btnAddNewStory) btnAddNewStory.addEventListener('click', () => openStoryEditor());
  if (btnCancelStory) btnCancelStory.addEventListener('click', closeStoryEditor);
  if (btnCancelStoryHeader) btnCancelStoryHeader.addEventListener('click', closeStoryEditor);

  if (storyForm) {
    storyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const payload = {
        chapter_number: parseInt(storySort.value, 10),
        chapter_subtitle: storySubtitle.value.trim(),
        main_heading: storyHeading.value.trim(),
        image_url: storyImage.value.trim(),
        paragraph_1: storyPara1.value.trim(),
        paragraph_2: storyPara2.value.trim()
      };
      
      if (!payload.chapter_number || !payload.chapter_subtitle || !payload.main_heading || !payload.paragraph_1 || !payload.image_url) {
        showToast('Please fill out all required fields (Sort, Subtitle, Heading, Image, and Paragraph 1).', 'error');
        return;
      }
      
      const id = storyId.value;
      const submitBtn = document.getElementById('btnSaveStory');
      const ogText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      
      try {
        if (id) {
          const { error } = await supabase.from('brand_stories').update(payload).eq('id', id);
          if (error) throw error;
          showToast('Story chapter updated successfully', 'success');
        } else {
          const { error } = await supabase.from('brand_stories').insert(payload);
          if (error) throw error;
          showToast('New story chapter added successfully', 'success');
        }
        closeStoryEditor();
        fetchStories();
      } catch (err) {
        console.error('Error saving story:', err);
        showToast('Error saving chapter: ' + err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = ogText;
      }
    });
  }

  const deleteStory = async (id) => {
    if (!confirm('Are you sure you want to completely delete this chapter? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('brand_stories').delete().eq('id', id);
      if (error) throw error;
      showToast('Chapter deleted successfully', 'success');
      fetchStories();
    } catch (err) {
      showToast('Error deleting chapter: ' + err.message, 'error');
    }
  };

  // --- Start Up Control System ---
  checkAuthSession();
});
