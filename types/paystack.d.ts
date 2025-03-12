// paystack.d.ts

declare global {
    interface Window {
      PaystackPop: any; // Declaring PaystackPop globally so TypeScript knows about it
    }
  }
  
  export {}; // Ensure the file is treated as a module
  