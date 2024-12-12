// export const backend_url="http://192.168.125.249:3040/"


const backend_ip = "http://192.168.0.106:"
export const backend_url = backend_ip + "3040/"
export const debounce_time = 500
export const socket_url = backend_ip + "3000"

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));