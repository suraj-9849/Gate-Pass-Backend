export class EmailValidator {
  private static readonly ALLOWED_DOMAINS = ['@cmrcet.ac.in', '@gmail.com'];

  /**
   * Validates if the email has basic email format and allowed domain
   * @param email - Email string to validate
   * @throws Error if email is invalid
   */
  static validateEmail(email: string): void {
    if (!email || email.trim() === '') {
      throw new Error('Please enter your email');
    }

    // Check basic email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email');
    }

    // Check if email ends with allowed domains
    const isAllowedDomain = this.ALLOWED_DOMAINS.some((domain) =>
      email.toLowerCase().endsWith(domain.toLowerCase()),
    );

    if (!isAllowedDomain) {
      const allowedDomainsText = this.ALLOWED_DOMAINS.join(', ');
      throw new Error(`Email must end with: ${allowedDomainsText}`);
    }
  }

  /**
   * Quick check if email domain is allowed
   * @param email - Email string to check
   * @returns boolean indicating if domain is allowed
   */
  static isAllowedDomain(email: string): boolean {
    return this.ALLOWED_DOMAINS.some((domain) =>
      email.toLowerCase().endsWith(domain.toLowerCase()),
    );
  }

  /**
   * Get list of allowed domains
   * @returns Array of allowed domains
   */
  static getAllowedDomains(): string[] {
    return [...this.ALLOWED_DOMAINS];
  }
}
