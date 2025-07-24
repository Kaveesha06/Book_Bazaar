class ProfileManager {
    constructor() {
        this.isEditing = false;
        this.originalData = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserData();
        this.initTabs();
    }

    bindEvents() {
        // Edit profile button
        const editBtn = document.getElementById('editProfileBtn');
        editBtn.addEventListener('click', () => this.toggleEdit());

        // Save and cancel buttons
        const saveBtn = document.getElementById('saveBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        
        saveBtn.addEventListener('click', () => this.saveChanges());
        cancelBtn.addEventListener('click', () => this.cancelEdit());

        // Tab navigation
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Form inputs - add change detection
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.onInputChange());
        });

        // Settings toggles
        const toggles = document.querySelectorAll('.switch input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', () => this.onSettingChange(toggle));
        });

        // Action buttons
        this.bindActionButtons();
    }

    loadUserData() {
        // Load user data from localStorage or use default
        const userData = this.getUserData();
        
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('joinDate').textContent = userData.joinDate;
        
        // Populate form fields
        document.getElementById('fullName').value = userData.name;
        document.getElementById('email').value = userData.email;
        document.getElementById('phone').value = userData.phone;
        document.getElementById('street').value = userData.address.street;
        document.getElementById('city').value = userData.address.city;
        document.getElementById('state').value = userData.address.state;
        document.getElementById('zip').value = userData.address.zip;
        document.getElementById('country').value = userData.address.country;
    }

    getUserData() {
        // Get user data from localStorage or return default
        const defaultData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            joinDate: 'January 2023',
            address: {
                street: '123 Main Street',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'United States'
            }
        };

        const stored = localStorage.getItem('bookbazaar_user_profile');
        return stored ? JSON.parse(stored) : defaultData;
    }

    saveUserData(data) {
        localStorage.setItem('bookbazaar_user_profile', JSON.stringify(data));
    }

    toggleEdit() {
        if (this.isEditing) {
            this.cancelEdit();
        } else {
            this.startEdit();
        }
    }

    startEdit() {
        this.isEditing = true;
        
        // Store original data for cancel functionality
        this.originalData = this.getUserData();
        
        // Enable form inputs
        const inputs = document.querySelectorAll('#profile-tab input[readonly]');
        inputs.forEach(input => {
            input.removeAttribute('readonly');
            input.classList.add('editing');
        });

        // Update edit button
        const editBtn = document.getElementById('editProfileBtn');
        editBtn.innerHTML = '<i class="fas fa-times"></i><span>Cancel</span>';
        editBtn.classList.add('cancel-mode');

        // Show save section
        document.getElementById('saveSection').style.display = 'flex';

        // Add editing class to content card for styling
        document.querySelector('#profile-tab .content-card').classList.add('editing-mode');

        this.showNotification('Edit mode enabled', 'info');
    }

    cancelEdit() {
        this.isEditing = false;
        
        // Restore original data
        this.loadUserData();
        
        // Disable form inputs
        const inputs = document.querySelectorAll('#profile-tab input');
        inputs.forEach(input => {
            input.setAttribute('readonly', 'readonly');
            input.classList.remove('editing');
        });

        // Update edit button
        const editBtn = document.getElementById('editProfileBtn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i><span>Edit Profile</span>';
        editBtn.classList.remove('cancel-mode');

        // Hide save section
        document.getElementById('saveSection').style.display = 'none';

        // Remove editing class
        document.querySelector('#profile-tab .content-card').classList.remove('editing-mode');

        this.showNotification('Changes cancelled', 'warning');
    }

    saveChanges() {
        // Collect form data
        const formData = {
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            joinDate: this.originalData.joinDate, // Keep original join date
            address: {
                street: document.getElementById('street').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value,
                country: document.getElementById('country').value
            }
        };

        // Validate data
        if (!this.validateFormData(formData)) {
            return;
        }

        // Save to localStorage
        this.saveUserData(formData);

        // Update header display
        document.getElementById('userName').textContent = formData.name;
        document.getElementById('userEmail').textContent = formData.email;

        // Exit edit mode
        this.isEditing = false;
        
        // Disable form inputs
        const inputs = document.querySelectorAll('#profile-tab input');
        inputs.forEach(input => {
            input.setAttribute('readonly', 'readonly');
            input.classList.remove('editing');
        });

        // Update edit button
        const editBtn = document.getElementById('editProfileBtn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i><span>Edit Profile</span>';
        editBtn.classList.remove('cancel-mode');

        // Hide save section
        document.getElementById('saveSection').style.display = 'none';

        // Remove editing class
        document.querySelector('#profile-tab .content-card').classList.remove('editing-mode');

        this.showNotification('Profile updated successfully!', 'success');
    }

    validateFormData(data) {
        // Basic validation
        if (!data.name.trim()) {
            this.showNotification('Name is required', 'error');
            return false;
        }

        if (!data.email.trim() || !this.isValidEmail(data.email)) {
            this.showNotification('Valid email is required', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    onInputChange() {
        // Add visual indication that changes are unsaved
        if (this.isEditing) {
            const saveBtn = document.getElementById('saveBtn');
            saveBtn.classList.add('has-changes');
        }
    }

    initTabs() {
        // Set initial active tab
        this.switchTab('profile');
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // If switching away from profile tab while editing, prompt user
        if (this.isEditing && tabName !== 'profile') {
            if (confirm('You have unsaved changes. Do you want to discard them?')) {
                this.cancelEdit();
            } else {
                // Revert to profile tab
                setTimeout(() => {
                    this.switchTab('profile');
                }, 100);
                return;
            }
        }

        // Add animation effect
        const activeContent = document.getElementById(`${tabName}-tab`);
        activeContent.style.transform = 'translateY(10px)';
        activeContent.style.opacity = '0';
        
        setTimeout(() => {
            activeContent.style.transform = 'translateY(0)';
            activeContent.style.opacity = '1';
        }, 50);
    }

    onSettingChange(toggle) {
        const settingName = toggle.closest('.setting-item').querySelector('span').textContent;
        const isEnabled = toggle.checked;
        
        // Save setting to localStorage
        const settings = JSON.parse(localStorage.getItem('bookbazaar_settings') || '{}');
        settings[settingName] = isEnabled;
        localStorage.setItem('bookbazaar_settings', JSON.stringify(settings));

        this.showNotification(
            `${settingName} ${isEnabled ? 'enabled' : 'disabled'}`, 
            'info'
        );
    }

    bindActionButtons() {
        // Change Password button
        const changePasswordBtn = document.querySelector('.action-btn.primary');
        changePasswordBtn.addEventListener('click', () => {
            this.showNotification('Change password feature coming soon!', 'info');
        });

        // Logout button
        const logoutBtn = document.querySelector('.action-btn.danger');
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                this.logout();
            }
        });

        // Discover Books button
        const discoverBtn = document.querySelector('.discover-btn');
        if (discoverBtn) {
            discoverBtn.addEventListener('click', () => {
                this.showNotification('Redirecting to book catalog...', 'info');
                // In a real app, this would redirect to the main page
            });
        }
    }

    logout() {
        // Clear user data
        localStorage.removeItem('bookbazaar_user_profile');
        localStorage.removeItem('bookbazaar_settings');
        localStorage.removeItem('bookbazaar_cart');
        localStorage.removeItem('bookbazaar_wishlist');
        
        this.showNotification('Logged out successfully', 'success');
        
        // In a real app, redirect to login page
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            transform: translateX(400px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
            info: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
        };
        return colors[type] || colors.info;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Avatar hover effect
    const avatar = document.getElementById('userAvatar');
    avatar.addEventListener('mouseenter', () => {
        avatar.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    avatar.addEventListener('mouseleave', () => {
        avatar.style.transform = 'scale(1) rotate(0deg)';
    });

    // Add loading states to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                const originalText = this.innerHTML;
                
                // Add loading spinner
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                // Remove loading state after 1 second
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = originalText;
                }, 1000);
            }
        });
    });

    // Add parallax effect to header background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const headerBg = document.querySelector('.header-background');
        if (headerBg) {
            headerBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .loading {
            pointer-events: none;
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
});