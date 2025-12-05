export function success(data) {
  return { success: true, data };
}

export function error(message) {
  return { success: false, message };
}
