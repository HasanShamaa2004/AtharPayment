/**
 * توليد معرف فريد
 * يُستخدم لتعريف كل وسيلة دفع بشكل فريد
 */
export const generateId = () =>
  'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8);
