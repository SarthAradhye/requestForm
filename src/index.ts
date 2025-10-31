type QuotationData = {
    userName: string,
    businessName: string,
    mobileNumber: string,
    email: string,
    requirement: string,
    sector:string,
    time: string,
}

const requestQuotationForm = document.getElementById("requestQuotation") as HTMLFormElement;

requestQuotationForm?.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    const userName = getInputValue("user_name");
    const businessName = getInputValue("business_name");
    const mobileNumber = getInputValue("mobile_number");
    const email = getInputValue("email_address");
    const requirement = getInputValue("requirement");
    const sector = getInputValue("sector");
    const time = getInputValue("time");

    const quotationData = { userName, businessName, mobileNumber, email, requirement,sector, time }

    const formValidationResult = validateForm(quotationData);
    if (!formValidationResult.success) {
        alert(formValidationResult.error)
        return;
    }
    updateButtonState("requestQuotation-submit-btn", "Submitting...", true);

    try {
        const response = await fetch("https://aradhyetech-api.onrender.com/api/contact/quotationRequest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify(quotationData)
        })
        if (response.ok) {
            alert("Form submitted successfully")
            requestQuotationForm.reset();
        } else {
            alert("Failed to submit data");
        }
    } catch {
        alert("Failed to submit data");
    } finally {
        updateButtonState("requestQuotation-submit-btn", "Submit", false);
    }
})

function getInputValue(id: string): string {
    return (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null)?.value ?? "";
}

function validateForm(quotationData: QuotationData): { success: true } | { success: false, error: string } {
    const userNameLength = quotationData.userName.trim().length;
    if (userNameLength < 2 || userNameLength > 100) {
        const errorMessage = "Please enter your full name (2–100 characters).";
        return { success: false, error: errorMessage };
    }

    const businessNameLength = quotationData.businessName.trim().length;
    if (businessNameLength < 2 || businessNameLength > 100) {
        const errorMessage = "Please enter a valid business name (2–100 characters).";
        return { success: false, error: errorMessage };
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(quotationData.mobileNumber)) {
        const errorMessage = "Please enter a valid 10 digits mobile number.";
        return { success: false, error: errorMessage };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(quotationData.email)) {
        const errorMessage = "Please enter a valid email address.";
        return { success: false, error: errorMessage };
    }

    const selectedRequirement = quotationData.requirement;
    if (!selectedRequirement || selectedRequirement.trim().length < 3) {
        const errorMessage = "Please select or enter your requirement.";
        return { success: false, error: errorMessage };
    }

    const sectorLength = quotationData.sector.trim().length;
    if (sectorLength < 2 || sectorLength > 100) {
        const errorMessage = "Please enter a valid sector (2–100 characters).";
        return { success: false, error: errorMessage };
    }

    if (!quotationData.time) {
        const errorMessage = "Please select your preferred time frame.";
        return { success: false, error: errorMessage };
    }
    return { success: true };
}

function updateButtonState(
    buttonId: string,
    label: string,
    isDisabled: boolean
){
    const button = document.getElementById(buttonId) as HTMLButtonElement | null;
    if (button) {
        button.textContent = label;
        button.setAttribute("aria-disabled", isDisabled.toString());
        button.disabled = isDisabled;
    }
}
