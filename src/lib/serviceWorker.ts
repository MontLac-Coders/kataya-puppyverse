// Service Worker Registration for Offline Support
export function register() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || '/'}sw.js`;
      
      navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content available
                  console.log('New content is available; please refresh.');
                  // You could show a notification to the user here
                } else {
                  // Content is cached for offline use
                  console.log('Content is cached for offline use.');
                }
              }
            });
          });
        })
        .catch(error => {
          console.error('SW registration failed: ', error);
        });
    });
  }
}

export function unregister() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}

// Check if the app is installed (PWA)
export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if running in standalone mode (PWA)
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-ignore - For iOS support
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  );
}

// Check if the app can be installed
export function canInstallApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if the browser supports PWA installation
  return (
    'BeforeInstallPromptEvent' in window ||
    // For iOS Safari
    ('standalone' in navigator && !isAppInstalled())
  );
}

// Show install prompt (for browsers that support it)
let deferredPrompt: any = null;

export function setupInstallPrompt(callback: (promptEvent: any) => void) {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    console.log('PWA can be installed');
    if (callback) callback(e);
  });
  
  window.addEventListener('appinstalled', () => {
    // Log install to analytics
    console.log('PWA was installed');
    deferredPrompt = null;
  });
}

export function installApp(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!deferredPrompt) {
      resolve(false);
      return;
    }
    
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        resolve(true);
      } else {
        console.log('User dismissed the install prompt');
        resolve(false);
      }
      deferredPrompt = null;
    });
  });
}