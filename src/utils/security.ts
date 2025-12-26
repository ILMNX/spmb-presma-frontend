/**
 * Security Utilities for Frontend
 * 
 * This module provides security-related helper functions to prevent XSS attacks
 * and ensure safe handling of user data in the frontend.
 */

/**
 * Escapes HTML special characters to prevent XSS attacks.
 * Use this function when inserting user-supplied data into HTML.
 * 
 * @param text - The text to escape
 * @returns The escaped text safe for HTML insertion
 * 
 * @example
 * const userInput = '<script>alert("xss")</script>';
 * element.innerHTML = `<span>${escapeHtml(userInput)}</span>`;
 * // Result: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
 */
export function escapeHtml(text: string | null | undefined): string {
  if (text === null || text === undefined) {
    return '';
  }
  
  const str = String(text);
  
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return str.replace(/[&<>"'`=\/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Escapes text for use in HTML attributes.
 * More strict than escapeHtml, also handles newlines and tabs.
 * 
 * @param text - The text to escape for attribute use
 * @returns The escaped text safe for HTML attribute insertion
 */
export function escapeAttr(text: string | null | undefined): string {
  if (text === null || text === undefined) {
    return '';
  }
  
  return escapeHtml(String(text))
    .replace(/\n/g, '&#10;')
    .replace(/\r/g, '&#13;')
    .replace(/\t/g, '&#9;');
}

/**
 * Sanitizes a URL to prevent javascript: and data: URL attacks.
 * 
 * @param url - The URL to sanitize
 * @returns The sanitized URL or empty string if dangerous
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  const trimmedUrl = String(url).trim().toLowerCase();
  
  // Block javascript: and data: URLs
  if (trimmedUrl.startsWith('javascript:') || 
      trimmedUrl.startsWith('data:') ||
      trimmedUrl.startsWith('vbscript:')) {
    return '';
  }
  
  return String(url);
}

/**
 * Creates a safe text node instead of using innerHTML.
 * Use this when you only need to insert text content.
 * 
 * @param element - The DOM element to set text on
 * @param text - The text content to set
 */
export function setTextContent(element: Element | null, text: string | null | undefined): void {
  if (element) {
    element.textContent = text ?? '';
  }
}

/**
 * Safely creates an element with text content.
 * 
 * @param tag - The HTML tag name
 * @param text - The text content
 * @param className - Optional CSS classes
 * @returns The created element
 */
export function createSafeElement(
  tag: string, 
  text: string, 
  className?: string
): HTMLElement {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) {
    element.className = className;
  }
  return element;
}

/**
 * Validates and sanitizes user input before sending to server.
 * Returns sanitized data and any validation errors.
 * 
 * @param data - The form data to validate
 * @param rules - Validation rules
 * @returns Object with sanitized data and errors array
 */
export function validateInput(
  data: Record<string, any>,
  rules: Record<string, { required?: boolean; maxLength?: number; pattern?: RegExp; sanitize?: boolean }>
): { sanitized: Record<string, any>; errors: string[] } {
  const errors: string[] = [];
  const sanitized: Record<string, any> = {};
  
  for (const [field, value] of Object.entries(data)) {
    const rule = rules[field];
    
    if (!rule) {
      sanitized[field] = value;
      continue;
    }
    
    // Required check
    if (rule.required && (!value || String(value).trim() === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    let processedValue = value;
    
    // Sanitize if requested (strip HTML tags)
    if (rule.sanitize && typeof value === 'string') {
      processedValue = value.replace(/<[^>]*>/g, '');
    }
    
    // Max length check
    if (rule.maxLength && typeof processedValue === 'string' && processedValue.length > rule.maxLength) {
      errors.push(`${field} exceeds maximum length of ${rule.maxLength}`);
    }
    
    // Pattern check
    if (rule.pattern && typeof processedValue === 'string' && !rule.pattern.test(processedValue)) {
      errors.push(`${field} format is invalid`);
    }
    
    sanitized[field] = processedValue;
  }
  
  return { sanitized, errors };
}

// Export a default object for convenience
export default {
  escapeHtml,
  escapeAttr,
  sanitizeUrl,
  setTextContent,
  createSafeElement,
  validateInput
};
