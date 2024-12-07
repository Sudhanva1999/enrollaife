export const setBadge = async (count: number): Promise<void> => {
    if ('setAppBadge' in navigator) {
      try {
        await (navigator as any).setAppBadge(count);
      } catch (error) {
        console.error('Failed to set badge:', error);
      }
    } else {
      console.warn('Badging API is not supported on this browser.');
    }
  };
  
  export const clearBadge = async (): Promise<void> => {
    if ('clearAppBadge' in navigator) {
      try {
        await (navigator as any).clearAppBadge();
      } catch (error) {
        console.error('Failed to clear badge:', error);
      }
    } else {
      console.warn('Badging API is not supported on this browser.');
    }
  };