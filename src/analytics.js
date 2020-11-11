export const EVENTS = {
  FORM_SEND: 'FORM_SEND',
  FORM_SUCCESS: 'FORM_SUCCESS',
  FORM_ERROR: 'FORM_ERROR',
};

export const sendAnalyticsEvent = (eventName, eventLabel) => {
  window.gtag('event', eventName, {
    'event_category': 'contact-form',
    'event_label': eventLabel
  });
};
