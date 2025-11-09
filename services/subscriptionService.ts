const SUBSCRIPTION_STATUS_KEY = 'fina_subscription_status';

export const subscriptionService = {
  isSubscribed: (): boolean => {
    return localStorage.getItem(SUBSCRIPTION_STATUS_KEY) === 'true';
  },

  subscribe: () => {
    localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'true');
  },
};
