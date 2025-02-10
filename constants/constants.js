// export const backend_url="http://192.168.125.249:3040/"

// const ip = "https://friendzy.club/"
// export const backend_url = ip + "api/"
// export const socket_url = ip

const ip = "http://192.168.0.103:"
export const backend_url = ip + "3040/"
export const socket_url = ip + "3000"

export const debounce_time = 500

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function validatePassword(password) {
    if (/\s/.test(password)) {
        return { valid: false, message: "Password should not contain spaces." };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password should contain at least one uppercase letter." };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password should contain at least one lowercase letter." };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "Password should contain at least one number." };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: "Password should contain at least one special character." };
    }
    
    return { valid: true, message: null };  // Password is strong
}