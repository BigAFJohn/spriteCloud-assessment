export const MASTER_PASSWORD = 'secret_sauce';

export const USERS = {
  STANDARD_USER: 'standard_user',
  NON_EXISTING_USER: 'fake_user',
  BLOCKED_USER: 'locked_out_user',
};

export const ERROR_MESSAGES: Record<string, string> = {
  BLOCKED_USER: 'Sorry, this user has been locked out.',
  NON_EXISTING_USER: 'Username and password do not match any user'
};

export const CHECKOUT_COMPLETE_URL = '/checkout-complete.html';
export const SUCCESS_HEADER_TEXT = 'Thank you for your order!';

