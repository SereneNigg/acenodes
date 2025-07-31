document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const sliders = document.querySelectorAll('.slider');
    const totalCostDisplay = document.getElementById('total-cost-display');
    const requestPlanBtn = document.getElementById('request-plan-btn');
    const builderUsernameInput = document.getElementById('dezerx-username-builder');
    const billingCycleRadios = document.querySelectorAll('input[name="billing-cycle"]');
    const builderModal = document.getElementById('builder-modal');
    const builderEmailBody = document.getElementById('builder-email-body');
    const builderCopyBtn = document.getElementById('builder-copy-btn');

    const requestRenewalBtn = document.getElementById('request-renewal-btn');
    const renewalUsernameInput = document.getElementById('dezerx-username-renewal');
    const serverNameInput = document.getElementById('server-name');
    const renewalModal = document.getElementById('renewal-modal');
    const renewalEmailBody = document.getElementById('renewal-email-body');
    const renewalCopyBtn = document.getElementById('renewal-copy-btn');

    const allModals = document.querySelectorAll('.modal');
    const allCloseButtons = document.querySelectorAll('.close-button');

    // --- Pricing & Discounts ---
    const pricing = { cpu: 3.5, memory: 1, storage: 0.5, extras: 0.1 };
    const discounts = { monthly: 0, quarterly: 0.05, semiannually: 0.10, annually: 0.20 };
    const cycleMonths = { monthly: 1, quarterly: 3, semiannually: 6, annually: 12 };

    // --- Core Calculation Function ---
    function calculateTotalCost() {
        const baseMonthlyCost = (parseInt(document.getElementById('cpu-vcores').value) * pricing.cpu) +
                                (parseInt(document.getElementById('memory').value) * pricing.memory) +
                                (parseInt(document.getElementById('storage').value) * pricing.storage) +
                                ((parseInt(document.getElementById('extra-database').value) + parseInt(document.getElementById('extra-backups').value) + parseInt(document.getElementById('extra-ports').value)) * pricing.extras);

        const selectedCycle = document.querySelector('input[name="billing-cycle"]:checked').value;
        const months = cycleMonths[selectedCycle];
        const discount = discounts[selectedCycle];
        
        const totalCost = (baseMonthlyCost * months) * (1 - discount);
        const cycleText = selectedCycle.charAt(0).toUpperCase() + selectedCycle.slice(1).replace('ly', '');
        
        totalCostDisplay.textContent = `$${totalCost.toFixed(2)} / ${cycleText}`;
    }

    // --- Event Listeners for Builder ---
    sliders.forEach(slider => {
        const valueSpan = document.getElementById(`${slider.id}-value`);
        if (valueSpan) {
            valueSpan.textContent = slider.value;
            slider.addEventListener('input', () => {
                valueSpan.textContent = slider.value;
                calculateTotalCost();
            });
        }
    });

    billingCycleRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.cycle-options label').forEach(label => label.classList.remove('selected'));
            document.querySelector(`label[for="${radio.id}"]`).classList.add('selected');
            calculateTotalCost();
        });
    });

    requestPlanBtn.addEventListener('click', () => {
        const username = builderUsernameInput.value.trim();
        if (!username) {
            alert('Please enter your DezerX Dashboard Username.');
            builderUsernameInput.focus();
            return;
        }

        const selectedCycle = document.querySelector('input[name="billing-cycle"]:checked').value;
        const cycleText = selectedCycle.charAt(0).toUpperCase() + selectedCycle.slice(1);

        const emailBody = `Hello,
I would like to request a custom server.

--- Account Details ---
DezerX Dashboard Username: ${username}

--- Server Specifications ---
- Billing Cycle: ${cycleText}
- CPU vCores: ${document.getElementById('cpu-vcores').value}
- Memory: ${document.getElementById('memory').value} GB
- Storage: ${document.getElementById('storage').value} GB
- Extra Databases: ${document.getElementById('extra-database').value}
- Extra Backups: ${document.getElementById('extra-backups').value}
- Extra Ports: ${document.getElementById('extra-ports').value}

-----------------------------
Total Quoted Cost: ${totalCostDisplay.textContent}`;
        
        builderEmailBody.value = emailBody;
        builderModal.style.display = 'block';
    });

    // --- Event Listeners for Renewal ---
    requestRenewalBtn.addEventListener('click', () => {
        const username = renewalUsernameInput.value.trim();
        const serverName = serverNameInput.value.trim();

        if (!username || !serverName) {
            alert('Please fill in both your username and the server name/ID.');
            return;
        }

        const emailBody = `Hello,
I would like to request a renewal for my existing server.

--- Renewal Details ---
- DezerX Dashboard Username: ${username}
- Server Name or ID to Renew: ${serverName}`;

        renewalEmailBody.value = emailBody;
        renewalModal.style.display = 'block';
    });

    // --- General Modal & Copy Logic ---
    allCloseButtons.forEach(button => button.onclick = () => allModals.forEach(modal => modal.style.display = 'none'));
    window.onclick = (event) => allModals.forEach(modal => { if (event.target == modal) modal.style.display = 'none'; });

    function setupCopyButton(button, textarea, feedbackContainer) {
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(textarea.value).then(() => {
                const feedback = feedbackContainer.querySelector('.copy-feedback');
                feedback.textContent = 'Copied!';
                feedback.style.opacity = '1';
                setTimeout(() => { feedback.style.opacity = '0'; }, 2000);
            });
        });
    }

    setupCopyButton(builderCopyBtn, builderEmailBody, builderModal);
    setupCopyButton(renewalCopyBtn, renewalEmailBody, renewalModal);
    
    // --- Initial State Setup ---
    document.querySelector('label[for="cycle-monthly"]').classList.add('selected');
    calculateTotalCost();
});