// export const backend_url="http://192.168.125.249:3040/"

// const ip = "https://friendzy.club/"
// export const backend_url = ip + "api/"
// export const socket_url = ip

const ip = "http://192.168.0.100:"
export const backend_url = ip + "3040/"
export const socket_url = ip + "3000"

export const debounce_time = 500

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));