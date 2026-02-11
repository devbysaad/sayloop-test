// clerk-theme.ts
export const clerkAppearance = {
    elements: {
        rootBox: "mx-auto",
        card: "bg-transparent shadow-none",
        
        headerTitle: "hidden",
        headerSubtitle: "hidden",
        
        socialButtonsBlockButton: 
            "bg-white border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-700 font-semibold rounded-2xl py-3 transition-all duration-300 shadow-sm hover:shadow-md",
        
        socialButtonsBlockButtonText: "font-semibold text-base",
        
        dividerLine: "bg-gray-300",
        dividerText: "text-gray-500 font-medium",
        
        formButtonPrimary: 
            "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-b-4 border-green-700 active:border-b-0 active:translate-y-1",
        
        formFieldInput: 
            "rounded-xl border-2 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 px-4 py-3 text-base transition-all",
        
        formFieldLabel: "text-gray-700 font-semibold text-sm mb-2",
        
        footerActionLink: "text-green-600 hover:text-green-700 font-semibold hover:underline",
        
        identityPreviewText: "font-semibold text-gray-800",
        identityPreviewEditButton: "text-green-600 hover:text-green-700",
        
        formFieldInputShowPasswordButton: "text-gray-600 hover:text-green-600",
        
        formFieldAction: "text-green-600 hover:text-green-700 font-medium",
        
        alert: "bg-red-50 border-2 border-red-200 text-red-700 rounded-xl p-4",
        alertText: "text-sm font-medium",
        
        formResendCodeLink: "text-green-600 hover:text-green-700 font-semibold",
        
        otpCodeFieldInput: 
            "border-2 border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 rounded-xl text-xl font-bold text-center",
    },
    
    layout: {
        socialButtonsPlacement: "top",
        socialButtonsVariant: "blockButton",
        privacyPageUrl: "/privacy",
        termsPageUrl: "/terms",
    },
};